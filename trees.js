const dataarbol = {
  name: "root",
  children: [
    {
      name: "branch1",
      children: [
        {name: "leaf1", type: "A"},
        {name: "leaf2", type: "B"},
      ],
    },
    {
      name: "branch2",
      children: [
        {
          name: "subbranch1",
          children: [
            {name: "leaf3", type: "A"},
            {name: "leaf4", type: "B"},
          ],
        },
        {name: "leaf5", type: "A"},
        {name: "leaf6", type: "B"},
      ],
    },
  ],
};

const tree = document.getElementById("tree");

// Función para crear un nodo del árbol
function createNode(name, type) {
  const node = document.createElement("div");
  node.classList.add("node");
  node.draggable = true;
  node.dataset.type = type || "";
  const label = document.createElement("span");
  label.textContent = name;
  label.contentEditable = true;
  label.addEventListener("input", () => {
    node.dataset.name = label.textContent;
    updateJSON();
  });
  node.appendChild(label);
  const button = document.createElement("button");
  button.textContent = "+";
  button.addEventListener("click", () => {
    addNode(node);
    updateJSON();
  });
  node.appendChild(button);
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "x";
  deleteButton.addEventListener("click", () => {
    node.parentNode.removeChild(node);
    updateJSON();
  });
  node.appendChild(deleteButton);
  return node;
}

// Función para crear una rama del árbol
function createBranch(nodedataarbol) {
  const branch = document.createElement("div");
  branch.classList.add("branch");
  for (const child of nodedataarbol.children) {
    const childNode = createNode(child.name, child.type);
    if (child.children) {
      const childBranch = createBranch(child);
      childNode.appendChild(childBranch);
    }
    branch.appendChild(childNode);
  }
  return branch;
}

// Función para agregar un nodo al árbol
function addNode(parentNode) {
  const newNode = createNode("New Node");
  parentNode.appendChild(newNode);
  updateJSON();
}

// Función para actualizar el archivo JSON original
function updateJSON() {
  const root = tree.firstChild;
  const updateddataarbol = {
    name: root.dataset.name,
    children: [],
  };
  const nodes = root.querySelectorAll(".node");
  for (const node of nodes) {
    const name = node.dataset.name;
    const type = node.dataset.type;
    const parentNode = node.parentNode.parentNode;
    const parentName = parentNode.dataset.name;
    const parentChildren =
      parentNode.classList.contains("branch") &&
      parentNode.querySelector(".node")
        ? getChildren(parentNode)
        : null;
    const nodedataarbol = {
      name: name,
      type: type,
    };
    if (parentName && parentChildren) {
      nodedataarbol.parent = {
        name: parentName,
        children: parentChildren,
      };
    }
    updateddataarbol.children.push(nodedataarbol);
  }
  console.log(updateddataarbol);
}

// Función para obtener los hijos de un nodo padre
function getChildren(parentNode) {
  const children = [];
  const nodes = parentNode.querySelectorAll(".node");
  for (const node of nodes) {
    const name = node.dataset.name;
    const type = node.dataset.type;
    const nodedataarbol = {
      name: name,
      type: type,
    };
    if (node.classList.contains("branch")) {
      const childNodes = node.querySelectorAll(".node");
      const childdataarbol = [];
      for (const childNode of childNodes) {
        const childName = childNode.dataset.name;
        const childType = childNode.dataset.type;
        const child = {
          name: childName,
          type: childType,
        };
        if (childNode.classList.contains("branch")) {
          child.children = getChildren(childNode);
        }
        childdataarbol.push(child);
      }
      nodedataarbol.children = childdataarbol;
    }
    children.push(nodedataarbol);
  }
  return children;
}

// Crear el árbol
const root = createNode(dataarbol.name);
const branch1 = createNode(dataarbol.children[0].name);
const leaf1 = createNode(dataarbol.children[0].children[0].name, dataarbol.children[0].children[0].type);
const leaf2 = createNode(dataarbol.children[0].children[1].name, dataarbol.children[0].children[1].type);
branch1.appendChild(leaf1);
branch1.appendChild(leaf2);
const branch2 = createNode(dataarbol.children[1].name);
const subbranch1 = createNode(dataarbol.children[1].children[0].name);
const leaf3 = createNode(dataarbol.children[1].children[0].children[0].name, dataarbol.children[1].children[0].children[0].type);
const leaf4 = createNode(dataarbol.children[1].children[0].children[1].name, dataarbol.children[1].children[0].children[1].type);
subbranch1.appendChild(leaf3);
subbranch1.appendChild(leaf4);
branch2.appendChild(subbranch1);
const leaf5 = createNode(dataarbol.children[1].children[1].name, dataarbol.children[1].children[1].type);
const leaf6 = createNode(dataarbol.children[1].children[2].name, dataarbol.children[1].children[2].type);
branch2.appendChild(leaf5);
branch2.appendChild(leaf6);
root.appendChild(branch1);
root.appendChild(branch2);
tree.appendChild(root);

