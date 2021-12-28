import * as canvasTools from './modules/canvas tools.js'
import * as bezier from './modules/bezier.js'
import * as curveAnim from './modules/curveAnim.js'
import * as squiggle from './modules/squiggle.js'

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

		//assuming each coordinate i.e x, y is a function of t. because the we need p1.x to be a funciton else we'll have an exception
		let controlPoints = []
		for (let i = 0; i < 5; i++) {
			let x = 700 * Math.random()
			let y = 700 * Math.random()

			controlPoints.push(canvasTools.createPointObject((t) => x, (t) => y))
		}

		let bezierPoint = bezier.getBezierPoint(controlPoints)
		let bezierSplinePoints = bezier.getBezierSpline(controlPoints, 3)


		bezier.drawBezierPointsOnCanvas(ctx, bezierSplinePoints, 100)
		bezier.drawControlPoints(ctx, controlPoints)

		let curvePoints = []
		for(let bezierPoint of bezierSplinePoints){
			let points = bezier.getCurvePointsFromBezierPoint(bezierPoint, 100)
			for(let point of points){
				curvePoints.push(point)
			}
		}

		// let pen1 = curveAnim.createPen(ctx, 'blue', 3, 10)
		// pen1.tracePoints(curvePoints)

		// bezier.drawBezierPointsOnCanvas(ctx, bezierSplinePoints, 100)
		// bezier.drawControlPoints(ctx, controlPoints)

		canvasTools.paintBackground(ctx, '#353347', ctx.canvas.width, ctx.canvas.height)
		let pad = squiggle.createScratchPadCanvas(canvas, ctx, 'green', 2)
		pad.properties.autoSmoothing = true

		function animationLoop() {
			// pen1.update()
			// pen1.write()

			// if (mouseCoordsGlobal) {
			// 	canvasTools.setCanvasFont(ctx, { font: 'Fira Mono', color: 'black', size: '10' })
			// 	ctx.fillText(`x:${mouseCoordsGlobal[0]}, y:${mouseCoordsGlobal[1]}`, mouseCoordsGlobal[0], mouseCoordsGlobal[1])
			// }
			window.requestAnimationFrame(animationLoop)
		}
		animationLoop()
	}
}
window.addEventListener('load', main)