<template>
  <div>
    <el-form :model="form" ref="ruleForm" :rules="rules" label-width="120px">
      <el-form-item :label="$t('meterReadingTiming.dialogA')" prop="t1">
        <el-input v-model="form.t1" clearable />
      </el-form-item>
      <el-form-item :label="$t('meterReadingTiming.dialogB')" prop="t2">
        <el-input v-model="form.t2" clearable />
      </el-form-item>
      <el-form-item :label="$t('meterReadingTiming.dialogC')" prop="t3">
        <el-input v-model="form.t3" clearable />
      </el-form-item>
      <el-form-item :label="$t('meterReadingTiming.dialogD')" prop="t4">
        <el-input v-model="form.t4" clearable />
      </el-form-item>
      <el-form-item :label="$t('meterReadingTiming.dialogE')" prop="t5">
        <el-select v-model="form.t5" clearable filterable>
          <el-option :label="item.label" :value="item.value" v-for="(item, index) in typeList" :key="index">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('meterReadingTiming.dialogF')" prop="t6">
        <el-input v-model="form.t6" clearable />
      </el-form-item>
      <el-form-item :label="$t('meterReadingTiming.dialogG')" prop="t7">
        <el-select v-model="form.t7" clearable filterable>
          <el-option :label="item.label" :value="item.value" v-for="(item, index) in timeTypeList" :key="index">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('meterReadingTiming.dialogH')" prop="t8">
        <el-date-picker
          v-model="form.t8"
          type="datetime"
          :placeholder="$t('meterReadingTiming.dialogH_')">
        </el-date-picker>
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
      form: {
        t1: '',
        t2: '',
        t3: '',
        t4: '',
        t5: '',
        t6: '',
        t7: '',
        t8: ''
      },
      typeList: [{
        label: '校时',
        value: 0
      }, {
        label: '其它',
        value: 1
      }],
      timeTypeList: [{
        label: '月',
        value: 0
      }, {
        label: '其它',
        value: 1
      }],
      rules: {
        t1: [
          { required: true, message: this.$t('meterReadingTiming.dialogA_'), trigger: 'blur' }
        ],
        t2: [
          { required: true, message: this.$t('meterReadingTiming.dialogB_'), trigger: 'blur' }
        ],
        t3: [
          { required: true, message: this.$t('meterReadingTiming.dialogC_'), trigger: 'blur' }
        ],
        t4: [
          { required: true, message: this.$t('meterReadingTiming.dialogD_'), trigger: 'blur' }
        ],
        t5: [
          { required: true, message: this.$t('meterReadingTiming.dialogE_'), trigger: 'change' }
        ],
        t6: [
          { required: true, message: this.$t('meterReadingTiming.dialogF_'), trigger: 'blur' }
        ],
        t7: [
          { required: true, message: this.$t('meterReadingTiming.dialogG_'), trigger: 'change' }
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