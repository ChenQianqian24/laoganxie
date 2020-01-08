<template>
  <div class="administrativeForm">
    <el-form
      :model="adform"
      :rules="rules"
      ref="adform"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="机构名称" prop="sectionName">
        <el-input v-model="adform.sectionName"></el-input>
      </el-form-item>
      <el-form-item label="机构描述" prop="sectionDescription">
        <el-input
          type="textarea"
          v-model="adform.sectionDescription"
        ></el-input>
      </el-form-item>

      <ul class="duty">
        <li v-for="item in adform.duty" :key="item.id">
          <el-form-item :label="item.id">
            <el-input v-model="item.name"></el-input>
          </el-form-item>
        </li>
      </ul>

      <el-form-item>
        <el-button type="primary" @click="submitForm('adform')"
          >立即创建</el-button
        >
        <el-button @click="resetForm('adform')">重置</el-button>
        <el-button @click="addForm">新增职务</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { date } from '../../../public/createData'
export default {
  name: 'AdministrativeRegistration',
  data() {
    return {
      adform: {
        sectionName: '',
        sectionDescription: '',
        duty: [
          { id: '职务1', name: '' },
          { id: '职务2', name: '' }
        ]
      },
      rules: {
        sectionName: [
          { required: true, message: '请输入机构名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        sectionDescription: [{ required: true, message: '请输入机构描述信息' }]
      },
      initialid: 3,
      sectionInf: []
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert('submit!')
          this.handleData()
          this.$axios
            .post('/robot/register', this.adform)
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
    handleData() {
      this.adform.creatSectionTime = date()
      let arr = this.adform.duty
      for (var i = 1; i < 7; i++) {
        if (
          (arr[i - 1] != ' ') &
          (arr[i - 1] != undefined) &
          (arr[i - 1] != null)
        ) {
          this.adform['L' + i] = arr[i - 1].name ? arr[i - 1].name : null
          continue
        } else {
          this.adform['L' + i] = 'null'
        }
      }
      delete this.adform.duty
      for (var j in this.adform) {
        this.adform['sectionInf.' + j] = this.adform[j]
        delete this.adform[j]
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      for (var a in this.adform.duty) {
        this.adform.duty[a].name = ''
      }
    },
    addForm() {
      if (this.initialid != 7) {
        let newid = '职务' + this.initialid
        let newDuty = { id: newid, name: '' }
        this.adform.duty.push(newDuty)
        ++this.initialid
      } else {
        alert('最多允许7个职位')
      }
    }
  }
}
</script>

<style scoped>
.administrativeForm {
  width: 500px;
  height: 500px;
}
.duty {
  padding: 0 0 22px 0;
}
</style>
