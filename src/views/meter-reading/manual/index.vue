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
          <el-button type="primary" icon="el-icon-download">{{ $t('meterReadingManual.toolbarB') }}</el-button>
        </div>
        <div>
          <el-upload
            class="upload-demo"
            ref="upload"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :file-list="fileList"
            :auto-upload="false">
            <el-button slot="trigger" size="small" type="primary">{{ $t('meterReadingManual.toolbarC') }}</el-button>
            <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">{{ $t('meterReadingManual.toolbarD') }}</el-button>
            <div slot="tip" class="el-upload__tip">{{ $t('meterReadingManual.toolbarE') }}</div>
          </el-upload>
        </div>
      </el-col>
    </el-row>  
  </div>
</template>

<script>
import myRegion3 from '@/components/common/region3'
import { list_mixins } from '@/mixins'
export default {

  name: 'manual',

  components: {
    myRegion3
  },

  mixins: [list_mixins],

  data () {
    return {
      fileList: []
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