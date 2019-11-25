<template>
  <div class="user-manage">
    <el-form ref="search" :inline="true" :model="search" class="toolbar" size="mini">
      <el-form-item label="组织机构">
        <el-select v-model="search.companyName" clearable>
          <el-option :label="item.companyName" :value="item.companyName" v-for="(item, index) in companyData" :key="index">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('systemManageUser.toolbarB')">
        <el-input v-model="search.roleName" :placeholder="$t('systemManageUser.toolbarB_')" clearable />
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
          prop="username"
          :label="$t('systemManageUser.tableA')"
          width="120"
        />
        <el-table-column
          prop="companyname"
          :label="$t('systemManageUser.tableB')"
          width="180"
        />
        <el-table-column
          prop="rolename"
          :label="$t('systemManageUser.tableC')"
        />
        <el-table-column
          prop="jurisdictionType"
          :label="$t('systemManageUser.tableD')"
        />
        <el-table-column
          prop="time"
          :label="$t('systemManageUser.tableE')"
        />
        <!-- <el-table-column fixed="right" :label="$t('common.operation')" width="120">
          <template slot-scope="scope">
            <i class="el-icon-edit" @click="handleEdit(scope.row)">编辑用户角色</i>
            <i class="el-icon-delete" @click="handleDelete(scope.row)"></i>
          </template>
        </el-table-column> -->
      </el-table>

      <!-- 添加 -->
      <el-dialog :visible.sync="addVisible" @close="close" title="添加用户">
        <el-form :model="form" ref="ruleForm" :rules="rules" label-width="80px">
          <el-form-item label="组织" prop="companyId">
            <el-select v-model="form.companyId" clearable>
              <el-option :label="item.companyName" :value="item.id" v-for="(item, index) in companyData" :key="index">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="用户名" prop="userName">
            <el-input v-model="form.userName" clearable />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="form.password" clearable />
          </el-form-item>
          <el-form-item label="角色">
            <el-select v-model="value2" placeholder="请选择">
              <el-option
                v-for="item in roleList"
                :key="item.id"
                :label="item.roleName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit('ruleForm')">{{ $t('common.determine') }}</el-button>
            <el-button @click="addVisible = false">{{ $t('common.cancel') }}</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>

      <el-dialog :visible.sync="editVisible" @close="close1" title="编辑用户角色">
        <el-form ref="ruleForm" label-width="80px">
          <el-form-item label="角色">
            <el-select v-model="value1" multiple placeholder="请选择">
              <el-option
                v-for="item in roleList"
                :key="item.id"
                :label="item.roleName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit1('ruleForm1')">{{ $t('common.determine') }}</el-button>
            <el-button @click="close1">{{ $t('common.cancel') }}</el-button>
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
import myPagination from "@/components/pagination/my-pagination";
import { list_mixins } from '@/mixins'
import { addUser, getUserDetailed, getRoleList, userAddRole } from '@/service/api'
export default {
  name: 'resourceManage',

  components: {
    myPagination
  },

  mixins: [list_mixins],

  data () {
    return {
      tableData: [],
      form: {
        companyId: '',
        userName: '',
        password: ''
      },
      type: 0, // 0-添加 1-编辑
      addVisible: false,
      editVisible: false,
      rules: {
        companyId: [
          { required: true, message: '请选择组织', trigger: 'change' }
        ],
        userName: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      },
      search: {
        companyName: '',
        roleName: ''
      },
      pageObj: {
        allTotal: 0, // 总条数
        currentPage: 1, // 当前页数
        pageSize: 50, // 每页条数
        pageSizes: [10, 20, 50, 100]
      },
      roleList: [],
      value1: [],
      value2: '',
      checkUserId: ''
    }
  },

  created () {
    this.init()
  },
  
  methods: {
    init () {
      this.getUserDetailed()
      this.getRoleList();
    },
    async getUserDetailed() {
      let params = {
        userId: this.userId,
        companyName: this.search.companyName,
        roleName: this.search.roleName
      }
      let resData = await getUserDetailed(params)
      if (resData.status === 200 && resData.data.code === 1) {
        this.tableData = resData.data.data
        console.log("this.tableData", this.tableData)
      }
    },
    async getRoleList() {
      let params = {
        userId: this.userId,
        currentPage: 1,
        pageSize: 1000
      }
      let resData = await getRoleList(params)
      if (resData.status === 200) {
        this.roleList = resData.data.data
        console.log("roleList======", this.roleList)
      }
    },
    searchSubmit () {
      this.getUserDetailed()
    },
    handleEdit (row) {
      this.checkUserId = row.userid
      this.value1[0] = row.roleid
      this.editVisible = true
    },
    handleDelete () {

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
      this.form.companyId = ''
      this.form.userName = ''
      this.form.password = ''
      // this.addVisible = false
      this.init()
    },
    close1() {
      this.value1 = []
      this.editVisible = false
    },
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.type === 0) {
            this.addUser()
          } else {
            // this.updateCompany()
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    async onSubmit1(userId) {
      let params = {
        userId: userId,
        roleId: this.value2
      }
      let resData = await userAddRole(params)
      if (resData.status === 200 && resData.data.code === 1) {
        this.$message.success('添加成功');
      } else {
        this.$message.warning(resData.data.message)
      }
      this.addVisible = false
    },
    handleAdd() {
      this.type = 0
      this.addVisible = true
    },
    async addUser() {
      let params = {
        user: {
          userName: this.form.userName,
          password: this.form.password
        },
        companyId: this.form.companyId
      }
      let resData = await addUser(params)
      if (resData.status === 200) {
        let userId = resData.data.data.id || ''
        console.log("返回的userId", userId)
        this.onSubmit1(userId)
        // this.$message.success('添加成功');
      } else {
        this.$message.warning(resData.data.message)
      }
    }
  }
}
</script>