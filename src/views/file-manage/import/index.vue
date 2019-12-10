<template>
  <div class="import" :style="{ minHeight: tableHeight + 32 + 'px'}">
    <el-row>
      <el-col :span="12" class="import_form">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item :label="$t('fileManageImportant.toolbarA')">
            <el-button type="primary" icon="el-icon-download" class="import_download" @click="downloadUserTemplate">{{ $t('fileManageImportant.toolbarA_') }}</el-button>
            <el-button type="primary" icon="el-icon-download" class="import_download" @click="downloadNbiotTemplate">{{ $t('fileManageImportant.toolbarA__') }}</el-button>
          </el-form-item>
          <el-form-item label="区域选择">
            <!-- <el-select v-model="form.t1" class="import_select">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select> -->
            <el-cascader
              v-model="areasList"
              class="import_select"
              clearable
              filterable
              :props="setProps"
              :options="options"
              @change="cascaChange"
            />
          </el-form-item>
          <el-form-item :label="$t('fileManageImportant.toolbarC')">
            <el-upload
              ref="upload"
              :limit="1"
              class="upload-demo"
              action="#"
              accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              :before-upload="beforeUpload"
              :on-success="handleSuccess"
              :on-change="handleAvatarChange"
              :on-error="handleFailed"
              :on-exceed="handleExceed"
              :auto-upload="false"
              :show-file-list="false"
            >
              <el-button size="small" type="primary" icon="el-icon-upload" class="import_upload">{{ $t('fileManageImportant.toolbarC_') }}</el-button>
              <div slot="tip" class="el-upload__tip" v-show="excelName">{{ excelName }}<i class="el-icon-error" @click="clearExcel"></i></div>
              <div slot="tip" class="el-upload__tip">仅支持上传EXCEL文件</div>
            </el-upload>
          </el-form-item>
          <!-- <el-form-item :label="$t('fileManageImportant.toolbarD')">
            <el-input v-model="form.t2" type="textarea" />
          </el-form-item> -->
          <el-form-item>
            <el-button type="primary" class="import_submit" @click="uploadFile">{{ $t('fileManageImportant.toolbarE') }}</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="12" class="import_explain">
        <div class="import_explain__top">
          <div>{{ $t('fileManageImportant.infoTopTitle') }}</div>
          <div>{{ $t('fileManageImportant.infoTopA') }}</div>
          <div>{{ $t('fileManageImportant.infoTopB') }}</div>
          <div>{{ $t('fileManageImportant.infoTopC') }}</div>
          <div>{{ $t('fileManageImportant.infoTopD') }}</div>
        </div>
        <div class="import_explain__bottom">
          <div>{{ $t('fileManageImportant.infoBottomTitle') }}</div>
          <div>{{ $t('fileManageImportant.infoBottomA') }}</div>
          <div>{{ $t('fileManageImportant.infoBottomB') }}</div>
          <div>{{ $t('fileManageImportant.infoBottomC') }}</div>
          <div>{{ $t('fileManageImportant.infoBottomD') }}</div>
          <div>{{ $t('fileManageImportant.infoBottomE') }}</div>
          <div>{{ $t('fileManageImportant.infoBottomF') }}</div>
          <div>{{ $t('fileManageImportant.infoBottomG') }}</div>
          <div>{{ $t('fileManageImportant.infoBottomH') }}</div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { list_mixins } from '@/mixins'
import { findDistrict, uploadUserAndMeter } from '@/service/api'
import { treeDataUtil } from '@/utils/publicUtil'

