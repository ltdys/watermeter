<template>
  <div class="region-manage">
    <el-row>
      <el-col :span="24">
        <el-form ref="search" :inline="true" :model="search" class="toolbar" size="mini">
          <!-- <el-form-item :label="$t('systemManageRegion.toolbarA')">
            <el-input v-model="search.t1" :placeholder="$t('systemManageRegion.toolbarA_')" clearable />
          </el-form-item>
          <el-form-item :label="$t('systemManageRegion.toolbarB')">
            <el-input v-model="search.t2" :placeholder="$t('systemManageRegion.toolbarB_')" clearable />
          </el-form-item>
          <el-form-item :label="$t('systemManageRegion.toolbarC')">
            <el-input v-model="search.t3" :placeholder="$t('systemManageRegion.toolbarC_')" clearable />
          </el-form-item> -->
          <el-form-item label="组织机构">
            <el-cascader
              v-model="search.orgList"
              :options="treeData"
              clearable
              filterable
              :props="setProps"
              @change="changeOrg"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="searchSubmit">{{ $t('common.query') }}</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" class="custom-button" @click="regionAdd">{{ $t('common.add') }}</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="4" :style="{height: (tableHeightPage + 52) + 'px', background: '#E9E9E9'}">
        <el-scrollbar class="scrollbar-page" wrap-class="scrollbar-wrapper">
          <my-region :tree-data="treeData" @handleNodeClick="handleNodeClick" />
        </el-scrollbar>
      </el-col>
      <el-col :span="20">
        <el-table
          :data="tableData"
          stripe
          style="width: 100%"
          size="mini"
          :height="tableHeightPage"
          highlight-current-row
          default-expand-all
          row-key="id"
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        >
          <el-table-column
            type="index"
            width="50"
            label="#"
          />
          <el-table-column
            prop="name"
            :label="$t('systemManageRegion.tableA')"
            width="300"
          />
          <el-table-column
            prop="id"
            :label="$t('systemManageRegion.tableB')"
            width="100"
          />
          <el-table-column :label="$t('systemManageRegion.tableC')" width="100">
            <template slot-scope="scope">
              {{ scope.row.parentId | fParentChange }}
            </template>
          </el-table-column>
          <el-table-column
            prop="address"
            label="地址"
            width="300"
          />
          <el-table-column label="区域状态">
            <template slot-scope="scope">
              {{ scope.row.state | fAreaChange }}
            </template>
          </el-table-column>
          <el-table-column fixed="right" :label="$t('common.operation')" width="320">
            <template slot-scope="scope">
              <i class="el-icon-edit" @click="handleEdit(scope.row)" />
              <i class="el-icon-delete" @click="handleDelete(scope.row)" />
              <span class="region-manage_operator" @click="addNext(scope.row)">{{ $t('systemManageRegion.operationA') }}</span>
              <span class="region-manage_operator" @click="deleteArea(scope.row)">{{ $t('systemManageRegion.operationB') }}</span>
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

    <el-dialog :title="$t('systemManageRegion.dialogTitle')" :visible.sync="regionVisible" width="40%" @close="close">
      <my-edit ref="edit" :options="treeData" :form="form" @onSubmit="onSubmit" @close="close" />
    </el-dialog>
  </div>
</template>

