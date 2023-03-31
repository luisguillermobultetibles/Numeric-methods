import {WebSystemObject} from './WebSystemObject';

// Based on... imagine dragoons.
class DragonDrop extends WebSystemObject {
  target;
  activeVariableName;
  activeEvent;

  constructor(target = window, dragstart, dragenter, dragover, drop, end, variableName = 'Data') {
    super();
    this.target = target;
    this.activeVariableName = variableName;
    this.target.addEventListener('dragstart', dragstart ? dragstart : this.begin, false);
    this.target.addEventListener('dragenter', dragenter ? dragenter : this.enter, false);
    this.target.addEventListener('dragover', dragover ? dragover : this.over, false);
    this.target.addEventListener('drop', drop ? drop : this.drop, false);
    this.target.addEventListener('dragend', drop ? drop : this.end, false);
  }

  // Implementa una función de call back con lo que vas hacer, haz la tuya, así...

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

  // __

  get data() {
    return this.activeEvent.dataTransfer.getData(this.data[this.activeVariableName]);
  }

  set data(value) {
    this.activeEvent.dataTransfer.setData(this.data[this.activeVariableName], value);
  }

  clearData(variable = this.activeVariableName) {
    this.activeEvent.dataTransfer.clearData(variable);
  }

  // .

  enter() {
    return true;
  }

  // https://developer.mozilla.org/en-us/docs/web/api/datatransfer/effectallowed
  begin(e) {
    this.activeEvent = e;
    e.dataTransfer.effectAllowed = 'move'; // of "none" | "copy" | "copyLink" | "copyMove" | "link" | "linkMove" | "move" | "all" | "uninitialized"
    this.data = e.target.getAttribute('id');
    e.dataTransfer.setDragImage(e.target, 0, 0);
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
    this.clearData();
    return true;
  }


}