<template>
    <div class="home">
        <div class="menu">
            <el-menu
                unique-opened
                :default-active="$route.path"
                :router="true"
            >
                <el-menu-item-group
                    v-for="(item, i) in navigator"
                    :key="i"
                    :index="item.value"
                    :route="item.value"
                >
                    <template slot="title">
                        <span>{{ item.label }}</span>
                    </template>
                    <el-menu-item
                        v-for="(child, j) in item.children"
                        :key="`${i + 1} - ${j + 1}`"
                        :index="child.value.name"
                        :route="child.value"
                    >
                        {{ child.label }}
                    </el-menu-item>
                </el-menu-item-group>
            </el-menu>
        </div>
        <div class="content">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
import navigator from '../constant'

export default {
    data () {
        return {
            navigator,
        }
    },
}
</script>

<style lang="scss">
.home {
    position: relative;
    margin-top: 80px;
    margin-left: 100px;
    font-family: Helvetica Neue, Helvetica, PingFang SC, sans-serif;
}
.menu {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 220px;
    margin-top: 80px;
    .el-menu-item {
        display: block;
        height: 40px;
        line-height: 40px;
        overflow: hidden;
        color: #444;
    }
}
.content {
    box-sizing: border-box;
    padding-left: 250px;
}
</style>
