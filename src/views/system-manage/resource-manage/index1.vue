<template>
  <div class="resource-manage">
    <el-row>
      <el-col :span="24">
        <el-form ref="search" :inline="true" :model="search" class="toolbar" size="mini">
          <el-form-item label="组织机构">
            <el-input v-model="search.id" placeholder="请填写组织机构代码" clearable />
          </el-form-item>
          <!-- <el-form-item :label="$t('systemManageResource.toolbarB')">
            <el-input v-model="search.areaCode" :placeholder="$t('systemManageResource.toolbarB_')" clearable />
          </el-form-item>
          <el-form-item :label="$t('systemManageResource.toolbarC')">
            <el-input v-model="search.areaName" :placeholder="$t('systemManageResource.toolbarC_')" clearable />
          </el-form-item> -->
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
          <my-region1 :tree-data="treeData" />
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
            width="300"
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
            prop="areaCode"
            :label="$t('systemManageResource.tableB')"
            width="300"
          />
          <el-table-column
            prop="areaName"
            :label="$t('systemManageResource.tableC')"
          />
          <el-table-column
            prop="status"
            :label="$t('systemManageResource.tableD')"
          />
          <el-table-column
            prop="remark"
            :label="$t('systemManageResource.tableE')"
          />
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
        <el-form-item v-show="addType === 2" :label="$t('systemManageResource.dialogA')" prop="parentId">
          <el-select v-model="form.parentId">
            <el-option v-for="(item, index) in treeData" :key="index" :label="item.companyName" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="组织机构名称" prop="companyName">
          <el-input v-model="form.companyName" clearable />
        </el-form-item>
        <el-form-item label="组织机构代码" prop="id">
          <el-input v-model="form.id" clearable />
        </el-form-item>
        <!-- <el-form-item label="片区名称" prop="areaName">
          <el-input v-model="form.areaName" clearable />
        </el-form-item>
        <el-form-item label="片区代码" prop="companyName">
          <el-input v-model="form.areaCode" clearable />
        </el-form-item> -->
        <!-- <el-form-item label="Logo" prop="t3">
          <el-upload
          class="avatar-uploader"
          action="https://jsonplaceholder.typicode.com/posts/"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="form.t3" :src="form.t3" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        </el-form-item> -->
        <el-form-item>
          <el-button type="primary" @click="onSubmit('ruleForm')">{{ $t('common.determine') }}</el-button>
          <el-button @click="resourceVisible = false">{{ $t('common.cancel') }}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getResourceManage } from '@/service/system'
