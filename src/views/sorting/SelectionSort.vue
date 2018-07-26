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

import arrow from '../../mixins/drawArrow'

// svg size
const SVG_WIDTH = 960
const SVG_HEIGHT = 800
// space between bars
const BAR_GAP = 10
const BAR_COUNT = 20
// border width
// const STROKE_WIDTH = 2
// transition time
const DURATION = 800

const BAR_WIDTH = (SVG_WIDTH - BAR_GAP) / BAR_COUNT - BAR_GAP
const BOTTOM = SVG_HEIGHT * 7 / 8

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
            minimum: 0,
            minimumElement: null,
            current: 1,
            currentElement: null,
        }
    },
    mounted () {
        this.init()
        this.drawBar()
    },
    mixins: [arrow],
    methods: {
        init () {
            this.svgElement = d3.select('#selectionsort')
                .attr('width', SVG_WIDTH)
                .attr('height', SVG_HEIGHT)

            // minimum element
            let minimum = this.svgElement.append('g')
                .attr('class', 'minimum')

            this.drawArrow({
                element: minimum,
                startX: 0,
                endX: 0,
                startY: 150,
                endY: 650,
            })
            this.updateMinimumFlag()
        },
        updateMinimumFlag () {
            let x = getX(this.minimum) + BAR_WIDTH * 0.5
            this.svgElement.select('g.minimum')
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
                    return BOTTOM - yScale(d)
                })

            barEnter.append('text')
                .text((d) => { return d })
                .attr('text-anchor', 'start')
                .attr('x', (d, i) => {
                    return getX(i)
                })
                .attr('y', (d) => {
                    return BOTTOM - yScale(d)
                })

            barEnter.append('text')
                .text((d, i) => { return i })
                .attr('text-anchor', 'start')
                .attr('x', (d, i) => {
                    return getX(i)
                })
                .attr('y', () => {
                    return BOTTOM
                })
        },
        handleSort () {
            this.isSorting = true
            this.minimum += 1
            this.updateMinimumFlag()
            this.isSorting = false
            // let min
            // for (let i = 0; i < this.dataSet.length; i += 1) {
            //     min = i
            //     for (let j = i + 1; j < this.dataSet.length; j +=1) {
            //         if (this.dataSet[j] < this.dataSet[min]) {
            //             min = j
            //         }
            //     }
            //     let temp = this.dataSet[i]
            //     this.dataSet[i] = this.dataSet[min]
            //     this.dataSet[min] = temp
            // }
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
