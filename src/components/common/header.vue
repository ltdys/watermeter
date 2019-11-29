<template>
  <div class="header">
    <div class="header_main">
      <div class="header_main_header">
        <div class="header_main_header__left">
          <img src="static/hyy_logo.png" alt="..">
          <hr>
          <span>{{ $t('nav.title') }}</span>
        </div>

        <!-- <el-select v-model="lang" size="mini" @change="lanageChange()">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select> -->

        <div class="header_main_header__center">
          <div v-for="(item, index) in navList" :key="index" class="header_main_header__center___wrap" :class="[item.id == currentId ? 'nav-ischeck' : 'nav-default']">
            <span :title="item.name" @click="navChange(item)">{{ item.name }}</span>
          </div>
        </div>
        <div class="header_main_header__right">
          <icon name="head_default" style="width: 32px;height: 40px" />
          <span class="header_main_header__right___we">{{ $t('nav.welcome') }}<span class="header_main_header__right___name">{{ userInfo.name }}</span></span>
          <div class="header_main_header__right___wrap" @click="loginOut">
            <icon name="login_out" style="width: 32px;height: 40px" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import myMenu from "@/components/common/menu"
import tagsViews from "@/components/TagsView/index"
import { treeData, recursionDelete } from '@/utils/publicUtil'
import { list_mixins } from '@/mixins'
import { menu_list } from '@/utils/menu.js'

export default {
  name: 'commonHeader',

  components: { myMenu, tagsViews },

  mixins: [list_mixins, menu_list],

  data () {
    return {
      isHideSidebar: false,
      collapsed: false,
      userInfo: {
        sysName: "海洋供水大数据分析平台",
        name: "ADMIN",
        business: "ADMIN",
        img: "static/man1.png"
      },
      hasPadding: true,
      options: [{
        label: '简体中文',
        value: 'zh'
      }, {
        label: 'English',
        value: 'en'
      }],
      lang: 'zh'
    };
  },

  computed: {
    navList () {
      return this.$store.getters.getNavList
    },
    currentId () {
      return this.$store.getters.getCurrentId
    }
  },

  created () {

  },

  methods: {
    navChange (value) {
      console.log(value)
      this.navList.forEach((item, index) => {
        item.isCheck = item.name === value.name
      })

      let currentTitle = value.children && value.children.length > 0 ? value.children[0].name : value.name
      this.$store.dispatch('slidebar/setMenuList', value.children)
      this.$store.dispatch('slidebar/setCurrentId', value.id)
      this.$store.dispatch('tagsView/setCurrentTitle', currentTitle)
      this.$router.push(value.url)
    },
    loginOut () {
      localStorage.clear()
      this.$router.push('/login')
    },
    lanageChange () {
      this.$i18n.locale = this.lang
      this.$store.dispatch('app/setLanguage', this.lang)
    }
  }
};
</script>

<style lang="scss">
.header {
  width: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  overflow: hidden;
  color: #fff;
	&_main {
		position: relative;
		margin-left: 210px;
    transition: margin .28s;
		&_header {
			background-color: #020F22;
      height: 80px;
      line-height: 80px;
      margin-left: -210px;
      display: flex;
      justify-content: space-between;
      padding-left: 33px;
      &__left {
        display: flex;
        align-items: center;
        span {
          font-size: 22px;
          font-family: FZLTTHB--B51;
          font-weight: normal;
          color: #D9DBE1;
        }
        hr {
          height: 19px;
          width: 1px;
          opacity: 0.3;
          background: rgba(216, 216, 216, 1);
          color: #D8D8D8;
          margin: 0 13px;
        }
        img {
          // width: 140px;
          height: 40px;
        }
      }
      &__center {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        font-weight: normal;
        width: 600px;
        &___wrap {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100px;
          height: 40px;
          border-radius: 6px;
          margin-right: 1.46vw;
          cursor: pointer;
          span {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
      &__right {
        display: flex;
        justify-content: center;
        align-items: center;
        &___wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 80px;
          height: 80px;
          box-shadow: -1px 0px 0px 0px rgba(63, 72, 94, 1);
          cursor: pointer;
        }
        &___we {
          color: #9EA0A6;
          font-size: 16px;
          display: inline-block;
          margin-left: 0.5vw;
        }
        &___name {
          font-size: 18px;
          color: #0084FF;
          display: inline-block;
          margin-left: 0.5vw;
          margin-right: 2vw;
        }
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
      height: calc(100vh - 60px);
      background-color: #F0F4FB;
      &_real {
        padding: 0 0px 0px 20px;
      }
    }
  }
  .content-wrapper {
    background: #fff;
    padding: 0px 0px 0px 20px;
  }
  .content-wrapper-padding {
    padding: 0px 0px 0px 20px;
  }
  .breadcrumb-container{
    margin-bottom: 15px;
  }
  .nav-ischeck {
    background: #0084FF;
    color: #fff;
    padding: 0 18px;
  }
  .nav-default {
    background: transparent;
    color: #9EA0A6;
  }
  .el-scrollbar__view{
    // background-color: red;
    // position: relative;
    // margin-top:-7px;
    // top: -7px;
  }
}

.hide_sidebar{
  width:66px;
}
.hide_sidebar_active{
  margin-left: 66px;
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
