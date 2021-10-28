<template>
  <div class="auditConfirmation">
    <el-button type="primary" @click="addConfirmation()">新增确认单</el-button>
    <!-- 审计确认单列表 -->
    <el-table
      :header-cell-style="{'background-color': '#F4FAFF',}"
      :data="confirmaryData"
      style="margin-top: 1%"
      class="confirmaryTable"
    >
      <el-table-column align="center" type="index" label="序号"></el-table-column>
      <el-table-column align="center" label="审计(调查)事项" prop="matter"></el-table-column>
      <el-table-column align="center" label="责任人" prop="liablePerson"></el-table-column>
      <el-table-column align="center" label="问题数" prop="problemsNumber"></el-table-column>
      <el-table-column align="center" label="确认单附件">
        <template slot-scope="scope">
          <el-popover
            v-if="scope.row.confirmationFileNumber"
            placement="bottom"
            width="200"
            @show="getFileList(scope.row.auditConfirmationUuid)"
            trigger="click">
            <ul v-if="tableFileList!=''">
              <li v-for="item in tableFileList" class="pointer blue" @click="downFile(item.attachment_uuid,item.file_name)"><i class="orange el-icon-folder-opened"></i>{{item.file_name}}</li>
            </ul>
            <div slot="reference" class="pointer"><i class="el-icon-folder-opened list-folder"></i>{{scope.row.confirmationFileNumber}}</div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            size="small"
            type="text"
            class="btnStyle editBtn"
            @click="edit(scope.row)">编辑</el-button
          >
          <el-upload
            :show-file-list="false"
            class="upload-demo inline-block btnStyle"
            :action="'/wisdomaudit/auditConfirmation/fileUpload?auditConfirmationUuid='+scope.row.auditConfirmationUuid+'&confirmationFileNumber='+(scope.row.confirmationFileNumber||'')"
            :on-change="fileChange"
            :on-success="list_data_start"
            accept=".docx,.xls,.xlsx,.txt,.zip,.doc">
            <el-button size="small" type="text"  style="background: transparent;" class="editBtn">上传附件</el-button>
          </el-upload>
          <el-button
            size="small"
            type="text"
            class="btnStyle red"
            @click="deletes(scope.row.auditConfirmationUuid)"
            >删除</el-button
          >
        </template>
      </el-table-column>
      <el-table-column label="最终版扫描件"  align="center">
        <template slot-scope="scope">
          <el-button
            size="small"
            type="text"
            class="btnStyle"
            style="color: #1371cc"
          >
            <el-upload
              v-if="scope.row.endConfirmationFile==''||scope.row.endConfirmationFile==null"
              :show-file-list="false"
              class="upload-demo inline-block btnStyle"
              :on-change="fileChange"
              :action="'/wisdomaudit/auditConfirmation/endFileUpload?auditConfirmationUuid='+scope.row.auditConfirmationUuid"
              :on-success="list_data_start"
              accept=".docx,.xls,.xlsx,.txt,.zip,.doc">
              <el-button size="small" type="text"  style="background: transparent;padding:0" class="editBtn">上传</el-button>
            </el-upload>
            <el-tooltip placement="bottom"  effect="light" v-if="scope.row.endConfirmationFile">
              <div @click="downFile(scope.row.endConfirmationFileId,scope.row.endConfirmationFile)" class="pointer" slot="content">{{scope.row.endConfirmationFile}}</div>
              <span class="editBtn"><i class="el-icon-folder-opened list-folder"></i>1</span>
            </el-tooltip>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增确认单弹出框 -->
    <el-dialog
      :visible.sync="confirmationDialogVisible"
      width="70%"
      @close="handleClose"
    >
      <div class="title">{{confirmationDialogTitle}}</div>
      <el-form class="formData" label-width="130px"  :model="formDetail">
        <el-form-item class="itemTwo" label="审计项目名称:"
        >{{managementProjectName}}</el-form-item
        >
        <el-form-item class="itemTwo" label="被审计单位:">{{auditOrgName}}</el-form-item>
        <el-form-item label="审计（调查）事项:">
          <el-input type="textarea" v-model="formDetail.matter"></el-input>
        </el-form-item>
        <el-form-item label="审计(调查)事项描述:">
          <el-button @click="getRelationQues">关联问题</el-button>

          <el-input type="textarea" v-model="formDetail.matterDetail"></el-input>
        </el-form-item>
        <el-form-item class="itemThree" label="审计人员:">
          <el-input placeholder="请输入"  v-model="formDetail.auditorsName"></el-input>
        </el-form-item>
        <el-form-item class="itemThree" label="复核人:">
          <el-input placeholder="请输入" v-model="formDetail.reviewerName"></el-input>
        </el-form-item>
        <el-form-item class="itemThree" label="编制日期:">
          <el-date-picker
            v-model="formDetail.compileDate"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
            style="width: 100%"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="saveForm">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="confirmationDialogVisibleZx"
      width="70%"
      @close="handleClose"
    >
      <div class="title">{{confirmationDialogTitle}}</div>
      <div>
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
            <td>审计(调查)事项描述</td>
            <td colspan="5"><el-input type="textarea" v-model="formDetail.matterDetail"></el-input></td>
          </tr>
          <tr>
            <td>审计人员(签名)</td>
            <td width="20%">{{formDetail.auditorsName}}</td>
            <td>复审人(签名)</td>
            <td  width="20%">{{formDetail.reviewerName}}</td>
            <td>编制日期</td>
            <td>{{formDetail.compileDate}}</td>
          </tr>
          <tr>
            <td>被审计(调查)单位确认意见</td>
            <td colspan="5"><el-input type="textarea" v-model="formDetail.auditOrgOpinion"></el-input></td>
          </tr>
          <tr>
            <td>相关负责人(签名)</td>
            <td><el-input v-model="formDetail.principalName"></el-input></td>
            <td>职务</td>
            <td><el-input v-model="formDetail.principalPost"></el-input></td>
            <td>日期</td>
            <td><el-input v-model="formDetail.signatureDate"></el-input></td>
          </tr>
        </table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="saveForm">确 定</el-button>
      </span>
    </el-dialog>
    <search-list ref="searchTabel" @refreshSearch="getSearchInfo"></search-list>
  </div>
