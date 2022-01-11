<template>
  <div class="report anmition_show">
    <Vault :vaultV="vaultV"
           :sceneId="sceneId"
           :approvers="approvers"
           :maxTime="maxTime"
           :dqtime="dqtime"
           :account="account"
           :appSessionId="appSessionId"
           @changevault="changevault"
           @vdownload="vdownload"></Vault>
    <div class="header">
      <el-col :span="12">
        <p>审计项目 ：{{file_list.projectName}}</p>
      </el-col>
      <el-col :span="12">
        <p>被审计单位：{{file_list.auditOrgName}}</p>
      </el-col>
    </div>

    <div class="conter">
      <!-- 经营评价：  -->
      <div class="top">
        <el-row>
          <el-col>
            <p>经营评价：</p>
            <el-button plain
                       v-if="userRole==1||isLiaison==1"
                       @click="Correlation_zb()">关联指标</el-button>

          </el-col>

          <div class="text">
            <!-- <el-input type="textarea"
                      resize="none"
                      v-model="administrativeAdvice">
            </el-input> -->
            <quill-editor ref="text"
                          :options="editorOption"
                          v-model="administrativeAdvice"
                          class="myQuillEditor" />

          </div>

        </el-row>

      </div>

      <!-- 管理建议： -->
      <div class="top">
        <el-row>
          <el-col>
            <p>管理建议：</p>
            <el-button plain
                       v-if="userRole==1||isLiaison==1 "
                       @click="Correlation_wt()">关联确认单</el-button>
          </el-col>

          <div class="text">
            <quill-editor ref="text"
                          :options="editorOption"
                          v-model="businessEvaluation"
                          class="myQuillEditor" />

            <!-- <el-input type="textarea"
                      resize="none"
                      v-model="businessEvaluation">
            </el-input> -->
          </div>

        </el-row>

      </div>

      <div class="bottom">
        <span slot="footer">
          <!-- <el-button size="small"
                     @click="dlag_Correlation_zb = false">
            取消</el-button> -->
          <el-button size="small"
                     type="primary"
                     v-if="(userRole==1||isLiaison==1) && success_btn==0"
                     :disabled="isDisable"
                     @click="query_report()">生成报告</el-button>
          <el-button type="primary"
                     v-if="(userRole==1||isLiaison==1)  && success_btn==1"
                     :loading="true">生成中</el-button>
        </span>
        <div class="flex_end"
             v-if="file_list">
          <p style="padding-top:10px;color:#606266">附件：</p>

          <ul v-if="file_list.attachmentList &&file_list.attachmentList.length!==0">
            <li v-for="(item,index) in file_list.attachmentList"
                :key="index">
              <p class="fileName_show"
                 @click="openVault(item)">{{item.fileName}}</p>
              <span style="color:#606266">版本1.0</span><span style="color:#606266">时间{{item.createTime|filtedate
}}</span>
              <el-button type="text"
                         plain
                         style="color:#ff8a72!important;
                                 font-size: 14px "
                         v-if="userRole==1||isLiaison==1"
                         @click="remove_list(item.attachmentUuid)">删除</el-button>
            </li>
          </ul>
          <div style="font-size: 14px;margin-top: 10px"
               v-else>暂无...</div>

        </div>
      </div>

    </div>

    <!-- 关联指标 -->
    <el-dialog width="60%"
               center
               @close='closeDialog'
               :append-to-body='true'
               popper-class="status_data_dlag_verify"
               :visible.sync="dlag_Correlation_zb"
               style="padding-bottom: 59px">
      <div class="title_dlag">关联指标</div>

      <div class="dlag_conter3">
        <!--自建任务 模型任务 筛选 -->
        <div class="search">
          <el-input placeholder="请输入指标类型名称"
                    v-model="search_zb_name"> </el-input>
          <div class="search_icon"
               style=" background: rgb(12, 135, 214) !important;"
               @click="search_list(1)">
            <i class="el-icon-search"
               style="color: white;   "></i>
          </div>
        </div>
        <!-- 表单 -->
        <el-table :data="correlation"
                  ref="multipleTable"
                  tooltip-effect="dark"
                  v-loading="loading"
                  style="width: 100%"
                  :header-cell-style="{'background-color': '#F4FAFF',}"
                  @selection-change="handleSelectionChange_zb">
          >
          <el-table-column type="selection"
                           width="55">
          </el-table-column>
          <el-table-column prop="indexTypeName"
                           label="指标类型">

            <template slot-scope="scope">
              <p v-if="scope.row.indexTypeName">{{scope.row.indexTypeName}}</p>
              <p v-else>--</p>
            </template>

          </el-table-column>
          <el-table-column prop="indexName"
                           label="指标名称">

            <template slot-scope="scope">
              <p v-if="scope.row.indexName">{{scope.row.indexName}}</p>
              <p v-else>--</p>
            </template>

          </el-table-column>
          <!-- <el-table-column prop="accessCaliberName"
                           show-overflow-tooltip
                           label="依据">
            <template slot-scope="scope">
              <span v-if="scope.row.accessCaliberName">{{scope.row.accessCaliberName}}</span>
              <span v-else>--</span>
            </template>
          </el-table-column> -->

          <el-table-column prop="indexUnitName"
                           label="单位">

            <template slot-scope="scope">
              <p v-if="scope.row.indexUnitName">{{scope.row.indexUnitName}}</p>
              <p v-else>--</p>
            </template>

          </el-table-column>

          <el-table-column prop="dataProvideDepartmentName"
                           label="资料提供部门">

            <template slot-scope="scope">
              <p v-if="scope.row.dataProvideDepartmentName">{{scope.row.dataProvideDepartmentName}}</p>
              <p v-else>--</p>
            </template>

          </el-table-column>
          <el-table-column prop="indexDate"
                           label="指标值期间">

            <template slot-scope="scope">
              <p v-if="scope.row.indexDate">{{scope.row.indexDate}}</p>
              <p v-else>--</p>
            </template>

          </el-table-column>

          <el-table-column prop="indexValue"
                           label="指标值">
            <template slot-scope="scope">
              <p v-if="scope.row.indexValue">{{scope.row.indexValue}}</p>
              <p v-else>--</p>
            </template>

          </el-table-column>
        </el-table>

        <span slot="footer"
              class="foot">
          <!-- <el-button size="small"
                     @click="">
            取消</el-button> -->
          <el-button size="small"
                     type="primary"
                     @click="query_save_zb()">确定</el-button>
        </span>
      </div>
    </el-dialog>

    <!-- 关联确认单列表 -->
    <el-dialog width="60%"
               center
               @close='closeDialog'
               popper-class="status_data_dlag_verify"
               :visible.sync="dlag_Correlation_wt"
               style="padding-bottom: 59px">

      <div class="title_dlag">确认单列表</div>

      <div class="dlag_conter3">
        <div class="search">
          <el-input placeholder="请输入确认单名称"
                    v-model="search_jy_name"> </el-input>
          <div class="search_icon"
               style=" background: rgb(12, 135, 214) !important;"
               @click="search_list(2)">
            <i class="el-icon-search"
               style="color: white;"></i>
          </div>
        </div>
        <div class="dlag">
          <!-- 表单 -->
          <el-table :data="tableData2_list"
                    ref="multipleTable"
                    tooltip-effect="dark"
                    v-loading="loading_card"
                    style="width: 100%"
                    :header-cell-style="{'background-color': '#F4FAFF',}"
                    @selection-change="handleSelectionChange_wt">
            <el-table-column type="selection"
                             width="55">
            </el-table-column>
            <el-table-column type="index"
                             width="100"
                             align="center"
                             label="序号">
            </el-table-column>
            <el-table-column prop="matter"
                             align="center"
                             show-overflow-tooltip
                             label="审计（调查）事项">
            </el-table-column>

            <el-table-column prop="problemsNumber"
                             width="100"
                             align="center"
                             show-overflow-tooltip
                             label="问题数">

            </el-table-column>
            <el-table-column prop="matterDetail"
                             show-overflow-tooltip
                             align="center"
                             label="审计（调查）事项描述">
              <template slot-scope="scope">
                <span v-if="scope.row.matter">
                  {{scope.row.matterDetail}}
                </span>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column prop="matter"
                             align="center"
                             show-overflow-tooltip
                             label="审计人员">
              <template slot-scope="scope">
                <span v-if="scope.row.matter">{{scope.row.matter}}</span>
                <span v-else>--</span>
              </template>
            </el-table-column>
          </el-table>
          <!-- <div class="mose"
               @click="close_mose"
               v-if="details == true"></div> -->

          <!-- 详情 -->
          <!-- <div class="problem_details_conter"
               :style="{'top':details_list.style_top}"
               v-if="details == true">
            <ul class="list">
              <li>
                问题：{{details_list.problem}}
              </li>
              <li>
                依据：{{details_list.basis}}
              </li>
              <li>
                描述：{{details_list.describe}}
              </li>
              <li>
                管理建议：{{details_list.managementAdvice}}
              </li>

            </ul>
          </div> -->
          <!-- 详情 end-->

        </div>

        <span slot="footer"
              class="foot">

          <el-button size="small"
                     @click="dlag_Correlation_wt = false">
            取消</el-button>
          <el-button size="small"
                     type="primary"
                     @click="query_save_wt()">确定</el-button>
        </span>
      </div>

    </el-dialog>

  </div>
