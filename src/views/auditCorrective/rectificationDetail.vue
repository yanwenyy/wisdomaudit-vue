<template>
  <el-dialog @close="close"
             :title="title"
             :append-to-body='true'
             :visible.sync="isExamine"
             :destroy-on-close="true"
             width="80%"
             center>
    <Vault :vaultV="vaultV"
           :sceneId="sceneId"
           :approvers="approvers"
           :maxTime="maxTime"
           :dqtime="dqtime"
           :account="account"
           :appSessionId="appSessionId"
           @changevault="changevault"
           @vdownload="vdownload"></Vault>
    <el-divider></el-divider>
    <el-form :model="formState"
             class="formData"
             label-width="100px">
      <el-form-item label="问题:">
        <el-input :disabled="ifLook"
                  v-model="formState.problemName"
                  placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="问题描述:">
        <el-input :readonly="ifLook"
                  v-model="formState.problemDesc"
                  type="textarea"
                  :class="ifLook?'bag':''"
                  rows="6"
                  placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="整改建议:">
        <el-input :disabled="ifLook"
                  v-model="formState.correctAdvice"
                  placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item class="itemTwo"
                    label="整改时限:">
        <el-input :disabled="ifLook"
                  v-model="formState.correctLimit"
                  placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item class="itemTwo zgLabel"
                    label="整改责任部门:">
        <el-input :disabled="ifLook"
                  v-model="formState.correctDeptName"
                  placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item class="itemTwo"
                    label="整改联系人:">
        <el-input :disabled="ifLook"
                  v-model="formState.correctPersonName"
                  placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="整改计划:">
        <el-input :readonly="ifLook"
                  :class="ifLook?'bag':''"
                  v-model="formState.correctPlan"
                  type="textarea"
                  rows="6"
                  placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="整改落实情况:">
        <el-input :readonly="ifLook"
                  v-model="formState.correctResult"
                  type="textarea"
                  :class="ifLook?'bag':''"
                  rows="6"
                  placeholder="请输入"></el-input>
      </el-form-item>
      <div class="zl-title">文件资料列表:</div>
      <div class="left-100">
        <el-form-item label="制度流程优化:">
          <el-input :disabled="ifLook"
                    v-model="formState.ext1"
                    placeholder="请输入"></el-input>
          <!--<el-upload v-if="type!='zgtz_look'&&type!='zgcs_examine'"-->
                     <!--class="upload-demo inline-block"-->
                     <!--action="/wisdomaudit/auditBasy/filesUpload"-->
                     <!--:on-success="( response, file, fileList)=>{uploadPorgress( response, file, fileList,attachmentList1)}"-->
                     <!--:on-remove="( file, fileList)=>{handleRemove( file, fileList,attachmentList1,fileList1,fileList1_del)}"-->
                     <!--multiple-->
                     <!--:limit="3"-->
                     <!--:key="key"-->
                     <!--:on-exceed="handleExceed"-->
                     <!--:headers="headers"-->
                     <!--:file-list="fileList1">-->
            <!--<el-button class="zl-up-btn"-->
                       <!--size="small"-->
                       <!--icon="el-icon-upload2">点击上传</el-button>-->
          <!--</el-upload>-->
          <el-upload v-if="type!='zgtz_look'&&type!='zgcs_examine'"
                     class="upload-demo inline-block"
                     ref="upload1"
                     action="#"
                     :http-request="( params)=>{myFileUpload( params,'/wisdomaudit/auditBasy/filesUpload',attachmentList1,'upload1')}"
                     :before-upload="(file, fileList)=>{beforeUpload(file, fileList,'整改措施')}"
                     :on-remove="( file, fileList)=>{handleRemove( file, fileList,attachmentList1,fileList1,fileList1_del)}"
                     multiple
                     :limit="3"
                     :key="key"
                     :on-exceed="handleExceed"
                     :headers="headers"
                     :file-list="fileList1">
            <el-button class="zl-up-btn"
                       size="small"
                       icon="el-icon-upload2">点击上传</el-button>
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
                   @click="openVault(item)">
                {{item.fileName.length>20?item.fileName.slice(0,20)+"...":item.fileName}}</div>
            </el-tooltip>
            <!--<div class="blue pointer" v-for="(item,index) in fileList1" :key="index"  @click="downFile(item.attachmentUuid,item.fileName)">-->
            <!--{{item.fileName}}-->
            <!--</div>-->
          </div>
        </el-form-item>
        <el-form-item label="系统升级改造:">
          <el-input :disabled="ifLook"
                    v-model="formState.ext3"
                    placeholder="请输入"></el-input>
          <!--<el-upload v-if="type!='zgtz_look'&&type!='zgcs_examine'"-->
                     <!--class="upload-demo inline-block"-->
                     <!--action="/wisdomaudit/auditBasy/filesUpload"-->
                     <!--:on-success="( response, file, fileList)=>{uploadPorgress( response, file, fileList,attachmentList3)}"-->
                     <!--:on-remove="( file, fileList)=>{handleRemove( file, fileList,attachmentList3,fileList3,fileList3_del)}"-->
                     <!--multiple-->
                     <!--:limit="3"-->
                     <!--:key="key"-->
                     <!--:on-exceed="handleExceed"-->
                     <!--:headers="headers"-->
                     <!--:file-list="fileList3">-->
            <!--<el-button class="zl-up-btn"-->
                       <!--size="small"-->
                       <!--icon="el-icon-upload2">点击上传</el-button>-->
          <!--</el-upload>-->
          <el-upload v-if="type!='zgtz_look'&&type!='zgcs_examine'"
                     class="upload-demo inline-block"
                     ref="upload3"
                     action="#"
                     :http-request="( params)=>{myFileUpload( params,'/wisdomaudit/auditBasy/filesUpload',attachmentList3,'upload3')}"
                     :before-upload="(file, fileList)=>{beforeUpload(file, fileList,'整改措施')}"
                     :on-remove="( file, fileList)=>{handleRemove( file, fileList,attachmentList3,fileList3,fileList3_del)}"
                     multiple
                     :limit="3"
                     :key="key"
                     :on-exceed="handleExceed"
                     :headers="headers"
                     :file-list="fileList3">
            <el-button class="zl-up-btn"
                       size="small"
                       icon="el-icon-upload2">点击上传</el-button>
          </el-upload>
          <div class="inline-block"
               v-if="ifLook">
            <el-tooltip class="item"
                        effect="dark"
                        v-for="(item,index) in fileList3"
                        :key="index"
                        :content="item.fileName"
                        placement="top">
              <div class="blue pointer"
                   @click="openVault(item)">
                {{item.fileName.length>20?item.fileName.slice(0,20)+"...":item.fileName}}</div>
            </el-tooltip>
            <!--<div class="blue pointer" v-for="(item,index) in fileList3" :key="index"  @click="downFile(item.attachmentUuid,item.fileName)">{{item.fileName}}</div>-->
          </div>
        </el-form-item>
        <el-form-item label="其他措施:">
          <el-input :disabled="ifLook"
                    v-model="formState.ext2"
                    placeholder="请输入"></el-input>
          <!--<el-upload v-if="type!='zgtz_look'&&type!='zgcs_examine'"-->
                     <!--class="upload-demo inline-block"-->
                     <!--action="/wisdomaudit/auditBasy/filesUpload"-->
                     <!--:on-success="( response, file, fileList)=>{uploadPorgress( response, file, fileList,attachmentList2)}"-->
                     <!--:on-remove="( file, fileList)=>{handleRemove( file, fileList,attachmentList2,fileList2,fileList2_del)}"-->
                     <!--multiple-->
                     <!--:limit="3"-->
                     <!--:key="key"-->
                     <!--:on-exceed="handleExceed"-->
                     <!--:headers="headers"-->
                     <!--:file-list="fileList2">-->
            <!--<el-button class="zl-up-btn"-->
                       <!--size="small"-->
                       <!--icon="el-icon-upload2">点击上传</el-button>-->
          <!--</el-upload>-->
          <el-upload v-if="type!='zgtz_look'&&type!='zgcs_examine'"
                     class="upload-demo inline-block"
                     ref="upload2"
                     action="#"
                     :http-request="( params)=>{myFileUpload( params,'/wisdomaudit/auditBasy/filesUpload',attachmentList2,'upload2')}"
                     :before-upload="(file, fileList)=>{beforeUpload(file, fileList,'整改措施')}"
                     :on-remove="( file, fileList)=>{handleRemove( file, fileList,attachmentList2,fileList2,fileList2_del)}"
                     multiple
                     :limit="3"
                     :key="key"
                     :on-exceed="handleExceed"
                     :headers="headers"
                     :file-list="fileList2">
            <el-button class="zl-up-btn"
                       size="small"
                       icon="el-icon-upload2">点击上传</el-button>
          </el-upload>
          <div class="inline-block"
               v-if="ifLook">
            <el-tooltip class="item"
                        effect="dark"
                        v-for="(item,index) in fileList2"
                        :key="index"
                        :content="item.fileName"
                        placement="top">
              <div class="blue pointer"
                   @click="openVault(item)">
                {{item.fileName.length>20?item.fileName.slice(0,20)+"...":item.fileName}}</div>
            </el-tooltip>
            <!--<div class="blue pointer" v-for="(item,index) in fileList2" :key="index"  @click="downFile(item.attachmentUuid,item.fileName)">-->
            <!--{{item.fileName}}-->
            <!--</div>-->

          </div>
        </el-form-item>
      </div>
      <div class="zl-title">未完成整改原因及预计完成整改时间:</div>
      <div class="left-100">
        <el-form-item class="itemTwo"
                      label="未完成整改原因:">
          <el-input :disabled="ifLook"
                    v-model="formState.unfinishedReason"
                    placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item class="itemTwo zgLabel"
                      label="预计完成整改日期:">
          <el-date-picker :disabled="ifLook"
                          v-model="formState.planEndDate"
                          type="date"
                          placeholder="请选择日期"
                          value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item class="itemTwo"
                      label="整改状态:">
          <el-select :disabled="ifLook"
                     v-model="formState.correctState"
                     placeholder="请选择整改状态">
            <el-option label="未整改"
                       value="0"></el-option>
            <el-option label="整改中"
                       value="1"></el-option>
            <el-option label="已完成整改"
                       value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注:">
          <el-input :readonly="ifLook"
                    v-model="formState.remarks"
                    type="textarea"
                    :class="ifLook?'bag':''"
                    rows="6"
                    placeholder="请输入"></el-input>
        </el-form-item>
        <!-- <el-form-item label="备注:"
                      v-if="title !='整改事项明细'">
          <el-input :readonly="ifLook"

                    v-model="formState.remarks"
                    type="textarea"
                    rows="6"
                    placeholder="请输入"></el-input>
        </el-form-item>

        <el-form-item label="备注:"
                      v-if="title=='整改事项明细'">
          <el-input :readonly="ifLook"
                    v-model="formState.remarks"
                    type="textarea"
                    rows="6"
                    placeholder="请输入"></el-input>
        </el-form-item> -->
      </div>

      <!--   -->
      <el-form-item label="审核意见:"
                    v-if="type=='zgcs_examine'&&people=='gjr'">
        <el-input v-model="formState.auditCommend"
                  type="textarea"
                  rows="6"
                  placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="审核意见:"
                    v-if="type=='zgcs_examine'&&people=='leader'">
        <el-input v-model="formState.auditCommend2"
                  type="textarea"
                  rows="6"
                  placeholder="请输入"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer"
         class="dialog-footer">
      <el-button v-if="!ifLook"
                 @click="close">取 消</el-button>
      <el-button class="subBtn"
                 :disabled="isDisable"
                 v-if="!ifLook"
                 type="primary"
                 @click="save">保存</el-button>
      <el-button class="subBtn"
                 :disabled="isDisable"
                 v-if="!ifLook&&(formState.correctStatus==1||formState.correctStatus==5)"
                 type="primary"
                 @click="sub()">提交</el-button>
      <el-button class="subBtn"
                 :disabled="isDisable"
                 v-if="type=='zgcs_examine'&&(formState.correctStatus==2||formState.correctStatus==3)"
                 type="primary"
                 @click="examine('1')">通过</el-button>
      <el-button class="subBtn"
                 :disabled="isDisable"
                 v-if="type=='zgcs_examine'&&(formState.correctStatus==2||formState.correctStatus==3)"
                 type="primary"
                 @click="examine('2')">驳回</el-button>
    </div>
  </el-dialog>
