<template>
  <div class="feeback">
    <p class="title">反馈资料列表</p>

    <div class="task_type">
      <!-- 表单 -->
      <el-table :data="list_data_list"
                v-loading="loading"
                style="width: 100%">
        <el-table-column prop="createTime"
                         label="发起日期">
          <template scope="scope">
            <p>{{scope.row.createTime | filtedate}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="createUserName"
                         label="项目名称">
        </el-table-column>
        <el-table-column prop="title"
                         label="标题">
        </el-table-column>
        <el-table-column prop="launchPeople"
                         label="发起人">
        </el-table-column>
        <el-table-column prop="status"
                         label="状态">
          <template slot-scope="scope">
            {{
                  scope.row.status == 0
                    ? "待下发"
                    : scope.row.status == 1
                    ? "进行中"
                    : scope.row.status ==2
                    ?'已完成 ':''
                }}
          </template>
        </el-table-column>

        <el-table-column label="操作"
                         width="250">
          <template scope="scope">
            <el-button @click="see(scope.row)"
                       type="primary"
                       style="color:#1371CC"
                       size="small">
              查看
            </el-button>
            <el-button @click="feedback_tag(scope.row)"
                       v-if="scope.row.status ==1"
                       type="primary"
                       style="color:#1371CC"
                       size="small">
              反馈
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="page">
        <el-pagination background
                       layout="prev, pager, next"
                       :page-sizes="[2, 4, 6, 8]"
                       :current-page="this.list_data.current"
                       @current-change="handleCurrentChange"
                       :page-size="this.list_data.size"
                       :total="this.list_data.total"></el-pagination>
      </div>
      <!-- 分页 end-->

    </div>

    <!-- 反馈 资料列表-->
    <el-dialog title=""
               :visible.sync="dialogVisible"
               width="60%"
               :before-close="dialogBeforeClose">
      <div class="dialog_conter">
        <div class="header">
          <el-row class="titleMes">
            项目名称：{{projectNumber}}
          </el-row>
          <el-row class="titleMes">
            审计期间：{{addPeople}}
          </el-row>
          <el-row class="titleMes">
            标题：{{title}}
          </el-row>
          <el-row class="titleMes">
            发起人：{{launchPeople}}
          </el-row>
        </div>

        <!-- 资料列表 -->
        <div>
          <p>资料列表</p>
          <el-form label-width="80px">
            <el-table ref="multipleTable"
                      row-key="id"
                      :data="feedback_list.records"
                      tooltip-effect="dark"
                      v-loading="loading"
                      style="width: 100%"
                      @selection-change="handleSelectionChange_query">
              <el-table-column type="selection"
                               width="55">
              </el-table-column>
              <el-table-column prop="dataNumber"
                               label="编号">
              </el-table-column>
              <el-table-column prop="secondLevelDataNumber"
                               label="二级编号">
              </el-table-column>

              <el-table-column prop="dataName"
                               label="资料名称">
              </el-table-column>
              <el-table-column prop="department"
                               label="部门">
              </el-table-column>
              <el-table-column prop="enclosure"
                               label="模版">
                <template slot-scope="scope">
                  <el-link type="primary"
                           style=""
                           @click="enclosure(scope.row.dataModulId,scope.row.enclosure)">{{scope.row.enclosure}}
                  </el-link>
                </template>
              </el-table-column>
              <el-table-column prop="remarks"
                               label="备注">
              </el-table-column>
              <el-table-column prop="updateTime"
                               label="提供时间">
                <template slot-scope="scope">
                  {{scope.row.updateTime | filtedate}}
                </template>
              </el-table-column>
              <el-table-column prop="dataNumber"
                               label="状态">
                <template slot-scope="scope">
                  {{
                  scope.row.status == 0
                    ? "待提交"
                    : scope.row.status == 1
                    ? "待审核"
                    : scope.row.status == 2
                    ?'驳回待修改'
                    : scope.row.status == 3
                    ? "审核通过":'暂无'
                }}
                </template>
              </el-table-column>

              <el-table-column prop="dataNumber"
                               label="附件">
                <template slot-scope="scope">
                  <div class="update">
                    <div class="update_icon">
                      <svg t="1631877671204"
                           class="icon"
                           viewBox="0 0 1024 1024"
                           version="1.1"
                           xmlns="http://www.w3.org/2000/svg"
                           p-id="9939"
                           width="200"
                           height="200">
                        <path d="M825.6 198.4H450.1l-14.4-28.7c-18.8-37.6-56.5-60.9-98.5-60.9H174.1C113.4 108.8 64 158.2 64 218.9v561.9c0 74.1 60.3 134.4 134.4 134.4h627.2c74.1 0 134.4-60.3 134.4-134.4v-448c0-74.1-60.3-134.4-134.4-134.4z m44.8 582.4c0 24.7-20.1 44.8-44.8 44.8H198.4c-24.7 0-44.8-20.1-44.8-44.8V467.2h716.8v313.6z m0-403.2H153.6V218.9c0-11.3 9.2-20.5 20.5-20.5h163.1c7.8 0 14.9 4.4 18.4 11.4l39.1 78.2h430.9c24.7 0 44.8 20.1 44.8 44.8v44.8z"
                              fill="#FD9D27"
                              p-id="9940"></path>
                      </svg>
                    </div>
                    <span
                          @click="open_enclosure_details(scope.row.auditPreviousDemandDataUuid)">{{scope.row.enclosureCount}}</span>
                  </div>
                </template>
              </el-table-column>

              <el-table-column prop="dataNumber"
                               label="操作"
                               width="160px"
                               v-if="see_data==false">

                <template slot-scope="scope">
                  <!-- <el-button @click="update(scope.row)"
                             type="primary"
                             v-if=" scope.row.status == 0 ||scope.row.status == 2"
                             style="color:#1371CC"
                             size="mini">
                    上传
                  </el-button> -->
                  <div class="update_cell">
                    <el-upload class="upload-demo"
                               style="width:50px"
                               :on-progress="up_ing"
                               v-if="scope.row.status !== 3"
                               action="http://localhost:9529/wisdomaudit/auditPreviousDemandData/uploadData"
                               :show-file-list="false"
                               :http-request="handleUploadForm"
                               :before-upload="beforeAvatarUpload"
                               :file-list="fileList"
                               accept=".doc,.xls,.txt,.xlsx,.zip">
                      <el-button size="small"
                                 type="primary"
                                 @click="up(scope.row)">上传</el-button>
                      <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
                    </el-upload>

                    <el-button @click="look_record(scope.row)"
                               type="primary"
                               style="color:#1371CC"
                               size="mini">
                      查看
                    </el-button>
                  </div>

                </template>
              </el-table-column>
            </el-table>
          </el-form>

          <!-- 分页 -->
          <div class="page">
            <el-pagination background
                           layout="prev, pager, next"
                           :page-sizes="[2, 4, 6, 8]"
                           :current-page="this.feedback_list.current"
                           @current-change="handleCurrentChange_data"
                           :page-size="this.feedback_list.size"
                           :total="this.feedback_list.total"></el-pagination>
          </div>
          <!-- 分页 end-->
        </div>

        <!-- 操作记录 -->
        <div v-if="record_status==true">
          <p>操作记录</p>
          <el-form label-width="80px">
            <el-table :data="record_log"
                      style="width: 100%">
              <el-table-column prop="opOperate"
                               label="动作"
                               width="180">
              </el-table-column>
              <el-table-column prop="opUserName"
                               label="操作人"
                               width="180">
              </el-table-column>
              <el-table-column prop="opTime  "
                               label="操作时间">
                <template slot-scope="scope">
                  {{  scope.row.opTime |filtedate }}
                </template>
              </el-table-column>
              <el-table-column prop="opInfo"
                               label="备注">
              </el-table-column>
              <!-- <el-table-column prop="enclosurePath"
                             label="附件"> 
            </el-table-column>-->

            </el-table>

          </el-form>
        </div>

        <div class="remarks"
             v-if="see_data==false">
          <p>备注：</p>
          <el-input type="textarea"
                    v-model="post_remarks"
                    placeholder="请填写备注">
          </el-input>
        </div>

      </div>
      <div slot="footer"
           v-if="see_data==false">
        <el-button @click="dialogVisible = false">取 消</el-button>

        <el-button type="primary"
                   v-if="success_btn==1"
                   :loading="true">上传中</el-button>

        <el-button type="primary"
                   v-if="success_btn==0"
                   @click="post()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 附件详情 -->
    <el-dialog title="附件详情"
               width="40%"
               :visible.sync="dialogVisibl_enclosure_details"
               style="padding-bottom: 59px; ">
      <el-table :data="findFile_list"
                style="width: 100%;">
        <!-- <el-table-column prop="dataTaskNumber"
                             label="流水单号">
            </el-table-column> -->
        <el-table-column type="index"
                         label="序号">
        </el-table-column>
        <el-table-column prop="name"
                         label="资料类型">
        </el-table-column>
        <el-table-column prop="name"
                         label="文件名称">
        </el-table-column>
      </el-table>
    </el-dialog>

  </div>
</template>

<script>
import { data_pageList, feedback_pageList, operation_record_list, operation_download, operation_uploadData, operation_findFile, operation_reportData } from
  '@SDMOBILE/api/shandong/feedback'
import { fmtDate } from '@SDMOBILE/model/time.js';

export default {
  components: {
  },
  data () {
    return {
      loading: false,
      tableData_list: [
        { name: 111 },
        { name: 111 },
      ],
      list_data: [],//列表数据
      list_data_list: [],//列表
      params: {
        pageNo: 1,
        pageSize: 10,
      },
      dialogVisible: false,//反馈

      // 反馈资料
      data_query: {
        pageNo: 1,
        pageSize: 10,
        condition: {
          dataTaskNumber: '',
        }
      },
      feedback_list: [],//反馈资料列表
      check_data_list: [],// 反馈资料列表  多选

      projectNumber: '',// 项目名称：
      addPeople: '',// 审计期间
      title: '',//标题
      launchPeople: '',// 发起人
      down_url: '',//下载的url
      post_remarks: '',//反馈备注
      record_status: false,//操作记录
      record_log: [],//操作记录
      fileList: [],//上传
      update_path: '',//上传返回的路径
      auditPreviousDemandDataUuid: '',//上传的id
      status: '',//上传的状态


      see_data: false,// 查看状态
      dialogVisibl_enclosure_details: false,//附件详情
      findFile_list: [],//附件详情
      success_btn: 0,//文件上传完成

    }
  },
  filters: {
    filtedate: function (date) {
      let t = new Date(date);
      // return fmtDate(t, 'yyyy-MM-dd hh:mm:ss');
      return fmtDate(t, 'yyyy-MM-dd ');
    }
  },
  props: ['active_project'],
  created () {
    // this.managementProjectUuid = this.active_project;
    let params = {
      pageNo: this.params.pageNo,
      pageSize: this.params.pageSize,
    }
    this.list_data_page(params); // 反馈列表
  },
  methods: {
    // 反馈分页
    handleCurrentChange (val) {
      this.list_data_page(params);
    },
    // 列表
    list_data_page (params) {
      this.loading = true;
      data_pageList(params).then(resp => {
        this.list_data = resp.data;
        this.list_data_list = resp.data.records;//列表
        this.loading = false;
      })
    },

    // 查看
    see () {
      this.see_data = true;
      this.dialogVisible = true;//显示反馈
      console.log(data);
      this.projectNumber = data.projectNumber;// 项目名称：
      this.addPeople = data.addPeople;// 审计期间
      this.title = data.title;//标题
      this.launchPeople = data.launchPeople;// 发起人
      this.dialogVisible = true;//显示反馈
      this.data_query.condition.dataTaskNumber = data.addDataTaskUuid
      let params = {
        pageNo: this.data_query.pageNo,
        pageSize: this.data_query.pageSize,
        condition: {
          dataTaskNumber: this.data_query.condition.dataTaskNumber,
        }
      }
      this.feedback_post(params)//资料列表
    },

    // 反馈
    feedback_tag (data) {
      this.see_data = false;
      this.projectNumber = data.projectNumber;// 项目名称：
      this.addPeople = data.addPeople;// 审计期间
      this.title = data.title;//标题
      this.launchPeople = data.launchPeople;// 发起人
      this.dialogVisible = true;//显示反馈
      this.data_query.condition.dataTaskNumber = data.addDataTaskUuid
      let params = {
        pageNo: this.data_query.pageNo,
        pageSize: this.data_query.pageSize,
        condition: {
          dataTaskNumber: this.data_query.condition.dataTaskNumber,
        }
      }
      this.feedback_post(params)//资料列表
    },

    // 关闭  反馈  弹窗
    dialogBeforeClose () {
      this.dialogVisible = false
    },
    // 资料列表
    feedback_post (params) {
      this.loading = true
      feedback_pageList(params).then(resp => {
        this.feedback_list = resp.data
        this.loading = false;
      })
    },
    // 反馈资料 分页
    handleCurrentChange_data (val) {
      let params = {
        pageNo: val,
        pageSize: this.data_query.pageSize,
        condition: {
          dataTaskNumber: this.data_query.condition.dataTaskNumber,
        }
      }
      this.feedback_post(params)//资料列表
    },


    // 查看下载模版
    enclosure (id, name) {
      // let params = {
      //   uuid: id
      // };
      const fileName = name.split('.')[0];
      //模版下载
      let formData = new FormData()
      formData.append('uuid', id)
      this.$axios({
        method: 'post',
        url: 'http://localhost:9529/wisdomaudit/auditPreviousDemandData/downloadByFileId',
        // url: 'http://localhost:9529/wisdomaudit/auditPreviousDemandData/downloadByBid',
        data: formData,
        responseType: 'blob',
      }).then((res) => {
        const content = res.data;
        console.log(res);
        const blob = new Blob([content],
          // { type: "application/xlsx" }
          // { type: res.data.type }
          { type: 'application/octet-stream,charset=UTF-8' }
        )
        // var timestamp = (new Date()).valueOf();
        // const fileName = res.headers["content-disposition"].split("fileName*=utf-8''")[1];
        // const filteType = res.headers["content-disposition"].split('.')[1];
        if ('download' in document.createElement('a')) {
          // 非IE下载  
          const elink = document.createElement('a')
          elink.download = fileName //下载后文件名
          elink.style.display = 'none'
          elink.href = window.URL.createObjectURL(blob)
          document.body.appendChild(elink)
          elink.click()
          window.URL.revokeObjectURL(elink.href) // 释放URL 对象  
          document.body.removeChild(elink)
        } else {
          // IE10+下载 
          navigator.msSaveBlob(blob, fileName)
        }
      }).catch((err) => {
        console.log(err);
      })
    },
    // 查看附件 
    open_enclosure_details () {
      this.dialogVisibl_enclosure_details = true;//显示附件详情
      let params = {
        id: this.auditPreviousDemandDataUuid
      }
      operation_findFile(params).then(resp => {
        console.log(resp.data);
        this.findFile_list = resp.data
      })
    },

    // 上传中回调
    beforeAvatarUpload (file) {
      const isLt50M = file.size / 1024 / 1024 < 50;
      if (!isLt50M) {
        this.$message.error('上传模版不能超过 50MB!');
      }
      return isLt50M;
    },
    // 获取上传的id
    up (data) {
      this.auditPreviousDemandDataUuid = data.auditPreviousDemandDataUuid
      this.status = data.status
    },
    // 上传时
    up_ing (file) {
      this.success_btn = 1;//显示加载按钮  0成功  1 loaging
    },
    // 上传
    handleUploadForm (file) {
      let formData = new FormData()
      formData.append('status', this.status)
      formData.append('auditPreviousDemandDataUuid', this.auditPreviousDemandDataUuid)
      formData.append('file', file.file)
      this.$axios({
        method: 'post',
        url: 'http://localhost:9529/wisdomaudit/auditPreviousDemandData/uploadData',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(resp => {
        console.log(resp.data);
        if (resp.data.code == 0) {
          this.$message({
            message: '上传成功',
            type: 'success'
          });
          this.success_btn = 0;//隐藏加载按钮
          //刷新列表
          let params = {
            pageNo: this.data_query.pageNo,
            pageSize: this.data_query.pageSize,
            condition: {
              dataTaskNumber: this.data_query.condition.dataTaskNumber,
            }
          }
          this.feedback_post(params)//资料列表
        } else {
          this.$message({
            message: resp.msg,
            type: 'error'
          });
        }
      })
    },

    //查看操作 记录
    look_record (data) {
      this.record_status = true;
      let query_params = {
        id: data.auditPreviousDemandDataUuid,
      }
      this.post_operation_record(query_params)//刷新 操作记录 列表

    },
    // 操作记录 
    post_operation_record (query_params) {
      operation_record_list(query_params).then(resp => {
        this.record_log = resp.data
      })
    },
    // 反馈确认

    // 资料列表 选中
    handleSelectionChange_query (val) {
      this.check_data_list = val
      console.log(this.check_data_list);
    },
    // 提交
    post () {
      if (this.check_data_list.length == 0) {
        this.$message.info("请选择至少一条数据进行提交！");
        return false;
      }
      // let array1 = [];//数组1
      // this.check_data_list.forEach((item) => {
      //   array1.push(item);
      // });
      // console.log(array1);
      // return false
      // auditPreviousDemandDataUuid

      let params = {
        dataTaskNumber: this.check_data_list[0].dataTaskNumber,//id
        ids: this.check_data_list,//选择的数组
        remarks: this.post_remarks,//备注
      }
      // 提交数据接口
      operation_reportData(params).then(resp => {
        console.log(resp);
        if (resp.code == 0) {
          this.$message({
            message: "提交成功",
            type: "success",
          });
          this.dialogVisible = false;//关闭弹窗
          let params = {
            pageNo: this.data_query.pageNo,
            pageSize: this.data_query.pageSize,
            condition: {
              dataTaskNumber: this.data_query.condition.dataTaskNumber,
            }
          }
          this.feedback_post(params)//资料列表
        }
      })
    },

  }
}
</script>

<style  scoped>
.feeback {
  padding: 20px;
  box-sizing: border-box;
  background-color: #fff;
}
/* header */
.header {
  display: flex;
  justify-content: space-evenly;
  padding: 20px;
  box-sizing: border-box;
}
.header >>> .titleMes {
  font-size: 16px;
  display: flex;
  /* border: 1px sienna solid; */
}
/* header end*/
.title {
  width: 100%;
}
.task_type {
  padding: 10px 10px 20px 10px;
}

.page {
  width: 100%;
  padding: 20px 10px;
  display: flex;
  justify-content: flex-end;
}

.dialog_conter {
  /* border: 1px solid red; */
  padding: 20px;
  box-sizing: border-box;
}
.feeback >>> .el-dialog__footer {
  text-align: center !important;
  padding: 10px 20px 30px;
  box-sizing: border-box;
}

/* 附件详情 */
.update {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
}
.update_icon {
  width: 15px;
  height: 15px;
}
.update_icon svg {
  float: left;
  width: 15px;
  height: 15px;
}
.update span {
  color: #1371cc;
  margin-left: 5px;
}

.update >>> .el-dialog__wrapper {
  position: absolute !important;
  transform: translate(-50%, -50%);
  left: 50%;
  top: 0;
}

.dialog_conter >>> .has-gutter .cell,
.dialog_conter >>> .el-table__row .cell {
  text-align: center;
  justify-content: center !important;
}

.remarks {
  display: flex;
  padding: 30px 10px 20px;
}
.remarks p {
  min-width: 80px;
  text-align: right;
  padding-top: 10px;
}
.remarks >>> .el-input--medium .el-input__inner {
  min-width: 80px;
  height: 100px;
  border: 1px solid;
}
/* 表格的占位 */

.feeback >>> .el-table {
  min-height: 500px;
}
/* 弹窗内的占位 */
.dialog_conter >>> .el-table {
  min-height: 200px;
}

.update_cell {
  display: flex;
  justify-content: space-around;
}
</style>