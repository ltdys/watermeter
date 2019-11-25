<template>
  <div class="wealth">
    <el-row>
      <el-col :span="24">
        <el-form ref="search" :inline="true" :model="search" class="toolbar" size="mini">
          <el-form-item label="用户名称">
            <el-select v-model="search.id" filterable clearable placeholder="请选择用户名称">
              <el-option
                v-for="item in selectList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="searchSubmit">{{ $t('common.query') }}</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" class="custom-button" @click="add()">{{ $t('common.add') }}</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="24">
        <el-table
          :data="tableList"
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
            label="菜单资源名称"
            width="300"
          >
            <template slot-scope="scope">
              {{ scope.row.resName }}
            </template>
          </el-table-column>
          <el-table-column fixed="right" :label="$t('common.operation')" width="120">
            <template slot-scope="scope">
              <i class="el-icon-edit" @click="handleEdit(scope.row)" />
              <i class="el-icon-delete" @click="handleDelete(scope.row)" />
            </template>
          </el-table-column>
        </el-table>
        <!-- <my-pagination
          :all-total="pageObj.allTotal"
          :current-page="pageObj.currentPage"
          :page-size="pageObj.pageSize"
          :page-sizes="pageObj.pageSizes"
          @pageChange="pageChange"
          @currentChange="currentChange"
        /> -->
      </el-col>
    </el-row>
    <el-dialog :title="dialog.status === 0 ? '新增资源' : '修改资源'" :visible.sync="dialog.resourceVisible" @close="close">
      <el-form ref="ruleForm" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="菜单资源名称" prop="resName">
          <el-input v-model="form.resName" clearable />
        </el-form-item>
        <el-form-item label="扩展名称">
          <el-input v-model="form.displayName" clearable />
        </el-form-item>
        <el-form-item label="上一级菜单资源">
          <el-input v-model="form.parent" clearable />
        </el-form-item>
        <el-form-item label="跳转路径" prop="router">
          <el-input v-model="form.router" clearable />
        </el-form-item>
        <el-form-item label="路径参数">
          <el-input v-model="form.params" clearable />
        </el-form-item>
        <el-form-item class="m-switch" label="是否激活">
          <el-switch
            v-model="form.active"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="是"
            inactive-text="否"
          />
        </el-form-item>
        <el-form-item class="m-switch" label="是否只读">
          <el-switch
            v-model="form.readOnly"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="是"
            inactive-text="否"
          />
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
// import myPagination from "@/components/pagination/my-pagination";
import { getUserDetailed, addResource, delResource, updResource, getUserResource } from '@/service/api'
import { list_mixins } from '@/mixins'
export default {
  components: {
    // myPagination
  },
  mixins: [list_mixins],
  data () {
    return {
      search: {
        id: ''
      },
      selectList: [], // 用户信息列表
      tableList: [], // 资源列表
      // 分页
      pageObj: {
        allTotal: 0, // 总条数
        currentPage: 1, // 当前页数
        pageSize: 50, // 每页条数
        pageSizes: [10, 20, 50, 100]
      },
      dialog: {
        status: 0, // 0  新增  1  修改
        resourceVisible: false
      },
      form: {
        resName: '', // 资源名称
        displayName: '', // 扩展名称
        parent: '', // 上一级菜单资源
        router: '', // 跳转路径
        params: '', // 路径参数
        active: '', // 是否激活
        readOnly: '' // 是否只读
      },
      rules: {
        resName: [
          { required: true, message: '请输入菜单资源名称', trigger: 'blur' }
        ],
        router: [
          { required: true, message: '请输入跳转路径', trigger: 'blur' }
        ]
        // ,
        // parent: [
        //   { required: true, message: '请选择上一级菜单资源名称', trigger: 'blur' }
        // ]
      }
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () { // 初始化
      this.getUserDetailed()
    },
    async getUserDetailed () { // 获取用户信息
      const self = this;
      const param = {
        userId: self.userId
      }
      const resData = await getUserDetailed(param)
      console.log('获取用户信息', resData)
      if (resData.status === 200 && resData.data.code === 1) {
        const list = resData.data.data
        self.selectList = list.map(item => {
          return {
            id: item.userid,
            name: item.companyname
          }
        })
      } else {
        self.$message.warning(resData.data.message)
      }
    },
    async getUserResource () { // 获取菜单资源
      const self = this;
      const param = {
        // userId: self.search.id
        userId: self.userId
      }
      const resData = await getUserResource(param)
      console.log('获取菜单资源', resData)
      if (resData.status === 200) {
        const list = resData.data.data
        self.tableList = list
      } else {
        self.$message.warning(resData.data.message)
      }
    },
    searchSubmit () { // 查询按钮
      this.getUserResource()
    },
    add () { // 新增按钮
      this.dialog.status = 0
      this.dialog.resourceVisible = true
    },
    handleEdit (item) { // 编辑按钮
      this.dialog.status = 1
      this.dialog.resourceVisible = true
    },
    handleDelete (item) { // 删除按钮

    },
    pageChange (num) { // 条数选择
      this.pageObj.pageSize = num
    },
    currentChange (num) { // 页数选择
      this.pageObj.currentPage = num
    },
    close () { // 关闭弹框
      this.dialog.resourceVisible = false
    },
    onSubmit (formName) { // 弹框确定
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.dialog.status === 0) { // 新增
            this.addResource()
          } else { // 修改
            // this.updateResource()
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    async addResource () { // 添加菜单资源
      const self = this;
      const param = {
        user: {
          id: self.userId,
          userName: self.userName
        },
        resource: this.form
      }
      if (param.resource.parent === '') param.resource.parent = 0
      const res = await addResource(param)
      console.log('添加菜单资源', res)
      if (res.status === 200) {
        self.$message.success(res.data.message);
      } else {
        self.$message.warning(res.data.message)
      }
    },
    async delResource () { // 删除菜单资源
      // const self = this;
      const param = {

      }
      const res = await delResource(param)
      console.log('删除菜单资源', res)
    },
    async updResource () { // 修改菜单资源
      // const self = this;
      const param = {

      }
      const res = await updResource(param)
      console.log('修改菜单资源', res)
    }
  }
}
</script>

<style lang="scss">
  .wealth{
    .m-switch{
      .el-form-item__content{
        display: flex;
        align-items: center;
        height: 40px;
        .el-switch{
          display: flex;
          .el-switch__label.is-active{
            color: #0084FF;
          }
        }
      }
    }
  }
</style>
