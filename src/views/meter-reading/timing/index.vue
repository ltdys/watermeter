<template>
  <div class="user-manage">
    <el-form ref="search" :inline="true" :model="search" class="toolbar" size="mini">
      <el-form-item>
        <el-button type="primary" size="mini" class="custom-button" @click="addTiming">{{ $t('meterReadingTiming.toolbarA') }}</el-button>
      </el-form-item>
    </el-form>
    <el-table
        :data="tableData"
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
          prop="id"
          label="记录ID"
          width="220"
        />
        <el-table-column
          prop="timerName"
          label="定时抄表名称"
          width="180"
        />
        <el-table-column
          prop="concentratorBlockAddress"
          label="集中器编号"
        />
        <el-table-column
          prop="timerTime"
          label="定时时间"
        />
        <el-table-column
          prop="createBy"
          label="创建人"
        />
        <el-table-column
          prop="createTime"
          label="创建时间"
        />
        <el-table-column fixed="right" :label="$t('common.operation')" width="120">
          <template slot-scope="scope">
            <i class="el-icon-edit" @click="handleEdit(scope.row)"></i>
            <i class="el-icon-delete" @click="handleDelete(scope.row)"></i>
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

      <el-dialog :title="title" :visible.sync="addVisible" @close="close" :close-on-click-modal="false">
        <my-edit @close="close" :form="form" :type="type"/>
      </el-dialog>
  </div>
</template>

<script>
import { findGatherTimer, delGatherTimer } from "@/service/api";
import myPagination from "@/components/pagination/my-pagination";
import { list_mixins } from '@/mixins'
import myEdit from './edit'
export default {
  name: 'timing',

  components: {
    myPagination, myEdit
  },

  mixins: [list_mixins],

  data () {
    return {
      title: "定时方案添加",
      tableData: [],
      search: {
        t1: '',
        t2: ''
      },
      pageObj: {
        allTotal: 0, // 总条数
        currentPage: 1, // 当前页数
        pageSize: 50, // 每页条数
        pageSizes: [10, 20, 50, 100]
      },
      addVisible: false,

      form: {
        areasId: "",  // 区域ID
        areasList: [],
        timerName: "",  // 定时名称
        concentratorBlockAddress: "",  // 集中器ID
        rule: "", // 通迅规约
        timerTime: "", // 定时时间
        dd: "",  // 定时日
        hh: "",  // 时
        mm: "",  // 分
        ss: ""  // 秒
      },
      type: 0
    }
  },

  created () {
    this.init()
  },
  
  methods: {
    init () {
      this.findGatherTimer()
    },
    async findGatherTimer() {
      let params = {
        userId: this.userId
      }
      let resData = await findGatherTimer(params)
      if (resData.status === 200 && resData.data.code === 1) {
        this.tableData = resData.data.data
        this.pageObj.allTotal = resData.data.page.totalRow || 0
      }
    },
    searchSubmit () {

    },
    handleEdit (row) {
      console.log("handleEdit", row)
      this.title = "定时方案编辑"
      this.type = 1
      this.form.areasId = row.areasId
      // timerName: "",  // 定时名称
      //   concentratorBlockAddress: "",  // 集中器ID
      //   rule: "", // 通迅规约
      //   timerTime: "", // 定时时间
      //   dd: "",  // 定时日
      //   hh: "",  // 时
      //   mm: "",  // 分
      //   ss: ""  // 秒
      this.form.timerName = row.timerName
      this.form.concentratorBlockAddress = row.concentratorBlockAddress
      if(row.timerTime) {
        let temps = row.timerTime.split("/")
        this.form.dd = parseInt(temps[0].substring(0, temps[0].indexOf("dd")))
        this.form.hh = parseInt(temps[1].substring(0, temps[1].indexOf("hh")))
        this.form.mm = parseInt(temps[2].substring(0, temps[2].indexOf("mm")))
        this.form.ss = parseInt(temps[3].substring(0, temps[3].indexOf("ss")))
      }
      this.addVisible = true
    },
    handleDelete (row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delGatherTimer(row)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    async delGatherTimer(row) {
      let params = {

      }
      let resData = await delGatherTimer(params)
      if (resData.status === 200 && resData.data.code === 1) {
        this.$message.success(resData.data.message)
      } else {
        this.$message.warning(resData.data.message)
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
    close () {
      this.form = {
        areasId: "",  // 区域ID
        areasList: [],
        timerName: "",  // 定时名称
        concentratorBlockAddress: "",  // 集中器ID
        rule: "", // 通迅规约
        timerTime: "", // 定时时间
        dd: "",  // 定时日
        hh: "",  // 时
        mm: "",  // 分
        ss: ""  // 秒
      }
      this.addVisible = false
      this.init()
    },
    addTiming () {
      this.title = "定时方案添加"
      this.type = 0
      this.addVisible = true
    }
  }
}
</script>