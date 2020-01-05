<template>
  <div>
    <el-form
      ref="ruleForm"
      v-loading="loading"
      :model="form"
      :rules="rules"
      label-width="120px"
      element-loading-text="正在获取地址经纬度"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
    >
      <el-form-item label="组织机构" prop="company">
        <el-cascader
          ref="cascader10"
          v-model="form.company"
          :options="options"
          clearable
          filterable
          :disabled="form.companyDis"
          :props="setProps"
          @change="changeOrg"
        />
      </el-form-item>
      <el-form-item label="归属区域">
        <el-cascader
          ref="cascader11"
          v-model="form.parent"
          :options="list"
          clearable
          filterable
          :disabled="form.parentDis"
          :props="setParent"
          @change="changeParent"
        />
        <!-- <el-select v-model="form.parentId">
          <el-option v-for="(item, index) in list" :key="index" :label="item.name" :value="item.id" />
        </el-select> -->
      </el-form-item>
      <el-form-item label="区域名称" prop="name">
        <el-input v-model="form.name" clearable />
      </el-form-item>
      <el-form-item label="区域地址">
        <el-input v-model="form.address" clearable @blur="addressBlur" />
      </el-form-item>
      <el-form-item label="经度">
        <el-input v-model="form.longitude" clearable disabled />
      </el-form-item>
      <el-form-item label="纬度">
        <el-input v-model="form.latitude" clearable disabled />
      </el-form-item>
      <el-form-item label="区域状态" prop="state">
        <el-select v-model="form.state">
          <el-option v-for="(item, index) in stateList" :key="index" :label="item.label" :value="item.value" />
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
import { findDistrict } from '@/service/api'
import { treeDataUtil } from '@/utils/publicUtil'
import { list_mixins } from '@/mixins'
import { geocode } from "@/service/map"
export default {
  mixins: [list_mixins],
  props: {
    options: { // 组织机构列表
      type: Array,
      default () {
        return []
      }
    },
    form: { // 表单
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      list: [],
      loading: false,
      key: "112840ed7892989fa8faf9e33f0a7f02",
      stateList: [
        {
          label: '有效',
          value: 0
        }
      ],
      // form: { ...this.formObj },
      rules: {
        company: [
          { required: true, message: '请选择组织机构', trigger: 'change' }
        ],
        // parentId: [
        //   { required: true, message: '请选择归属区域', trigger: 'change' }
        // ],
        name: [
          { required: true, message: '请输入区域名称', trigger: 'blur' }
        ],
        state: [
          { required: true, message: '请选择区域状态', trigger: 'change' }
        ]
      },
      setProps: { // 设置级联选择器
        label: 'companyName',
        value: 'id',
        expandTrigger: 'click',
        checkStrictly: true
      },
      setParent: { // 设置级联选择器
        label: 'name',
        value: 'id',
        expandTrigger: 'click',
        checkStrictly: true
      }
    }
  },

  watch: {
    form: {
      handler: function (val) {
        if (val.companyId != '') {
          let params = {
            companyId: this.form.companyId
          }
          this.findDistrict(params)
        }
      },
      deep: true
    }
  },

  mounted () {
    if (this.form.companyId != '') {
      let params = {
        companyId: this.form.companyId
      }
      this.findDistrict(params)
    }
  },

  methods: {
    close () {
      this.$emit('close')
    },
    changeOrg () { // 组织机构选择
      this.form.companyId = this.form.company[this.form.company.length - 1]
      let params = {
        companyId: this.form.companyId
      }
      this.cascaderFalse('cascader10')
      this.findDistrict(params)
    },
    changeParent () { // 区域选择、
      this.cascaderFalse('cascader11')
      this.form.parentId = this.form.parent[this.form.parent.length - 1]
    },
    async findDistrict (param) { // 查询区域
      const self = this;
      let res = await findDistrict(param)
      console.log('edit查询区域', res)
      if (res.status === 200 && res.data.data !== null) {
        let list = res.data.data || []
        if (list.length !== 0) {
          list = list.map(item => {
            self.$set(item, 'parentId', item.parentid)
            self.$set(item, 'companyId', item.companyid)
            return item
          })
          self.list = JSON.parse(treeDataUtil(list, 'parentId', 'id'))
        }
      }
    },
    onSubmit (formName) {
      const self = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          self.$emit('onSubmit', self.form)
        } else {
          return false;
        }
      });
    },
    addressBlur () {
      this.geocode()
    },
    clearForm () { // 清除form表单
      let self = this;
      self.loading = false
      // self.form = {
      //   company: [], // 组织全部
      //   companyId: '', // 组织机构
      //   parent: [], // 区域全部
      //   parentId: '', // 归属区域
      //   name: '', // 区域名称
      //   state: '', // 状态 0 --> 有效  1 --> 无效
      //   address: '' // 地址
      // }
    },
    async geocode () {
      this.loading = true
      let params = `?key=${this.key}&address=${this.form.address}`;
      let resData = await geocode(params)
      console.log('res', resData)
      if (resData.status === 200 && resData.data.status === "1") {
        if (resData.data.geocodes.length != 0) {
          let temp = resData.data.geocodes[0].location
          this.form.longitude = temp.split(",")[0]
          this.form.latitude = temp.split(",")[1]
          this.loading = false
        } else {
          this.loading = false
          this.form.longitude = ''
          this.form.latitude = ''
          // this.form.address = ''
          // this.$message.warning("获取经纬度失败,请输入正确的地址")
        }
      } else {
        this.$message.error("获取经纬度失败,请输入正确的地址")
        this.loading = false
      }
    }
  }
}
</script>
