<template>
  <div id="myChartInstall" :style="{ width: width, height: height }" />
</template>

<script>
import { meterIsNotInstall } from '@/service/api'
export default {
  props: {
    width: {
      type: String,
      default: '200px'
    },
    height: {
      type: String,
      default: '200px'
    }
  },

  data () {
    return {

    }
  },

  mounted () {
    this.init()
    this.meterIsNotInstall()
  },

  methods: {
    getMonDay () {
      let curDate = new Date();
      /* 获取当前月份 */
      let curMonth = curDate.getMonth();
      /* 生成实际的月份: 由于curMonth会比实际月份小1, 故需加1 */
      curDate.setMonth(curMonth + 1);
      /* 将日期设置为0, 这里为什么要这样设置, 我不知道原因, 这是从网上学来的 */
      curDate.setDate(0);
      /* 返回当月的天数 */
      let days = curDate.getDate();
      let nums = []
      for (let key = 0; key < days; key++) {
        nums.push(key + 1)
      }
      return nums
    },
    init () {
      const self = this
      let myChart = this.$echarts.init(document.getElementById('myChartInstall'))
      let option = {
        title: {
          text: '本月新增用户或水表',
          padding: [20, 10]
        },
        tooltip: {
          trigger: 'axis',
          padding: 10,
          backgroundColor: "rgba(2,15,34,0.8)",
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'none' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        color: ['#8F74FF'],
        toolbox: {
          show: true,
          padding: [20, 10],
          feature: {
            magicType: { type: ['line', 'bar'] }
          }
        },
        xAxis: {
          type: 'category',
          data: self.getMonDay() || [],
          axisLabel: {
            color: '#F00'
          }
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: [200, 100, 501, 934, 590, 830, 130, 500, 1600, 1200, 20, 200, 100, 501, 934, 590, 830, 130, 500, 1600, 1200, 20, 200, 100, 501, 934, 590, 830, 130, 500, 1600],
          type: 'line'
        }]
      };

      myChart.setOption(option, true);
      window.addEventListener("resize", function () {
        myChart.resize();
      });
      // myChart.resize()
    },
    async meterIsNotInstall () { // 统计抄表安装
      const self = this;
      let param = {
        userId: self.userId
      }
      let res = await meterIsNotInstall(param)
      console.log('统计抄表安装', res)
    }
  }
}
</script>
