import * as canvasTools from './canvas tools.js';

const cartesianToCanvasCoords = (coords, originInCanvas, unitPixels) => {
    return canvasTools.createPoint(originInCanvas[0] + unitPixels * coords[0], originInCanvas[1] - unitPixels * coords[1])
}

export const createPen = (ctx, color, lineWidth, speed = 1) => {
    const properties = {
        coords: canvasTools.createPoint(0, 0),
        color: color,
        lineWidth: lineWidth,
        speed: speed,
        velocity: canvasTools.createPoint(0, 0), //unit vector
    }

    let slope, cosTheta
    let coordsToReach = canvasTools.createPoint(0, 0)
    let calculated = false
    let traced = true
    let index = 1
    let curvePoints = []
    let path

    return {
        properties,

        write() {
            path.lineTo(properties.coords[0], properties.coords[1])
            ctx.strokeStyle = properties.color
            ctx.lineWidth = properties.lineWidth
            ctx.lineCap = 'round'
            ctx.stroke(path)
        },

        update() {
            if (coordsToReach[0] !== properties.coords[0]
                || coordsToReach[1] !== properties.coords[1]) {
                if (calculated === false) {
                    let deltaX = coordsToReach[0] - properties.coords[0]
                    let deltaY = coordsToReach[1] - properties.coords[1]
                    slope = deltaY / deltaX
                    let distanceFromCoordsTillCoordsToReach = Math.sqrt(deltaX ** 2 + deltaY ** 2)
                    cosTheta = deltaX / distanceFromCoordsTillCoordsToReach
                    properties.velocity = canvasTools.createPoint(cosTheta, slope * cosTheta)
                    calculated = true
                }

                //logic for moving in a line towards the target coords
                /* we can simply add a shift in the coords along the slope but the destination point will get missed and the object 
                will not stop  at that point...to avoid this, in the case when the horizontal shift will go ahead of the destination 
                point it will move the object to the destination directly and stop. */
                if (coordsToReach[0] - (properties.coords[0] + properties.speed * properties.velocity[0]) > 0) {
                    if (cosTheta >= 0) {
                        //moving towards right and the coordsToReach will still be on the right
                        properties.coords[0] += properties.speed * properties.velocity[0]
                        properties.coords[1] += properties.speed * properties.velocity[1]
                    }
                    else if (cosTheta < 0) {
                        //moving towards left and coordsToReach will have passed to the right
                        properties.coords = canvasTools.createPoint(coordsToReach[0], coordsToReach[1])
                        properties.velocity = canvasTools.createPoint(0, 0)
                    }
                }

                else if (coordsToReach[0] - (properties.coords[0] + properties.speed * properties.velocity[0]) <= 0) {
                    if (cosTheta >= 0) {
                        //moving towards right and the coordsToReach will have passed to the left
                        properties.coords = canvasTools.createPoint(coordsToReach[0], coordsToReach[1])
                        properties.velocity = canvasTools.createPoint(0, 0)
                    }
                    else if (cosTheta < 0) {
                        //moving towards left and the coordsToReach will still be on the left
                        properties.coords[0] += properties.speed * properties.velocity[0]
                        properties.coords[1] += properties.speed * properties.velocity[1]
                    }
                }
            }
            else if (coordsToReach[0] == properties.coords[0]
                && coordsToReach[1] == properties.coords[1]) {
                if (index < curvePoints.length) {
                    coordsToReach = curvePoints[index]
                    index++
                    calculated = false
                }
                else if (index >= curvePoints.length) {
                    traced = true
                }
            }
        },

        moveTo(coords, speed) {
            coordsToReach = coords
            properties.speed = speed
            calculated = false
        },

        traceCurve(fOfx, startX, endX, dx, originInCanvas, unitPixels) {
            let points = []
            let x
            for (x = startX; x <= endX; x += dx) {
                points.push(cartesianToCanvasCoords(canvasTools.createPoint(x, fOfx(x)), originInCanvas, unitPixels))
            }
            if (x < endX) {
                points.push(cartesianToCanvasCoords(canvasTools.createPoint(endX, fOfx(endX)), originInCanvas, unitPixels))
            }

            curvePoints = points
            traced = false
            path = new Path2D
            ctx.beginPath(path)
            path.moveTo(curvePoints[0][0], curvePoints[0][1])
            properties.coords = canvasTools.createPoint(curvePoints[0][0], curvePoints[0][1])
            coordsToReach = canvasTools.createPoint(curvePoints[0][0], curvePoints[0][1])
        },
        tracePoints(points) {
            path = new Path2D
            ctx.beginPath(path)
            curvePoints = points
            path.moveTo(curvePoints[0][0], curvePoints[0][1])
            properties.coords = canvasTools.createPoint(curvePoints[0][0], curvePoints[0][1])
            coordsToReach = canvasTools.createPoint(curvePoints[0][0], curvePoints[0][1])
            traced = false
        }
    }
}
