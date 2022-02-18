<template>
  <div class="sjzl">
    <!-- tab 切换 -->
    <Vault :vaultV="vaultV"
           :sceneId="sceneId"
           :approvers="approvers"
           :maxTime="maxTime"
           :dqtime="dqtime"
           :account="account"
           :appSessionId="appSessionId"
           @changevault="changevault"
           @vdownload="vdownload"></Vault>
    <div>
      <div class="projectTab">
        <el-table @row-dblclick="getLook"
                  :header-cell-style="{'text-align':'left','background-color': '#F4FAFF',}"
                  :data="tableData"
                  stripe
                  style="width: 100%"
                  @select="Selects">
          <el-table-column algin="left"
                           type="index"
                           width="70"
                           label="编号"> </el-table-column>
          <el-table-column align="left"
                           prop="basyName"
                           label="资料名称">
            <template slot-scope="scope">
              <el-popover :popper-class="tableFileList==''?'no-padding':''"
                          placement="bottom"
                          width="250"
                          @show="getFileList(scope.row.basyUuid)"
                          trigger="click">
                <ul v-if="tableFileList!=''"
                    class="fileList-ul">
                  <li class="tableFileList-title">文件名称</li>
                  <!--<li v-for="item in tableFileList" class="pointer blue" @click="downFile(item.attachment_uuid,item.file_name)"><i class="orange el-icon-folder-opened"></i>{{item.file_name}}</li>-->
                  <li v-for="item in tableFileList"
                      class="pointer blue"
                      @click="openVault(item)">{{item.file_name}}</li>
                </ul>
                <div slot="reference"
                     class="pointer blue">{{scope.row.basyName}}</div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column algin="left"
                           prop="basySymbol"
                           label="文号"> </el-table-column>
          <el-table-column algin="left"
                           prop="publishDepartment"
                           label="发文部门"> </el-table-column>
          <el-table-column algin="left"
                           prop="issueDate"
                           label="发文日期">
            <template slot-scope="scope">{{
              scope.row.issueDate | dateformat
              }}</template>
          </el-table-column>
          <el-table-column algin="left"
                           label="操作">
            <template slot-scope="scope">
              <!-- -->
              <el-button type="text"
                         size="small"
                         v-if="Edit == true"
                         class="delete blue"
                         @click="edit(scope.row)">编辑</el-button>

              <!-- -->
              <el-button class="delete red"
                         type="text"
                         v-if="Delete == true"
                         size="small"
                         @click="deletes(scope.row.basyUuid)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页 -->
      <div class="page">
        <el-pagination :current-page="page.current"
                       :page-size="page.size"
                       :page-sizes="[10, 50, 100]"
                       :total="page.total"
                       @current-change="handleCurrentChange"
                       @size-change="handleSizeChange"
                       layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </div>
      <!-- 分页 end-->
    </div>
    <el-dialog @close="close"
               :append-to-body='true'
               :visible.sync="isAdd"
               v-if="isAdd"
               :destroy-on-close="true"
               width="6 0%"
               center
               class="qrd-dialog">
      <div class="title">{{title}}</div>
      <el-form ref="addForm"
               :model="formState"
               :rules="rules"
               class="formData"
               label-width="100px">
        <el-form-item class="itemTwo"
                      prop="basyName"
                      label="资料名称:">
          <el-input :disabled="ifLook"
                    v-model="formState.basyName"
                    placeholder="请输入资料名称"></el-input>
        </el-form-item>
        <el-form-item class="itemTwo"
                      prop="basySymbol"
                      label="文号:">
          <el-input :disabled="ifLook"
                    v-model="formState.basySymbol"
                    placeholder="请输入文号"></el-input>
        </el-form-item>
        <el-form-item class="itemTwo"
                      prop="keyClauses"
                      label="重点条款:">
          <el-input :disabled="ifLook"
                    v-model="formState.keyClauses"
                    placeholder="请输入重点条款"></el-input>
        </el-form-item>
        <el-form-item class="itemTwo"
                      prop="issueDate"
                      label="发文日期:">
          <el-date-picker :disabled="ifLook"
                          v-model="formState.issueDate"
                          type="date"
                          placeholder="请选择发文日期"
                          format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>

        <el-form-item class="itemTwo"
                      prop="publishDepartment"
                      label="发文部门:">
          <el-input :disabled="ifLook"
                    v-model="formState.publishDepartment"
                    placeholder="请输入发文部门"></el-input>
        </el-form-item>
        <el-form-item class="itemTwo"
                      style="visibility: hidden;"
                      prop="issueDate"
                      label="发文日期:">
          <el-date-picker :disabled="ifLook"
                          v-model="formState.issueDate"
                          type="date"
                          placeholder="请选择发文日期"
                          format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>

        <el-form-item class="itemTwo"
                      style="display:flex"
                      label="上传附件:">
          <!--<el-upload v-if="!ifLook"-->
          <!--class="upload-demo"-->
          <!--drag-->
          <!--action="/wisdomaudit/auditBasy/filesUpload"-->
          <!--:on-success="handleChangePic"-->
          <!--:before-remove="handleRemoveApk"-->
          <!--accept=".docx,.xls,.xlsx,.txt,.zip,.doc"-->
          <!--:file-list="fileList"-->
          <!--multiple-->
          <!--:key="key"-->
          <!--:headers="headers">-->
          <!--<i class="el-icon-upload"></i>-->
          <!--<div class="el-upload__text">-->
          <!--点击上传或将文件拖到虚线框<br />支持.docx .xls .xlsx .txt .zip .doc-->
          <!--</div>-->
          <!--</el-upload>-->
          <el-upload v-if="!ifLook"
                     class="upload-demo"
                     drag
                     ref="upload"
                     action="#"
                     :http-request="( params)=>{myFileUpload( params,'/wisdomaudit/auditBasy/filesUpload',apkFiles)}"
                     :before-upload="beforeUpload"
                     :before-remove="handleRemoveApk"
                     accept=".docx,.xls,.xlsx,.txt,.zip,.doc"
                     :file-list="fileList"
                     multiple
                     :key="key"
                     :headers="headers">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              点击上传或将文件拖到虚线框<br />支持.docx .xls .xlsx .txt .zip .doc
            </div>
          </el-upload>
          <div v-if="ifLook">
            <div v-for="(item,index) in fileList">{{item.name}}</div>
          </div>
        </el-form-item>
        <el-form-item label="附件内容:"
                      prop="content">
          <el-input :disabled="ifLook"
                    type="textarea"
                    v-model="formState.content"
                    :rows="6"
                    style="flex:1;"
                    :placeholder="'模板:\n第一章 货币资金审计\n第一条 现金的账实是否属实\n1.确定所有现金存放地点和用途\n2.现场键盘库存现金'"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button v-if="!ifLook"
                   :disabled="isDisable"
                   class="subBtn"
                   type="primary"
                   @click="sub">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