</template>

<script>
import axios from "axios";
import Vault from "@WISDOMAUDIT/components/Vaultcertification";
import { down_file, correctStep_getById, correctStep_inputAlter, correctStep_submitAlter, correctStep_verifyLd, correctStep_verifyZgr } from
  '@SDMOBILE/api/shandong/ls'
export default {
  components: {
    Vault,
  },
  data () {
    return {
      fileDataList:[],//用来接收切割过的文件

      vaultV: false,
      sceneId: 1557, //经营指标、模型结果编号:1556 附件上传后下载编号:1557
      approvers: [], //审批人列表
      maxTime: "",//最大时间
      dqtime: "",//当前时间
      account: "",//返回的账户
      appSessionId: "",//应用sessionid
      downloaobj: {},//暂存的下载目标

      isDisable: false,
      headers: '',
      people: '',
      key: 0,
      isExamine: false,
      ifLook: false,
      title: '整改事项明细',
      formState: {
        problemName: '',
        problemDesc: '',
        correctAdvice: '',
        correctLimit: '',
        correctDeptName: '',
        correctPersonName: '',
        correctPlan: '',
        correctResult: '',
        unfinishedReason: '',
        correctStatus: '',
        remarks: '',
        auditCommend: '',
        ext1: '',
        ext2: '',
        ext3: '',
      },
      type: '',
      attachmentList1: [],
      attachmentList2: [],
      attachmentList3: [],
      fileList1: [],
      fileList2: [],
      fileList3: [],
      fileList1_del: [],
      fileList2_del: [],
      fileList3_del: [],
    }
  },
  created () {
    this.headers = { 'TOKEN': sessionStorage.getItem('TOKEN') }
  },
  methods: {
    // 分块上传开始
    // 上传文件之前
    beforeUpload(file, fileList,ext1) {
      //  调用函数分割文件 我这里是分割成不超过20M的文件快
      this.fileDataList = this.createFileChunk(file,1024*1024*3,ext1);
    },
    // 自定义文件上传的模式，方法
    myFileUpload(params,url,tableList,refName){
      /** 这里采用了循环请求，等全部循环上传请求完成以后再去执行合并请求的操作  Promise.all
       * 参数既有url参数也有body参数
       */
      if(this.fileDataList.length>0){

        this.ywUpload(this.fileDataList,params,url,tableList,refName,params.file.uid);
      }
      // let promiseAll = this.fileDataList.map(item => {
      //   let formData =  new FormData();
      //   formData.append('file', item.file);
      //   formData.append('chunkNumber', item.chunkNumber);
      //   formData.append('chunkSize', item.chunkSize);
      //   formData.append('totalSize', item.totalSize);
      //   formData.append('filename', item.filename);
      //   formData.append('relativePath', item.relativePath);
      //   formData.append('fileName', item.fileName);
      //   formData.append('fileSize', item.fileSize);
      //   formData.append('ext1', item.ext1);
      //   formData.append('totalChunks', item.totalChunks);
      //   formData.append('path', item.path);
      //   formData.append('identifier', item.identifier);
      //   return new Promise((resolve,reject) => {
      //     axios({
      //       method: 'post',
      //       headers: {
      //         'TOKEN': this.headers.TOKEN,
      //       },
      //       data: formData,
      //       url:url,
      //       // data: item.file,
      //     })
      //       .then(res=>{
      //         resolve(res.data.data)
      //       })
      //       .catch(err=>{
      //         reject(err)
      //       })
      //   })
      // })
      // Promise.all(promiseAll).then(resDataAll => {
      //  console.log(resDataAll)
      // })
    },
    ywUpload(list,params,url,tableList,refName,uid){
      const loading = this.$loading({
        lock: true,
        text: '上传中',
        spinner: 'el-icon-loading',
        background: 'transparent'
      });
      var data='';
      var left=[],right=list;
      var _obj=right.shift();
      let formData =  new FormData();
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
        url:url,
        // data: item.file,
      })
        .then(res=>{
          data=res.data.data;
          if(data.status&&data.status==1){
            loading.close();
            this.$message({
              message:data.fileName+ '上传成功',
              type: 'success'
            });
            tableList.push(data);
            console.log(tableList)
          }
          if(data.fileName&&data.status===0){
            loading.close();
            this.$message({
              message:data.fileName+ '上传失败,请重新上传',
              type: 'error'
            });
            var idx = this.$refs[refName].uploadFiles.findIndex(item => item.uid === uid) //去除文件列表失败文件（uploadFiles为el-upload中的ref值）
            this.$refs[refName].uploadFiles.splice(idx, 1) //去除文件列表失败文件
          }
          if(right.length>0){
            this.ywUpload(list,params,url,tableList,refName,uid);
          }
        })
        .catch(err=>{
          console.log(err);
          let uid = files.uid
          let idx = this.$refs[refName].uploadFiles.findIndex(item => item.uid === uid) //去除文件列表失败文件（uploadFiles为el-upload中的ref值）
          this.$refs[refName].uploadFiles.splice(idx, 1) //去除文件列表失败文件
        });
    },
    //随机数
    passwords(pasLen) {
      var pasArr = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','0','1','2','3','4','5','6','7','8','9','_','-','$','%','&','@','+','!'];
      var password = '';
      var pasArrLen = pasArr.length;
      for (var i=0; i<pasLen; i++){
        var x = Math.floor(Math.random()*pasArrLen);
        password += pasArr[x];
      }
      return password;
    },
    // 文件分割的方法
    createFileChunk(file, size = chunkSize,ext1) {
      var _idStr=this.passwords(16);
      const fileChunkList = [];
      let count = 0;
      let num = 1;
      var total=parseInt((file.size)/size);
      while (num <= total) {
        fileChunkList.push({
          file: file.slice(count, count + size),
          chunkNumber: num ,
          chunkSize:size,
          totalSize:file.size,
          filename:file.name,
          relativePath:file.name,
          fileName:file.name,
          fileSize:file.size,
          ext1:ext1,//模块名称
          totalChunks:total,
          path:'',
          identifier:_idStr,
        });
        count += size;
        num++
      }
      return fileChunkList
    },
    //分块上传结束

    //通过认证后的方法
    vdownload () {
      this.downFile(this.downloaobj.attachmentUuid, this.downloaobj.fileName)
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
    //信息保存
    setDetail () {
      this.isDisable = true;
      setTimeout(() => {
        this.isDisable = false;
      }, 3000);
      var uploadList1 = this.attachmentList1.concat(this.fileList1, this.fileList1_del);
      var uploadList2 = this.attachmentList2.concat(this.fileList2, this.fileList2_del);
      var uploadList3 = this.attachmentList3.concat(this.fileList3, this.fileList3_del);
      uploadList1.forEach((item) => {
        item.status = null;
      });
      uploadList2.forEach((item) => {
        item.status = null;
      });
      uploadList3.forEach((item) => {
        item.status = null;
      });

      var params = {
        attachmentList1: uploadList1,
        attachmentList2: uploadList2,
        attachmentList3: uploadList3,
        correctStep: this.formState,
      };
      return params;
    },
    //保存按钮点击
    save () {
      var params = this.setDetail();
      correctStep_inputAlter(params).then(resp => {
        if (resp.code == 0) {
          this.$message({
            message: "保存成功",
            type: "success",
          });
          this.isExamine = false;
          this.$nextTick(() => {
            this.$parent.list_data_start();
          })
        } else {
          this.$message({
            message: resp.data.msg,
            type: "error",
          });
        }

      })
    },
    //提交按钮点击
    sub () {
      var params = this.setDetail();
      correctStep_submitAlter(params).then(resp => {
        if (resp.code == 0) {
          this.$message({
            message: "提交成功",
            type: "success",
          });
          this.isExamine = false;
          this.$nextTick(() => {
            this.$parent.list_data_start();
            this.$parent.list_data();

          })
        } else {
          this.$message({
            message: resp.data.msg,
            type: "error",
          });
        }

      })
    },
    //审核和驳回按钮点击
    examine (type) {
      var params = this.setDetail();
      params.type = type;
      if (this.people == 'leader') {
        correctStep_verifyLd(params).then(resp => {
          if (resp.code == 0) {
            this.$message({
              message: "审核成功",
              type: "success",
            });
            this.isExamine = false;
            this.$nextTick(() => {
              this.$parent.list_data_start();
              this.$parent.list_data();

            })
          } else {
            this.$message({
              message: resp.data.msg,
              type: "error",
            });
          }

        })
      } else if (this.people == 'gjr') {
        correctStep_verifyZgr(params).then(resp => {
          if (resp.code == 0) {
            this.$message({
              message: "审核成功",
              type: "success",
            });
            this.isExamine = false;
            this.$nextTick(() => {
              this.$parent.list_data_start();
              this.$parent.list_data();

            })
          } else {
            this.$message({
              message: resp.data.msg,
              type: "error",
            });
          }

        })
      }
    },
    close () {
      this.isExamine = false;
    },
    init (title, type, id, people) {
      this.title = title;
      this.people = people;
      this.type = type;
      this.clearFileList();
      if (type == 'zgtz_look' || type == 'zgcs_examine') {
        this.ifLook = true;
      }
      correctStep_getById(id).then(resp => {
        var datas = resp.data;
        this.formState = datas.correctStep;
        if (datas.attachmentList1) {
          datas.attachmentList1.forEach((item) => {
            item.name = item.fileName;
            item.url = item.filePath;
            item.isDeleted = 0;
          });
        }
        if (datas.attachmentList2) {
          datas.attachmentList2.forEach((item) => {
            item.name = item.fileName;
            item.url = item.filePath;
            item.isDeleted = 0;
          });
        }
        if (datas.attachmentList3) {
          datas.attachmentList3.forEach((item) => {
            item.name = item.fileName;
            item.url = item.filePath;
            item.isDeleted = 0;
          });
        }
        this.fileList1 = datas.attachmentList1 || [];
        this.fileList2 = datas.attachmentList2 || [];
        this.fileList3 = datas.attachmentList3 || [];
        this.isExamine = true;
      });

    },
    //清除附件列表
    clearFileList () {
      this.attachmentList1 = [];
      this.attachmentList2 = [];
      this.attachmentList3 = [];
      this.fileList1 = [];
      this.fileList2 = [];
      this.fileList3 = [];
      this.fileList1_del = [];
      this.fileList2_del = [];
      this.fileList3_del = [];
      this.ifLook = false;
    },
  }
}
</script>

