<template>
    <el-container class="t-header">
        <el-col :span="21" :offset="3" class="t-header-row">
            <img :src="icon" alt="icon" @click="handleIconClick">
        </el-col>
    </el-container>
</template>

<script>
const icon = require('../assets/logo.jpg')

export default {
    data () {
        return {
            icon,
        }
    },
    methods: {
        handleIconClick () {
            this.$router.push('/')
        },
    },
}
</script>

<style lang="scss">
.t-header {
    height: 80px;
    z-index: 1500;
}
.t-header-row {
    display: flex;
    align-items: center;
}
img {
    height: 50px;
    cursor: pointer;
}
</style>
