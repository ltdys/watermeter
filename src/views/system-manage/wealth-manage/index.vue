<template>
  <div class="wealth">
    <el-row>
      <el-col :span="24">
        <el-form ref="search" :inline="true" :model="search" class="toolbar" size="mini">
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
          row-key="id"
          :height="tableHeightPage"
          highlight-current-row
          :tree-props="{children: 'children'}"
        >
          <el-table-column type="index" width="50" label="#" />
          <el-table-column label="菜单资源名称" width="300">
            <template slot-scope="scope">
              {{ scope.row.resName | fDataVal }}
            </template>
          </el-table-column>
          <el-table-column label="扩展名称" width="250">
            <template slot-scope="scope">
              {{ scope.row.displayName | fDataVal }}
            </template>
          </el-table-column>
          <el-table-column label="跳转路径" width="300">
            <template slot-scope="scope">
              {{ scope.row.router | fDataVal }}
            </template>
          </el-table-column>
          <el-table-column label="路径参数" width="250">
            <template slot-scope="scope">
              {{ scope.row.params | fDataVal }}
            </template>
          </el-table-column>
          <el-table-column label="创建人" width="250">
            <template slot-scope="scope">
              {{ scope.row.createBy | fDataVal }}
            </template>
          </el-table-column>
          <el-table-column label="更新人" width="250">
            <template slot-scope="scope">
              {{ scope.row.updateBy | fDataVal }}
            </template>
          </el-table-column>
          <el-table-column label="是否激活" width="250">
            <template slot-scope="scope">
              {{ scope.row.active | fStatusVal }}
            </template>
          </el-table-column>
          <el-table-column label="是否只读" width="250">
            <template slot-scope="scope">
              {{ scope.row.readOnly | fStatusVal }}
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
    <el-dialog :title="dialog.status === 0 ? '新增资源' : '修改资源'" :visible.sync="dialog.resourceVisible" @close="close" :close-on-click-modal="false">
      <el-form ref="ruleForm" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="父菜单资源">
          <el-select v-model="form.parent" placeholder="请选择父菜单资源" filterable clearable>
            <el-option v-for="(l, i) in tableList" :key="i" :label="l.resName" :value="l.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="菜单资源名称" prop="resName">
          <el-input v-model="form.resName" clearable />
        </el-form-item>
        <el-form-item label="扩展名称">
          <el-input v-model="form.displayName" clearable />
        </el-form-item>
        <el-form-item label="跳转路径" prop="router">
          <el-input v-model="form.router" clearable />
        </el-form-item>
        <el-form-item label="路径参数">
          <el-input v-model="form.params" clearable />
        </el-form-item>
        <el-form-item v-show="form.parent !== ''" class="dia" label="图标">
          <el-select v-model="form.mIcon" placeholder="请选择icon图标" filterable clearable>
            <el-option v-for="(l, i) in iconList" :key="i" class="dia-box" :label="l" :value="l">
              <span style="float: left">{{ l }}</span>
              <i style="float: right;font-size: 20px;" :class="l" />
            </el-option>
          </el-select>
          <!-- <el-input v-model="form.mIcon" placeholder="请输入Element icon名称" clearable />
          <i v-show="form.mIcon !== ''" class="dia-icon" :class="[form.mIcon]" /> -->
        </el-form-item>
        <el-form-item class="m-switch" label="是否激活">
          <el-select v-model="form.active" placeholder="请选择激活状态" filterable clearable>
            <el-option v-for="(l, i) in statusData" :key="i" :label="l.label" :value="l.value" />
          </el-select>
        </el-form-item>
        <el-form-item class="m-switch" label="是否只读">
          <el-select v-model="form.readOnly" placeholder="请选择只读状态" filterable clearable>
            <el-option v-for="(l, i) in statusData" :key="i" :label="l.label" :value="l.value" />
          </el-select>
          <!-- <el-switch
            v-model="form.readOnly"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="是"
            inactive-text="否"
          /> -->
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit('ruleForm')">{{ $t('common.determine') }}</el-button>
          <el-button @click="close">{{ $t('common.cancel') }}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
