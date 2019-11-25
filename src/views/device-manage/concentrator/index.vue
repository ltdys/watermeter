<template>
  <div class="concentrator">
    <el-form ref="search" :inline="true" :model="search" class="toolbar concentrator_search" size="mini">
      <el-form-item :label="$t('deviceManageConcentrator.toolbarA')">
        <el-input v-model="search.name" :placeholder="$t('deviceManageConcentrator.toolbarA_')" clearable />
      </el-form-item>
      <el-form-item :label="$t('deviceManageConcentrator.toolbarB')">
        <el-input v-model="search.num" :placeholder="$t('deviceManageConcentrator.toolbarB_')" clearable />
      </el-form-item>
      <el-form-item :label="$t('deviceManageConcentrator.toolbarC')">
         <el-select v-model="search.useStatus" clearable filterable>
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="searchSubmit">{{ $t('common.query') }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="custom-button" size="mini" @click="addConcentrator">{{ $t('common.add') }}</el-button>
        <el-button type="primary" class="custom-button" icon="el-icon-refresh" @click="refresh">{{ $t('common.refresh') }}</el-button>
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
        @row-click="accreditClick"
      >
        <el-table-column
          type="index"
          width="50"
          label="#"
        />
        <el-table-column
          prop="name"
          :label="$t('deviceManageConcentrator.tableA')"
          width="120"
        />
        <el-table-column
          prop="num"
          :label="$t('deviceManageConcentrator.tableB')"
          width="180"
        />
        <el-table-column
          :label="$t('deviceManageConcentrator.tableC')"
        >
          <template slot-scope="scope">
            {{ scope.row.nowstatus | fNowStatus }}
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('deviceManageConcentrator.tableD')"
        >
          <template slot-scope="scope">
            {{ scope.row.usestatus | fUseStatus }}
          </template>
        </el-table-column>
        <el-table-column
          prop="lastSeen"
          :label="$t('deviceManageConcentrator.tableE')"
        />
        <el-table-column
          :label="$t('deviceManageConcentrator.tableF')"
        >
        深圳
        </el-table-column>
        <el-table-column
          prop="rule"
          :label="$t('deviceManageConcentrator.tableG')"
        />
        <el-table-column
          prop="waterDivision"
          :label="$t('deviceManageConcentrator.tableH')"
        />
        <el-table-column fixed="right" :label="$t('common.operation')" width="120">
          <template slot-scope="scope">
            <i class="el-icon-edit" @click.stop="handleEdit(scope.row)"></i>
            <i class="el-icon-delete" @click.stop="handleDelete(scope.row)"></i>
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

      <el-dialog :title="$t('deviceManageConcentrator.dialogTitle')" :visible.sync="addVisible" @close="close">
        <el-form :model="form" ref="ruleForm" :rules="rules" label-width="100px">
          <el-form-item :label="$t('deviceManageConcentrator.dialogA')" prop="name">
            <el-input v-model="form.name" clearable />
          </el-form-item>
          <el-form-item :label="$t('deviceManageConcentrator.dialogB')" prop="num">
            <el-input v-model="form.num" clearable />
          </el-form-item>
          <el-form-item :label="$t('deviceManageConcentrator.dialogC')" prop="areasId">
            <el-select v-model="form.areasId" clearable filterable>
              <el-option :label="item.label" :value="item.value" v-for="(item, index) in list" :key="index">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('deviceManageConcentrator.dialogD')">
            <el-select v-model="form.useStatus">
              <el-option :label="item.label" :value="item.value" v-for="(item, index) in isUseList" :key="index">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="当前状态">
            <el-select v-model="form.nowStatus">
              <el-option :label="item.label" :value="item.value" v-for="(item, index) in options" :key="index">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="通迅规约">
            <el-input v-model="form.rule" clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit('ruleForm')">{{ $t('common.determine') }}</el-button>
            <el-button @click="addVisible = false">{{ $t('common.cancel') }}</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
  </div>
</template>

<script>
import { findMeterConcentrator, addMeterConcentrator, deleteMeterConcentrator, updateMeterConcentrator } from '@/service/api'
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
      search: {
        num: '',
        name: '',
        useStatus: ''
      },
      pageObj: {
        allTotal: 0, // 总条数
        currentPage: 1, // 当前页数
        pageSize: 50, // 每页条数
        pageSizes: [10, 20, 50, 100]
      },
      options: [{
        label: '未使用',
        value: 0
      }, {
        label: '使用',
        value: 1
      }],
      addVisible: false,
      list: [{
        label: '深圳',
        value: 1
      }],
      isUseList: [{
        label: '未使用',
        value: 0
      }, {
        label: '使用',
        value: 1
      }],
      form: {
        areasId: '',
        num: '',
        name: '',
        nowStatus: '',
        useStatus: '',
        rule: ''
      },
      rules: {
        name: [
          { required: true, message: this.$t('deviceManageConcentrator.dialogA_'), trigger: 'change' }
        ],
        num: [
          { required: true, message: this.$t('deviceManageConcentrator.dialogB_'), trigger: 'blur' }
        ],
        useStatus: [
          { required: true, message: this.$t('deviceManageConcentrator.dialogC_'), trigger: 'blur' }
        ]
      }
    }
  },

  created () {
    this.init()
  },
  
  methods: {
    init () {
      this.findMeterConcentrator()
    },
    refresh() {
      this.search = {
        num: '',
        name: '',
        useStatus: ''
      }
      this.init()
    },
    async findMeterConcentrator () {
      const params = {
        userId: this.userId,
        meterConcentrator: {
          name: this.search.name,
          num: this.search.num,
          useStatus: this.search.useStatus
        },
        currentPage: this.pageObj.currentPage,
        pageSize: this.pageObj.pageSize
      }
      let resData = await findMeterConcentrator(params)
      if (resData.status === 200 && resData.data.code === 1) {
        this.tableData = resData.data.data
        this.pageObj.allTotal = resData.data.page.totalRow || 0
      }
    },
    searchSubmit () {
      this.init()
    },
    handleEdit (row) {
      this.addVisible = true
      this.type = 1
      this.form.name = row.name
      this.form.num = row.num
      this.form.nowStatus = row.nowstatus
      this.form.useStatus = row.usestatus
      this.form.rule = row.rule
      this.form.areasId = 1
    },
    handleDelete (row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteMeterConcentrator(row)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    async deleteMeterConcentrator(row) {
      let params = {
        mcId: row.concentratorsid
      }
      let resData = await deleteMeterConcentrator(params)
      if (resData.status === 200) {
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
    accreditClick (row, column, event) {
      console.log("row", row)
      this.$store.dispatch('tagsView/setCurrentTitle', this.$t('deviceManageConcentrator.currentTitle'))
      this.$router.push('/device-manage/collector?concentratorsid=' + row.concentratorsid + "&concentratorNum=" + row.num)
    },
    close () {
      this.$refs['ruleForm'].resetFields();
      this.form = {
        areasId: 1,
        num: '',
        name: '',
        nowStatus: '',
        useStatus: '',
        rule: ''
      },
      this.init()
    },
    addConcentrator () {
      this.addVisible = true
      this.type = 0
    },
    onSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.type === 0) {
            this.addMeterConcentrator()
          } else {
            this.updateMeterConcentrator()
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    async addMeterConcentrator() {
      let params = {
        meterConcentrator: {
          areasId: this.form.areasId,
          num: this.form.num,
          name: this.form.name,
          useStatus: this.form.useStatus,
          nowStatus: this.form.nowStatus,
          rule: this.form.rule
        }
      }
      let resData = await addMeterConcentrator(params)
      if (resData.status === 200 && resData.data.code === 1) {
        this.$message.success('添加成功');
      } else {
        this.$message.warning(resData.data.message)
      }
      this.addVisible = false
    },
    async updateMeterConcentrator() {
      let params = {
        meterConcentrator: {
          areasId: this.form.areasId,
          num: this.form.num,
          name: this.form.name,
          useStatus: this.form.useStatus,
          nowStatus: this.form.nowStatus,
          rule: this.form.rule
        }
      }
      let resData = await addMeterConcentrator(params)
      if (resData.status === 200 && resData.data.code === 1) {
        this.$message.success('修改成功');
      } else {
        this.$message.warning(resData.data.message)
      }
      this.addVisible = false
    }
  }
}
</script>

<style lang="scss">
  .concentrator {
    &_search {
      .el-input {
        width: 160px !important;
      }
    }
  }
</style>