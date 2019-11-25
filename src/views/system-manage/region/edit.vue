<template>
  <div>
    <el-form :model="form" ref="ruleForm" :rules="rules" label-width="120px">
      <el-form-item :label="$t('systemManageRegion.dialogA')" prop="t1">
        <el-select v-model="form.t1">
          <el-option :label="item.label" :value="item.value" v-for="(item, index) in list" :key="index">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('systemManageRegion.dialogB')" prop="t2">
        <el-input v-model="form.t2" clearable />
      </el-form-item>
      <el-form-item :label="$t('systemManageRegion.dialogC')" prop="t3">
        <el-input v-model="form.t3" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('ruleForm')">{{ $t('common.determine') }}</el-button>
        <el-button @click="close">{{ $t('common.cancel') }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      list: [{
        label: '区域一',
        value: 0
      }, {
        label: '区域二',
        value: 1
      }, {
        label: '区域三',
        value: 2
      }],
      form: {
        t1: '',
        t2: '',
        t3: ''
      },
      rules: {
        t1: [
          { required: true, message: this.$t('systemManageRegion.dialogA__'), trigger: 'change' }
        ],
        t2: [
          { required: true, message: this.$t('systemManageRegion.dialogB_'), trigger: 'blur' }
        ],
        t3: [
          { required: true, message: this.$t('systemManageRegion.dialogC_'), trigger: 'blur' }
        ]
      }
    }
  },

  methods: {
    close () {
      this.$emit('close')
    },
    onSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
  }
}
</script>