</template>

<script>
import axios from "axios";
import Vault from "@WISDOMAUDIT/components/Vaultcertification";
// 富文本框
import { quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 富文本框end
import { down_file } from
  '@SDMOBILE/api/shandong/ls'
import { operatingIndicators_list, task_pageList_wt, task_pageList_export, export_selectFile, file_remove_list, queryAllProblemList } from '@SDMOBILE/api/shandong/AuditReport'
import { fmtDate } from '@SDMOBILE/model/time.js';

export default {
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
      dqtoken: "",

      isDisable: false,//防止重复提交

      file_list: [],//附件
      search_zb_name: '',//指标筛选
      search_jy_name: '',//管理建议

      loading: false,
      dlag_Correlation_zb: false,//添加关联指标
      dlag_Correlation_wt: false,//添加关联问题

      multipleSelection: [],//指标多选
      multipleSelection2: [],//问题多选
      correlation: [],//关联指标数据


      administrativeAdvice: '',//管理建议
      businessEvaluation: '',//经营评价
      // 模糊查询
      query: {
        problem: '',//模糊查询
      },
      tableData2: [],//关联问题
      tableData2_list: [],//关联问题 list
      wt_listl: [],//问题 选择
      success_btn: 0,//文件上传完成


      // 富文本
      editorOption: {
        modules: {
          clipboard: {
            // 粘贴版，处理粘贴时候带图片
            matchers: [[Node.ELEMENT_NODE, this.handleCustomMatcher]],
          },
          toolbar: 'title'
        },
        placeholder: "请在这里输入",
      },
      details: false,//悬浮问题 背景
      Index: '',
      style_px: 40,//悬浮定位
      details_list: [],//悬浮数据
      loading_card: false,
    }
  },
  props: ['active_project', 'userRole', 'isLiaison'],

  computed: {},
  watch: {},
  created () {
    this.dqtoken = sessionStorage.getItem("TOKEN");
    this.export_selectFile_data()//附件
  },
  mounted () {

  },
  components: {
    quillEditor, Vault
  },
  filters: {
    filtedate: function (date) {
      let t = new Date(date);
      return fmtDate(t, 'yyyy-MM-dd ');
    },

    ellipsis (value, limit) {
      if (!value) return ''
      if (value.length > limit) {
        return value.slice(0, limit) + '...'
      }
      return value
    },
  },

  watch: {
    value (n) {
      this.content = n;
    },
    content (n) {
      this.$emit("input", n);
    },
  },
  methods: {
    //通过认证后的方法
    vdownload () {
      this.download_click(this.downloaobj.attachmentUuid, this.downloaobj.fileName)
    },
    //控制认证弹窗
    changevault (val) {
      this.vaultV = val;
    },
    //打开金库
    openVault (obj) {
      console.log("芝麻开门")
      this.downloaobj = obj
      axios({
        method: "post",
        url: `/wisdomaudit/treasury/getTreasuryStatus`,
        headers: {
          TOKEN: this.dqtoken,
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
            this.$message('因金库未开启或服务异常，文件下载失败，请联系系统管理员。');
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

    // 显示详情
    details_show (data, index) {
      this.Index = index
      this.details = true
      this.details_list = data;
      if (index == 0) {
        this.$set(this.details_list, 'style_top', '223px')//问题
      } else {
        let top_px = (this.style_px * index + 180) + 'px'
        this.$set(this.details_list, 'style_top', top_px)//问题
      }
    },
    // 关闭
    close_mose () {
      this.details = false
    },
    handleCustomMatcher (node, Delta) {
      let ops = []
      Delta.ops.forEach(op => {
        if (op.insert && typeof op.insert === 'string') {// 如果粘贴了图片，这里会是一个对象，所以可以这样处理
          ops.push({
            insert: op.insert,
          })
        }
      })
      Delta.ops = ops
      return Delta
    },

    // 公用筛选
    search_list (index) {
      if (index == 1) {
        let params = {
          managementProjectUuid: this.active_project,//项目id
          indexTypeName: this.search_zb_name,//筛选名称
        }
        this.correlation_index(params)// 关联指标

      } else {
        let params = {
          condition: {
            managementProjectUuid: this.active_project,//项目id
            matter: this.search_jy_name,//模糊查询
          },
        }
        this.correlation_problem(params)
      }
    },
    //公用关闭
    closeDialog () {
      this.search_zb_name = '';
      this.search_jy_name = '';
    },
    // 附件 以及默认显示
    export_selectFile_data () {
      let params = {
        id: this.active_project,//项目id
      }
      export_selectFile(params).then(resp => {
        this.file_list = resp.data;
        // console.log(11)
      })
    },

    // 添加关联指标
    Correlation_zb () {
      let params = {
        managementProjectUuid: this.active_project,//项目id
        indexTypeName: this.search_zb_name,//筛选名称
      }
      this.dlag_Correlation_zb = true;//添加关联指标
      this.correlation_index(params)// 关联指标
    },
    // 关联指标
    correlation_index (params) {
      this.loading = true;
      operatingIndicators_list(params).then(resp => {
        this.correlation = resp.data;
        this.loading = false;
      })
    },
    // 指标多选
    handleSelectionChange_zb (val) {
      this.multipleSelection = val;
    },
    // 指标确认保存
    query_save_zb () {
      if (this.multipleSelection.length == 0) {
        this.$message.info("至少关联一条数据！");
        return false;
      }
      let array1 = [];//数组1
      this.multipleSelection.forEach((item, i) => {
        array1.push((i + 1) + '.' + item.indexDate + ','
          + item.indexTypeName + ','
          + item.dataProvideDepartmentName + ','
          // + item.accessCaliberName + ','
          + item.indexValue + item.indexUnitName + '</br>' + '</br>');
      });
      let array_list = array1.join('')
      // var array_list = array1.toString();  //把数组转换为字符串
      console.log(array_list);
      this.administrativeAdvice = array_list;
      this.dlag_Correlation_zb = false;//关闭弹窗
    },
    // 添加关联问题====================================
    Correlation_wt () {
      // let params = {
      //   condition: {
      //     managementProjectUuid: this.active_project,//项目id
      //     problem: this.query.problem,//模糊查询
      //     status: '1',
      //   },
      // }
      let params = {
        condition: {
          managementProjectUuid: this.active_project,
          matter: this.search_jy_name,//模糊查询

        }
      };

      this.correlation_problem(params)
      this.dlag_Correlation_wt = true;//添加关联问题

    },
    // 缺认单列表
    correlation_problem (params) {
      this.loading_card = true;
      task_pageList_wt(params).then(resp => {
        this.loading_card = false;
        this.tableData2 = resp.data;
        this.tableData2_list = resp.data.dataList;
        console.log(this.tableData2_list);
      })
    },
    // 问题多选
    handleSelectionChange_wt (val) {
      this.multipleSelection2 = val;
    },



    // 确认单保存
    query_save_wt () {
      if (this.multipleSelection2.length == 0) {
        this.$message.info("至少关联一条数据！");
        return false;
      }


      // 审计确认单保存 获取值
      queryAllProblemList(this.multipleSelection2).then(resp => {
        // this.businessEvaluation = resp.data;
        console.log(resp.data);

        let data = resp.data
        let array1 = [];//数组1
        data.forEach((item, i) => {
          // array1.push((i + 1) + '.' + item.problemFindPeople + ',' + item.discoveryTime + ',' + item.basis + ',' + item.field + ',' + item.problem + ',' + item.describe + ',' + item.riskAmount + ',' + item.managementAdvice + '\n');

          array1.push((i + 1) + '.' + item.describe + '</br>' + '</br>' + '管理建议：' + '</br > ' + '</br>' + item.managementAdvice + '</br>' + '</br>');

        });
        let array_list = array1.join('')
        console.log(array_list);
        this.businessEvaluation = array_list;

      })

      this.dlag_Correlation_wt = false;//添加关联问题

    },
    // 生成报告
    query_report () {
      this.isDisable = true
      setTimeout(() => {
        this.isDisable = false
      }, 2000)

      if (this.administrativeAdvice == '' && this.businessEvaluation == '') {
        this.$message({ message: '请填写内容后生成报告' })
        return
      }
      this.success_btn = 1;//显示加载按钮  0成功  1 loaging
      let params2 = {
        managementProjectUuid: this.active_project,//项目id
        businessEvaluation: this.administrativeAdvice,//指标
        administrativeAdvice: this.businessEvaluation  //问题的内容
      }

      this.generate(params2);//生成
    },
    // 生成
    generate (params) {
      task_pageList_export(params).then(resp => {
        this.success_btn = 0;
        if (resp.code == 0) {
          this.$message({
            message: '生成成功',
            type: 'success'
          });
          this.administrativeAdvice = '';//管理建议
          this.businessEvaluation = '';//经营评价
          this.export_selectFile_data()//附件列表

        } else if (resp.code == 2201) {
          this.$message({
            message: resp.msg,
          });
          return false
        } else {
          this.$message({
            message: resp.msg,
            type: 'error'
          });
          return false
        }

      })
    },

    //附件下载
    download_click (id, fileName) {
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
    // 删除
    remove_list (id) {
      this.$confirm(`将永久删除附件?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let params = {
            fileId: id,
          }
          this.file_remove(params);
        })
        .catch(() => { });

    },
    // 删除接口
    file_remove (params) {
      file_remove_list(params).then(resp => {
        console.log(resp.data);
        if (resp.code == 0) {
          // 上传失败
          this.$message({
            message: '删除成功',
            type: 'success'
          });
          this.export_selectFile_data();//刷新列表
        } else {
          // 上传失败
          this.$message({
            message: resp.data.msg,
            type: 'error'
          });
        }
      })
    }

  },

}
</script>

<style scoped>
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
.report {
}
.report >>> .header {
  display: flex;
  padding: 20px;
  box-sizing: border-box;
}
.header >>> .el-row {
}
.top {
  padding: 20px;
  box-sizing: border-box;
}
.top >>> .el-row .el-col {
  width: 100%;
  display: flex;
  align-items: center;
}
.report >>> .el-textarea__inner {
  min-height: 250px !important;
  padding: 10px;
  box-sizing: border-box;
  line-height: 27px;
  font-size: 16px;
}
.report >>> .el-textarea.is-disabled,
.el-textarea__inner {
  background-color: #f5f7fa;
  border-color: #dfe4ed;
  color: #c0c4cc;
  cursor: n-resize;
  background: #fff;
}
.report >>> .ql-editor {
  min-height: 200px;
  font-size: 16px;
}
.text {
  width: 100%;
  float: left;
  box-sizing: border-box;
  margin-top: 20px;
}
.dlag_conter3 {
  padding: 20px;
  box-sizing: border-box;
}
.dlag_conter3 >>> .el-table {
  overflow-y: auto;
  height: 300px;
}

.dlag_conter3 >>> .foot {
  width: 100%;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  padding-bottom: 25px;
  margin-top: 20px;
}
.bottom {
  display: flex;
  flex-wrap: wrap;
  padding: 10px 20px;
  box-sizing: border-box;
}
.bottom p {
  display: flex;
  margin-right: 5px;
  min-width: 45px;
}
.flex_end {
  width: 100%;
  padding: 0 10px 20px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.flex_end ul {
  padding: 10px 0;
  display: flex;
  flex-wrap: wrap;
  box-sizing: border-box;
}

.flex_end ul li {
  width: 100%;
  display: flex;
  align-items: center;
  color: #4f9fdd;
}
.flex_end ul li p {
  cursor: pointer;
}
.flex_end ul li span {
  margin: 0 10px;
  color: rgba(0, 0, 0, 1);
  font-weight: 400;
}
.search {
  display: flex;
  justify-content: flex-end;
  position: relative;
  padding-bottom: 20px;

  box-sizing: border-box;
}
.search >>> .el-input__inner {
  width: 220px !important;
  border-radius: 5px 0 0 5px;
}
.search >>> .el-input__inner {
  width: 250px !important;
  display: flex;
  float: right;
  border-radius: 0 !important;
}
.titleMes .el-button {
  border-radius: 0 !important;
}
.search >>> .search_icon {
  position: absolute;
  top: 0;
  right: 0;
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
}
.search >>> .el-button {
  border-radius: 0 5px 5px 0;
  /* background: #1371cc !important; */
}
.fileName_show {
  font-size: 14px !important;
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
.dlag >>> .el-dialog {
  position: relative;
}
.problem_details_conter {
  width: 100%;
  position: absolute;
  /* top: 90px; */
  left: 0;
  padding: 0 20px;
  box-sizing: border-box;
  z-index: 9999;
}
.problem_details_conter .list {
  margin: 0 auto;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  background: #f5f5f9;
  display: flex;
  flex-wrap: wrap;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}
.list li {
  width: 100%;
  margin-bottom: 20px;
  text-align: left;
  box-sizing: border-box;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.8);
}
.list li:last-child {
  margin-bottom: 0;
}
</style>

