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
              ref="cascader7"
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
              <div v-show="excelName" slot="tip" class="el-upload__tip">{{ excelName }}<i class="el-icon-error" @click="clearExcel" /></div>
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
          <div>1.导入的excel 表格里面数据不能重复，重复会导入失败。</div>
          <div>2.导入的用户编号和水表编号唯一，并且系统已经存在会导入失败。</div>
          <div>3.本次导入操作失败，所有记录导入记录不会写入系统。</div>
          <div>4.水表编号和用户编号需要纯数字。</div>
          <div>5.集中器和节点编号不能错误，系统不做正确识别，导入一定不能填错。</div>
          <div>6.导入之前需要先添加集中器和节点编号。</div>
          <div>7.导入的需要选择正确的区域。</div>
          <div>8.NB表设备ID为第3方平台的deviceID，不做正确识别。</div>
          <div>9.导入完成之后，需要在 设备管理/水表管理/写水表地址，把对应的水表地址写入到对应的集中器或节点下面。</div>
        </div>
        <!-- <div class="import_explain__bottom">
          <div>{{ $t('fileManageImportant.infoBottomTitle') }}</div>
          <div>{{ $t('fileManageImportant.infoBottomA') }}</div>
          <div>{{ $t('fileManageImportant.infoBottomB') }}</div>
          <div>{{ $t('fileManageImportant.infoBottomC') }}</div>
          <div>{{ $t('fileManageImportant.infoBottomD') }}</div>
          <div>{{ $t('fileManageImportant.infoBottomE') }}</div>
          <div>{{ $t('fileManageImportant.infoBottomF') }}</div>
          <div>{{ $t('fileManageImportant.infoBottomG') }}</div>
          <div>{{ $t('fileManageImportant.infoBottomH') }}</div>
        </div> -->
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
        areasId: '', // 区域ID
        file: ''
      },
      areasList: [],
      excelName: '',
      loading: false
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
      this.cascaderFalse('cascader7')
      if (this.areasList && this.areasList.length > 0) {
        this.excelModel.areasId = this.areasList[this.areasList.length - 1]
      }
    },
    async findDistrict () { // 查询区域
      const self = this;
      let params = {
        companyId: this.role_name == '超级管理员' ? '' : this.company_id
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
    downloadUserTemplate () {
      window.location = this.DOWNLOAD_NBIOT_EXCEL
    },
    downloadNbiotTemplate () {
      window.location = this.DOWNLOAD_USER_EXCEL
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
      // let temp = this.excelModel
      if (!this.excelModel.areasId) {
        this.$message.warning('请选择区域!')
        return
      }
      if (!this.excelModel.file) {
        this.$message.warning('请选择上传的Excel文件！')
        return
      }
      this.loading = this.$loading({
        lock: true,
        text: '正在导入中...',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      this.uploadUserAndMeter()
    },
    clearExcel () {
      this.excelModel.file = ""
      this.excelName = ""
    },
    // 户表导入
    async uploadUserAndMeter () {
      const self = this
      let resData = await uploadUserAndMeter(this.excelModel)
      if (resData.status === 200 && resData.data.code == 1) {
        this.$message({
          type: 'success',
          message: resData.data.message,
          duration: 2500
        })
      } else {
        this.$message.warning(resData.data.message)
      }
      this.clearExcel()
      this.excelModel.areasId = ""
      this.areasList = []
      this.$refs.upload.clearFiles()
      setTimeout(() => {
        self.loading.close();
      }, 1500);
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