// Agregar un listener al árbol para arrastrar y soltar nodos
let draggedNode = null;
tree.addEventListener("dragstart", (event) => {
  draggedNode = event.target;
  event.dataarbolTransfer.effectAllowed = "move";
});
tree.addEventListener("dragover", (event) => {
  event.preventDefault();
  event.dataarbolTransfer.dropEffect = "move";
});
tree.addEventListener("drop", (event) => {
  event.preventDefault();
  if (event.target.classList.contains("node") || event.target.classList.contains("branch")) {
    const targetNode = event.target;
    const targetParent = targetNode.parentNode;
    const sourceNode = draggedNode;
    const sourceParent = sourceNode.parentNode;
    if (sourceParent === targetParent) {
      const targetIndex = Array.from(targetParent.children).indexOf(targetNode);
      const sourceIndex = Array.from(sourceParent.children).indexOf(sourceNode);
      if (targetIndex > sourceIndex) {
        targetParent.insertBefore(sourceNode, targetNode);
      } else {
        targetParent.insertBefore(sourceNode, targetNode.nextSibling);
      }
    } else {
      targetNode.appendChild(sourceNode);
    }
    updateJSON();
  }
});

// Función para crear un nodo del árbol
function createNode(name, type) {
  const node = document.createElement("div");
  node.classList.add("node");
  node.draggable = true;
  node.dataset.type = type || "";
  const label = document.createElement("span");
  label.textContent = name;
  label.contentEditable = true;
  label.addEventListener("input", () => {
    node.dataset.name = label.textContent;
    updateJSON();
  });
  node.appendChild(label);
  const button = document.createElement("button");
  button.textContent = "+";
  button.addEventListener("click", () => {
    addNode(node);
    updateJSON();
  });
  node.appendChild(button);
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "x";
  deleteButton.addEventListener("click", () => {
    node.parentNode.removeChild(node);
    updateJSON();
  });
  node.appendChild(deleteButton);
  return node;
}

// Función para crear una rama del árbol
function createBranch(nodedataarbol) {
  const branch = document.createElement("div");
  branch.classList.add("branch");
  for (const child of nodedataarbol.children) {
    const childNode = createNode(child.name, child.type);
    if (child.children) {
      const childBranch = createBranch(child);
      childNode.appendChild(childBranch);
    }
    branch.appendChild(childNode);
  }
  return branch;
}

// Función para agregar un nodo al árbol
function addNode(parentNode) {
  const newNode = createNode("New Node");
  parentNode.appendChild(newNode);
  updateJSON();
}

// Función para actualizar el archivo JSON original
function updateJSON() {
  const root = tree.firstChild;
  const updateddataarbol = {
    name: root.dataset.name,
    children: [],
  };
  const nodes = root.querySelectorAll(".node");
  for (const node of nodes) {
    const name = node.dataset.name;
    const type = node.dataset.type;
    const parentNode = node.parentNode.parentNode;
    const parentName = parentNode.dataset.name;
    const parentChildren =
      parentNode.classList.contains("branch") &&
      parentNode.querySelector(".node")
        ? getChildren(parentNode)
        : null;
    const nodedataarbol = {
      name: name,
      type: type,
    };
    if (parentName && parentChildren) {
      nodedataarbol.parent = {
        name: parentName,
        children: parentChildren,
      };
    }
    updateddataarbol.children.push(nodedataarbol);
  }
  console.log(updateddataarbol);
}

