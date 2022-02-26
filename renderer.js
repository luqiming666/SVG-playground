// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

// https://www.runoob.com/svg/svg-tutorial.html
// Colors: https://www.w3school.com.cn/cssref/css_colors.asp

console.log('renderer.js starts...')

///////////////////////////////////////////////////////////////////////////////
// This is important!
// Hook the mousemove event on the root container, and route it the sub-element
//  which is being dragged, in case that the sub-element may lose tracking of
//  the mousemove event.
function mousemoveForSvgContainer(e) {
  if (theCircleHelper.isDragging()) {
    theCircleHelper.mousemove(e)
  }
  if (theB3P1Helper.isDragging()) {
    theB3P1Helper.mousemove(e)
  }
  if (theB3P2Helper.isDragging()) {
    theB3P2Helper.mousemove(e)
  }
  if (theB2PointHelper.isDragging()) {
    theB2PointHelper.mousemove(e)
  }
}
let svgRoot = document.getElementById("svg-root")
svgRoot.addEventListener("mousemove", mousemoveForSvgContainer)
///////////////////////////////////////////////////////////////////////////////

class PointerMoveHelper {
  constructor(nodeTag) {
    this.mousePos = {x:0, y:0}
    this.offsetX = 0
    this.offsetY = 0
    this.dragging = false
    this.thePointer = document.getElementById(nodeTag)
  }

  mousedown(e) {
    e.preventDefault()
    this.mousePos.x = e.clientX - this.offsetX
    this.mousePos.y = e.clientY - this.offsetY
    this.dragging = true
  }
  mouseup(e) {
    this.dragging = false
  }
  mousemove(e) {
    if (this.dragging) {
      e.preventDefault()
      this.offsetX = e.clientX - this.mousePos.x
      this.offsetY = e.clientY - this.mousePos.y
      this.thePointer.style.transform = `translate(${this.offsetX}px, ${this.offsetY}px)`
    }
  }
  isDragging() {
    return this.dragging
  }
}

function mousedownForCircle(e) {
  theCircleHelper.mousedown(e)
}
function mouseupForCircle(e) {
  theCircleHelper.mouseup(e)
}
function mousemoveForCircle(e) {
  theCircleHelper.mousemove(e)
}

let theCircle = document.getElementById("s-circle")
let theCircleHelper = new PointerMoveHelper("s-circle")
theCircle.addEventListener("mousedown", mousedownForCircle)
theCircle.addEventListener("mousemove", mousemoveForCircle)
theCircle.addEventListener("mouseup", mouseupForCircle)


////////////////////////////////////////////////////////////////////////////////////////
class BezierController {
  constructor() {
    this.order = 0;
    this.startPoint = [0, 0];
    this.endPoint   = [1, 1];
  }

  setOrder(order) { //  2: square; 3: cubic
    this.order = order;
  }
  setStartPoint(x, y) {
    this.startPoint = [x, y];
  }
  setEndPoint(x, y) {
    this.endPoint = [x, y];
  }
  setControlPoint1(x, y) {
    this.controlPoint1 = [x, y];
  }
  setControlPoint2(x, y) {
    this.controlPoint2 = [x, y];
  }

  getCoord(t) {
    if (t > 1 || t < 0) return;

    if (this.order === 2) {
      const _t = 1 - t;
      const coefficient0 = Math.pow(_t, 2);
      const coefficient1 = 2 * t * _t;
      const coefficient2 = Math.pow(t, 2);
      const px = coefficient0 * this.startPoint[0] + coefficient1 * this.controlPoint1[0] + coefficient2 * this.endPoint[0];
      const py = coefficient0 * this.startPoint[1] + coefficient1 * this.controlPoint1[1] + coefficient2 * this.endPoint[1];
      return [parseFloat(px.toFixed(3)), parseFloat(py.toFixed(3))];
    } else if (this.order === 3) {
      const _t = 1 - t;
      const coefficient0 = Math.pow(_t, 3);
      const coefficient1 = 3 * t * Math.pow(_t, 2);
      const coefficient2 = 3 * _t * Math.pow(t, 2);
      const coefficient3 = Math.pow(t, 3);
      const px = coefficient0 * this.startPoint[0] + coefficient1 * this.controlPoint1[0] + coefficient2 * this.controlPoint2[0] + coefficient3 * this.endPoint[0];
      const py = coefficient0 * this.startPoint[1] + coefficient1 * this.controlPoint1[1] + coefficient2 * this.controlPoint2[1] + coefficient3 * this.endPoint[1];
      return [parseFloat(px.toFixed(3)), parseFloat(py.toFixed(3))];
    }
  }

