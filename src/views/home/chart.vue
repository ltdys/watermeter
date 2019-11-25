<template>
  <div class="chart">
    <div class="chart_header">
      <my-header></my-header>
    </div>
    <div class="chart_content">
      <div class="chart_content__top">
        <div class="chart_content__top___data">
          <div v-for="(item, index) in deviceList" :key="index">
            <icon name="example" style="width: 36px;height: 36px"></icon>
            <span class="chart-value">{{ item.value}}</span>
            <span class="chart-label">{{ item.label }}</span>
          </div>
        </div>
        <div class="chart_content__top___map">
          <my-map></my-map>
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
        value: 5420
      }, {
        label: i18n.t('chart.alarmStatistics'),
        value: 2513
      }, {
        label: i18n.t('chart.deviceOffline'),
        value: 6514
      }]
    };
  },

  created () {
  },

  methods: {
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