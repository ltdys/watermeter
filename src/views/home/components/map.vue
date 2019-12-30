<template>
  <div class="amap-page-container">
    <div :style="{width:'100%',height:'530px'}">
      <div class="amap-page-container_top">
        <span>{{ $t('chart.mapTitle') }}</span>
        <!-- <el-amap-search-box class="search-box" :search-option="searchOption" :on-search-result="onSearchResult"></el-amap-search-box> -->
      </div>
      <div class="amap-page-container_bottom" id="mapContainer">
      </div>
    </div>
  </div>
</template>

<script>
import { geocode } from "@/service/map"
export default {
  data () {
    const self = this;
    return {
      center: [114.057868,22.543099],
      key: "112840ed7892989fa8faf9e33f0a7f02",
      output: "json",
      address: "中国广东省深圳市",
      map: null,
      marker: null,
      infoWindow: null
    }
  },
  created() {
    // this.geocode()
  },
  mounted() {
    this.init()
  },
  methods: {
    async geocode() {
      let params = `?key=${this.key}&address=${this.address}`;
      let resData = await geocode(params)
      if(resData.status === 200 && resData.data.status === "1") {
        let temp = resData.data.geocodes[0].location
        this.center[0] = temp.split(",")[0]
        this.center[1] = temp.split(",")[1]
      }
    },
    init() {
      this.map = new AMap.Map('mapContainer', {
          resizeEnable: true, //是否监控地图容器尺寸变化
          zoom:13, //初始化地图层级
          center: this.center //初始化地图中心点
      });

      // this.map.on("complete", function(){
      // });

      this.map.on("complete", () => {
        this.markerAndInfoInit()
        // this.markerInit()
        // this.openInfo()
      })
    },
    // 点标记
    markerInit() {
      this.marker = new AMap.Marker({
        icon: "http://a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
        position: [114.057868,22.543099],
        offset: new AMap.Pixel(-13, -30)
      });
      this.marker.setMap(this.map);
    },

    // 在指定位置打开信息窗体
    openInfo() {
      var info = [];
      var infoHtml = `<div>
        <p class='input-item'>区域：西丽法庭2世纪花园</p>
        <p class='input-item'>水表：100个</p>
        <p class='input-item'>设备：2个</p>
      </div>`;
      info.push(infoHtml);

      this.infoWindow = new AMap.InfoWindow({
          content: info.join("")  //使用默认信息窗体框样式，显示信息内容
      });

      this.infoWindow.open(this.map, this.map.getCenter());
    },

    // 给多个点添加点信息窗体
    markerAndInfoInit() {
      var lnglats = [
        [114.057868,22.543099],
        [114.037868,22.583099],
        [114.017868,22.503099],
        [114.097868,22.523099]
      ];
      let infoHtml = `<div>
            <p class='input-item'>区域：西丽法庭2世纪花园</p>
            <p class='input-item'>水表：100个</p>
            <p class='input-item'>设备：2个</p>
          </div>`;
      this.infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)});
      for (var i = 0; i < lnglats.length; i++) {
          this.marker = new AMap.Marker({
              position: lnglats[i],
              map: this.map
          });
          this.marker.content = infoHtml;
          this.marker.on('click', this.markerClick);
          this.marker.emit('click', {target: this.marker});
      }
      this.map.setFitView();
    },
    markerClick(e) {
      this.infoWindow.setContent(e.target.content);
      this.infoWindow.open(this.map, e.target.getPosition());
    }
  }
}
</script>

<style lang="scss">
  .amap-page-container {
    box-sizing: border-box;
    padding: 0 22px;
    background: #fff;
    &_top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 60px;
      > span {
        color: #292C33;
        font-size: 16px;
        font-weight: 800;
      }
    }
    &_bottom {
      height: 470px;
    }
  }
  .amap-demo {
    height: 530px;
  }
  .search-box {
    height: 40px !important;
  }
</style>