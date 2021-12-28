import * as bezier from './bezier.js'
import * as canvasTools from './canvas tools.js'

let mousePressed = false

function getMousePosition(canvas, mouseEvent) {
    let pos = {}
    pos.x = mouseEvent.x - canvas.offsetLeft;
    pos.y = mouseEvent.y - canvas.offsetTop;
    return pos
}

function mouseDraw(ctx, color, lineWidth, prevPosition, position) {
    ctx.beginPath(); // begin
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.strokeStyle = color
    ctx.moveTo(prevPosition.x, prevPosition.y); // from
    ctx.lineTo(position.x, position.y); // to
    ctx.stroke()
    ctx.closePath()
}

function divideStroke(stroke, parts) {
    let points = []
    let startPoint = stroke[0]
    points.push({ x: (t) => startPoint[0], y: (t) => startPoint[1] })
    for (let i = 0; i < stroke.length - 1; i += Math.ceil((stroke.length - 2) / parts)) {
        if (i === 0) {
            continue
        }
        points.push({ x: (t) => stroke[i][0], y: (t) => stroke[i][1] })
    }
    let endPoint = stroke[stroke.length - 1]
    points.push({ x: (t) => endPoint[0], y: (t) => endPoint[1] })
    return points
}

const drawFromPoints = (ctx, pointsArray, color = 'white', lineWidth) => {
    let path = new Path2D
    ctx.beginPath(path)
    path.moveTo(pointsArray[0][0], pointsArray[0][1])
    for (let i = 0; i < pointsArray.length; i++) {
        path.lineTo(pointsArray[i][0], pointsArray[i][1])
    }
    ctx.strokeStyle = color
    ctx.lineWidth = lineWidth
    ctx.lineCap = 'round'
    ctx.stroke(path)
    ctx.closePath()
}

export const createScratchPadCanvas = (canvas, ctx, strokeColor = 'white', strokeWidth = '3') => {
    let properties = {
        strokeColor: strokeColor,
        strokeWidth: strokeWidth,
        autoSmoothing: false,
        smoothingAccuracy: 8
    }

    let prevPosition, currentPosistion
    let stroke = []
    let strokes = []
    let mousePressed = false
    let refreshNeeded = false

    canvas.addEventListener('mousedown', () => {
        mousePressed = true
    })

    canvas.addEventListener('mousemove', (event) => {
        if (mousePressed) {
            stroke.push([event.x - canvas.offsetLeft, event.y - canvas.offsetTop])
            currentPosistion = getMousePosition(canvas, event)
            if (prevPosition !== undefined) {
                mouseDraw(ctx, properties.strokeColor, properties.strokeWidth, prevPosition, currentPosistion)
            }
            prevPosition = getMousePosition(canvas, event)
        }
    })

    canvas.addEventListener('mouseup', (event) => {
        mousePressed = false
        prevPosition = undefined
        if (properties.autoSmoothing) {
            //clear the stroke
            let points = divideStroke(stroke, properties.smoothingAccuracy)
            bezier.drawControlPoints(ctx, points)
            let bezierPoint = bezier.getBezierPoint(points)
            let bezierStrokePoints = bezier.getCurvePointsFromBezierPoint(bezierPoint, 100)
            refreshNeeded = true
            strokes.push(bezierStrokePoints)
            stroke = []
        }
        if (stroke.length !== 0) {
            let strokeVar = [...stroke]
            strokes.push(strokeVar)
        }

        if (refreshNeeded) {
            canvasTools.paintBackground(ctx, '#353347', ctx.canvas.width, ctx.canvas.height)
            for (let stroke of strokes) {
                drawFromPoints(ctx, stroke, properties.strokeColor, properties.strokeWidth)
            }
            refreshNeeded = false
        }
    })
    
    return {
        properties
    }
}
