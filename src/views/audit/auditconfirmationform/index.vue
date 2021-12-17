<template>
  <div class="auditConfirmation">
    <el-button type="primary"
               @click="addConfirmation()"
               class="subBtn">新增确认单</el-button>
    <!-- 审计确认单列表 -->
    <div class="min_height">

      <el-table @row-dblclick="getLook"
                :header-cell-style="{'background-color': '#F4FAFF',}"
                :data="confirmaryData"
                style="margin-top: 1%"
                class="confirmaryTable">
        <el-table-column algin="left"
                         type="index"
                         label="序号"></el-table-column>
        <el-table-column algin="left"
                         label="审计(调查)事项"
                         prop="matter"></el-table-column>
        <el-table-column algin="left"
                         label="审计人员"
                         prop="auditorsName"></el-table-column>
        <el-table-column algin="left"
                         label="问题数"
                         prop="problemsNumber">
          <template slot-scope="scope">
            {{scope.row.problemsNumber?scope.row.problemsNumber:'--'}}
          </template>
        </el-table-column>
        <el-table-column algin="left"
                         label="确认单附件">
          <template slot-scope="scope">
            <el-popover :popper-class="tableFileList==''?'no-padding':''"
                        v-if="scope.row.confirmationFileNumber"
                        placement="bottom"
                        width="250"
                        @show="getFileList(scope.row.auditConfirmationUuid)"
                        trigger="click">
              <ul v-if="tableFileList!=''"
                  class="fileList-ul">
                <li class="tableFileList-title">文件名称</li>
                <li v-for="item in tableFileList"
                    class="pointer blue"
                    @click="downFile(item.attachment_uuid,item.file_name)">{{item.file_name}}</li>
              </ul>
              <div slot="reference"
                   class="pointer"><i class="el-icon-folder-opened list-folder"></i>{{scope.row.confirmationFileNumber}}
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="操作"
                         algin="left">
          <template slot-scope="scope">
            <el-button size="small"
                       type="text"
                       class="btnStyle editBtn"
                       @click="edit(scope.row)"
                       v-if="scope.row.createUserUuid==userInfo.user.id">编辑</el-button>
            <!--<el-upload v-if="scope.row.createUserUuid==userInfo.user.id"-->
            <!--:show-file-list="false"-->
            <!--class="upload-demo inline-block btnStyle"-->
            <!--:action="'/wisdomaudit/auditConfirmation/fileUpload?auditConfirmationUuid='+scope.row.auditConfirmationUuid+'&confirmationFileNumber='+(scope.row.confirmationFileNumber||'')"-->
            <!--:on-change="fileChange"-->
            <!--:on-success="list_data_start"-->
            <!--:headers="headers"-->
            <!--accept=".docx,.xls,.xlsx,.txt,.zip,.doc">-->
            <!--<el-button size="small"-->
            <!--type="text"-->
            <!--style="background: transparent;-->
            <!--font-size: 14px;"-->
            <!--class="editBtn">上传附件</el-button>-->
            <!--</el-upload>-->
            <el-button size="small"
                       type="text"
                       class="btnStyle red"
                       @click="deletes(scope.row.auditConfirmationUuid)"
                       v-if="scope.row.createUserUuid==userInfo.user.id">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column label="最终版扫描件"
                         algin="left">
          <template slot-scope="scope">
            <el-button size="small"
                       type="text"
                       class="btnStyle"
                       style="color: #1371cc">
              <el-upload v-if="scope.row.endConfirmationFile==''||scope.row.endConfirmationFile==null&&(scope.row.createUserUuid==userInfo.user.id)"
                         :show-file-list="false"
                         class="upload-demo inline-block btnStyle"
                         :on-change="fileChange"
                         :action="'/wisdomaudit/auditConfirmation/endFileUpload?auditConfirmationUuid='+scope.row.auditConfirmationUuid"
                         :on-success="list_data_start"
                         :headers="headers"
                         accept=".docx,.xls,.xlsx,.txt,.zip,.doc">
                <el-button size="small"
                           type="text"
                           style="background: transparent;padding:0"
                           class="editBtn">上传</el-button>
              </el-upload>
              <el-tooltip placement="bottom"
                          effect="light"
                          v-if="scope.row.endConfirmationFile">
                <div @click="downFile(scope.row.endConfirmationFileId,scope.row.endConfirmationFile)"
                     class="pointer"
                     slot="content">{{scope.row.endConfirmationFile}}</div>
                <span class="smb-btn"><i class="el-icon-folder-opened list-folder smb-folder"></i>1</span>
              </el-tooltip>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 新增确认单弹出框 -->

    <el-form :rules="rules"
             ref="addForm"
             class="formData"
             label-width="180px"
             :model="formDetail">
      <!--label-width="130px"-->
      <el-dialog class="qrd-dialog"
                 :visible.sync="confirmationDialogVisible"
                 width="70%"
                 @close="handleClose">
        <div class="title">{{confirmationDialogTitle}}</div>

        <el-form-item class="itemTwo"
                      label="审计项目名称:">{{managementProjectName!=''?managementProjectName:'--'}}</el-form-item>
        <el-form-item class="itemTwo"
                      label="被审计单位:">{{auditOrgName!=''?auditOrgName:'--'}}</el-form-item>
        <el-form-item class="itemOne"
                      prop="matter"
                      label="审计（调查）事项:">
          <el-input :disabled="ifLook"
                    type="textarea"
                    v-model="formDetail.matter"></el-input>
        </el-form-item>
        <el-form-item class="itemOne"
                      prop="matterDetail"
                      label="审计(调查)事项描述:">
          <el-button :disabled="ifLook"
                     @click="getRelationQues"
                     class="relationBtn">关联问题</el-button>

          <el-input rows="6"
                    :disabled="ifLook"
                    type="textarea"
                    v-model="formDetail.matterDetail"></el-input>
        </el-form-item>
        <el-form-item prop="auditorsName"
                      class="itemThree"
                      label="审计人员:">
          <el-select :disabled="ifLook"
                     v-model="formDetail.auditorsName"
                     placeholder="请选择"
                     clearable>
            <el-option v-for="(item,index) in sjryList"
                       :label="item.peopleName"
                       :value="item.peopleName"
                       :key="index">
            </el-option>
          </el-select>
          <!--<el-input :disabled="ifLook"-->
          <!--placeholder="请输入"-->
          <!--v-model="formDetail.auditorsName"></el-input>-->
        </el-form-item>
        <el-form-item prop="reviewerName"
                      class="itemThree"
                      label="复核人:">
          <el-select :disabled="ifLook"
                     v-model="formDetail.reviewerName	"
                     placeholder="请选择"
                     clearable>
            <el-option v-for="(item,index) in FhrList"
                       :label="item.realName"
                       :value="item.realName"
                       :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="compileDate"
                      class="itemThree"
                      label="编制日期:">
          <el-date-picker :disabled="ifLook"
                          v-model="formDetail.compileDate"
                          type="date"
                          placeholder="选择日期"
                          format="yyyy-MM-dd"
                          value-format="yyyy-MM-dd"
                          style="width: 100%"></el-date-picker>
        </el-form-item>
        <el-form-item class="itemOne"
                      v-if="confirmationDialogTitle=='编辑确认单'||ifLook"
                      prop="compileDate"
                      label="被审计(调查)单位确认意见:">
          <el-input :disabled="ifLook"
                    type="textarea"
                    v-model="formDetail.auditOrgOpinion"></el-input>
        </el-form-item>
        <!--<el-form-item v-if="confirmationDialogTitle=='编辑确认单'||ifLook"-->
                      <!--class="itemThree"-->
                      <!--label="相关负责人(签名):">-->
          <!--{{formDetail.principalName||'&#45;&#45;'}}-->
          <!--&lt;!&ndash;<el-input disabled&ndash;&gt;-->
          <!--&lt;!&ndash;v-model="formDetail.principalName"></el-input>&ndash;&gt;-->
        <!--</el-form-item>-->
        <!--<el-form-item v-if="confirmationDialogTitle=='编辑确认单'||ifLook"-->
                      <!--class="itemThree"-->
                      <!--label="职务:">-->
          <!--{{formDetail.principalPost||'&#45;&#45;'}}-->
          <!--&lt;!&ndash;<el-input disabled&ndash;&gt;-->
          <!--&lt;!&ndash;v-model="formDetail.principalPost"></el-input>&ndash;&gt;-->
        <!--</el-form-item>-->
        <!--<el-form-item v-if="confirmationDialogTitle=='编辑确认单'||ifLook"-->
                      <!--class="itemThree"-->
                      <!--label="日期:">-->
          <!--{{formDetail.signatureDate||'&#45;&#45;'}}-->
          <!--&lt;!&ndash;<el-input disabled&ndash;&gt;-->
          <!--&lt;!&ndash;v-model="formDetail.signatureDate"></el-input>&ndash;&gt;-->
        <!--</el-form-item>-->
        <el-form-item label="上传附件:"
                      class="upload-yw">
          <el-upload v-if="!ifLook"
                     class="upload-demo"
                     drag
                     action="/wisdomaudit/auditBasy/filesUpload"
                     :on-success="( response, file, fileList)=>{uploadPorgress( response, file, fileList,attachmentList1)}"
                     :on-remove="( file, fileList)=>{handleRemove( file, fileList,attachmentList1,fileList1,fileList1_del)}"
                     multiple
                     :limit="3"
                     :key="key"
                     :on-exceed="handleExceed"
                     :headers="headers"
                     :file-list="fileList1">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              点击上传或将文件拖到虚线框<br />支持.docx .xls .xlsx .txt .zip .doc
            </div>
          </el-upload>
          <div class="inline-block"
               v-if="ifLook">
            <el-tooltip class="item"
                        effect="dark"
                        v-for="(item,index) in fileList1"
                        :key="index"
                        :content="item.fileName"
                        placement="top">
              <div class="blue pointer"
                   @click="downFile(item.attachmentUuid,item.fileName)">
                {{item.fileName.length>20?item.fileName.slice(0,20)+"...":item.fileName}}</div>
            </el-tooltip>
            <!--<div class="blue pointer" v-for="(item,index) in fileList1" :key="index"  @click="downFile(item.attachmentUuid,item.fileName)">-->
            <!--{{item.fileName}}-->
            <!--</div>-->
          </div>
        </el-form-item>
        <span slot="footer"
              class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button v-if="!ifLook"
                     type="primary"
                     :disabled="isDisable"
                     @click="saveForm()"
                     class="subBtn">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog class="qrd-dialog"
                 :visible.sync="confirmationDialogVisibleZx"
                 width="70%"
                 @close="handleClose">
        <div class="title">{{confirmationDialogTitle}}</div>
        <div class="zxTabel-div">
          <table class="zxTabel">
            <tr>
              <td>项目名称</td>
              <td colspan="5">{{formDetail.managementProjectName}}</td>
            </tr>
            <tr>
              <td>被审计(调查)单位</td>
              <td colspan="5">{{formDetail.auditOrgName	}}</td>
            </tr>
            <tr>
              <td>审计(调查)事项</td>
              <td colspan="5">
                <el-input :disabled="ifLook"
                          type="textarea"
                          v-model="formDetail.matter"></el-input>
              </td>
              <!--<td colspan="5">{{formDetail.matter	}}</td>-->
            </tr>
            <tr>
              <td>审计(调查)事项描述</td>
              <td colspan="5">
                <el-input :disabled="ifLook"
                          type="textarea"
                          v-model="formDetail.matterDetail"></el-input>
              </td>
              <!--<td colspan="5">-->
              <!--<div>{{formDetail.matterDetail}}</div>-->
              <!--</td>-->
            </tr>
            <tr>
              <td>审计人员(签名)</td>
              <td width="20%">{{formDetail.auditorsName}}</td>
              <td>复审人(签名)</td>
              <td width="20%">{{formDetail.reviewerName}}</td>
              <td>编制日期</td>
              <td>{{formDetail.compileDate | dateformat}}</td>
            </tr>
            <tr>
              <td>被审计(调查)单位确认意见</td>
              <td colspan="5">
                <el-input :disabled="ifLook"
                          type="textarea"
                          v-model="formDetail.auditOrgOpinion"></el-input>
              </td>
              <!--<td colspan="5">{{formDetail.auditOrgOpinion}}</td>-->
            </tr>
            <tr>
              <td>相关负责人(签名)</td>
              <!--<td><el-input  :disabled="ifLook" v-model="formDetail.principalName"></el-input></td>-->
              <td>{{formDetail.principalName}}</td>
              <td>职务</td>
              <!--<td><el-input  :disabled="ifLook" v-model="formDetail.principalPost"></el-input></td>-->
              <td>{{formDetail.principalPost}}</td>
              <td>日期</td>
              <!--<td><el-input  :disabled="ifLook" v-model="formDetail.signatureDate"></el-input></td>-->
              <td>{{formDetail.signatureDate | dateformat}}</td>
            </tr>
          </table>
        </div>
        <span slot="footer"
              class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button v-if="!ifLook"
                     :disabled="isDisable"
                     type="primary"
                     @click="saveForm"
                     class="subBtn">确 定</el-button>
        </span>
      </el-dialog>
    </el-form>
    <search-list ref="searchTabel"
                 @refreshSearch="getSearchInfo"></search-list>
  </div>
