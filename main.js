import * as canvasTools from './modules/canvas tools.js';
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
		let pos = {}
		let startPos, endPos

		function setPosition(e) {
			pos.x = e.x - canvas.offsetLeft;
			pos.y = e.y - canvas.offsetTop;
		}

		function draw(e) {
			// mouse left button must be pressed
			if (e.buttons !== 1) { setPosition(e); return; };

			ctx.beginPath(); // begin

			ctx.lineWidth = 5;
			ctx.lineCap = 'round';
			ctx.moveTo(pos.x, pos.y); // from
			setPosition(e);
			ctx.lineTo(pos.x, pos.y); // to
			ctx.stroke()
			ctx.closePath()
		}

		canvas.addEventListener('mousedown', (event) => {
			setPosition(event)
			startPos = pos
		})

		canvas.addEventListener('mousemove', (event) => {
			mouseCoords = canvasTools.createPoint(event.x - canvas.offsetLeft, event.y - canvas.offsetTop)
			draw(event)
		})

		canvas.addEventListener('mouseup', (event) => {
			setPosition(event)
			endPos = pos
			deltaX = (endPos.x - startPos.x)/10
			// let controlPoints = []
			// for(i=0; i<10; i++){
			// 	controlPoints	
			// }
			// let controlPoints = [p1, p2, p3, p4]
			// let endPoint = controlPoints[controlPoints.length - 1]
			// let bezierPoint = bezierPointNonRecursive(controlPoints)


			// canvasTools.paintBackground(ctx, '#353347', ctx.canvas.width, ctx.canvas.height)
			// drawBezierPointOnCanvas(bezierPoint, endPoint)
			// drawControlPoints(controlPoints)

		})

		function bezierLinear(point1, point2) {
			return canvasTools.createPointObject(
				(t) => point1.x(t) + (point2.x(t) - point1.x(t)) * t,
				(t) => point1.y(t) + (point2.y(t) - point1.y(t)) * t)
		}

		function bezierInsidePoints(points) {
			let insidePoints = []
			for (let i = 0; i < points.length - 1; i++) {
				insidePoints.push(bezierLinear(points[i], points[i + 1]))
			}
			return insidePoints
		}

		function bezierPointRecursive(points) {
			if (points.length > 1) {
				points = bezierInsidePoints(points)
				bezierPointRecursive(points)
			}
			else { return points[0] }
		}

		function bezierPointNonRecursive(controlPoints) {
			let points = controlPoints
			while (points.length > 1) {
				for (let point of points) {
					console.log(point.x(0))
					console.log(point.y(0))
				}
				console.log('------')
				points = bezierInsidePoints(points)

			}
			return points[0]
		}

		function drawBezierPointOnCanvas(bezierPoint, endPoint) {
			ctx.beginPath()
			ctx.moveTo(bezierPoint.x(0), bezierPoint.y(0))
			for (let t = 0; t <= 1; t += 0.01) {
				ctx.lineTo(bezierPoint.x(t), bezierPoint.y(t))
				// console.log(bezierPoint.x(t), bezierPoint.y(t))
			}
			ctx.strokeStyle = 'white'
			ctx.lineWidth = 3
			ctx.lineCap = 'round'
			ctx.stroke()
			ctx.closePath()
		}

		function drawControlPoints(points) {
			//assuming each x,y are funcitons of t
			for (let point of points) {
				ctx.beginPath()
				ctx.arc(point.x(0), point.y(0), 8, 0, 2 * Math.PI)
				ctx.strokeStyle = 'skyblue'
				ctx.lineWidth = 2
				ctx.stroke()
				ctx.closePath()
			}

		}

		//assuming each coordinate i.e x, y is a function of t. because the we need p1.x to be a funciton else we'll have an exception
		let p1 = canvasTools.createPointObject((t) => 100, (t) => 100)
		let p2 = canvasTools.createPointObject((t) => 300, (t) => 300)
		let p3 = canvasTools.createPointObject((t) => 500, (t) => 300)
		let p4 = canvasTools.createPointObject((t) => 600, (t) => 400)

		let controlPoints = [p1, p2, p3, p4]
		let endPoint = controlPoints[controlPoints.length - 1]
		let bezierPoint = bezierPointNonRecursive(controlPoints)


		canvasTools.paintBackground(ctx, '#353347', ctx.canvas.width, ctx.canvas.height)
		drawBezierPointOnCanvas(bezierPoint, endPoint)
		drawControlPoints(controlPoints)

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