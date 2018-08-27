<template>
    <div class="selection-sort">
        <svg id="elementarysort"></svg>
        <div class="side-bar">
            <div class="side-bar-top">
                <el-button type="primary" @click="handleSelectionSort" :disabled="isSorting || taskQueue.length > 0">
                    Selection Sort
                </el-button>
                <div class="notes">
                    <span>Swap count: {{ selectionCount }}</span>
                    <ol>
                        <li>Running time is insensitive to input</li>
                        <li>Data movement is minimal: use N exchanges</li>
                    </ol>
                </div>
                <el-button type="primary" @click="handleInsertionSort" :disabled="isSorting || taskQueue.length > 0">
                    Insertion Sort
                </el-button>
                <div class="notes">
                    <span>Swap count: {{ insertionCount }}</span>
                    <table>
                        <thead>
                            <tr>
                                <th></th>
                                <th>Compare</th>
                                <th>Exchange</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Random</td>
                                <td>N<sup>2</sup>/4</td>
                                <td>N<sup>2</sup>/4</td>
                            </tr>
                            <tr>
                                <td>Worst</td>
                                <td>N<sup>2</sup>/2</td>
                                <td>N<sup>2</sup>/2</td>
                            </tr>
                            <tr>
                                <td>Best</td>
                                <td>N - 1</td>
                                <td>0</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="side-bar-bottom">
                <el-button type="primary" @click="handleStop" :disabled="taskQueue.length === 0">
                    {{ buttonText }}
                </el-button>
                <el-button type="primary" @click="handleShuffle" :disabled="isSorting">
                    Shuffle
                </el-button>
            </div>
        </div>
    </div>
</template>

<script>
import * as d3 from 'd3'

import drawArrow from '../../mixins/drawArrow'

// svg size
const SVG_WIDTH = 960
const SVG_HEIGHT = 800
// space between bars
const BAR_GAP = 10
const BAR_COUNT = 20
// arrow length
const ARROW_LENGTH = 50
// transition time
const DURATION = 800

const BAR_WIDTH = (SVG_WIDTH - BAR_GAP) / BAR_COUNT - BAR_GAP
const BAR_BOTTOM = SVG_HEIGHT * 9 / 16

function getX (index) {
    return BAR_GAP + (BAR_WIDTH + BAR_GAP) * index
}

