// import Vue from 'vue'
const Vue = require('vue')
console.log(Vue.extend({
  name: 'home',
  data () {
    return {
      name: 'konglingzhan'
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      setTimeout(() => {
        console.log('inited')
      }, 2000)
    }
  }
}))
