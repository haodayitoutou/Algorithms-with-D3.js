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

export default {
    data () {
        return {
            isSorting: false,
        }
    },
    mounted () {
        this.drawLabels()
    },
    methods: {
        drawLabels () {
            let svg = d3.select('#selectionsort')
                .attr('width', SVG_WIDTH)
                .attr('height', SVG_HEIGHT)
            svg.append('g')
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
