import * as canvasTools from './modules/canvas tools.js';
import * as bezier from './modules/bezier.js';

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


		let mouseCoords
		let prevPos, currentPos = {}

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
			ctx.moveTo(prevPosition.x, prevPosition.y); // from
			ctx.lineTo(position.x, position.y); // to
			ctx.stroke()
			ctx.closePath()
		}

		// function recordStroke(e){
		// 	if (e.buttons !== 1) { return};
		// }

		canvas.addEventListener('mousedown', (event) => {
		})

		canvas.addEventListener('mousemove', (event) => {
			mouseCoords = canvasTools.createPoint(event.x - canvas.offsetLeft, event.y - canvas.offsetTop)
			currentPos = getMousePosition(event)
			mouseDraw(event, prevPos, currentPos)
			prevPos = getMousePosition(event)
		})

		canvas.addEventListener('mouseup', (event) => {
		})

		//assuming each coordinate i.e x, y is a function of t. because the we need p1.x to be a funciton else we'll have an exception
		let p1 = canvasTools.createPointObject((t) => 100, (t) => 100)
		let p2 = canvasTools.createPointObject((t) => 300, (t) => 300)
		let p3 = canvasTools.createPointObject((t) => 500, (t) => 300)
		let p4 = canvasTools.createPointObject((t) => 600, (t) => 400)

		let controlPoints = [p1, p2, p3, p4]
		let bezierPoint = bezier.getBezierPoint(controlPoints)
		let bezierSplinePoints = bezier.getBezierSpline(controlPoints, 3)

		canvasTools.paintBackground(ctx, '#353347', ctx.canvas.width, ctx.canvas.height)

		bezier.drawBezierPointOnCanvas(ctx, bezierPoint, 0.01)
		bezier.drawBezierPointsOnCanvas(ctx, bezierSplinePoints, 0.2)
		bezier.drawControlPoints(ctx, controlPoints)

		// function animationLoop() {
		// 	// if (mouseCoords) {
		// 	// 	canvasTools.setCanvasFont(ctx, { font: 'Fira Mono', color: 'black', size: '10' })
		// 	// 	ctx.fillText(`x:${mouseCoords[0]}, y:${mouseCoords[1]}`, mouseCoords[0], mouseCoords[1])
		// 	// }

		// 	if (drawing) {

		// 	}

		// 	window.requestAnimationFrame(animationLoop)
		// }
		// animationLoop()
	}
}
window.addEventListener('load', main)