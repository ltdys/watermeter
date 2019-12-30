<template>
  <div id="myChartAlarm" :style="{ width: width, height: height }" />
</template>

<script>
import { list_mixins } from '@/mixins'
import { meterIsNotOnline } from '@/service/api'
export default {
  mixins: [list_mixins],
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
      xAxis: [],
      dataList: [100, 932, 201, 934, 1290, 1330, 1320, 600, 600, 200, 200, 100, 932, 201, 934, 1290, 1330, 1320, 600, 600, 200, 200, 100, 932, 201, 934, 1290, 1330, 1320, 600, 600]
    }
  },

  mounted () {
    this.xAxis = this.getMonDay()
    this.init()
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
        let k = (key + 1) < 10 ? '0' + (key + 1) : (key + 1)
        let date = curDate.getFullYear() + '-' + (curDate.getMonth() + 1) + '-' + k
        nums.push(date)
      }
      return nums
    },
    init () {
      this.meterIsNotOnline()
    },
    async meterIsNotOnline () { // 统计抄表失败
      const self = this;
      let param = {
        userId: self.userId
      }
      let res = await meterIsNotOnline(param)
      console.log('统计抄表失败', res)
      if (res.status == 200 && res.data.code == 1) {
        let list = res.data.data
        self.xAxis = list.map(item => {
          return item.day
        })
        self.dataList = list.map(item => {
          return item.total
        })
        self.$nextTick(() => {
          self.notOnlineEchart()
        })
      } else {
        self.$message.error(res.data.message);
        // self.xAxis = self.getMonDay()
        // self.dataList = Array(self.xAxis.length).fill(0)
        // self.notOnlineEchart()
      }
    },
    notOnlineEchart () {
      const self = this;
      let myChart = this.$echarts.init(document.getElementById('myChartAlarm'))
      let option = {
        title: {
          text: '当前账户抄表失败统计',
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
        color: ['#8FEA90'],
        toolbox: {
          show: true,
          padding: [20, 10],
          feature: {
            magicType: { type: ['line', 'bar'] }
          }
        },
        xAxis: {
          type: 'category',
          data: self.xAxis,
          axisLabel: {
            color: '#F00'
          }
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: self.dataList,
          type: 'line'
        }]
      };

      myChart.resize()
      myChart.setOption(option);
      window.addEventListener("resize", function () {
        myChart.resize();
      });
      myChart.on('click', function (params) {
        console.log(params)
        self.$router.push('/meter-reading/alarm')
      })
    }
  }
}
</script>
