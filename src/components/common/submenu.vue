<template>
  <el-submenu :index="menu.url">
    <template slot="title">
      <i :class="menu.icon" />
      <span slot="title" :title="menu.name">{{ menu.name }}</span>
    </template>
    <template v-for="menu2 in menu.children">
      <submenu v-if="menu2.children && menu2.children.length>0" :key="menu2.id" :menu="menu2" />
      <el-menu-item v-else :key="menu2.id" :index="menu2.url" :route="{path: menu2.url}" @click="menuClick(menu2)">
        <template slot="title">
          <i :class="menu2.icon" />
          <span :title="menu2.name" class="submenu-title">{{ menu2.name }}</span>
        </template>
      </el-menu-item>
    </template>
  </el-submenu>
</template>

<script>
// import submenu from './submenu'
export default {
  name: 'submenu',
  props: ['menu'],

  computed: {
    visitedViews () {
      return this.$store.state.tagsView.visitedViews
    },
    routes () {
      return this.$store.state.permission.routes
    }
  },

  methods: {
    menuClick (menu2) {
      this.$store.dispatch('tagsView/setCurrentTitle', menu2.name)
    }
  }
}
</script>

<style lang="scss" scoped>
  .submenu-title {
    width: 125px;
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>

