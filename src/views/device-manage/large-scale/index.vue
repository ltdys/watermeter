<template>
  <div class="large-scale">
    <el-form ref="search" :inline="true" class="toolbar" size="mini">
      <el-form-item label="大表编号">
        <el-input v-model="search.num" clearable />
      </el-form-item>
      <el-form-item label="SIM卡号">
        <el-input v-model="search.simCcid" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="searchSubmit">{{ $t('common.query') }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="handleAdd">{{ $t('common.add') }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="custom-button" size="mini">{{ $t('deviceManageLarge.toolbarA') }}</el-button>
        <el-button type="primary" class="custom-button" size="mini">{{ $t('deviceManageLarge.toolbarB') }}</el-button>
        <el-button type="primary" class="custom-button" size="mini">{{ $t('deviceManageLarge.toolbarC') }}</el-button>
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
          prop="installAddress"
          label="安装地址"
          width="120"
        />
        <el-table-column
          prop="specNum"
          label="规格型号"
        />
        <el-table-column
          prop="num"
          label="表编号"
        />
        <el-table-column
          prop="donot"
          label="口径"
        />
        <el-table-column
          prop="simCcid"
          label="SIM卡CCID"
          width="220"
        />
        <el-table-column
          label="是否在线"
        >
          <template slot-scope="scope">
            {{ scope.row.isOnline | fIsOnline }}
          </template>
        </el-table-column>
        <el-table-column
          prop="rscp"
          label="信号强度"
        />
        <el-table-column
          prop="electricQ"
          label="电池电量(mAh)"
          width="180"
        />
        <el-table-column
          prop="electricV"
          label="电池电压"
        />
        <el-table-column
          label="空管状态"
        >
          <template slot-scope="scope">
            {{ scope.row.atcStatus |fAtcStatus}}
          </template>
        </el-table-column>
        <el-table-column
          prop="pressureAlarm"
          label="压力报警"
        />
        <el-table-column
          prop="status"
          label="表状态"
        >
          <template slot-scope="scope">
            {{ scope.status | fStatus}}
          </template>
        </el-table-column>
        <el-table-column
          label="小区"
        >
          <template slot-scope="scope">
            {{ scope.row.areasId }}
          </template>
        </el-table-column>
        <el-table-column
          prop="installAddress"
          label="安装地址"
        />
        <el-table-column
          prop="remarkes"
          label="备注"
        />
        <el-table-column fixed="right" :label="$t('common.operation')" width="120">
          <template slot-scope="scope">
            <i class="el-icon-edit" @click="handleEdit(scope.row)"></i>
            <i class="el-icon-delete" @click="handleDelete(scope.row)"></i>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog title="大表添加" :visible.sync="addVisible" @close="close">
        <my-edit :form="form" :type="type" @close="close" />
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
import { getMeterBigList, deleteMeterBig } from '@/service/api'
import myPagination from "@/components/pagination/my-pagination";
import myEdit from './edit'
import { list_mixins } from '@/mixins'
export default {
  name: 'largeScale',

  components: {
    myPagination,myEdit
  },

  mixins: [list_mixins],

  data () {
    return {
      type: 0, // 0添加 1编辑
      tableData: [],
      pageObj: {
        allTotal: 0, // 总条数
        currentPage: 1, // 当前页数
        pageSize: 50, // 每页条数
        pageSizes: [10, 20, 50, 100]
      },
      search: {
        num: '',
        installAddress: '',
        areasId: '',
        specNum: '',
        simCcid: ''
      },
      form: {},
      copyForm: {},
      addVisible: false
    }
  },

  created () {
    this.init()
  },
  
  methods: {
    async getMeterBigList () {
      const params = {
        userId: this.userId,
        currentPage: this.pageObj.currentPage,
        pageSize: this.pageObj.pageSize,
        meterBig: this.search
      }
      let resData = await getMeterBigList(params)
      if(resData.status === 200 && resData.data.code === 1) {
        this.tableData = resData.data.data
        this.pageObj.allTotal = resData.data.page.totalRow || 0
      }
    },
    init () {
      this.getMeterBigList()
    },
    searchSubmit () {
      this.init()
    },
    handleAdd() {
      this.type = 0
      this.addVisible = true
    },
    handleEdit (row) {
      this.copyForm = row
      this.form = JSON.parse(JSON.stringify(this.copyForm))
      this.type = 1
      this.addVisible = true
    },
    handleDelete (row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteMeterBig(row)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    async deleteMeterBig(row) {
      let params = {
        meterBigId: row.id
      }
      let resData = await deleteMeterBig(params)
      if (resData.status === 200) {
        this.$message.info(resData.data.message)
      }
      this.init()
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
      this.form = {}
      this.addVisible = false
      this.init()
    }
  }
}
</script>