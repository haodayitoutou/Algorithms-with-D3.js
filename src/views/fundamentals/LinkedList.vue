<template>
    <div class="linked-list">
        <svg id="linkedList"></svg>
        <div class="buttons">
            <el-button
                type="primary"
                @click="handlePush"
                :disabled="isTransitting || stackCount > 9"
            >
                Push
            </el-button>
            <el-button
                type="primary"
                @click="handlePop"
                :disabled="isTransitting || stackCount === 0"
            >
                Pop
            </el-button>
        </div>
    </div>
</template>

<script>
import * as d3 from 'd3'

// svg size
const SVG_WIDTH = 960
const SVG_HEIGHT = 900
// stack/queue size
const CONTAINER_WIDTH = 168
const CONTAINER_HEIGHT = 600
// rectangle size
const RECT_WIDTH = 160
const RECT_HEIGHT = 40
// border width
const STROKE_WIDTH = 2
// transition time
const DURATION = 800
const TEXT_DY = '1.3em'

// stack left/right border
const BOUNDARY1 = SVG_WIDTH / 4 - CONTAINER_WIDTH / 2
const BOUNDARY2 = SVG_WIDTH / 4 + CONTAINER_WIDTH / 2
// queue left/right border
const BOUNDARY3 = SVG_WIDTH * 3 / 4 - CONTAINER_WIDTH / 2
const BOUNDARY4 = SVG_WIDTH * 3 / 4 + CONTAINER_WIDTH / 2
const TOP = SVG_HEIGHT / 2 - CONTAINER_HEIGHT / 2
const BOTTOM = SVG_HEIGHT / 2 + CONTAINER_HEIGHT / 2
const LEFT_STACK = SVG_WIDTH / 4 - RECT_WIDTH / 2
const LEFT_QUEUE = SVG_WIDTH * 3 / 4 - RECT_WIDTH / 2

function getOffset (n) {
    const offset = CONTAINER_HEIGHT - n * RECT_HEIGHT - (n - 1) * RECT_HEIGHT / 2 - STROKE_WIDTH
    return offset
}
function flattenLinkedList (head) {
    let data = []
    while (head) {
        data.push(head)
        head = head.next
    }
    return data
}

