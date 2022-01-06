  <template>
  <div class="auditConfirmation">
    <Vault :vaultV="vaultV"
           :sceneId="sceneId"
           :approvers="approvers"
           :maxTime="maxTime"
           :dqtime="dqtime"
           :account="account"
           :appSessionId="appSessionId"
           @changevault="changevault"
           @vdownload="vdownload"></Vault>

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
                         width="50"
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
            <p style="color:#4084F2">{{scope.row.problemsNumber?scope.row.problemsNumber:'--'}}</p>

          </template>
        </el-table-column>
        <el-table-column algin="left"
                         label="确认单">
          <template slot-scope="scope">
            <el-popover :popper-class="tableFileList==''?'no-padding':''"
                        placement="bottom"
                        width="250"
                        v-if="scope.row.attachmentFileCounts"
                        @show="getFileList(scope.row.auditConfirmationUuid)"
                        trigger="click">
              <ul v-if="tableFileList!=''"
                  class="fileList-ul">
                <li class="tableFileList-title">文件名称</li>
                <li v-for="item in tableFileList"
                    class="pointer blue"
                    @click="openVault(item,'下载1')">{{item.file_name}}</li>
              </ul>
              <div slot="reference"
                   class="pointer"
                   style="color:#4084F2"><i
                   class="el-icon-folder-opened list-folder"></i>{{scope.row.attachmentFileCounts}}
              </div>
            </el-popover>
            <p v-else>--</p>
          </template>
        </el-table-column>
        <el-table-column algin="left"
                         label="附件">
          <template slot-scope="scope">
            <el-popover :popper-class="tableFileList==''?'no-padding':''"
                        placement="bottom"
                        width="250"
                        @show="getFileList('f'+scope.row.auditConfirmationUuid)"
                        v-if="scope.row.fileCounts"
                        trigger="click">
              <ul v-if="tableFileList!=''"
                  class="fileList-ul">
                <li class="tableFileList-title">文件名称</li>
                <li v-for="item in tableFileList"
                    class="pointer blue tableFileList-li"
                    @click="openVault(item,'下载1')">
                  <div class="inline-block">{{item.file_name}}</div><span class="delFile inline-block"
                        @click.stop="delListFile(item.attachment_uuid)">X</span>
                </li>
              </ul>
              <div slot="reference"
                   class="pointer"
                   style="color:#4084F2"><i class="el-icon-folder-opened list-folder"></i>{{scope.row.fileCounts}}
              </div>
            </el-popover>
            <p v-else>--</p>
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

            <el-popover style="margin-right: 20px"
                        class="inline-block"
                        placement="bottom"
                        width="250"
                        @show="getFileList('z'+scope.row.auditConfirmationUuid)"
                        trigger="click"
                        v-if="scope.row.endFileCounts!==0">
              <ul v-if="tableFileList!=''"
                  class="fileList-ul">
                <li class="tableFileList-title">文件名称</li>
                <li v-for="item in tableFileList"
                    class="pointer blue tableFileList-li"
                    @click="openVault(item,'下载1')">
                  <div class="inline-block">{{item.file_name}}</div><span class="delFile inline-block"
                        @click.stop="delListFile(item.attachment_uuid)">X</span>
                </li>
              </ul>
              <div slot="reference"
                   class="pointer"
                   style="color:#4084F2"><i class="el-icon-folder-opened list-folder"></i>{{scope.row.endFileCounts}}
              </div>
            </el-popover>
            <!--<el-upload v-if="scope.row.endConfirmationFile==''||scope.row.endConfirmationFile==null&&(scope.row.createUserUuid==userInfo.user.id)"-->
            <el-upload :show-file-list="false"
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
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 新增确认单弹出框 -->
    <el-form :rules="rules"
             ref="addForm"
             class="formData qrdForm"
             label-width="180px"
             :model="formDetail">
      <!--label-width="130px"-->
      <el-dialog class="qrd-dialog"
                 :append-to-body='true'
                 :visible.sync="confirmationDialogVisible"
                 width="70%"
                 @close="handleClose">
        <div class="title">{{confirmationDialogTitle}}</div>

        <el-form-item class="itemTwo"
                      label="审计项目名称:">{{managementProjectName!=''?managementProjectName:'--'}}</el-form-item>
        <el-form-item class="itemTwo"
                      label="被审计单位:">{{auditOrgName!=''?auditOrgName:'--'}}</el-form-item>
        <!-- 二级部门 -->
        <el-form-item class="itemTwo"
                      v-if="compileDate ==true"
                      label="二级部门:">
          <el-select :disabled="ifLook"
                     @change="select_Company"
                     v-model="formDetail.auditDepart"
                     placeholder="请选择二级部门"
                     clearable>
            <el-option v-for="(item,index) in Company_data_list"
                       :label="item.orgName"
                       :value="item.auditOrgUuid"
                       :key="index">
            </el-option>
          </el-select>
        </el-form-item>

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
          <!-- <el-button :disabled="ifLook"
                      @click="getRelationQues"
                      class="relationBtn">编辑问题</el-button> -->

          <el-input rows="6"
                    :disabled="ifLook"
                    type="textarea"
                    v-model="formDetail.matterDetail"></el-input>
        </el-form-item>
        <el-form-item prop="auditorsName"
                      class="itemTwo"
                      label="审计人员:">
          <el-select :disabled="ifLook"
                     v-model="formDetail.auditorsName"
                     placeholder="请选择审计人员"
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
                      class="itemTwo"
                      label="复核人:">
          <el-select :disabled="ifLook"
                     v-model="formDetail.reviewerName	"
                     placeholder="请选择复核人"
                     clearable>
            <el-option v-for="(item,index) in FhrList"
                       :label="item.realName"
                       :value="item.realName"
                       :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="compileDate"
                      class="itemTwo"
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
                   @click="openVault(item,'下载2')">
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
                 :append-to-body='true'
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
import axios from "axios";
import Vault from "@WISDOMAUDIT/components/Vaultcertification";
import { del_file, get_userInfo, projectMembership_listUserInfo, down_file, auditBasy_getFileList, auditConfirmation_pageList, auditConfirmation_save, auditConfirmation_delete, auditConfirmation_getDetail, auditConfirmation_update, Company } from
  '@SDMOBILE/api/shandong/ls'
