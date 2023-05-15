import numeric from 'numeric';

class MechanicalSystem {
  constructor() {
    this.nodes = new Map();
    this.arcs = [];
    this.constraints = [];
    this.tools = [];
    this.grasps = [];
    this.pins = [];
  }

  addNode(id, position, mass) {
    this.nodes.set(id, {
      position,
      mass,
      forces: numeric.rep([3], 0),
      velocity: numeric.rep([3], 0),
    });
  }

  addArc(id, from, to, length, stiffness, type) {
    this.arcs.push({id, from, to, length, stiffness, type});
  }

  addConstraint(id, nodeId, type, value, stiffness = Infinity) {
    this.constraints.push(new Constraint(id, this.nodes.get(nodeId), type, value, stiffness));
  }

  addTool(id, nodeId, position, normal, length, width, retractable, rotationAngle, normalPosition) {
    this.tools.push({
      id,
      nodeId,
      position,
      normal,
      length,
      width,
      retractable,
      rotationAngle,
      normalPosition,
    });
  }

  addGrasp(id, nodeId, position, length, stiffness) {
    this.grasps.push({
      id,
      nodeId,
      position,
      length,
      stiffness,
      isGrasping: false,
    });
  }

  addPin(id, nodeId, position, length, stiffness) {
    this.pins.push({id, nodeId, position, length, stiffness});
  }

  getDirection(from, to) {
    const direction = numeric.sub(to, from);
    const length = numeric.norm2(direction);
    if (length === 0) {
      return numeric.rep([3], 0);
    } else {
      return numeric.div(direction, length);
    }
  }

  getTractionForce(direction, length, stiffness, fromForces, toForces) {
    const deformation = length - numeric.norm2(direction);
    const forceMagnitude = deformation * stiffness;
    const force = numeric.mul(direction, forceMagnitude);
    fromForces = numeric.add(fromForces, force);
    toForces = numeric.sub(toForces, force);
    return [fromForces, toForces, force];
  }

  getCompressionForce(direction, length, stiffness, fromForces, toForces) {
    const deformation = numeric.norm2(direction) - length;
    const forceMagnitude = deformation * stiffness;
    const force = numeric.mul(direction, forceMagnitude);
    fromForces = numeric.add(fromForces, force);
    toForces = numeric.sub(toForces, force);
    return [fromForces, toForces, force];
  }

  getMoment(force, direction, from, to) {
    const momentArm = numeric.sub(numeric.add(from, numeric.mul(direction, numeric.norm2(numeric.sub(to, from)) / 2)), force);
    return numeric.cross(momentArm, force);
  }

  calculateForces() {
    for (const node of this.nodes.values()) {
      node.forces = numeric.rep([3], 0);
    }

    for (const arc of this.arcs) {
      const fromNode = this.nodes.get(arc.from);
      const toNode = this.nodes.get(arc.to);
      const direction = this.getDirection(fromNode.position, toNode.position);

      let fromForces = numeric.clone(fromNode.forces);
      let toForces = numeric.clone(toNode.forces);

      if (arc.type === 'rod') {
        const [f, t, force] = this.getTractionForce(direction, arc.length, arc.stiffness, fromForces, toForces);
        fromForces = f;
        toForces = t;
        const moment = this.getMoment(force, direction, fromNode.position, toNode.position);
        fromNode.forces = numeric.add(fromNode.forces, force);
        toNode.forces = numeric.sub(toNode.forces, force);
        fromNode.forces = numeric.add(fromNode.forces, moment);
        toNode.forces = numeric.sub(toNode.forces, moment);
      } else if (arc.type === 'spring') {
        const [f, t, force] = this.getCompressionForce(direction, arc.length, arc.stiffness, fromForces, toForces);
        fromForces = f;
        toForces = t;
        fromNode.forces = numeric.add(fromNode.forces, force);
        toNode.forces = numeric.sub(toNode.forces, force);
      }
    }

    for (const constraint of this.constraints) {
      constraint.apply();
    }

    for (const grasp of this.grasps) {
      const node = this.nodes.get(grasp.nodeId);
      const position = numeric.add(node.position, grasp.position);
      const direction = this.getDirection(position, position);
      const [f, t, force] = this.getTractionForce(direction, grasp.length, grasp.stiffness, node.forces, node.forces);
      node.forces = f;
      grasp.isGrasping = numeric.norm2(force) > 0;
    }

    for (const pin of this.pins) {
      const node = this.nodes.get(pin.nodeId);
      const position = numeric.add(node.position, pin.position);
      const direction = this.getDirection(position, position);
      const [f, t, force] = this.getTractionForce(direction, pin.length, pin.stiffness, node.forces, node.forces);
      node.forces = f;
    }

    for (const tool of this.tools) {
      const node = this.nodes.get(tool.nodeId);
      const position = numeric.add(node.position, tool.position);
      let normal = tool.normal;
      if (tool.retractable) {
        const normalPosition = numeric.add(node.position, tool.normalPosition);
        const distance = numeric.norm2(numeric.sub(position, normalPosition));
        if (distance > tool.width) {
          normal = numeric.mul(normal, -1);
        }
      }
      const rotationAngle = tool.rotationAngle;
      const rotationMatrix = numeric.dot(numeric.transpose([numeric.cos(rotationAngle), 0, numeric.sin(rotationAngle)]), [
        [0, 1, 0],
        [-1, 0, 0],
        [0, 0, 1],
      ]);
      normal = numeric.dot(rotationMatrix, normal);
      const direction = numeric.cross(normal, [0, 0, 1]);
      const [f, t, force] = this.getTractionForce(direction, tool.length, Infinity, node.forces, node.forces);
      node.forces = f;
    }
  }