</template>

<script>
import { get_userInfo, projectMembership_listUserInfo, down_file, auditBasy_getFileList, auditConfirmation_pageList, auditConfirmation_save, auditConfirmation_delete, auditConfirmation_getDetail, auditConfirmation_update } from
  '@SDMOBILE/api/shandong/ls'
import { task_pageList_wt } from
  '@SDMOBILE/api/shandong/AuditReport'
import { task_select_people } from
  '@SDMOBILE/api/shandong/task'
import SearchList from "./searchList"
export default {
  components: { SearchList },
  props: ['active_project', 'userRole'],
  data () {
    return {
      key: 0,
      attachmentList1: [],//附件上传列表
      fileList1: [],//附件上传回显列表
      fileList1_del: [],
      headers: {},
      isDisable: false,
      ifLook: false,
      confirmationDialogTitle: '新增确认单',
      confirmaryData: [],
      confirmationDialogVisible: false, //新增确认单弹框
      confirmationDialogVisibleZx: false,//专项确认单编辑
      formDetail: {
        attachmentList: [],
        matter: '',
        matterDetail: '',
        auditorsName: '',
        reviewerName: '',
        compileDate: '',
        auditOrgOpinion: '',
        principalName: '',
        principalPost: '',
        signatureDate: '',
      },//确认单数据
      relationTabel: [],//关联问题
      relationStatus: false,//关联问题显示状态
      multipleSelection: [],//关联问题列表已选

      managementProjectName: '',//审计项目名称
      auditOrgName: '',//被审计单位
      projectType: '',//项目类型 jzsj经责审计  zxsj专项审计
      tableFileList: [],//确认单附件列表
      FhrList: [],//复核人列表
      sjryList: [],//审计人员列表
      userInfo: {
        user: {}
      },//用户信息
      // 新增的表单验证
      rules: {
        matter: [
          { required: true, message: "请填写审计（调查）事项", trigger: "blur" },
        ],
        matterDetail: [
          { required: true, message: "请填写审计（调查）事项描述", trigger: "blur" },
        ],
        auditorsName: [
          { required: true, message: "请填写审计人员", trigger: "blur" },
        ],
        reviewerName: [
          { required: true, message: "请填写复核人", trigger: "blur" },
        ],
        compileDate: [
          { required: true, message: "请填写编制日期", trigger: "blur" },
        ],
      },
    };
  },
  created () {
    this.list_data_start();
    this.getFhrList();
    this.getSjryList();
  },
  mounted () {
    this.headers = { 'TOKEN': sessionStorage.getItem('TOKEN') }
  },
  methods: {
    handleExceed () { },
    //附件上传
    uploadPorgress (response, file, fileList, tableList) {
      if (response && response.code === 0) {
        response.data.isDeleted = 2;
        tableList.push(response.data);
        this.$message({
          message: '上传成功',
          type: 'success',
          duration: 1500,
          onClose: () => {
            // response.data.isDeleted=2;
            // tableList.push(response.data);
          }
        })
      } else {
        this.$message({
          message: '上传失败',
          type: 'error',
          duration: 1500,
          onClose: () => {

          }
        })
      }
    },
    //附件删除
    handleRemove (file, fileList, tableList, showList, delList) {
      if (file.response) {
        tableList.remove(file.response.data);
        // this.key = Math.random();
      } else {
        showList.remove(file);
        file.isDeleted = 1;
        delList.push(file);
        console.log(showList, delList)
      }
    },
    //附件下载
    downFile (id, fileName) {
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
    //获取用户信息
    getUser () {
      var that = this;
      get_userInfo().then(resp => {
        that.userInfo = resp.data;
        that.formDetail.reviewerName = that.userInfo.managementProject.projectChargemanName;
        that.formDetail.auditorsName = this.userInfo.user.realName;
        var sj = new Date().toLocaleDateString().split('/');
        // sj[1]=sj[1]<10?'0'+sj[1]:sj[1];
        sj[1] = sj[1].padStart(2, '0');
        sj[2] = sj[2].padStart(2, '0');
        that.formDetail.compileDate = sj[0] + "-" + sj[1] + "-" + sj[2];
        console.log(that.formDetail.compileDate)
      })
    },
    //复核人列表
    getFhrList () {
      projectMembership_listUserInfo(1, 10000).then(resp => {
        this.FhrList = resp.data.list;
      })
    },
    //审计人员列表
    getSjryList () {
      var params = {
        condition: {
          managementProjectUuid: this.active_project,
        },
        pageNo: 1,
        pageSize: 1000000,
      };
      task_select_people(params).then(resp => {
        this.sjryList = resp.data.records;
      })
    },
    //附件上传时
    fileChange (file, fileList) {
      const loading = this.$loading({
        lock: true,
        text: '上传中',
        spinner: 'el-icon-loading',
        background: 'transparent'
      });
      if (file.response && file.response.code === 0) {
        loading.close();
        this.$message({
          message: '上传成功',
          type: 'success',
          duration: 1500,
          onClose: () => {

          }
        })
      } else if (file.response && file.response.code != 0) {
        loading.close();
        this.$message({
          message: '上传失败',
          type: 'error',
          duration: 1500,
          onClose: () => {

          }
        })
      }
    },
    //附件下载
    downFile (id, fileName) {
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
    //点击确认单附件显示附件列表
    getFileList (id) {
      this.tableFileList = [];
      auditBasy_getFileList(id).then(resp => {
        this.tableFileList = resp.data;
      })
    },
    //删除
    deletes (val) {
      this.$confirm(`确认删除该条数据吗?删除后数据不可恢复`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        auditConfirmation_delete(val).then(resp => {
          if (resp.code == 0) {
            this.$message({
              message: "删除成功",
              type: "success",
            });
            this.list_data_start();
          } else {
            this.$message({
              message: resp.data.msg,
              type: "error",
            });
          }
        });
      }).catch(() => { })

    },
    //编辑
    edit (row) {
      this.clearForm();
      this.isAdd = true;
      this.confirmationDialogTitle = "编辑确认单";
      this.ifLook = false;
      this.getDetail(row);
    },
    getDetail (row) {
      auditConfirmation_getDetail(row.auditConfirmationUuid).then(resp => {
        var datas = resp.data;
        this.formDetail = datas;
        this.confirmationDialogVisible = true;
        if (this.formDetail.auditOrgOpinion.indexOf("情况属实") == -1) {
          this.formDetail.auditOrgOpinion = "情况属实\n" + this.formDetail.auditOrgOpinion
        }
        if (datas.attachmentList) {
          datas.attachmentList.forEach((item) => {
            item.name = item.fileName;
            item.url = item.filePath;
            item.isDeleted = 0;
          });
        }
        this.fileList1 = datas.attachmentList || [];


        // if (this.projectType == 'zxsj') {
        //   this.confirmationDialogVisibleZx = true;
        //   if (this.formDetail.auditOrgOpinion.indexOf("情况属实") == -1) {
        //     this.formDetail.auditOrgOpinion = "情况属实\n" + this.formDetail.auditOrgOpinion
        //   }
        //   // }else if (this.projectType == 'jzsj') {
        // } else {
        //   this.confirmationDialogVisible = true;
        // }
      })
    },
    getLook (row, column, event) {
      this.clearForm();
      this.ifLook = true;
      this.isAdd = true;
      this.confirmationDialogTitle = "查看确认单";
      this.getDetail(row);
    },
    //列表数据
    list_data_start () {
      let params = {
        condition: {
          managementProjectUuid: this.active_project,
        }
      };
      this.loading = true
      auditConfirmation_pageList(params).then(resp => {
        var datas = resp.data;
        this.confirmaryData = datas.dataList;
        this.managementProjectName = datas.managementProjectName;
        this.auditOrgName = datas.auditOrgName;
        this.projectType = datas.projectType;
        this.loading = false;
        this.getUser();
      })
    },
    //   新增确认单按钮事件
    addConfirmation () {
      this.clearForm();
      this.confirmationDialogTitle = "新增确认单";
      this.confirmationDialogVisible = true;
      this.getUser();
      this.ifLook = false;
    },
    // 增加弹出框关闭事件
    handleClose () {
      this.confirmationDialogVisible = false
      this.confirmationDialogVisibleZx = false
    },
    //关联问题点击
    getRelationQues () {
      this.$nextTick(() => {
        this.$refs.searchTabel.init(this.active_project);
      });

    },
    //获取关联的问题
    getSearchInfo (data) {
      this.formDetail.matterDetail = data.str;
      this.formDetail.problemListUuidList = data.problemListUuidList;
      this.formDetail.problemsNumber = data.multipleSelection.length;
    },
    debounce (fn, delay = 300) {   //默认300毫秒
      var timer;
      return function() {
        var args = arguments;
        if(timer) {
          clearTimeout(timer);
        }
        timer = setTimeout(() => {
          fn.apply(this, args);   // this 指向vue
        }, delay);
      };
    },
    //保存审计确认单
    saveForm () {
      this.isDisable = true;
      setTimeout(() => {
        this.isDisable = false;
      }, 3000);
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          var uploadList1 = this.attachmentList1.concat(this.fileList1, this.fileList1_del);
          uploadList1.forEach((item) => {
            item.status = null;
          });
          this.formDetail.attachmentList = uploadList1;

          if (this.confirmationDialogTitle == '新增确认单') {
            this.formDetail.managementProjectName = this.managementProjectName;
            this.formDetail.auditOrgName = this.auditOrgName;
            this.formDetail.managementProjectUuid = this.active_project;
            auditConfirmation_save(this.formDetail).then(resp => {
              if (resp.code == 0) {
                this.$message({
                  message: "保存成功",
                  type: "success",
                });
                this.confirmationDialogVisible = false;
                this.list_data_start();
              } else {
                this.$message({
                  message: resp.data.msg,
                  type: "error",
                });
              }

            })
          } else {
            auditConfirmation_update(this.formDetail).then(resp => {
              if (resp.code == 0) {
                this.$message({
                  message: "修改成功",
                  type: "success",
                });
                this.confirmationDialogVisible = false;
                this.confirmationDialogVisibleZx = false;
                this.list_data_start();
              } else {
                this.$message({
                  message: resp.data.msg,
                  type: "error",
                });
              }

            })
          }
        } else {
          this.$message.error("请添加必填项和正确的数据格式");
          return false;
        }
      });
    },
    clearForm () {
      this.formDetail = {
        attachmentList: [],
        matter: '',
        matterDetail: '',
        auditorsName: '',
        reviewerName: '',
        compileDate: '',
        auditOrgOpinion: '',
        principalName: '',
        principalPost: '',
        signatureDate: '',
      };
      this.attachmentList1 = [];
      this.fileList1 = [];
      this.fileList1_del = [];
      if (this.$refs['addForm']) {
        this.$refs['addForm'].resetFields();
      }

    },
  },
};
</script>