import { orgTreeData } from '@/utils/publicUtil'
import { findCompany, addCompany, deleteCompany, updateCompany, findChildCompany, findParentCompany } from '@/service/api'
import myRegion1 from '@/components/common/region1'
import myPagination from "@/components/pagination/my-pagination";
import { list_mixins } from '@/mixins'
var apps;
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
      treeData: [],
      title: "添加组织",
      defaultProps: {
        children: 'child',
        label: 'companyName'
      },
      tableData: [],
      search: {
        id: '',
        areaName: '',
        areaCode: '',
        companyName: '',
        parentId: ''
      },
      pageObj: {
        allTotal: 0, // 总条数
        currentPage: 1, // 当前页数
        pageSize: 50, // 每页条数
        pageSizes: [10, 20, 50, 100]
      },
      resourceVisible: false, // 添加组织弹窗
      form: {
        id: '',
        companyName: '',
        areaCode: '',
        areaName: '',
        parentId: '',
        createBy: ''
      },
      type: 0, // 0-添加 1-编辑
      addType: 1, // 1 一级 2 二级
      rules: {
        id: [
          { required: true, message: "请输入机构代码", trigger: 'blur' }
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
      // this.findParentCompany()
      this.findCompany()
    },
    async findCompany () { // 获取组织机构
      let params = {
        userId: this.userId,
        currentPage: this.pageObj.currentPage,
        pageSize: this.pageObj.pageSize
      }
      let resData = await findCompany(params)
      console.log('获取组织机构', resData)
      if (resData.status === 200 && resData.data.data !== null) {
        let list = resData.data.data
        this.treeData = JSON.parse(orgTreeData([...list]))
      }
    },
    async findParentCompany () {
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
        this.search.parentId = this.treeData[0].id
        // this.$store.dispatch("user/setCompanyData", temp)
        this.$nextTick(() => {
          this.findChildCompany()
        })
        // this.tableData = resData.data.data
        // temp.forEach((item, index) => {
        //   if(item.parentId != 0) {
        //     this.tableData.push(item)
        //   } else {
        //     this.treeData.push(item)
        //   }
        // })
      }
    },
    async findChildCompany () {
      let params = {
        userId: this.userId,
        currentPage: this.pageObj.currentPage,
        pageSize: this.pageObj.pageSize,
        company: this.search
      }
      let resData = await findChildCompany(params)
      this.tableData = []
      if (resData.status === 200) {
        this.tableData = resData.data.data
        this.pageObj.allTotal = resData.data.page.totalRow || 0
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
      this.search.parentId = data.id
      this.findChildCompany()
    },
    searchSubmit () {
      this.findChildCompany()
    },
    handleEdit (row) {
      this.title = "编辑组织"
      this.id = row.id
      this.form.id = row.id
      this.form.areaName = row.areaName
      this.form.areaCode = row.areaCode
      this.form.companyName = row.companyName
      this.form.parentId = row.parentId
      this.type = 1
      this.addType = 2
      this.resourceVisible = true
    },
    addResource () {
      this.addType = 1
      this.type = 0
      this.form.parentId = 0
      this.resourceVisible = true
    },
    add1 () {
      this.title = "添加组织"
      this.addType = 2
      this.type = 0
      this.form.parentId = ''
      this.resourceVisible = true
    },
    close () {
      this.type = 0, // 0-添加 1-编辑
      this.addType = 1, // 1 一级 2 二级
      this.$refs['ruleForm'].resetFields();
      this.form.areaCode = ''
      this.form.companyName = ''
      this.form.areaName = ''
      // this.resourceVisible = false
      this.init()
    },
    onSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.type === 0) {
            this.addCompany()
          } else {
            this.updateCompany()
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    handleAvatarSuccess (res, file) {
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
    async addCompany () {
      let parentId = this.addType === 1 ? 0 : this.form.parentId
      let params = {
        id: this.form.id,
        companyName: this.form.companyName,
        areaCode: this.form.areaCode,
        areaName: this.form.areaName,
        parentId: parentId,
        createBy: this.userName
      }
      console.log("params", params)
      let resData = await addCompany(params)
      console.log("======resData", resData)
      if (resData.status === 200 && resData.data.code === 1) {
        this.$message.success('添加成功');
      } else {
        this.$message.warning(resData.data.message)
      }
      this.resourceVisible = false
    },
    async updateCompany () {
      let parentId = this.addType === 1 ? 0 : this.form.parentId
      let params = {
        id: this.id,
        areaCode: this.form.areaCode,
        areaName: this.form.areaName,
        companyName: this.form.companyName,
        updateBy: this.userName,
        parentId: parentId
      }
      let resData = await updateCompany(params)
      if (resData.status === 200 && resData.data.code === 1) {
        this.$message.success('修改成功');
      } else {
        this.$message.warning(resData.data.message)
      }
      this.resourceVisible = false
    },
    renderContent (h, { node, data, store }) {
      return (
        <span style='flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;'>
          <span>
            <span>{node.label}</span>
          </span>
          <span>
            <span style='font-size: 12px;color: #000;margin-right: 5px;' type='text' on-click={ () => this.edit(data) }>编辑</span>
            <span style='font-size: 12px;color: #000;margin-right: 5px;' type='text' on-click={ () => this.delete(node, data) }>删除</span>
          </span>
        </span>);
    },
    edit (data) {
      this.id = data.id
      this.type = 1
      this.form.id = data.id
      this.form.parentId = 0
      this.form.companyName = data.companyName
      this.form.areaCode = data.areaCode
      this.form.areaName = data.areaName
      this.resourceVisible = true
    },
    delete (node, data) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteCompany(node, data)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    handleDelete (row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteCompany(null, row)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    async deleteCompany (node, data) {
      let params = {
        userName: this.userName,
        companyId: data.id
      }
      let resData = await deleteCompany(params)
      if (resData.status === 200 && resData.data.code === 1) {
        this.$message.success('删除成功');
        this.init()
      } else {
        this.$message.warning(resData.data.message)
      }
    },
    refresh () {
      this.search = {
        id: '',
        areaName: '',
        areaCode: '',
        companyName: '',
        parentId: ''
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