<style scoped>
/* textarea[readonly],
>>> .el-textarea .el-textarea__inner {
  background-color: #eef1f6;
  cursor: not-allowed;
} */

>>> .zgLabel .el-form-item__label {
  width: 27% !important;
}
>>> .zgLabel .el-form-item__content {
  width: 56%;
}
.left-100 {
  box-sizing: border-box;
  padding: 0 100px;
}
>>> .left-100 .el-input {
  width: 40% !important;
  margin-right: 20px;
  vertical-align: top;
}
>>> .left-100 .upload-demo {
  width: 50% !important;
  vertical-align: top;
}
>>> .zl-up-btn .el-icon-upload2 {
  color: #49bae8 !important;
  font-weight: bold;
  transform: scale(1.2);
}
>>> .left-100 .itemTwo .el-input {
  width: 100% !important;
  margin-right: 0;
}
.zl-title {
  margin-top: 20px;
  font-weight: bold;
}
>>> .formData .el-input.is-disabled .el-input__inner,
>>> .formData .el-textarea.is-disabled .el-textarea__inner,
.bag >>> .el-textarea__inner,
.bag >>> .el-textarea__inner:focus {
  border: 1px solid #dfe4ed !important;
  /* color: rgba(0, 0, 0, 0.4) !important; */
  color: #606266 !important;
  background: #f5f7fa !important;
  cursor: not-allowed;
}
.formData .el-input__inner::placeholder {
  color: #c1c1c1 !important;
}
/* 谷歌 */
.formData .el-input__inner::-webkit-input-placeholder {
  color: #c1c1c1 !important;
}
/* 火狐 */
.formData .el-input__inner:-moz-placeholder {
  color: #c1c1c1 !important;
}
/*ie*/
.formData .el-input__inner:-ms-input-placeholder {
  color: #c1c1c1 !important;
}
.formData ::-webkit-input-placeholder {
  color: #c1c1c1 !important;
}
@media (min-width: 1500px) and (max-width: 1600px) {
  .itemTwo {
    width: 49.5%;
  }
}
@media (min-width: 1600px) and (max-width: 1800px) {
  .itemTwo {
    width: 49%;
  }
}
@media (min-width: 1800px) {
  .itemTwo {
    width: 48.7%;
  }
}
</style>
