import { generateGuid, getElementsDimensions, getScroll } from "./helper";
import domService from "./dom";

class Grid {
  constructor() {
    this.mountEl = null;
    this.level = 0;
    this.isGridOn = false;
    this.initiailized = false;
    this.mainId = "1EEE9BB1_3609_8616_1F61_E8986CD17E83";
    this.grids = [];
    this.focusedEl = null ;
  }
  get mountIdSyle() {
    const [x, y] = getScroll();
    return `display:grid; grid-template-columns: auto auto auto auto; top: ${y}px; left: ${x}px; width: 100%;height: 100%; z-index: 543454; position: absolute; background: transparent;`;
  }
  gridCss(level) {
    const fontSize = 4 - level;
    return `color: #09131b;display: flex;justify-content: center;align-items: center;border: 2px solid black;font-size: ${fontSize}em;box-shadow: 0 8px 6px -6px black;`;
  }
  initiailizeGrid() {
    if (domService.inIframe() || this.initiailized) return;
    const el = document.createElement("div");
    this.mountEl = el;
    el.id = this.mainId;
    el.style = this.mountIdSyle;
    document.body.appendChild(el);
    this.initiailized = true;
    this.isGridOn = true;
  }
  unInitiailizeGrid() {
    if (domService.inIframe()) return;
    const gridMountEl = document.getElementById(this.mainId);
    document.removeChild(gridMountEl);
    this.initiailized = false;
    this.isGridOn = false;
  }
  createGrid(m, n, index = -1) {
    if (domService.inIframe()) return;
    this.level = this.level + 1;
    if (index != -1) {
      const indexEl = document.getElementById(this.grids[index - 1]);
      const { top, left, width, height } = getElementsDimensions(indexEl);
      this.mountEl.style.left = `${left}px`;
      this.mountEl.style.top = `${top}px`;
      this.mountEl.style.width = `${width}px`;
      this.mountEl.style.height = `${height}px`;
    }
    const randomId = generateGuid();
    const divCss = this.gridCss(this.level);
    const spanCss =
      "margin: 0px;padding: 0px;border: solid 1px #555;background-color: #eed;-moz-box-shadow: 10px -10px rgba(0,0,0,0.6);-webkit-box-shadow: -1px 0px rgb(0 0 0 / 60%);-o-box-shadow: 10px -10px rgba(0,0,0,0.6);border-radius: 18rem;";
    let grid = "";
    let k = 1;
    const ids = [];
    for (let i = 0; i < m; i++) {
      let row = "";
      for (let j = 0; j < n; j++) {
        const id = `${randomId}_${k}`;
        ids.push(id);
        row += `<div id="${id}" data="${k}" style="${divCss}"> <span style="${spanCss}">${k}</span> </div>`;
        k++;
      }
      grid += row;
    }
    this.mountEl.innerHTML = grid;
    this.grids = ids;
    return ids;
  }
  deleteGrid() {
    if (!this.initiailized || domService.inIframe()) return;
    this.grids = [];
    document.body.removeChild(this.mountEl);
    this.mountEl = null;
    this.initiailized = false;
    this.isGridOn = false;
    this.level = 0;
    this.focusedEl = null;
  }
  click(n, options) {
    const { dom, ackId } = options;
    if (n > 0 && n < 17) {
      const el = document.getElementById(this.grids[n - 1]);
      const { left, top, width, height } = getElementsDimensions(el);
      const locY = Math.floor(top + height / 2);
      const locX = Math.floor(left + width / 2);
      this.mountEl.style.display = "none";
      this.deleteGrid();
      setTimeout(() => {
        const el = document.elementFromPoint(locX, locY);
        el?.click();
        el?.focus();
        setTimeout(() => {
          dom.simulateWordTyping("\n\r", ackId);
          dom.simulateWordTyping("\n", ackId);
          const activeElement = dom.findFocusedElem(document, ackId);
          dom.keypress([13, false, false, false], activeElement);
          const ke = new KeyboardEvent("keydown", {
            bubbles: true,
            cancelable: true,
            keyCode: 13
          });
          activeElement.dispatchEvent(ke);
        }, 0);
      }, 20);
    }
  }
}
const gridService = new Grid();
export default gridService;
