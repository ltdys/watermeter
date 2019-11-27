<template>
  <div>
    <el-form ref="ruleForm" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="组织机构" prop="company">
        <el-cascader
          v-model="form.company"
          :options="options"
          clearable
          filterable
          :props="setProps"
          @change="changeOrg"
        />
      </el-form-item>
      <el-form-item label="归属区域">
        <el-select v-model="form.parentId">
          <el-option v-for="(item, index) in list" :key="index" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="区域名称" prop="name">
        <el-input v-model="form.name" clearable />
      </el-form-item>
      <el-form-item label="区域地址">
        <el-input v-model="form.address" clearable />
      </el-form-item>
      <el-form-item label="区域状态">
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
export default {
  props: {
    options: { // 组织机构列表
      type: Array,
      default () {
        return []
      }
    }
  },
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
      stateList: [
        {
          label: '有效',
          value: '0'
        }, {
          label: '无效',
          value: '1'
        }
      ],
      form: {
        company: [], // 组织全部
        companyId: '', // 组织机构
        parentId: '', // 归属区域
        name: '', // 区域名称
        state: '', // 状态 0 --> 有效  1 --> 无效
        address: '' // 地址
      },
      rules: {
        company: [
          { required: true, message: '请选择组织机构', trigger: 'blur' }
        ],
        // parentId: [
        //   { required: true, message: '请选择归属区域', trigger: 'change' }
        // ],
        name: [
          { required: true, message: '请输入区域名称', trigger: 'blur' }
        ]
      },
      setProps: { // 设置级联选择器
        label: 'companyName',
        value: 'id',
        expandTrigger: 'click',
        checkStrictly: true
      }
    }
  },

  mounted () {

  },

  methods: {
    close () {
      this.$emit('close')
    },
    changeOrg () { // 组织机构选择
      this.form.companyId = this.form.company[this.form.company.length - 1]
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
    }
  }
}
</script>
