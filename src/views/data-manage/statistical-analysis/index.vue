<template>
  <div class="meter-reading-exception">
    <el-row>
      <el-col :span="24">
        <el-form ref="search" :inline="true" :model="search" class="toolbar" size="mini">
          <el-form-item label="组织">
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
          </el-form-item>
          <el-form-item label="区域">
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
          </el-form-item>
          <el-form-item label="统计方式">
            <el-select v-model="search.way" placeholder="请选择" @change="wayChange">
              <el-option
                v-for="item in wayOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-select v-model="search.cond" placeholder="请选择">
              <el-option
                v-for="item in condOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
             <el-button type="primary" icon="el-icon-search" size="mini" @click.native="searchSubmit1()">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
        <el-col :span="24">
          <el-scrollbar class="scrollbar-page" wrap-class="scrollbar-wrapper">
            <div class="exception-wrap" :style="{ height: tableHeight + 'px'}">
              抄表用水图表
            </div>
          </el-scrollbar>
        </el-col>
    </el-row>  
  </div>
</template>

<script>
import { list_mixins } from '@/mixins'
import { orgTreeData, treeDataUtil, treeDataTest } from '@/utils/publicUtil'
import { showDistrictInMap, findCompany, findDistrict } from "@/service/api";

export default {

  name: 'alarm',

  mixins: [list_mixins],

  data () {
    return {
      lnglatsList: [],
      companyId: "",
      tableData: [],
      search: {
        areasList: [],
        areasId: '',
        orgList: [],
        org: "",
        way: "",
        cond: ""
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
      list: [],
      wayOptions: [{
        label: "按年统计",
        value: 1
      }, {
        label: "按月统计",
        value: 2
      }, {
        label: "按季统计",
        value: 3
      }],
      condOptions: []
    }
  },

  created () {
    this.companyId = this.company_id
    this.findCompany('0')
    this.findDistrict()
  },

  mounted() {
    this.showDistrictInMap()
  },

  methods: {
    init () {
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
    async showDistrictInMap() {
      let params = {
        userId: this.userId,
        companyId: this.companyId,
        districtId: this.search.areasId
      }
      let resData = await showDistrictInMap(params)
      if(resData.status === 200) {
        this.regionList = resData.data.data
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
                  meterFailNum: item1.meterFailNum,
                  id: item1.id,
                  companyId: item1.companyId
                })
              })
            }
          })
        }

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
    searchSubmit1() {
      this.showDistrictInMap()
    },
    wayChange() {
      this.condOptions = []
      this.search.cond = ""
      if (this.search.way === 1) {  // 按年
        let year = parseInt(new Date().getFullYear());
        console.log("当前年份", year)
        for(let i = 0; i < 5; i ++) {
          this.condOptions.push({
            label: year + "年",
            value: year
          })
          year--
        }
      } else if(this.search.way === 2) {  // 按月
        for(let i = 1; i < 13; i++) {
          this.condOptions.push({
            label: i + "月",
            value: i
          })
        }
      } else if(this.search.way === 3) {  // 按季度
        this.condOptions = [{
          label: "第一季度",
          value: 1
        }, {
          label: "第二季度",
          value: 2
        }, {
          label: "第三季度",
          value: 3
        }, {
          label: "第四季度",
          value: 4
        }]
      }
    }
  }
}
</script>

<style lang="scss">
  .meter-reading-exception {
    // overflow-y: scroll;
    .exception-wrap {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
    }
    .el-scrollbar__wrap {
      background: #fff;
    }
    .toolbar{
      height:auto;
      margin-bottom: 10px;
      .el-form-item {
        margin-bottom: 2.5px;
      }
    }
  }
</style>