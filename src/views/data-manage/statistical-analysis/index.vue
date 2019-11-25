<template>
  <div class="statistical-analysis">
    <el-row>
      <el-col :span="4" :style="{height: (tableHeight + 32) + 'px', background: '#E9E9E9'}">
        <el-scrollbar class="scrollbar-page" wrap-class="scrollbar-wrapper">
          <my-region @handleNodeClick="handleNodeClick"></my-region>
        </el-scrollbar>
      </el-col>
      <el-col :span="20" class="statistical-analysis_wrap" :style="{height: (tableHeight + 32) + 'px', background: '#fff'}">
        <div class="statistical-analysis_wrap__title">
          <div v-for="(item, index) in statisticsList" :key="index" :class="[item.isCheck ? 'is-check' : 'is-default']" @click="conditionChange(item)">
            {{ item.label }}
          </div>
        </div>
        <div class="statistical-analysis_wrap__condition">
          <span>{{ $t('dataManageAnalysis.toolbarD') }}</span>
          <el-date-picker
            v-model="value1"
            type="date"
            :placeholder="$t('dataManageAnalysis.toolbarD_')">
          </el-date-picker>
        </div>
        <div class="statistical-analysis_wrap__charttitle">
          <div>{{ $t('dataManageAnalysis.chartTitleA') }}</div>
          <div>{{ $t('dataManageAnalysis.chartTitleB') }}</div>
        </div>
        <div class="statistical-analysis_wrap__chart">
          <water-chart width="45%" height="100%" />
          <loss-chart width="45%" height="100%" />
        </div>

      </el-col>
    </el-row>  
  </div>
</template>

<script>
import myRegion from '@/components/common/region'
import waterChart from './water-chart'
import lossChart from './loss-chart'
import { list_mixins } from '@/mixins'
export default {

  name: 'statisticalAnalysis',

  components: {
    myRegion, waterChart, lossChart
  },

  mixins: [list_mixins],

  data () {
    return {
      fileList: [],
      statisticsList: [{
        label: this.$t('dataManageAnalysis.toolbarA'),
        value: 0,
        isCheck: true
      }, {
        label: this.$t('dataManageAnalysis.toolbarB'),
        value: 1,
        isCheck: false
      }, {
        label: this.$t('dataManageAnalysis.toolbarC'),
        value: 2,
        isCheck: false
      }],
      value1: ''
    }
  },

  created () {
  },

  methods: {
    init () {
    },
    handleNodeClick (data) {
      this.$message.success(`切换${data.label}成功`)
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    conditionChange (value) {
      this.statisticsList.forEach((item, index) => {
        item.isCheck = item.label === value.label
      })
    }
  }
}
</script>

<style lang="scss">
  .statistical-analysis {
    position: relative;
    overflow: hidden;
    &_wrap {
      &__title {
        display: flex;
        justify-content: center;
        > div {
          margin-top: 30px;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 22.22%;
          height: 50px;
          border: 1px solid #E2E5EB;
          cursor: pointer;
        }
        div:nth-child(2) {
          border-left: 0px;
          border-right: 0px;
        }
      }
      &__condition {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 20px 0px;
        > span {
          font-family:PingFang-SC-Heavy,PingFang-SC;
          font-weight: 400;
          color: #292C33;
          margin-right: 10px;
        }
      }
      &__charttitle {
        display: flex;
        justify-content: space-evenly;
        div {
          width: 45%;
          height: 50px;
          box-sizing: border-box;
          line-height: 50px;
          background: #f5f5f5;
          font-family:FZLTTHK--GBK1-0,FZLTTHK--GBK1;
          font-weight:600;
          color: #292c33;
          padding-left: 20px;
        }
      }
      &__chart {
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        height: 71%;
      }
    }
    .is-check {
      background: #383F52;
      border-radius: 4px 0px 0px 4px;
      color: #fff;
      font-weight:normal;
      font-family:FZLTTHK--GBK1-0,FZLTTHK--GBK1;
    }
    .is-default {
      background: transparent;
      border-radius: 0px;
      font-weight:normal;
      font-family:PingFang-SC-Heavy,PingFang-SC;
    }
  }
</style>