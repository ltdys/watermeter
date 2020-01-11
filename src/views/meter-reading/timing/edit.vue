<template>
  <div>
    <el-form :model="form" ref="ruleForm" :rules="rules" label-width="120px">
      <el-form-item label="定时方案名称" prop="timerName">
        <el-input v-model="form.timerName" clearable />
      </el-form-item>
      <el-form-item label="所属区域" prop="areasList">
        <el-cascader
          ref="cascader5"
          v-model="form.areasList"
          :options="options"
          clearable
          filterable
          :props="setParent"
          @change="changeParent"
        />
      </el-form-item>
      <el-form-item label="集中器编号" prop="concentratorBlockAddress">
        <el-select v-model="form.concentratorBlockAddress" clearable filterable>
          <el-option
            v-for="item in jzqList"
            :key="item.meterConcentratorNum"
            :label="item.meterConcentratorNum"
            :value="item.meterConcentratorNum"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="定时日" prop="dd">
        <el-input clearable v-model="form.dd" placeholder="请输入" type="number"></el-input>
      </el-form-item>
      <el-form-item label="时" prop="hh">
        <el-input clearable v-model="form.hh" placeholder="请输入" type="number"></el-input>
      </el-form-item>
      <el-form-item label="分" prop="mm">
        <el-input clearable v-model="form.mm" placeholder="请输入" type="number"></el-input>
      </el-form-item>
      <el-form-item label="秒" prop="ss">
        <el-input clearable v-model="form.ss" placeholder="请输入" type="number"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('ruleForm')">{{ $t('common.determine') }}</el-button>
        <el-button @click="close">{{ $t('common.cancel') }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { list_mixins } from '@/mixins'
import { treeDataUtil } from '@/utils/publicUtil'
import { addMeterNbIot, updateMeterNbIot, findDistrict, getMeterNodes, findMeterConcentrator, addGatherTimer, updateGatherTimer } from "@/service/api"

export default {
  mixins: [list_mixins],
  props: {
    form: {
      type: Object,
      default: () => {}
    },
    type: {
      type: Number,
      default: () => 0
    }
  },
  data () {
    return {
      options: [],
      list: [],
      setParent: { // 设置级联选择器
        label: 'name',
        value: 'id',
        expandTrigger: 'click',
        checkStrictly: true
      },
      jzqList: [],
      rules: {
        timerName: [
          { required: true, message: "请填写定时方案名称", trigger: 'blur' }
        ],
        areasList: [
          { required: true, message: "请选择区域", trigger: 'change' }
        ],
        concentratorBlockAddress: [
          { required: true, message: "请选择集中器信号", trigger: 'change' }
        ],
        dd: [
          { required: true, message: "请填写定时日", trigger: 'blur' }
        ],
        hh: [
          { required: true, message: "请填写定时小时", trigger: 'blur' }
        ],
        mm: [
          { required: true, message: "请填写定时分钟", trigger: 'blur' }
        ],
        ss: [
          { required: true, message: "请填写定时秒数", trigger: 'blur' }
        ]
      }
    }
  },

  created() {
    this.findDistrict()
  },

  methods: {
    close () {
      this.$emit('close')
    },
    onSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.type === 0) {
            this.addGatherTimer()
          } else {
            this.updateGatherTimer()
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    async addGatherTimer() {
      let timerTime = "";
      if(this.form.dd === "") {
        timerTime = this.form.hh + "hh/" + this.form.mm + "mm/" + this.form.ss + "ss"
      } else {
        timerTime = this.form.dd + "dd/" + this.form.hh + "hh/" + this.form.mm + "mm/" + this.form.ss + "ss"
      }
      let params = {
        userId: this.userId,
        areasId: this.form.areasId,
        gatherTimer: {
          timerName: this.form.timerName,
          concentratorBlockAddress: this.form.concentratorBlockAddress,
          timerTime: timerTime
        }
      }
      let resData = await addGatherTimer(params)
      if (resData.status === 200) {
        this.form.areasList = []
        this.$message.success(resData.data.message)
        this.close()
      }
    },
    async updateGatherTimer() {
      let timerTime = "";
      if(this.form.dd === "") {
        timerTime = this.form.hh + "hh/" + this.form.mm + "mm/" + this.form.ss + "ss"
      } else {
        timerTime = this.form.dd + "dd/" + this.form.hh + "hh/" + this.form.mm + "mm/" + this.form.ss + "ss"
      }
      let params = {
        userId: this.userId,
        areasId: this.form.areasId,
        gatherTimer: {
          timerName: this.form.timerName,
          concentratorBlockAddress: this.form.concentratorBlockAddress,
          timerTime: timerTime
        }
      }
      let resData = await addGatherTimer(params)
      if (resData.status === 200) {
        this.form.areasList = []
        this.$message.success(resData.data.message)
        this.close()
      }
    },
    changeParent () {
      this.cascaderFalse('cascader5')
      if (this.form.areasList && this.form.areasList.length > 0) {
        this.form.areasId = this.form.areasList[this.form.areasList.length - 1]
        console.log("this.form.areasId", this.form.areasId)
      } else {
        this.form.areasId = ""
      }
      this.findMeterConcentrator()
    },
    async findDistrict () { // 查询区域
      const self = this;
      let param = {
        companyId: this.role_name == '超级管理员' ? '' : this.company_id
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
          list = list.filter(item => {
            return item.state == 0
          })
          self.$nextTick(() => {
            self.options = JSON.parse(treeDataUtil([...list], 'parentId', 'id'))
          })
        } else {
          self.list = list
        }
      }
    },
    async findMeterConcentrator () { // 获取集中器
      const params = {
        userId: this.userId,
        currentPage: 1,
        pageSize: 10000,
        meterConcentrator: {
          areasId: this.form.areasId
        }
      }
      let resData = await findMeterConcentrator(params)
      if (resData.status === 200 && resData.data.code === 1) {
        this.jzqList = resData.data.data
        console.log('集中器', this.jzqList)
      }
    }
  }
}
</script>