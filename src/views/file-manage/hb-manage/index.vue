<template>
  <div class="hb-manage">
    <el-row>
      <el-col :span="24">
        <el-form ref="search" :inline="true" :model="search" class="toolbar" size="mini">
          <el-form-item :label="$t('fileManageHb.toolbarA')">
            <el-select v-model="search.type" clearable filterable>
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                clearable
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input v-model="search.value" clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="searchSubmit">{{ $t('common.query') }}</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" class="custom-button" @click="addUser">添加用户</el-button>
            <!-- <el-button type="primary" size="mini" class="custom-button" @click="addUser">{{ $t('fileManageHb.toolbarB') }}</el-button>
            <el-button type="primary" size="mini" class="custom-button" @click="addTable">{{ $t('fileManageHb.toolbarC') }}</el-button> -->
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="4" :style="{height: (tableHeightPage + 52) + 'px', background: '#E9E9E9'}">
        <el-scrollbar class="scrollbar-page" wrap-class="scrollbar-wrapper">
          <my-region3 @handleNodeClick="handleNodeClick" />
        </el-scrollbar>
      </el-col>
      <el-col :span="20">
        <el-table
          :data="tableDataUser"
          border
          stripe
          style="width: 100%"
          size="mini"
          :height="tableHeightPage"
          highlight-current-row
        >
          <el-table-column
            type="index"
            width="50"
            label="#"
          />
          <el-table-column
            prop="meterusernum"
            :label="$t('fileManageHb.tableA')"
            width="200"
          />
          <el-table-column
            prop="meterusername"
            :label="$t('fileManageHb.tableB')"
            width="120"
          />
          <el-table-column
            prop="address"
            :label="$t('fileManageHb.tableC')"
          />
          <el-table-column
            prop="telephone"
            :label="$t('fileManageHb.tableD')"
            width="120"
          />
          <el-table-column
            prop="meternbiotnum"
            :label="$t('fileManageHb.tableE')"
            width="200"
          />
          <el-table-column
            prop="tableAddress"
            :label="$t('fileManageHb.tableF')"
          />
          <el-table-column
            prop="IMIE"
            label="IMEI"
          />
          <el-table-column
            prop="communication"
            :label="$t('fileManageHb.tableG')"
          />
          <el-table-column
            prop="installTime"
            :label="$t('fileManageHb.tableH')"
            width="200"
          />
          <el-table-column
            prop="readNum"
            :label="$t('fileManageHb.tableI')"
          />
          <el-table-column
            prop="useNum"
            :label="$t('fileManageHb.tableJ')"
          />
          <el-table-column fixed="right" :label="$t('common.operation')" width="80">
            <template slot-scope="scope">
              <!-- <i class="el-icon-edit" @click="handleEdit(scope.row)"></i> -->
              <span class="hb-manage_delete" @click="handleEdit(scope.row)">编辑</span>
              <span class="hb-manage_delete" @click="handleDelete(scope.row)">删除</span>
            </template>
          </el-table-column>
        </el-table>
        <my-pagination
          :all-total="pageObj.allTotal"
          :current-page="pageObj.currentPage"
          :page-size="pageObj.pageSize"
          :page-sizes="pageObj.pageSizes"
          @pageChange="pageChange"
          @currentChange="currentChange"
        />
      </el-col>
    </el-row>

    <el-dialog :title="userTitle" :visible.sync="userAddVisible" @close="userClose">
      <user-edit :water-house-type-list="waterHouseTypeList" :water-nature-list="waterNatureList" :tree-data="treeData" :form="form" :nb-iot-list="nbIotList" :type="type" @close="userAddVisible = false" />
    </el-dialog>

    <el-dialog :title="$t('fileManageHb.dialogTableTitle')" :visible.sync="tableAddVisible" class="region-manage-dialog" @close="tableClose">
      <table-edit @close="tableClose" />
    </el-dialog>
  </div>
</template>

