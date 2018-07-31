<template>
    <div class="home">
        <div class="header-wrapper">
            <t-header></t-header>
        </div>
        <div class="content-wrapper">
            <div class="menu-wrapper">
                <t-menu></t-menu>
            </div>
            <div class="content">
                <router-view></router-view>
            </div>
        </div>
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
}
.header-wrapper {
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 1500;
}
.content-wrapper {
    width: 1440px;
    height: 100%;
    min-height: auto;
    margin: 80px auto 0;
    padding: 0;
}
.menu-wrapper {
    position: fixed;
    top: 80px;
    bottom: 0;
    border-right: solid 1px #e6e6e6;
}
.content {
    box-sizing: border-box;
    padding-left: 240px;
    svg {
        border: 1px solid green;
    }
}
</style>
