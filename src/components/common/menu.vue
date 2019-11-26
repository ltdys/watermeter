<template>
  <el-menu
    class="menu nav-menu"
    :default-active="$route.fullPath"
    router
    background-color="#2B3245"
    text-color="#9EA0A6"
    active-text-color="#fff"
    :collapse="collapse"
    :collapse-transition="false"
    :default-openeds="defaultOpeneds"
  >
    <el-menu-item v-for="item in menus" :key="item.id" :index="item.url" :route="{path: item.url}" @click="menuClick(item)">
      <i :class="item.icon" />
      <span slot="title" :title="item.name">{{ item.name }}</span>
    </el-menu-item>
    <!-- <submenu v-for="menu in menus" :key="menu.id" :menu="menu" /> -->
  </el-menu>
</template>

<script>
import submenu from "./submenu";
export default {
  components: {
    submenu
  },
  props: ["menus", "collapse"],

  data () {
    return {
      defaultOpeneds: ["/system"]
    };
  },

  computed: {
    visitedViews () {
      return this.$store.state.tagsView.visitedViews
    },
    routes () {
      return this.$store.state.permission.routes
    }
  },

  methods: {
    menuClick (item) {
      this.$store.dispatch('tagsView/setCurrentTitle', item.name)
    }
  }
};
</script>

<style lang="scss">
  .nav-menu .el-menu-item {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
