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

// svg size
const SVG_WIDTH = 960
const SVG_HEIGHT = 800
// space between bars
const BAR_GAP = 10
const BOTTOM = SVG_HEIGHT * 7 / 8

export default {
    data () {
        return {
            dataSet: [
                110, 199, 4, 48, 190, 32, 148, 161, 36, 177, 115, 30, 58, 197, 72, 134, 107, 143, 28, 81,
            ],
            isSorting: false,
        }
    },
    mounted () {
        this.drawBar()
    },
    methods: {
        drawBar () {
            const barWidth = (SVG_WIDTH - BAR_GAP) / this.dataSet.length
            let svg = d3.select('#selectionsort')
                .attr('width', SVG_WIDTH)
                .attr('height', SVG_HEIGHT)

            let bar = svg.selectAll('rect')
                .data(this.dataSet, (d) => { return d })

            let yScale = d3.scaleLinear()
                .domain([0, d3.max(this.dataSet)])
                .range([0, SVG_HEIGHT * 0.5])

            let barEnter = bar.enter()

            barEnter.append('rect')
                .attr('width', barWidth - BAR_GAP)
                .attr('height', (d) => { return yScale(d) })
                .attr('x', (d, i) => {
                    return barWidth * i + BAR_GAP
                })
                .attr('y', (d) => {
                    return BOTTOM - yScale(d)
                })

            barEnter.append('text')
                .text((d) => { return d })
                .attr('text-anchor', 'start')
                .attr('x', (d, i) => {
                    return barWidth * i + BAR_GAP
                })
                .attr('y', (d) => {
                    return BOTTOM - yScale(d)
                })
        },
        handleSort () {

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
