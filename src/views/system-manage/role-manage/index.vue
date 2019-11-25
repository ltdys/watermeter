<template>
  <div class="role-manage">
    <el-form ref="search" :inline="true" :model="search" class="toolbar" size="mini">
      <el-form-item label="组织机构代码">
        <el-select v-model="search.companyId" clearable>
          <el-option :label="item.companyName" :value="item.id" v-for="(item, index) in companyData" :key="index">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('systemManageRole.toolbarB')">
        <el-input v-model="search.roleName" :placeholder="$t('systemManageRole.toolbarB_')" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="searchSubmit">{{ $t('common.query') }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" class="custom-button" @click="handleAdd">{{ $t('common.add') }}</el-button>
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
          :label="$t('systemManageRole.tableA')"
          width="120"
        >
            {{ this.userName }}
        </el-table-column>
        <el-table-column
          prop="roleName"
          :label="$t('systemManageRole.tableB')"
          width="180"
        />
        <el-table-column
          prop="dept"
          :label="$t('systemManageRole.tableC')"
        />
        <el-table-column
          prop="lastLoginIp"
          :label="$t('systemManageRole.tableD')"
        />
        <el-table-column
          :label="$t('systemManageRole.tableE')"
        >
          <template slot-scope="scope">
            {{ scope.row.updateTime | fFormatDate}}
          </template>
        </el-table-column>
        <el-table-column fixed="right" :label="$t('common.operation')" width="120">
          <template slot-scope="scope">
            <i class="el-icon-edit" @click="handleEdit(scope.row)"></i>
            <i class="el-icon-delete" @click="handleDelete(scope.row)"></i>
          </template>
        </el-table-column>
      </el-table>

      <!-- 添加 -->
      <el-dialog :visible.sync="addVisible" @close="close" :title="title">
        <el-form :model="form" ref="ruleForm" :rules="rules" label-width="80px">
          <el-form-item label="组织" prop="companyId">
            <el-select v-model="form.companyId" clearable>
              <el-option :label="item.companyName" :value="item.id" v-for="(item, index) in companyData" :key="index">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="角色名" prop="roleName">
            <el-input v-model="form.roleName" clearable />
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="form.note" clearable />
          </el-form-item>
          <el-form-item label="删除标识">
            <el-input v-model="form.deleteFlag" clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit('ruleForm')">{{ $t('common.determine') }}</el-button>
            <el-button @click="addVisible = false">{{ $t('common.cancel') }}</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>

      <my-pagination
        :all-total="pageObj.allTotal"
        :current-page="pageObj.currentPage"
        :page-size="pageObj.pageSize"
        :page-sizes="pageObj.pageSizes"
        @pageChange="pageChange"
        @currentChange="currentChange"
      />
  </div>
</template>

<script>
import { getRoleList, addRole, updRole, delRole } from "@/service/api";
import myPagination from "@/components/pagination/my-pagination";
import { list_mixins } from '@/mixins'
export default {
  name: 'resourceManage',

  components: {
    myPagination
  },

  mixins: [list_mixins],

  data () {
    return {
      title: "添加角色",
      tableData: [],
      search: {
        roleName: '',
        companyId: ''
      },
      form: {
        companyId: '',
        roleName: '',
        note: '',
        deleteFlag: ''
      },
      pageObj: {
        allTotal: 0, // 总条数
        currentPage: 1, // 当前页数
        pageSize: 50, // 每页条数
        pageSizes: [10, 20, 50, 100]
      },
      type: 0, // 0-添加 1-编辑
      addVisible: false,
      rules: {
        companyId: [
          { required: true, message: '请选择组织', trigger: 'change' }
        ],
        roleName: [
          { required: true, message: '请输入角色名', trigger: 'blur' }
        ]
      },
      id: '',
      permission: [{
         "resourceId":"5",
         "oper":"1"
        },
        {
          "resourceId":"6",
          "oper":"1"
        },
        {
          "resourceId":"7",
          "oper":"1"
        },
        {
          "resourceId":"8",
          "oper":"1"
        },
        {
          "resourceId":"9",
          "oper":"1"
        }, {
          "resourceId":"10",
          "oper":"1"
        }, {
          "resourceId":"11",
          "oper":"1"
        }, {
          "resourceId":"12",
          "oper":"1"
        }
        ]
    }
  },

  created () {
    this.init()
  },
  
  methods: {
    async getRoleList () {
      const params = {
        userId: this.userId,
        pageSize: this.pageObj.pageSize,
        currentPage: this.pageObj.currentPage,
        role: {
          roleName: this.search.roleName,
          companyId: this.search.companyId
        }
      }
      let resData = await getRoleList(params)
      if (resData.status === 200) {
        this.tableData = resData.data.data
        this.pageObj.allTotal = resData.data.page.totalRow || 0
      }
    },
    async addRole() {
      let params = {
        role: {
          roleName: this.form.roleName,
          companyId: this.form.companyId,
          note: this.form.note,
          deleteFlag: this.form.deleteFlag
        },
        permission: this.permission
      }
      let resData = await addRole(params)
      if (resData.status === 200 && resData.data.code === 1) {
        this.$message.success('添加成功');
      } else {
        this.$message.warning(resData.data.message)
      }
      this.addVisible = false
    },
    init () {
      this.getRoleList()
    },
    searchSubmit () {
      this.init()
    },
    handleEdit (row) {
      this.title = "编辑角色"
      this.form.companyId = row.companyId
      this.form.roleName = row.roleName
      this.form.note = row.note
      this.form.deleteFlag = row.deleteFlag
      this.id = row.id
      this.type = 1
      this.addVisible = true
    },
    async updRole() {
      let params = {
        role: {
          id: this.id,
          roleName: this.form.roleName,
          companyId: this.form.companyId,
          note: this.form.note
        },
        permission: this.permission
      }
      let resData = await updRole(params)
      if (resData.status === 200 && resData.data.code === 1) {
        this.$message.success('修改成功')      
      } else {
        this.$message.warning(resData.data.message)
      }
      this.addVisible = false
    },
    async delRole(data) {
      let params = {
        userName: this.userName,
        roleId: data.id
      }
      let resData = await delRole(params)
      if (resData.status === 200 && resData.data.code === 1) {
        this.$message.success('删除成功');
        this.init()
      } else {
        this.$message.warning(resData.data.message)
      }
    },
    handleDelete (row) {
      this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delRole(row)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    pageChange (data) { // 每页条数切换回调事件
      this.pageObj.pageSize = data;
      this.init()
    },
    currentChange (data) { // 当前页切换事件
      this.pageObj.currentPage = data;
      this.init()
    },
    close() {
      this.$refs['ruleForm'].resetFields();
      this.form = {
        companyId: '',
        roleName: '',
        note: '',
        deleteFlag: ''
      },
      // this.addVisible = false
      this.init()
    },
    handleAdd() {
      this.title = "添加角色"
      this.type = 0
      this.addVisible = true
    },
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.type === 0) {
            this.addRole()
          } else {
            this.updRole()
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }
  }
}
</script>