export default {
  name: 'import',

  mixins: [list_mixins],

  data () {
    return {
      form: {
        t1: '',
        t2: ''
      },
      options: [{
        label: '用户水表',
        value: 0
      }, {
        label: '其它',
        value: 1
      }],
      optionsFj: [],
      fileList: [],
      setProps: { // 设置级联选择器
        label: 'companyName',
        value: 'id',
        expandTrigger: 'click',
        checkStrictly: true
      },
      excelModel: {
        areasId: '',  // 区域ID
        file: ''
      },
      areasList: [],
      excelName: ''
    }
  },

  created () {
    this.init()
  },

  methods: {
    init () {
      this.findDistrict()
    },
    handleChange (file, fileList) {
    },
    cascaChange (val) {
      if(this.areasList && this.areasList.length > 0) {
        this.excelModel.areasId = this.areasList[this.areasList.length - 1]
      }
    },
    async findDistrict () { // 查询区域
      const self = this;
      let params = {
        companyId: ""
      }
      let res = await findDistrict(params)
      if (res.status === 200 && res.data.data !== null) {
        let list = res.data.data || []
        if (list.length !== 0) {
          list = list.map(item => {
            self.$set(item, 'parentId', item.parentid)
            self.$set(item, 'companyId', item.companyid)
            self.$set(item, 'companyName', item.name)
            return item
          })

          self.$nextTick(() => {
            self.optionsFj = list
            self.options = JSON.parse(treeDataUtil([...list], 'parentId', 'id'))
          })
        } else {
          self.optionsFj = list
          self.options = self.tableData
        }
      }
    },
    downloadUserTemplate() {
      window.location = this.DOWNLOAD_USER_EXCEL
    },
    downloadNbiotTemplate() {
      window.location = this.DOWNLOAD_NBIOT_EXCEL
    },
    beforeUpload (file) {
    },
    handleSuccess (response, file, fileList) {
      this.excelModel.file = file.raw
    },
    handleAvatarChange (file) {
      this.excelName = file.name
      this.excelModel.file = file.raw
    },
    handleExceed (file) {
      this.$message.warning('上传文件个数超出限制！')
    },
    handleFailed (err, file, fileList) {
      this.$message.error('文件上传失败！', err)
      this.$refs.upload.clearFiles()
    },
    uploadFile () {
      let temp = this.excelModel
      if (!this.excelModel.areasId) {
        this.$message.warning('请选择区域!')
        return
      }
      if (!this.excelModel.file) {
        this.$message.warning('请选择上传的Excel文件！')
        return
      }
      this.uploadUserAndMeter()
    },
    clearExcel() {
      this.excelModel.file = ""
      this.excelName = ""
    },
    // 户表导入
    async uploadUserAndMeter() {
      let resData = await uploadUserAndMeter(this.excelModel)
      if(resData.status === 200 && resData.data.code == 1) {
        this.$message({
          type: 'success',
          message: resData.data.message + ',' + resData.data.data,
          duration: 2500
        })
      } else {
        this.$message.warning(resData.data.message + ',' + resData.data.data)
      }
      this.clearExcel()
      this.excelModel.areasId = ""
      this.areasList = []
    }
  }
}
</script>

<style lang="scss">
  .import {
    background: #fff;
    padding: 20px;
    box-sizing: border-box;
    .el-textarea__inner {
      min-height: 200px !important;
    }
    &_download {
      width: calc(50% - 7.5px);
      height: 45px;
      font-size:16px !important;
      font-family:PingFang-SC-Heavy,PingFang-SC !important;
      font-weight: normal !important;
      color:rgba(41,44,51,1) !important;
      background: #E2E5EB !important;
      border-radius:4px;
      border:1px solid rgba(226,229,235,1);
    }
    &_submit {
      width: 100%;
      height: 45px;
    }
    &_select {
      width: 100%;
    }
    &_upload {
      height: 45px;
      font-size:16px !important;
      font-family:PingFang-SC-Heavy,PingFang-SC !important;
      font-weight: normal !important;
      color:rgba(41,44,51,1) !important;
      background: #E2E5EB !important;
      border-radius:4px;
      border:1px solid rgba(226,229,235,1);
    }
    &_form {
      padding-right: 40px;
    }
    &_explain {
      padding: 0 40px;
      line-height: 30px;
      &__top {
        margin-bottom: 70px;
      }
      ::before {
        content: " ";
        position: absolute;
        width: 3px;
        height: calc(100% + 32px);
        top: 0;
        right: 0px;
        bottom: 0;
        left: 50%;
        background-color: #E9E9E9;
      }
    }

    .el-button--primary:hover, .el-button--primary:focus {
      border-color: transparent !important;
    }
    .el-icon-error {
      margin-left: 5px;
      cursor: pointer;
    }
  }
</style>
