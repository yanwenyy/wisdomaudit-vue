<template>
  <div class="feeback">
    <p class="title">反馈资料列表</p>

    <div class="task_type">
      <!-- 表单 -->
      <el-table :data="list_data_list"
                v-loading="loading"
                :header-cell-style="{'text-align':'center','background-color': '#F4FAFF',}"
                style="width: 100%">
        <el-table-column prop="createTime"
                         align="center"
                         label="发起日期">
          <template slot-scope="scope">
            <p>{{scope.row.createTime | filtedate}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="projectNumber"
                         align="center"
                         label="项目名称">
        </el-table-column>
        <el-table-column prop="title"
                         align="center"
                         label="标题">
        </el-table-column>
        <el-table-column prop="launchPeople"
                         align="center"
                         label="发起人">
        </el-table-column>
        <el-table-column prop="status"
                         align="center"
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
                         align="center"
                         width="250">
          <template slot-scope="scope">
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

        <el-pagination @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :page-size="this.list_data.size"
                       :current-page="this.list_data.current"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="this.list_data.total">
        </el-pagination>

      </div>
      <!-- 分页 end-->

    </div>

    <!-- 反馈 -->
    <el-dialog :visible.sync="dialogVisible"
               center
               width="60%"
               :before-close="dialogBeforeClose">
      <div class="title_dlag">资料列表</div>

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
                      v-loading="loading_list"
                      :data="feedback_list.records"
                      tooltip-effect="dark"
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
                  <el-popover :popper-class="findFile_list_moban==''?'no-padding':''"
                              v-if="scope.row.enclosure"
                              placement="bottom"
                              width="250"
                              @show="enclosure_look(scope.row.dataModulId)"
                              trigger="click">
                    <ul v-if="findFile_list_moban!=''"
                        class="fileList-ul">
                      <li class="tableFileList-title">文件名称</li>
                      <li v-for="(item,index) in findFile_list_moban"
                          :key="index"
                          class="pointer blue"
                          @click="download(item.attachmentUuid,item.fileName)">
                        {{item.fileName}}</li>
                    </ul>
                    <div slot="reference"
                         style="color: #1371cc;"
                         class="pointer"><i class="el-icon-folder-opened list-folder"></i>{{scope.row.enclosure}}
                    </div>
                  </el-popover>

                </template>

              </el-table-column>
              <el-table-column prop="remarks"
                               label="备注">
              </el-table-column>
              <el-table-column prop="updateTime"
                               label="提供时间">
                <template slot-scope="scope">
                  {{scope.row.createTime | filtedate}}
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
                  <el-popover :popper-class="findFile_list==''?'no-padding':''"
                              v-if="scope.row.enclosureCount"
                              placement="bottom"
                              width="250"
                              @show="open_enclosure_details(scope.row.auditPreviousDemandDataUuid)"
                              trigger="click">
                    <ul v-if="findFile_list!=''"
                        class="fileList-ul">
                      <li class="tableFileList-title">文件名称</li>
                      <li v-for="(item,index) in findFile_list"
                          :key="index"
                          class="pointer blue"
                          @click="download(item.attachmentUuid,item.fileName)">
                        {{item.fileName}}</li>
                    </ul>
                    <div slot="reference"
                         style="color: #1371cc;"
                         class="pointer"><i class="el-icon-folder-opened list-folder"></i>{{scope.row.enclosureCount}}
                    </div>
                  </el-popover>

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
                               action="/wisdomaudit/auditPreviousDemandData/uploadData"
                               :show-file-list="false"
                               :http-request="handleUploadForm"
                               :before-upload="beforeAvatarUpload"
                               :file-list="fileList"
                               accept=".zip,.doc,.docx,.xls,.xlsx,.txt">
                      <el-button size="small"
                                 type="primary"
                                 @click="up(scope.row)">上传</el-button>

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
            <el-pagination @size-change="handleSizeChange_data"
                           @current-change="handleCurrentChange_data"
                           :page-size="this.feedback_list.size"
                           :current-page="this.feedback_list.current"
                           layout="total, sizes, prev, pager, next, jumper"
                           :total="this.feedback_list.total">
            </el-pagination>

          </div>
          <!-- 分页 end-->
        </div>

        <!-- 操作记录 -->
        <div v-if="record_status==true">
          <p>操作记录</p>
          <el-form label-width="80px">
            <el-table :data="record_log.records"
                      v-loading="loading_list2"
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
          <div class="page">
            <el-pagination @size-change="handleSizeChange_log"
                           @current-change="handleCurrentChange_log"
                           :page-size="this.record_log.size"
                           :current-page="this.record_log.current"
                           layout="total, sizes, prev, pager, next, jumper"
                           :total="this.record_log.total">
            </el-pagination>

          </div>

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
    <el-dialog width="20%"
               center
               :header-cell-style="{'text-align':'center','background-color': '#F4FAFF',}"
               :visible.sync="dialogVisibl_enclosure_details"
               style="padding-bottom: 59px; ">
      <div class="fileName">

        <!-- 模版 -->
        <el-table :data="findFile_list_moban"
                  v-if="file_type == 0"
                  style="width: 100%;">
          <!-- <el-table-column prop="dataTaskNumber"
                             label="流水单号">
            </el-table-column> -->
          <!-- <el-table-column type="index"
                         align="center"
                         label="序号">
        </el-table-column>
        <el-table-column prop="name"
                         align="center"
                         label="资料类型">
        </el-table-column> -->
          <el-table-column prop="fileName"
                           align="center"
                           label="文件名称">
            <template slot-scope="scope">
              <span @click="enclosure(scope.row.attachmentUuid,scope.row.fileName)"> {{  scope.row.fileName }}</span>
            </template>

          </el-table-column>
        </el-table>

        <!-- 附件 -->
        <el-table :data="findFile_list"
                  v-if="file_type==1"
                  style="width: 100%;">
          <!-- <el-table-column prop="dataTaskNumber"
                             label="流水单号">
            </el-table-column> -->
          <!-- <el-table-column type="index"
                         align="center"
                         label="序号">
        </el-table-column>
        <el-table-column prop="name"
                         align="center"
                         label="资料类型">
        </el-table-column> -->
          <el-table-column prop="fileName"
                           align="center"
                           label="文件名称">
            <template slot-scope="scope">
              <span @click="enclosure(scope.row.attachmentUuid,scope.row.fileName)">{{scope.row.fileName}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { down_file } from
  '@SDMOBILE/api/shandong/ls'

import { data_pageList, feedback_pageList, operation_record_list, operation_download, operation_uploadData, operation_findFile, operation_reportData } from
  '@SDMOBILE/api/shandong/feedback'
import { fmtDate } from '@SDMOBILE/model/time.js';

export default {
  components: {
  },
  data () {
    return {
      loading: false,
      loading_list: false,
      list_data_loading: false,
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
      list_loading: false,//资料列表 loading
      feedback_list: [],//反馈资料列表
      check_data_list: [],// 反馈资料列表  多选

      log: {
        pageNo: 1,
        pageSize: 10,
        auditPreviousDemandDataUuid: '',
      },
      loading_list2: false,

      projectNumber: '',// 项目名称：
      addPeople: '',// 审计期间
      title: '',//标题
      launchPeople: '',// 发起人
      down_url: '',//下载的url
      post_remarks: '',//反馈备注
      record_loading: false,//操作记录loading
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

      file_type: 0,//0 模版 1.附件
      findFile_list_moban: [],//模版列表

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
    handleSizeChange (val) {
      this.params.pageSize = val
    },
    // 反馈分页
    handleCurrentChange (val) {
      let params = {
        pageNo: val,
        pageSize: this.params.pageSize,
      }
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
    see (data) {
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
      this.loading_list = true
      feedback_pageList(params).then(resp => {
        this.feedback_list = resp.data
        this.loading_list = false;
      })
    },
    handleSizeChange_data (val) {
      this.data_query.pageSize = val
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

    // 查看模版
    enclosure_look (id) {
      // this.dialogVisibl_enclosure_details = true;//显示附件详情
      this.file_type = 0;
      let params = {
        id: id
      }
      operation_findFile(params).then(resp => {
        this.findFile_list_moban = resp.data
        console.log(this.findFile_list_moban);
      })


    },
    //   已完成列表点击附件
    download (id, fileName) {
      let formData = new FormData()
      formData.append('fileId', id)
      down_file(formData).then(resp => {
        const content = resp;
        const blob = new Blob([content],
          { type: 'application/octet-stream,charset=UTF-8' }
        )
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


    // 下载模版
    enclosure (id, name) {
      // const fileName = name.split('.')[0];
      //模版下载
      let formData = new FormData()
      formData.append('fileId', id)
      this.$axios({
        method: 'post',
        url: '/wisdomaudit/auditPreviousDemandData/downloadByFileId',
        data: formData,
        responseType: 'blob',
      }).then((res) => {
        const content = res.data;
        console.log(res);
        const blob = new Blob([content],
          { type: 'application/octet-stream,charset=UTF-8' }
        )

        //  var timestamp = (new Date()).valueOf();
        // const fileName = res.headers["content-disposition"].split("fileName*=utf-8''")[1];
        // const filteType = res.headers["content-disposition"].split('.')[1];

        if ('download' in document.createElement('a')) {
          // 非IE下载
          const elink = document.createElement('a')
          elink.download = name //下载后文件名
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
    open_enclosure_details (id) {
      // this.dialogVisibl_enclosure_details = true;//显示附件详情
      this.file_type = 1;//0.模版 1.附件
      let params = {
        id: id
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
        url: '/wisdomaudit/auditPreviousDemandData/uploadData',
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
      this.log.auditPreviousDemandDataUuid = data.auditPreviousDemandDataUuid,
        this.post_operation_record()//刷新 操作记录 列表

    },
    handleSizeChange_log (val) {
      this.log.pageSize = val;
    },
    // 操作记录分页
    handleCurrentChange_log (val) {
      this.log.pageNo = val
      this.post_operation_record()//刷新 操作记录 列表
    },
    // 操作记录
    post_operation_record () {
      let query_params = {
        pageNo: this.log.pageNo,
        pageSize: this.log.pageSize,
        condition: {
          logSysActiUuid: this.log.auditPreviousDemandDataUuid
        },
      }
      this.loading_list2 = true;
      operation_record_list(query_params).then(resp => {
        this.record_log = resp.data
        console.log(this.record_log);
        this.loading_list2 = false;
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
@import "../../../assets/styles/css/lhg.css";

.fileName .cell span:hover {
  cursor: pointer !important;
  color: #1371cc !important;
}
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
