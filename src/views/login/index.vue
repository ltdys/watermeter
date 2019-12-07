<template>
  <div class="login">
    <div class="login_left">
      <img src="static/login.png" alt="..">
      <img src="static/hyy_logo.png" alt=".." class="login_left__dllogo">
      <span class="login_left__title">{{ $t('nav.title') }}</span>
    </div>
    <div class="login_right">
      <div class="login_right__zh">
        <el-select v-model="lang" size="mini" @change="lanageChange()">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div class="login_right__welcome">
        <span>{{ $t('login.title') }}</span>
        <span>&nbsp;/&nbsp;WELCOME</span>
      </div>
      <div class="input-wrap">
        <input v-model="form.code" type="text" :placeholder="$t('login.code')">
      </div>
      <div class="input-wrap">
        <input v-model="form.account" placeholder="输入账号">
      </div>
      <div class="input-wrap">
        <input v-model="form.password" type="password" :placeholder="$t('login.password')" @keyup.enter="loginSubmit">
      </div>
      <div class="login_right__nologin">
        <input v-model="checked" type="checkbox">
        <span>{{ $t('login.freeLogin') }}</span>
      </div>
      <div class="input-wrap">
        <el-button type="primary" @click="loginSubmit">{{ $t('login.login') }}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import i18n from '@/lang'
import { login, findCompany, findDistrict } from "@/service/api"
import { treeDataUtil, saveTwo, orgTreeData } from "@/utils/publicUtil"
export default {
  data () {
    return {
      form: {
        code: '',
        account: '',
        password: ''
      },
      options: [{
        label: '简体中文',
        value: 'zh'
      }, {
        label: 'English',
        value: 'en'
      }],
      lang: 'zh',
      checked: false,
      companyData: [],
      districtData: []
    }
  },

  created () {
    this.lang = this.$store.getters.language || 'zh'
  },

  methods: {
    lanageChange () {
      this.$i18n.locale = this.lang
      this.$store.dispatch('app/setLanguage', this.lang)
    },
    async loginSubmit () {
      let params = {
        userName: this.form.account,
        password: this.form.password,
        // companyId: "CPD60A8B2CFA3E45AFAFE8B616443C15EB"
        companyId: this.form.code
      }
      let resData = await login(params)
      if (resData.status === 200 && resData.data.data !== null) {
        localStorage.setItem("USER_INFO", JSON.stringify(resData.data.data));
        let userId = resData.data.data.userId || ""
        let companyId = resData.data.data.companyId || ""
        let roleName = resData.data.data.roleName || ""
        this.findCompany(userId, companyId, roleName);
        this.findDistrict(companyId, roleName);
      } else {
        this.$message.warning(i18n.t('login.tip'))
      }
    },
    // 查询组织
    async findCompany (userId, companyId, roleName) {
      companyId = roleName === "超级管理员" ? "" : companyId
      let params = {
        userId: userId,
        currentPage: 1,
        pageSize: 1000,
        company: {
          id: companyId
        }
      }
      let resData = await findCompany(params)
      if (resData.status === 200) {
        let list = resData.data.data
        this.companyData = list
        this.$store.dispatch("user/setCompanyData", this.companyData)
      }
      this.$router.push("/")
    },
    async findDistrict (companyId, roleName) { // 查询区域
      const self = this;
      companyId = roleName === "超级管理员" ? "" : companyId
      let params = {
        companyId: companyId
      }
      let res = await findDistrict(params)
      console.log('登录查询区域返回值', res)
      if (res.status === 200 && res.data.data !== null) {
        let list = res.data.data || []
        if (list.length !== 0) {
          list = list.map(item => {
            self.$set(item, 'parentId', item.parentid)
            self.$set(item, 'companyId', item.companyid)
            return item
          })
          self.$nextTick(() => {
            this.districtData = JSON.parse(treeDataUtil([...list], 'parentId', 'id'))
            this.districtData = saveTwo(this.districtData)
            this.$store.dispatch("user/setDistrictData", this.districtData || [])
          })
        } else {
          this.districtData = list
          this.$store.dispatch("user/setDistrictData", this.districtData || [])
        }
      }
    }
  }
}
</script>

<style lang="scss">
  .login {
    width: 100%;
    height: 100%;
    display: flex;
    box-sizing: border-box;
    color: #fff;
    &_left {
      width: 69%;
      height: 100%;
      overflow: hidden;
      > img {
        width: 100%;
        height: 100%;
      }
      &__dllogo {
        width: 200px !important;
        height: 69px !important;
        position: absolute;
        top: 50px;
        left: 5.26%;
      }
      &__title {
        position: absolute;
        bottom: 86px;
        left: 5.269%;
        font-size: 58px;
        font-family:FZLTTHK--GBK1-0,FZLTTHK--GBK1;
        font-weight:normal;
        color:rgba(255,255,255,1);
        line-height:84px;
      }
    }
    &_right {
      width: 31%;
      background: #2f3f54;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      &__zh {
        position: absolute;
        top: 30px;
        right: 5.7%;
      }
      &__welcome {
        margin-bottom: 40px;
        span:nth-child(1) {
          font-size: 30px;
          font-weight: normal;
          color: #fff;
          font-family:FZLTTHK--GBK1-0,FZLTTHK--GBK1;
        }
        span:nth-child(2) {
          font-size: 20px;
          font-family: PingFang-SC-Bold,PingFang-SC;
          font-weight: bold;
          color: #4F687E;
        }
      }
      &__nologin {
        margin-top: -30px;
        margin-bottom: 40px;
        width: 63.33%;
        color: #8898AE;
        input {
          vertical-align: middle;
          margin-top: 0;
        }
      }
    }
    .input-wrap {
      display: flex;
      width: 100%;
      justify-content: center;
      margin-bottom: 40px;
      color: red;
      input {
        width: 63.33%;
        -webkit-appearance: none;
        background-color: #3C4E66;
        background-image: none;
        border-radius: 4px;
        border: 1px solid rgba(136, 152, 174, 1);
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        color: #8898AE;
        display: inline-block;
        font-size: inherit;
        height: 50px;
        line-height: 50px;
        outline: none;
        padding: 0 15px;
      }
      input::-webkit-input-placeholder {
        color: #8898AE;
      }
      .el-button--primary {
        width: 63.33%;
        background: #0084FF;
        border-radius: 4px;
        font-size: 18px;
        font-weight: normal;
        font-family:FZLTTHK--GBK1-0,FZLTTHK--GBK1;
      }
    }
    .el-select {
      width: 98px;
    }
    .el-input--mini .el-input__inner {
      color: #8898AE;
    }
  }
</style>
