<template>
  <div class="home">
    <img id="bg" src="../assets/background.png" />
    <!-- <div id="bg" /> -->
    <div id="op">
      <el-card
          v-if="index === 1"
          style="margin-top: 20%; margin-left: 20%; width: 420px"
      >
        <div slot="header" class="clearfix">
          <span class="text">登录</span>
        </div>
        <el-form
            status-icon
            :hide-required-asterisk="true"
            label-width="80px"
            :model="loginInfo"
            ref="loginInfo"
            :rules="rule1"
            label-position="left"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="loginInfo.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
                v-model="loginInfo.password"
                @keyup.enter.native="submit1('loginInfo')"
                type="password"
            ></el-input>
          </el-form-item>
        </el-form>
        <div></div>
        <div class="btn">
          <el-button class="enter" type="primary" @click="submit1('loginInfo')"
          >登录</el-button
          >
          <el-button @click="index = 2">注册</el-button>
        </div>
      </el-card>
      <!-- `diff` -->
      <el-card v-else-if="index !== 1" class="reg-card">
        <div slot="header" class="clearfix">
          <span class="text">注册</span>
        </div>
        <el-form
            status-icon
            :hide-required-asterisk="true"
            label-width="100px"
            :model="registerInfo"
            ref="registerInfo"
            :rules="rule2"
            label-position="left"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="registerInfo.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
                v-model="registerInfo.password"
                type="password"
            ></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="password2">
            <el-input
                v-model="registerInfo.password2"
                type="password"
            ></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="registerInfo.email"></el-input>
          </el-form-item>
        </el-form>
        <div class="btn">
          <el-button
              type="primary"
              class="enter"
              @click="submit2('registerInfo')"
          >提交</el-button
          ><el-button @click="index = 1">返回</el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.registerInfo.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      loading: false,
      options: [],
      autoLogin: false,
      index: 1,
      inputed: false,
      auth_time: "",
      valid_time: "",
      code: "",
      schoolList: [],
      loginInfo: {
        username: "",
        password: "",
      },
      registerInfo: {
        id: "",
        username: "",
        password: "",
        password2: "",
        email: "",
        code: "",
        school: "",
        files: [],
      },
      rule1: {
        username: [{ required: true, message: "请输入用户名" }],
        password: [{ required: true, message: "请输入密码" }],
      },
      rule2: {
        username: [
          { required: true, message: "请设置你的姓名" },
          { min: 2, max: 12, message: "长度在2-12之间" },
        ],
        password: [
          { required: true, message: "请设置你的密码" },
          { min: 6, max: 18, message: "长度在6-18之间" },
        ],
        password2: [{ validator: validatePass }],
        email: [
          { required: true, message: "请输入邮箱地址" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
          },
        ],
      },
    };
  },
  methods: {
    submit1(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios
              .post(
                  "/login?username=" +
                  this.loginInfo.username +
                  "&password=" +
                  this.loginInfo.password
              )
              .then((successResponse) => {
                console.log(successResponse);
                var data = successResponse.data;
                console.log(data);
                if (data === "") {
                  this.$notify.error({
                    title: "错误",
                    message: "密码输入错误",
                  });
                } else {
                  //用户id存入sessionStorage
                  this.$store.commit("setUser", data);
                  this.$store.commit("login", successResponse.headers.authorization)
                  //跳转主页
                  this.$router.push("/");
                  this.$notify({
                    title: "成功",
                    message: "登录成功！",
                    type: "success",
                  });
                }
              })
              .catch((failResponse) => {
                console.log(failResponse);
                this.$notify.error({
                  title: "错误",
                  message: "密码输入错误",
                });
              });
        } else {
          this.$notify.error({
            title: "Error",
            message: "非法登录",
          });
          return false;
        }
      });
    },
    submit2(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 学生
          if (this.index === 2) {
            this.$axios
                .post(
                    "/auth/register?username="+
                    this.registerInfo.username +
                    "&password=" +
                    this.registerInfo.password +
                    "&email=" +
                    this.registerInfo.email
                )
                .then((successResponse) => {
                  // var responseResult = JSON.stringify(successResponse.data);
                  console.log(successResponse);
                  if (successResponse.status === 200) {
                    this.index = 1;
                    this.$notify({
                      title: "成功",
                      message: "注册成功，请前往邮箱激活用户！",
                      type: "success",
                    });
                  } else if (successResponse.status === 400) {
                    this.$notify.error({
                      title: "错误",
                      message: successResponse.data.message,
                    });
                  } else {
                    this.$notify.error({
                      title: "错误",
                      message: "unknown error found in register.",
                    });
                  }
                })
                .catch((failResponse) => {
                  console.log(failResponse);
                });
          }
          // 老师
        }
      });
    },
  },
};
</script>

<style lang="scss">
#bg {
  object-fit: cover;
  object-position: right -20px top 60px;
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  background-repeat: repeat;
}
#op {
  /* filter: alpha(opacity=92.5);
  -moz-opacity: 0.925; */
  opacity: 0.925;
}
.el-form-item {
  margin-bottom: 17px;
}
.reg-card {
  margin-top: 6%;
  margin-left: 18%;
  width: 420px;
  .el-card__header {
    padding: 10px;
  }
  .el-card__body {
    padding: 10px 10px 0px 10px;
  }
}
.clearfix {
  text-align: left;
  font-size: 20px;
}

.btn {
  float: right;
  margin-bottom: 5px;
}
.enter span {
  padding-left: 10px;
  padding-right: 2px;
  transition: 0.5s;
}
.enter span:after {
  content: " »";
  opacity: 0;
  transition: 0.5s;
}
.enter:hover span {
  padding-left: 6px;
  padding-right: 6px;
}
.enter:hover span:after {
  opacity: 1;
  right: 0;
}
</style>
