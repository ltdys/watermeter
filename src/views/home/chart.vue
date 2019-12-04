<template>
  <div class="chart">
    <div class="chart_header">
      <my-header />
    </div>
    <div class="chart_content">
      <div class="chart_content__top">
        <div class="chart_content__top___data">
          <div v-for="(item, index) in deviceList" :key="index">
            <icon name="example" style="width: 36px;height: 36px" />
            <span class="chart-value">{{ item.value }}</span>
            <span class="chart-label">{{ item.label }}</span>
          </div>
        </div>
        <div class="chart_content__top___map">
          <my-map />
        </div>
      </div>
      <div class="chart_content__bottom">
        <water-statistics width="26%" height="340" class="chart_content__bottom___water" />
        <alarm-statistics width="26%" height="340" class="chart_content__bottom___alarm" />
        <install-statistics width="41.6%" height="340" class="chart_content__bottom___install" />
      </div>
    </div>
  </div>
</template>

<script>
import myHeader from '@/components/common/header'
import myMap from './components/map'
import waterStatistics from './components/water-statistics'
import alarmStatistics from './components/alarm-statistics'
import installStatistics from './components/install-statistics'
import { list_mixins } from '@/mixins'
import { wealthTreeData } from '@/utils/publicUtil'
import { getUserResource, countMeterNbIotL } from '@/service/api'
import i18n from '@/lang'

export default {
  name: 'chart',

  components: { myHeader, myMap, waterStatistics, alarmStatistics, installStatistics },

  mixins: [list_mixins],

  data () {
    return {
      isHideSidebar: false,
      collapsed: false,
      hasPadding: true,
      deviceList: [{
        label: i18n.t('chart.deviceTotal'),
        value: 3240
      }, {
        label: i18n.t('chart.deviceOnline'),
        value: 5420 //设备在线
      }, {
        label: i18n.t('chart.alarmStatistics'),
        value: 2513
      }, {
        label: i18n.t('chart.deviceOffline'),
        value: 6514
      }],
      listBf: []
    };
  },

  computed: {
    currentId () {
      return this.$store.getters.getCurrentId
    },
    visitedViews () {
      return this.$store.state.tagsView.visitedViews
    }
  },

  created () {
    this.getUserResource()
    this.countMeterNbIotL()
    this.countMeterNbIotL1()
    this.countMeterNbIotL2()
    this.countMeterNbIotL3()
  },

  methods: {
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
        }
      } else {
        self.$message.warning(resData.data.message)
      }
    },
    async countMeterNbIotL() {  //设备在线
      let params = {
        userId: this.userId,
        meterNbIot: {
          isOnline: "0"
        }
      }
      let resData = await countMeterNbIotL(params)
      this.deviceList[1].value = resData.data.data.count || 0
    },
    async countMeterNbIotL1() {  //设备离线
      let params = {
        userId: this.userId,
        meterNbIot: {
          isOnline: "1"
        }
      }
      let resData = await countMeterNbIotL(params)
      this.deviceList[3].value = resData.data.data.count || 0
    },
    async countMeterNbIotL2() {  //设备总数
      let params = {
        userId: this.userId,
        meterNbIot: {}
      }
      let resData = await countMeterNbIotL(params)
      this.deviceList[0].value = resData.data.data.count || 0
    },
    async countMeterNbIotL3() {  //警告统计
      let params = {
        userId: this.userId,
        meterNbIot: {
          pressureAlert: "1"
        }
      }
      let resData = await countMeterNbIotL(params)
      this.deviceList[2].value = resData.data.data.count || 0
    },
  }
};
</script>

<style lang="scss">
  .chart {
    width: 100%;
    height: 100%;
    background: #f5f5f5;
    box-sizing: border-box;
    &_header {
      height: 80px;
      line-height: 80px;
    }
    &_content {
      width: 100%;
      min-height: calc(100vh - 80px);
      box-sizing: border-box;
      &__top {
        display: flex;
        width: 100%;
        height: 530px;
        margin: 50px 0px 30px 0px;
        &___data {
          width: 26%;
          display: flex;
          flex-wrap: wrap;
          margin-left: 1.6%;
          margin-right: 1.6%;
          div {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-evenly;
            width: calc(50% - 15px);
            height: 250px;
            background: #fff;
            margin-bottom: 30px;
          }
          .chart-label {
            font-size: 18px;
            font-family: FZLTTHK--GBK1-0,FZLTTHK--GBK1;
            font-weight: normal;
            color:rgba(107,121,127,1);
          }
          div:nth-child(1),div:nth-child(3) {
            margin-right: 30px;
          }
        }
        &___map {
          width: 69.2%;
          background: pink;
        }
      }
      &__bottom {
        display: flex;
        height: 340px;
        margin-bottom: 50px;
        &___water, &___alarm, &___install {
          background: #fff;
        }
        &___water {
          margin-right: 1.6%;
          margin-left: 1.6%;
        }
        &___alarm {
          margin-right: 1.6%;
        }
      }
    }
    &-value {
      font-size: 48px;
      font-family: Gotham;
      font-weight: bold;
      color: #292c33;
    }
    &-label {
      font-size: 18px;
      font-family: FZLTTHK--GBK1;
      color: #6B79cf;
    }
  }
</style>

<style>
  .amap-demo {
    height: 300px;
  }
</style>
