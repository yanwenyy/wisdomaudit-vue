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
          v-model="formState.basyName"
          placeholder="请输入"
        ></el-input>
      </el-form-item>
      <el-form-item label="问题描述:">
        <el-input
          :disabled="ifLook"
          v-model="formState.basyName"
          type="textarea"
          rows="6"
          placeholder="请输入"
        ></el-input>
      </el-form-item>
      <el-form-item label="整改建议:">
        <el-input
          :disabled="ifLook"
          v-model="formState.basyName"
          placeholder="请输入"
        ></el-input>
      </el-form-item>
      <el-form-item class="itemTwo" label="修改时间:">
        <el-input
          :disabled="ifLook"
          v-model="formState.basyName"
          placeholder="请输入"
        ></el-input>
      </el-form-item>
      <el-form-item class="itemTwo zgLabel" label="整改责任部门及联系人:">
        <el-input
          :disabled="ifLook"
          v-model="formState.basyName"
          placeholder="请输入"
        ></el-input>
      </el-form-item>
      <el-form-item label="整改计划:">
        <el-input
          :disabled="ifLook"
          v-model="formState.basyName"
          type="textarea"
          rows="6"
          placeholder="请输入"
        ></el-input>
      </el-form-item>
      <el-form-item label="整改落实情况:">
        <el-input
          :disabled="ifLook"
          v-model="formState.basyName"
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
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-preview="( response, file, fileList)=>{uploadPorgress( response, file, fileList)}"
            :on-remove="( file, fileList)=>{handleRemove( file, fileList)}"
            multiple
            :limit="3"
            :on-exceed="handleExceed"
            :file-list="fileList">
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
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-preview="( response, file, fileList)=>{uploadPorgress( response, file, fileList)}"
            :on-remove="( file, fileList)=>{handleRemove( file, fileList)}"
            multiple
            :limit="3"
            :on-exceed="handleExceed"
            :file-list="fileList">
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
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-preview="( response, file, fileList)=>{uploadPorgress( response, file, fileList)}"
            :on-remove="( file, fileList)=>{handleRemove( file, fileList)}"
            multiple
            :limit="3"
            :on-exceed="handleExceed"
            :file-list="fileList">
            <el-button class="zl-up-btn" size="small" icon="el-icon-upload2">点击上传</el-button>
          </el-upload>
        </el-form-item>
      </div>
      <div class="zl-title">未完成整改原因及预计完成整改时间:</div>
      <div class="left-100">
        <el-form-item class="itemTwo" label="未完成整改原因:">
          <el-input
            :disabled="ifLook"
            v-model="formState.basyName"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item class="itemTwo zgLabel" label="预计完成整改日期:" >
          <el-date-picker :disabled="ifLook" v-model="formState.issueDate" type="date"  placeholder="请选择" value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item class="itemTwo" label="整改状态:">
          <el-input
            :disabled="ifLook"
            v-model="formState.basyName"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注:">
          <el-input
            :disabled="ifLook"
            v-model="formState.basyName"
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
    export default {
       data(){
         return{
           isExamine:false,
           ifLook:false,
           title:'整改事项明细',
           formState:{},
           type:'',
         }
       },
      methods:{
        uploadPorgress(file, fileList,tableList){},
        handleRemove( file, fileList){},
        sub(){},
        close(){
          this.isExamine=false;
        },
        init(title,type){
          this.title=title;
          this.type=type;
          if(type=='zgtz_look'){
            this.ifLook=true;
          }
          this.isExamine=true;
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
