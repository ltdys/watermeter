<template>
  <el-row>
    <el-col :span="24">
      <el-form ref="search" :inline="true" :model="search" class="toolbar" size="mini">
        <!-- <el-form-item :label="$t('systemManageJurisdiction.toolbarA')" prop="account">
          <el-input v-model="search.account" :placeholder="$t('systemManageJurisdiction.toolbarA_')" clearable />
        </el-form-item> -->
        <el-form-item label="组织机构代码">
          <el-select v-model="search.account" clearable>
            <el-option v-for="(item, index) in companyData" :key="index" :label="item.companyName" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="用户角色" prop="name">
          <el-input v-model.trim="search.name" placeholder="请输入用户角色" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="searchClick">{{ $t('common.query') }}</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <el-col :span="12">
      <el-table
        v-myScroll:table
        :data="tableData"
        border
        stripe
        style="width: 100%"
        :size="TABLE_SIZE"
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
          prop="roleName"
          :label="$t('systemManageJurisdiction.tableC')"
        />
        <el-table-column
          prop="updateBy"
          label="更新人"
        />
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
    <el-col :span="6" :style="{height: (tableHeightPage + 52) + 'px', background: '#E9E9E9', overflow: 'hidden'}">
      <el-scrollbar class="scrollbar-page" wrap-class="scrollbar-wrapper">
        <div class="jur-tree-header">
          <div v-if="isJurisdiction" class="jur-tree-header_left">
            {{ $t('systemManageJurisdiction.by') }} [{{ currentAcc.roleName }}] 分配资源
          </div>
          <div v-else class="jur-tree-header_left">
            {{ $t('systemManageJurisdiction.roleSelection') }}
          </div>
          <!-- <div class="fr jur-tree-header_right" @click="urightSave">
              <el-icon class="el-icon-document" />
            </div> -->
        </div>
        <el-tree
          ref="jurisdiction"
          :data="treeData"
          show-checkbox
          node-key="id"
          default-expand-all
          :default-expanded-keys="unfoldList"
          :default-checked-keys="checkList"
          :props="defaultProps"
          @check="treeCheckChange"
        />
      </el-scrollbar>
    </el-col>
    <el-col :span="6" :style="{height: (tableHeightPage + 52) + 'px', background: '#E9E9E9'}" class="right_col">
      <el-scrollbar class="scrollbar-page" wrap-class="scrollbar-wrapper">
        <div class="jur-tree-header">
          <div v-if="isJurisdiction" class="jur-tree-header_left">
            {{ $t('systemManageJurisdiction.by') }} [{{ currentAcc.roleName }}] {{ $t('systemManageJurisdiction.assignAuthority') }}
          </div>
          <div v-else class="jur-tree-header_left">
            {{ $t('systemManageJurisdiction.roleSelection') }}
          </div>
          <!-- <div class="fr jur-tree-header_right" @click="urightSave">
            <el-icon class="el-icon-document" />
          </div> -->
          <el-button class="jur-tree-header_right" type="primary" size="mini" icon="el-icon-document-checked" :disabled="isAllDisabled" @click="urightSave">保存</el-button>
        </div>
        <div class="slqx">
          <div v-for="(item, index) in currentJur" :key="index" class="slqx_box">
            <div class="slqx_box_name">{{ item.resName }}</div>
            <div class="slqx_box_qx">
              <el-radio v-for="(check, ind) in checkBoxList" :key="ind" v-model="item.jurVal" :label="check.value">{{ check.label }}</el-radio>
            </div>
            <!-- <el-checkbox-group v-model="item.jurVal" @change="handleCheckedCitiesChange">
              <el-checkbox v-for="(check, ind) in checkBoxList" :key="ind" :label="check.label">{{ check.label }}</el-checkbox>
            </el-checkbox-group> -->
          </div>
        </div>
      </el-scrollbar>
    </el-col>
  </el-row>
