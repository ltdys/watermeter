<template>
  <div class="layout">
    <div class="layout_header">
      <my-header />
    </div>
    <div class="layout_sidebar">
      <div :style="{height: (slidebarHeight) + 'px'}">
        <el-scrollbar class="scrollbar-page" wrap-class="scrollbar-wrapper">
          <my-menu :menus="menuList" />
        </el-scrollbar>
      </div>
    </div>
    <div class="layout_main">
      <section class="layout_main_content">
        <div class="grid-content bg-purple-light">
          <div class="breadcrumb-container">
            <tags-views />
          </div>
          <el-row class="layout_main_content_real">
            <el-col v-show="cachedViews.length > 0" :span="24" class="content-wrapper">
              <transition name="fade" mode="out-in">
                <!-- <keep-alive :include="cachedViews"> -->
                <router-view :key="key" />
                <!-- </keep-alive> -->
              </transition>
            </el-col>
          </el-row>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import myMenu from "@/components/common/menu"
import myHeader from '@/components/common/header'
import tagsViews from "@/components/TagsView/index"
import { treeData, recursionDelete, wealthTreeData } from '@/utils/publicUtil'
import { getUserResource, getAllResource } from '@/service/api'
import { list_mixins } from '@/mixins'
import { menu_list } from '@/utils/menu.js'
import { getSesStorage } from '@/utils/storageUtil.js'

export default {
  name: 'home',

  components: { myMenu, myHeader, tagsViews },

  mixins: [list_mixins, menu_list],

  data () {
    return {
      isHideSidebar: false,
      hasPadding: true,
      listBf: []
    };
  },

  computed: {
    cachedViews () {
      return this.$store.state.tagsView.cachedViews
    },
    key () {
      return this.$route.path
    },
    isChange () {
      return this.$store.state.slidebar.isChange
    },
    menuList () {
      return JSON.parse(this.$store.getters.getMenuList)
    },
    currentId () {
      return this.$store.getters.getCurrentId
    },
    visitedViews () {
      return this.$store.state.tagsView.visitedViews
    }
  },

  watch: {
    isChange: {
      handler: function () {
        // this.resourceList()
      },
      deep: true
    },
    isWealth: function (val) {
      // this.getUserResource()
      if (this.role_name == '超级管理员') {
        this.getAllResource()
      } else {
        this.getUserResource()
      }
    }
  },

  created () {
    this.init()
  },

  methods: {
    init () {
      // this.getUserResource()
      if (this.role_name == '超级管理员') {
        this.getAllResource()
      } else {
        this.getUserResource()
      }
    },
    async getUserResource () { // 获取菜单资源
      const self = this;
      const param = {
        // userId: self.search.id
        userId: self.userId
      }
      const resData = await getUserResource(param)
      console.log('首页获取菜单资源', resData)
      if (resData.status === 200) {
        let list = resData.data.data
        self.listBf = [...list]
        if (list.length !== 0) {
          list.forEach(item => {
            self.$set(item, 'name', item.resName)
            self.$set(item, 'value', item.displayName)
            self.$set(item, 'url', item.router)
            self.$set(item, 'level', item.id)
            self.$set(item, 'children', [])
          })
          let tableList = JSON.parse(wealthTreeData(list))
          console.log('self.currentId', self.currentId)
          let curId = 0
          tableList.forEach((item, index) => {
            if (item.id == self.currentId) {
              curId = index
            }
            if (self.currentId === '' && item.resName === '首页') {
              self.$set(item, 'isCheck', true)
            } else if (self.currentId == item.id) {
              self.$set(item, 'isCheck', true)
            } else {
              self.$set(item, 'isCheck', false)
            }
          })
          // let tableList = wealthTreeData2(list)
          self.$nextTick(() => {
            for (let i = 0; i < self.listBf.length; i++) {
              self.visitedViews.forEach((item) => {
                if (item.path == self.listBf[i].router && self.listBf[i].parent != 0) {
                  item.title = self.listBf[i].name
                }
              })
            }
            self.$store.dispatch("slidebar/setNavList", tableList)
            self.$store.dispatch('slidebar/setMenuList', tableList[curId].children)
          })
        } else {
          self.$store.dispatch("slidebar/setNavList", [])
          self.$store.dispatch('slidebar/setMenuList', [])
        }
      } else {
        self.$message.warning(resData.data.message)
      }
    },
    async getAllResource () { // 获取菜单资源
      const self = this;
      const param = {
        currentPage: 1,
        pageSize: 100
      }
      const resData = await getAllResource(param)
      console.log('首页获取菜单资源', resData)
      if (resData.status === 200) {
        let list = resData.data.data
        self.listBf = [...list]
        if (list.length !== 0) {
          list.forEach(item => {
            self.$set(item, 'name', item.resName)
            self.$set(item, 'value', item.displayName)
            self.$set(item, 'url', item.router)
            self.$set(item, 'level', item.id)
            self.$set(item, 'children', [])
          })
          let tableList = JSON.parse(wealthTreeData(list))
          console.log('self.currentId', self.currentId)
          let curId = 0
          tableList.forEach((item, index) => {
            if (item.id == self.currentId) {
              curId = index
            }
            if (self.currentId === '' && item.resName === '首页') {
              self.$set(item, 'isCheck', true)
            } else if (self.currentId == item.id) {
              self.$set(item, 'isCheck', true)
            } else {
              self.$set(item, 'isCheck', false)
            }
          })
          // let tableList = wealthTreeData2(list)
          self.$nextTick(() => {
            for (let i = 0; i < self.listBf.length; i++) {
              self.visitedViews.forEach((item) => {
                if (item.path == self.listBf[i].router && self.listBf[i].parent != 0) {
                  item.title = self.listBf[i].name
                }
              })
            }
            self.$store.dispatch("slidebar/setNavList", tableList)
            self.$store.dispatch('slidebar/setMenuList', tableList[curId].children)
          })
        } else {
          self.$store.dispatch("slidebar/setNavList", [])
          self.$store.dispatch('slidebar/setMenuList', [])
        }
      } else {
        self.$message.warning(resData.data.message)
      }
    }
  }
};
</script>

