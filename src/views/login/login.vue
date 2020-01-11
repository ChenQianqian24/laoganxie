<template>
  <div>
    <el-form :model="ruleForm2"
             :rules="rules2"
             status-icon
             ref="ruleForm2"
             label-position="left"
             label-width="0px"
             class="demo-ruleForm login-page">
      <h3 class="title">系统登录</h3>

      <el-form-item prop="username">
        <el-input type="text"
                  v-model="ruleForm2.username"
                  auto-complete="off"
                  placeholder="用户名"></el-input>
      </el-form-item>

      <el-form-item prop="password">
        <el-input type="password"
                  v-model="ruleForm2.password"
                  auto-complete="off"
                  placeholder="密码"></el-input>
      </el-form-item>

      <el-checkbox v-model="checked"
                   class="rememberme"
                   style="margin-right:200px">记住密码</el-checkbox>
      <router-link :to="{name: 'User'}"
                   target=_blank>
        <el-button type='text'>用户注册</el-button>
      </router-link>

      <el-form-item style="width:100%;">
        <el-button type="primary"
                   style="width:100%;"
                   @click="handleSubmit"
                   :loading="logining">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      redata: [],
      logining: false,
      ruleForm2: {
        username: '',
        password: '',
      },
      rules2: {
        username: [{ required: true, message: 'please enter your account', trigger: 'blur' }],
        password: [{ required: true, message: 'enter your password', trigger: 'blur' }]
      },
      checked: false
    }
  },
  methods: {
    handleSubmit() {
      this.$refs.ruleForm2.validate((valid) => {
        if (valid) {
          this.logining = true;
          this.$axios.post('/robot/json',
            {
              'operation': 'userInfCheck',
              'user.username': this.ruleForm2.username,
              'user.password': this.ruleForm2.password
            }
          ).then((res) => {
            this.redata = res.data.data
            window.console.log(this.redata)

            sessionStorage.setItem('user', this.redata[1].username);
            sessionStorage.setItem('SectionID', this.redata[1].SectionID);
            sessionStorage.setItem('authority', this.redata[1].authority);

            this.$router.push({ path: '/approval' });
          }).catch((err) => {
            window.console.log(err)
            alert('username or password wrong!')
          })
        } else {
          window.console.log('error submit!');
          return false;
        }
      })
    }
  }
};
</script>

<style scoped>
.login-container {
  width: 100%;
  height: 100%;
}
.login-page {
  -webkit-border-radius: 5px;
  border-radius: 5px;
  margin: 180px auto;
  width: 350px;
  padding: 35px 35px 15px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}
label.el-checkbox.rememberme {
  margin: 0px 0px 15px;
  text-align: left;
}
</style>