<template>
  <div class="statistical-analysis">
    <el-row>
      <el-col :span="4" :style="{height: (tableHeight + 32) + 'px', background: '#E9E9E9'}">
        <el-scrollbar class="scrollbar-page" wrap-class="scrollbar-wrapper">
          <my-region2 @handleNodeClick="handleNodeClick" />
        </el-scrollbar>
      </el-col>
      <el-col :span="20" class="statistical-analysis_wrap" :style="{height: (tableHeight + 32) + 'px', background: '#fff'}">
        <div class="statistical-analysis_wrap__title">
          <div v-for="(item, index) in statisticsList" :key="index" :class="[item.isCheck ? 'is-check' : 'is-default']" @click="conditionChange(item)">
            {{ item.label }}
          </div>
        </div>
        <div class="statistical-analysis_wrap__condition" :class="[areaObj.type != 2 ? '' : areaObj.area == 'sb' ? 'al3' : 'al2']">
          <div v-if="areaObj.type == 2" class="wrap_box">
            <span>选择类型</span>
            <el-select v-model="areaObj.area" clearable placeholder="请选择类型">
              <el-option
                v-for="item in areaList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div v-if="areaObj.type == 2 && areaObj.area == 'sb'" class="wrap_box">
            <span>选择用户</span>
            <el-select v-model="areaObj.user" clearable placeholder="请选择用户">
              <el-option
                v-for="item in userList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div class="wrap_box">
            <span>{{ $t('dataManageAnalysis.toolbarD') }}</span>
            <el-date-picker
              v-model="value1"
              type="date"
              :placeholder="$t('dataManageAnalysis.toolbarD_')"
            />
          </div>
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
import myRegion2 from '@/components/common/region2'
import waterChart from './water-chart'
import lossChart from './loss-chart'
import { list_mixins } from '@/mixins'
export default {

  name: 'statisticalAnalysis',

  components: {
    myRegion2, waterChart, lossChart
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
      value1: '',
      areaObj: {
        type: 0, // 0  默认  1  组织  2  区域
        area: '', // 选择值
        user: '' // 选择用户
      },
      areaList: [
        {
          label: '大表',
          value: 'db'
        }, {
          label: '集中器',
          value: 'jzq'
        }, {
          label: '水表',
          value: 'sb'
        }
      ],
      userList: [
        {
          label: '用户1',
          value: 'yh1'
        }, {
          label: '用户2',
          value: 'yh2'
        }, {
          label: '用户3',
          value: 'yh3'
        }, {
          label: '用户4',
          value: 'yh4'
        }, {
          label: '用户5',
          value: 'yh5'
        }, {
          label: '用户6',
          value: 'yh6'
        }, {
          label: '用户7',
          value: 'yh7'
        }, {
          label: '用户8',
          value: 'yh8'
        }
      ]
    }
  },

  created () {
  },

  methods: {
    init () {
    },
    handleNodeClick (data) {
      console.log('data', data)
      if (data.hasOwnProperty('companyid')) { // 区域
        this.areaObj.type = '2'
      } else { // 组织
        this.areaObj.type = '1'
      }
      // this.$message.success(`切换${data.label}成功`)
    },
    submitUpload () {
      this.$refs.upload.submit();
    },
    handleRemove (file, fileList) {
      console.log(file, fileList);
    },
    handlePreview (file) {
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
    .el-scrollbar__wrap {
      background: #fff;
    }
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
      .al2{
        .wrap_box {
          width: 30%;
        }
      }
      .al3{
        justify-content: left;
        padding-left: 50px;
        box-sizing: border-box;
        .wrap_box{
          margin-right: 50px;
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