<style lang="scss">
  .layout {
    &_sidebar {
      position: fixed;
		  top: 80px;
		  bottom: 0;
		  left: 0;
	  	width: 210px;
      box-sizing: border-box;
      transition: width .28s;
      background: #2B3245;
    }
    &_header {
      height: 80px;
    }
    &_main {
      position: relative;
      margin-left: 205px;
      transition: margin .28s;
      &_header {
        padding-right: 35px;
        background-color: $blue;
        height: 60px;
        &_left_collapsed {
          width: 60px;
          height: 60px;
          padding: 0 23px;
          box-sizing: border-box;
          cursor: pointer;
          color: #fff;
          line-height: 60px;
          font-size: 18px;
        }
        .el-dropdown{
          height: 60px;
          cursor: pointer;
        }
        &_avatar_wrap{
          color: #fff;
          width: 500px;
          font: 14px;
          height: 60px;
          position: relative;
          text-align: right;
          span {
            position: absolute;
            font-family: MicrosoftYaHei;
            font-size: 14px;
            right: 58px;
          }
          span:nth-child(1) {
            top: 10px;
          }
          span:nth-child(2) {
            top: 30px;
          }
        }
        &_avatar {
          display: inline-block;
          width: 40px;
          height: 40px;
          border-radius: 20px;
          margin:10px;
        }
        &_icon {
          margin-top: 27px;
          width: 0;
          height: 0;
          border-width: 6px;
          border-style: solid;
          border-color: #fff transparent transparent transparent;
        }
      }
      &_content {
        height: calc(100vh - 80px);
        background-color: #F0F4FB;
        &_real {
          padding: 0 0px 0px 20px;
        }
      }
    }
    .breadcrumb-container{
      margin-bottom: 10px;
    }
  }
</style>
