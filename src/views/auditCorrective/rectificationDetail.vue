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
          v-model="formState.correctPerson"
          placeholder="请输入"
        ></el-input>
      </el-form-item>
      <el-form-item label="整改计划:">
        <el-input
          :disabled="ifLook"
          v-model="formState.correctPlanUuid"
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
            v-model="formState.basyName"
            placeholder="请输入"
          ></el-input>
          <el-upload
            v-if="type!='zgtz_look'"
            class="upload-demo inline-block"
            action="/wisdomaudit/auditBasy/filesUpload"
            :on-success="( response, file, fileList)=>{uploadPorgress( response, file, fileList,attachmentList1)}"
            :on-remove="( file, fileList)=>{handleRemove( file, fileList,attachmentList1)}"
            multiple
            :limit="3"
            :on-exceed="handleExceed"
            :file-list="fileList1">
            <el-button class="zl-up-btn" size="small" icon="el-icon-upload2">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="其他措施:">
          <el-input
            :disabled="ifLook"
            v-model="formState.basyName"
            placeholder="请输入"
          ></el-input>
          <el-upload
            v-if="type!='zgtz_look'"
            class="upload-demo inline-block"
            action="/wisdomaudit/auditBasy/filesUpload"
            :on-success="( response, file, fileList)=>{uploadPorgress( response, file, fileList,attachmentList2)}"
            :on-remove="( file, fileList)=>{handleRemove( file, fileList,attachmentList2)}"
            multiple
            :limit="3"
            :on-exceed="handleExceed"
            :file-list="fileList2">
            <el-button class="zl-up-btn" size="small" icon="el-icon-upload2">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="系统升级改造:">
          <el-input
            :disabled="ifLook"
            v-model="formState.basyName"
            placeholder="请输入"
          ></el-input>
          <el-upload
            v-if="type!='zgtz_look'"
            class="upload-demo inline-block"
            action="/wisdomaudit/auditBasy/filesUpload"
            :on-success="( response, file, fileList)=>{uploadPorgress( response, file, fileList,attachmentList3)}"
            :on-remove="( file, fileList)=>{handleRemove( file, fileList,attachmentList3)}"
            multiple
            :limit="3"
            :on-exceed="handleExceed"
            :file-list="fileList3">
            <el-button class="zl-up-btn" size="small" icon="el-icon-upload2">点击上传</el-button>
          </el-upload>
          <div class="inline-block" v-if="ifLook">
            <div v-for="(item,index) in fileList1" :key="index">{{item.fileName}}</div>
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
          <el-select :disabled="ifLook" v-model="formState.correctStatus" placeholder="请选择">
            <el-option label="待提交" value="1"></el-option>
            <el-option label="待审核" value="2"></el-option>
            <el-option label="审核通过" value="3"></el-option>
            <el-option label="驳回待提交" value="4"></el-option>
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
          :disabled="ifLook"
          v-model="formState.basyName"
          type="textarea"
          rows="6"
          placeholder="请输入"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button v-if="!ifLook" type="primary" @click="sub">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { correctStep_getById } from
      '@SDMOBILE/api/shandong/ls'
    export default {
       data(){
         return{
           isExamine:false,
           ifLook:false,
           title:'整改事项明细',
           formState:{},
           type:'',
           attachmentList1:[],
           attachmentList2:[],
           attachmentList3:[],
           fileList1:[],
           fileList2:[],
           fileList3:[],
         }
       },
      methods:{
        handleExceed(){},
        uploadPorgress(response,file, fileList,tableList){
          if (response && response.code === 0) {
            this.$message({
              message: '上传成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                tableList.push(response.data);
                console.log(this.attachmentList1,3333)
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
        handleRemove( file, fileList,tableList){},
        sub(){},
        close(){
          this.isExamine=false;
        },
        init(title,type,id){
          this.title=title;
          this.type=type;
          if(type=='zgtz_look'){
            this.ifLook=true;
          }
          correctStep_getById(id).then(resp=>{
            var datas=resp.data;
            this.formState=datas.correctStep;
            datas.attachmentList1.forEach((item)=>{
              item.name=item.fileName;
              item.url=item.filePath;
            });
            datas.attachmentList2.forEach((item)=>{
              item.name=item.fileName;
              item.url=item.filePath;
            });
            datas.attachmentList3.forEach((item)=>{
              item.name=item.fileName;
              item.url=item.filePath;
            });
            this.fileList1=datas.attachmentList1;
            this.fileList2=datas.attachmentList2;
            this.fileList3=datas.attachmentList3;
            this.isExamine=true;
          });

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
