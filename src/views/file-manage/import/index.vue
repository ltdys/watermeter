<template>
  <div class="import" :style="{ minHeight: tableHeight + 32 + 'px'}">
    <el-row>
      <el-col :span="12" class="import_form">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item :label="$t('fileManageImportant.toolbarA')">
            <el-button type="primary" icon="el-icon-download" class="import_download">{{ $t('fileManageImportant.toolbarA_') }}</el-button>
            <el-button type="primary" icon="el-icon-download" class="import_download">{{ $t('fileManageImportant.toolbarA__') }}</el-button>
          </el-form-item>
          <el-form-item :label="$t('fileManageImportant.toolbarB')">
            <el-select v-model="form.t1" class="import_select">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('fileManageImportant.toolbarC')">
            <el-upload
              class="upload-demo"
              action="https://jsonplaceholder.typicode.com/posts/"
              :on-change="handleChange"
              :file-list="fileList">
              <el-button size="small" type="primary" icon="el-icon-upload" class="import_upload">{{ $t('fileManageImportant.toolbarC_') }}</el-button>
              <div slot="tip" class="el-upload__tip">{{ $t('fileManageImportant.toolbarC__') }}</div>
            </el-upload>
          </el-form-item>
          <el-form-item :label="$t('fileManageImportant.toolbarD')">
            <el-input type="textarea" v-model="form.t2"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="import_submit">{{ $t('fileManageImportant.toolbarE') }}</el-button>
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
      fileList: [{
        name: 'food.jpeg',
        url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
      }, {
        name: 'food2.jpeg',
        url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
      }]
    }
  },

  methods: {
    handleChange(file, fileList) {
      this.fileList = fileList.slice(-3);
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
  }
</style>