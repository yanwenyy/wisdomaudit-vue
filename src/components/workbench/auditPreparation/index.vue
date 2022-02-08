<template>
  <div class="auditConfirmation">
    <div style="float: left;">
      <el-form class="search-form" :inline="true" :model="searchForm" @keyup.enter.native="list_data_start()">
        <!--<el-button type="success" class="addBtn">设置整改跟进人</el-button>-->
        <el-input
          placeholder="请输入"
          v-model="searchForm.projectName"
          class="input-with-select"
        >
          <el-button type="primary" slot="append" icon="el-icon-search" @click="list_data_start"></el-button>
        </el-input>
      </el-form>
    </div>
    <div style="float: right">
      <el-upload
                 class="upload-demo inline-block exportBtn "
                 :on-change="fileChange"
                 :action="'/wisdomaudit/auditConfirmation/endFileUpload?auditConfirmationUuid='"
                 :on-success="list_data_start"
                 :headers="headers"
                 accept=".docx,.xls,.xlsx,.txt,.zip,.doc">
        <el-button type="primary"
                   class="subBtn">导入</el-button>
      </el-upload>

      <el-button type="primary"
                 @click=""
                 class="subBtn">下载模板</el-button>
      <el-button type="primary"
                 @click="addConfirmation()"
                 class="subBtn">新增</el-button>
      <el-button type="primary"
                 @click=""
                 class="subBtn">导出</el-button>
    </div>

    <Vault :vaultV="vaultV"
           :sceneId="sceneId"
           :approvers="approvers"
           :maxTime="maxTime"
           :dqtime="dqtime"
           :account="account"
           :appSessionId="appSessionId"
           @changevault="changevault"
           @vdownload="vdownload"></Vault>

    <!-- 审计确认单列表 -->
    <div class="min_height">
      <el-table @row-dblclick="getLook"
                v-loading="confirmaryData_loding"
                :header-cell-style="{'background-color': '#F4FAFF',}"
                :data="confirmaryData.records"
                style="margin-top: 1%"
                stripe
                class="confirmaryTable">
        <el-table-column algin="left"
                         width="50"
                         type="index"
                         label="序号"></el-table-column>
        <el-table-column algin="left"
                         label="审计事项"
                         prop="matter"></el-table-column>
        <el-table-column algin="left"
                         label="领域"
                         prop="auditorsName"></el-table-column>
        <el-table-column algin="left"
                         label="专题"
                         prop="problemsNumber">
        </el-table-column>
        <el-table-column algin="left"
                         label="关联模型"
                         prop="auditorsName"></el-table-column>
        <el-table-column algin="left"
                         label="抽样原则"
                         prop="auditorsName"></el-table-column>
        <el-table-column algin="left"
                         label="样本量"
                         prop="auditorsName"></el-table-column>
        <el-table-column algin="left"
                         label="责任人"
                         prop="auditorsName"></el-table-column>
        <el-table-column label="操作"
                         algin="left">
          <template slot-scope="scope">
            <el-button size="small"
                       type="text"
                       class="btnStyle editBtn"
                       @click="edit(scope.row,'edit')"
                       v-if="scope.row.createUserUuid==userInfo.user.id">编辑</el-button>
            <!--<el-button size="small"-->
                       <!--type="text"-->
                       <!--class="btnStyle editBtn"-->
                       <!--@click="edit(scope.row,'look')"-->
                       <!--v-if="scope.row.createUserUuid==userInfo.user.id">查看</el-button>-->
            <el-button size="small"
                       type="text"
                       class="btnStyle red"
                       @click="deletes(scope.row.auditConfirmationUuid)"
                       v-if="scope.row.createUserUuid==userInfo.user.id">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="page"
           v-show="this.confirmaryData.total>0">
        <el-pagination @size-change="handleSizeChange_zj"
                       @current-change="handleCurrentChange_zj"
                       :page-size="this.confirmaryData.size"
                       :current-page="this.confirmaryData.current"
                       :total="this.confirmaryData.total"
                       layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>

      </div>
      <!-- 分页 end-->
    </div>

    <!-- 新增确认单弹出框 -->
    <el-form :rules="rules"
             ref="addForm"
             class="formData qrdForm"
             label-width="180px"
             :model="formDetail">

      <el-dialog class="qrd-dialog"
                 :append-to-body='true'
                 :visible.sync="confirmationDialogVisible"
                 width="70%"
                 @close="handleClose('dataForm')">
        <div class="title" style="margin-bottom: 20px">{{confirmationDialogTitle}}</div>
        <el-form-item class="itemTwo"
                      prop="matter"
                      label="审计事项:">
          <el-input :disabled="ifLook"
                    v-model="formDetail.matter"></el-input>
        </el-form-item>
        <div>
          <el-form-item prop="auditorsName"
                        class="itemTwo"
                        label="领域:">
            <el-select :disabled="ifLook"
                       v-model="formDetail.auditorsName"
                       placeholder="请选择"
                       clearable>
              <el-option v-for="(item3,index3) in sjryList"
                         :label="item3.peopleName"
                         :value="item3.peopleName"
                         :key="index3">
              </el-option>
            </el-select>
            <!--<el-input :disabled="ifLook"-->
            <!--placeholder="请输入"-->
            <!--v-model="formDetail.auditorsName"></el-input>-->
          </el-form-item>
          <el-form-item prop="reviewerName"
                        class="itemTwo"
                        label="专题:">
            <el-select :disabled="ifLook"
                       v-model="formDetail.reviewerName	"
                       placeholder="请选择"
                       clearable>
              <el-option v-for="(item_fh,index_fh) in FhrList"
                         :label="item_fh.realName"
                         :value="item_fh.realName"
                         :key="index_fh">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <el-form-item class="itemOne"
                      prop="matter"
                      label="审计内容:">
          <el-input :disabled="ifLook"
                    type="textarea"
                    v-model="formDetail.matter"></el-input>
        </el-form-item>
        <el-form-item class="itemOne"
                      prop="matter"
                      label="审计目的:">
          <el-input :disabled="ifLook"
                    :rows="4"
                    type="textarea"
                    v-model="formDetail.matter"></el-input>
        </el-form-item>
        <el-form-item class="itemTwo"
                      prop="matter"
                      label="抽样原则:">
          <el-input :disabled="ifLook"
                    v-model="formDetail.matter"></el-input>
        </el-form-item>
        <el-form-item class="itemTwo"
                      prop="matter"
                      label="样本量:">
          <el-input :disabled="ifLook"
                    v-model="formDetail.matter"></el-input>
        </el-form-item>
        <el-form-item class="itemOne"
                      prop="matter"
                      label="审计程序:">
          <el-input :disabled="ifLook"
                    type="textarea"
                    :rows="4"
                    v-model="formDetail.matter"></el-input>
        </el-form-item>
        <span slot="footer"
              class="dialog-footer">
          <el-button @click="handleClose()">取 消</el-button>
          <el-button v-if="!ifLook"
                     type="primary"
                     :disabled="isDisable"
                     @click="saveForm('addForm',1)"
                     class="subBtn">确 定</el-button>
        </span>
      </el-dialog>
    </el-form>
  </div>
