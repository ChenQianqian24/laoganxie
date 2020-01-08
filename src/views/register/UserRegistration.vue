<template>
  <div class="UserRegistration">
    <el-form
      label-width="100px"
      class="demo-ruleForm"
      :rules="rules"
      :model="inputs"
      ref="inputs"
    >
      <el-form-item label="姓名" prop="username">
        <el-input v-model="inputs.username" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="inputs.password" type="password"></el-input>
      </el-form-item>
      <el-form-item label="性别">
        <el-radio label="男" v-model="inputs.sex">男</el-radio>
        <el-radio label="女" v-model="inputs.sex">女</el-radio>
      </el-form-item>
      <el-form-item label="机构">
        <el-select
          v-model="inputs.SectionID"
          placeholder="请选择"
          @change="handleOption2"
        >
          <el-option
            v-for="item in inputs.options1"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="职位">
        <el-select v-model="inputs.authority" placeholder="请选择">
          <el-option
            v-for="item in inputs.options2"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('inputs')">提交</el-button>
        <el-button @click="resetForm('inputs')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'UserRegistration',
  data() {
    return {
      inputs: {
        username: '',
        password: '',
        sex: '女',
        options1: [],
        options2: [],
        SectionID: '',
        authority: ''
      },
      redata: [],
      rules: {
        username: [
          {
            required: true,
            min: 2,
            max: 5,
            message: '长度在 2 到 5 个字符',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            min: 6,
            max: 12,
            message: '长度在 6 到 12 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    this.$axios
      .post('/robot/json', {
        operation: 'querySectionInf'
      })
      .then(res => {
        let that = this
        window.console.log(res.data.data)
        this.redata = res.data.data
        Object.keys(this.redata).forEach(function(key) {
          let addOption1 = {}
          addOption1.value = parseInt(key) + 1
          addOption1.label = that.redata[key].sectionName
          that.inputs.options1.push(addOption1)
        })
      })
      .catch(err => {
        window.console.log(err)
      })
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        delete this.inputs.options1
        delete this.inputs.options2
        for (var j in this.inputs) {
          this.inputs['user.' + j] = this.inputs[j]
          delete this.inputs[j]
        }
        if (valid) {
          alert('submit!')
          this.$axios
            .post('/robot/register', this.inputs)
            .then(res => {
              window.console.log(res)
            })
            .catch(err => {
              window.console.log(err)
            })
        } else {
          window.console.log('error submit!!')
          return false
        }
      })
    },
    handleOption2() {
      let that = this
      let option2Data = this.redata.find(function(value, index) {
        return index == parseInt(that.inputs.SectionID) - 1
      })

      this.inputs.options2 = []
      for (var j = 1; j < 7; j++) {
        let addOption2 = {}
        addOption2.value = j
        addOption2.label = option2Data['L' + j]
        if (
          (addOption2.label != 'null') &
          (addOption2.label != null) &
          (addOption2.label != '') &
          (addOption2.label != undefined)
        ) {
          this.inputs.options2.push(addOption2)
        }
      }
    }
  }
}
</script>

<style scoped>
.UserRegistration {
  width: 500px;
  height: 800px;
}
</style>