export default {
    data () {
        return {
            dataSet: [
                110, 199, 11, 48, 190, 32, 148, 161, 36, 177, 115, 30, 58, 197, 72, 134, 107, 143, 28, 81,
            ],
            isSorting: false,
            svgElement: null,
            taskQueue: [],
            selectionCount: 0,
            insertionCount: 0,
            buttonText: 'Stop',
        }
    },
    mounted () {
        this.initSvg()
    },
    mixins: [drawArrow],
    methods: {
        initSvg () {
            this.svgElement = d3.select('#elementarysort')
                .attr('width', SVG_WIDTH)
                .attr('height', SVG_HEIGHT)

            // add a number for each bar, indicating the index of the bar in the data set
            this.svgElement.append('g')
                .selectAll('text.index')
                .data(d3.range(this.dataSet.length))
                .enter()
                .append('text')
                .attr('class', 'index')
                .text((d) => { return d })
                .attr('text-anchor', 'start')
                .attr('x', (d, i) => {
                    return getX(i)
                })
                .attr('y', () => {
                    return BAR_BOTTOM
                })

            // draw two horizontal lines as bases for the signs
            this.svgElement.append('g')
                .selectAll('line')
                .data([11, 13])
                .enter()
                .append('line')
                .attr('x1', 0)
                .attr('x2', SVG_WIDTH)
                .attr('y1', (d) => { return SVG_HEIGHT * d / 16 })
                .attr('y2', (d) => { return SVG_HEIGHT * d / 16 })

            this.drawBar()
            this.drawSigns()
            this.drawComparison()
        },
        drawBar () {
            let bar = this.svgElement.selectAll('svg.bar')
                .data(this.dataSet, (d) => { return d })

            let yScale = d3.scaleLinear()
                .domain([0, d3.max(this.dataSet)])
                .range([0, SVG_HEIGHT * 0.5])

            let barEnter = bar.enter()
                .append('svg')
                .attr('class', 'bar')
                .attr('width', BAR_WIDTH)
                .attr('height', SVG_HEIGHT)
                .attr('x', (d, i) => {
                    return getX(i)
                })

            barEnter.append('rect')
                .attr('width', BAR_WIDTH)
                .attr('height', (d) => { return yScale(d) })
                .attr('x', 0)
                .attr('y', (d) => {
                    return BAR_BOTTOM - yScale(d)
                })
                .attr('fill-opacity', 1e-6)

            barEnter.append('text')
                .attr('class', 'valueText')
                .text((d) => { return d })
                .attr('text-anchor', 'start')
                .attr('x', 0)
                .attr('y', (d) => {
                    return BAR_BOTTOM - yScale(d)
                })
                .attr('dy', -6)
        },
        drawSigns () {
            function addSign (svg, className, x, y, text, startY, arrowFunc) {
                let element = svg.append('g')
                    .attr('class', className)
                element.append('text')
                    .attr('x', x)
                    .attr('y', y)
                    .attr('dy', 20)
                    .attr('text-anchor', 'middle')
                    .text(text)
                arrowFunc({
                    element,
                    startX: 0,
                    endX: 0,
                    startY,
                    endY: startY - ARROW_LENGTH,
                })
            }
            // element for i
            addSign(this.svgElement, 'iteratorI', 0, SVG_HEIGHT * 13 / 16, 'i', SVG_HEIGHT * 13 / 16, this.drawArrow)
            // element for min
            addSign(this.svgElement, 'minimum', 0, SVG_HEIGHT * 11 / 16, 'min', SVG_HEIGHT * 11 / 16, this.drawArrow)
            // element for j
            addSign(this.svgElement, 'iteratorJ', 0, SVG_HEIGHT * 11 / 16, 'j', SVG_HEIGHT * 11 / 16, this.drawArrow)
            // hide these 3 signs
            this.toggleSigns({ className: 'iteratorI', opacity: 0 })
            this.toggleSigns({ className: 'minimum', opacity: 0 })
            this.toggleSigns({ className: 'iteratorJ', opacity: 0 })
        },
        drawComparison () {
            /*
             * Add some texts showing the comparison between two elements
             * They should look like the following:
             *   left     right
             *  vleft  >  vright
             */
            let dx = 20
            let dy = '1.5em'
            let compareElement = this.svgElement.append('g')
                .attr('class', 'comparison')

            // text on the left
            compareElement.append('text')
                .attr('class', 'leftText')
                .attr('x', SVG_WIDTH / 2)
                .attr('y', SVG_HEIGHT * 15 / 16)
                .attr('text-anchor', 'end')
                .attr('dx', -dx)
                .text('')
            compareElement.append('text')
                .attr('class', 'leftNumber')
                .attr('x', SVG_WIDTH / 2)
                .attr('y', SVG_HEIGHT * 15 / 16)
                .attr('text-anchor', 'end')
                .attr('dx', -dx)
                .attr('dy', dy)
                .text('')

            // text on the right
            compareElement.append('text')
                .attr('class', 'rightText')
                .attr('x', SVG_WIDTH / 2)
                .attr('y', SVG_HEIGHT * 15 / 16)
                .attr('text-anchor', 'start')
                .attr('dx', dx)
                .text('')
            compareElement.append('text')
                .attr('class', 'rightNumber')
                .attr('x', SVG_WIDTH / 2)
                .attr('y', SVG_HEIGHT * 15 / 16)
                .attr('text-anchor', 'start')
                .attr('dx', dx)
                .attr('dy', dy)
                .text('')

            // < or > in the middle
            compareElement.append('text')
                .attr('class', 'comparisonText')
                .attr('x', SVG_WIDTH / 2)
                .attr('y', SVG_HEIGHT * 15 / 16)
                .attr('text-anchor', 'middle')
                .attr('dy', dy)
                .text('')
        },
        updateArrow ({ className, x }) {
            // This function moves an arrow (with the text above it) to a new position
            // className: 'iteratorI', 'iteratorJ' or 'minimum'
            const posX = getX(x) + BAR_WIDTH * 0.5
            this.svgElement.select(`g.${className}`)
                .transition()
                .duration(DURATION)
                .attr('transform', `translate(${posX}, 0)`)
        },
        updateBar ({ i1, i2, v1, v2 }) {
            // This function swaps two bars
            // i1, i2 are the index of these two bars in the data set
            // v1, v2 are the corresponding values
            if (v1 === v2) {
                return
            }
            function moveBar (svg, datum, index) {
                // datum: to find the svg element to move
                // index: to find the final position for the svg element
                svg.selectAll('svg.bar')
                    .filter((d) => { return d === datum })
                    .transition()
                    .duration(DURATION)
                    .attr('x', () => { return getX(index) })
            }
            moveBar(this.svgElement, v1, i2)
            moveBar(this.svgElement, v2, i1)
        },
        updateComparison ({ vLeft, vRight }) {
            let comparison
            if (vLeft === vRight) {
                comparison = '='
            } else if (vLeft > vRight) {
                comparison = '>'
            } else {
                comparison = '<'
            }
            this.svgElement.select('text.leftNumber')
                .text(vLeft)
            this.svgElement.select('text.rightNumber')
                .text(vRight)
            this.svgElement.select('text.comparisonText')
                .text(comparison)
        },
        paintBar ({ datum }) {
            this.svgElement.selectAll('rect')
                .filter((d) => { return d === datum })
                .attr('fill-opacity', 0.6)
                .attr('fill', 'red')
        },
        toggleSigns ({ className, opacity }) {
            let g = this.svgElement.select(`g.${className}`)
            g.select('text').attr('opacity', opacity)
            g.selectAll('line').attr('opacity', opacity)
        },
        resetSvg () {
            d3.selectAll('svg.bar').remove() // remove all bars
            this.drawBar() // re-draw based on the new data set
            d3.selectAll('g.iteratorI').remove() // remove i
            d3.selectAll('g.minimum').remove() // remove minimum
            d3.selectAll('g.iteratorJ').remove() // remove j
            this.drawSigns()
            d3.selectAll('g.comparison').remove() // remove comparison texts
            this.drawComparison()
        },
        handleSelectionSort () {
            this.svgElement.select('text.leftText').text('minimum')
            this.svgElement.select('text.rightText').text('j')

            // show the three signs
            this.toggleSigns({ className: 'iteratorI', opacity: 1 })
            this.toggleSigns({ className: 'minimum', opacity: 1 })
            this.toggleSigns({ className: 'iteratorJ', opacity: 1 })

            this.isSorting = true // disable the buttons
            let minimum
            let v1
            let v2
            // loop through the array
            for (let i = 0; i < BAR_COUNT; i += 1) {
                // mark the index of the smallest number in the array
                minimum = i
                // put the three arrows to the starting position before a loop begins
                this.taskQueue.push([
                    // move bar
                    { type: 'move', className: 'iteratorI', x: i },
                    { type: 'move', className: 'minimum', x: i },
                    // move j here instead of inside the inner loop, so that the three arrows can move simultaneously
                    { type: 'move', className: 'iteratorJ', x: i + 1 },
                ])
                // update text
                this.taskQueue.push([
                    { type: 'text', vLeft: this.dataSet[minimum], vRight: this.dataSet[i + 1] },
                ])
                for (let j = i + 1; j < BAR_COUNT; j += 1) {
                    if (j > i + 1) { // the task for (j = i + 1) has already been added before the inner loop begins
                        this.taskQueue.push([
                            { type: 'move', className: 'iteratorJ', x: j },
                        ])
                        this.taskQueue.push([
                            { type: 'text', vLeft: this.dataSet[minimum], vRight: this.dataSet[j] },
                        ])
                    }
                    if (this.dataSet[j] < this.dataSet[minimum]) { // finds a smaller number
                        minimum = j
                        this.taskQueue.push([
                            { type: 'move', className: 'minimum', x: j },
                        ])
                        this.taskQueue.push([
                            { type: 'text', vLeft: this.dataSet[minimum], vRight: this.dataSet[j] },
                        ])
                    }
                }
                // After the inner loop is completed, we get the smallest number for this (outer) loop
                // Move it to its final position
                v1 = this.dataSet[i]
                v2 = this.dataSet[minimum]
                this.dataSet[i] = v2
                this.dataSet[minimum] = v1
                this.taskQueue.push([ // Add a task to swap their corresponding bars
                    {
                        type: 'swap',
                        i1: i,
                        i2: minimum,
                        v1,
                        v2,
                    },
                ])
            }

            // The sorting is completed. Execute the tasks to the simulate the process
            let that = this
            function delay () {
                if (that.isSorting) {
                    let actions = that.taskQueue.shift() // get a new action list
                    for (let n = 0; n < actions.length; n += 1) { // there might be multiple actions
                        let action = actions[n]
                        if (action.type === 'move') { // move the arrows
                            that.updateArrow(action)
                        } else if (action.type === 'swap') { // move the bars
                            that.updateBar(action)
                            that.paintBar({ datum: action.v2 })
                            that.selectionCount += 1
                        } else if (action.type === 'text') { // change the comparison text
                            that.updateComparison(action)
                        }
                    }
                }
                setTimeout(() => {
                    if (that.taskQueue.length > 0) { // there are still tasks left and 'Stop' is not clicked
                        delay() // After a timeout, run this function again to execute the next task
                    } else {
                        that.resetSvg()
                        that.isSorting = false // All tasks are completed. Enable the buttons
                    }
                }, DURATION)
            }
            delay()
        },
        handleInsertionSort () {
            this.svgElement.select('text.leftText').text('i')
            this.svgElement.select('text.rightText').text('j')

            // show the signs for i and j
            this.toggleSigns({ className: 'iteratorI', opacity: 1 })
            this.toggleSigns({ className: 'iteratorJ', opacity: 1 })

            this.isSorting = true // disable the buttons
            let i
            let j
            let v1
            let v2
            for (i = 0; i < BAR_COUNT; i += 1) {
                if (i > 0) {
                    // put the three arrows to the starting position before a loop begins
                    this.taskQueue.push([
                        // move bar
                        { type: 'move', className: 'iteratorI', x: i },
                        // move j here instead of inside the inner loop, so that the three arrows can move simultaneously
                        { type: 'move', className: 'iteratorJ', x: i },
                    ])
                }
                for (j = i; j > 0; j -= 1) {
                    v1 = this.dataSet[j]
                    v2 = this.dataSet[j - 1]
                    if (v1 < v2) {
                        this.dataSet[j] = v2
                        this.dataSet[j - 1] = v1
                    }
                }
            }

            // The sorting is completed. Execute the tasks to the simulate the process
            let that = this
            function delay () {
                if (that.isSorting) {
                    let actions = that.taskQueue.shift() // get a new action list
                    for (let n = 0; n < actions.length; n += 1) { // there might be multiple actions
                        let action = actions[n]
                        if (action.type === 'move') { // move the arrows
                            that.updateArrow(action)
                        } else if (action.type === 'swap') { // move the bars
                            that.updateBar(action)
                            that.paintBar({ datum: action.v2 })
                            that.insertionCount += 1
                        } else if (action.type === 'text') { // change the comparison text
                            that.updateComparison(action)
                        }
                    }
                }
                setTimeout(() => {
                    if (that.taskQueue.length > 0) { // there are still tasks left and 'Stop' is not clicked
                        delay() // After a timeout, run this function again to execute the next task
                    } else {
                        that.resetSvg()
                        that.isSorting = false // All tasks are completed. Enable the buttons
                    }
                }, DURATION)
            }
            delay()
        },
        handleStop () {
            this.isSorting = !this.isSorting
            this.buttonText = this.isSorting ? 'Pause' : 'Resume'
        },
        handleShuffle () {
            for (let i = BAR_COUNT - 1; i > 0; i -= 1) {
                let j = Math.floor(Math.random() * (i + 1))
                let temp = this.dataSet[i]
                this.dataSet[i] = this.dataSet[j]
                this.dataSet[j] = temp
            }
            this.resetSvg()
            // clear task queue
            this.taskQueue = []
            // reset the button text
            this.buttonText = 'Stop'
        },
    },
}
</script>

<style lang="scss">
.selection-sort {
    display: flex;
    justify-content: space-between;
    #elementarysort {
        min-width: 960px;
    }
    .side-bar {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin-left: 40px;
        .side-bar-top, .side-bar-bottom {
            display: flex;
            flex-direction: column;
        }
        .el-button {
            margin: 20px 0 0;
            padding: 10px 0;
            font-size: 20px;
            line-height: 18px;
            &:first-child {
                margin-top: 0;
            }
        }
        .notes {
            margin-top: 20px;
            ol {
                margin: 20px 0 0 20px;
            }
            li {
                margin-top: 10px;
                word-wrap: break-all;
                white-space: normal;
            }
            table {
                margin-top: 20px;
                table-layout: fixed;
                border-collapse: collapse;
                border: 1px solid gray;
            }
            th, td {
                padding: 10px;
                text-align: center;
                border: 1px solid gray;
            }
        }
    }
}
</style>