</template>

<script>
import { getRole, getJurisdiction } from '@/service/system'
import { getRoleList, getUserResource, getRoleResource, roleAuthorization } from '@/service/api'
import { wealthTreeData } from '@/utils/publicUtil'
import myPagination from "@/components/pagination/my-pagination";
// import { treeData } from '@/utils/publicUtil'
import { list_mixins } from '@/mixins'
export default {
  name: 'jurisdiction',
  components: {
    myPagination
  },
  mixins: [list_mixins],
  data () {
    return {
      checkBoxList: [
        {
          label: '浏览',
          value: 0
        }, {
          label: '维护',
          value: 1
        }
      ],
      sqCheckList: [],
      search: {
        account: '', // 账号
        name: '' // 姓名
      },
      jurisdiction: [], // 权限列表
      pageObj: {
        allTotal: 0, // 总条数
        currentPage: 1, // 当前页数
        pageSize: 50, // 每页条数
        pageSizes: [10, 20, 50, 100]
      },
      treeData: [], // tree列表
      treeDataBf: [], // tree列表备份
      checkList: [], // 选中列表
      keyList: [], // 默认的id数组
      unfoldList: [], // 展开的数组
      defaultProps: {
        children: 'children',
        label: 'resName'
      },
      currentAcc: {}, // 当前点击的账户
      isJurisdiction: false, // 头部显示
      tableData: [], // 角色列表
      currentJur: [], // 选中的资源
      isAllDisabled: true // 是否保存
    }
  },
  watch: {
    currentJur: {
      handler: function (val, old) {
        if (val.length !== 0 && Object.keys(this.currentAcc).length !== 0) {
          let list = val.filter(item => {
            return item.jurVal === ''
          })
          console.log('list', list)
          if (list.length === 0) {
            this.isAllDisabled = false
          } else {
            this.isAllDisabled = true
          }
        }
      },
      deep: true
    },
    currentAcc: {
      handler: function (val, old) {
        if (this.currentJur.length !== 0 && Object.keys(val).length !== 0) {
          let list = this.currentJur.filter(item => {
            return item.jurVal === ''
          })
          console.log('list', list)
          if (list.length === 0) {
            this.isAllDisabled = false
          } else {
            this.isAllDisabled = true
          }
        }
      },
      deep: true
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      // this.getRole()
      // this.getJurisdiction()
      this.getRoleList()
      this.getUserResource()
    },
    async getRoleList () { // 获取角色列表
      const params = {
        userId: this.userId,
        pageSize: this.pageObj.pageSize,
        currentPage: this.pageObj.currentPage,
        role: {
          roleName: this.search.name,
          companyId: this.search.account
        }
      }
      let resData = await getRoleList(params)
      console.log('获取角色列表', resData)
      if (resData.status === 200) {
        this.tableData = resData.data.data
        this.pageObj.allTotal = resData.data.page.totalRow || 0
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
          list.forEach(item => {
            self.$set(item, 'jurVal', '')
          })
          self.treeDataBf = [...list]
          self.treeData = JSON.parse(wealthTreeData(list))
        }
        // self.tableList = list
      } else {
        self.$message.warning(resData.data.message)
      }
    },
    async getRole () {
      const params = {
        rows: this.pageObj.pageSize,
        page: this.pageObj.currentPage
      }
      let res = await getRole(params)
      this.tableData = res.data.data
      this.pageObj.allTotal = res.data.allTotal
    },
    async getJurisdiction () {
      let res = await getJurisdiction()
      this.treeData = res.data.data
    },
    pageChange (data) { // 每页条数切换回调事件
      this.pageObj.pageSize = data;
      this.init()
    },
    currentChange (data) { // 当前页切换事件
      this.pageObj.currentPage = data;
      this.init()
    },
    searchClick () {
      this.pageObj.currentPage = 1
      this.getRoleList()
    },
    accreditClick (row, column, event) {
      this.isJurisdiction = true
      this.currentAcc = row
      this.checkList = []
      console.log('--------', row)
      this.getRoleResource()
      // this.checkList = row.account === '123456' ? [5] : [3]
    },
    async getRoleResource () { // 根据角色查询资源
      const self = this;
      const param = {
        roleId: this.currentAcc.id
      }
      const resData = await getRoleResource(param)
      console.log('根据角色查询资源', resData)
      if (resData.status === 200) {
        const list = resData.data.data
        if (list.length !== 0) {
          self.currentJur = list.map(item => {
            return {
              active: item.active,
              displayname: item.displayname,
              id: item.id,
              oper: item.oper,
              parent: item.parent,
              readOnly: item.readonly,
              resName: item.resname,
              router: item.router,
              jurVal: Number(item.oper)
            }
          })
          self.treeChangeFun()
          console.log('self.treeDataBf', self.treeDataBf)
          console.log('self.currentJur', self.currentJur)
          let keys = list.map(item => {
            return item.id
          })
          // self.treeData = JSON.parse(wealthTreeData(list))
          self.$refs.jurisdiction.setCheckedKeys(keys)
        }
      } else {
        self.$message.warning(resData.data.message)
      }
    },
    treeChangeFun () { // 已选中改变tree
      const self = this;
      for (let i = 0; i < self.currentJur.length; i++) {
        self.treeDataBf.forEach(item => {
          if (self.currentJur[i].id == item.id) {
            item.jurVal = self.currentJur[i].jurVal
          }
        })
      }
      self.$nextTick(() => {
        self.treeData = JSON.parse(wealthTreeData(self.treeDataBf))
      })
    },
    urightSave () {
      console.log('资源1', this.currentJur)
      console.log('资源2', this.currentAcc)
      let param = {
        roleAuthorization: []
      }
      param.roleAuthorization = this.currentJur.map(item => {
        return {
          roleId: this.currentAcc.id,
          resourceId: item.id,
          permission: item.jurVal
        }
      })
      console.log('param', param)
      this.roleAuthorization(param)
      // this.$message.success(this.$t('systemManageJurisdiction.tip'))
    },
    async roleAuthorization (param) {
      let res = await roleAuthorization(param)
      console.log('res', res)
      if (res.status === 200 && res.data.code == 1) {
        this.$message.warning(`角色${this.currentAcc.roleName}授权成功`)
      } else {
        this.$message.warning(res.data.message)
      }
    },
    treeCheckChange (data, checked, indeterminate) { // 节点改变选择是触发
      this.currentJur = this.$refs.jurisdiction.getCheckedNodes()
      console.log(this.currentJur)
    },
    handleCheckedCitiesChange (value) { // 多选框
      console.log('多选框', value)
    }
  }
}
</script>
<style lang="scss">
  .jur-tree-header{
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 37px;
    // background-color: #E6EDF8;
    line-height: 37px;
    padding:0 10px;
    color: #000;
    font-size: 14px;
    font-weight: 700;
    top: 0;
    left: 0;
  }
  .right_col{
    border-left: 1px solid #EBEEF5;
    .slqx{
      padding: 20px;
      box-sizing: border-box;
      &_box{
        margin-bottom: 10px;
        &_name{
          margin-bottom: 10px;
        }
        &_qx{
          padding-left: 20px;
          box-sizing: border-box;
        }
        .el-checkbox-group{
          padding-left: 20px;
          box-sizing: border-box;
          .el-checkbox{
            .el-checkbox__input.is-checked + .el-checkbox__label{
              color: #0084FF;
            }
          }
        }
      }
    }
  }
  .scrollbar-page{
    .el-scrollbar__view{
      height: 100%;
      .el-tree, .slqx{
        height: calc(100% - 37px);
        background: #FFFFFF;
        overflow: auto;
      }
    }
  }
</style>