  update(dt) {
    for (const node of this.nodes.values()) {
      const acceleration = numeric.div(node.forces, node.mass);
      node.velocity = numeric.add(node.velocity, numeric.mul(acceleration, dt));
      node.position = numeric.add(node.position, numeric.mul(node.velocity, dt));
    }
  }
}

class Constraint {
  constructor(id, node, type, value, stiffness) {
    this.id = id;
    this.node = node;
    this.type = type;
    this.value = value;
    this.stiffness = stiffness;
  }

  apply() {
    if (this.type === 'position') {
      const displacement = numeric.sub(this.node.position, this.value);
      const forceMagnitude = numeric.norm2(displacement) * this.stiffness;
      const force = numeric.mul(numeric.div(displacement, numeric.norm2(displacement)), forceMagnitude);
      this.node.forces = numeric.sub(this.node.forces, force);
    } else if (this.type === 'velocity') {
      const velocity = this.node.velocity;
      const forceMagnitude = numeric.norm2(velocity) * this.stiffness;
      const force = numeric.mul(numeric.div(velocity, numeric.norm2(velocity)), forceMagnitude);
      this.node.forces = numeric.sub(this.node.forces, force);
    }
  }
}


class RetractableArm extends MechanicalSystem {
  constructor(lake1, hinge1, hinge2, lake2, length, stiffness) {
    super();
    this.addNode(lake1, [0, 0, 0], Infinity);
    this.addNode(hinge1, [0, 0, length / 2], Infinity);
    this.addNode(hinge2, [0, 0, -length / 2], Infinity);
    this.addNode(lake2, [0, 0, -length], Infinity);
    this.addArc('arc1', lake1, hinge1, length / 2, stiffness, 'rod');
    this.addArc('arc2', hinge1, hinge2, length, stiffness, 'rod');
    this.addArc('arc3', hinge2, lake2, length / 2, stiffness, 'rod');
    this.addTool('tool1', hinge1, [0, 0, -length / 2], [0, 0, 1], length, 0, true, 0, [0, 0, length / 2]);
    this.addTool('tool2', hinge2, [0, 0, length / 2], [0, 0, 1], length, 0, false, 0, [0, 0, -length / 2]);
  }

  extend() {
    this.tools[0].retractable = true;
  }

  retract() {
    this.tools[0].retractable = false;
  }

  rotate(angle) {
    this.tools[0].rotationAngle = angle;
  }
}

class Head extends MechanicalSystem {
  constructor(id, position, axis, range, mass) {
    super();
    this.addNode(id, position, mass);
    this.axis = axis;
    this.range = range;
  }

  rotate(angle) {
    const rotation = numeric.dot(numeric.rotationMatrix(this.axis, angle), this.nodes[0].position);
    this.nodes[0].position = rotation;
  }
}

class Hinge extends MechanicalSystem {
  constructor(id, position, axis, length, stiffness) {
    super();
    this.addNode(`${id}_1`, numeric.add(position, numeric.mul([0, 0, length / 2], axis)), Infinity);
    this.addNode(`${id}_2`, numeric.add(position, numeric.mul([0, 0, -length / 2], axis)), Infinity);
    this.addArc(`${id}_arc1`, `${id}_1`, `${id}_2`, length, stiffness, 'rod');
  }

  rotate(angle) {
    const center = numeric.div(numeric.add(this.nodes[0].position, this.nodes[1].position), 2);
    const rotation1 = numeric.add(numeric.dot(numeric.rotationMatrix(this.arcVectors[0], angle), numeric.sub(this.nodes[0].position, center)), center);
    const rotation2 = numeric.add(numeric.dot(numeric.rotationMatrix(this.arcVectors[0], angle), numeric.sub(this.nodes[1].position, center)), center);
    this.nodes[0].position = rotation1;
    this.nodes[1].position = rotation2;
  }
}

class Clamp extends MechanicalSystem {
  constructor(id, position, axis, length, stiffness) {
    super();
    this.addNode(`${id}_1`, numeric.add(position, numeric.mul([0, 0, length / 2], axis)), Infinity);
    this.addNode(`${id}_2`, numeric.add(position, numeric.mul([0, 0, -length / 2], axis)), Infinity);
    this.addArc(`${id}_arc1`, `${id}_1`, `${id}_2`, length, stiffness, 'rod');
  }
}