export default {
    data () {
        return {
            // stack
            stackHead: null,
            stackHeadText: null,
            stackCount: 0,
            // queue
            queueHead: null,
            queueTail: null,
            queueHeadText: null,
            queueTailText: null,
            queueCount: 0,
            // util
            isTransitting: false,
        }
    },
    mounted () {
        this.drawLabels()
        this.draw()
    },
    methods: {
        drawLabels () {
            let svg = d3.select('#linkedList')
                .attr('width', SVG_WIDTH)
                .attr('height', SVG_HEIGHT)

            let labels = svg.append('g')

            const boundaries = [BOUNDARY1, BOUNDARY2, BOUNDARY3, BOUNDARY4]
            Object.values(boundaries).forEach((x) => { // 4 vertical lines, 2 for stack, 2 for queue
                labels.append('line')
                    .attr('x1', x)
                    .attr('x2', x)
                    .attr('y1', TOP)
                    .attr('y2', BOTTOM)
            })
            labels.append('line') // bottom line for stack
                .attr('x1', BOUNDARY1)
                .attr('x2', BOUNDARY2)
                .attr('y1', BOTTOM)
                .attr('y2', BOTTOM)

            labels.append('text') // label for stack
                .text('Stack')
                .attr('x', SVG_WIDTH / 4)
                .attr('y', 50)
                .attr('text-anchor', 'middle')

            labels.append('text') // label for queue
                .text('Queue')
                .attr('x', SVG_WIDTH * 3 / 4)
                .attr('y', 50)
                .attr('text-anchor', 'middle')

            this.stackHeadText = labels.append('text') // stack head
                .text('head')
                .attr('x', BOUNDARY1 - 80)
                .attr('y', TOP - STROKE_WIDTH * 2)
                .attr('dy', TEXT_DY)

            this.queueHeadText = labels.append('text') // queue head
                .text('head')
                .attr('x', BOUNDARY3 - 80)
                .attr('y', TOP - STROKE_WIDTH * 2)
                .attr('dy', TEXT_DY)
            this.queueTailText = labels.append('text') // queue tail
                .text('tail')
                .attr('x', BOUNDARY4 + 5)
                .attr('y', TOP - STROKE_WIDTH * 2)
                .attr('dy', TEXT_DY)
        },
        draw () {
            this.drawStack()
            this.drawQueue()
        },
        drawStack () {
            let svg = d3.select('#linkedList')

            let stacks = flattenLinkedList(this.stackHead)
            let stack = svg.selectAll('g.stack')
                .data(stacks, (d) => { return d.value })

            let transition = d3.transition().duration(DURATION)

            let stackEnter = stack.enter()
                .append('g')
                .attr('class', 'stack')

            stackEnter.append('rect')
                .attr('x', LEFT_STACK)
                .attr('y', TOP)
                .attr('width', RECT_WIDTH)
                .attr('height', RECT_HEIGHT)

            stackEnter.append('line')
                .attr('class', 'vline')
                .attr('x1', LEFT_STACK + RECT_WIDTH / 2)
                .attr('x2', LEFT_STACK + RECT_WIDTH / 2)
                .attr('y1', TOP)
                .attr('y2', TOP + RECT_HEIGHT)

            stackEnter.append('text')
                .attr('x', LEFT_STACK)
                .attr('y', TOP)
                .attr('dx', 5)
                .attr('dy', TEXT_DY)
                .text((d) => { return d.value })

            stackEnter.append('text')
                .attr('x', LEFT_STACK + RECT_WIDTH / 2)
                .attr('y', TOP)
                .attr('dx', 10)
                .attr('dy', TEXT_DY)
                .text('next')

            stackEnter.selectAll('text, rect, line.vline')
                .transition(transition)
                .attr('transform', `translate(0, ${getOffset(this.stackCount)})`)

            // y coordinate for center point of link line
            // stackCount has been increased by 1
            let yEnter = TOP + getOffset(this.stackCount - 1) - RECT_HEIGHT * 0.25
            stackEnter.filter(() => { return this.stackCount > 1 })
                .append('line')
                .attr('class', 'link')
                .attr('x1', LEFT_STACK + RECT_WIDTH / 2)
                .attr('x2', LEFT_STACK + RECT_WIDTH / 2)
                .attr('y1', yEnter)
                .attr('y2', yEnter)
                .transition(transition)
                .attr('x1', LEFT_STACK + RECT_WIDTH * 3 / 4)
                .attr('x2', LEFT_STACK + RECT_WIDTH / 4)
                .attr('y1', yEnter - RECT_HEIGHT * 0.25)
                .attr('y2', yEnter + RECT_HEIGHT * 0.25)

            let stackExit = stack.exit()
            stackExit.selectAll('text, rect, line.vline')
                .transition(transition)
                .attr('transform', 'translate(0, -42)')

            // y coordinate for center point of link line
            // stackCount has been decreased by 1
            let yExit = TOP + getOffset(this.stackCount) - RECT_HEIGHT * 0.25
            stackExit.selectAll('line.link')
                .transition(transition)
                .attr('x1', LEFT_STACK + RECT_WIDTH / 2)
                .attr('x2', LEFT_STACK + RECT_WIDTH / 2)
                .attr('y1', yExit)
                .attr('y2', yExit)

            stackExit.transition(transition)
                .remove()

            let posY = 0
            let text = 'head'
            if (this.stackCount > 0) {
                posY = getOffset(this.stackCount)
                text = 'head--'
            }
            this.stackHeadText
                .transition(transition)
                .attr('transform', `translate(0, ${posY})`)
                .text(text)
        },
        drawQueue () {
            let svg = d3.select('#linkedList')

            let queues = flattenLinkedList(this.queueHead)
            let queue = svg.selectAll('g.queue')
                .data(queues, (d) => { return d.value })

            let transition = d3.transition().duration(DURATION)

            let queueEnter = queue.enter()
                .append('g')
                .attr('class', 'queue')

            queueEnter.append('rect')
                .attr('x', LEFT_QUEUE)
                .attr('y', TOP)
                .attr('width', RECT_WIDTH)
                .attr('height', RECT_HEIGHT)

            queueEnter.append('line')
                .attr('class', 'vline')
                .attr('x1', LEFT_QUEUE + RECT_WIDTH / 2)
                .attr('x2', LEFT_QUEUE + RECT_WIDTH / 2)
                .attr('y1', TOP)
                .attr('y2', TOP + RECT_HEIGHT)

            queueEnter.append('text')
                .attr('class', 'valueText')
                .attr('x', LEFT_QUEUE)
                .attr('y', TOP)
                .attr('dx', 5)
                .attr('dy', TEXT_DY)
                .text((d) => { return d.value })

            queueEnter.append('text')
                .attr('class', 'nextText')
                .attr('x', LEFT_QUEUE + RECT_WIDTH / 2)
                .attr('y', TOP)
                .attr('dx', 10)
                .attr('dy', TEXT_DY)
                .text('next')

            // create a link for the next coming element, but set it invisible (x1 = x2, y1 = y2)
            let yEnter = TOP + getOffset(this.stackCount) - RECT_HEIGHT * 0.25
            queueEnter.append('line')
                .attr('class', 'link')
                .attr('x1', LEFT_QUEUE + RECT_WIDTH / 2)
                .attr('x2', LEFT_QUEUE + RECT_WIDTH / 2)
                .attr('y1', yEnter)
                .attr('y2', yEnter)

            let queueUpdate = queueEnter.merge(queue)
            queueUpdate.select('rect')
                .transition(transition)
                .attr('transform', (d, i) => {
                    return `translate(0, ${getOffset(i + 1)})`
                })
            queueUpdate.select('line.vline')
                .transition(transition)
                .attr('transform', (d, i) => {
                    return `translate(0, ${getOffset(i + 1)})`
                })
            queueUpdate.select('text.valueText')
                .transition(transition)
                .attr('transform', (d, i) => {
                    return `translate(0, ${getOffset(i + 1)})`
                })
            queueUpdate.select('text.nextText')
                .transition(transition)
                .attr('transform', (d, i) => {
                    return `translate(0, ${getOffset(i + 1)})`
                })
            // set the links visible except for the last element (which doesn't have a next element)
            queueUpdate.filter((d) => { return d.next !== null }) // exclude the last element
                .select('line.link')
                .transition(transition)
                .attr('x1', LEFT_QUEUE + RECT_WIDTH / 4)
                .attr('x2', LEFT_QUEUE + RECT_WIDTH * 3 / 4)
                .attr('y1', (d, i) => {
                    return TOP + getOffset(i + 1) - RECT_HEIGHT * 0.5
                })
                .attr('y2', (d, i) => {
                    return TOP + getOffset(i + 1)
                })
            // the last link is still invisible. Only adjust its y position based on the latest list
            queueUpdate.filter((d) => { return d.next === null })
                .select('line.link')
                .transition(transition)
                .attr('y1', TOP + getOffset(this.stackCount) - RECT_HEIGHT * 0.25)
                .attr('y2', TOP + getOffset(this.stackCount) - RECT_HEIGHT * 0.25)

            let queueExit = queue.exit()
            queueExit.selectAll('text, rect, line.vline')
                .transition(transition)
                .attr('transform', `translate(0, ${CONTAINER_HEIGHT + RECT_HEIGHT * 0.5 + STROKE_WIDTH})`)
                .remove()

            let yExit = TOP + CONTAINER_HEIGHT + RECT_HEIGHT * 0.25
            queueExit.select('line.link')
                .transition(transition)
                .attr('x1', LEFT_QUEUE + RECT_WIDTH / 2)
                .attr('x2', LEFT_QUEUE + RECT_WIDTH / 2)
                .attr('y1', yExit)
                .attr('y2', yExit)
                .remove()

            queueExit.transition(transition)
                .remove()

            let headText = 'head--'
            let headPosY = 0
            let tailText = '--tail'
            let tailPos = 0
            if (queues.length === 0) {
                headText = 'head'
                tailText = 'tail'
            } else if (queues.length === 1) {
                headPosY = getOffset(1)
                tailPos = getOffset(1)
            } else if (queues.length > 1) {
                headPosY = getOffset(1)
                tailPos = getOffset(queues.length)
            }
            this.queueHeadText.transition(transition)
                .attr('transform', `translate(0, ${headPosY})`)
                .text(headText)
            this.queueTailText.transition(transition)
                .attr('transform', `translate(0, ${tailPos})`)
                .text(tailText)
        },
        handlePush () {
            // stack
            this.stackCount += 1
            let oldStackHead = this.stackHead
            this.stackHead = {
                value: `stack ${this.stackCount}`,
                next: oldStackHead,
            }
            // queue
            this.queueCount += 1
            let oldQueueTail = this.queueTail
            let number = this.queueCount.toString() // only use the last digit
            this.queueTail = {
                value: `queue ${number[number.length - 1]}`,
                next: null,
            }
            if (!this.queueHead) {
                this.queueHead = this.queueTail
            } else {
                oldQueueTail.next = this.queueTail
            }
            // re-draw
            this.isTransitting = true
            this.draw()
            setTimeout(() => {
                this.isTransitting = false
            }, DURATION)
        },
        handlePop () {
            // stack
            this.stackHead = this.stackHead.next
            this.stackCount -= 1
            // queue
            this.queueHead = this.queueHead.next
            if (!this.queueHead) {
                this.queueTail = null
            }
            // re-draw
            this.isTransitting = true
            this.draw()
            setTimeout(() => {
                this.isTransitting = false
            }, DURATION)
        },
    },
}
</script>

<style lang="scss">
.linked-list {
    display: flex;
    rect {
        fill-opacity: 1e-6;
        stroke: #2389ae;
        stroke-width: 2
    }
    text {
        font-size: 20px;
    }
    line {
        stroke: #2389ae;
        stroke-width: 2
    }
    .buttons {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 150px;
        .el-button {
            margin: 10px;
            width: 100px;
        }
    }
}
</style>
