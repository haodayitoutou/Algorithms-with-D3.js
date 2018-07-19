<template>
    <div class="header">
        <div class="header-container">
            <img :src="icon" alt="icon" @click="handleIconClick">
        </div>
    </div>
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
.header {
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    height: 80px;
    line-height: 80px;
    color: #fff;
    background-color: #fff;
    z-index: 100;
}
.header-container {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    width: 1440px;
    height: 100%;
    margin: 0 auto;
}
img {
    height: 50px;
    cursor: pointer;
}
</style>
