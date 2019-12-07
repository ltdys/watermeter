<template>
  <div>
    <el-form ref="ruleForm" :model="form" :rules="rules" label-width="100px" size="mini">
      <el-form-item label="大表编号" prop="num">
        <el-input v-model="form.num" clearable />
      </el-form-item>
      <el-form-item label="所属区域">
        <!-- <el-select v-model="form.areasId">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select> -->
        <el-cascader
          v-model="areaObject.areasList"
          :options="districtData"
          clearable
          filterable
          :props="setParent"
          @change="changeParent"
        />
      </el-form-item>
      <el-form-item label="规格型号编码">
        <el-input v-model="form.specNum" clearable />
      </el-form-item>
      <el-form-item label="SIM卡CCID">
        <el-input v-model="form.simCcid" clearable />
      </el-form-item>
      <el-form-item label="是否在线">
        <el-radio-group v-model="form.isOnline">
          <el-radio :label="0">不在线</el-radio>
          <el-radio :label="1">在线</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="信号强度">
        <el-input v-model="form.rscp" clearable />
      </el-form-item>
      <el-form-item label="电池电量">
        <el-input v-model="form.electricQ" clearable />
      </el-form-item>
      <el-form-item label="电池电压">
        <el-input v-model="form.electricV" clearable />
      </el-form-item>
      <el-form-item label="空管状态">
        <el-radio-group v-model="form.atcStatus">
          <el-radio :label="0">异常</el-radio>
          <el-radio :label="1">正常</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="压力报警">
        <el-input v-model="form.pressureAlarm" clearable />
      </el-form-item>
      <el-form-item label="表状态">
        <el-radio-group v-model="form.status">
          <el-radio :label="0">异常</el-radio>
          <el-radio :label="1">正常</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="安装地址">
        <el-input v-model="form.installAddress" clearable />
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="form.remarks" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('ruleForm')">{{ $t('common.determine') }}</el-button>
        <el-button @click="close">{{ $t('common.cancel') }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { addMeterBig, updateMeterBig, findDistrict } from "@/service/api"
import { list_mixins } from '@/mixins'

export default {
  mixins: [list_mixins],
  watch: {
    form: {
      handler:function(val, oldval) {
      },
      deep: true
    }
  },
  props: {
    form: {
      type: Object,
      default: () => {
        return {
          num: '', // 大表编号
          specNum: '', // 规格型号编码
          simCcid: '', // SIM卡CCID
          isOnline: '', // 0不在线 1在线
          rscp: '', // 信号强度
          electricQ: '', // 电池电量
          electricV: '', // 电池电压
          atcStatus: '', // 空管状态 0异常  1正常
          pressureAlarm: '', // 压力报警
          status: '', // 表状态 0 异常 1正常
          areasId: '', // 所属小区
          installAddress: '', // 安装地址
          remarks: '' // 备注
        }
      }
    },
    areaObject: {
      type: Object,
      default: () => {
        return {
          areasList: []
        }
      }
    },
    type: {
      type: [Number, String],
      default: 0
    },
    list: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      // areasList: [],
      rules: {
        num: [
          { required: true, message: "请填写大表编号", trigger: 'blur' }
        ],
        areasId: [
          { required: true, message: "请选择小区", trigger: 'change' }
        ]
      },
      setParent: { // 设置级联选择器
        label: 'name',
        value: 'id',
        expandTrigger: 'click',
        checkStrictly: true
      }
    }
  },
  created () {
  },
  methods: {
    close () {
      this.$emit('close')
    },
    onSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.form.areasId) {
            this.$message.warning("请选择所属区域!")
            return
          }
          if (this.type === 0) {
            this.addMeterBig()
          } else {
            this.updateMeterBig()
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    async addMeterBig () {
      let params = {
        meterBig: this.form
      }
      let resData = await addMeterBig(params)
      if (resData.status === 200) {
        this.$message.info(resData.data.message)
        this.close()
      }
    },
    async updateMeterBig () {
      let params = {
        meterBig: this.form
      }
      let resData = await updateMeterBig(params)
      if (resData.status === 200) {
        this.$message.info(resData.data.message)
        this.close()
      }
    },
    changeParent() {
      if(this.areaObject.areasList && this.areaObject.areasList.length > 0) {
        this.form.areasId = this.areaObject.areasList[this.areaObject.areasList.length - 1]
        console.log("this.form.areasId", this.form.areasId)
      }
    }
  }
}
</script>
