<template>
  <div class="nb-iot-register">
    <el-form ref="search" :inline="true" :model="search" class="toolbar" size="mini">
      <el-form-item label="表编号">
        <el-input v-model="search.meterNbiotNum" clearable />
      </el-form-item>
      <el-form-item label="集中器编号">
        <el-select v-model="search.meterConcentratorNum" clearable filterable @change="changeJzqbh">
          <el-option
            v-for="item in jzqList"
            :key="item.meterConcentratorNum"
            :label="item.meterConcentratorName"
            :value="item.meterConcentratorNum"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="集中器编号">
        <el-input v-model="search.meterConcentratorNum" clearable />
      </el-form-item> -->
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
      <el-form-item>
        <el-button type="primary" size="mini" class="custom-button" @click="writeWaterMeter">写水表地址</el-button>
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
        prop="meterAreasName"
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
      <my-edit :form="form" :type="type" :area-object="areaObject" :jzq-list="jzqList" @close="close" />
    </el-dialog>

    <!-- <el-dialog :visible="gatherVisiable" title="写水表地址" @close="gatherClose">
      <div class="gather-wrap">
        <div class="gather-content">
          <div class="col-box">
            <div v-for="(item, index) in concentratorList" :key="index" class="col-box_cel">
              <div class="col-box_cel_title fl" @click="openJzq(item)">
                <i class="col_icon fl" :class="[item.isShow ? 'el-icon-remove-outline' : 'el-icon-circle-plus-outline']" />
                <div>{{ item.meterConcentratorName }}</div>
              </div>
              <div class="col-box_se" :style="{height: item.maxHeight + 'px'}">
                <div v-for="(item1, index1) in item.meterList" :key="index1" class="col-box_se_main" @click.stop="meterChange(item1, item.meterList)">
                  <div class="col-box_se_main_box fl" :class="{'is-select': item1.isSelect}">
                    <span class="b-dot" />
                    <div>{{ item1.num }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col2-box">
            <div v-for="(item, index) in nbiotList" :key="index" class="col-sb fl" :class="{'is-select': item.isSelect}" @click.stop="nbiotClick(item)">
              <span class="b-dot" />
              <div>{{ item.meterNbiotNum }}</div>
            </div>
          </div>
        </div>
        <div class="gather-btn" @click="sureGather">
          确认采集
        </div>
      </div>
    </el-dialog> -->
  </div>
</template>

<script>
import { findMeterConcentrator, getMeterNodes, getMeterNbIotL, deleteMeterNbIot, findDistrict, operInstruct } from '@/service/api'
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
        pageSizes: [10, 20, 50, 100, 1000]
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
      addVisible: false,
      jzqList: []
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
    changeJzqbh () { // 切换集中器
      this.searchSubmit()
    },
    async findMeterConcentrator () { // 获取集中器
      const params = {
        userId: this.userId,
        currentPage: 1,
        pageSize: 10000
      }
      let resData = await findMeterConcentrator(params)
      if (resData.status === 200 && resData.data.code === 1) {
        this.jzqList = resData.data.data
        console.log('集中器', this.jzqList)
      }
    },
    async getMeterNodes () { // 获取采集器
      const params = {
        mcId: this.$route.query.concentratorsid,
        currentPage: this.pageObj.currentPage,
        pageSize: this.pageObj.pageSize
      }
      let resData = await getMeterNodes(params)
      if (resData.status === 200) {
        this.tableData = resData.data.data
        this.pageObj.allTotal = resData.data.page.totalRow || 0
      }
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
      const self = this
      const params = {
        userId: this.userId,
        meterNbIot: this.search,
        currentPage: this.pageObj.currentPage,
        pageSize: this.pageObj.pageSize
      }
      let resData = await getMeterNbIotL(params)
      if (resData.status === 200 && resData.data.code === 1) {
        this.tableData = resData.data.data
        this.tableData.forEach(item => {
          self.$set(item, 'meterAreasName', '')
          item.meterAreasName = self.tableDataFj.filter(val => {
            return val.id == item.meterAreasId
          })[0].name
        })
        this.pageObj.allTotal = resData.data.page.totalRow || 0
      }
    },
    init () {
      this.findDistrict()
      this.findMeterConcentrator()
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
        companyId: this.role_name == '超级管理员' ? '' : this.company_id
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
            self.getMeterNbIotL()
          })
        } else {
          self.tableDataFj = list
          self.list = list
          self.getMeterNbIotL()
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
    },
    writeWaterMeter () { // 写水表地址
      const self = this;
      console.log(self.tableData)
      if (self.search.meterConcentratorNum == '') {
        self.$message.warning('请选择集中器编号')
      } else {
        self.$message.warning('写水表暂未开发，敬请期待')
      }
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
