import { mapMutations } from 'vuex'
import store from '@/store/index.js'

window.addEventListener('resize', function () {
  const clientHeight = document.documentElement.clientHeight
  const tableHeightPage = clientHeight - 102 - 50 - 70 - 20
  const tableHeight = clientHeight - 102 - 50 - 20
  const slidebarHeight = clientHeight - 60 - 20
  const iframeHeight = clientHeight - 102 - 20
  store.dispatch('setTableHeight', tableHeight)
  store.dispatch('setTableHeightPage', tableHeightPage)
  store.dispatch('setSlidebarHeight', slidebarHeight)
  store.dispatch('setIframeHeight', iframeHeight)
});
export const list_mixins = {
  data () {
    return {
      userId: '',
      userName: '',
      company_id: '',
      role_name: '',
      company_name: '',
      logo_path: ''
    }
  },

  created () {
    let userInfo = JSON.parse(localStorage.getItem("USER_INFO"))
    if (userInfo) {
      this.userId = userInfo.userId
      this.userName = userInfo.userName
      this.role_name = userInfo.roleName
      this.company_name = userInfo.companyName
      this.company_id = this.role_name === "超级管理员" ? "" : userInfo.companyId
      this.logo_path = userInfo.logoPath
    }
  },

  computed: {
    tableHeight () {
      return this.$store.getters.getTableHeight
    },
    tableHeightPage () {
      return this.$store.getters.getTableHeightPage
    },
    slidebarHeight () {
      return this.$store.getters.getSlidebarHeight
    },
    iframeHeight () {
      return this.$store.getters.getIframeHeight
    },
    companyData () {
      if (this.$store.getters.getCompanyData == "undefined" || !this.$store.getters.getCompanyData) {
        return []
      } else {
        return JSON.parse(this.$store.getters.getCompanyData)
      }
    },
    isWealth () {
      console.log('isWealth变化')
      return this.$store.getters.getIsWealth
    },
    districtData () {
      return JSON.parse(this.$store.getters.getDistrictData)
    }
  },

  methods: {
    ...mapMutations(['SET_TABLE_HEIGHT', 'GET_TABLE_HEIGHT']),
    cascaderFalse (casRef) {
      this.$refs[casRef].dropDownVisible = false
    }
  }
}
