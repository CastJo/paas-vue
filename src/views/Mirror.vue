<template>
    <div id="mirror">

        <!--上传镜像和拉取镜像-->
        <div class="upAndDown">
            <el-button style="display: inline" type="primary" @click="dialogVisible3 = true">导入镜像</el-button>
        </div>

        <!--导入镜像模态框-->
        <el-dialog title="导入镜像" :visible.sync="dialogVisible3" width="30%">
            <el-form :model="mirrorForm">
                <el-form-item label="名字（必填，不能包含大写字符）" :label-width="formLabelWidth">
                    <el-input v-model="mirrorForm.name"></el-input>
                </el-form-item>
                <el-form-item label="标签（选填，默认为latest）" :label-width="formLabelWidth">
                    <el-input v-model="mirrorForm.tag"></el-input>
                </el-form-item>
            </el-form>

            <el-upload
                class="upload-demo"
                drag
                ref="upload"
                action="/api/image/import"
                :headers="userToken"
                :data="formData"
                accept=".gz"
                :before-upload="beforeUpload"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :file-list="fileList"
                :auto-upload="false">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>

                <div slot="tip" class="el-upload__tip">只能上传tar.gz文件</div>
            </el-upload>
            <el-button style="margin-left: 10px;margin-top: 10px" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
        </el-dialog>


        <!--拉取镜像的弹出框-->
        <el-dialog
            title="请输入镜像名称"
            :visible.sync="dialogVisible"
            width="30%"
        >
            <el-input v-model="mirrorName" placeholder="请输入镜像名称"></el-input>
            <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="pullMirror">确 定</el-button>
        </span>
        </el-dialog>

        <!--上传镜像时输入密码-->
        <el-dialog
            title="上传镜像"
            :visible.sync="dialogVisible2"
            width="40%">

            <el-tabs v-model="activeName" >
                <el-tab-pane label="PaaSHub" name="first">
                    <el-button type="primary" @click="uploadLocalHub">上传至PaaSHub</el-button>
                </el-tab-pane>
                <el-tab-pane label="DockHub" name="second">
                    <el-form ref="form" :model="dockerHub" label-width="180px">
                        <el-form-item label="Docker Hub用户名" style="margin-left: -30px">
                            <el-input v-model="dockerHub.username"></el-input>
                        </el-form-item>
                        <el-form-item label="Docker Hub密码" style="margin-left: -30px">
                            <el-input v-model="dockerHub.password"></el-input>
                        </el-form-item>
                    </el-form>
                    <div style="float: right;margin-top: 10px;margin-right: 20px">
                    <span slot="footer" class="dialog-footer">
                      <el-button @click="dialogVisible2 = false">取 消</el-button>
                      <el-button type="primary" @click="upMirror">确 定</el-button>
                    </span>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </el-dialog>

        <!--个人镜像列表-->
        <el-table
            :data="mirrors"
            style="width: 100%;margin-top: 20px;">
            <el-table-column
                label="名称">
                <template slot-scope="scope">
                    <span  style="cursor:pointer;" @click="handleView(scope.row)">{{scope.row.name}}</span>
                </template>
            </el-table-column>

            <el-table-column
                label="标签"
                width="180">
                <template slot-scope="scope">
                    <el-tag size="medium">{{ scope.row.tag }}</el-tag>
                </template>
            </el-table-column>

            <el-table-column
                label="镜像大小"
                prop="size">
            </el-table-column>

            <el-table-column
                label="状态"
                prop="type">
                <template slot-scope="scope">
                    <el-button
                        v-if=scope.row.hasOpen
                        size="mini"
                        @click="handleUnOpen(scope.$index, scope.row)">已公开
                    </el-button>
                    <el-button
                        v-else
                        size="mini"
                        @click="handleOpen(scope.$index, scope.row)">私有
                    </el-button>
                </template>
            </el-table-column>

            <el-table-column label="操作" width="350">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" icon="el-icon-tickets" @click="handleView(scope.row)" ></el-button>
                    <el-button type="warning" size="mini" icon="el-icon-upload2" @click="handleEdit(scope.$index, scope.row)" ></el-button>
                    <el-button type="info" size="mini" icon="el-icon-download" @click="handleExport(scope.$index, scope.row)" ></el-button>
                    <el-button type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scope.$index, scope.row)" ></el-button>
                </template>
            </el-table-column>

        </el-table>

        <!--分页-->
        <div class="block" style="float: right;bottom: 30px;right: 50px;position: absolute;">
            <el-pagination
                @current-change="handleCurrentChange"
                :current-page.sync="currentPage"
                @size-change="handleSizeChange"
                :page-size="pageSize"
                :page-sizes="[10, 20, 50, 100]"
                layout="total,sizes,prev, pager, next, jumper"
                :total="totalCount">
            </el-pagination>
        </div>
        <br/>
        <br/>
    </div>
</template>

