<template>
    <div class="menu">
        <el-menu
            unique-opened
            :default-active="$route.path.name"
            :router="true"
            active-text-color="#409eff"
        >
            <el-menu-item
                class="menu-main"
                index="Main"
                route="/"
            >
                Overview
            </el-menu-item>
            <el-menu-item-group
                v-for="(item, i) in navigator"
                :key="i"
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
.menu {
    width: 180px;
    .el-menu {
        border-right: none;
    }
    .el-menu-item {
        display: block;
        height: 40px;
        padding-left: 0 !important;
        line-height: 40px;
        overflow: hidden;
        color: #444;
    }
    .menu-main {
        height: 40px;
        margin-top: 20px;
        font-size: 16px;
        font-weight: 700;
        line-height: 40px;
        color: #333;
    }
    .el-menu-item-group__title {
        padding-left: 0 !important;
    }
}
</style>