<script>
import { findWaterHouseTypes, findWaterNatures, getMeterUserAndMeterNbIot, getMeterNbIotL, deleteMeterUser } from '@/service/api'
import myRegion3 from '@/components/common/region3'
import myPagination from "@/components/pagination/my-pagination";
import { list_mixins } from '@/mixins'
import userEdit from './userEdit'
import tableEdit from './tableEdit'
// import { orgTreeData, treeDataUtil } from '@/utils/publicUtil'
export default {

  name: 'hbManage',

  components: {
    myPagination, myRegion3, userEdit, tableEdit
  },

  mixins: [list_mixins],

  data () {
    return {
      tableDataUser: [],
      userTitle: "添加用户",
      type: 0, // 0添加 1编辑
      search: {
        type: "",
        value: "",
        areasId: "",
        num: "", // 用户编号
        meterNbiotNum: "", // 编号
        IMEI: "",
        address: "" // 安装地址
      },
      pageObj: {
        allTotal: 0, // 总条数
        currentPage: 1, // 当前页数
        pageSize: 50, // 每页条数
        pageSizes: [10, 20, 50, 100]
      },
      defaultProps: {
        children: 'child',
        label: 'name'
      },
      form: {
        id: '', // 用户id
        nbiotNum: '',
        areasId: '',
        num: '',
        name: '',
        idNumber: '',
        tel: '',
        waterHouseTypeId: '',
        waterNatureId: '',
        floorNo: '',
        unitNo: '',
        roomNo: '',
        namePy: ''
      },
      options: [{
        value: 0,
        label: '用户编号'
      }, {
        value: 1,
        label: '表编号'
      }, {
        value: 2,
        label: "IMEI"
      }, {
        value: 3,
        label: "安装地址"
      }],
      userAddVisible: false,
      tableAddVisible: false,
      waterHouseTypeList: [],
      waterNatureList: [],
      nbIotList: [],
      treeData: []
    }
  },

  created () {
    this.init()
  },

  methods: {
    init () {
      this.getMeterUserAndMeterNbIot()
      this.findWaterHouseTypes()
      this.findWaterNatures()
      this.getMeterNbIotL()
    },
    // 查户表
    async getMeterNbIotL () {
      const params = {
        userId: this.userId,
        meterNbIot: {},
        currentPage: 1,
        pageSize: 10000
      }
      let resData = await getMeterNbIotL(params)
      // console.log('resData', resData)
      if (resData.status === 200 && resData.data.code === 1) {
        this.nbIotList = resData.data.data
      }
    },
    async getMeterUserAndMeterNbIot () {
      switch (this.search.type) {
        case 0:
          this.search.num = this.search.value
          break;
        case 1:
          this.search.meterNbiotNum = this.search.value
          break;
        case 2:
          this.search.IMEI = this.search.value
          break;
        case 3:
          this.search.address = this.search.value
          break;
      }
      let params = {
        areasId: this.search.areasId,
        meterUser: {
          num: this.search.num
        },
        meterNbIot: {
          meterNbiotNum: this.search.meterNbiotNum, // 编号
          IMEI: this.search.IMEI,
          address: this.search.address // 安装地址
        },
        currentPage: this.pageObj.currentPage,
        pageSize: this.pageObj.pageSize
      }
      let resData = await getMeterUserAndMeterNbIot(params)
      if (resData.status === 200) {
        this.tableDataUser = resData.data.data || []
        if (resData.data.page) {
          this.pageObj.allTotal = resData.data.page.totalRow || 0
        }
      }
    },
    async findWaterHouseTypes () {
      let params = {
        waterHouseTypes: {
          id: '',
          houseType: '',
          ratedWaterYield: '',
          dayAlertWaterYield: '',
          companyId: ''
        },
        currentPage: 1,
        pageSize: 10000
      }
      let resData = await findWaterHouseTypes(params)
      if (resData.status === 200) {
        this.waterHouseTypeList = resData.data.data
      }
    },
    async findWaterNatures () {
      let params = {
        waterNatures: {
          name: '',
          companyId: '',
          id: ''
        },
        currentPage: 1,
        pageSize: 10000
      }
      let resData = await findWaterNatures(params)
      if (resData.status === 200) {
        this.waterNatureList = resData.data.data
        // this.waterNatureList.forEach(item => {
        //   item.id = item.id.toString()
        // })
      }
    },
    // async getHouseTable () {
    //   const params = {
    //     rows: this.pageObj.pageSize,
    //     page: this.pageObj.currentPage
    //   }
    //   let res = await getHouseTable(params)
    //   this.tableData = res.data.data
    //   if (resData.data.page) {
    //     this.pageObj.allTotal = resData.data.page.totalRow || 0
    //   }
    // },
    pageChange (data) { // 每页条数切换回调事件
      this.pageObj.pageSize = data;
      this.init()
    },
    currentChange (data) { // 当前页切换事件
      this.pageObj.currentPage = data;
      this.init()
    },
    searchSubmit () {
      this.getMeterUserAndMeterNbIot()
    },
    handleEdit (data) {
      // areasId: '',
      // num: '',
      // name: '',
      // idNumber: '',
      // tel: '',
      // waterHouseTypeId: '',
      // waterNatureId: '',
      // floorNo: '',
      // unitNo: '',
      // roomNo: '',
      // namePy: ''
      // this.form = JSON.parse(JSON.stringify(data))
      this.type = 1
      data.id = data.meteruserid
      data.nbiotNum = data.meternbiotnum
      data.areasId = data.districtid
      data.num = data.meterusernum
      data.waterHouseTypeId = data.waterhousetypeid || ''
      data.waterNatureId = data.waternatureid || ''
      data.name = data.meterusername
      data.idNumber = data.meteruseridnumber
      data.tel = data.telephone
      this.form = JSON.parse(JSON.stringify(data))

      // this.form.nbiotNum = data.meternbiotnum
      // this.form.areasId = data.districtid
      // this.form.num = data.meterusernum
      // this.form.waterHouseTypeId = data.waterHouseTypeId || ''
      // this.form.waterNatureId = data.waterNatureId || ''
      // this.form.name = data.meterusername
      // this.form.idNumber = data.meteruseridnumber
      // this.form.tel = data.telephone

      // console.log("this.form", this.form)
      this.userTitle = "编辑用户"
      this.userAddVisible = true
    },
    handleDelete (row) {
      this.$confirm(`此操作将永久删除 ${row.meterusername}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteMeterUser(row)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    async deleteMeterUser (row) {
      let params = {
        meterUserId: row.meteruserid
      }
      let resData = await deleteMeterUser(params)
      if (resData.status === 200) {
        this.$message.success(`${row.meterusername} 删除成功`)
      } else {
        this.$message.warning(resData.data.message)
      }
      this.init()
    },
    handleNodeClick (data) {
      this.search.areasId = data.id
      this.getMeterUserAndMeterNbIot()
    },
    addUser () {
      this.type = 0
      this.userTitle = "添加用户"
      this.userAddVisible = true
    },
    addTable () {
      this.tableAddVisible = true
    },
    userClose () {
      this.form = {
        id: '', // 用户id
        nbiotNum: '',
        areasId: '',
        num: '',
        name: '',
        idNumber: '',
        tel: '',
        waterHouseTypeId: '',
        waterNatureId: '',
        floorNo: '',
        unitNo: '',
        roomNo: '',
        namePy: ''
      }
      this.getMeterUserAndMeterNbIot()
      // this.userAddVisible = false
    },
    tableClose () {
      this.tableAddVisible = false
    }
  }
}
</script>

<style lang="scss">
.hb-manage {
  .el-scrollbar__wrap {
    background: #fff;
  }
  &_delete {
    text-decoration: underline;
    color: #0084FF;
  }
}
</style>
