<template>
  <div>
    <el-dialog
        :visible.sync="dialogVisible"
        :before-close="close"
        :center="true"
        :modal-append-to-body="false"
        width="80%"
    >
    <el-row>
      <el-col :span="12">
        <span>网络入带宽</span>
        <EChart :auto-resize="true" :options="options1" theme="light"></EChart>
      </el-col>
      <el-col :span="12">
        <span>网络出带宽</span>
        <EChart :auto-resize="true" :options="options2" theme="light"></EChart>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <span>cpu利用率</span>
        <EChart :auto-resize="true" :options="options3" theme="light"></EChart>
      </el-col>
      <el-col :span="12">
        <span>内存使用量</span>
        <EChart :auto-resize="true" :options="options4" theme="light"></EChart>
      </el-col>
    </el-row>


    <el-button @click="addData">获取数据</el-button>
      <el-button @click="autoData">自动获取数据</el-button>
    <el-button @click="clearData">清空数据</el-button>
    </el-dialog>
  </div>

</template>

<script>
import {formatDuring} from "@/js/formatTime";

export default {
  name: 'MonitorDialog',
  props:["visible","cId"],
  data() {
    return {
      options1: {},
      options2: {},
      options3:{},
      options4:{},
      dialogVisible:this.visible,
    }
  },
  watch: {
    dialogVisible(val) {
      this.$emit("update:visible", val);
    },
    visible(val) {
      this.dialogVisible = val;
    },
  },
  mounted() {
    this.setOptions()
    //setInterval(this.getData,2000)
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
      this.options3 = {
        xAxis: {
          type: 'category',
          data: this.xData
        },
        yAxis: {
          type: 'value',

        },
        series: [{
          type: "line",
          data: this.Data3,
          smooth: true
        }]
      }
      this.options4 = {
        xAxis: {
          type: 'category',
          data: this.xData
        },
        yAxis: {
          type: 'value',

        },
        series: [{
          type: "line",
          data: this.Data4,
          smooth: true
        }]
      }
    },
    autoData(){
      setInterval(this.addData,2000)
    },
    getData(){
      const that=this
      this.$axios.get(`/monitor/container/actual/${this.cId}`)
          .then(res => {
            const tmp = res.data
            for (let i in tmp){
              this.$store.commit("pushMonitorInfo", i)
            }
            this.setOptions()
            console.log(this.monitorInfo)
      }).catch(err => {
        console.log(err)
        that.$notify.error({
          title: "错误",
          message: "请求出现错误",
        });
      })
    },
    addData() {
      const tmp = {
        timestamp: formatDuring("yyyy-MM-dd hh:mm:ss", new Date()),
        rxBytes: Math.round(Math.random() * 100),
        txBytes: Math.round(Math.random() * 100),
        cpuUtilization: Math.round(Math.random() * 100),
        memoryUsage: Math.round(Math.random() * 100),
      }
      this.$store.commit("pushMonitorInfo", tmp)
      this.setOptions()
      console.log(this.monitorInfo)

    },
    clearData() {
      this.$store.commit("clearMonitorInfo")
      this.setOptions()
    },
    close() {
      this.dialogVisible = false;
    },
  },
  computed: {
    monitorInfo() {
      return this.$store.state.monitorInfo
    },
    xData() {
      return this.$store.state.monitorInfo.map(x => x['timestamp'])
    },
    Data1() {
      return this.$store.state.monitorInfo.map(x => x['rxBytes'])
    },
    Data2() {
      return this.$store.state.monitorInfo.map(x => x['txBytes'])
    },
    Data3() {
      return this.$store.state.monitorInfo.map(x => x['cpuUtilization'])
    },
    Data4() {
      return this.$store.state.monitorInfo.map(x => x['memoryUsage'])
    }
  }
}
</script>
