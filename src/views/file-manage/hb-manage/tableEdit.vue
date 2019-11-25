<template>
  <div>
    <el-form :model="form" ref="ruleForm" :rules="rules" label-width="120px">
      <el-form-item :label="$t('fileManageHb.dialogTableA')" prop="t1">
        <el-select v-model="form.t1" clearable filterable>
          <el-option :label="item.label" :value="item.value" v-for="(item, index) in tableTypeList" :key="index">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="IMEI" prop="t2">
        <el-input v-model="form.t2" clearable />
      </el-form-item>
      <el-form-item :label="$t('fileManageHb.dialogTableC')" prop="t3">
        <el-input v-model="form.t3" clearable />
      </el-form-item>
      <el-form-item :label="$t('fileManageHb.dialogTableD')" prop="t4">
        <el-input v-model="form.t4" clearable />
      </el-form-item>
      <el-form-item :label="$t('fileManageHb.dialogTableE')" prop="t5">
        <el-input v-model="form.t5" clearable />
      </el-form-item>
      <el-form-item :label="$t('fileManageHb.dialogTableF')">
        <el-input v-model="form.t6" clearable />
      </el-form-item>
      <el-form-item :label="$t('fileManageHb.dialogTableG')">
        <el-select v-model="form.t7" clearable filterable>
          <el-option :label="item.label" :value="item.value" v-for="(item, index) in isValveList" :key="index">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('fileManageHb.dialogTableH')">
        <el-select v-model="form.t8" clearable filterable>
          <el-option :label="item.label" :value="item.value" v-for="(item, index) in calcList" :key="index">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('fileManageHb.dialogTableI')">
        <el-select v-model="form.t9" clearable filterable>
          <el-option :label="item.label" :value="item.value" v-for="(item, index) in isAlarmList" :key="index">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('fileManageHb.dialogTableJ')">
        <el-input v-model="form.t10" clearable />
      </el-form-item>
      <el-form-item :label="$t('fileManageHb.dialogTableK')">
        <el-input v-model="form.t11" clearable />
      </el-form-item>
      <el-form-item :label="$t('fileManageHb.dialogTableL')">
        <el-input v-model="form.t12" clearable />
      </el-form-item>
      <el-form-item :label="$t('fileManageHb.dialogTableM')">
        <el-input v-model="form.t13" clearable />
      </el-form-item>
      <el-form-item :label="$t('fileManageHb.dialogTableN')">
        <el-input v-model="form.t14" disabled />
      </el-form-item>
      <el-form-item :label="$t('fileManageHb.dialogTableO')">
        <el-select v-model="form.t15" clearable filterable>
          <el-option :label="item.label" :value="item.value" v-for="(item, index) in isBindingList" :key="index">
          </el-option>
        </el-select>
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
      tableTypeList: [{
        label: 'NB-IOT表',
        value: 0
      }, {
        label: '其它',
        value: 1
      }],
      isValveList: [{
        label: '是',
        value: 0
      }, {
        label: '否',
        value: 1
      }],
      calcList: [{
        label: '每月',
        value: 0
      }, {
        label: '其它',
        value: 1
      }],
      isAlarmList: [{
        label: '不需要',
        value: 0
      }, {
        label: '需要',
        value: 0
      }],
      isBindingList: [{
        label: '绑定',
        value: 0
      }, {
        label: '不绑定',
        value: 1
      }],
      form: {
        t1: '',
        t2: '',
        t3: '',
        t4: '',
        t5: '',
        t6: '',
        t7: '',
        t8: '',
        t9: '',
        t10: '',
        t11: '',
        t12: '',
        t13: '',
        t14: '测试区域',
        t15: ''
      },
      rules: {
        t1: [
          { required: true, message: this.$t('fileManageHb.dialogTableA_'), trigger: 'change' }
        ],
        t2: [
          { required: true, message: this.$t('fileManageHb.dialogTableB_'), trigger: 'blur' }
        ],
        t3: [
          { required: true, message: this.$t('fileManageHb.dialogTableC_'), trigger: 'blur' }
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