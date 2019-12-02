<template>
  <div class="alarm">
    <el-row>
      <el-col :span="24">
        <el-form ref="search" :inline="true" :model="search" class="toolbar" size="mini">
          <el-form-item :label="$t('dataManageException.toolbarA')">
            <el-date-picker
              v-model="search.t1"
              type="datetime"
              :placeholder="$t('dataManageException.toolbarA_')">
            </el-date-picker>
          </el-form-item>
          <el-form-item :label="$t('dataManageException.toolbarB')">
            <el-date-picker
              v-model="search.t2"
              type="datetime"
              :placeholder="$t('dataManageException.toolbarB_')">
            </el-date-picker> 
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search">{{ $t('common.query') }}</el-button>
          </el-form-item>
          <el-form-item>
            <el-radio v-model="search.t3" label="1">{{ $t('dataManageException.toolbarRadioA') }}</el-radio>
            <el-radio v-model="search.t3" label="2">{{ $t('dataManageException.toolbarRadioB') }}</el-radio>
            <el-radio v-model="search.t3" label="3">{{ $t('dataManageException.toolbarRadioC') }}</el-radio>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="4" :style="{height: (tableHeightPage + 52 - 30) + 'px', background: '#E9E9E9'}">
        <el-scrollbar class="scrollbar-page" wrap-class="scrollbar-wrapper">
          <my-region2 @handleNodeClick="handleNodeClick"></my-region2>
        </el-scrollbar>
      </el-col>
      <el-col :span="20">
        <el-table
          :data="tableData"
          border
          stripe
          style="width: 100%"
          size="mini"
          :height="tableHeightPage - 30"
          highlight-current-row
        >
          <el-table-column
            type="index"
            width="50"
            label="#"
          />
          <el-table-column
            prop="region"
            :label="$t('dataManageException.tableA')"
          />
          <el-table-column
            prop="address"
            :label="$t('dataManageException.tableB')"
            width="120"
          />
          <el-table-column
            prop="id"
            :label="$t('dataManageException.tableC')"
            width="220"
          />
          <el-table-column
            prop="id"
            :label="$t('dataManageException.tableD')"
          />
          <el-table-column
            prop="num"
            :label="$t('dataManageException.tableE')"
          />
          <el-table-column
            prop="id"
            :label="$t('dataManageException.tableF')"
          />
          <el-table-column
            prop="name"
            :label="$t('dataManageException.tableG')"
          />
          <el-table-column
            prop="card"
            :label="$t('dataManageException.tableH')"
            width="160"
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
    </el-row>  
  </div>
</template>

<script>
import { getException } from '@/service/dataManage'
import myRegion2 from '@/components/common/region2'
import myPagination from "@/components/pagination/my-pagination";
import { list_mixins } from '@/mixins'
export default {

  name: 'alarm',

  components: {
    myPagination, myRegion2
  },

  mixins: [list_mixins],

  data () {
    return {
      tableData: [],
      search: {
        t1: '',
        t2: '',
        t3: '1'
      },
      pageObj: {
        allTotal: 0, // 总条数
        currentPage: 1, // 当前页数
        pageSize: 50, // 每页条数
        pageSizes: [10, 20, 50, 100]
      },
      options: [{
        value: 0,
        label: '全部'
      }, {
        value: 1,
        label: '其它'
      }]
    }
  },

  created () {
    this.init()
  },

  methods: {
    init () {
      this.getException()
    },
    async getException () {
      const params = {
        rows: this.pageObj.pageSize,
        page: this.pageObj.currentPage
      }
      let res = await getException(params)
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
    handleNodeClick(data) {
    },
    searchSubmit () {

    },
    handleEdit () {

    },
    handleDelete () {

    },
    handleNodeClick (data) {
      this.$message.success(`切换${data.label}成功`)
    }
  }
}
</script>

<style lang="scss">
  .alarm {
    overflow-y: scroll;
    .el-scrollbar__wrap {
      background: #fff;
    }
    .toolbar{
      height:auto;
      margin-bottom: 10px;
      .el-form-item {
        margin-bottom: 2.5px;
      }
    }
  }
</style>