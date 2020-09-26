<template>
  <div>
    <el-button @click="monitorVisible=true">查看监控</el-button>
    <monitor-dialog :visible.sync="monitorVisible"/>
  </div>

</template>

<script>
import MonitorDialog from "@/components/MonitorDialog";

export default {
  name: 'Monitor',
  components: {MonitorDialog},
  data() {
    return {
      monitorVisible:false,
    }
  },
  mounted() {
  },
  methods: {
  },
}
</script>
