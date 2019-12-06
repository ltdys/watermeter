<template>
  <div class="resource-manage">
    <el-row>
      <el-col :span="24">
        <el-form ref="search" :inline="true" :model="search" class="toolbar" size="mini">
          <el-form-item label="组织机构">
            <el-select v-model="search.parentId" clearable placeholder="请选择组织机构">
              <el-option
                v-for="item in treeData"
                :key="item.value"
                :label="item.companyName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="searchSubmit">{{ $t('common.query') }}</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-refresh" size="mini" @click="refresh()">刷新</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" class="custom-button" @click="add1()">{{ $t('common.add') }}</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="4" :style="{height: (tableHeightPage + 52) + 'px', background: '#E9E9E9'}">
        <el-scrollbar class="scrollbar-page" wrap-class="scrollbar-wrapper">
          <el-button type="primary" size="mini" class="resource-manage_add" @click="addResource">{{ $t('systemManageResource.addBtn') }}</el-button>
          <!-- <el-tree :data="treeData" :props="defaultProps" :render-content="renderContent" @node-click="handleNodeClick" /> -->
          <my-region1
            :tree-data="treeData"
            @handleNodeClick="handleNodeClick"
            @handleNodeEdit="handleNodeEdit"
            @handleNodeDelete="handleNodeDelete"
          />
        </el-scrollbar>
      </el-col>
      <el-col :span="20">
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
            label="组织机构名称"
            width="200"
          >
            <template slot-scope="scope">
              {{ scope.row.companyName }}
            </template>
          </el-table-column>
          <el-table-column
            label="组织机构代码"
            width="300"
          >
            <template slot-scope="scope">
              {{ scope.row.id }}
            </template>
          </el-table-column>
          <el-table-column
            label="联系人"
            width="200"
          >
            <template slot-scope="scope">
              {{ scope.row.person }}
            </template>
          </el-table-column>
          <el-table-column
            label="联系电话"
            width="200"
          >
            <template slot-scope="scope">
              {{ scope.row.phone }}
            </template>
          </el-table-column>
          <el-table-column
            label="地址"
            min-width="300"
          >
            <template slot-scope="scope">
              {{ scope.row.address }}
            </template>
          </el-table-column>
          <el-table-column
            label="邮箱地址"
            width="300"
          >
            <template slot-scope="scope">
              {{ scope.row.email }}
            </template>
          </el-table-column>
          <el-table-column
            width="150"
            :label="$t('systemManageResource.tableD')"
          >
            <template slot-scope="scope">
              {{ scope.row.status | fOrgChange }}
            </template>
          </el-table-column>
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
      </el-col>
    </el-row>

    <el-dialog :title="title" :visible.sync="resourceVisible" @close="close">
      <el-form ref="ruleForm" :model="form" :rules="rules" label-width="120px">
        <el-form-item v-if="addType === 2" label="所属组织" prop="parentId">
          <el-select v-model="form.parentId">
            <el-option v-for="(item, index) in treeData" :key="index" :label="item.companyName" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="组织机构名称" prop="companyName">
          <el-input v-model="form.companyName" clearable />
        </el-form-item>
        <el-form-item label="组织机构代码" prop="id">
          <el-input v-model="form.id" clearable :disabled="banObj.IsCode" />
        </el-form-item>
        <el-form-item label="Logo图片">
          <!-- action="https://jsonplaceholder.typicode.com/posts/"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload" -->
          <el-upload
            class="avatar-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :auto-upload="false"
            :show-file-list="false"

            :on-change="handleChange"
          >
            <img v-if="form.t3" :src="form.t3" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item label="联系人">
          <el-input v-model="form.person" clearable />
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="form.phone" type="number" clearable />
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="form.address" clearable />
        </el-form-item>
        <el-form-item label="邮箱地址">
          <el-input v-model="form.email" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.status">
            <el-option v-for="(item, index) in statusList" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit('ruleForm')">{{ $t('common.determine') }}</el-button>
          <el-button @click="resourceVisible = false">{{ $t('common.cancel') }}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