</template>

<script>
  import axios from "axios";//金库
  import Vault from "@WISDOMAUDIT/components/Vaultcertification";//金库

  import { del_file, get_userInfo, projectMembership_listUserInfo, down_file, auditBasy_getFileList, auditConfirmation_pageList, auditConfirmation_save, auditConfirmation_delete, auditConfirmation_getDetail, auditConfirmation_update, Company } from
      '@SDMOBILE/api/shandong/ls'
  import { task_pageList_query } from
      '@SDMOBILE/api/shandong/AuditReport'
  import { task_select_people } from
      '@SDMOBILE/api/shandong/task'
  import $ from "jquery";
  export default {
    components: {
      Vault//金库
    },
    props: ['active_project', 'userRole'],
    data () {
      return {
        searchForm:{},
        confirmaryData_loding: false,//确认单列表loadng
        vaultV: false,
        sceneId: 1557, //经营指标、模型结果编号:1556 附件上传后下载编号:1557
        approvers: [], //审批人列表
        maxTime: "",//最大时间
        dqtime: "",//当前时间
        account: "",//返回的账户
        appSessionId: "",//应用sessionid
        downloaobj: {},//暂存的下载目标
        dqtoken: '',
        //金库end
        compileDate: false,
        key: 0,
        attachmentList1: [],//附件上传列表
        fileList1: [],//附件上传回显列表
        fileList1_del: [],
        isDisable: false,
        ifLook: false,
        confirmationDialogTitle: '新增审计事项',
        confirmaryData: [],
        confirmationDialogVisible: false, //新增确认单弹框
        // confirmationDialogVisibleZx: false,//专项确认单编辑
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
          fileArr: "",//生成 后的 数组
          fileArrList: "",
          butt: '',//是否 生成2
        },//确认单数据
        fileArr: [],//生成 后的 数组


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
            { required: true, message: "请填写审计（调查）事项描述", trigger: "change" },
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

        success_btn: 0,//上传 ing
        attachmentList2: [],//附件上传列表
        fileList2: [],//附件上传回显列表
        fileList2_del: [],

        selections: [],
        dialogFormVisible: false,
        ifupdata: false,
        dialogDetailVisible: false,
        headers: { "Content-Type": "multipart/form-data" },
        file: "",
        page: {
          current: 1,
          size: 10,
          total: 0
        },

        Index: '',
        type: '',
        // 确认单列表
        params2: {
          pageNo: 1,
          pageSize: 10,
        },


      };
    },
    created () {
      this.dqtoken = sessionStorage.getItem("TOKEN");
      this.list_data_start();
      this.getFhrList();
      this.getSjryList();
      this.getloadcascader("Category");
      this.getloadcascader("SPECIAL");
      this.getSelectTask();
      this.getbasis();//获取依据
      this.getperson();//获取人员
      this.getme();
      let params = {
        entity: {},
      }
      this.Company_data(params); // 被审计单位
    },
    mounted () {
      this.headers = { 'TOKEN': sessionStorage.getItem('TOKEN') }
    },
    methods: {


      // 确认单列表
      handleSizeChange_zj (val) {
        this.params2.pageSize = val
        this.list_data_start()//刷新已完成列表
      },
      // 已完成 分页
      handleCurrentChange_zj (val) {
        this.params2.pageNo = val
        this.list_data_start()//刷新已完成列表
      },
      handleCurrentChange_wt (val) {
        this.params3.pageNo = val
        this.init();
      },
      //金库通过认证后的方法
      vdownload () {

        if (this.downloaobj.dtype == '下载1') {
          this.downFile(this.downloaobj.attachment_uuid, this.downloaobj.file_name)
        } else {
          this.downFile(this.downloaobj.attachmentUuid, this.downloaobj.fileName)
        }
      },
      //金库控制认证弹窗
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
              console.log('芝麻开门')
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
      //获取当前人员信息
      getme () {
        axios({
          url: `/wisdomaudit/init/getCurrentInfo`,
          headers: {
            TOKEN: this.dqtoken,
          },
          method: "get",
          data: {},
        }).then((res) => {

          this.me = res.data.data.user.realName;
          this.userRole = res.data.data.userRole;
        });
      },
      // 查看附件详情
      open_enclosure_details (item) {
        this.enclosure_details_list = [];//清空附件
        if (item) {
          this.enclosure_details_list = item
        }
      },
      // 金额处理
      onlyNumOnePoint (str) {
        let number_only = "";
        if (str == "temp_problem") {
          number_only = this.temp_problem.riskAmount;
        } else {
          number_only = this.dqProblem.riskAmount;
        }
        //先把非数字的都替换掉，除了数字和小数点
        number_only = number_only.replace(/[^\d.]/g, "");
        //必须保证第一个为数字而不是小数点
        number_only = number_only.replace(/^\./g, "");
        //保证只有出现一个小数点而没有多个小数点
        number_only = number_only.replace(/\.{2,}/g, ".");
        //保证小数点只出现一次，而不能出现两次以上
        number_only = number_only
          .replace(".", "$#$")
          .replace(/\./g, "")
          .replace("$#$", ".");
        //保证只能输入两个小数
        number_only = number_only.replace(/^(\-)*(\d+)\.(\d{6}).*$/, "$1$2.$3");
        if (str == "temp_problem") {
          this.temp_problem.riskAmount = number_only;
        } else {
          this.dqProblem.riskAmount = number_only;
        }
      },

      //获取人员
      getperson () {
        axios({
          url: `/wisdomaudit/user/listUserInfo?pageCurrent=1&pageSize=1000`,
          headers: {
            TOKEN: this.dqtoken,
          },
          method: "get",
          data: {},
        }).then((res) => {
          this.personlist = res.data.data.list;

        });
      },
      change_zt (value) {
        let obj = {};
        obj = this.SPECIALList.find((item) => {
          return item.value === value; //筛选出匹配数据
        });
        let val = obj.value;
        this.temp_problem.special = obj.label;
        if (val == "otherzt") {
          this.input_select = false;
          this.temp_problem.special = "";
          this.zdyCode = 1;//自定义标识
        } else {
          this.zdyCode = 0;//自定义标识
        }
      },
      change_zte (value) {

        let obj = {};
        obj = this.SPECIALList.find((item) => {
          return item.value === value; //筛选出匹配数据
        });
        let val = obj.value;
        this.dqProblem.special = obj.label;
        if (val == "otherzt") {
          this.input_selecte = false;
          this.dqProblem.special = "";
          this.zdyCode = 1;//自定义标识
        } else {
          this.zdyCode = 0;//自定义标识
        }
      },

      // 获取专题接口
      getloadcascader (str) {
        axios({
          url: `/wisdomaudit/init/loadcascader`,
          headers: {
            TOKEN: this.dqtoken,
          },
          method: "post",
          data: {
            typecode: str,
          },
        }).then((res) => {
          if (str == "Category") {
            this.CategoryList = res.data.data;
          } else if (str == "SPECIAL") {
            this.SPECIALList = res.data.data;
          }
        });
      },

      // 依据 end==================================================
      getSelectTask () {
        axios({
          url: `/wisdomaudit/auditTask/selectTask`,
          headers: {
            TOKEN: this.dqtoken,
          },
          method: "post",
          data: {
            managementProjectUuid: this.active_project,
          },
        }).then((res) => {
          this.auditTasklList = res.data.data;
        });
      },
      // 编辑
      openDetail (int) {
        this.ifadd = 1;
        this.temp_problem.attachmentList = []; //清空附件
        this.fileList2 = [];//清空附件


        axios({
          url:
          `/wisdomaudit/problemList/getById/` + this.list[int].problemListUuid,
          headers: {
            TOKEN: this.dqtoken,
          },
          method: "get",
          data: {},
        }).then((res) => {


          this.dqProblem = res.data.data;
          this.dqProblem.riskAmount = parseFloat(this.dqProblem.riskAmount)
          this.dqProblem.auditTaskUuid = this.dqProblem.auditTaskUuid.split(",");
          this.dqProblem.basis = this.dqProblem.basis
            ? this.dqProblem.basis.split(",")
            : [];
          this.ifupdata = true;

          if (this.dqProblem.basis.length == 0) {
            this.show = false;
          }

          this.dialogDetailVisible = true;
          this.$nextTick(() => {
            this.$refs["detailForm"].clearValidate();
          });
        });
      },
      checkDetail (pid) {
        this.ifadd = 2;
        axios({
          url: `/wisdomaudit/problemList/getById/` + pid,
          headers: {
            TOKEN: this.dqtoken,
          },
          method: "get",
          data: {},
        }).then((res) => {
          this.dqProblem = res.data.data;
          this.dqProblem.riskAmount = parseFloat(this.dqProblem.riskAmount)
          this.dqProblem.auditTaskUuid = this.dqProblem.auditTaskUuid.split(",");
          this.dqProblem.basis = this.dqProblem.basis
            ? this.dqProblem.basis.split(",")
            : [];
          this.ifupdata = false;
          this.dialogDetailVisible = true;
          this.$nextTick(() => {
            this.$refs["detailForm"].clearValidate();
          });
        });
      },
      repDate (data) {
        let date = new Date(data);
        let Y = date.getFullYear() + "-";
        let M =
          (date.getMonth() + 1 < 10
            ? "0" + (date.getMonth() + 1)
            : date.getMonth() + 1) + "-";
        let D =
          (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
        let h =
          (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
        let m =
          (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
          ":";
        let s =
          date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
        return Y + M + D;
      },
      handleExceed () { },
      // 上传时
      update_ing () {
        this.success_btn = 1;
      },
      //新增问题 附件上传
      uploadPorgress2 (response, file, fileList, tableList) {
        this.success_btn = 0;
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


      //新增问题 附件删除
      handleRemove2 (file, fileList, tableList, showList, delList) {
        if (file.response) {
          tableList.remove(file.response.data);
          // this.key = Math.random();
        } else {
          showList.remove(file);
          file.isDeleted = 1;
          file.attStatus = 3

          delList.push(file);

        }
      },
      //新增问题 附件下载
      downFile2 (id, fileName) {
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

      // 关闭
      close_mose () {
        this.details = false
      },

      // 删除
      del_list (pid) {
        this.$confirm("确认删除该条数据吗?删除后数据不可恢复?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          axios({
            url: `/wisdomaudit/problemList/delete/` + pid,
            headers: {
              TOKEN: this.dqtoken,
            },
            method: "delete",
            data: {},
          }).then((res) => {
            if (res.data.code == 0) {
              this.$message({
                message: "删除成功",
                type: "success",
              });
              this.init();
            }
          });
        });
        let rep = [];
        // for(let i = 0;i<this.problemtableSelection.length;i++){
        //   rep.push(this.problemtableSelection[i].problemListUuid)
        // }
        // rep =  rep.join(",")
      },

      // 删除指定元素
      del_list_img (item) {
        for (let i = 0; i < this.fileArr.length; i++) {
          if (this.fileArr[i] == item) {
            this.fileArr.splice(i, 1)
          }
        }

      },


      // 点击编辑问题弹窗
      //关联问题点击
      getRelationQues () {
        // this.$nextTick(() => {
        //   this.$refs.searchTabel.init(this.active_project);
        // });
        this.init();
        this.details = false;
        this.visible = true;//显示编辑弹窗



      },

      // 初始化
      init () {
        let params = {
          pageNo: this.params3.pageNo,
          pageSize: this.params3.pageSize,
          condition: {
            managementProjectUuid: this.active_project,
            problem: this.searchform.problem
          }
        };
        this.load = true;
        task_pageList_query(params).then(resp => {
          this.load = false;
          let datas = resp.data;
          this.relationTabel2 = datas;
          this.details = false;
          this.visible = true;


        })
      },
      //关联问题多选的时候
      relationTabelSel (row) {
        this.multipleSelection = row
      },
      //生成关联问题
      setRelation () {
        if (this.multipleSelection.length >= 1) {
          var str = '', problemListUuidList = [];
          this.multipleSelection.forEach((item, index) => {
            str += (index + 1) + "." + item.problem + '\n' + "\xa0\xa0\xa0" + item.describe + '\n';
            problemListUuidList.push(item.problemListUuid)
          });
          var data = {
            str: str,
            problemListUuidList: problemListUuidList,
            multipleSelection: this.multipleSelection
          };

          this.formDetail.matterDetail = data.str;
          this.formDetail.problemListUuidList = data.problemListUuidList;
          this.formDetail.problemsNumber = data.multipleSelection.length;

          // 确认的附件
          let datas = [];
          this.multipleSelection.forEach((item, index) => {
            datas.push(item.attachmentList)
          })
          let imglist = [];
          let arr = [];
          datas.forEach((i, index) => {
            if (i.length !== 0) {
              imglist.push(i)
              arr = arr.concat(i)
            }
          })

          this.fileArr = arr;//生成确认的附件


          // if (arr) {
          //   arr.attachmentList.forEach((item) => {
          //     item.name = item.fileName;
          //     item.url = item.filePath;
          //     item.isDeleted = 0;
          //   });
          // }
          // this.fileList2 = datas.attachmentList || [];


          // this.$emit('refreshSearch', data)
        } else {
          this.$message('请至少选择一条数据进行生成');
          return false
        }
        this.visible = false;
        this.details = false;
      },

      //获取关联的问题
      // getSearchInfo (data) {
      //   this.formDetail.matterDetail = data.str;
      //   this.formDetail.problemListUuidList = data.problemListUuidList;
      //   this.formDetail.problemsNumber = data.multipleSelection.length;
      // },


      //分页点击
      handleSizeChange (val) {
        this.searchForm.pageSize = val;
        this.getData();
      },
      handleCurrentChange (val) {
        this.searchForm.pageNo = val;
        this.getData();
      },


      // -------------------------------------------
      // 被审计单位
      Company_data (params) {

        Company(params).then(resp => {
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
          //
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

        })
      },
      //点击确认单附件显示附件列表
      getFileList (id) {
        // alert(11)
        this.tableFileList = [];
        auditBasy_getFileList(id).then(resp => {
          this.tableFileList = resp.data;//确认单附件

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
      edit (row, name) {
        this.clearForm();
        this.fileArr = [];//清空回显附件
        if (name == 'edit') {
          this.confirmationDialogTitle = "编辑";
          this.ifLook = false;

        } else if (name == 'look') {
          this.ifLook = true;
          this.confirmationDialogTitle = "查看确认单";
        }

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
          this.confirmationDialogVisible = true;//显示确认单
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
          this.fileArr = datas.fileArrList;//回显问题附件


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
          pageNo: this.params2.pageNo,
          pageSize: this.params2.pageSize,
          condition: {
            managementProjectUuid: this.active_project,
          }
        };

        this.confirmaryData_loding = true
        auditConfirmation_pageList(params).then(resp => {
          var datas = resp.data;
          this.confirmaryData = true;
          this.confirmaryData = datas.dataList;
          this.managementProjectName = datas.managementProjectName;
          this.auditOrgName = datas.auditOrgName;
          this.projectType = datas.projectType;
          this.confirmaryData_loding = false;
          this.getUser();
        })
      },
      //   新增按钮事件
      addConfirmation () {
        this.clearForm();

        this.fileArr = [];//清空回显附件
        this.getUser();
        this.ifLook = false;
        this.confirmationDialogTitle = "新增审计事项";
        this.confirmationDialogVisible = true;//显示确认单

        // 显示二级部门
        if (this.auditOrgName == '省本部') {
          this.compileDate = true;
        }

      },
      // 增加弹出框关闭事件
      handleClose () {
        // this.$refs[dataForm].resetFields();
        this.dataForm = {};//清空
        this.compileDate = false;//隐藏二级部门
        this.confirmationDialogVisible = false
        // this.confirmationDialogVisibleZx = false
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
      //保存
      saveForm (addForm, types) {
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
            if (this.confirmationDialogTitle == '新增审计事项') {
              this.formDetail.managementProjectName = this.managementProjectName;
              this.formDetail.auditOrgName = this.auditOrgName;
              this.formDetail.managementProjectUuid = this.active_project;
              // let arr = this.fileArr.join(',');
              // let arr = { ...this.fileArr };

              this.formDetail.fileArrList = this.fileArr;//生成 后的 数组
              // 1确认 2生成
              if (types == 1) {
                this.formDetail.butt = ''
              } else {
                this.formDetail.butt = 2
                this.formDetail.auditOrgOpinion = '情况属实\n'
              }
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
              // 1确认 2生成
              if (types == 1) {
                this.formDetail.butt = ''
              } else {
                this.formDetail.butt = 2
                this.formDetail.auditOrgOpinion = '情况属实\n'
              }

              this.formDetail.fileArrList = this.fileArr;//生成 后的 数组

              auditConfirmation_update(this.formDetail).then(resp => {
                if (resp.code == 0) {
                  this.$message({
                    message: "修改成功",
                    type: "success",
                  });
                  this.confirmationDialogVisible = false;
                  // this.confirmationDialogVisibleZx = false;
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

<style >
  .el-popover.popover2 {
    padding: 0 !important;
    transform: translate(-50%, 0%);
    left: 50% !important;
    /* box-shadow: none !important;
    border: none !important;
    background: none !important; */
  }
  .el-popover.popover2[x-placement^="bottom"] .popper__arrow {
    left: 150px !important;
    opacity: 0 !important;
  }
</style>

<style lang="scss" scoped>
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
  >>> .el-table__header {
    margin-top: 0 !important;
  }

  .citebtn {
    margin-left: 15px;
  }
  .dlag_wi >>> .el-dialog {
    min-width: 960px;
  }

  /* 上传的文件列表禁止删除 */
  .upload-demo {
    position: relative;
  }
  .ifLook_upload {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    cursor: not-allowed;
  }
  /* 上传的文件列表禁止删除 */

  /* 分页样式 */
  .page {
    width: 100%;
    padding: 20px 10px;
    display: flex;
    justify-content: flex-end;
  }
  /* 分页样式 end*/
  .one {
    /* display: flex; */
  }
  .one .one_p {
    box-sizing: border-box;
    width: 33%;
    float: left;
  }
  /* 生成后选择的附件 */
  .query_list {
    width: 70%;
    margin-top: 20px;
    margin-bottom: 20px;
    float: left;
  }
  .query_list li {
    width: 100%;
    float: left;
    height: 20px;
    margin-bottom: 5px;
    display: flex;
    align-items: center;
    position: relative;
  }
  .query_list li div {
    position: relative;
    padding: 0 3%;
  }
  .query_list li div i {
    position: absolute;
    left: 2px;
    top: 2px;
  }

  .query_list li p {
    float: left;
    width: 100%;
    height: 20px;
    line-height: 20px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    box-sizing: border-box;
    word-break: break-all;
  }
  .query_list li div,
  .query_list span {
    cursor: pointer;
  }
  .edit span,
  .edit p {
    cursor: pointer;
    color: rgba(0, 0, 0, 0.7) !important;
  }
  .edit span:hover,
  .edit p:hover {
    color: #1890ff !important;
  }
  .look span,
  .look p,
  .look p:hover,
  .look span:hover {
    cursor: not-allowed;
    color: rgba(0, 0, 0, 0.7) !important;
  }
  .query_list span {
    position: absolute;
    top: 0;
    right: 0;
    width: 20px;
    font-size: 14px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    cursor: pointer;
  }
  /* 筛选 */
  .search >>> .el-input__inner::-webkit-input-placeholder {
    color: #c0c4cc !important;
  }
  .search {
    display: flex;
    justify-content: flex-end;
    padding: 20px;
    box-sizing: border-box;
    position: relative;
  }
  .search >>> .el-input__inner {
    width: 250px !important;
    display: flex;
    float: right;
    /* border-radius: 0 !important; */
  }
  .search >>> .el-button {
    /* border-radius: 0 !important; */
  }
  .search >>> .search_icon {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 36px;
    height: 36px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    cursor: pointer;
    border-radius: 0 4px 4px 0;
  }
  /* 筛选  end*/
  /* .edit_table >>> .el-table__row,
  .edit_table >>> table tr,
  .edit_table >>> .el-table__cell,
  .edit_table >>> .has-gutter {
    height: 40px;
    max-height: 40px;
  } */
  /* .dlag >>> .el-table__header-wrapper .has-gutter {
    border: 1px solid red;
    padding: 3px 0 !important;
  } */
  .edit_table >>> .el-dialog {
    min-width: 800px;
  }
  .edit_table >>> .el-table__row td {
    padding: 3px 0 !important;
    /* border: 1px solid blue; */
    box-sizing: border-box;
  }

  /* 问题详情框 */
  .mose {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 9998;
  }
  .dlag {
    position: relative;
  }
  .problem_details_conter {
    width: 100%;
    /* position: absolute; */
    /* top: 90px; */
    /* left: 0; */
    /* padding: 0 20px; */
    box-sizing: border-box;
    /* z-index: 100;
    border: 1px solid red; */
    float: right;
  }
  .problem_details_conter .list {
    margin: 0 auto;
    width: 100%;
    padding: 20px 0 20px 20px;
    box-sizing: border-box;
    background: #f5f5f9;
    display: flex;
    flex-wrap: wrap;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    height: 250px;
    /* overflow-y: auto; */
    overflow-y: scroll;
    overflow-x: hidden;
  }
  .list li {
    float: left;
    width: 100%;
    margin-bottom: 20px;
    text-align: left;
    line-height: 20px;
    box-sizing: border-box;
    color: rgba(0, 0, 0, 0.8);
  }
  .list li:last-child {
    margin-bottom: 0;
  }
  .list li p {
    /* width: 33%;
    float: left; */
    text-align: left;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    display: inline-block;
    width: calc(100% - 130px);
    line-height: 20px;
  }
  .list li .sp {
    /* width: 130px; */
    text-align: right;
  }
  .list li p span {
    font-weight: 500;
  }
  /* 问题详情框 end*/

  /* 编辑   */
  .edit_table >>> .zb-form .el-form-item {
    margin-bottom: 10px !important;
  }
  .edit_table >>> .zb-form .el-form-item__content {
    width: 30%;
    display: inline-block;
  }
  .edit_table >>> .zb-form .el-form-item__label {
    width: 20% !important;
    text-align: right !important;
    display: inline-block;
  }
  .relation-div-footer {
    margin-top: 10px;
    text-align: center;
  }
  .edit_table >>> .relation-div-footer button {
    margin-left: 10px;
  }
  .relation-div {
    width: 100%;
    padding: 10px;
    margin-top: 10px;
  }
  .edit_table >>> .relationTabelClass label {
    width: auto !important;
  }
  .edit_table >>> .relation-div-search .el-form-item__content {
    position: static !important;
  }
  .relation-div-search {
    text-align: right;
    clear: both;
  }
  .searchBtn button {
    background: #0089d6 !important;
    color: #fff !important;
  }
  .edit_table >>> .searchBtn .el-input-group__append {
    border: none !important;
  }
  /* 编辑  end */

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
  >>>.exportBtn .el-upload {
    width: 100% !important;
    margin-right:20px !important;
    text-align: center !important;
  }
  .min_height::before{
    display: table;
    content: '';
  }
  .min_height{
    clear: both;
    margin-top: 10px;
  }
  >>> .itemOne .el-form-item__content {
    width: 77% !important;
  }
  .itemOne .el-select,
  .itemOne .el-textarea {
    width: 70% !important;
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
    width: 53% !important;
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

  /* 依据 */
  .yj-sel >>> .el-select__tags > span,
  .task >>> .el-select__tags > span {
    width: 100%;
    display: block !important;
  }
  .yj-sel >>> .el-tag--info,
  .task >>> .el-tag--info {
    float: left;
  }
  .yj-sel >>> .el-tree-node__children {
    overflow: hide !important;
  }
  >>> .el-tree-node__label {
    overflow: hidden;
    text-overflow: ellipsis;
    box-sizing: border-box;
    word-break: break-all;
    white-space: normal !important;
    height: 16px;
    font-size: 14px;
    line-height: 16px;
  }
  >>> .tree {
    background: #f2f2f2 !important;
  }
  >>> .el-tree-node__content {
    cursor: pointer;
    height: 24px !important;
    padding-right: 10px;
    box-sizing: border-box;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    box-sizing: border-box;
    word-break: break-all;
  }
  .bag >>> .el-textarea__inner,
  .bag >>> .el-textarea__inner:focus {
    border: 1px solid #dfe4ed !important;
    color: rgba(0, 0, 0, 0.25) !important;
    /* color: #606266 !important; */
    background: #f5f7fa !important;
    cursor: not-allowed;
  }
  >>>.el-textarea.is-disabled .el-textarea__inner{
    color: #606266 !important;
  }
</style>
