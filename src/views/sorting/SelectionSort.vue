<template>
    <div class="selection-sort">
        <svg id="selectionsort"></svg>
        <div class="buttons">
            <el-button
                type="primary"
                @click="handleSort"
                :disabled="isSorting"
            >
                Sort
            </el-button>
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
const ARROW_LENGTH = 70
const TEXT_DY = -10
// transition time
const DURATION = 800

const BAR_WIDTH = (SVG_WIDTH - BAR_GAP) / BAR_COUNT - BAR_GAP
const BAR_BOTTOM = SVG_HEIGHT * 15 / 16

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
        }
    },
    mounted () {
        this.init()
        this.drawBar()
    },
    mixins: [drawArrow],
    methods: {
        init () {
            this.svgElement = d3.select('#selectionsort')
                .attr('width', SVG_WIDTH)
                .attr('height', SVG_HEIGHT)

            let temp = this.svgElement.append('g')
            for (let i = 1; i < 4; i += 1) {
                temp.append('line')
                    .attr('x1', 0)
                    .attr('x2', SVG_WIDTH)
                    .attr('y1', SVG_HEIGHT * i / 8)
                    .attr('y2', SVG_HEIGHT * i / 8)
            }
            // element for i
            let iteratorI = this.svgElement.append('g')
                .attr('class', 'iteratorI')
            iteratorI.append('text')
                .attr('x', 0)
                .attr('y', SVG_HEIGHT / 8)
                .attr('dy', TEXT_DY)
                .attr('text-anchor', 'middle')
                .text('i')
            this.drawArrow({
                element: iteratorI,
                startX: 0,
                endX: 0,
                startY: SVG_HEIGHT / 8,
                endY: SVG_HEIGHT / 8 + ARROW_LENGTH,
            })
            // element for min
            let minimum = this.svgElement.append('g')
                .attr('class', 'minimum')
            minimum.append('text')
                .attr('x', 0)
                .attr('y', SVG_HEIGHT / 4)
                .attr('dy', TEXT_DY)
                .attr('text-anchor', 'middle')
                .text('min')
            this.drawArrow({
                element: minimum,
                startX: 0,
                endX: 0,
                startY: SVG_HEIGHT / 4,
                endY: SVG_HEIGHT / 4 + ARROW_LENGTH,
            })
            // element for j
            let iteratorJ = this.svgElement.append('g')
                .attr('class', 'iteratorJ')
            iteratorJ.append('text')
                .attr('x', 0)
                .attr('y', SVG_HEIGHT / 4)
                .attr('dy', TEXT_DY)
                .attr('text-anchor', 'middle')
                .text('j')
            this.drawArrow({
                element: iteratorJ,
                startX: 0,
                endX: 0,
                startY: SVG_HEIGHT / 4,
                endY: SVG_HEIGHT / 4 + ARROW_LENGTH,
            })
            this.updateArrow('iteratorI', 0)
            this.updateArrow('minimum', 0)
            this.updateArrow('iteratorJ', 1)
        },
        updateArrow (className, value) {
            const x = getX(value) + BAR_WIDTH * 0.5
            this.svgElement.select(`g.${className}`)
                .transition()
                .duration(DURATION)
                .attr('transform', `translate(${x}, 0)`)
        },
        drawBar () {
            let bar = this.svgElement.selectAll('rect')
                .data(this.dataSet, (d) => { return d })

            let yScale = d3.scaleLinear()
                .domain([0, d3.max(this.dataSet)])
                .range([0, SVG_HEIGHT * 0.5])

            let barEnter = bar.enter()

            barEnter.append('rect')
                .attr('width', BAR_WIDTH)
                .attr('height', (d) => { return yScale(d) })
                .attr('x', (d, i) => {
                    return getX(i)
                })
                .attr('y', (d) => {
                    return BAR_BOTTOM - yScale(d)
                })

            barEnter.append('text')
                .text((d) => { return d })
                .attr('text-anchor', 'start')
                .attr('x', (d, i) => {
                    return getX(i)
                })
                .attr('y', (d) => {
                    return BAR_BOTTOM - yScale(d)
                })

            barEnter.append('text')
                .text((d, i) => { return i })
                .attr('text-anchor', 'start')
                .attr('x', (d, i) => {
                    return getX(i)
                })
                .attr('y', () => {
                    return BAR_BOTTOM
                })
        },
        handleSort () {
            this.isSorting = true
            let minimum
            for (let i = 0; i < BAR_COUNT; i += 1) {
                minimum = i
                this.taskQueue.push({
                    className: 'iteratorI',
                    value: i,
                })
                this.taskQueue.push({
                    className: 'minimum',
                    value: i,
                })
                for (let j = i + 1; j < BAR_COUNT; j += 1) {
                    this.taskQueue.push({
                        className: 'iteratorJ',
                        value: j,
                    })
                    if (this.dataSet[j] < this.dataSet[minimum]) {
                        minimum = j
                        this.taskQueue.push({
                            className: 'minimum',
                            value: j,
                        })
                    }
                }
                let temp = this.dataSet[i]
                this.dataSet[i] = this.dataSet[minimum]
                this.dataSet[minimum] = temp
            }
            let that = this
            function delay () {
                setTimeout(() => {
                    let { className, value } = that.taskQueue.shift()
                    that.updateArrow(className, value)
                    if (that.taskQueue.length > 0) {
                        delay()
                    } else {
                        this.isSorting = false
                    }
                }, DURATION)
            }
            delay()
        },
    },
}
</script>

<style lang="scss">
.selection-sort {
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
