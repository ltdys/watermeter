<template>
  <el-row class="container">
    <el-col :span="24" class="header">
      <el-col
        :span="10"
        class="logo"
        :class="collapsed?'logo-collapse-width':'logo-width'"
      >{{ userInfo.sysName }}</el-col>
      <el-col :span="10">
        <div class="tools" @click.prevent="collapse">
          <i :class="[!collapsed ? 'el-icon-s-fold' : 'el-icon-s-unfold']" />
        </div>
      </el-col>
      <el-col :span="4" class="userinfo">
        <el-dropdown trigger="hover">
          <span class="el-dropdown-link userinfo-inner">
            <img :src="userInfo.img">
            {{ userInfo.name }}
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>我的消息</el-dropdown-item>
            <el-dropdown-item>设置</el-dropdown-item>
            <el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-col>
    <el-col :span="24" class="main">
      <!--导航菜单-->
      <my-menu :menus="menus" :collapse="collapsed" />
      <section class="content-container">
        <div class="grid-content bg-purple-light">
          <el-col :span="24" class="breadcrumb-container">
            <tags-views />
          </el-col>
          <el-col :span="24" class="content-wrapper">
            <transition name="fade" mode="out-in">
              <keep-alive :include="cachedViews">
                <router-view :key="key" />
              </keep-alive>
            </transition>
          </el-col>
        </div>
      </section>
    </el-col>
  </el-row>
</template>

<script>
import myMenu from "@/components/common/menu";
import tagsViews from "@/components/TagsView/index"

export default {
  components: { myMenu, tagsViews },

  data () {
    return {
      collapsed: false,
      menus: [
        {
          id: "1",
          name: "系统参数",
          icon: "menu",
          url: "/system",
          level: 1,
          pids: [],
          children: [
            {
              id: "1-1",
              name: "错误消息管理",
              icon: "s-comment",
              url: "/system/error-code",
              level: 2
            },
            {
              id: "1-2",
              name: "数据字典管理",
              icon: "date",
              url: "/system/data-dictionary",
              level: 2
            },
            {
              id: "1-3",
              name: "系统参数配置",
              icon: "tickets",
              url: "/system/system-parameter",
              level: 2
            },
            {
              id: "1-4",
              name: "模拟页面创建",
              icon: "connection",
              url: "/system/simulate",
              level: 2
            }
          ]
        }
      ],
      userInfo: {
        sysName: "数字化运营平台",
        name: "中投用户",
        img: "static/user.png"
      }
    };
  },

  computed: {
    cachedViews () {
      return this.$store.state.tagsView.cachedViews
    },
    key () {
      return this.$route.path
    }
  },

  methods: {
    collapse () {
      this.collapsed = !this.collapsed;
    }
  }
};
</script>y

<style lang="scss">
$color-primary: #20a0ff;

.container {
  position: absolute;
  top: 0px;
  bottom: 0px;
  width: 100%;

  .header {
    height: 60px;
    line-height: 60px;
    background: $color-primary;
    color: #fff;
    .userinfo {
      text-align: right;
      padding-right: 35px;
      float: right;
      .userinfo-inner {
        cursor: pointer;
        color: #fff;
        img {
          width: 40px;
          height: 40px;
          border-radius: 20px;
          margin: 10px 0px 10px 10px;
          float: right;
        }
      }
    }
    .logo {
      //width:230px;
      height: 60px;
      font-size: 22px;
      padding-left: 20px;
      padding-right: 20px;
      border-color: rgba(238, 241, 146, 0.3);
      border-right-width: 1px;
      border-right-style: solid;
      transition: 0.5s all;
      img {
        width: 40px;
        float: left;
        margin: 10px 10px 10px 18px;
      }
      .txt {
        color: #fff;
      }
      &.logo-width {
        width: 230px;
      }
      &.logo-collapse-width {
        width: 60px;
      }
    }
    .tools {
      padding: 0px 23px;
      width: 14px;
      height: 60px;
      line-height: 60px;
      cursor: pointer;
      i {
        font-size: 18px;
      }
    }
  }
  .main {
    display: flex; // background: #324057;
    position: absolute;
    top: 60px;
    bottom: 0px;
    overflow: hidden;
    .menu {
      flex: 0 0 60px;
      width: 60px;
      &:not(.el-menu--collapse) {
        flex: 0 0 230px;
        width: 230px;
      }
    }
    .content-container {
      flex: 1;
      // overflow-y: scroll;
      // padding: 20px;
      padding: 12px;
      .breadcrumb-container {
        //margin-bottom: 15px;
        height: 32px;
        .title {
          width: 200px;
          float: left;
          color: #475669;
        }
        .breadcrumb-inner {
          float: right;
        }
      }
      .content-wrapper {
        background-color: #fff;
        box-sizing: border-box;
      }
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>