<style lang="scss" scoped>
.min_height {
  min-height: 500px;
}
.confirmaryTable {
  .update {
    display: flex;
    align-items: left;
    justify-content: left;
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
  .btnStyle {
    background: none;
    border: 0px;
    margin: 0 3px;
    font-size: 14px;
  }
}
.title {
  border-bottom: 1px solid #d2d2d2;
  padding: 15px;
  text-align: center;
  font-weight: bold;
  font-size: 14px;
}
.formData {
  // border: 1px solid red;
  padding: 2%;
  .el-button {
    border-color: #ececec;
    color: #9e9e9f;
  }
}
</style>
<style scoped>
@import "../../../assets/styles/css/yw.css";
>>> .qrd-dialog .el-dialog__header,
>>> .qrd-dialog .el-dialog__body {
  padding: 0 !important;
}
>>> .qrd-dialog .el-dialog__headerbtn {
  top: 15px !important;
  right: 15px !important;
}
>>> .qrd-dialog .el-dialog__footer {
  padding-left: 35px !important;
  padding-right: 35px !important;
}
.relationBtn {
  margin-bottom: 10px;
  border-color: #dcdfe6 !important;
}
.list-folder {
  color: orange;
  margin-right: 5px;
}
.smb-folder {
  transform: scale(1.1);
  display: inline-block;
}
.smb-btn {
  font-size: 14px !important;
  color: #666;
  font-weight: normal !important;
}
>>> .list-folder-btn {
  font-weight: normal;
  background: transparent;
  border: none;
  color: blue;
}
.zxTabel-div {
  padding: 20px;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
}
.zxTabel {
  box-sizing: border-box;
  border: 1px solid #ddd;
  width: 100%;
}
.zxTabel > tr:not(:last-child) {
  border-bottom: 1px solid #ddd;
  background: #fff;
}
.zxTabel td {
  padding: 10px;
}
.zxTabel td:not(:last-child) {
  border-right: 1px solid #ddd;
}
.inline-block {
  display: inline-block !important;
}
.blue {
  color: blue;
}
.orange {
  color: orange;
}
>>> .el-form-item {
  margin-bottom: 20px !important;
}
>>> .el-dialog__footer {
  text-align: center;
}
>>> .btnStyle .el-upload {
  width: 100% !important;
  margin: 0 !important;
  text-align: center !important;
}

>>> .itemOne .el-form-item__content {
  width: 77% !important;
}
>>> .itemTwo .el-form-item__content {
  width: 59% !important;
}
>>> .itemThree .el-form-item__label {
  width: 130px !important;
}
>>> .upload-yw .el-form-item__content {
  width: 60% !important;
}
</style>
