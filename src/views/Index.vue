<template>
  <div style="width: 100%; height: 100%;">
    <Navigator />
    <div id="main">
      <div class="side-menu">
        <el-menu
                router
                :default-active="$route.path"
                background-color="#545c64"
                text-color="#fff"
                active-text-color="#ffd04b"
                style="border-right-width: 0;"
        >
          <el-menu-item index="/container">
              我的容器
          </el-menu-item>
          <el-menu-item index="/image">
              我的镜像
          </el-menu-item>
          <el-menu-item index="/public-image">
              公共镜像
          </el-menu-item>
          <el-menu-item index="/monitor">
              容器监控
          </el-menu-item>
        </el-menu>
      </div>
      <div class="right-panel">
        <keep-alive>
          <router-view/>
        </keep-alive>
      </div>
    </div>
  </div>
</template>

<script>
import Navigator from "@/components/Navigator.vue";
export default {
  name: "Index",
  components: {
    Navigator,
  },
  mounted() {
    this.$axios
            .get(`/auth/info?token=${this.$store.state.token}`)
            .then(res => {
              this.$store.commit("setUser", res.data)
            }).catch(() => {})
  },
};
</script>

<style>
  body {
    height: 100%;
  }
  #main {
    display: flex;
    flex-direction: row;
    position: fixed;
    width: 100%;
    height: 100%;
  }
  .side-menu {
    background-color: #545c64;
    height: 100%;
    width: 8%;
  }
  .right-panel {
    width: 92%;
    height: 100%;
  }
</style>