// Función para obtener los hijos de un nodo padre
function getChildren(parentNode) {
  const children = [];
  const nodes = parentNode.querySelectorAll(".node");
  for (const node of nodes) {
    const name = node.dataset.name;
    const type = node.dataset.type;
    const nodedataarbol = {
      name: name,
      type: type,
    };
    if (node.classList.contains("branch")) {
      const childNodes = node.querySelectorAll(".node");
      const childdataarbol = [];
      for (const childNode of childNodes) {
        const childName = childNode.dataset.name;
        const childType = childNode.dataset.type;
        const child = {
          name: childName,
          type: childType,
        };
        if (childNode.classList.contains("branch")) {
          child.children = getChildren(childNode);
        }
        childdataarbol.push(child);
      }
      nodedataarbol.children = childdataarbol;
    }
    children.push(nodedataarbol);
  }
  return children;
}

class HtmlTree {
  static HtmlTreeNode = class {
    constructor(name, type, parent, container) {
      this.name = name;
      this.type = type;
      this.parent = parent;
      this.container = container;
    }
  };

  static #demoData = [
    {name: "container-1", type: "container", description: "container description"},
    {name: "category-1", type: "category", parent: "container-1"},
    {name: "grid-1", type: "grid", parent: "category-1"},
    {name: "chart-1", type: "chart", parent: "category-1"},
    {name: "container-2", type: "container"},
    {name: "category-2", type: "category", parent: "container-2"},
    {name: "category-3", type: "category", parent: "container-2"},
    {name: "grid-2", type: "grid", parent: "category-2"},
    {name: "chart-2", type: "chart", parent: "category-2"},
    {name: "grid-3", type: "grid", parent: "category-3"},
  ];

  constructor(data = HtmlTree.#demoData, htmlElement = document.body) {
    if (data) {
      this.data = data;
      this.tree = this.#toTree(this.data);
      this.child = htmlElement;
      this.child.innerHTML = '';
      this.child.appendChild(this.#toHtml(this.tree));
    } else {
      this.data = [];
    }
  }

  reBuild() {
    this.tree = this.#toTree(this.data);
    this.child.innerHTML = '';
    this.child.appendChild(this.#toHtml(this.tree));
  }

  #toTree(data, pid = undefined) {
    return data.reduce((r, e) => {
      if (pid === e.parent) {
        const obj = {...e};
        const children = this.#toTree(data, e.name);
        if (children.length) obj.children = children;
        r.push(obj);
      }
      return r;
    }, []);
  }

  #toHtml(data, parentId = "") {
    const ul = document.createElement("ul");

    data.forEach((e) => {
      const li = document.createElement("li");
      li.id = `${parentId}-${e.name}`;
      const text = document.createElement("span");
      const button = document.createElement("button");
      if (e.children) {
        button.textContent = "+";
        li.appendChild(button);
      }
      text.textContent = e.name;
      li.appendChild(text);
      if (e.children) {
        const children = this.#toHtml(e.children, li.id);
        children.classList.add("hide");
        li.appendChild(children);
        button.addEventListener("click", () => {
          button.textContent = button.textContent === "+" ? "-" : "+";
          const childrenElem = document.getElementById(`${li.id}-children`);
          childrenElem.classList.toggle("hide");
        });
      }
      ul.appendChild(li);
    });

    const ulElem = document.createElement("ul");
    ulElem.id = `${parentId}-children`;
    ulElem.classList.add("hide"); // Se agrega la clase "hide"
    ulElem.appendChild(ul);

    return ulElem;
  }

  #createTable(data) {
    if (data.length === 0) return "";
    let htmlCode = "<table border=1>";
    htmlCode += "<thead>";
    for (let fieldKey in data[0]) {
      htmlCode += "<th>";
      htmlCode += fieldKey.toString().bold();
      htmlCode += "</th>";
    }
    htmlCode += "</thead>";
    htmlCode += "<tbody>";
    data.forEach((record) => {
      htmlCode += "<tr>";
      for (let fieldKey in record) {
        htmlCode += "<td>";
        htmlCode += record[fieldKey];
        htmlCode += "</td>";
      }
      htmlCode += "</tr>";
    });
    htmlCode += "</tbody>";
    htmlCode += "</table>";
    return htmlCode;
  }
}

/*
    The job: nocesito que encapsules los miembros que están antes de la clase
    HtmlTree en una nueva clase DOMTree, a fin de que el resultado sea superior
    en calidad a ambas soluciones, es decir, que tenga ramas colapsables, y que
    se puedan arrastrar o editar en dependencia de una propiedad: "editable",
    también puedes incorporarle las optimizaciones y animaciones que consideres.
*/
