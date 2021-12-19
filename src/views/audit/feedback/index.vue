<template>
  <div class="feeback">
    <!-- <p class="title">反馈资料列表</p> -->

    <div class="task_type">
      <!-- 表单 -->
      <el-table :data="list_data_list"
                v-loading="loading"
                :header-cell-style="{'background-color': '#F4FAFF',}"
                style="width: 100%">
        <el-table-column prop="createTime"
                         show-overflow-tooltip
                         label="发起日期">
          <template slot-scope="scope">
            <p v-if="scope.row.createTime">{{scope.row.createTime | filtedate}}</p>
            <p v-else></p>
          </template>
        </el-table-column>
        <el-table-column prop="projectNumber"
                         show-overflow-tooltip
                         label="项目名称">
        </el-table-column>
        <el-table-column prop="title"
                         show-overflow-tooltip
                         label="标题">

          <template slot-scope="scope">
            <p v-if="scope.row.title">
              {{scope.row.title}}
            </p>
            <p v-else>
              --
            </p>
          </template>

        </el-table-column>
        <el-table-column prop="launchPeople"
                         show-overflow-tooltip
                         label="发起人">

          <template slot-scope="scope">
            <p v-if="scope.row.launchPeople">
              {{scope.row.launchPeople}}
            </p>
            <p v-else>
              --
            </p>
          </template>
        </el-table-column>
        <el-table-column prop="status"
                         show-overflow-tooltip
                         label="状态">
          <template slot-scope="scope">
            <!-- {{
                  scope.row.status == 0
                    ? "待下发"
                    : scope.row.status == 1
                    ? "进行中"
                    : scope.row.status ==2
                    ?'已完成 ':''
                }} -->
            {{
                  scope.row.status == 0
                    ? "待开始"
                    : scope.row.status == 1
                    ? "资料待反馈"
                    : scope.row.status == 2
                    ? "已完成"
                    : scope.row.status == 3
                    ? "部分已反馈"
                    : scope.row.status == 4
                    ? "待审核":'--'
                }}
          </template>
        </el-table-column>

        <el-table-column label="操作"
                         width="250">
          <template slot-scope="scope">
            <el-button @click="see(scope.row)"
                       type="text"
                       plain
                       style="color:rgb(19, 113, 204);  font-size: 14px !important;"
                       size="small">
              查看
            </el-button>
            <el-button @click="feedback_tag(scope.row)"
                       v-if="scope.row.status ==1 || scope.row.status ==3"
                       type="text"
                       plain
                       style="color:rgb(19, 113, 204);  font-size: 14px !important;"
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
               :append-to-body='true'
               @close="resetForm2()"
               :close-on-click-modal="false"
               :before-close="dialogBeforeClose">
      <div class="title_dlag">详情</div>

      <div class="dialog_conter">
        <div class="header">
          <el-row class="titleMes">
            项目名称：{{projectNumber}}
          </el-row>
          <el-row class="titleMes">
            审计期间：{{addPeople}}
          </el-row>
          <el-row class="titleMes"
                  style="padding-left:40px;    box-sizing: border-box;">
            标题：{{title}}
          </el-row>
          <el-row class="titleMes"
                  style="padding-left:25px;    box-sizing: border-box;">发起人：{{launchPeople}}
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
                      :header-cell-style="{'background-color': '#F4FAFF',}"
                      @selection-change="handleSelectionChange_query">
              <el-table-column type="selection"
                               align="center"
                               width="55">
              </el-table-column>
              <el-table-column prop="dataNumber"
                               label="编号">

                <template slot-scope="scope">
                  <p v-if="scope.row.dataNumber">
                    {{scope.row.dataNumber}}
                  </p>
                  <p v-else>
                    --
                  </p>
                </template>

              </el-table-column>
              <!-- <el-table-column prop="secondLevelDataNumber"
                               label="二级编号">

                <template slot-scope="scope">
                  <p v-if="scope.row.secondLevelDataNumber">
                    {{scope.row.secondLevelDataNumber}}
                  </p>
                  <p v-else>
                    --
                  </p>
                </template>

              </el-table-column> -->

              <el-table-column prop="dataName"
                               label="资料名称">

                <template slot-scope="scope">
                  <p v-if="scope.row.dataName">
                    {{scope.row.dataName}}
                  </p>
                  <p v-else>
                    --
                  </p>
                </template>

              </el-table-column>
              <el-table-column prop="department"
                               label="部门">

                <template slot-scope="scope">
                  <p v-if="scope.row.department">
                    {{scope.row.department}}
                  </p>
                  <p v-else>
                    --
                  </p>
                </template>

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

                  <p v-else>--</p>

                </template>

              </el-table-column>
              <el-table-column prop="remarks"
                               label="备注">

                <template slot-scope="scope">
                  <p v-if="scope.row.remarks">
                    {{scope.row.remarks}}
                  </p>
                  <p v-else>
                    --
                  </p>
                </template>

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
                               width="120px"
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
                    <!-- <el-upload class="upload-demo"
                               :headers="headers"
                               style="margin:0 10px 0 0px"
                               :on-progress="up_ing"
                               v-if="scope.row.status !== 1 && scope.row.status !==3 "
                               action="/wisdomaudit/auditPreviousDemandData/uploadData"
                               :show-file-list="false"
                               :http-request="handleUploadForm"
                               :before-upload="beforeAvatarUpload"
                               :file-list="fileList"
                               accept=".zip,.doc,.docx,.xls,.xlsx,.txt">
                      <el-button size="small"
                                 type="text"
                                 style="color:#49bae8"
                                 v-if="success_btn2 !== scope.$index"
                                 @click="up(scope.row,scope.$index)">上传</el-button>
                      <el-button v-if="success_btn2 === scope.$index"
                                 type="primary"
                                 :loading="true">上传中</el-button>
                    </el-upload> -->

                    <el-button size="small"
                               v-if="scope.row.status !== 1 && scope.row.status !==3 "
                               type="text"
                               style="color:#49bae8"
                               @click="up_dlag(scope.row,scope.$index)">上传</el-button>

                    <el-button @click="look_record(scope.row)"
                               type="text"
                               style="color:#49bae8"
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
                      :header-cell-style="{'background-color': '#F4FAFF',}"
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
                   :loading="true">反馈中</el-button>

        <el-button type="primary"
                   v-if="success_btn==0"
                   @click="post()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 上传 -->
    <el-dialog center
               :append-to-body='true'
               :visible.sync="add_update_dlag"
               width="30%"
               :close-on-click-modal="false"
               @close="resetForm_verify()">
      <div class="title_dlag">{{title}}</div>

      <div class="dlag_conter">
        <el-form ref="verify_model"
                 :inline="false">
          <!-- 上传文件 -->
          <el-form-item label="上传文件：">
            <el-upload class="upload-demo"
                       drag
                       ref="upload2"
                       :headers="headers"
                       action="#"
                       :on-change="handleChangePic_verify"
                       :before-remove="handleRemoveApk"
                       :file-list="edit_file_list2"
                       :auto-upload="false"
                       accept=".zip,.doc,.docx,.xls,.xlsx,.txt"
                       multiple>
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                点击上传或将文件拖到虚线框<br />支持.zip,.doc,.docx,.xls,.xlsx,.txt
              </div>
            </el-upload>
          </el-form-item>
        </el-form>

      </div>
      <div slot="footer">
        <el-button @click="add_update_dlag = false">取 消</el-button>
        <el-button type="primary"
                   style="color:#49bae8"
                   v-if="success_btn2 == 0"
                   @click="up()">上传</el-button>
        <el-button v-if="success_btn2 == 1"
                   type="primary"
                   :loading="true">上传中</el-button>

      </div>
    </el-dialog>

    <!-- 附件详情 -->
    <el-dialog width="20%"
               center
               :append-to-body='true'
               :visible.sync="dialogVisibl_enclosure_details"
               style="padding-bottom: 59px; ">
      <div class="fileName">

        <!-- 模版 -->
        <el-table :data="findFile_list_moban"
                  :header-cell-style="{'text-align':'center','background-color': '#F4FAFF',}"
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
import axios from "axios";
import { down_file } from
  '@SDMOBILE/api/shandong/ls'

