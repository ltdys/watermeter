<template>
  <div class="amap-page-container">
    <div :style="{width:'100%',height:'530px'}">
      <div class="amap-page-container_top">
        <div>
          <span @click.self="test">{{ $t('chart.mapTitle') }}</span>
          <el-cascader
            :options="resultTreeData"
            :props="defaultProps"
            size="mini"
            class="map-cascader"
            v-model="currentCompany"
            clearable></el-cascader>
            <el-button type="primary" icon="el-icon-search" size="mini" @click.native="searchSubmit1()">查询</el-button>
        </div>
      </div>
      <div class="amap-page-container_bottom" id="mapContainer">
      </div>
    </div>
  </div>
</template>

<script>
import { geocode } from "@/service/map"
import { showDistrictInMap, findParentCompany, findCompany, findDistrict } from "@/service/api";
import { list_mixins } from '@/mixins'
import { orgTreeData, treeDataUtil, treeDataTest } from '@/utils/publicUtil'
export default {
  mixins: [list_mixins],
  data () {
    const self = this;
    return {
      center: [114.057868,22.543099],
      key: "112840ed7892989fa8faf9e33f0a7f02",
      output: "json",
      address: "中国广东省深圳市",
      map: null,
      marker: null,
      infoWindow: null,
      regionList: [],
      lnglatsList: [],

      tableDataFj: [],
      tableData: [],
      treeData: [],
      companyTreeData: [],
      filterText: '',
      defaultProps: {
        children: 'children',
        label: 'companyName',
        value: 'id',
        checkStrictly: true
      },
      resultTreeData: [],
      currentCompany: []
    }
  },
  created() {
    // this.geocode()
    this.findCompany()
  },
  mounted() {
    this.showDistrictInMap()
  },
  methods: {
    test() {
      debugger
    },
    async showDistrictInMap() {
      let params = {
        userId: this.userId,
        companyId: this.company_id
      }
      let resData = await showDistrictInMap(params)
      if(resData.status === 200) {
        this.regionList = resData.data.data
        console.log("this.regionList", this.regionList)
        
        if(this.regionList.length > 0) {
          this.regionList.forEach((item, index) => {
            if(item.distList.length > 0) {
              item.distList.forEach((item1, index1) => {
                this.lnglatsList.push({
                  companyName: item.company.companyName || "",
                  latitude: item1.dist.latitude,
                  longitude: item1.dist.longitude,
                  name: item1.dist.name,
                  address: item1.dist.address,
                  meterConcentratorNum: item1.meterConcentratorNum,
                  meterNodeNum: item1.meterNodeNum,
                  meterNum: item1.meterNum
                })
              })
            }
          })
        }
        this.init()
      }
    },
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
      this.infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)});
      for (var i = 0; i < this.lnglatsList.length; i++) {
        let temp = [this.lnglatsList[i].longitude, this.lnglatsList[i].latitude]
        if(temp[0] !== null && temp[1] !== null) {
          this.marker = new AMap.Marker({
            position: temp,
            map: this.map
          });

          let companyName = this.lnglatsList[i].companyName
          let address = this.lnglatsList[i].address
          let meterNum = this.lnglatsList[i].meterNum
          let shebeiNum = this.lnglatsList[i].meterConcentratorNum + this.lnglatsList[i].meterNodeNum

          let infoHtml = `<div>
            <p class='input-item'>组织：${companyName}</p>
            <p class='input-item'>区域：${address}</p>
            <p class='input-item'>水表：${meterNum}个</p>
            <p class='input-item'>设备：${shebeiNum}个</p>
          </div>`;

          this.marker.content = infoHtml;
          this.marker.on('click', this.markerClick);
          this.marker.emit('click', {target: this.marker});
        }
      }
      this.map.setFitView();
    },
    markerClick(e) {
      this.infoWindow.setContent(e.target.content);
      this.infoWindow.open(this.map, e.target.getPosition());
    },

    async findCompany (key) { // 获取组织机构
      const self = this
      let params = {
        userId: this.userId,
        currentPage: 1,
        pageSize: 10000
      }
      let resData = await findCompany(params)
      if (resData.status === 200 && resData.data.data !== null) {
        let list = resData.data.data
        list.forEach(item => {
          if (item.id == this.company_id && this.company_id != '') {
            self.$set(item, 'children', [])
          }
        })
        this.companyTreeData = JSON.parse(orgTreeData([...list]))
        this.findDistrict()
      }
    },
    async findDistrict () { // 查询区域
      const self = this;
      let params = {
        companyId: this.company_id
      }
      let res = await findDistrict(params)
      if (res.status === 200 && res.data.data !== null) {
        let list = res.data.data || []
        if (list.length !== 0) {
          list = list.map(item => {
            self.$set(item, 'parentId', item.parentid)
            self.$set(item, 'companyId', item.companyid)
            self.$set(item, 'companyName', item.name)
            return item
          })

          self.$nextTick(() => {
            self.tableDataFj = list
            self.tableData = JSON.parse(treeDataUtil([...list], 'parentId', 'id'))
            self.treeData = self.tableData
            console.log(self.companyTreeData)
            if (this.company_id == '') {
              self.companyTreeData.forEach((item, index) => {
                if (item.children) {
                  item.children.forEach((item1, index1) => {
                    self.treeData.forEach((item2, index2) => {
                      if (item1.id === item2.companyid) {
                        item1.children = []
                        item1.children.push(item2)
                      }
                    })
                  })
                }
              })
            } else {
              self.companyTreeData.forEach((item, index) => {
                self.treeData.forEach((item2, index2) => {
                  if (item.id === item2.companyid) {
                    item.children = []
                    item.children.push(item2)
                  }
                })
              })
            }
            self.resultTreeData = self.companyTreeData
          })
        } else {
          self.tableDataFj = list
          self.treeData = list
          self.treeData = self.tableData
        }
      }
    },
    searchSubmit1() {
      let temp = this.currentCompany
    }
  }
}
</script>

<style lang="scss">
  .amap-page-container {
    height: 100%;
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
  .map-cascader {
    margin-left: 10px;
    width: 300px;
  }
</style>