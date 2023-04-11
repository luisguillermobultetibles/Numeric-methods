import {WebSystemObject} from './WebSystemObject';

// Based on... imagine dragoons.
class Dragon extends WebSystemObject {
  target;
  activeVariableName;
  activeEvent;
  /**
   * Multiplier applied between the mouse movement and viewport movement
   * @type {Number}
   */
  MULTIPLIER = 1;
  origin = {};
  #isDragging = false;

  constructor(target = window, dragstart, dragenter, dragover, drop, end, variableName = 'Data', multiplier = 1) {
    super();
    this.target = target;
    this.activeVariableName = variableName;
    this.MULTIPLIER = multiplier;
    this.#isDragging = false;
    this.#updateOrigin(-1, -1);
    this.target.addEventListener('dragstart', dragstart ? dragstart : this.begin, false);
    this.target.addEventListener('dragenter', dragenter ? dragenter : this.enter, false);
    this.target.addEventListener('dragover', dragover ? dragover : this.over, false);
    this.target.addEventListener('drop', drop ? drop : this.drop, false);
    this.target.addEventListener('dragend', drop ? drop : this.end, false);
  }


  free() {
    if (this.target) {
      this.target.removeEventListener('dragstart', this.begin, false);
      this.target.removeEventListener('dragenter', this.enter, false);
      this.target.removeEventListener('dragover', this.over, false);
      this.target.removeEventListener('drop', this.drop, false);
      this.target.removeEventListener('dragend', this.end, false);
    }
  }

  get activeVariable() {
    return this._activeVariable;
  }

  set activeVariable(v) {
    this._activeVariable = v;
  }

  // Piskelated
  #updateOrigin(x, y) {
    this.origin = this.origin || {};
    this.origin.x = x;
    this.origin.y = y;
  }

  // Piskelated
  #calculateOffset(x, y) {
    // var coords = this.drawingController.getSpriteCoordinates(x, y);
    // var currentOffset = this.drawingController.getOffset();

    const currentOffset = this.origin;  // then... remove this line

    var offset = {
      x: currentOffset.x - this.MULTIPLIER * (coords.x - this.origin.x),
      y: currentOffset.y - this.MULTIPLIER * (coords.y - this.origin.y),
    };

    return offset;
  };

  // Piskelated
  #updateDrag(x, y) {
    // var currentOffset = this.drawingController.getOffset();
    const currentOffset = this.origin;  // then... remove this line
    var offset = this.#calculateOffset(x, y);
    if (currentOffset.y !== offset.y || currentOffset.x !== offset.x) {
      this.#isDragging = true;
      // this.drawingController.setOffset(offset.x, offset.y);

      // retrieve the updated coordinates after moving the sprite
      // and store them as the new drag origin
      // var coords = this.drawingController.getSpriteCoordinates(x, y)

      const coords = this.origin;  // then... remove this line

      this.#updateOrigin(coords.x, coords.y);
    }
  };

  // __

  get data() {
    return this.activeEvent.dataTransfer.getData(this.data[this.activeVariableName]);
  }

  set data(value) {
    this.activeEvent.dataTransfer.setData(this.data[this.activeVariableName], value);
  }

  clearData(variable = this.activeVariableName) {
    e.preventDefault();
    this.activeEvent.dataTransfer.clearData(variable);
  }

  enter() {
    e.preventDefault();
    return true;
  }

  // https://developer.mozilla.org/en-us/docs/web/api/datatransfer/effectallowed
  begin(e) {
    this.activeEvent = e;
    e.dataTransfer.effectAllowed = 'move'; // of "none" | "copy" | "copyLink" | "copyMove" | "link" | "linkMove" | "move" | "all" | "uninitialized"
    this.data = e.target.getAttribute('id');
    e.dataTransfer.setDragImage(e.target, 0, 0);
    e.stopPropagation();
    this.#isDragging = true;
    return true;
  }

  over(e) {
    this.activeEvent = e;
    let draggable = this.data;
    let id = e.target.getAttribute('id');
    // Por ejemplo:
    if (id === 'idProhibido') {
      return false;
    }
    e.stopPropagation();
    return draggable && true;
  }

  drop(e) {
    this.activeEvent = e;
    let draggable = this.data;
    e.target.appendChild(document.getElementById(draggable));
    e.stopPropagation();
    return false;
  }

  end(e) {
    this.activeEvent = e;
    this.#isDragging = false;
    this.clearData();
    return true;
  }

  isDragging() {
    return this.#isDragging;
  };


}
