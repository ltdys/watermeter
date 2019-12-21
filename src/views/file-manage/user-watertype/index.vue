<template>
  <div class="user-watertype">
    <el-row>
      <el-col :span="24">
        <el-form ref="search" :inline="true" :model="search" class="toolbar" size="mini">
          <el-form-item label="用户水型名称">
            <el-input v-model="search.houseType" placeholder="输入用户水型名称" clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="searchSubmit">{{ $t('common.query') }}</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" class="custom-button" @click="handleAdd()">{{ $t('common.add') }}</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
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
            prop="houseType"
            label="用户水型名称"
          />
          <el-table-column
            label="组织"
          >
            <template slot-scope="scope">
              {{ scope.row.companyId | fCompanyId}}
            </template>
          </el-table-column>
          <el-table-column
            prop="dayAlertWaterYield"
            label="日供水量"
          />
          <el-table-column
            prop="ratedWaterYield"
            label="额定水量"
          />
          <el-table-column fixed="right" :label="$t('common.operation')" width="120">
            <template slot-scope="scope">
              <i class="el-icon-edit" @click="handleEdit(scope.row)"></i>
              <i class="el-icon-delete" @click="handleDelete(scope.row)"></i>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <el-dialog :title="title" :visible.sync="addVisible" @close="close">
      <el-form :model="form" ref="ruleForm" :rules="rules" label-width="120px">
        <el-form-item label="用户水型名称" prop="houseType">
          <el-input v-model="form.houseType" clearable />
        </el-form-item>
        <el-form-item label="组织" prop="orgList">
          <!-- <el-select v-model="form.companyId">
            <el-option :label="item.companyName" :value="item.id" v-for="(item, index) in companyData" :key="index">
            </el-option>
          </el-select> -->
          <el-cascader
            ref="cascader9"
            v-model="form.orgList"
            :options="companyData1"
            placeholder="请选择组织机构"
            clearable
            filterable
            :props="setProps"
            @change="changeOrg"
          />
        </el-form-item>
        <el-form-item label="日供水量">
          <el-input v-model="form.dayAlertWaterYield" clearable />
        </el-form-item>
        <el-form-item label="额定水量">
          <el-input v-model="form.ratedWaterYield" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit('ruleForm')">{{ $t('common.determine') }}</el-button>
          <el-button @click="addVisible = false">{{ $t('common.cancel') }}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import myPagination from "@/components/pagination/my-pagination";
import { list_mixins } from '@/mixins'
import { orgTreeData } from '@/utils/publicUtil'
import { addWaterHouseTypes, findWaterHouseTypes, updateWaterHouseTypes, deleteWaterHouseTypes, findCompany } from "@/service/api"
export default {
  name: "userQuality",

  components: {
    myPagination,
  },

  mixins: [list_mixins],

  created () {
    this.search.companyId = this.company_id
    this.init()
  },

  data() {
    return {
      type: 0, // 0-添加 1-编辑
      title: "添加",
      tableData: [],
      search: {
        id: '',
        houseType: '',
        ratedWaterYield: '',
        dayAlertWaterYield: '',
        companyId: ""
      },
      companyData1: [], // 组织机构
      setProps: { // 设置级联选择器
        label: 'companyName',
        value: 'id',
        expandTrigger: 'click',
        checkStrictly: true
      },
      form: {
        houseType: '',
        ratedWaterYield: '',
        dayAlertWaterYield: '',
        companyId: '',
        orgList: []
      },
      rules: {
        houseType: [
          { required: true, message: "请输入用户水型名称", trigger: 'blur' }
        ],
        orgList: [
          { required: true, message: "请选择组织", trigger: 'blur' }
        ]
      },
      pageObj: {
        allTotal: 0, // 总条数
        currentPage: 1, // 当前页数
        pageSize: 50, // 每页条数
        pageSizes: [10, 20, 50, 100]
      },
      addVisible: false,
      id: ''
    }
  },
  methods: {
    searchSubmit() {
      this.init()
    },
    handleAdd() {
      this.type = 0
      this.addVisible = true
      this.title = "添加"
    },
    init() {
      this.findWaterHouseTypes()
      this.findCompany()
    },
    handleEdit(row) {
      this.title = "编辑"
      this.type = 1
      this.form.houseType = row.houseType
      this.form.ratedWaterYield = row.ratedWaterYield
      this.form.dayAlertWaterYield = row.dayAlertWaterYield
      this.form.companyId = row.companyId
      this.form.orgList = row.companyId
      this.id = row.id
      this.addVisible = true
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteWaterHouseTypes(row)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
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
        this.companyData1 = JSON.parse(orgTreeData([...list]))
      }
    },
    async deleteWaterHouseTypes(row) {
      let params = {
        waterHouseTypesId: row.id
      }
      let resData = await deleteWaterHouseTypes(params)
      this.$message.info(resData.data.message)
      this.init()
    },
    async findWaterHouseTypes() {
      let params = {
        waterHouseTypes: this.search,
        currentPage: this.pageObj.currentPage,
        pageSize: this.pageObj.pageSize,
        companyId: this.company_id
      }
      let resData = await findWaterHouseTypes(params)
      if (resData.status === 200) {
        this.tableData = resData.data.data
        if (resData.data.page) {
          this.pageObj.allTotal = resData.data.page.totalRow || 0
        }
      }
    },
    async addWaterHouseTypes() {
      let params = {
        waterHouseTypes: {
          houseType: this.form.houseType,
          ratedWaterYield: this.form.ratedWaterYield,
          dayAlertWaterYield: this.form.dayAlertWaterYield,
          companyId: this.form.companyId
        }
      }
      let resData = await addWaterHouseTypes(params)
      if(resData.status === 200 && resData.data.code === 1) {
        this.$message.success("添加成功")
      } else {
        this.$message.warning(resData.data.message)
      }
      this.addVisible = false
    },
    async updateWaterHouseTypes() {
      let params = {
        waterHouseTypes: {
          id: this.id,
          houseType: this.form.houseType,
          ratedWaterYield: this.form.ratedWaterYield,
          dayAlertWaterYield: this.form.dayAlertWaterYield,
          companyId: this.form.companyId
        }
      }
      let resData = await updateWaterHouseTypes(params)
      if(resData.status === 200 && resData.data.code === 1) {
        this.$message.success("编辑成功")
      } else {
        this.$message.warning(resData.data.message)
      }
      this.addVisible = false
    },
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(this.type === 0) {
            this.addWaterHouseTypes()
          } else {
            this.updateWaterHouseTypes()
          }
        }
      })
    },
    changeOrg () { // 组织机构选择
      this.cascaderFalse('cascader9')
      if(this.form.orgList && this.form.orgList.length > 0) {
        this.form.companyId = this.form.orgList[this.form.orgList.length - 1]
      }
    },
    close() {
      this.$refs['ruleForm'].resetFields();
      this.form = {
        houseType: '',
        ratedWaterYield: '',
        dayAlertWaterYield: '',
        companyId: '',
        orgList: []
      },
      this.init()
    }
  }
}
</script>