<script>
import { getRegion } from '@/service/system'
import { orgTreeData, treeDataUtil, saveTwo } from '@/utils/publicUtil'
import { findCompany, findDistrict, addDistrict, updateDistrict, deleteDistrict, deleteMeterUserAndMeterNbIot } from '@/service/api'
import myRegion from '@/components/common/region'
import myPagination from "@/components/pagination/my-pagination";
import { list_mixins } from '@/mixins'
import myEdit from './edit.vue'
export default {

  name: 'regionManage',

  components: {
    myPagination, myRegion, myEdit
  },

  mixins: [list_mixins],

  data () {
    return {
      treeData: [], // 组织机构树状
      currentOrg: {}, // 当前组织
      tableData: [],
      tableDataFj: [],
      search: {
        t1: '',
        t2: '',
        t3: '',
        org: '',
        orgList: []
      },
      setProps: { // 设置级联选择器
        label: 'companyName',
        value: 'id',
        expandTrigger: 'click',
        checkStrictly: true
      },
      form: {
        company: [], // 组织全部
        companyId: '', // 组织机构
        companyDis: false,
        parent: [], // 区域全部
        parentId: '', // 归属区域
        parentDis: false,
        name: '', // 区域名称
        state: '', // 状态 0 --> 有效  1 --> 无效
        address: '' // 地址
      },
      pageObj: {
        allTotal: 0, // 总条数
        currentPage: 1, // 当前页数
        pageSize: 50, // 每页条数
        pageSizes: [10, 20, 50, 100]
      },
      districtData1: [],
      regionVisible: false,
      regionStatus: 0 // 弹框状态  0  新增  1  修改
    }
  },

  created () {
    this.init()
  },

  methods: {
    init () {
      // this.getRegion()
      this.findCompany('0')
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
      console.log('获取组织机构', resData)
      if (resData.status === 200 && resData.data.data !== null) {
        let list = resData.data.data
        this.treeData = JSON.parse(orgTreeData([...list]))
        if (key === '0') {
          let param = {
            companyId: this.treeData[0].id
          }
          this.findDistrict(param)
        }
      }
    },
    async getRegion () {
      const params = {
        rows: this.pageObj.pageSize,
        page: this.pageObj.currentPage
      }
      let res = await getRegion(params)
      this.tableData = res.data.data
      this.pageObj.allTotal = res.data.allTotal
    },
    async findDistrict (param) { // 查询区域
      const self = this;
      let res = await findDistrict(param)
      console.log('查询区域', res)
      if (res.status === 200 && res.data.data !== null) {
        let list = res.data.data || []
        if (list.length !== 0) {
          list = list.map(item => {
            self.$set(item, 'parentId', item.parentid)
            self.$set(item, 'companyId', item.companyid)
            return item
          })
          self.$nextTick(() => {
            self.tableDataFj = list
            self.tableData = JSON.parse(treeDataUtil([...list], 'parentId', 'id'))
            self.districtData1 = saveTwo(self.tableData)
            this.$store.dispatch("user/setDistrictData", this.districtData1)
          })
        } else {
          self.tableDataFj = list
          self.tableData = list
          this.$store.dispatch("user/setDistrictData", self.tableData)
        }
      }
    },
    async addDistrict (param) { // 增加区域
      const self = this;
      let res = await addDistrict(param)
      console.log('增加区域', res)
      if (res.status === 200) {
        let params = {
          companyId: self.currentOrg.id
        }
        if (res.data.code == 1) {
          self.$message.success(`添加区域成功`);
          self.close()
          self.findDistrict(params)
        } else {
          self.$message.warning(res.data.message);
        }
      } else {
        self.$message.warning(`添加区域失败`);
      }
    },
    async updateDistrict (param) { // 编辑区域
      const self = this;
      let res = await updateDistrict(param)
      console.log('编辑区域', res)
      if (res.status === 200) {
        let params = {
          companyId: self.currentOrg.id
        }
        if (res.data.code == 1) {
          self.$message.success(`修改区域成功`);
          self.close()
          self.findDistrict(params)
        } else {
          self.$message.warning(res.data.message);
        }
      } else {
        self.$message.warning(`修改区域失败`);
      }
    },
    async deleteDistrict (param) { // 删除区域
      const self = this;
      let res = await deleteDistrict(param)
      console.log('删除区域', res)
      if (res.status === 200) {
        let params = {
          companyId: self.currentOrg.id
        }
        self.$message.success(`删除区域成功`);
        self.close()
        self.findDistrict(params)
      } else {
        self.$message.warning(`删除区域失败`);
      }
    },
    changeOrg () { // 组织机构选择
      this.search.org = this.search.orgList[this.search.orgList.length - 1]
      // this.form.company = this.search.orgList
    },
    pageChange (data) { // 每页条数切换回调事件
      this.pageObj.pageSize = data;
      this.init()
    },
    currentChange (data) { // 当前页切换事件
      this.pageObj.currentPage = data;
      this.init()
    },
    searchSubmit () { // 查询
      let param = {
        companyId: this.search.org
      }
      if (this.search.org === '') {
        this.$message.warning(`请选择组织机构`)
      } else {
        console.log('param', param)
        // debugger
        this.findDistrict(param)
      }
    },
    handleEdit (item) { // 编辑
      // company
      console.log('编辑item', item)
      this.regionStatus = 1
      this.form.id = item.id
      this.form.name = item.name
      this.form.state = item.state
      this.form.address = item.address
      this.form.companyId = item.companyId
      this.form.parentId = item.parentId
      // this.form.parent = item.path
      // this.form.company

      this.valuationFun(item)
    },
    handleDelete (item) { // 删除
      if (item.hasOwnProperty('children') && item.children.length != 0) {
        this.$message.warning(`请先删除  ${item.name}  子区域`)
      } else {
        this.$confirm(`您确定要删除 ${item.name} 吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let param = {
            districtId: item.id
          }
          this.deleteDistrict(param)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      }
    },
    addNext (item) { // 直接增加子项
      this.regionStatus = 0
      this.form.companyDis = true
      this.form.parentDis = true
      this.form.companyId = item.companyid
      this.form.parentId = item.id
      this.valuationFun(item)
    },
    async deleteArea (item) { // 清除该区域下的表和用户
      console.log(item)
      const self = this;
      self.$confirm(`您确定清除 ${item.name} 下的表和用户吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        self.deleteMeterUserAndMeterNbIot(item)
      })
    },
    async deleteMeterUserAndMeterNbIot (item) {
      const self = this;
      let param = {
        areasId: item.id
      }
      let res = await deleteMeterUserAndMeterNbIot(param)
      console.log('清除该区域下的表和用户', res)
      if (res.status === 200 && res.data.code != 0) {
        self.$message.success(`清除${item.name}区域下的表和用户`);
      } else {
        self.$message.warning(res.data.message);
      }
    },
    valuationFun (item) { // 部分赋值公共方法
      const self = this
      if (self.currentOrg.parentId == '0') {
        self.form.company = [self.form.companyId]
      } else {
        self.form.company = [self.currentOrg.parentId, self.form.companyId]
      }
      self.form.parent = item.path
      self.regionVisible = true
      self.$nextTick(() => {
        let param = {
          companyId: item.companyid
        }
        self.$refs.edit.findDistrict(param)
      })
    },
    handleNodeClick (data) {
      this.currentOrg = data
      let params = {
        companyId: data.id
      }
      this.form.company = data.parentId == 0 ? [data.id] : [data.parentId, data.id]
      this.form.companyId = this.form.company[this.form.company.length - 1]
      this.findDistrict(params)
      // this.$message.success(`切换${data.companyName}成功`)
    },
    close () { // 关闭弹框
      this.regionVisible = false
      this.clearForm()
    },
    regionAdd () { // 添加
      this.regionStatus = 0
      this.regionVisible = true
    },
    onSubmit (form) { // 弹框确定回退方法
      let param = {
        district: {
          name: form.name,
          parentId: form.parentId === '' ? '0' : form.parentId,
          companyId: form.companyId,
          state: form.state,
          address: form.address || ''
        }
      }
      if (this.regionStatus === 0) {
        this.addDistrict(param)
      } else {
        param.district.id = this.form.id
        this.updateDistrict(param)
      }
    },
    clearForm () { // 清除form表单
      let self = this;
      self.form = {
        company: [], // 组织全部
        companyId: '', // 组织机构
        companyDis: false,
        parent: [], // 区域全部
        parentId: '', // 归属区域
        parentDis: false,
        name: '', // 区域名称
        state: '', // 状态 0 --> 有效  1 --> 无效
        address: '' // 地址
      }
    }
  }
}
</script>

<style lang="scss">
  .region-manage {
    .el-scrollbar__wrap {
      background: #fff;
    }
    &_add {
      margin: 20px 20px 10px 20px;
    }
    .el-tree-node__label {
      font-size: 16px;
      color: #9EA0A6;
    }
    &_operator {
      text-decoration: underline;
      color: #0084FF;
    }
    .scrollbar-page{
      .el-scrollbar__view{
        height: 100%;
      }
    }
  }
</style>
