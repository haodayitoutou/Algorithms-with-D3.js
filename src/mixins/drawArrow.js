
const ARROW_LENGTH = 20
const ARROW_ANGLE = 20

function toRadian (degree) {
    return degree * Math.PI / 180
}
function toDegree (radian) {
    return radian * 180 / Math.PI
}

export default {
    methods: {
        drawArrow ({ element, startX, startY, endX, endY, capLength = ARROW_LENGTH, capAngle = ARROW_ANGLE }) {
            element.append('line')
                .attr('x1', startX)
                .attr('x2', endX)
                .attr('y1', startY)
                .attr('y2', endY)

            const includedAngle = toDegree(Math.atan2(endY - startY, endX - startX))
            const auxAngle1 = toRadian(includedAngle - capAngle)
            const auxAngle2 = toRadian(includedAngle + capAngle)

            element.append('line')
                .attr('x1', endX)
                .attr('x2', endX - capLength * Math.cos(auxAngle1))
                .attr('y1', endY)
                .attr('y2', endY - capLength * Math.sin(auxAngle1))
            element.append('line')
                .attr('x1', endX)
                .attr('x2', endX - capLength * Math.cos(auxAngle2))
                .attr('y1', endY)
                .attr('y2', endY - capLength * Math.sin(auxAngle2))
        },
    },
}
