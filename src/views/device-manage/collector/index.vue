<template>
  <div class="collector">
    <el-form ref="search" :inline="true" :model="search" class="toolbar" size="mini">
      <el-form-item>
        <el-button type="primary" class="custom-button" size="mini" @click="addCollector">添加</el-button>
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
          label="序号"
        />
        <el-table-column
          prop="concentratorNum"
          label="集中器编号"
          width="300"
        />
        <el-table-column
          prop="num"
          label="采集器编号"
          width="300"
        />
        <el-table-column
          label="使用状态"
        >
          <template slot-scope="scope">
            {{ scope.row.useStatus | fUseStatus }}
          </template>
        </el-table-column>
        <el-table-column
          prop="readType"
          label="读取类型"
        >
          <template slot-scope="scope">
            默认
          </template>
        </el-table-column>
        <el-table-column
          label="当前状态"
        >
          <template slot-scope="scope">
            {{ scope.row.nowStatus | fNowStatus }}
          </template>
        </el-table-column>
        <el-table-column
          prop="readTime"
          label="读取时间"
        >
          <template slot-scope="scope">
            {{ scope.row.readTime | fFormatDate}}
          </template>
        </el-table-column>
        <el-table-column
          prop="remarks"
          label="使用备注"
        />
        <el-table-column fixed="right" label="操作" width="120">
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

      <el-dialog title="添加采集器" :visible.sync="addVisible" @close="close">
        <el-form :model="form" ref="ruleForm" :rules="rules" label-width="120px">
          <el-form-item label="集中器编号" prop="concentratorNum">
            <el-input v-model="form.concentratorNum" clearable disabled />
          </el-form-item>
          <el-form-item label="采集器编号" prop="num">
            <el-input v-model="form.num" clearable />
          </el-form-item>
           <el-form-item label="当前状态">
            <el-select v-model="form.nowStatus">
              <el-option :label="item.label" :value="item.value" v-for="(item, index) in options" :key="index">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="使用状态">
            <el-select v-model="form.useStatus">
              <el-option :label="item.label" :value="item.value" v-for="(item, index) in options" :key="index">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="读取类型">
            <el-select v-model="form.readType">
              <el-option :label="item.label" :value="item.value" v-for="(item, index) in readTypes" :key="index">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit('ruleForm')">确定</el-button>
            <el-button @click="addVisible = false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
  </div>
</template>

<script>
import { getMeterNodes, addMeterNode, deleteMeterNode, updateMeterNode } from '@/service/api'
import myPagination from "@/components/pagination/my-pagination";
import { list_mixins } from '@/mixins'
import myEdit from './edit' 
export default {
  name: 'collector',

  components: {
    myPagination, myEdit
  },

  mixins: [list_mixins],

  data () {
    return {
      type: 0, // 0-添加 1-编辑
      tableData: [],
      pageObj: {
        allTotal: 0, // 总条数
        currentPage: 1, // 当前页数
        pageSize: 50, // 每页条数
        pageSizes: [10, 20, 50, 100]
      },
      search: {},
      addVisible: false,
      form: {
        num: '',
        nowStatus: '',
        useStatus: '',
        readType: '',
        concentratorNum: ''
      },
      rules: {
        num: [
          { required: true, message: '请填写采集器编号', trigger: 'blur' }
        ]
      },
      options: [{
        label: '未使用',
        value: 0
      }, {
        label: '使用',
        value: 1
      }],
      readTypes: [{
        label: '默认',
        value: 1
      }]
    }
  },

  created () {
    this.form.concentratorNum = this.$route.query.concentratorNum
    this.init()
  },
  
  methods: {
    async getMeterNodes () {
      const params = {
        mcId: this.$route.query.concentratorsid,
        currentPage: this.pageObj.currentPage,
        pageSize: this.pageObj.pageSize
      }
      let resData = await getMeterNodes(params)
      if(resData.status === 200) {
        this.tableData = resData.data.data
        this.pageObj.allTotal = resData.data.page.totalRow || 0
      }
    },
    init () {
      this.getMeterNodes()
    },
    onSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.type === 0) {
            this.addMeterNode()
          } else {
            this.updateMeterNode()
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    async addMeterNode() {
      let params = {
        meterNode: {
          num: this.form.num,
          nowStatus: this.form.nowStatus,
          useStatus: this.form.useStatus,
          readType: this.form.readType,
          concentratorNum: this.form.concentratorNum
        }
      }
      let resData = await addMeterNode(params)
      if (resData.status === 200 && resData.data.code === 1) {
        this.$message.success('添加成功');
      } else {
        this.$message.warning(resData.data.message)
      }
      this.addVisible = false
    },
    async updateMeterNode() {
      let params = {
        meterNode: {
          id: this.id,
          num: this.form.num,
          nowStatus: this.form.nowStatus,
          useStatus: this.form.useStatus,
          readType: this.form.readType,
          concentratorNum: this.form.concentratorNum
        }
      }
      let resData = await updateMeterNode(params)
      if (resData.status === 200 && resData.data.code === 1) {
        this.$message.success('修改成功');
      } else {
        this.$message.warning(resData.data.message)
      }
      this.addVisible = false
    },
    handleEdit (row) {
      this.id = row.id
      this.addVisible = true
      this.type = 1
      this.form.num = row.num
      this.form.nowStatus = row.nowStatus
      this.form.useStatus = row.useStatus
      this.form.readType = row.readType
    },
    handleDelete (row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteMeterNode(row)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    async deleteMeterNode(row) {
      let params = {
        meterNodeId: row.id
      }
      let resData = await deleteMeterNode(params)
      if (resData.status === 200) {
        this.$message.success(resData.data.message)
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
    addCollector () {
      this.type = 0
      this.addVisible = true
    },
    close () {
      this.$refs['ruleForm'].resetFields();
      this.form.useStatus = ''
      this.form.readType = ''
      this.form.nowStatus = ''
      this.init()
    }
  }
}
</script>