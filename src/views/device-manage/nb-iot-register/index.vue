<template>
  <div class="nb-iot-register">
    <el-form ref="search" :inline="true" :model="search" class="toolbar" size="mini">
      <el-form-item label="表编号">
        <el-input v-model="search.meterNbiotNum" clearable />
      </el-form-item>
      <el-form-item label="集中器编号">
        <el-input v-model="search.meterConcentratorNum" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="searchSubmit">{{ $t('common.query') }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" class="custom-button" @click="addNbIotRegister">{{ $t('common.add') }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" class="custom-button">{{ $t('deviceManageRegister.toolbarB') }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" class="custom-button">{{ $t('deviceManageRegister.toolbarC') }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" class="custom-button">{{ $t('deviceManageRegister.toolbarD') }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" class="custom-button">{{ $t('deviceManageRegister.toolbarE') }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" class="custom-button">{{ $t('deviceManageRegister.toolbarF') }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" class="custom-button">{{ $t('deviceManageRegister.toolbarG') }}</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="tableData"
      border
      stripe
      style="width: 100%"
      size="mini"
      :height="tableHeightPage - 30"
      highlight-current-row
    >
      <el-table-column
        type="index"
        width="50"
        label="#"
      />
      <el-table-column
        prop="meterNbiotNum"
        label="表编号"
        width="120"
      />
      <el-table-column
        prop="meterUserNum"
        label="用户编号"
        width="120"
      />
      <el-table-column
        prop="meterConcentratorNum"
        label="集中器编号"
        width="120"
      />
      <el-table-column
        prop="meterNodeNum"
        label="采集器编号"
        width="120"
      />
      <el-table-column
        prop="meterSpec"
        label="规格型号"
      />
      <el-table-column
        prop="simCardCcid"
        label="SIM卡号"
        width="200"
      />
      <el-table-column
        prop="installAddress"
        label="安装地址"
        width="180"
      />
      <el-table-column
        prop="signalIntensity"
        label="信号强度"
      />
      <el-table-column
        prop="batteryCapacity"
        label="电池容量"
      />
      <el-table-column
        prop="pressureAlert"
        label="压力警告"
      />
      <el-table-column
        prop="batteryLevel"
        label="电池电量"
      />
      <el-table-column
        prop="valveState"
        label="阀门状态"
      />
      <el-table-column
        prop="valueSupport"
        label="阀控支持"
      />
      <el-table-column
        prop="meterType"
        label="表类型"
      />
      <el-table-column
        prop="reportCycle"
        label="上报周期"
      />
      <el-table-column
        prop="readValue"
        label="本次读数"
      />
      <el-table-column
        prop="version"
        label="软件版本号"
        width="120"
      />
      <el-table-column
        prop="meterAreasId"
        label="小区"
      />
      <el-table-column fixed="right" :label="$t('common.operation')" width="120">
        <template slot-scope="scope">
          <i class="el-icon-edit" @click="handleEdit(scope.row)" />
          <i class="el-icon-delete" @click="handleDelete(scope.row)" />
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

    <el-dialog :title="$t('deviceManageRegister.dialogTitle')" :visible.sync="addVisible" @close="close">
      <my-edit :form="form" :type="type" @close="close" :areaObject="areaObject"/>
    </el-dialog>
  </div>
</template>

<script>
import { getMeterNbIotL, deleteMeterNbIot, findDistrict } from '@/service/api'
import { treeDataUtil } from '@/utils/publicUtil'
import myPagination from "@/components/pagination/my-pagination";
import { list_mixins } from '@/mixins'
import myEdit from './edit'
export default {
  name: 'nbIotRegister',

  components: {
    myPagination, myEdit
  },

  mixins: [list_mixins],

  data () {
    return {
      type: 0, // 0添加 1编辑
      tableData: [],
      search: {
        meterNbiotNum: '',
        meterConcentratorNum: '',
        meterNodeNum: '',
        meterSpec: '',
        simCardCcid: ''
      },
      list: [],
      areaObject: {},
      tableDataFj: [],
      pageObj: {
        allTotal: 0, // 总条数
        currentPage: 1, // 当前页数
        pageSize: 50, // 每页条数
        pageSizes: [10, 20, 50, 100]
      },
      form: {},
      copyForm: {},
      options: [{
        value: 0,
        label: '全部'
      }, {
        value: 1,
        label: '部分'
      }],
      addVisible: false
    }
  },

  created () {
    this.init()
  },

  methods: {
    async getMeterNbIotL () {
      const params = {
        userId: this.userId,
        meterNbIot: this.search,
        currentPage: this.pageObj.currentPage,
        pageSize: this.pageObj.pageSize
      }
      let resData = await getMeterNbIotL(params)
      if (resData.status === 200 && resData.data.code === 1) {
        this.tableData = resData.data.data
        this.pageObj.allTotal = resData.data.page.totalRow || 0
      }
    },
    init () {
      this.getMeterNbIotL()
      this.findDistrict()
    },
    searchSubmit () {
      this.init()
    },
    handleEdit (row) {
      this.copyForm = row
      this.form = JSON.parse(JSON.stringify(this.copyForm))
      this.type = 1
      this.addVisible = true
    },
    handleDelete (row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteMeterNbIot(row)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    async findDistrict () { // 查询区域
      const self = this;
      let param = {
        companyId: ''
      }
      let res = await findDistrict(param)
      console.log('查询区域', res)
      if (res.status === 200 && res.data.data !== null) {
        let list = res.data.data || []
        if (list.length !== 0) {
          list = list.map(item => {
            self.$set(item, 'parentId', item.parentid)
            self.$set(item, 'companyId', item.companyid)
            return item
          })
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
    async deleteMeterNbIot (row) {
      let params = {
        meterNbIotId: row.id
      }
      let resData = await deleteMeterNbIot(params)
      if (resData.status === 200) {
        this.$message.info(resData.data.message)
      }
      this.init()
    },
    pageChange (data) { // 每页条数切换回调事件
      this.pageObj.pageSize = data;
      this.init()
    },
    currentChange (data) { // 当前页切换事件
      this.pageObj.currentPage = data;
      this.init()
    },
    addNbIotRegister () {
      this.type = 0
      this.addVisible = true
    },
    close () {
      this.form = {}
      this.addVisible = false
      this.init()
    }
  }
}
</script>

<style lang="scss">
  .nb-iot-register {
    overflow-y: scroll;
    .toolbar{
      height:auto;
      margin-bottom: 10px;
      .el-form-item {
        margin-bottom: 2.5px;
      }
    }
  }
</style>
