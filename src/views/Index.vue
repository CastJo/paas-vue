<template>
  <div style="width: 100%; height: 100%;">
    <Navigator />
    <router-view />
  </div>
</template>

<script>
import Navigator from "@/components/Navigator.vue";
import { loadUserInfo } from "@/js/load";
export default {
  name: "Index",
  components: {
    Navigator,
  },
  mounted() {
    loadUserInfo();
  },
};
</script>

<style></style>