// import myPagination from "@/components/pagination/my-pagination";
import { wealthTreeData } from '@/utils/publicUtil'
import { eleIconList } from '@/utils/eleIcon'
import { addResource, delResource, updResource, getUserResource, getRoleList, getAllResource } from '@/service/api'
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
        readOnly: '', // 是否只读
        mIcon: '' // 图标
      },
      iconList: eleIconList,
      statusData: [
        {
          label: '是',
          value: 1
        }, {
          label: '否',
          value: 0
        }
      ],
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
      // this.getRoleList()
      if (this.role_name == '超级管理员') {
        this.getAllResource()
      } else {
        this.getUserResource()
      }
    },
    async getRoleList () { // 获取角色信息列表
      const self = this;
      const param = {
        userId: self.userId
      }
      const resData = await getRoleList(param)
      console.log('获取角色信息列表', resData)
      if (resData.status === 200) {
        const list = resData.data.data
        self.selectList = list.map(item => {
          return {
            id: item.userid,
            name: item.username
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
        if (list.length !== 0) {
          self.tableList = JSON.parse(wealthTreeData(list))
        }
        // self.tableList = list
      } else {
        self.$message.warning(resData.data.message)
      }
    },
    async getAllResource () { // 获取菜单资源
      const self = this;
      const param = {
        currentPage: 1,
        pageSize: 100
      }
      const resData = await getAllResource(param)
      console.log('获取菜单资源', resData)
      if (resData.status === 200) {
        const list = resData.data.data
        if (list.length !== 0) {
          self.tableList = JSON.parse(wealthTreeData(list))
        }
        // self.tableList = list
      } else {
        self.$message.warning(resData.data.message)
      }
    },
    searchSubmit () { // 查询按钮
      // this.getUserResource()
      if (this.role_name == '超级管理员') {
        this.getAllResource()
      } else {
        this.getUserResource()
      }
    },
    add () { // 新增按钮
      this.dialog.status = 0
      this.dialog.resourceVisible = true
    },
    handleEdit (item) { // 编辑按钮
      console.log(item)
      if (item.parent === 0) item.parent = ''
      this.form = { ...item }
      this.dialog.status = 1
      this.dialog.resourceVisible = true
    },
    handleDelete (item) { // 删除按钮
      if (item.hasOwnProperty('children') && item.children.length !== 0) {
        this.$message.error(`${item.resName} 包含子资源, 请先删除子资源!`)
      } else {
        this.$confirm(`您确定要删除 ${item.resName} 吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.delResource(item)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      }
    },
    pageChange (num) { // 条数选择
      this.pageObj.pageSize = num
    },
    currentChange (num) { // 页数选择
      this.pageObj.currentPage = num
    },
    close () { // 关闭弹框
      this.dialog.resourceVisible = false
      this.clearBoth()
    },
    onSubmit (formName) { // 弹框确定
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.dialog.status === 0) { // 新增
            this.addResource()
          } else { // 修改
            this.updResource()
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
        self.$message.success(`添加成功`);
        console.log('self.isWealth', self.isWealth)
        self.$store.dispatch('user/setIsWealth', !self.isWealth)
        self.close()
        // self.getUserResource()
        if (self.role_name == '超级管理员') {
          self.getAllResource()
        } else {
          self.getUserResource()
        }
      } else {
        self.$message.warning(res.data.message)
      }
    },
    async delResource (item) { // 删除菜单资源
      const self = this;
      const param = {
        id: item.id
      }
      const res = await delResource(param)
      console.log('删除菜单资源', res)
      if (res.status === 200) {
        self.$message.success(`删除${item.resName}成功`);
        self.$store.dispatch('user/setIsWealth', !self.isWealth)
        // self.getUserResource()
        if (self.role_name == '超级管理员') {
          self.getAllResource()
        } else {
          self.getUserResource()
        }
      } else {
        self.$message.warning(res.data.message)
      }
    },
    async updResource () { // 修改菜单资源
      const self = this;
      let param = self.form
      param.updateBy = self.userName
      const res = await updResource(param)
      console.log('修改菜单资源', res)
      if (res.status === 200) {
        self.$message.success(`修改${self.form.resName}成功`);
        console.log('self.isWealth', self.isWealth)
        self.$store.dispatch('user/setIsWealth', !self.isWealth)
        self.close()
        // self.getUserResource()
        if (self.role_name == '超级管理员') {
          self.getAllResource()
        } else {
          self.getUserResource()
        }
      } else {
        self.$message.warning(res.data.message)
      }
    },
    clearBoth () {
      this.form = {
        resName: '', // 资源名称
        displayName: '', // 扩展名称
        parent: '', // 上一级菜单资源
        router: '', // 跳转路径
        params: '', // 路径参数
        active: '', // 是否激活
        readOnly: '', // 是否只读
        mIcon: '' // 图标
      }
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
    .dia{
      .el-form-item__content{
        display: flex;
        align-items: center;
        .dia-icon{
          font-size: 30px;
        }
        .dia-icon-m{
          padding-left: 20px;
          box-sizing: border-box;
        }
      }
    }
  }
  .dia-box{
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
</style>