// import { getResourceManage } from '@/service/system'
import { addCompany, deleteCompany, updateCompany, findChildCompany, findParentCompany, findDistrict } from '@/service/api'
import myRegion1 from '@/components/common/region1'
import myPagination from "@/components/pagination/my-pagination";
import { treeDataUtil } from "@/utils/publicUtil";
import { list_mixins } from '@/mixins'
var apps;
var resourceId = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入机构代码'))
  } else if (value == 0) {
    callback(new Error('机构代码不能为0'))
  } else {
    callback()
  }
}
export default {

  name: 'resourceManage',
  filters: {
    formatParentId: function (val) {
      apps.treeData.forEach((item, index) => {
        if (item.id === val.toString()) {
          val = item.companyName;
        }
      })
      return val
    }
  },

  components: {
    myPagination, myRegion1
  },

  mixins: [list_mixins],

  data () {
    return {
      statusList: [ // 状态
        {
          label: '正常',
          value: 0
        }, {
          label: '锁定',
          value: 1
        }
      ],
      currentTree: {}, // 选中的父组织
      treeData: [],
      title: "添加组织",
      defaultProps: {
        children: 'child',
        label: 'companyName'
      },
      tableData: [],
      search: {
        parentId: ''
      },
      pageObj: {
        allTotal: 0, // 总条数
        currentPage: 1, // 当前页数
        pageSize: 50, // 每页条数
        pageSizes: [10, 20, 50, 100]
      },
      resourceVisible: false, // 添加组织弹窗
      banObj: { // 禁止的对象
        IsCode: false
      },
      districtData1: [],
      form: {
        id: '', // 组织代码
        companyName: '', // 组织名称
        logo: '', // Logo图片
        person: '', // 联系人
        phone: '', // 联系电话
        address: '', // 地址
        email: '', // 邮箱地址
        status: '', // 状态
        parentId: '', // 父组织Id
        createBy: '', // 创建者
        t3: '' // 测试图片
      },
      type: 0, // 0-添加 1-编辑
      addType: 1, // 1 一级 2 二级
      rules: {
        id: [
          { required: true, validator: resourceId }
        ],
        parentId: [
          { required: true, message: this.$t('systemManageResource.dialogA_'), trigger: 'change' }
        ],
        companyName: [
          { required: true, message: this.$t('systemManageResource.dialogB_'), trigger: 'blur' }
        ],
        t3: [
          { required: true, message: this.$t('systemManageResource.dialogC_'), trigger: 'change' }
        ],
        areaCode: [
          { required: true, message: this.$t('systemManageResource.dialogD_'), trigger: 'blur' }
        ],
        areaName: [
          { required: true, message: '请填写片区名称', trigger: 'blur' }
        ]
      }
    }
  },

  computed: {
    districtIschage () {
      return this.$store.state.user.districtIschage
    }
  },
  watch: {
    districtIschage: {
      handler: function () {
        this.findCompany()
      },
      deep: true
    }
  },

  beforeCreate () {
    apps = this
  },

  created () {
    this.init()
  },

  methods: {
    init () {
      this.findParentCompany()
      this.findDistrict()
    },
    async findParentCompany () { // 获取一级组织
      let params = {
        userId: this.userId,
        currentPage: this.pageObj.currentPage,
        pageSize: this.pageObj.pageSize,
        company: this.search
      }
      let resData = await findParentCompany(params)
      this.tableData = []
      this.treeData = []
      if (resData.status === 200) {
        let temp = resData.data.data
        this.treeData = temp
        this.search.parentId = this.search.parentId === '' ? this.treeData[0].id : this.search.parentId
        this.$store.dispatch("user/setCompanyData", temp)
        this.$nextTick(() => {
          this.findChildCompany()
        })
      }
    },
    async findChildCompany () { // 获取二级组织
      let params = {
        userId: this.userId,
        currentPage: this.pageObj.currentPage,
        pageSize: this.pageObj.pageSize,
        company: this.search
      }
      let resData = await findChildCompany(params)
      console.log('resData', resData)
      this.tableData = []
      if (resData.status === 200) {
        this.tableData = resData.data.data
        this.pageObj.allTotal = resData.data.page.totalRow || 0
      }
    },
    async findDistrict () { // 查询区域
      const self = this;
      let userInfo = JSON.parse(localStorage.getItem("USER_INFO"));
      let companyId = ''
      if (userInfo) {
        companyId = userInfo.companyId
      }
      let params = {
        companyId: companyId
      }
      let res = await findDistrict(params)
      console.log('登录查询区域返回值', res)
      if (res.status === 200 && res.data.data !== null) {
        let list = res.data.data || []
        if (list.length !== 0) {
          list = list.map(item => {
            self.$set(item, 'parentId', item.parentid)
            self.$set(item, 'companyId', item.companyid)
            return item
          })
          self.$nextTick(() => {
            this.districtData1 = JSON.parse(treeDataUtil([...list], 'parentId', 'id'))
            this.districtData1 = saveTwo(this.districtData1)
            this.$store.dispatch("user/setdistrictData1", this.districtData1)
          })
        } else {
          this.districtData1 = list
          this.$store.dispatch("user/setdistrictData1", this.districtData1)
        }
      }
    },
    async getResourceManage () {
      const params = {
        rows: this.pageObj.pageSize,
        page: this.pageObj.currentPage
      }
      let res = await getResourceManage(params)
      this.tableData = res.data.data
      this.pageObj.allTotal = res.data.allTotal
    },
    pageChange (data) { // 每页条数切换回调事件
      this.pageObj.pageSize = data;
      this.init()
    },
    currentChange (data) { // 当前页切换事件
      this.pageObj.currentPage = data;
      this.init()
    },
    handleNodeClick (data) {
      console.log(data);
      this.pageObj.currentPage = 1
      this.currentTree = data
      this.search.parentId = data.id
      this.findChildCompany()
    },
    searchSubmit () {
      this.findChildCompany()
    },
    handleEdit (data) {
      this.title = "编辑组织"
      this.id = data.id
      this.form.id = data.id
      this.form.companyName = data.companyName
      this.form.parentId = data.parentId
      this.form.logo = data.logo
      this.form.person = data.person
      this.form.phone = data.phone
      this.form.address = data.address
      this.form.email = data.email
      this.form.status = data.status
      this.form.parentId = data.parentId
      this.form.createBy = data.createBy
      this.banObj.IsCode = true
      this.type = 1
      this.addType = 2
      this.resourceVisible = true
    },
    addResource () { // 添加一级组织
      this.addType = 1
      this.type = 0
      this.form.parentId = 0
      this.form = {
        id: '', // 组织代码
        companyName: '', // 组织名称
        logo: '', // Logo图片
        person: '', // 联系人
        phone: '', // 联系电话
        address: '', // 地址
        email: '', // 邮箱地址
        status: '', // 状态
        parentId: '', // 父组织Id
        createBy: '', // 创建者
        t3: '' // 测试图片
      }
      this.banObj.IsCode = false
      this.resourceVisible = true
    },
    add1 () {
      this.title = "添加组织"
      this.addType = 2
      this.type = 0
      this.form = {
        id: '', // 组织代码
        companyName: '', // 组织名称
        logo: '', // Logo图片
        person: '', // 联系人
        phone: '', // 联系电话
        address: '', // 地址
        email: '', // 邮箱地址
        status: '', // 状态
        parentId: '', // 父组织Id
        createBy: '', // 创建者
        t3: '' // 测试图片
      }
      this.form.parentId = this.search.parentId === '' ? '' : this.search.parentId
      this.banObj.IsCode = false
      this.resourceVisible = true
    },
    close () {
      this.type = 0 // 0-添加 1-编辑
      this.addType = 1 // 1 一级 2 二级
      this.$refs['ruleForm'].resetFields();
      // this.resourceVisible = false
      this.init()
    },
    onSubmit (formName) { // 新增 或 修改 弹框确认按钮
      const self = this;
      console.log('0-添加 1-编辑', self.type)
      console.log('1-一级 2-二级', self.addType)
      self.$refs[formName].validate((valid) => {
        if (valid) {
          if (self.type === 0) {
            self.addCompany()
          } else {
            self.updateCompany()
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    handleChange (file, fileList) {
      console.log('file', file)
      this.form.t3 = URL.createObjectURL(file.raw);
    },
    handleAvatarSuccess (res, file) {
      console.log('file', file)
      this.form.t3 = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    // 一级菜单功能
    handleNodeEdit (data) { // 一级菜单修改
      console.log(data)
      this.title = "编辑组织"
      this.id = data.id
      this.form.id = data.id
      this.form.companyName = data.companyName
      this.form.parentId = data.parentId
      this.form.logo = data.logo
      this.form.person = data.person
      this.form.phone = data.phone
      this.form.address = data.address
      this.form.email = data.email
      this.form.status = data.status
      this.form.parentId = data.parentId
      this.form.createBy = data.createBy
      this.banObj.IsCode = true
      this.type = 1
      this.addType = 1
      this.resourceVisible = true
    },
    handleNodeDelete (node, data) { // 一级菜单删除
      this.addType = 1
      this.deleteCompany(node, data)
    },
    async addCompany () { // 新增组织
      let parentId = this.addType === 1 ? 0 : this.form.parentId
      let params = {
        id: this.form.id,
        companyName: this.form.companyName,
        logoId: this.form.logo,
        person: this.form.person,
        phone: this.form.phone,
        address: this.form.address,
        email: this.form.email,
        status: this.form.status,
        parentId: parentId,
        createBy: this.userName
      }
      let resData = await addCompany(params)
      if (resData.status === 200 && resData.data.code === 1) {
        this.$message.success(resData.data.message);
        console.log('this.addType', this.addType)
        if (this.addType == 2) { // 二级
          this.searchSubmit()
        } else {
          this.init()
        }
      } else {
        this.$message.warning(resData.data.message)
      }
      this.resourceVisible = false
    },
    async updateCompany () { // 修改组织
      let parentId = this.addType === 1 ? 0 : this.form.parentId
      let params = {
        id: this.id,
        companyName: this.form.companyName,
        logoId: this.form.logo,
        person: this.form.person,
        phone: this.form.phone,
        address: this.form.address,
        email: this.form.email,
        status: this.form.status,
        updateBy: this.userName,
        parentId: parentId
      }
      let resData = await updateCompany(params)
      if (resData.status === 200 && resData.data.code === 1) {
        this.$message.success(resData.data.message);
      } else {
        this.$message.warning(resData.data.message)
      }
      this.resourceVisible = false
    },
    handleDelete (row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.addType = 2
        this.deleteCompany(null, row)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    async deleteCompany (node, data) { // 删除组织
      let params = {
        userName: this.userName,
        companyId: data.id
      }
      let resData = await deleteCompany(params)
      if (resData.status === 200 && resData.data.code === 1) {
        this.$message.success('删除成功');
        if (this.addType == 2) {
          this.findChildCompany()
        } else {
          this.search.parentId = ''
          this.init()
        }
      } else {
        this.$message.warning(resData.data.message)
      }
    },
    refresh () {
      this.search.parentId = ''
      this.form = {
        id: '', // 组织代码
        companyName: '', // 组织名称
        logo: '', // Logo图片
        person: '', // 联系人
        phone: '', // 联系电话
        address: '', // 地址
        email: '', // 邮箱地址
        status: '', // 状态
        parentId: '', // 父组织Id
        createBy: '', // 创建者
        t3: '' // 测试图片
      }
      this.init()
    }
  }
}
</script>

<style lang="scss">
  .resource-manage {
    &_add {
      margin: 10px 20px 10px 20px;
    }
    .el-tree-node__label {
      font-size: 16px;
      color: #9EA0A6;
    }
    .scrollbar-page{
      .el-scrollbar__view{
        height: calc(100% - 48px);
      }
    }
  }
</style>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
