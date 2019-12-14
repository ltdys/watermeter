<template>
  <div class="role-manage">
    <el-form ref="search" :inline="true" :model="search" class="toolbar" size="mini">
      <el-form-item label="组织机构代码">
        <!-- <el-select v-model="search.companyId" clearable>
          <el-option v-for="(item, index) in companyData1" :key="index" :label="item.companyName" :value="item.id" />
        </el-select> -->
        <el-cascader
          v-model="search.orgList"
          :options="companyData1"
          placeholder="请选择组织机构"
          clearable
          filterable
          :props="setProps"
          @change="changeOrg"
        />
      </el-form-item>
      <el-form-item label="用户角色">
        <el-input v-model="search.roleName" placeholder="请输入用户角色" clearable />
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
      <!-- <el-table-column
        :label="$t('systemManageRole.tableA')"
        width="120"
      >
        <template slot-scope="scope">
          {{ scope.row.userName }}
        </template>
      </el-table-column> -->
      <el-table-column
        prop="roleName"
        :label="$t('systemManageRole.tableB')"
        width="180"
      />
      <el-table-column
        prop="createBy"
        label="创建人"
        width="180"
      />
      <el-table-column
        prop="createBy"
        label="更新人"
        width="180"
      />
      <el-table-column
        :label="$t('systemManageRole.tableE')"
        width="300"
      >
        <template slot-scope="scope">
          {{ scope.row.updateTime | fFormatDate }}
        </template>
      </el-table-column>
      <el-table-column
        prop="note"
        label="备注"
      />
      <el-table-column fixed="right" :label="$t('common.operation')" width="120">
        <template slot-scope="scope">
          <i class="el-icon-edit" @click="handleEdit(scope.row)" />
          <i class="el-icon-delete" @click="handleDelete(scope.row)" />
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加 -->
    <el-dialog :visible.sync="addVisible" :title="title" @close="close">
      <el-form ref="ruleForm" :model="form" :rules="rules" label-width="80px">
        <el-form-item v-if="type == 0" label="组织" prop="companyId">
          <!-- <el-select v-model="form.companyId" clearable>
            <el-option v-for="(item, index) in companyData" :key="index" :label="item.companyName" :value="item.id" />
          </el-select> -->
          <el-cascader
            v-model="form.company"
            :options="companyData1"
            placeholder="请选择组织机构"
            clearable
            filterable
            :props="setProps"
            @change="changeOrgAdd"
          />
        </el-form-item>
        <el-form-item v-if="type == 1" label="组织" prop="companyId">
          <el-select v-model="form.companyId" clearable disabled>
            <el-option v-for="(item, index) in companyData1" :key="index" :label="item.companyName" :value="item.id" />
          </el-select>
          <!-- <el-cascader
            v-model="form.company"
            :options="companyData1"
            placeholder="请选择组织机构"
            clearable
            filterable
            :props="setProps"
            @change="changeOrgAdd"
          /> -->
        </el-form-item>
        <el-form-item label="角色名" prop="roleName">
          <el-input v-model="form.roleName" clearable />
        </el-form-item>
        <el-form-item label="角色类型">
          <el-select v-model="form.roleType">
            <el-option v-for="(item, index) in roleType" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.note" clearable />
        </el-form-item>
        <!-- <el-form-item label="删除标识">
          <el-input v-model="form.deleteFlag" clearable />
        </el-form-item> -->
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
import { findCompany, getRoleList, addRole, updRole, delRole } from "@/service/api";
import myPagination from "@/components/pagination/my-pagination";
import { orgTreeData } from '@/utils/publicUtil'
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
      roleType: [
        {
          label: '管理员',
          value: 0
        }, {
          label: '其他',
          value: 1
        }
      ],
      companyData1: [], // 组织机构
      setProps: { // 设置级联选择器
        label: 'companyName',
        value: 'id',
        expandTrigger: 'click',
        checkStrictly: true
      },
      tableData: [],
      search: {
        orgList: [],
        roleName: '',
        companyId: ''
      },
      form: {
        company: [],
        companyId: '',
        roleName: '',
        note: '',
        deleteFlag: '',
        roleType: 1
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
        "resourceId": "5",
        "oper": "1"
      },
      {
        "resourceId": "6",
        "oper": "1"
      },
      {
        "resourceId": "7",
        "oper": "1"
      },
      {
        "resourceId": "8",
        "oper": "1"
      },
      {
        "resourceId": "9",
        "oper": "1"
      }, {
        "resourceId": "10",
        "oper": "1"
      }, {
        "resourceId": "11",
        "oper": "1"
      }, {
        "resourceId": "12",
        "oper": "1"
      }
      ]
    }
  },

  created () {
    this.init()
    this.findCompany()
    console.log('companyData', this.companyData)
  },

  methods: {
    async getRoleList () {
      const self = this
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
        let list = resData.data.data
        this.tableData = []
        list.forEach(item => {
          self.$set(item, 'path', ['0', item.companyId])
          this.tableData.push(item)
        })
        // this.tableData = resData.data.data
        this.pageObj.allTotal = resData.data.page.totalRow || 0
      }
    },
    async addRole () {
      let params = {
        role: {
          roleName: this.form.roleName,
          companyId: this.form.companyId,
          note: this.form.note,
          roleType: this.form.roleType
        }
      }
      // deleteFlag: this.form.deleteFlag
      // permission: this.permission
      let resData = await addRole(params)
      if (resData.status === 200 && resData.data.code === 1) {
        this.$message.success('添加成功');
      } else {
        this.$message.warning(resData.data.message)
      }
      this.addVisible = false
    },
    async findCompany (key) { // 获取组织机构
      let params = {
        userId: this.userId,
        currentPage: this.pageObj.currentPage,
        pageSize: this.pageObj.pageSize,
        company: {
          id: this.company_id
        }
      }
      let resData = await findCompany(params)
      if (resData.status === 200 && resData.data.data !== null) {
        let list = resData.data.data
        this.companyData1 = JSON.parse(orgTreeData([...list]))
      }
    },
    init () {
      this.getRoleList()
    },
    changeOrg () { // 组织机构选择
      this.search.companyId = this.search.orgList[this.search.orgList.length - 1]
    },
    changeOrgAdd () {
      console.log(this.form.company)
      this.form.companyId = this.form.company[this.form.company.length - 1]
    },
    searchSubmit () {
      this.init()
    },
    handleEdit (row) {
      console.log('row', row)
      this.title = "编辑角色"
      this.form.company = row.path
      this.form.companyId = row.companyId
      this.form.roleName = row.roleName
      this.form.roleType = row.roleType
      this.form.note = row.note
      this.form.deleteFlag = row.deleteFlag
      this.id = row.id
      this.type = 1
      this.addVisible = true
    },
    async updRole () {
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
    async delRole (data) {
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
    close () {
      this.$refs['ruleForm'].resetFields();
      this.form = {
        company: [],
        companyId: '',
        roleName: '',
        note: '',
        deleteFlag: ''
      }
      // this.addVisible = false
      this.init()
    },
    handleAdd () {
      this.title = "添加角色"
      this.type = 0
      this.addVisible = true
    },
    onSubmit (formName) {
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
