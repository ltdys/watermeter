<template>
  <div>
    <el-form ref="ruleForm" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="水表" prop="nbiotNum">
        <el-select v-model="form.nbiotNum" clearable filterable @change="nbiotChange()">
          <el-option v-for="(item, index) in nbIotList" :key="index" :label="item.meterNbiotNum" :value="item.meterNbiotNum"/>
        </el-select>
      </el-form-item>
      <el-form-item label="所属区域" prop="areasId">
        <!-- <el-select v-model="form.areasId" clearable filterable>
          <el-option :label="item.label" :value="item.value" v-for="(item, index) in list" :key="index">
          </el-option>
        </el-select> -->
        <el-cascader
          ref="cascader6"
          v-model="form.areasId"
          :options="options"
          filterable
          :props="setProps"
          clearable
          @change="changeOrg"
          disabled="disabled"
        />
      </el-form-item>
      <el-form-item label="用户编号" prop="num">
        <el-input v-model="form.num" clearable :disabled="type == 1"/>
      </el-form-item>
      <el-form-item label="用户类型" prop="waterHouseTypeId">
        <el-select v-model="form.waterHouseTypeId" clearable filterable>
          <el-option v-for="(item, index) in waterHouseTypeList" :key="index" :label="item.houseType" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="用水性质" prop="waterNatureId">
        <el-select v-model="form.waterNatureId" clearable filterable>
          <el-option v-for="(item, index) in waterNatureList" :key="index" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="用户名称" prop="name">
        <el-input v-model="form.name" clearable />
      </el-form-item>
      <el-form-item label="楼栋地址">
        <el-input v-model="form.address" clearable />
      </el-form-item>
      <el-form-item label="身份证号码">
        <el-input v-model="form.idNumber" clearable />
      </el-form-item>
      <el-form-item label="电话号码">
        <el-input v-model="form.tel" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('ruleForm')">{{ $t('common.determine') }}</el-button>
        <el-button @click="close">{{ $t('common.cancel') }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { addMeterUser, findDistrict, updateMeterUser } from "@/service/api"
import { treeDataUtil } from "@/utils/publicUtil"
import { list_mixins } from '@/mixins'
export default {
  mixins: [list_mixins],
  props: {
    waterHouseTypeList: {
      type: Array,
      default: () => []
    },
    waterNatureList: {
      type: Array,
      default: () => []
    },
    nbIotList: {
      type: Array,
      default: () => []
    },
    treeData: {
      type: Array,
      default: () => []
    },
    type: {
      type: [Number, String],
      default: () => 0
    },
    form: {
      type: Object,
      default: () => {}
    }
    // form: {
    //   type: Object,
    //   default: () => {
    //     return {
    //       id: '', // 用户id
    //       nbiotNum: '',
    //       areasId: '',
    //       num: '',
    //       name: '',
    //       idNumber: '',
    //       tel: '',
    //       waterHouseTypeId: '',
    //       waterNatureId: '',
    //       floorNo: '',
    //       unitNo: '',
    //       roomNo: '',
    //       namePy: ''
    //     }
    //   }
    // }
  },
  data () {
    return {
      options: [],
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
      rules: {
        nbiotNum: [
          { required: true, message: "请选择水表", trigger: 'change' }
        ],
        areasId: [
          { required: true, message: "请选择小区", trigger: 'change' }
        ],
        num: [
          { required: true, message: "请输入用户编号", trigger: 'blur' }
        ],
        name: [
          { required: true, message: "请输入用户名称", trigger: 'blur' }
        ],
        waterHouseTypeId: [
          { required: true, message: "请选择用户类型", trigger: 'change' }
        ],
        waterNatureId: [
          { required: true, message: "请选择用水性质", trigger: 'change' }
        ]
      },
      setProps: { // 设置级联选择器
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
      // this.form = {
      //   areasId: '',
      //   num: '',
      //   name: '',
      //   idNumber: '',
      //   tel: '',
      //   waterHouseTypeId: '',
      //   waterNatureId: '',
      //   floorNo: '',
      //   unitNo: '',
      //   roomNo: '',
      //   namePy: ''
      // }
      this.$emit('close')
    },
    onSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // debugger
          if (this.type == 0) {
            this.addMeterUser()
          } else {
            this.updateMeterUser()
          }
        } else {
          return false;
        }
      });
    },
    async findDistrict () { // 查询区域
      const self = this;
      let param = {
        companyId: this.company_id
      }
      let res = await findDistrict(param)
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
        }
      }
    },
    async addMeterUser () {
      let params = {
        nbiotNum: this.form.nbiotNum,
        meterUser: this.form
      }
      let resData = await addMeterUser(params)
      if (resData.status === 200) {
        this.$message({
          type: 'success',
          message: resData.data.message,
          duration: 2500
        })
        this.close()
      }
    },
    async updateMeterUser () {
      let params = {
        nbiotNum: this.form.nbiotNum,
        meterUser: this.form
      }
      let resData = await updateMeterUser(params)
      if (resData.status === 200) {
        this.$message({
          type: 'success',
          message: resData.data.message,
          duration: 2500
        })
        this.close()
      }
    },
    changeOrg () {
      this.cascaderFalse('cascader6')
      if (this.form.areasId && this.form.areasId.length > 0) {
        this.form.areasId = this.form.areasId[this.form.areasId.length - 1]
      }
    },
    nbiotChange() {
      let checkNbiot = this.nbIotList.filter((item) => {
        return item.meterNbiotNum === this.form.nbiotNum
      })
      if(checkNbiot && checkNbiot.length > 0) {
        this.form.areasId = checkNbiot[0].meterAreasId
      }
    }
  }
}
</script>
