<template>
  <div class="amap-page-container">
    <div :style="{width:'100%',height:'530px'}">
      <div class="amap-page-container_top">
        <div>
          <span>{{ $t('chart.mapTitle') }}</span>
            <el-cascader
              ref="cascader12"
              v-model="search.orgList"
              clearable
              placeholder="请选择组织"
              :options="treeData"
              filterable
              :props="setProps"
              size="mini"
              class="cascader12"
              @change="changeOrg"
              v-if="role_name === '超级管理员'"
            />
            <el-cascader
              ref="cascader3"
              class="cascader3"
              placeholder="请选择区域"
              size="mini"
              v-model="search.areasList"
              :options="list"
              clearable
              filterable
              :props="setParent"
              @change="changeParent"
            />
          <el-button icon="el-icon-search" size="mini" @click.native="searchSubmit1()">查询</el-button>
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
      companyId: "",

      search: {
        areasList: [],
        areasId: '',
        orgList: [],
        org: ""
      },
      setProps: { // 设置级联选择器
        label: 'companyName',
        value: 'id',
        expandTrigger: 'click',
        checkStrictly: true
      },
      setParent: { // 设置级联选择器
        label: 'name',
        value: 'id',
        expandTrigger: 'click',
        checkStrictly: true
      },
      treeData: [],
      tableDataFj: [],
      list: []
    }
  },
  created() {
    this.companyId = this.company_id
    // this.geocode()
    this.findCompany('0')
    this.findDistrict()
  },
  mounted() {
    this.showDistrictInMap()
  },
  methods: {
    async showDistrictInMap() {
      let params = {
        userId: this.userId,
        companyId: this.companyId,
        districtId: this.search.areasId
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
                  meterNum: item1.meterNum,
                  id: item1.id,
                  companyId: item1.companyId
                })
              })
            }
          })
        }

        if(this.map === null) {
          this.init()
        } else {
          this.markerAndInfoInit()
        }
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

      this.map.on("complete", () => {
        this.markerAndInfoInit()
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
          // this.marker.emit('click', {target: this.marker});
        }
      }
      this.map.setFitView();
    },
    markerClick(e) {
      this.infoWindow.setContent(e.target.content);
      this.infoWindow.open(this.map, e.target.getPosition());
    },
    searchSubmit1() {
      this.removeMarkers()
      this.showDistrictInMap()
    },
    removeMarkers() {
      this.map.clearMap()
    },
    changeOrg () { // 组织机构选择
      this.cascaderFalse('cascader12')
      if(this.search.orgList && this.search.orgList.length > 0) {
        this.search.org = this.search.orgList[this.search.orgList.length - 1]
        this.companyId = this.search.org
        this.findDistrict()
      } else {
        this.search.org = ""
        this.companyId = this.company_id
      }
    },
    async findCompany (key) { // 获取组织机构
      let params = {
        userId: this.userId,
        currentPage: 1,
        pageSize: 10000,
        company: {
          id: this.companyId
        }
      }
      let resData = await findCompany(params)
      console.log('获取组织机构', resData)
      if (resData.status === 200 && resData.data.data !== null) {
        let list = resData.data.data
        this.treeData = JSON.parse(orgTreeData([...list]))
        if (key === '0') {
          let param = {
            companyId: this.treeData[0].id
          }
          // this.search.orgList = [this.treeData[0].id]
          this.search.org = this.search.orgList[this.search.orgList.length - 1]
        }
      }
    },
    async findDistrict () { // 查询区域
      const self = this;
      let param = {
        companyId: this.companyId
      }
      let res = await findDistrict(param)
      console.log('查询区域', res)
      if (res.status === 200 && res.data.data !== null) {
        let list = res.data.data || []
        console.log('查询区域', list)
        if (list.length !== 0) {
          list = list.map(item => {
            self.$set(item, 'parentId', item.parentid)
            self.$set(item, 'companyId', item.companyid)
            return item
          })
          list = list.filter(item => {
            return item.state == 0
          })
          console.log(list)
          self.$nextTick(() => {
            self.tableDataFj = list
            self.list = JSON.parse(treeDataUtil([...list], 'parentId', 'id'))
          })
        } else {
          self.tableDataFj = list
          self.list = list
        }
      }
    },
    changeParent () { // 区域选择、
      this.cascaderFalse('cascader3')
      if (this.search.areasList && this.search.areasList.length > 0) {
        this.search.areasId = this.search.areasList[this.search.areasList.length - 1]
      } else {
        this.search.areasId = ""
      }
    },
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
    .cascader12 {
      margin-left: 10px;
      width: 200px;
    }
    .cascader3 {
      margin-left: 10px;
      width: 200px;
    }
  }
  .amap-demo {
    height: 530px;
  }
  .search-box {
    height: 40px !important;
  }
</style>