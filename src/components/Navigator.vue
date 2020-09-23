<template>
  <div style="height: 40px; width: 100%">
    <el-row>
      <el-col :span="2" class="pt-2 pl-4">
        <img src="@/assets/logo.png" id="logoImg" @click="goHome"/>
      </el-col>
      <el-col :span="2" class="pt-2" :offset="20">
        <div class="corner" style="padding-left: 50%">


          <el-dropdown class="item" @command="handleCommand">
              <el-avatar
                  fit="contain"
                  :src="this.$store.state.userInfo.avatarUrl"
              ></el-avatar>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="/home">我的资源</el-dropdown-item>
                <el-dropdown-item command="/setting">个人中心</el-dropdown-item>
              <el-dropdown-item command="logout">注销</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-col>
    </el-row>
    <el-divider class="nom"></el-divider>
  </div>
</template>

<script>
export default {
  name: "Navigator",
  data() {
    return {
    };
  },
  mounted() {
    console.log(this.user);
  },
  methods: {
    handleCommand(command) {
      if (command.indexOf("/") === 0) {
        this.$router.push(`${command}`);
      } else {
        this.$store.commit("logout");
        this.$router.push("/login");
      }
    },
    goHome() {
      this.$router.push("/home");
    },
  },
  computed: {
    user(){
      return this.$store.state.userInfo;
    },

  },
};
</script>

<style lang="scss">
.nom {
  margin: 0px;
}
el-col {
  padding-top: 20px;
}
.corner {
  display: flex;
  flex-direction: row;
  .item {
    padding-left: 1%;
  }
}
#logoImg{
  max-height:30px;
  object-fit: cover;
}
#logoImg:hover{
  cursor: pointer;
}
</style>
