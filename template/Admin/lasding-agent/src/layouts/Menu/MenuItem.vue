<template>
  <el-submenu
    :index="data.path"
    v-if="data.children && data.children.length > 0"
  >
    <template slot="title">
      <i :class="data.meta.icon"></i>
      <span>{{data.meta.title}}</span>
    </template>
    <template v-for="item in data.children">
      <menu-item
        v-if="!item.hidden"
        :key="item.path"
        :data="item"
      ></menu-item>
    </template>
  </el-submenu>
  <el-menu-item :index="data.path" v-else>
    <i :class="data.meta.icon"></i>
    <span slot="title">{{data.meta.title}}</span>
  </el-menu-item>

</template>

<script>
export default {
  name: 'MenuItem',
  props: {
    data: {
      type: Object,
      default () {
        return {

        }
      }
    }
  }
}
</script>

<style>

</style>
