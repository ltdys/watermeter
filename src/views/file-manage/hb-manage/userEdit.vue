<template>
  <div>
    <el-form :model="form" ref="ruleForm" :rules="rules" label-width="100px">
      <el-form-item label="小区" prop="areasId">
        <el-select v-model="form.areasId" clearable filterable>
          <el-option :label="item.label" :value="item.value" v-for="(item, index) in list" :key="index">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="用户编号" prop="num">
        <el-input v-model="form.num" clearable />
      </el-form-item>
      <el-form-item label="用户类型" prop="waterHouseTypeId">
        <el-select v-model="form.waterHouseTypeId" clearable filterable>
          <el-option :label="item.houseType" :value="item.id" v-for="(item, index) in waterHouseTypeList" :key="index">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="用水性质" prop="waterNatureId">
        <el-select v-model="form.waterNatureId" clearable filterable>
          <el-option :label="item.name" :value="item.id" v-for="(item, index) in waterNatureList" :key="index">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="用户名称">
        <el-input v-model="form.name" clearable />
      </el-form-item>
      <el-form-item label="身份证号码">
        <el-input v-model="form.idNumber" clearable />
      </el-form-item>
      <el-form-item label="电话号码">
        <el-input v-model="form.tel" clearable />
      </el-form-item>
      <el-form-item label="楼号">
        <el-input v-model="form.floorNo" clearable />
      </el-form-item>
      <el-form-item label="单元号">
        <el-input v-model="form.unitNo" clearable />
      </el-form-item>
      <el-form-item label="门牌号">
        <el-input v-model="form.roomNo" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('ruleForm')">{{ $t('common.determine') }}</el-button>
        <el-button @click="close">{{ $t('common.cancel') }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { addMeterUser } from "@/service/api"
export default {
  props: {
    waterHouseTypeList: {
      type: Array,
      default: () => []
    },
    waterNatureList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      list: [{
        label: '默认',
        value: 1
      }],
      isUseList: [{
        label: '是',
        value: 0
      }, {
        label: '否',
        value: 1
      }],
      form: {
        areasId: '',
        num: '',
        name: '',
        idNumber: '',
        tel: '',
        waterHouseTypeId: '',
        waterNatureId: '',
        floorNo: '',
        unitNo: '',
        roomNo: ''
      },
      rules: {
        areasId: [
          { required: true, message: "请选择小区", trigger: 'change' }
        ],
        num: [
          { required: true, message: "请输入用户编号", trigger: 'blur' }
        ],
        waterHouseTypeId: [
          { required: true, message: "请选择用户类型", trigger: 'change' }
        ],
        waterNatureId: [
          { required: true, message: "请选择用水性质", trigger: 'change' }
        ]
      }
    }
  },

  methods: {
    close () {
      this.form = {
        areasId: '',
        num: '',
        name: '',
        idNumber: '',
        tel: '',
        waterHouseTypeId: '',
        waterNatureId: '',
        floorNo: '',
        unitNo: '',
        roomNo: ''
      }
      this.$emit('close')
    },
    onSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addMeterUser()
        } else {
          return false;
        }
      });
    },
    async addMeterUser() {
      let params = {
        meterUser: this.form
      }
      let resData = await addMeterUser(params)
      if (resData.status === 200) {
        this.$message.success(resData.data.message)
        this.close()
      }
    }
  }
}
</script>