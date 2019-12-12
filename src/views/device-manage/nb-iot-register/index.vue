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
      <!-- <el-form-item>
        <el-button type="primary" size="mini" class="custom-button">{{ $t('deviceManageRegister.toolbarE') }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" class="custom-button">{{ $t('deviceManageRegister.toolbarF') }}</el-button>
      </el-form-item> -->
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
        label="当前状态"
      >
        <template slot-scope="scope">
          {{ scope.row.isOnline | fIsOnline }}
        </template>
      </el-table-column>
      <el-table-column
        prop="bindState"
        label="使用状态"
      >
        <template slot-scope="scope">
          {{ scope.row.bindState | fUseStatus }}
        </template>
      </el-table-column>
      <el-table-column
        label="阀门状态"
      >
        <template slot-scope="scope">
          {{ scope.row.isSwing | fisSwing }}
        </template>
      </el-table-column>
      <el-table-column
        label="最后上线"
      >
        <template slot-scope="scope">
          {{ scope.row.updateTime | fFormatDate }}
        </template>
      </el-table-column>
      <el-table-column
        prop="meterAreasId"
        label="所属区域"
      />
      <el-table-column
        prop="non"
        label="通迅规约"
      />
      <el-table-column fixed="right" :label="$t('common.operation')" width="120">
        <template slot-scope="scope">
          <i class="el-icon-edit" @click="handleEdit(scope.row)" />
          <i class="el-icon-delete" @click="handleDelete(scope.row)" />
          <el-button v-if="scope.row.isSwing != -1" :class="colorStatus(scope.row.isSwing)" type="text" size="small" @click="handleValve(scope.row)">{{ scope.row.isSwing | fisSwingShow }}</el-button>
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

    <el-dialog :title="title" :visible.sync="addVisible" @close="close">
      <my-edit :form="form" :type="type" :area-object="areaObject" @close="close" />
    </el-dialog>
  </div>
</template>

<script>
import { getMeterNbIotL, deleteMeterNbIot, findDistrict, operInstruct } from '@/service/api'
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
      title: "NB-IOT添加",
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
      form: {
        meterNbiotNum: '', // 表编号
        meterUserNum: '', // 用户编号
        meterConcentratorNum: '', // 集中器编号
        meterNodeNum: '', // 采集器编号
        meterSpec: '', // 规格型号
        simCardCcid: '', // SIM卡号
        installAddress: '', // 安装地址
        signalIntensity: '', // 信号强度
        batteryCapacity: '', // 电池容量
        pressureAlert: '', // 压力警告
        batteryLevel: '', // 电池电量
        valveState: 0, // 阀门状态 (0无阀 1有阀)
        valueSupport: false, // 阀控支持
        meterType: '', // 表类型
        reportCycle: '', // 上报周期
        readValue: '', // 本次读数
        version: '', // 软件版本号
        meterAreasId: '', // 小区ID
        bindState: 0, // 使用状态
        areasList: [],
        blv: '1'
      },
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

  computed: {
    colorStatus: function (val) {
      return function (val) {
        let s = ''
        if (val == null || val == 0) {
          s = 'color-r'
        } else if (val == 1) {
          s = 'color-g'
        }
        return s
      }
    }
  },

  created () {
    this.init()
  },

  methods: {
    handleValve (item) { // 阀门操作
      const self = this;
      console.log('item', item)
      let param = {
        userId: self.userId, // 用户登录id
        concentratorNum: item.meterConcentratorNum, // 集中器id
        waterBlockAddress: item.meterNbiotNum, // 表地址
        rule: item.rule
      }
      if (item.isSwing == null || item.isSwing == 0) { // 开阀状态  执行关阀
        param.cmd = 'GGG'
      } else if (item.isSwing == 1) { // 关阀状态  执行开阀
        param.cmd = 'KKK'
      }
      self.operInstruct(param)
    },
    async operInstruct (param) {
      let res = await operInstruct(param)
      if (res.status == 200 && res.data.code == 1) {
        this.$message.success(res.data.message);
        this.getMeterNbIotL()
      } else {
        this.$message.error(res.data.message);
      }
      console.log('res', res)
    },
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
      this.title = "NB-IOT编辑"
      this.type = 1
      this.addVisible = true
      this.areaObject.areasList = this.tableDataFj.filter(item => {
        return item.id == row.meterAreasId
      })[0].path

      row.areasList = this.tableDataFj.filter(item => {
        return item.id == row.meterAreasId
      })[0].path

      this.$nextTick(() => {
        this.copyForm = row
        this.form = JSON.parse(JSON.stringify(this.copyForm))
      })
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
      this.title = "NB-IOT添加"
      this.type = 0
      this.addVisible = true
    },
    close () {
      this.form = {
        meterNbiotNum: '', // 表编号
        meterUserNum: '', // 用户编号
        meterConcentratorNum: '', // 集中器编号
        meterNodeNum: '', // 采集器编号
        meterSpec: '', // 规格型号
        simCardCcid: '', // SIM卡号
        installAddress: '', // 安装地址
        signalIntensity: '', // 信号强度
        batteryCapacity: '', // 电池容量
        pressureAlert: '', // 压力警告
        batteryLevel: '', // 电池电量
        valveState: 0, // 阀门状态 (0无阀 1有阀)
        valueSupport: false, // 阀控支持
        meterType: '', // 表类型
        reportCycle: '', // 上报周期
        readValue: '', // 本次读数
        version: '', // 软件版本号
        meterAreasId: '', // 小区ID
        bindState: 0, // 使用状态
        areasList: []
      }
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
