<template>
  <div class="feeback">
    <!-- <p class="title">反馈资料列表</p> -->
    <Vault :vaultV="vaultV"
           :sceneId="sceneId"
           :approvers="approvers"
           :maxTime="maxTime"
           :dqtime="dqtime"
           :account="account"
           :appSessionId="appSessionId"
           @changevault="changevault"
           @vdownload="vdownload"></Vault>
    <div class="task_type">
      <!-- 表单 -->
      <el-table :data="list_data_list"
                v-loading="loading"
                :header-cell-style="{'background-color': '#F4FAFF',}"
                stripe
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
                         label="项目名称">
        </el-table-column>
        <el-table-column prop="title"
                         label="标题">

          <template slot-scope="scope">
            <span v-if="scope.row.title">
              {{scope.row.title}}
            </span>
            <span v-else>
              --
            </span>
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
            标题：{{title_details}}
          </el-row>
          <el-row class="titleMes"
                  style="padding-left:25px;    box-sizing: border-box;">发起人：{{launchPeople}}
          </el-row>
        </div>

        <!-- 资料列表 -->
        <div>
          <p style="text-align: left">资料列表</p>
          <el-form label-width="80px">
            <el-table ref="multipleTable"
                      row-key="id"
                      v-loading="loading_list"
                      :data="feedback_list.records"
                      tooltip-effect="dark"
                      style="width: 100%"
                      stripe
                      :header-cell-style="{'background-color': '#F4FAFF',}"
                      @selection-change="handleSelectionChange_query">
              <el-table-column type="selection"
                               align="center"
                               width="55">
              </el-table-column>
              <el-table-column prop="dataNumber"
                               label="编号">

                <template slot-scope="scope">
                  <span v-if="scope.row.dataNumber">
                    {{scope.row.dataNumber}}
                  </span>
                  <span v-else>
                    --
                  </span>
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
                  <span v-if="scope.row.dataName">
                    {{scope.row.dataName}}
                  </span>
                  <span v-else>
                    --
                  </span>
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
                          @click="openVault(item,'下载1')">
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
                               width="110px"
                               show-overflow-tooltip
                               label="备注">
                <template slot-scope="scope">
                  <span v-if="scope.row.remarks">
                    {{scope.row.remarks}}
                  </span>
                  <span v-else>
                    --
                  </span>
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
                          @click="openVault(item,'下载1')">
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
          <p style="text-align:left">操作记录</p>
          <el-form label-width="80px">
            <el-table :data="record_log.records"
                      v-loading="loading_list2"
                      :header-cell-style="{'background-color': '#F4FAFF',}"
                      stripe
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
               class="dlag_up"
               :close-on-click-modal="false"
               @close="resetForm_verify()">
      <div class="title_dlag">{{title}}</div>

      <div class="dlag_conter">
        <el-form ref="verify_model"
                 :inline="false">
          <!-- 上传文件 -->
          <el-form-item label="上传文件：">
            <!-- <el-upload class="upload-demo"
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
            </el-upload> -->
            <el-upload class="upload-demo"
                       drag
                       ref="upload2"
                       :headers="headers"
                       action="#"
                       :http-request="( params)=>{myFileUpload( params,'/wisdomaudit/auditBasy/filesUpload',fileList2,'upload2')}"
                       :before-upload="(file, fileList)=>{beforeUpload(file, fileList,'反馈审计资料')}"
                       :before-remove="handleRemoveApk"
                       :file-list="edit_file_list2"
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
              <span @click="openVault(scope.row,'下载2')"> {{  scope.row.fileName }}</span>
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
              <span @click="openVault(scope.row,'下载2')">{{scope.row.fileName}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import axios from "axios";
import Vault from "@WISDOMAUDIT/components/Vaultcertification";
import { down_file } from
  '@SDMOBILE/api/shandong/ls'
import { data_pageList, feedback_pageList, operation_record_list, operation_download, operation_uploadData, operation_findFile, operation_reportData, file_remove_list, updateDataListBusinessId } from
  '@SDMOBILE/api/shandong/feedback'
import { fmtDate } from '@SDMOBILE/model/time.js';
export default {
  components: {
    Vault
  },
  data () {
    return {
      fileDataList: [],//用来接收切割过的文
      file: [],

      vaultV: false,
      sceneId: 1557, //经营指标、模型结果编号:1556 附件上传后下载编号:1557
      approvers: [], //审批人列表
      maxTime: "",//最大时间
      dqtime: "",//当前时间
      account: "",//返回的账户
      appSessionId: "",//应用sessionid
      downloaobj: {},//暂存的下载目标

      remarks2: '列表数据列表数据列表数据列表数据列表数据列表数据列表数据',
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
      title_details: '',//标题
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
    },
    ellipsis (value) {
      if (!value) return "";
      if (value.length > 8) {
        return value.slice(0, 8) + "...";
      }
      return value;
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

    // 分块上传开始
    // 上传文件之前
    beforeUpload (file, fileList, ext1) {
      //  调用函数分割文件 我这里是分割成不超过20M的文件快
      this.fileDataList = this.createFileChunk(file, 1024 * 1024 * 3, ext1);
    },
    // 自定义文件上传的模式，方法
    myFileUpload (params, url, tableList, refName) {
      /** 这里采用了循环请求，等全部循环上传请求完成以后再去执行合并请求的操作  Promise.all
       * 参数既有url参数也有body参数
       */
      if (this.fileDataList.length > 0) {

        this.ywUpload(this.fileDataList, params, url, tableList, refName, params.file.uid);
      }
    },
    ywUpload (list, params, url, tableList, refName, uid) {
      const loading = this.$loading({
        lock: true,
        text: '上传中',
        spinner: 'el-icon-loading',
        background: 'transparent'
      });
      var data = '';
      var left = [], right = list;
      var _obj = right.shift();
      let formData = new FormData();
      formData.append('file', _obj.file);
      formData.append('chunkNumber', _obj.chunkNumber);
      formData.append('chunkSize', _obj.chunkSize);
      formData.append('totalSize', _obj.totalSize);
      formData.append('filename', _obj.filename);
      formData.append('relativePath', _obj.relativePath);
      formData.append('fileName', _obj.fileName);
      formData.append('fileSize', _obj.fileSize);
      formData.append('ext1', _obj.ext1);
      formData.append('totalChunks', _obj.totalChunks);
      formData.append('path', _obj.path);
      formData.append('identifier', _obj.identifier);
      axios({
        method: 'post',
        headers: {
          'TOKEN': this.headers.TOKEN,
        },
        data: formData,
        url: url,
        // data: item.file,
      })
        .then(res => {
          data = res.data.data;
          if (data.status && data.status == 1) {
            loading.close();
            this.$message({
              message: data.fileName + '上传成功',
              type: 'success'
            });
            data.isDeleted = 2;
            tableList.push(data);
            this.$refs[refName].uploadFiles.forEach(item => { item.attachmentUuid = data.attachmentUuid });
          }
          if (data.fileName && data.status === 0) {
            loading.close();
            this.$message({
              message: data.fileName + '上传失败,请重新上传',
              type: 'error'
            });
            var idx = this.$refs[refName].uploadFiles.findIndex(item => item.uid === uid) //去除文件列表失败文件（uploadFiles为el-upload中的ref值）
            this.$refs[refName].uploadFiles.splice(idx, 1) //去除文件列表失败文件
          }
          if (right.length > 0) {
            this.ywUpload(list, params, url, tableList, refName, uid);
          }
        })
        .catch(err => {

          let uid = files.uid
          let idx = this.$refs[refName].uploadFiles.findIndex(item => item.uid === uid) //去除文件列表失败文件（uploadFiles为el-upload中的ref值）
          this.$refs[refName].uploadFiles.splice(idx, 1) //去除文件列表失败文件
        });
    },
    //随机数
    passwords (pasLen) {
      var pasArr = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '_', '-', '$', '%', '&', '@', '+', '!'];
      var password = '';
      var pasArrLen = pasArr.length;
      for (var i = 0; i < pasLen; i++) {
        var x = Math.floor(Math.random() * pasArrLen);
        password += pasArr[x];
      }
      return password;
    },
    // 文件分割的方法
    createFileChunk (file, size = chunkSize, ext1) {
      var _idStr = this.passwords(16);
      const fileChunkList = [];
      let count = 0;
      let num = 1;
      var total = parseInt((file.size) / size);
      if (file.size < size) {
        fileChunkList.push({
          file: file.slice(count, count + size),
          chunkNumber: num,
          chunkSize: size,
          totalSize: file.size,
          filename: file.name,
          relativePath: file.name,
          fileName: file.name,
          fileSize: file.size,
          ext1: ext1,//模块名称
          totalChunks: num,
          path: '',
          identifier: _idStr,
        });
      } else {
        while (num <= total) {
          fileChunkList.push({
            file: file.slice(count, count + size),
            chunkNumber: num,
            chunkSize: size,
            totalSize: file.size,
            filename: file.name,
            relativePath: file.name,
            fileName: file.name,
            fileSize: file.size,
            ext1: ext1,//模块名称
            totalChunks: total,
            path: '',
            identifier: _idStr,
          });
          count += size;
          num++
        }
      }

      return fileChunkList
    },
    //分块上传结束

    //通过认证后的方法
    vdownload () {

      if (this.downloaobj.dtype == '下载1') {
        this.download(this.downloaobj.attachmentUuid, this.downloaobj.fileName)
      } else {
        this.enclosure(this.downloaobj.attachmentUuid, this.downloaobj.fileName)
      }
    },
    //控制认证弹窗
    changevault (val) {
      this.vaultV = val;
    },
    //打开金库
    openVault (obj, downtype) {

      this.downloaobj = obj
      this.downloaobj.dtype = downtype
      axios({
        method: "post",
        url: `/wisdomaudit/treasury/getTreasuryStatus`,
        headers: {
          TOKEN: this.headers.TOKEN,
        },
        data: {
          sceneId: this.sceneId,
          sceneName: "附件上传后下载", //场景名称
          sensitiveData: "report_download", //敏感数据对应的编号：  data_export 经营指标、模型结果 report_download 附件上传后下载;
          sensitiveOperate: "download", //敏感操作对应的编号：export： 导出   select：查询
        },
      }).then((resp) => {
        //result 是否开启 开启：1  无需开启：0
        //resultDesc 无需开启原因（成功错误信息）
        //historyAppSessionId 历史有效应用sessionid（仅当已授权状态时必填属性）
        //relation 多值授权方式与访问方式关系
        //policyAuthMethod 授权方式： remoteAuth远程授权
        //policyAccessMethod
        //maxTime 授权条件（必填属性）单位为小时： 当为0时，为单次授权；否则为时间段授权即允许以当前时间为开始时间，开始时间+maxTime时间为最大结束时间，允许用户在此范围选择；
        //approvers 审批人列表
        //如果是线上环境
        if (resp.data.data.isVaultProfiles) {
          let rep = resp.data.data.treasuryStatusRsp;
          if (rep.result == 0) {
            this.$message('因金库未开启或服务异常，文件下载失败，请联系系统管理员。');
            return;
          } else {

            this.approvers = rep.approvers || "";
            this.maxTime = rep.maxTime;
            this.dqtime = new Date();
            this.account = resp.data.data.account;
            this.appSessionId = resp.data.data.appSessionId;
            this.vaultV = true;
          }
        } else {
          //否则不处理或在此处直接进行后面的操作
          this.vdownload()
        }
      });
    },

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

            this.feedback_post()//资料列表
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
        this.uoload_post(1);//上传事件
      } else {
        // 编辑
        if (this.fileList2) {
          this.uoload_post(2);//上传事件
        } else {
          // 没有新增
          this.success_btn2 = 0;//隐藏加载按钮
          this.$message({
            message: '上传成功',
            type: 'success'
          });
          this.add_update_dlag = false;//关闭弹窗
        }
      }
    },
    // 上传事件
    uoload_post (type) {
      if (type == 1) {
        // 新增
        let params = {
          auditPreviousDemandDataUuid: this.auditPreviousDemandDataUuid,
          attachmentList: this.fileList2,
        }
        // 上传的数据提交
        updateDataListBusinessId(params).then(resp => {
          this.success_btn2 = 0;//隐藏加载按钮

          if (resp.code == 0) {
            this.$message({
              message: '上传成功',
              type: 'success'
            });

            this.add_update_dlag = false;//关闭弹窗
            //刷新列表
            this.feedback_post()//资料列表
          } else {

            this.$message({
              message: resp.msg,
              type: 'error'
            });
          }
        })
        // }
      } else {
        // 编辑
        let params2 = {
          auditPreviousDemandDataUuid: this.auditPreviousDemandDataUuid,
          attachmentList: this.edit_file_list2,
        }
        // 上传的数据提交
        updateDataListBusinessId(params2).then(resp => {
          this.success_btn2 = 0;//隐藏加载按钮

          if (resp.code == 0) {
            this.$message({
              message: '上传成功',
              type: 'success'
            });

            this.add_update_dlag = false;//关闭弹窗
            //刷新列表
            this.feedback_post()//资料列表
          } else {

            this.$message({
              message: resp.msg,
              type: 'error'
            });
          }
        })
        // }
      }


    },

    // 关闭上传
    resetForm_verify () {
      this.$refs.upload2.clearFiles();
      this.success_btn2 = 0;//隐藏加载按钮
    },
    handleSizeChange (val) {
      this.params.pageSize = val
      let params = {
        pageNo: this.params.pageNo,
        pageSize: this.params.pageSize,
      }
      this.list_data_page(params);
    },
    // 反馈分页
    handleCurrentChange (val) {
      this.params.pageNo = val
      let params = {
        pageNo: this.params.pageNo,
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
      this.title_details = data.title;//标题
      this.launchPeople = data.launchPeople;// 发起人
      this.dialogVisible = true;//显示反馈
      this.data_query.condition.dataTaskNumber = data.addDataTaskUuid

      this.feedback_post()//资料列表
    },

    // 反馈
    feedback_tag (data) {
      this.see_data = false;
      this.projectNumber = data.projectNumber;// 项目名称：
      this.addPeople = data.addPeople;// 审计期间
      this.title_details = data.title;//标题
      this.launchPeople = data.launchPeople;// 发起人
      this.dialogVisible = true;//显示反馈
      this.data_query.condition.dataTaskNumber = data.addDataTaskUuid
      this.feedback_post()//资料列表
    },

    // 关闭  反馈  弹窗
    dialogBeforeClose () {
      this.dialogVisible = false
    },
    // 资料列表
    feedback_post () {
      this.loading_list = true

      let params = {
        pageNo: this.data_query.pageNo,
        pageSize: this.data_query.pageSize,
        condition: {
          dataTaskNumber: this.data_query.condition.dataTaskNumber,
        }
      }

      feedback_pageList(params).then(resp => {
        this.feedback_list = resp.data
        this.loading_list = false;
      })
    },
    handleSizeChange_data (val) {
      this.data_query.pageSize = val
      this.feedback_post()//资料列表
    },
    // 反馈资料 分页
    handleCurrentChange_data (val) {
      this.data_query.pageNo = val
      this.feedback_post()//资料列表
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
      this.record_status = false;//隐藏哈看的列表
    },
    //查看操作 记录
    look_record (data) {
      this.record_status = true;
      this.log.auditPreviousDemandDataUuid = data.auditPreviousDemandDataUuid,
        this.post_operation_record()//刷新 操作记录 列表

    },
    handleSizeChange_log (val) {
      this.log.pageSize = val;
      this.post_operation_record()//刷新 操作记录 列表
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
              this.feedback_post()//资料列表
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
.dlag_up >>> .el-dialog {
  min-width: 500px;
}

.dialog_conter >>> .el-tooltip p {
  display: block;
  width: auto;
  /* overflow: hidden; */
  text-overflow: ellipsis;
  white-space: nowrap;
}
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
  text-align: left;
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
.dlag_conter >>> .el-upload-list__item-name {
  text-align: left;
}
</style>
