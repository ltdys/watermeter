<template>
  <div class="user-manage">
    <el-form ref="search" :inline="true" :model="search" class="toolbar" size="mini">
      <el-form-item label="组织机构">
        <!-- <el-select v-model="search.companyName" clearable filterable>
          <el-option v-for="(item, index) in companyData1" :key="index" :label="item.companyName" :value="item.companyName" />
        </el-select> -->
        <el-cascader
          ref="cascader13"
          v-model="search.orgList"
          :options="companyData1"
          clearable
          filterable
          :props="setProps"
          @change="changeOrg"
        />
      </el-form-item>
      <el-form-item label="用户名">
        <el-input v-model.trim="search.roleName" placeholder="请输入用户名" clearable />
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
        label="所属组织"
        width="180"
      />
      <el-table-column
        prop="address"
        label="所属区域"
        width="180"
      />
      <el-table-column
        prop="rolename"
        :label="$t('systemManageUser.tableC')"
      />
      <el-table-column
        prop="realname"
        label="真实姓名"
      />
      <el-table-column label="性别">
        <template slot-scope="scope">
          {{ scope.row.sex | fUserSex }}
        </template>
      </el-table-column>
      <el-table-column
        prop="age"
        label="年龄"
      />
      <el-table-column
        prop="mobile"
        label="手机号"
      />
      <el-table-column
        prop="email"
        label="邮箱"
      />
      <el-table-column label="状态">
        <template slot-scope="scope">
          {{ scope.row.status | fUserStatus }}
        </template>
      </el-table-column>
      <!-- <el-table-column
        prop="jurisdictionType"
        :label="$t('systemManageUser.tableD')"
      />
      <el-table-column
        prop="time"
        :label="$t('systemManageUser.tableE')"
      /> -->
      <el-table-column fixed="right" :label="$t('common.operation')" width="120">
        <template slot-scope="scope">
          <i class="el-icon-edit" @click="handleEdit(scope.row)" />
          <i class="el-icon-delete" @click="handleDelete(scope.row)" />
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加 -->
    <el-dialog :visible.sync="addVisible" :title="type == 0 ? '添加用户' : '编辑用户'" :close-on-click-modal="false" @close="close">
      <el-form ref="ruleForm" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="组织" prop="companyId">
          <!-- <el-select v-model="form.companyId" placeholder="请选择组织" clearable filterable>
            <el-option v-for="(item, index) in companyData1" :key="index" :label="item.companyName" :value="item.id" />
          </el-select> -->
          <el-cascader
            ref="cascader14"
            v-model="form.company"
            :options="companyData1"
            clearable
            filterable
            :props="setProps"
            :disabled="isRoleD"
            @change="changeOrgAdd"
          />
        </el-form-item>
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="form.userName" placeholder="请输入用户名" clearable />
        </el-form-item>
        <el-form-item v-if="type == 0" label="密码" prop="password">
          <el-input v-model="form.password" type="password" placeholder="请输入密码" clearable />
        </el-form-item>
        <el-form-item v-if="type == 1" label="密码">
          <el-input v-model="form.password" type="password" placeholder="请输入密码" clearable />
        </el-form-item>
        <el-form-item label="角色" prop="roleName">
          <el-select v-model="form.roleName" placeholder="请选择角色" :disabled="isRoleDisabled">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="展示姓名">
          <el-input v-model="form.realName" placeholder="请输入展示姓名" clearable />
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="form.sex" placeholder="请选择性别">
            <el-option
              v-for="item in sexList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="年龄">
          <el-input v-model="form.age" placeholder="请输入年龄" clearable />
        </el-form-item>
        <el-form-item label="手机号码">
          <el-input v-model="form.mobile" type="number" placeholder="请输入手机号码" clearable />
        </el-form-item>
        <el-form-item label="邮箱地址">
          <el-input v-model="form.email" placeholder="请输入邮箱地址" clearable />
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="form.address" placeholder="请输入地址" clearable />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择状态">
            <el-option
              v-for="item in statusList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit('ruleForm')">{{ $t('common.determine') }}</el-button>
          <el-button @click="addVisible = false">{{ $t('common.cancel') }}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- <el-dialog :visible.sync="editVisible" title="编辑用户角色" @close="close1">
      <el-form ref="ruleForm" label-width="80px">
        <el-form-item label="角色">
          <el-select v-model="value1" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit1('ruleForm1')">{{ $t('common.determine') }}</el-button>
          <el-button @click="close1">{{ $t('common.cancel') }}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog> -->

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
import { orgTreeData, treeDataUtil } from '@/utils/publicUtil'
import { addUser, getUserDetailed, getRoleList, userAddRole, findCompany, updateUser, deleteUser } from '@/service/api'
import { filter } from 'minimatch';
export default {
  name: 'resourceManage',

  components: {
    myPagination
  },

  mixins: [list_mixins],

  data () {
    return {
      isRoleD: false,
      setProps: { // 设置级联选择器
        label: 'companyName',
        value: 'id',
        expandTrigger: 'click',
        checkStrictly: true
      },
      statusList: [
        {
          label: '正常',
          value: 0
        }, {
          label: '锁定',
          value: 1
        }
      ],
      sexList: [
        {
          label: '男',
          value: 1
        }, {
          label: '女',
          value: 2
        }, {
          label: '保密',
          value: 0
        }
      ],
      companyData1: [],
      companyList: [], // 组织备份
      tableData: [],
      rowId: '', // 选择的用户id
      currentRow: {},
      form: {
        company: [],
        companyId: '',
        userName: '',
        password: '',
        roleName: '',
        realName: '',
        sex: '',
        age: '',
        mobile: '',
        email: '',
        address: '',
        status: ''
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
        roleName: [
          { required: true, message: '请选择用户', trigger: 'change' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ]
      },
      search: {
        companyName: '',
        roleName: '',
        orgList: []
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
      checkUserId: '',
      loginType: -1, // 当前登录的角色type  -1  超级管理员  0  管理员  2  其他人员
      isRoleDisabled: false
    }
  },

  created () {
    let resourcesList = JSON.parse(localStorage.getItem("USER_INFO")).resources
    if (resourcesList && resourcesList.length !== 0) {
      let comL = resourcesList.filter(item => {
        if (item.resName == '用户管理' && item.oper == '1') {
          return item
        }
      })
      console.log('ssssss', comL)
      if (comL.length === 0) {
        this.isRoleD = true
      } else {
        this.isRoleD = false
      }
    }
    this.init()
  },

  methods: {
    init () {
      let params = {
        userId: this.userId,
        currentPage: 1,
        pageSize: 1000
      }
      this.getUserDetailed()
      this.getRoleList(params);
      this.findCompany();
    },
    async getUserDetailed () { // 获取用户列表
      const self = this;
      // debugger
      let params = {
        companyId: this.search.companyName || this.company_id,
        sysUser: {
          userName: this.search.roleName
        },
        currentPage: this.pageObj.currentPage,
        pageSize: this.pageObj.pageSize
        // companyName: this.search.companyName,
        // roleName: this.search.roleName
      }
      let resData = await getUserDetailed(params)
      if (resData.status === 200 && resData.data.code === 1) {
        let list = resData.data.data
        self.tableData = list.map(item => {
          if (!item.hasOwnProperty('status')) self.$set(item, 'status', '') // 状态
          if (!item.hasOwnProperty('realname')) self.$set(item, 'realname', '') // 真实姓名
          if (!item.hasOwnProperty('address')) self.$set(item, 'address', '') // 地址
          if (!item.hasOwnProperty('mobile')) self.$set(item, 'mobile', '') // 手机号
          if (!item.hasOwnProperty('email')) self.$set(item, 'email', '') // 邮箱
          if (!item.hasOwnProperty('age')) self.$set(item, 'age', '') // 年龄
          if (!item.hasOwnProperty('sex')) self.$set(item, 'sex', '') // 性别
          if (!item.hasOwnProperty('pwd')) self.$set(item, 'pwd', '******') // 性别
          return item
        })
        self.pageObj.allTotal = resData.data.page.totalRow
        console.log("this.tableData", this.tableData)
      }
    },
    async getRoleList (params) { // 获取角色
      const self = this
      let resData = await getRoleList(params)
      if (resData.status === 200) {
        this.roleList = resData.data.data
        if (self.role_name == '超级管理员') {
          self.loginType = -1
        } else {
          self.loginType = this.roleList.filter(item => {
            return item.roleName == self.role_name
          })[0].roleType
        }
        console.log("loginType", this.loginType)
        console.log("roleList======", this.roleList)
      }
    },
    async findCompany (key) { // 获取组织机构
      let params = {
        userId: this.userId,
        currentPage: this.pageObj.currentPage,
        pageSize: 10000,
        company: {
          id: this.company_id
        }
      }
      let resData = await findCompany(params)
      if (resData.status === 200 && resData.data.data !== null) {
        let list = resData.data.data
        this.companyList = list
        this.companyData1 = JSON.parse(orgTreeData([...list]))
      }
    },
    async updateUser () { // 编辑用户信息
      const self = this;
      let param = {
        sysUser: {
          id: self.rowId,
          userName: self.form.userName,
          realName: self.form.realName,
          password: self.form.password == '******' ? '' : self.form.password,
          sex: self.form.sex,
          age: self.form.age,
          mobile: self.form.mobile,
          email: self.form.email,
          address: self.form.address,
          status: self.form.status
        },
        roleId: self.form.roleName
      }
      console.log(param)
      let res = await updateUser(param)
      console.log('res', res)
      if (res.status == 200 && res.data.code == 1) {
        self.$message.success('编辑成功');
        self.close()
      } else {
        self.$message.warning(res.data.message);
      }
    },
    async deleteUser (param) { // 删除用户信息
      let resData = await deleteUser(param)
      if (resData.status === 200) {
        this.$message.info(resData.data.message)
        this.init()
      }
    },
    searchSubmit () {
      this.getUserDetailed()
    },
    changeOrg () { // 组织机构选择
      this.cascaderFalse('cascader13')
      this.search.companyName = this.search.orgList[this.search.orgList.length - 1]
    },
    changeOrgAdd () {
      this.cascaderFalse('cascader14')
      this.form.companyId = this.form.company[this.form.company.length - 1]
      this.form.roleName = ''
      const params = {
        userId: this.userId,
        pageSize: this.pageObj.pageSize,
        currentPage: this.pageObj.currentPage,
        role: {
          companyId: this.form.companyId
        }
      }
      this.getRoleList(params)
    },
    handleEdit (row) { // 编辑
      console.log('row', row)
      this.rowId = row.userid
      this.currentRow = row
      let company = this.companyList.filter(item => {
        return row.companyid == item.id
      })[0]
      this.type = 1
      if (company) {
        this.form.company = company.parentId == 0 ? [company.id] : [company.parentId, company.id]
      }
      // isRoleDisabled
      if (this.loginType == -1) {
        this.isRoleDisabled = false
      } else if ((this.loginType == 1) || (this.loginType == 0 && this.role_name == row.rolename)) {
        this.isRoleDisabled = true
      } else {
        this.isRoleDisabled = false
      }
      this.form.companyId = row.companyid
      this.form.userName = row.username
      this.form.password = row.pwd
      this.form.roleName = row.roleid
      this.form.realName = row.realname
      this.form.sex = row.sex
      this.form.age = row.age
      this.form.mobile = row.mobile
      this.form.email = row.email
      this.form.address = row.address
      this.form.status = row.status
      const params = {
        userId: this.userId,
        pageSize: this.pageObj.pageSize,
        currentPage: this.pageObj.currentPage,
        role: {
          companyId: row.companyid
        }
      }
      this.getRoleList(params)
      this.addVisible = true
      // this.checkUserId = row.userid
      // this.value1[0] = row.roleid
      // this.editVisible = true
    },
    handleDelete (row) { // 删除
      this.$confirm(`您确定要删除 ${row.username} 吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let param = {
          userId: row.userid
        }
        this.deleteUser(param)
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
    close () {
      this.$refs['ruleForm'].resetFields();
      // this.form.companyId = ''
      // this.form.userName = ''
      // this.form.password = ''
      this.form = {
        company: [],
        companyId: '',
        userName: '',
        password: '',
        roleName: '',
        realName: '',
        sex: '',
        age: '',
        mobile: '',
        email: '',
        address: '',
        status: ''
      }
      this.addVisible = false
      this.init()
    },
    close1 () {
      this.value1 = []
      this.editVisible = false
    },
    onSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.type === 0) {
            this.addUser()
          } else {
            this.updateUser()
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    async onSubmit1 (userId) {
      let params = {
        userId: userId,
        roleId: this.form.roleName
      }
      let resData = await userAddRole(params)
      if (resData.status === 200 && resData.data.code === 1) {
        this.$message.success('添加成功');
      } else {
        this.$message.warning(resData.data.message)
      }
      this.addVisible = false
    },
    handleAdd () {
      this.type = 0
      this.addVisible = true
    },
    async addUser () {
      let params = {
        user: {
          userName: this.form.userName,
          password: this.form.password,
          realName: this.form.realName,
          sex: this.form.sex,
          age: this.form.age,
          mobile: this.form.mobile,
          email: this.form.email,
          address: this.form.address,
          status: this.form.status
        },
        companyId: this.form.companyId
      }
      let resData = await addUser(params)
      if (resData.status === 200) {
        if (resData.data.code == 1) {
          let userId = resData.data.data.id || ''
          console.log("返回的userId", userId)
          this.onSubmit1(userId)
        } else {
          this.$message.warning(resData.data.message);
        }
      } else {
        this.$message.warning(resData.data.message)
      }
    }
  }
}
</script>