  makeSVGPath(pointCnt) {
    let step = 1.0/pointCnt;
    let pathStr = 'M' + this.startPoint[0] + ' ' + this.startPoint[1];
    for (let i = 0; i < pointCnt; i++) {
      const [x, y] = this.getCoord(i * step);
      pathStr += ' L' + x + ' ' + y;
    }
    pathStr = pathStr + ' L' + this.endPoint[0] + ' ' + this.endPoint[1];
    return pathStr;
  }
}

// Test 1 - cubic bezier curve
let bezierMgr = new BezierController()
bezierMgr.setOrder(3)
bezierMgr.setStartPoint(300, 250)
bezierMgr.setEndPoint(450, 150)
bezierMgr.setControlPoint1(350, 80)
bezierMgr.setControlPoint2(400, 100)

const pointCnt = 50; // the precision of the curve
document.getElementById("s-bezier3").setAttribute('d', bezierMgr.makeSVGPath(pointCnt))

// Reply to the dragging of the 1st point
function mousedownForB3p1(e) {
  theB3P1Helper.mousedown(e)
}
function mouseupForB3p1(e) {
  theB3P1Helper.mouseup(e)
}
function mousemoveForB3p1(e) {
  theB3P1Helper.mousemove(e)

  if (theB3P1Helper.isDragging()) {
    bezierMgr.setControlPoint1(e.clientX, e.clientY)
    document.getElementById("s-bezier3").setAttribute('d', bezierMgr.makeSVGPath(pointCnt))
  }
}

let theB3Point1= document.getElementById("s-b3-point1")
let theB3P1Helper = new PointerMoveHelper("s-b3-point1")
theB3Point1.addEventListener("mousedown", mousedownForB3p1)
theB3Point1.addEventListener("mousemove", mousemoveForB3p1)
theB3Point1.addEventListener("mouseup", mouseupForB3p1)


// Reply to the dragging of the 2nd point
function mousedownForB3p2(e) {
  theB3P2Helper.mousedown(e)
}
function mouseupForB3p2(e) {
  theB3P2Helper.mouseup(e)
}
function mousemoveForB3p2(e) {
  theB3P2Helper.mousemove(e)

  if (theB3P2Helper.isDragging()) {
    bezierMgr.setControlPoint2(e.clientX, e.clientY)
    document.getElementById("s-bezier3").setAttribute('d', bezierMgr.makeSVGPath(pointCnt))
  }
}

let theB3Point2= document.getElementById("s-b3-point2")
let theB3P2Helper = new PointerMoveHelper("s-b3-point2")
theB3Point2.addEventListener("mousedown", mousedownForB3p2)
theB3Point2.addEventListener("mousemove", mousemoveForB3p2)
theB3Point2.addEventListener("mouseup", mouseupForB3p2)


// Test 2 - square bezier curve
let bezierMgr2 = new BezierController()
bezierMgr2.setOrder(2)
bezierMgr2.setStartPoint(450, 150)
bezierMgr2.setEndPoint(600, 50)
bezierMgr2.setControlPoint1(500, 200)

const pointCnt2 = 50; // the precision of the curve
document.getElementById("s-bezier2").setAttribute('d', bezierMgr2.makeSVGPath(pointCnt2))

// Reply to the dragging of the controlling point
function mousedownForB2p(e) {
  theB2PointHelper.mousedown(e)
}
function mouseupForB2p(e) {
  theB2PointHelper.mouseup(e)
}
function mousemoveForB2p(e) {
  theB2PointHelper.mousemove(e)

  if (theB2PointHelper.isDragging()) {
    bezierMgr2.setControlPoint1(e.clientX, e.clientY)
    document.getElementById("s-bezier2").setAttribute('d', bezierMgr2.makeSVGPath(pointCnt2))
  }
}

let theB2Point = document.getElementById("s-b2-point")
let theB2PointHelper = new PointerMoveHelper("s-b2-point")
theB2Point.addEventListener("mousedown", mousedownForB2p)
theB2Point.addEventListener("mousemove", mousemoveForB2p)
theB2Point.addEventListener("mouseup", mouseupForB2p)