</template>

<script>
  import {down_file, auditBasy_getFileList,auditConfirmation_pageList,auditConfirmation_save,auditConfirmation_delete,auditConfirmation_getDetail,auditConfirmation_update} from
      '@SDMOBILE/api/shandong/ls'
  import { task_pageList_wt} from
      '@SDMOBILE/api/shandong/AuditReport'
  import SearchList from "./searchList"
export default {
  components: {SearchList},
  props:['active_project'],
  data() {
    return {
      confirmationDialogTitle:'新增确认单',
      confirmaryData: [],
      confirmationDialogVisible: false, //新增确认单弹框
      confirmationDialogVisibleZx:false,//专项确认单编辑
      formDetail:{
        matter:'',
        matterDetail:'',
        auditorsName:'',
        reviewerName:'',
        compileDate:'',
        auditOrgOpinion:'',
        principalName:'',
        principalPost:'',
        signatureDate:'',
      },//确认单数据
      relationTabel:[],//关联问题
      relationStatus:false,//关联问题显示状态
      multipleSelection:[],//关联问题列表已选

      managementProjectName:'',//审计项目名称
      auditOrgName:'',//被审计单位
      projectType:'',//项目类型 jzsj经责审计  zxsj专项审计
      tableFileList:[],//确认单附件列表
    };
  },
  created() {
    this.list_data_start();
  },
  methods: {
    //附件上传时
    fileChange(file, fileList){
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
      } else if (file.response && file.response.code!= 0)  {
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
    downFile(id,fileName){
      let formData = new FormData()
      formData.append('fileId', id)
      down_file(id).then(resp => {
        const content = resp.data;
        const blob = new Blob([content])
        if ('download' in document.createElement('a')) { // 非IE下载
          const elink = document.createElement('a')
          elink.download = fileName
          elink.style.display = 'none'
          elink.href = URL.createObjectURL(blob)
          document.body.appendChild(elink)
          elink.click()
          URL.revokeObjectURL(elink.href) // 释放URL 对象
          document.body.removeChild(elink)
        } else { // IE10+下载
          navigator.msSaveBlob(blob, fileName)
        }
      })
    },
    //点击确认单附件显示附件列表
    getFileList(id){
      this.tableFileList=[];
      auditBasy_getFileList(id).then(resp => {
        this.tableFileList=resp.data;
      })
    },
    //删除
    deletes(val){
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
      }).catch(() => {})

    },
    //编辑
    edit(row){
      this.clearForm();
      this.isAdd = true;
      this.confirmationDialogTitle="编辑确认单";
      auditConfirmation_getDetail(row.auditConfirmationUuid).then(resp => {
        var datas=resp.data;
        this.formDetail=datas;
        if(this.projectType=='jzsj'){
          this.confirmationDialogVisible=true;
        }else if(this.projectType=='zxsj'){
          this.confirmationDialogVisibleZx=true;
        }

      })
    },
    //列表数据
    list_data_start () {
      let params={
        condition: {
          managementProjectUuid: this.active_project,
        }
      };
      this.loading = true
      auditConfirmation_pageList(params).then(resp => {
        var datas=resp.data;
        this.confirmaryData = datas.dataList;
        this.managementProjectName=datas.managementProjectName;
        this.auditOrgName=datas.auditOrgName;
        this.projectType=datas.projectType;
        this.loading = false
      })
    },
    //   新增确认单按钮事件
    addConfirmation() {
      this.clearForm();
      this.confirmationDialogTitle="新增确认单";
      this.confirmationDialogVisible = true;
    },
    // 增加弹出框关闭事件
    handleClose() {
      this.confirmationDialogVisible = false
      this.confirmationDialogVisibleZx = false
    },
    //关联问题点击
    getRelationQues(){
      this.$nextTick(() => {
        this.$refs.searchTabel.init(this.active_project);
      });

    },
    //获取关联的问题
    getSearchInfo(data){
      this.formDetail.matterDetail=data.str;
      this.formDetail.problemListUuidList=data.problemListUuidList;
      this.formDetail.problemsNumber=data.multipleSelection.length;
    },

    //保存审计确认单
    saveForm(){
      if(this.confirmationDialogTitle=='新增确认单'){
        this.formDetail.managementProjectUuid=this.active_project;
        auditConfirmation_save(this.formDetail).then(resp => {
          if (resp.code == 0) {
            this.$message({
              message: "保存成功",
              type: "success",
            });
            this.confirmationDialogVisible=false;
            this.list_data_start();
          } else {
            this.$message({
              message: resp.data.msg,
              type: "error",
            });
          }

        })
      }else{
        auditConfirmation_update(this.formDetail).then(resp => {
          if (resp.code == 0) {
            this.$message({
              message: "修改成功",
              type: "success",
            });
            this.confirmationDialogVisible=false;
            this.list_data_start();
          } else {
            this.$message({
              message: resp.data.msg,
              type: "error",
            });
          }

        })
      }

    },
    clearForm(){
      this.formDetail={
        matter:'',
        matterDetail:'',
        auditorsName:'',
        reviewerName:'',
        compileDate:'',
        auditOrgOpinion:'',
        principalName:'',
        principalPost:'',
        signatureDate:'',
      }
    },
  },
};
</script>

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
  }
}
.title {
  border-bottom: 1px solid #d2d2d2;
  padding: 10px;
  text-align: center;
}
.formData {
  // border: 1px solid red;
  padding: 2%;
  .el-button{
      border-color: #ECECEC;
      color: #9E9E9F;
  }

}
</style>
<style scoped>
  @import '../../../assets/styles/css/yw.css';
  .list-folder{
    color:orange;
    margin-right: 5px;
  }
  >>>.list-folder-btn{
    font-weight: normal;
    background: transparent;
    border: none;
    color:blue;
  }
  .zxTabel{
    border: 1px solid #ddd;
    width: 100%;
  }
  .zxTabel>tr:not(:last-child){
    border-bottom:1px solid #ddd;
    background: #fff;
  }
  .zxTabel td{
    padding: 10px;
  }
  .zxTabel td:not(:last-child){
    border-right:1px solid #ddd;
  }
  .inline-block{
    display: inline-block!important;
  }
  .blue{
    color: blue;
  }
  .orange{
    color:orange;
  }
</style>
