<template>
  <div class="manual">
    <el-row>
      <el-col :span="4" :style="{height: (tableHeight + 52) + 'px', background: '#E9E9E9'}">
        <el-scrollbar class="scrollbar-page" wrap-class="scrollbar-wrapper">
          <my-region3 @handleNodeClick="handleNodeClick"></my-region3>
        </el-scrollbar>
      </el-col>
      <el-col :span="20" class="manual_wrap" :style="{height: (tableHeight + 52) + 'px', background: '#fff'}">
        <div class="manual_wrap__title">{{ $t('meterReadingManual.toolbarA') }}</div>
        <div class="manual_wrap__download">
          <el-button type="primary" icon="el-icon-download" @click="download">{{ $t('meterReadingManual.toolbarB') }}</el-button>
        </div>
        <div>
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
            <el-button type="primary" @click="uploadFile" style="margin-top: 15px">上传到服务器</el-button>
        </div>
      </el-col>
    </el-row>  
  </div>
</template>

<script>
import myRegion3 from '@/components/common/region3'
import { uploadMeterRead } from "@/service/api"
import { list_mixins } from '@/mixins'
export default {

  name: 'manual',

  components: {
    myRegion3
  },

  mixins: [list_mixins],

  data () {
    return {
      fileList: [],
      excelModel: {
        file: ''
      },
      excelName: ''
    }
  },

  created () {
  },

  methods: {
    init () {
    },
    handleNodeClick (data) {
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    download () {
      window.location = this.DOWNLOAD_METER_READ
    },
    beforeUpload (file) {
    },
    handleSuccess (response, file, fileList) {
      this.excelModel.file = file.raw
      console.log("handleSuccess", file)
    },
    handleAvatarChange (file) {
      this.excelName = file.name
      this.excelModel.file = file.raw
      console.log("handleAvatarChange", this.excelModel)
    },
    handleExceed (file) {
      this.$message.warning('上传文件个数超出限制！')
    },
    handleFailed (err, file, fileList) {
      this.$message.error('文件上传失败！', err)
      this.$refs.upload.clearFiles()
    },
    clearExcel() {
      this.excelModel.file = ""
      this.excelName = ""
    },
    uploadFile () {
      if (!this.excelModel.file) {
        this.$message.warning('请选择上传的Excel文件！')
        return
      }
      this.uploadMeterRead()
    },
    async uploadMeterRead() {
      let temp = this.excelModel
      let resData = await uploadMeterRead(this.excelModel)
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
    }
  }
}
</script>

<style lang="scss">
  .manual {
    .el-scrollbar__wrap {
      background: #fff;
    }
    &_wrap {
      &__title {
        padding-left: 20px;
        height: 60px;
        line-height: 60px;
        background: #343844;
        margin-bottom: 10px;
        color: #fff;
      }
      &__download {
        margin-bottom: 10px;
      }
    }
  }
</style>