<script>
/* eslint-env jquery */
    import {mapGetters} from 'vuex'

    export default {
        name: 'mirror',
        data() {
            return {
                userToken:{'Authorization':sessionStorage.userToken},
                fileList:[],
                formData:{},

                activeName:'first',
                dialogVisible: false,
                dialogVisible2: false,
                dialogVisible3: false,
                formLabelWidth: '180',
                time: '',
                time1: '',
//      密码
                password: '',
                //个人镜像列表
                mirrors: [],
//      要拉取的镜像的名称
                mirrorName: "",
//      分页需要
                currentPage: 1,
                totalCount: 0,
                pageSize: 10,
                //当前选择镜像的id
                imageId: '',
//      导入镜像表单
                mirrorForm: {
                    "name": '',
                    "tag": ''
                },
//      当前导入镜像的文件信息
                image: '',
//      表格批量选择
                multipleSelection: [],
                fileName: '',
                dockerHub: {
                    "username": '',
                    "password": '',
                }
            }
        },
        methods: {
            beforeUpload(){
                if (this.mirrorForm.name==""){
                    this.$message.error("请填写镜像名称");
                    return;
                }
                this.formData.imageName = this.mirrorForm.name;
                this.formData.tag = this.mirrorForm.tag;
            },
            submitUpload() {
                this.$refs.upload.submit();
            },
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePreview(file) {
                console.log(file);
            },
//    拉取个人镜像列表
            getMirrorList: function () {
                this.$axios.get("/image/self?current=" + this.currentPage + "&size=" + this.pageSize + "&orderByField=size&asc=false")
                    .then(response => {
                        if (response.data.code === 0) {
                            this.totalCount = response.data.data.total;
                            this.mirrors = response.data.data.records;
                            for (let i = 0; i < this.mirrors.length; i++) {
                                this.mirrors[i].size = bitConvert(this.mirrors[i].size);
                            }
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },

//    查看详情
            handleView: function (row) {
//      id放入vuex
                this.$store.commit('SET_CURRENT_MIRROR_ID', row.id);
                this.$router.push({path: '/mirrorDetail/detail'})
            },

//    上传镜像
            handleEdit: function (index, row) {
                this.dialogVisible2 = true;
                this.imageId = row.id;
            },

            uploadLocalHub(){

                this.$confirm('上传后该镜像允许他人使用，确认上传吗', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(()=>{
                        if (this.imageId!=null){
                            this.$axios.post('/hub/push',{
                                'imageId':this.imageId
                            })
                                .then(response=>{
                                    this.$message(response.data.message);
                                }).catch(function (err) {
                                console.log(err);
                            })
                        }else {
                            console.log('imageId=null')
                        }
                    });
            },
            upMirror: function () {
                this.$axios.post('/image/push', {
                    "imageId": this.imageId,
                    "username": this.dockerHub.username,
                    "password": this.dockerHub.password
                })
                    .then(response => {
                        if (response.data.code === 0) {
                            this.dialogVisible2 = false;
                            this.$message.success({
                                message: response.data.message,
                                showClose: true
                            });
                        } else {
                            this.$message.error({
                                message: response.data.message,
                                showClose: true
                            })
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },

//    删除列表中的镜像
            handleDelete: function (index, row) {
                this.$confirm('此操作将永久删除该镜像 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(() => {
                        this.$axios.delete("/image/delete/" + row.id)
                            .then(response => {
                                if (response.data.code == 0) {
                                    this.$message.success({
                                        message: response.data.message,
                                        showClose: true
                                    });
                                    this.getMirrorList();
                                } else {
                                    this.$message.error({
                                        message: response.data.message,
                                        showClose: true
                                    })
                                }
                            })
                            .catch(function (err) {
                                console.log(err)
                            })
                    }).catch(() => {
                })
            },

//    导出镜像
            handleExport: function (index, row) {
                this.$axios.get("/image/export/" + row.id)
                    .then(response => {
                        if (response.data.code === 0) {
                            this.dialogVisible = false;
                            window.open(response.data.data);
                        } else {
                            this.$message.error({
                                message: response.data.message,
                                showClose: true
                            })
                        }
                    })
                    .catch(function (err) {
                        console.log(err);
                    })
            },

//    拉取镜像
            pullMirror: function () {
                this.$axios.post("/image/pull", {
                    "imageName": this.mirrorName
                })
                    .then(response => {
                        if (response.data.code == 0) {
                            this.dialogVisible = false;
                            this.$message.success({
                                message: response.data.message,
                                showClose: true
                            });
                            this.getMirrorList();
                            this.mirrorName = '';
                        } else {
                            this.$message.error({
                                message: response.data.message,
                                showClose: true
                            })
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },

// 分页函数
            handleCurrentChange: function (val) {
                if (val == null) {
                    return;
                }
                this.currentPage = val;
                this.getMirrorList();
            },
            //分页大小
            handleSizeChange(val) {
                this.currentPage = 1;
                this.pageSize = val;
                this.getMirrorList();
            },

//    导入镜像
            importMirror: function () {
                let that = this;
                let formData = new FormData();
                formData.append('file', this.image);
                formData.append('name', this.mirrorForm.name);
                formData.append('tag', this.mirrorForm.tag);
                $.ajax({
                    type: "post",
                    async: true,
                    url: "api/image/import",
                    dataType: 'json',
                    headers: {
                        'Authorization': sessionStorage.userToken
                    },
                    // 告诉jQuery不要去处理发送的数据
                    processData: false,
                    // 告诉jQuery不要去设置Content-Type请求头
                    contentType: false,
                    data: formData,
                    success: function (res) {
                        if (res.code === 0) {
                            that.mirrorForm = {};
                            that.dialogVisible3 = false;
                            that.$message(res.data.message);
                            that.getMirrorList();
                        } else {
                            that.$message.error(res.message);
                        }
                    },
                    error: function (error) {
                        console.log(error);
                    }
                });
            },

//    设置为公开
            handleOpen: function (index, row) {
                this.$axios.get("/image/share/" + row.id)
                    .then(res => {
                        if (res.data.code == 0) {
                            this.getMirrorList();
                        }
                    })
                    .catch(function (err) {
                        console.log(err);
                    })
            },

//   取消为公开
            handleUnOpen: function (index, row) {
                this.$axios.get("/image/disShare/" + row.id)
                    .then(res => {
                        if (res.data.code == 0) {
                            this.getMirrorList();
                        }
                    })
                    .catch(function (err) {
                        console.log(err);
                    })

            },
            //初始化websocket
            // initWebSocket() {
            //
            //     this.websock = new WebSocket("ws://" + this.host_addr + "/ws/" + this.userId);
            //     this.websock.onopen = this.websocketonopen;
            //
            //     this.websock.onerror = this.websocketonerror;
            //
            //     this.websock.onmessage = this.websocketonmessage;
            //
            //     this.websock.onclose = this.websocketclose;
            //
            // },
            //
            // //打开websocket
            // websocketOnOpen: function () {
            //     console.log("WebSocket连接成功");
            // },
            //
            // //打开错误
            // websocketOnError: function () { //错误
            //     this.websock = new WebSocket("ws://" + this.host_addr + "/ws/" + this.userInfo.userId);
            //     this.time1 = setInterval(this.start, 5000);
            //
            // },
            //
            // //数据接收
            // websocketOnMessage: function (e) {
            //   let data = eval('(' + e.data + ')');
            //   if (data.info == null) {
            //         if (data.code === 0) {
            //             this.$notify({
            //                 type: 'success',
            //                 message: data.message,
            //                 duration: 3000
            //             });
            //             this.getMirrorList();
            //         } else {
            //             this.$notify({
            //                 type: 'error',
            //                 message: data.message,
            //                 duration: 3000
            //             });
            //         }
            //     }
            //     else {
            //         console.log(data.info)
            //     }
            //
            // },
            //
            // //关闭
            // websocketClose: function (e) {
            //     console.log("connection closed (" + e.code + ")");
            //     this.websock = new WebSocket("ws://" + this.host_addr + "/ws/" + this.userInfo.userId);
            // },
            //
            // start: function () {
            //     this.websock.send("HeartBeat");
            // },

        },
        created() {
            this.getMirrorList();
            //this.initWebSocket();
            this.time = setInterval(() => {
                this.start();
            }, 5000);
        },
        beforeDestroy() {
            clearInterval(this.time);
            clearInterval(this.time1)
        },
        computed: {
            ...mapGetters({
                userInfo: 'getUserInfo',
                userId: 'getUserId',
                // host_addr: 'getHostAddr'
            })
        }
    }
    function bitConvert(limit){
      let size = "";
      if( limit < 0.1 * 1024 ){ //如  size = limit.toFixed(2) + "B";
      }else if(limit < 0.1 * 1024 * 1024 ){//如果小于0.1MB转化成KB
        size = (limit / 1024).toFixed(2) + "KB";
      }else if(limit < 0.1 * 1024 * 1024 * 1024){ //如果小于0.1GB转化成MB
        size = (limit / (1024 * 1024)).toFixed(2) + "MB";
      }else{ //其他转化成GB
        size = (limit / (1024 * 1024 * 1024)).toFixed(2) + "GB";
      }

      let sizeStr = size + "";
      let len = sizeStr.indexOf(".");
      let dec = sizeStr.substr(len + 1, 2);
      if(dec === "00"){//当小数点后为00时 去掉小数部分
        return sizeStr.substring(0,len) + sizeStr.substr(len + 3,2);
      }//如果小于0.1KB转化成B

      return sizeStr;
    }
</script>

<style scoped>
    #mirror {
        position: relative;
        padding: 50px;
        margin: 20px;
        box-shadow: 3px 3px 10px #dddddd;
        background-color: white;
        border-radius: 15px;
        min-height: 670px;
    }


    .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
    }

    /*分页*/

    /*上传文件*/
    .upAndDown {
        width: 100%;
        height: 40px;
    }
</style>
