import * as canvasTools from './modules/canvas tools.js';
import * as bezier from './modules/bezier.js';
import * as curveAnim from './modules/curveAnim.js'

function main() {
	const canvas = document.getElementById('scene')
	if (canvas.getContext) {
		let yPadding = 140
		let xPadding = 300
		const ctx = canvas.getContext('2d')
		ctx.canvas.width = window.screen.width - xPadding
		ctx.canvas.height = window.screen.height - yPadding
		// ctx.imageSmoothingEnabled = false
		// ctx.translate(0.5, 0.5)


		let mouseCoordsGlobal
		let prevPos, currentPos = {}
		let stroke = []
		var strokeInterval
		let mousePressed = false

		function getMousePosition(mouseEvent) {
			let pos = {}
			pos.x = mouseEvent.x - canvas.offsetLeft;
			pos.y = mouseEvent.y - canvas.offsetTop;
			return pos
		}

		function mouseDraw(mouseEvent, prevPosition, position) {
			// mouse left button must be pressed
			if (mouseEvent.buttons !== 1) { return; };

			ctx.beginPath(); // begin
			ctx.lineWidth = 5;
			ctx.lineCap = 'round';
			ctx.strokeStyle = 'skyblue'
			ctx.moveTo(prevPosition.x, prevPosition.y); // from
			ctx.lineTo(position.x, position.y); // to
			ctx.stroke()
			ctx.closePath()
		}

		function divideStroke(stroke, parts) {
			let points = []
			let startPoint = stroke[0]
			points.push({x: (t) => startPoint[0], y: (t) => startPoint[1]})
			for (let i = 1; i < stroke.length - 1; i += Math.ceil((stroke.length - 2) / parts)) {
				console.log(stroke[i])
				points.push({x: (t) => stroke[i][0], y: (t) => stroke[i][1]})
			}
			let endPoint = stroke[stroke.length-1]
			points.push({x: (t) => endPoint[0], y: (t) => endPoint[1]})
			return points
		}

		function pushPointIntoStroke(stroke, coords) {
			stroke.push(canvasTools.createPoint(coords[0], coords[1]))
		}

		canvas.addEventListener('mousedown', (event) => {
			mousePressed = true
		})

		canvas.addEventListener('mousemove', (event) => {
			let mouseCoords = canvasTools.createPoint(event.x - canvas.offsetLeft, event.y - canvas.offsetTop)
			mouseCoordsGlobal = mouseCoords
			currentPos = getMousePosition(event)
			mouseDraw(event, prevPos, currentPos)
			prevPos = getMousePosition(event)
			if (mousePressed) {
				// console.log(mouseCoords)
				pushPointIntoStroke(stroke, mouseCoords)
			}
		})

		canvas.addEventListener('mouseup', (event) => {
			clearInterval(strokeInterval)
			// canvasTools.paintBackground(ctx, '#353347', ctx.canvas.width, ctx.canvas.height)
			console.log("stroke", stroke)
			let points = divideStroke(stroke,50)
			console.log(points)
			let bezierSplinePoints = bezier.getBezierSpline(points, 12)
			console.log(bezierSplinePoints)
			bezier.drawBezierPointsOnCanvas(ctx, bezierSplinePoints, 100)
			mousePressed = false
			stroke = []
			points = []
			bezierSplinePoints = []
		})


		//assuming each coordinate i.e x, y is a function of t. because the we need p1.x to be a funciton else we'll have an exception
		let p1 = canvasTools.createPointObject((t) => 100, (t) => 100)
		let p2 = canvasTools.createPointObject((t) => 150, (t) => 200)
		let p3 = canvasTools.createPointObject((t) => 310, (t) => 330)
		let p4 = canvasTools.createPointObject((t) => 400, (t) => 400)
		let p5 = canvasTools.createPointObject((t) => 500, (t) => 500)
		let p6 = canvasTools.createPointObject((t) => 600, (t) => 600)
		let p7 = canvasTools.createPointObject((t) => 700, (t) => 700)
		let p8 = canvasTools.createPointObject((t) => 840, (t) => 800)
		let p9 = canvasTools.createPointObject((t) => 100, (t) => 600)
		let p10 = canvasTools.createPointObject((t) => 100, (t) => 400)


		let controlPoints = [p1, p2, p3, p4, p5, p6, p7, p8, p9, p10]
		let bezierPoint = bezier.getBezierPoint(controlPoints)
		let bezierSplinePoints = bezier.getBezierSpline(controlPoints, 3)


		// bezier.drawBezierPointOnCanvas(ctx, bezierPoint, 100)
		bezier.drawBezierPointsOnCanvas(ctx, bezierSplinePoints, 100)
		bezier.drawControlPoints(ctx, controlPoints)

		let pen1 = curveAnim.createPen(ctx, 'blue', 2, 3)
		// pen1.traceCurve((x) => Math.sin(x), -3, 3, 0.1, canvasTools.createPoint(400, 400), 50)
		let curvePoints = bezier.getCurvePointsFromBezierPoint(bezierSplinePoints, 100)
		pen1.tracePoints(curvePoints)

		// let pen2 = curveAnim.createPen(ctx,'red', 2, 3)
		// let curvePoints2 = bezier.getCurvePointsFromBezierPoint([bezierPoint], 100)
		// pen2.tracePoints(curvePoints2)
		bezier.drawBezierPointsOnCanvas(ctx, bezierSplinePoints, 100)
		bezier.drawControlPoints(ctx, controlPoints)
		
		function animationLoop() {
			// canvasTools.paintBackground(ctx, '#353347', ctx.canvas.width, ctx.canvas.height)
			pen1.update()
			// 		pen2.update()
			pen1.write()
			// 		pen2.write()
			// if (mouseCoordsGlobal) {
			// 	canvasTools.setCanvasFont(ctx, { font: 'Fira Mono', color: 'black', size: '10' })
			// 	ctx.fillText(`x:${mouseCoordsGlobal[0]}, y:${mouseCoordsGlobal[1]}`, mouseCoordsGlobal[0], mouseCoordsGlobal[1])
			// }
			window.requestAnimationFrame(animationLoop)
		}
		animationLoop()
		// }
	}
}
window.addEventListener('load', main)