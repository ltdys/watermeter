<template>
  <div>
    <el-form ref="ruleForm" :model="form" :rules="rules" label-width="100px" size="mini">
      <el-form-item label="大表编号" prop="num">
        <el-input v-model="form.num" clearable />
      </el-form-item>
      <el-form-item label="所属区域" prop="areasList">
        <!-- <el-select v-model="form.areasId">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select> -->
        <el-cascader
          ref="cascader4"
          v-model="form.areasList"
          :options="options"
          clearable
          filterable
          :props="setParent"
          @change="changeParent"
        />
      </el-form-item>
      <el-form-item label="规格型号编码">
        <el-input v-model="form.specNum" clearable />
      </el-form-item>
      <el-form-item label="口径">
        <el-input v-model="form.caliber" clearable />
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
        <el-button type="primary" :disabled="isDBShow" @click="onSubmit('ruleForm')">{{ $t('common.determine') }}</el-button>
        <el-button @click="close">{{ $t('common.cancel') }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { addMeterBig, updateMeterBig, findDistrict } from "@/service/api"
import { treeDataUtil } from "@/utils/publicUtil"
import { list_mixins } from '@/mixins'

export default {
  mixins: [list_mixins],
  props: {
    form: {
      type: Object,
      default: () => {
        return {
          // num: '', // 大表编号
          // specNum: '', // 规格型号编码
          // simCcid: '', // SIM卡CCID
          // isOnline: '', // 0不在线 1在线
          // rscp: '', // 信号强度
          // electricQ: '', // 电池电量
          // electricV: '', // 电池电压
          // atcStatus: '', // 空管状态 0异常  1正常
          // pressureAlarm: '', // 压力报警
          // status: '', // 表状态 0 异常 1正常
          // areasId: '', // 所属小区
          // installAddress: '', // 安装地址
          // remarks: '', // 备注
          // areasList: []
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
      isDBShow: false, // 大表新增确定按钮是否点击显示
      // areasList: [],
      rules: {
        num: [
          { required: true, message: "请填写大表编号", trigger: 'blur' }
        ],
        areasId: [
          { required: true, message: "请选择区域", trigger: 'change' }
        ],
        areasList: [
          { required: true, message: "请选择区域", trigger: 'change' }
        ]
      },
      setParent: { // 设置级联选择器
        label: 'name',
        value: 'id',
        expandTrigger: 'click',
        checkStrictly: true
      },
      options: []
    }
  },
  watch: {
    form: {
      handler: function (val, oldval) {
      },
      deep: true
    }
  },
  created () {
    this.findDistrict()
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
          this.isDBShow = true
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
      delete this.form.areasList
      let params = {
        meterBig: this.form
      }
      let resData = await addMeterBig(params)
      if (resData.status === 200) {
        this.isDBShow = false
        this.$message.success(resData.data.message)
        this.close()
      }
    },
    async updateMeterBig () {
      delete this.form.areasList
      let params = {
        meterBig: this.form
      }
      let resData = await updateMeterBig(params)
      if (resData.status === 200) {
        this.isDBShow = false
        this.$message.success(resData.data.message)
        this.close()
      }
    },
    changeParent () {
      // if(this.areaObject.areasList && this.areaObject.areasList.length > 0) {
      //   this.form.areasId = this.areaObject.areasList[this.areaObject.areasList.length - 1]
      //   console.log("this.form.areasId", this.form.areasId)
      // }
      this.cascaderFalse('cascader4')
      if (this.form.areasList && this.form.areasList.length > 0) {
        this.form.areasId = this.form.areasList[this.form.areasList.length - 1]
        console.log("this.form.areasId", this.form.areasId)
      }
    },
    async findDistrict () { // 查询区域
      const self = this;
      let param = {
        companyId: this.company_id
      }
      let res = await findDistrict(param)
      console.log('查询区域', res)
      if (res.status === 200 && res.data.data !== null) {
        let list = res.data.data || []
        if (list.length !== 0) {
          list = list.map(item => {
            self.$set(item, 'parentId', item.parentid)
            self.$set(item, 'companyId', item.companyid)
            return item
          })
          self.$nextTick(() => {
            self.options = JSON.parse(treeDataUtil([...list], 'parentId', 'id'))
          })
        } else {
          self.list = list
        }
      }
    }
  }
}
</script>
