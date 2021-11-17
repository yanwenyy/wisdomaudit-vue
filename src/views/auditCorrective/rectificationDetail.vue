<template>
  <el-dialog
    @close="close"
    :title="title"
    :visible.sync="isExamine"
    :destroy-on-close="true"
    width="80%"
    center
  > <el-divider></el-divider>
    <el-form :model="formState" class="formData"  label-width="100px">
      <el-form-item label="问题:">
        <el-input
          :disabled="ifLook"
          v-model="formState.problemName"
          placeholder="请输入"
        ></el-input>
      </el-form-item>
      <el-form-item label="问题描述:">
        <el-input
          :disabled="ifLook"
          v-model="formState.problemDesc"
          type="textarea"
          rows="6"
          placeholder="请输入"
        ></el-input>
      </el-form-item>
      <el-form-item label="整改建议:">
        <el-input
          :disabled="ifLook"
          v-model="formState.correctAdvice"
          placeholder="请输入"
        ></el-input>
      </el-form-item>
      <el-form-item class="itemTwo" label="整改时限:">
        <el-input
          :disabled="ifLook"
          v-model="formState.correctLimit"
          placeholder="请输入"
        ></el-input>
      </el-form-item>
      <el-form-item class="itemTwo zgLabel" label="整改责任部门及联系人:">
        <el-input
          :disabled="ifLook"
          v-model="formState.correctPersonName"
          placeholder="请输入"
        ></el-input>
      </el-form-item>
      <el-form-item label="整改计划:">
        <el-input
          :disabled="ifLook"
          v-model="formState.correctPlan"
          type="textarea"
          rows="6"
          placeholder="请输入"
        ></el-input>
      </el-form-item>
      <el-form-item label="整改落实情况:">
        <el-input
          :disabled="ifLook"
          v-model="formState.correctResult"
          type="textarea"
          rows="6"
          placeholder="请输入"
        ></el-input>
      </el-form-item>
      <div class="zl-title">文件资料列表:</div>
      <div class="left-100">
        <el-form-item label="制度流程优化:">
          <el-input
            :disabled="ifLook"
            v-model="formState.ext1"
            placeholder="请输入"
          ></el-input>
          <el-upload
            v-if="type!='zgtz_look'&&type!='zgcs_examine'"
            class="upload-demo inline-block"
            action="/wisdomaudit/auditBasy/filesUpload"
            :on-success="( response, file, fileList)=>{uploadPorgress( response, file, fileList,attachmentList1)}"
            :on-remove="( file, fileList)=>{handleRemove( file, fileList,attachmentList1,fileList1,fileList1_del)}"
            multiple
            :limit="3"
            :key="key"
            :on-exceed="handleExceed"
            :headers="headers"
            :file-list="fileList1">
            <el-button class="zl-up-btn" size="small" icon="el-icon-upload2">点击上传</el-button>
          </el-upload>
          <div class="inline-block" v-if="ifLook">
            <div v-for="(item,index) in fileList1" :key="index">{{item.fileName}}</div>
          </div>
        </el-form-item>
        <el-form-item label="其他措施:">
          <el-input
            :disabled="ifLook"
            v-model="formState.ext2"
            placeholder="请输入"
          ></el-input>
          <el-upload
            v-if="type!='zgtz_look'&&type!='zgcs_examine'"
            class="upload-demo inline-block"
            action="/wisdomaudit/auditBasy/filesUpload"
            :on-success="( response, file, fileList)=>{uploadPorgress( response, file, fileList,attachmentList2)}"
            :on-remove="( file, fileList)=>{handleRemove( file, fileList,attachmentList2,fileList2,fileList1_de2)}"
            multiple
            :limit="3"
            :key="key"
            :on-exceed="handleExceed"
            :headers="headers"
            :file-list="fileList2">
            <el-button class="zl-up-btn" size="small" icon="el-icon-upload2">点击上传</el-button>
          </el-upload>
          <div class="inline-block" v-if="ifLook">
            <div v-for="(item,index) in fileList2" :key="index">{{item.fileName}}</div>
          </div>
        </el-form-item>
        <el-form-item label="系统升级改造:">
          <el-input
            :disabled="ifLook"
            v-model="formState.ext3"
            placeholder="请输入"
          ></el-input>
          <el-upload
            v-if="type!='zgtz_look'&&type!='zgcs_examine'"
            class="upload-demo inline-block"
            action="/wisdomaudit/auditBasy/filesUpload"
            :on-success="( response, file, fileList)=>{uploadPorgress( response, file, fileList,attachmentList3)}"
            :on-remove="( file, fileList)=>{handleRemove( file, fileList,attachmentList3,fileList3,fileList3_del)}"
            multiple
            :limit="3"
            :key="key"
            :on-exceed="handleExceed"
            :headers="headers"
            :file-list="fileList3">
            <el-button class="zl-up-btn" size="small" icon="el-icon-upload2">点击上传</el-button>
          </el-upload>
          <div class="inline-block" v-if="ifLook">
            <div v-for="(item,index) in fileList3" :key="index">{{item.fileName}}</div>
          </div>
        </el-form-item>
      </div>
      <div class="zl-title">未完成整改原因及预计完成整改时间:</div>
      <div class="left-100">
        <el-form-item class="itemTwo" label="未完成整改原因:">
          <el-input
            :disabled="ifLook"
            v-model="formState.unfinishedReason"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item class="itemTwo zgLabel" label="预计完成整改日期:" >
          <el-date-picker :disabled="ifLook" v-model="formState.planEndDate" type="date"  placeholder="请选择" value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item class="itemTwo" label="整改状态:">
          <el-select :disabled="ifLook" v-model="formState.correctState" placeholder="请选择">
            <el-option label="未整改" value="0"></el-option>
            <el-option label="整改中" value="1"></el-option>
            <el-option label="已完成整改" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注:">
          <el-input
            :disabled="ifLook"
            v-model="formState.remarks"
            type="textarea"
            rows="6"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
      </div>
      <el-form-item label="审核意见:" v-if="type=='zgcs_examine'">
        <el-input
          v-model="formState.auditCommend"
          type="textarea"
          rows="6"
          placeholder="请输入"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button v-if="!ifLook" type="primary" @click="save">保存</el-button>
      <el-button v-if="!ifLook&&(formState.correctStatus==1||formState.correctStatus==4)" type="primary" @click="sub">提交</el-button>
      <el-button v-if="type=='zgcs_examine'&&(formState.correctStatus==2||formState.correctStatus==3)" type="primary" @click="examine('1')">提交</el-button>
      <el-button v-if="type=='zgcs_examine'&&(formState.correctStatus==2||formState.correctStatus==3)" type="primary" @click="examine('2')">驳回</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { correctStep_getById,correctStep_inputAlter,correctStep_submitAlter,correctStep_verifyLd,correctStep_verifyZgr } from
      '@SDMOBILE/api/shandong/ls'
    export default {
       data(){
         return{
           headers:'',
           people:'',
           key:0,
           isExamine:false,
           ifLook:false,
           title:'整改事项明细',
           formState:{
             problemName:'',
             problemDesc:'',
             correctAdvice:'',
             correctLimit:'',
             correctPerson:'',
             correctPlan:'',
             correctResult:'',
             unfinishedReason:'',
             correctStatus:'',
             remarks:'',
             auditCommend:'',
             ext1:'',
             ext2:'',
             ext3:'',
           },
           type:'',
           attachmentList1:[],
           attachmentList2:[],
           attachmentList3:[],
           fileList1:[],
           fileList2:[],
           fileList3:[],
           fileList1_del:[],
           fileList2_del:[],
           fileList3_del:[],
         }
       },
       created(){
         this.headers = {'TOKEN':sessionStorage.getItem('TOKEN')}
       },
      methods:{
        handleExceed(){},
        //附件上传
        uploadPorgress(response,file, fileList,tableList){
          if (response && response.code === 0) {
            response.data.isDeleted=2;
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
        handleRemove( file, fileList,tableList,showList,delList){
          if (file.response) {
            tableList.remove(file.response.data);
            this.key = Math.random();
          } else {
            showList.remove(file);
            file.isDeleted = 1;
            delList.push(file);
            console.log(showList,delList)
          }
        },
        //信息保存
        setDetail(){
          var uploadList1=this.attachmentList1.concat(this.fileList1).concat(this.fileList1_del);
          var uploadList2=this.attachmentList2.concat(this.fileList2).concat(this.fileList2_del);
          var uploadList3=this.attachmentList3.concat(this.fileList3).concat(this.fileList3_del);
          uploadList1.forEach((item)=>{
            item.status=null;
          });
          uploadList2.forEach((item)=>{
            item.status=null;
          });
          uploadList3.forEach((item)=>{
            item.status=null;
          });
          var params={
            attachmentList1:uploadList1,
            attachmentList2:uploadList2,
            attachmentList3:uploadList3,
            correctStep:this.formState,
          };
          return params;
        },
        //保存按钮点击
        save(){
          var params=this.setDetail();
          var timer=setTimeout(correctStep_inputAlter(params).then(resp => {
            if (resp.code == 0) {
              this.$message({
                message: "保存成功",
                type: "success",
              });
              this.isExamine=false;
              this.$nextTick(() => {
                this.$parent.list_data_start();
              })
              clearTimeout(timer);
              timer=null;
            } else {
              this.$message({
                message: resp.data.msg,
                type: "error",
              });
            }

          }),1)
        },
        //提交按钮点击
        sub(){
          var params=this.setDetail();
          var timer=setTimeout(correctStep_submitAlter(params).then(resp => {
            if (resp.code == 0) {
              this.$message({
                message: "提交成功",
                type: "success",
              });
              this.isExamine=false;
              this.$nextTick(() => {
                this.$parent.list_data_start();
              })
              clearTimeout(timer);
              timer=null;
            } else {
              this.$message({
                message: resp.data.msg,
                type: "error",
              });
            }

          }),1)
        },
        //审核和驳回按钮点击
        examine(type){
          var params=this.setDetail();
          params.type=type;
          if(this.people=='leader'){
            var timer=setTimeout(correctStep_verifyLd(params).then(resp => {
              if (resp.code == 0) {
                this.$message({
                  message: "审核成功",
                  type: "success",
                });
                this.isExamine=false;
                this.$nextTick(() => {
                  this.$parent.list_data_start();
                })
                clearTimeout(timer);
                timer=null;
              } else {
                this.$message({
                  message: resp.data.msg,
                  type: "error",
                });
              }

            }),1)
          }else if(this.people=='gjr'){
            var timer=setTimeout(correctStep_verifyZgr(params).then(resp => {
              if (resp.code == 0) {
                this.$message({
                  message: "审核成功",
                  type: "success",
                });
                this.isExamine=false;
                this.$nextTick(() => {
                  this.$parent.list_data_start();
                })
                clearTimeout(timer);
                timer=null;
              } else {
                this.$message({
                  message: resp.data.msg,
                  type: "error",
                });
              }

            }),1)
          }
        },
        close(){
          this.isExamine=false;
        },
        init(title,type,id,people){
          this.title=title;
          this.people=people;
          this.type=type;
          this.clearFileList();
          if(type=='zgtz_look'||type=='zgcs_examine'){
            this.ifLook=true;
          }
          correctStep_getById(id).then(resp=>{
            var datas=resp.data;
            this.formState=datas.correctStep;
            if(datas.attachmentList1){
              datas.attachmentList1.forEach((item)=>{
                item.name=item.fileName;
                item.url=item.filePath;
                item.isDeleted=0;
              });
            }
            if(datas.attachmentList2){
              datas.attachmentList2.forEach((item)=>{
                item.name=item.fileName;
                item.url=item.filePath;
                item.isDeleted=0;
              });
            }
            if(datas.attachmentList3){
              datas.attachmentList3.forEach((item)=>{
                item.name=item.fileName;
                item.url=item.filePath;
                item.isDeleted=0;
              });
            }
            this.fileList1=datas.attachmentList1||[];
            this.fileList2=datas.attachmentList2||[];
            this.fileList3=datas.attachmentList3||[];
            this.isExamine=true;
          });

        },
        //清除附件列表
        clearFileList(){
          this.attachmentList1=[];
          this.attachmentList2=[];
          this.attachmentList3=[];
          this.fileList1=[];
          this.fileList2=[];
          this.fileList3=[];
          this.fileList1_del=[];
          this.fileList2_del=[];
          this.fileList3_del=[];
          this.ifLook=false;
        },
      }
    }
</script>

<style scoped>
  >>>.zgLabel .el-form-item__label{
    width: 27%!important;
  }
  >>>.zgLabel .el-form-item__content {
    width: 56%;
  }
  .left-100{
    box-sizing: border-box;
    padding:0 100px;

  }
  >>>.left-100 .el-input{
    width: 40%!important;
    margin-right: 20px;
    vertical-align: top;
  }
  >>>.left-100 .upload-demo{
    width: 50%!important;
    vertical-align: top;
  }
  >>>.zl-up-btn .el-icon-upload2{
    color:#49BAE8!important;
    font-weight: bold;
    transform: scale(1.2);
  }
  >>>.left-100 .itemTwo .el-input{
    width: 100%!important;
    margin-right: 0;
  }
  .zl-title{
    margin-top: 20px;
    font-weight: bold;
  }
</style>
