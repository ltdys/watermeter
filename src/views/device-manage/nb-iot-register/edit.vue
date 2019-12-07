<template>
  <div>
    <el-form ref="ruleForm" :model="form" :rules="rules" label-width="100px" size="mini">
      <el-form-item label="表编号" prop="meterNbiotNum">
        <el-input v-model="form.meterNbiotNum" clearable />
      </el-form-item>
      <el-form-item label="表类型" prop="meterType">
        <el-input v-model="form.meterType" clearable />
      </el-form-item>
      <el-form-item label="所属区域">
        <!-- <el-select v-model="form.meterAreasId">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
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
      <el-form-item label="使用状态">
        <el-radio-group v-model="form.bindState">
          <el-radio :label="1">使用</el-radio>
          <el-radio :label="0">未使用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="用户编号">
        <el-input v-model="form.meterUserNum" clearable />
      </el-form-item>
      <el-form-item label="集中器编号">
        <el-input v-model="form.meterConcentratorNum" clearable />
      </el-form-item>
      <el-form-item label="采集器编号">
        <el-input v-model="form.meterNodeNum" clearable />
      </el-form-item>
      <el-form-item label="规格型号">
        <el-input v-model="form.meterSpec" clearable />
      </el-form-item>
      <el-form-item label="SIM卡号">
        <el-input v-model="form.simCardCcid" clearable />
      </el-form-item>
      <el-form-item label="安装地址">
        <el-input v-model="form.installAddress" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('ruleForm')">{{ $t('common.determine') }}</el-button>
        <el-button @click="close">{{ $t('common.cancel') }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { treeDataUtil } from '@/utils/publicUtil'
import { addMeterNbIot, updateMeterNbIot, findDistrict } from "@/service/api"
import { list_mixins } from '@/mixins'
export default {
  mixins: [list_mixins],
  props: {
    form: {
      type: Object,
      default: () => {
        return {
          meterNbiotNum: '', // 表编号
          meterUserNum: '', // 用户编号
          meterConcentratorNum: '', // 集中器编号
          meterNodeNum: '', // 采集器编号
          meterSpec: '', // 规格型号
          simCardCcid: '', // SIM卡号
          installAddress: '', // 安装地址
          signalIntensity: '', // 信号强度
          batteryCapacity: '', // 电池容量
          pressureAlert: '', // 压力警告
          batteryLevel: '', // 电池电量
          valveState: 0, // 阀门状态 (0无阀 1有阀)
          valueSupport: false, // 阀控支持
          meterType: '', // 表类型
          reportCycle: '', // 上报周期
          readValue: '', // 本次读数
          version: '', // 软件版本号
          meterAreasId: '', // 小区ID
          bindState: 0  // 使用状态
        }
      }
    },
    type: {
      type: [Number, String],
      default: 0
    },
    areaObject: {
      type: Object,
      default: () => {
        return {
          areasList: []
        }
      }
    }
  },
  data () {
    return {
      list: [{
        label: 'NO-IOT表',
        value: 0
      }, {
        label: '其它',
        value: 1
      }],
      rules: {
        meterType: [
          { required: true, message: "请填写表类型", trigger: 'blur' }
        ],
        meterNbiotNum: [
          { required: true, message: "请填写表编号", trigger: 'blur' }
        ],
        meterAreasId: [
          { required: true, message: "请选择小区", trigger: 'blur' }
        ]
      },
      options: [],
      setParent: { // 设置级联选择器
        label: 'name',
        value: 'id',
        expandTrigger: 'click',
        checkStrictly: true
      }
    }
  },

  created () {
    this.findDistrict()
  },

  methods: {
    close () {
      this.$emit('close')
    },
    async findDistrict () { // 查询区域
      const self = this;
      let param = {
        companyId: ''
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
    },
    changeParent() {
      if(this.areaObject.areasList && this.areaObject.areasList.length > 0) {
        this.form.meterAreasId = this.areaObject.areasList[this.areaObject.areasList.length - 1]
        console.log("this.form.meterAreasId", this.form.meterAreasId)
      } else {
        this.form.meterAreasId = ""
      }
    },
    onSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.form.meterAreasId) {
            this.$message.warning("请选择所属区域!")
            return
          }
          if (this.type === 0) {
            this.addMeterNbIot()
          } else {
            this.updateMeterNbIot()
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    async addMeterNbIot () {
      let params = {
        meterNbIot: this.form
      }
      let resData = await addMeterNbIot(params)
      if (resData.status === 200) {
        this.$message.info(resData.data.message)
        this.close()
      }
    },
    async updateMeterNbIot () {
      let params = {
        meterNbIot: this.form
      }
      let resData = await updateMeterNbIot(params)
      if (resData.status === 200) {
        this.$message.info(resData.data.message)
        this.close()
      }
    }
  }
}
</script>
