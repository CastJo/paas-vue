<template>
  <div class="hello">
    <EChart :auto-resize="true" :options="options1" theme="light"></EChart>
    <EChart :auto-resize="true" :options="options2" theme="light"></EChart>
    <el-button @click="addData">获取数据</el-button>
    <el-button @click="clearData">清空数据</el-button>
  </div>

</template>

<script>
import {formatDuring} from "@/js/formatTime";

export default {
  name: 'Monitor',
  data() {
    return {
      options1: {},
      options2: {},
    }
  },
  mounted() {
    this.setOptions()
    setInterval(this.addData,1000)
  },
  methods: {
    setOptions() {
      this.options1 = {
        title: {
          text: '极坐标双数值轴'
        },
        xAxis: {
          type: 'category',
          data: this.xData
        },
        yAxis: {
          type: 'value',

        },
        series: [{
          type: "line",
          data: this.Data1,
          smooth: true,
        }]
      }
      this.options2 = {
        xAxis: {
          type: 'category',
          data: this.xData
        },
        yAxis: {
          type: 'value',

        },
        series: [{
          type: "line",
          data: this.Data2,
          smooth: true
        }]
      }
    },
    addData() {
      const tmp = {
        timestamp: formatDuring("yyyy-MM-dd hh:mm:ss", new Date()),
        value1: Math.round(Math.random() * 100),
        value2: Math.round(Math.random() * 100),
      }
      this.$store.commit("pushMonitorInfo", tmp)
      this.setOptions()
      console.log(this.monitorInfo)
    },
    clearData() {
      this.$store.commit("clearMonitorInfo")
      this.setOptions()
    }
  },
  computed: {
    monitorInfo() {
      return this.$store.state.monitorInfo
    },
    xData() {
      return this.$store.state.monitorInfo.map(x => x['timestamp'])
    },
    Data1() {
      return this.$store.state.monitorInfo.map(x => x['value1'])
    },
    Data2() {
      return this.$store.state.monitorInfo.map(x => x['value2'])
    }
  }
}
</script>