import { task_pageList_wt } from
  '@SDMOBILE/api/shandong/AuditReport'
import { task_select_people } from
  '@SDMOBILE/api/shandong/task'
import SearchList from "./searchList"
export default {
  components: { SearchList,Vault },
  props: ['active_project', 'userRole'],
  data () {
    return {
      vaultV: false,
      sceneId: 1557, //经营指标、模型结果编号:1556 附件上传后下载编号:1557
      approvers: [], //审批人列表
      maxTime: "",//最大时间
      dqtime: "",//当前时间
      account: "",//返回的账户
      appSessionId: "",//应用sessionid
      downloaobj: {},//暂存的下载目标
      dqtoken:'',

      compileDate: false,
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
        auditDepart: '',//被审计部门
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
      // 被审计机构
      Company_data_list: [],

    };
  },
  created () {
    this.dqtoken = sessionStorage.getItem('TOKEN')
    this.list_data_start();
    this.getFhrList();
    this.getSjryList();

    let params = {
      entity: {},
    }
    this.Company_data(params); // 被审计单位
  },
  mounted () {
    this.headers = { 'TOKEN': sessionStorage.getItem('TOKEN') }
  },
  methods: {
    //通过认证后的方法
    vdownload () {
      console.log(this.downloaobj.dtype)
      if(this.downloaobj.dtype=='下载1'){
        this.downFile(this.downloaobj.attachment_uuid, this.downloaobj.file_name)
      }else{
        this.downFile(this.downloaobj.attachmentUuid,this.downloaobj.fileName)
      }
    },
    //控制认证弹窗
    changevault (val) {
      this.vaultV = val;
    },
    //打开金库
    openVault (obj,downtype) {
      console.log("芝麻开门")
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
          sensitiveOperate: "export", //敏感操作对应的编号：export： 导出   select：查询
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
            // this.$message(rep.resultDesc);
            this.vdownload()
            return;
          } else {
            console.log(rep);
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

    // 被审计单位
    Company_data (params) {
      console.log(params);
      Company(params).then(resp => {
        console.log(resp.data);
        this.Company_data_list = resp.data
      })
    },
    select_Company (val) {
      this.formDetail.auditDepart = val;
    },
    //列表附件删除
    delListFile (id) {
      var that = this;
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        del_file(id).then(resp => {
          if (resp.code == 0) {
            that.$message({
              message: "删除成功",
              type: "success",
            });
            this.list_data_start();
          } else {
            that.$message({
              message: resp.data.msg,
              type: "error",
            });
          }
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });


    },
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

        // sj[1]=sj[1]<10?'0'+sj[1]:sj[1];

        if (!!window.ActiveXObject || "ActiveXObject" in window) {
          var sj = new Date().toLocaleDateString()
          sj = sj.replace(/(年|月)/g, '/').replace('日', '').replace(/[^\d-/]/g, '').split('/');
          sj[1] = sj[1] < 10 ? '0' + sj[1] : sj[1];
          sj[2] = sj[2] < 10 ? '0' + sj[2] : sj[2];
        } else {
          var sj = new Date().toLocaleDateString().split('/');
          sj[1] = sj[1].padStart(2, '0');
          sj[2] = sj[2].padStart(2, '0');
        }
        that.formDetail.compileDate = sj[0] + "-" + sj[1] + "-" + sj[2];
        // console.log(that.formDetail.compileDate)
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

      // 显示二级部门
      if (this.auditOrgName == '省本部') {
        this.compileDate = true;
      }


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

      // 显示二级部门
      if (this.auditOrgName == '省本部') {
        this.compileDate = true;
      }


    },
    // 增加弹出框关闭事件
    handleClose () {
      this.compileDate = false;//隐藏二级部门
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
      return function () {
        var args = arguments;
        if (timer) {
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
            console.log(this.formDetail);
            console.log(this.formDetail.auditDepart);

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
  /*padding: 2%;*/
  .el-button {
    border-color: #ececec;
    color: #9e9e9f;
  }
}
</style>
  <style scoped>
@import "../../../assets/styles/css/yw.css";
.qrd-dialog >>> .el-dialog__header,
.qrd-dialog >>> .el-dialog__body {
  padding: 0 !important;
}
.qrd-dialog >>> .el-dialog__headerbtn {
  top: 15px !important;
  right: 15px !important;
}
.qrd-dialog >>> .el-dialog__footer {
  padding-left: 35px !important;
  padding-right: 35px !important;
}
.relationBtn {
  margin-bottom: 10px;
  border-color: #dcdfe6 !important;
  display: block;
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
>>> .itemThree .el-form-item__content {
  margin-left: 140px !important;
}
.itemTwo {
  width: 48.5%;
}
.itemTwo .el-select {
  width: 100% !important;
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
.tableFileList-li > div {
  width: 85%;
  vertical-align: middle;
}
.delFile {
  width: 15%;
  text-align: right;
  vertical-align: middle;
  font-weight: bold;
}
</style>
