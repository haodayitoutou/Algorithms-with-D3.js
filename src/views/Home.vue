<template>
    <div class="home">
        <t-header></t-header>
        <el-container>
            <el-col :span="3" :offset="3">
                <t-menu></t-menu>
            </el-col>
            <el-col :span="17">
                <router-view></router-view>
            </el-col>
        </el-container>
    </div>
</template>

<script>
export default {
    data () {
        return {}
    },
}
</script>

<style lang="scss">
.home {
    position: relative;
    font-family: Helvetica Neue, Helvetica, PingFang SC, sans-serif;
    svg {
        border: 1px solid green;
    }
    rect {
        stroke: #2389ae;
        stroke-width: 2
    }
    line {
        stroke: #2389ae;
        stroke-width: 2
    }
    text {
        font-size: 20px;
    }
}
</style>