import Vault from "@WISDOMAUDIT/components/Vaultcertification";
import { del_file_batch, down_file, del_file, auditBasy_pageList, auditBasy_save, auditBasy_delete, auditBasy_getDetail, auditBasy_getFileList } from
  '@SDMOBILE/api/shandong/ls'



import '@WISDOMAUDIT/styles/from.scss'
export default {
  components: {
    Vault,
  },

  props: ['Add', 'Edit', 'Delete',],
  data () {
    return {
      fileData: {},
      uploadProgress: false,
      fileDataList: [],
      fileLeftList: [],

      vaultV: false,
      sceneId: 1557, //经营指标、模型结果编号:1556 附件上传后下载编号:1557
      approvers: [], //审批人列表
      maxTime: "",//最大时间
      dqtime: "",//当前时间
      account: "",//返回的账户
      appSessionId: "",//应用sessionid
      downloaobj: {},//暂存的下载目标

      headers: '',
      isDisable: false,
      ifLook: false,
      key: 0,
      title: "",
      formState: {
        basyName: "",
        basySymbol: "",
        keyClauses: "",
        issueDate: "",
        publishDepartment: "",
        content: "",
      },
      text: "",
      isAdd: false,
      btn: false,
      activeName: 0,
      // color: '',   // 上传文件icon 颜色

      tableData: [

      ],
      tableFileList: [],
      searchForm: {
        pageNo: 1,
        pageSize: 10,
        basyName: '',
        issueDate: '',
        publishDepartment: ''
      },
      page: {
        current: 1,
        size: 10,
        total: 0
      },
      apkFiles: [],//附件上传列表
      fileList: [],//附件上传回显列表
      // 新增的表单验证
      rules: {
        basyName: [
          { required: true, message: "请填写资料名称", trigger: "blur" },
        ],
        basySymbol: [
          { required: true, message: "请填写文号", trigger: "blur" },
        ],
        publishDepartment: [
          { required: true, message: "请填写发文部门", trigger: "blur" },
        ],
        issueDate: [
          { required: true, message: "请填写发文日期", trigger: "blur" },
        ],
        content: [
          { required: true, message: "请填写附件内容", trigger: "blur" },
        ],
      },

    };
  },
  computed: {},
  watch: {},
  methods: {
    // 上传文件之前
    beforeUpload (file, fileList) {
      this.uploadProgress = true;
      this.fileData = file;
      //  调用函数分割文件 我这里是分割成不超过20M的文件快
      this.fileDataList = this.createFileChunk(file, 1024 * 1024 * 3);
      console.log(this.fileDataList)
    },
    // 自定义文件上传的模式，方法
    myFileUpload (params, url, tableList) {
      /** 这里采用了循环请求，等全部循环上传请求完成以后再去执行合并请求的操作  Promise.all
       * 参数既有url参数也有body参数
       */
      if (this.fileDataList.length > 0) {
        this.ywUpload(this.fileDataList, params, url, tableList);
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
    ywUpload (list, params, url, tableList) {
      var data = '';
      var left = [], right = list;
      var _obj = right.shift();
      console.log(_obj);
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
          console.log(res.data.data);
          data = res.data.data;
        })
        .catch(err => {
          console.log(err)
        });

      if (right.length > 0) {
        this.ywUpload(list, params, url, tableList);
      }
    },
    // 文件分割的方法
    createFileChunk (file, size = chunkSize) {
      console.log(file);
      const fileChunkList = [];
      let count = 0;
      let num = 1;
      var total = parseInt((file.size) / size);
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
          ext1: '审计依据',
          totalChunks: total,
          path: '',
          identifier: new Date().getTime(),
        });
        count += size;
        num++
      }
      return fileChunkList
    },


    //通过认证后的方法
    vdownload () {
      this.downFile(this.downloaobj.attachment_uuid, this.downloaobj.file_name)
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

    //删除
    deletes (val) {
      // console.log(val)
      this.$confirm(`确认删除该条数据吗?删除后数据不可恢复`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        auditBasy_delete(val).then(resp => {
          // console.log(resp.data);
          if (resp.code == 0) {
            ({
              message: "删除成功",
              type: "success",
            });
            if (this.tableData.length == 1) {
              this.searchForm.pageNo = this.searchForm.pageNo - 1;
            }
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
    addlist () {
      this.isAdd = true;
      this.ifLook = false;
      this.title = "新增审计依据";
    },
    Selects (selection, row) {
      // console.log(selection, row);
      this.btn = !this.btn;
    },
    deleteRow (index, rows) {
      rows.splice(index, 1);
    },
    //处理附件内容
    setContent (arr) {
      var str = '';
      arr.forEach((item) => {
        str += item.attachmentContent + "\n"
      })
      return str;
    },
    //编辑
    edit (row) {
      this.clearForm();
      this.isAdd = true;
      this.ifLook = false;
      this.title = "编辑审计依据";
      auditBasy_getDetail(row.basyUuid).then(resp => {
        var datas = resp.data;
        this.formState = datas;
        // this.formState.basyName=datas.basyName;
        // this.formState.basySymbol=datas.basySymbol;
        // this.formState.keyClauses=datas.keyClauses;
        // this.formState.issueDate=datas.issueDate;
        // this.formState.publishDepartment=datas.publishDepartment;
        this.formState.content = this.setContent(datas.treeData.arr);
        datas.attachmentList.forEach((item) => {
          var v = {
            name: item.file_name,
            url: item.file_path,
            attachmentUuid: item.attachment_uuid
          }
          this.fileList.push(v);
        })
      })

    },
    //查看
    getLook (row, column, event) {
      this.clearForm();
      this.isAdd = true;
      this.title = "查看审计依据";
      this.ifLook = true;
      auditBasy_getDetail(row.basyUuid).then(resp => {
        var datas = resp.data;
        this.formState = datas;
        // this.formState.basyName=datas.basyName;
        // this.formState.basySymbol=datas.basySymbol;
        // this.formState.keyClauses=datas.keyClauses;
        // this.formState.issueDate=datas.issueDate;
        // this.formState.publishDepartment=datas.publishDepartment;
        this.formState.content = this.setContent(datas.treeData.arr);
        datas.attachmentList.forEach((item) => {
          var v = {
            name: item.file_name,
            url: item.file_path,
            attachmentUuid: item.attachment_uuid
          }
          this.fileList.push(v);
        })
      })
    },
    //列表数据
    list_data_start () {
      // debugger
      var issueDate = '';
      if (this.searchForm.issueDate) {
        const difference = new Date().getTimezoneOffset() * 60 * 1000;
        issueDate = new Date(this.searchForm.issueDate).getTime() - difference;
      }

      let params = {
        pageNo: this.searchForm.pageNo,
        pageSize: this.searchForm.pageSize,
        condition: {
          basyName: this.searchForm.basyName,
          issueDate: this.searchForm.issueDate,
          publishDepartment: this.searchForm.publishDepartment,
        }
      };
      this.loading = true
      auditBasy_pageList(params).then(resp => {
        var datas = resp.data;
        this.tableData = datas.records;
        this.page = {
          current: datas.current,
          size: datas.size,
          total: datas.total
        };
        this.loading = false
      })
    },
    //查询按钮点击传参
    getSearchForm (data) {
      this.searchForm.basyName = data.basyName;
      this.searchForm.issueDate = data.issueDate;
      this.searchForm.publishDepartment = data.publishDepartment;
      this.searchForm.pageNo = 1;
      this.list_data_start();
    },
    //分页点击
    handleSizeChange (val) {
      this.searchForm.pageSize = val;
      this.list_data_start();
    },
    handleCurrentChange (val) {
      this.searchForm.pageNo = val;
      this.list_data_start();
    },
    //附件上传成功
    handleChangePic (response, file, fileList) {
      if (response && response.code === 0) {
        this.apkFiles.push(response.data);
        this.$message({
          message: '上传成功',
          type: 'success',
          duration: 1500,
          onClose: () => {
            // this.apkFiles.push(response.data);
            // console.log(this.apkFiles,3333)
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
    handleRemoveApk (file, fileList) {
      var ifDel = true, that = this;
      var id = file.response ? file.response.data.attachmentUuid : file.attachmentUuid;
      return new Promise(function (resolve, reject) {
        del_file(id).then(resp => {
          if (resp.code == 0) {
            that.$message({
              message: "删除成功",
              type: "success",
            });
            if (file.response) {
              that.apkFiles.remove(file.response.data);
              that.key = Math.random();
            } else {
              // console.log(file)
              that.fileList.remove(file);
              that.formState.attachmentList = that.formState.attachmentList.filter((item) => { item.attachment_uuid != file.attachmentUuid })
              // console.log(that.formState.attachmentList,222)
            }
            return true;

          } else {
            that.$message({
              message: resp.data.msg,
              type: "error",
            });
            ifDel = false;
            resolve(ifDel);
            return ifDel;
          }
        });
      }).then(function (val) {
        reject(val);
        return val
      })
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
    //保存数据
    sub () {
      this.isDisable = true;
      setTimeout(() => {
        this.isDisable = false;
      }, 3000)
      // debugger;
      var attachmentUuidList = [];
      this.apkFiles.forEach((item) => {
        attachmentUuidList.push(item.attachmentUuid)
      });
      if (this.formState.attachmentList) {
        this.formState.attachmentList.forEach((item) => {
          attachmentUuidList.push(item.attachment_uuid)
        });
      }
      this.formState.attachmentUuidList = attachmentUuidList;

      this.$refs['addForm'].validate((valid) => {
        if (valid) {

          if (this.formState.attachmentUuidList.length == 0) {
            this.$message.error("请上传附件");
            return false;
          }
          auditBasy_save(this.formState).then(resp => {
            if (resp.code == 0) {
              this.$message({
                message: "保存成功",
                type: "success",
              });
              this.isAdd = false;
              this.list_data_start();
              this.clearForm();
            } else {
              this.$message({
                message: resp.data.msg,
                type: "error",
              });
            }
          })
        } else {
          this.$message.error("请添加必填项和正确的数据格式");
          return false;
        }
      });
    },
    //关闭弹窗
    close () {
      this.isAdd = false;
      var ids = [];
      this.apkFiles.forEach((item) => {
        ids.push(item.attachmentUuid)
      });
      // console.log(this.apkFiles,ids)
      if (ids != '') {
        del_file_batch(ids.join(",")).then(resp => {
          // if (resp.code == 0) {
          //   this.$message({
          //     message: "删除成功",
          //     type: "success",
          //   });
          // } else {
          //   this.$message({
          //     message: resp.data.msg,
          //     type: "error",
          //   });
          // }
        });
      }
      this.clearForm();
    },
    //清除数据
    clearForm () {
      this.formState = {
        basyName: "",
        basySymbol: "",
        keyClauses: "",
        issueDate: "",
        publishDepartment: "",
        content: "",
      }
      this.fileList = [];
      this.apkFiles = [];
      this.isDisable = false;
    },
    //点击资料名称显示附件列表
    getFileList (id) {
      this.tableFileList = [];
      auditBasy_getFileList(id).then(resp => {
        this.tableFileList = resp.data.attachmentList;
        console.log(this.tableFileList);
      })
    }
  },
  created () {
    this.headers = { 'TOKEN': sessionStorage.getItem('TOKEN') }
  },
  mounted () {
    this.list_data_start()

  },
};
</script>

<style scoped>
@import "../../../assets/styles/css/yw.css";
.bumen {
  text-align: left;
}
.blue,
.red {
  border: 1px solid red;
  background: none !important;
  border: none;
  text-decoration: none !important;
}
/* .qrd-dialog >>> .el-form-item__label {
  padding-right: 10px !important;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 120px !important;
} */

/* 附件 */
.formData >>> .upload-demo {
  width: 340px;
}
.formData >>> .el-uoload {
  width: 100%;
}
.formData >>> .el-upload-dragger {
  width: 340px !important;
}
/* 附件 end*/

.el-tabs {
  padding: 1%;
}
.delete {
  margin-left: 10px;
}
.sjzl {
  /*margin-top: 10px;*/
  padding: 10px;
}
.sjzl .conter {
  width: 100%;
  float: left;
}
.tab_ul {
  width: 100%;
  float: left;
  height: 50px;

  border-bottom: 2px solid #eeeeee;
}
.titleMes {
  box-sizing: border-box;
}
.sjzl >>> .el-table__header {
  border-top: none !important;
}
.update {
  display: flex;
  align-items: center;
  justify-content: center;
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
.page {
  width: 100%;
  padding: 20px 10px;
  display: flex;
  justify-content: flex-end;
}
.update_icon svg {
  margin-top: 5px;
}
>>> .qrd-dialog .el-dialog__header,
>>> .qrd-dialog .el-dialog__body {
  padding: 0 !important;
}
.formData {
  padding-top: 20px !important;
}
>>> .qrd-dialog .el-dialog__headerbtn {
  top: 15px !important;
  right: 15px !important;
}
>>> .qrd-dialog .el-dialog__footer {
  padding-left: 35px !important;
  padding-right: 35px !important;
}
</style>