import { data_pageList, feedback_pageList, operation_record_list, operation_download, operation_uploadData, operation_findFile, operation_reportData, file_remove_list } from
  '@SDMOBILE/api/shandong/feedback'
import { fmtDate } from '@SDMOBILE/model/time.js';

export default {
  components: {
  },
  data () {
    return {
      dqtoken: "",
      headers: '',
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
      success_btn: 0,//提交按钮


      // success_btn2: -1,//文件上传
      success_btn2: 0,//上传按钮

      file_type: 0,//0 模版 1.附件
      findFile_list_moban: [],//模版列表
      isDisable: false,//防止重复提交

      add_update_dlag: false,
      up_list: {

      },//上传的附件
      edit_file_list2: [],//上传的附件
      title: '',
      attachmentList: '',//list
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
    this.dqtoken = sessionStorage.getItem("TOKEN");
    this.headers = { 'TOKEN': sessionStorage.getItem('TOKEN') }
    // this.managementProjectUuid = this.active_project;
    let params = {
      pageNo: this.params.pageNo,
      pageSize: this.params.pageSize,
    }
    this.list_data_page(params); // 反馈列表
  },
  methods: {

    // 新增上传附件
    handleChangePic_verify (file, fileList) {
      this.fileList2.push(file);
    },
    // 删除
    handleRemoveApk (file, fileList2) {
      if (file.raw) {
        this.fileList2.remove(file);
      } else {
        let params = {
          fileId: file.attachmentUuid,
        }
        this.file_remove(params, file, fileList2);
      }
    },
    // 删除接口
    file_remove (params, file, fileList2) {
      file_remove_list(params).then(resp => {

        switch (resp.code) {
          case 0:
            // 删除成功
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            let params2 = {
              pageNo: this.data_query.pageNo,
              pageSize: this.data_query.pageSize,
              condition: {
                dataTaskNumber: this.data_query.condition.dataTaskNumber,
              }
            }
            this.feedback_post(params2)//资料列表
            break;
          default:
            // 删除失败
            this.$message({
              message: resp.data.msg,
              type: 'error'
            });
            break;
        }
      })
    },

    // 上传 新增&&编辑 弹窗
    up_dlag (data, index) {
      this.add_update_dlag = true;
      this.auditPreviousDemandDataUuid = data.auditPreviousDemandDataUuid
      this.status = data.status;
      this.fileList2 = [];
      // 编辑回显
      this.attachmentList = data.attachmentList
      if (this.attachmentList.length > 0) {
        this.title = '编辑附件'
        this.edit_file_list2 = [];
        // 回显
        this.attachmentList.forEach(item => {
          item.isDeleted = 0;
          item.url = item.filePath;
          item.name = item.fileName;
          this.edit_file_list2.push(item);
        })
      } else {
        this.title = '新增附件'
      }
    },
    // 上传确认
    up () {
      this.success_btn2 = 1;//显示加载按钮  0成功  1 loaging
      if (this.title == '新增附件') {
        this.uoload_post();//上传事件
      } else {
        // 编辑
        if (this.fileList2) {
          this.uoload_post();//上传事件 
        } else {
          // 没有新增
          this.upload_succes();//上传成功
        }
      }
    },
    // 上传成功
    upload_succes () {
      this.success_btn2 = 0;//隐藏加载按钮
      this.$message({
        message: '上传成功',
        type: 'success'
      });
      this.add_update_dlag = false;//关闭弹窗
    },
    // 上传事件
    uoload_post () {
      let formData = new FormData()
      formData.append('status', this.status)
      formData.append('auditPreviousDemandDataUuid', this.auditPreviousDemandDataUuid)
      this.fileList2.forEach((item) => {

        if (item.raw) {
          formData.append('file', item.raw);
        } else {
          return;
        }
      })
      axios({
        method: 'post',
        url: '/wisdomaudit/auditPreviousDemandData/uploadDataList',
        headers: {
          TOKEN: this.dqtoken,
          'Content-Type': 'multipart/form-data'
        },
        data: formData,
      }).then(resp => {
        if (resp.data.code == 0) {
          this.upload_succes();//上传成功
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
          this.success_btn2 = 0;//隐藏加载按钮
          this.$message({
            message: resp.msg,
            type: 'error'
          });
        }
      })
    },

    // 关闭上传
    resetForm_verify () {
      this.$refs.upload2.clearFiles();
      this.success_btn2 = 0;//隐藏加载按钮
    },
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

      })
    },


    // 下载模版
    enclosure (id, name) {
      // const fileName = name.split('.')[0];
      //模版下载
      let formData = new FormData()
      formData.append('fileId', id)
      axios({
        method: 'post',
        url: '/wisdomaudit/auditPreviousDemandData/downloadByFileId',
        headers: {
          TOKEN: this.dqtoken,
        },
        data: formData,
        responseType: 'blob',
      }).then((res) => {
        const content = res.data;

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


    // 关闭
    resetForm2 () {
      this.success_btn2 = false;//隐藏上传按钮
      this.success_btn = 0//隐藏反馈按钮
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
          auditPreviousDemandDataUuid: this.log.auditPreviousDemandDataUuid
        },
      }
      this.loading_list2 = true;
      operation_record_list(query_params).then(resp => {
        this.record_log = resp.data

        this.loading_list2 = false;
      })
    },
    // 反馈确认

    // 资料列表 选中
    handleSelectionChange_query (val) {
      this.check_data_list = val

    },
    // 提交
    post () {
      // this.isDisable = true
      // setTimeout(() => {
      //   this.isDisable = false
      // }, 2000)
      if (this.check_data_list.length == 0) {
        this.$message.info({ message: "请选择至少一条数据进行提交！", type: "warning", });
        return false;
      }
      this.success_btn = 1;//按钮状态更改

      // 判断是否可以提交反馈
      if (this.check_data_list.every(item => item.status == 0 || item.status == 2)) {
        let params = {
          dataTaskNumber: this.check_data_list[0].dataTaskNumber,//id
          ids: this.check_data_list,//选择的数组
          remarks: this.post_remarks,//备注
        }
        // 提交数据接口
        operation_reportData(params).then(resp => {
          this.success_btn = 0;

          switch (resp.data.result) {
            case 0:
              this.$message({
                message: "提交成功",
                type: "success",
              });
              let params2 = {
                pageNo: this.data_query.pageNo,
                pageSize: this.data_query.pageSize,
                condition: {
                  dataTaskNumber: this.data_query.condition.dataTaskNumber,
                }
              }
              this.feedback_post(params2)//资料列表

              this.dialogVisible = false;//关闭弹窗

              let params = {
                pageNo: this.params.pageNo,
                pageSize: this.params.pageSize,
              }
              this.list_data_page(params); // 反馈列表


              break;
            case 1:
              this.$message({
                message: '请上传附件',
                type: "warning",
              });
              break;
            default:
              this.$message({
                message: '提交失败',
                type: "error",
              });
              break;
          }


        })
      } else {
        this.$message.info({ message: "已经提及成功的或者审核中的不可以再次提交！", type: "warning", });
        this.success_btn = 0;
        return false
      }




    },

  }
}
</script>

<style  scoped>
@import "../../../assets/styles/css/lhg.css";
>>> .foot .el-button {
  font-weight: normal;
}
>>> .el-dialog--center .el-dialog__body {
  padding: 0 !important;
}
>>> .el-dialog--center .el-dialog__body .el-form-item__label {
  font-size: 14px;
}
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
  flex-wrap: wrap;
  justify-content: space-evenly;
  padding: 20px 20px 20px;
  box-sizing: border-box;
}
.header >>> .titleMes {
  font-size: 16px;
  display: flex;
  width: 50%;
  padding: 0 10px;
  margin-bottom: 20px;
  box-sizing: border-box;
}
/* header end*/
.title {
  width: 100%;
}
.task_type {
  padding: 0 10px 20px 10px;
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
}

.blue {
  color: #49bae8 !important;
}

.dlag_conter {
  padding: 20px 20px 0;
  box-sizing: border-box;
}
.dlag_conter >>> .el-input {
  width: 300px;
}
.dlag_conter >>> .el-form-item {
  display: flex;
  width: 450px;
  margin: 0 auto;
}
.dlag_conter >>> .el-form-item__content {
  display: flex;
  width: 360px;
}
.upload-demo {
  width: 100%;
}
</style>
