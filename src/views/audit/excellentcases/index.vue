<template>
  <div>
    <div class="conter ">
      <!-- tab 切换 -->
      <el-tabs v-model="activeName"
               @tab-click="handleClick">
        <!-- 资料清单 -->
        <el-tab-pane label="资料清单"
                     name="0">
          <!-- 新增 筛选-->
          <el-row class="titleMes">
            <el-col :span="1.5">
              <el-button type="primary"
                         style="border:none;"
                         @click="add_data_click()"
                         v-if="is_add==1">新增资料</el-button>
            </el-col>
            <!-- 筛选 -->
            <div class="search">
              <el-input placeholder="请输入资料标题"
                        v-model="list_query.dataTitle"> </el-input>
              <div class="search_icon"
                   style="background: rgb(12, 135, 214) !important;"
                   @click="search_list(1)">
                <i class="el-icon-search"
                   style="color: rgba(255, 255, 255, 1);"></i>
              </div>
            </div>
          </el-row>

          <el-table :data="tableData_list.records"
                    style="width: 100%;"
                    v-loading="loading"
                    :header-cell-style="{'background-color': '#F4FAFF',}">

            <el-table-column type="index"
                             align="center"
                             label="序号">
            </el-table-column>
            <!-- 标题 -->
            <el-table-column prop="dataTitle"
                             show-overflow-tooltip
                             label="资料标题">

              <template slot-scope="scope">
                <p v-if="scope.row.dataTitle">{{scope.row.dataTitle}}</p>
                <p v-else>--</p>
              </template>

            </el-table-column>
            <!-- 资料分类 -->
            <el-table-column prop="dataSortName"
                             show-overflow-tooltip
                             label="资料分类">

              <template slot-scope="scope">
                <p v-if="scope.row.dataSortName">{{scope.row.dataSortName}}</p>
                <p v-else>--</p>
              </template>

            </el-table-column>
            <!-- 来源项目 -->
            <el-table-column prop="sourceItem"
                             show-overflow-tooltip
                             label="来源项目">

              <template slot-scope="scope">
                <p v-if="scope.row.sourceItem">{{scope.row.sourceItem}}</p>
                <p v-else>--</p>
              </template>

            </el-table-column>
            <!-- 资料简介 -->
            <el-table-column prop="dataIntroduce"
                             show-overflow-tooltip
                             label="资料简介">

              <template slot-scope="scope">
                <p v-if="scope.row.dataIntroduce">{{scope.row.dataIntroduce}}</p>
                <p v-else>--</p>
              </template>

            </el-table-column>
            <!-- 创建人 -->
            <el-table-column prop="createUserName"
                             show-overflow-tooltip
                             label="创建人">

              <template slot-scope="scope">
                <p v-if="scope.row.createUserName">{{scope.row.createUserName}}</p>
                <p v-else>--</p>
              </template>

            </el-table-column>
            <!-- 创建时间 -->
            <el-table-column prop="createTime"
                             show-overflow-tooltip
                             label="创建时间">

              <template slot-scope="scope">
                <p v-if="scope.row.createTime">{{scope.row.createTime | filtedate}}</p>
                <p v-else>--</p>
              </template>

            </el-table-column>
            <!-- 下载总次数 -->
            <el-table-column prop="downNum"
                             show-overflow-tooltip
                             label="下载总次数">

              <template slot-scope="scope">
                <p v-if="scope.row.downNum">{{scope.row.downNum}}</p>
                <p v-else>--</p>
              </template>

            </el-table-column>
            <!-- 操作 -->
            <el-table-column prop="title"
                             width="180"
                             show-overflow-tooltip
                             label="操作">
              <template slot-scope="scope">
                <el-button @click="edit(scope.row)"
                           type="text"
                           :disabled="isDisable"
                           style="color:#0c87d6;background:none;border:none;
                            font-size: 14px !important;"
                           size="small">
                  编辑
                </el-button>

                <el-button @click="file_list(scope.row)"
                           type="text"
                           style="color:#0c87d6;background:none;border:none;
                            font-size: 14px !important;"
                           size="small">
                  文件管理
                </el-button>

                <el-button @click="remove(scope.row)"
                           type="text"
                           :disabled="isDisable"
                           style="color:#ff8a72;background:none;border:none;
                            font-size: 14px !important;"
                           size="small">
                  删除
                </el-button>
              </template>
            </el-table-column>

          </el-table>
          <!-- 分页 -->
          <div class="page">
            <el-pagination @size-change="handleSizeChange_data"
                           @current-change="handleCurrentChange_data"
                           :page-size="this.tableData_list.size"
                           :current-page="this.tableData_list.current"
                           layout="total, sizes, prev, pager, next, jumper"
                           :total="this.tableData_list.total">
            </el-pagination>
          </div>
          <!-- 分页 end-->
        </el-tab-pane>
        <!-- 资料清单 end -->
        <!-- 主要发现 -->
        <el-tab-pane label="主要发现"
                     name="1">
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 资料清单 新增 -->
    <el-dialog title=""
               center
               :close-on-click-modal="false"
               @close="resetForm('add_data')"
               :visible.sync="dialogVisible"
               width="30%">
      <div class="title_dlag">{{edit_title}} </div>

      <div class="dlag_conter">

        <el-form label-width="100px"
                 :rules="rules"
                 :model="add_data"
                 ref="add_data">
          <el-form-item label="资料标题："
                        prop="dataTitle">
            <el-input v-model="add_data.dataTitle"
                      placeholder="请输入资料标题"></el-input>
          </el-form-item>

          <el-form-item label="资料分类："
                        prop="dataSortName">
            <el-select v-model="add_data.dataSortName"
                       @change="select_val"
                       :disabled="edit_title=='编辑资料'?true:false"
                       filterable
                       placeholder="请选择资料分类">
              <el-option v-for="item in options_select"
                         :key="item.uuid"
                         :label="item.label"
                         :value="item.uuid">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="来源项目：">
            <el-input v-model="add_data.sourceItem"
                      placeholder="请输入来源项目"></el-input>
          </el-form-item>

          <el-form-item label="资料简介：">
            <el-input type="textarea"
                      v-model="add_data.dataIntroduce"
                      placeholder="请输入资料简介"></el-input>
          </el-form-item>

        </el-form>
      </div>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   v-if="edit_title =='新增资料'"
                   :disabled="isDisable"
                   @click="add_save('add_data')">确 定</el-button>

        <el-button type="primary"
                   v-if="edit_title == '编辑资料'"
                   :disabled="isDisable"
                   @click="update_save('add_data')">确 定</el-button>

      </div>
    </el-dialog>
    <!-- 资料清单 新增 end-->

    <!-- 文件管理 -->
    <el-dialog title=""
               center
               :close-on-click-modal="false"
               :visible.sync="dialogVisible_file"
               width="60%">
      <div class="title_dlag">文件管理 </div>

      <div class="dlag_conter list_conter">
        <!-- 左侧资料树 -->
        <div class="left_data_list">
          <el-tree :data="data_list"
                   :props="defaultProps"
                   class="pageTree"
                   :highlight-current="true"
                   node-key="uuid"
                   ref="el_tree"
                   :current-node-key="pdictid"
                   :default-expanded-keys="expandDefault"
                   @node-click="handleNodeClick">

            <span class="custom-tree-node content-style"
                  slot-scope="{ node, data }">
              <span>
                <img src="../../../assets/styles/image/file.png"
                     alt="">
                <span>{{ node.label }}</span>
              </span>
            </span>
            <!-- </span> -->
          </el-tree>

        </div>
        <!-- 左侧资料树 end-->

        <!-- 右侧内容 -->
        <div class="right_table"
             v-if="this.referenceTableUuid">
          <el-row class="btn_type">
            <el-col :span="1.5">
              <el-button type="primary"
                         :disabled="isDisable"
                         @click="download()">文件下载</el-button>
            </el-col>
            <el-col :span="1.5">
              <el-upload class="upload-demo"
                         style="margin:0 10px"
                         :on-progress="up_ing"
                         action="#"
                         :headers="headers"
                         :show-file-list="false"
                         :http-request="handleUploadForm"
                         :file-list="fileList"
                         accept=".zip,.doc,.docx,.xls,.xlsx,.txt">
                <el-button type="primary"
                           v-if="success_btn2 ==0"
                           @click="up()">文件上传</el-button>
                <el-button v-if="success_btn2 ==1"
                           type="primary"
                           :loading="true">上传中</el-button>
              </el-upload>

            </el-col>
            <el-col :span="1.5">
              <el-button type="primary"
                         :disabled="isDisable"
                         @click="remove_list()">删除</el-button>
            </el-col>
          </el-row>

          <el-table :data="file_table"
                    v-loading="loading_file_table"
                    :header-cell-style="{'background-color': '#F4FAFF',}"
                    style="width: 100%;"
                    @selection-change="handleSelectionChange_operation">
            >
            <el-table-column type="selection"
                             width="55">
            </el-table-column>
            <el-table-column prop="fileName"
                             show-overflow-tooltip
                             label="文件名称">

              <template slot-scope="scope">
                <p v-if="scope.row.fileName">
                  {{scope.row.fileName}}
                </p>
                <p v-else>
                  --
                </p>
              </template>

            </el-table-column>

            <el-table-column prop="createTime"
                             show-overflow-tooltip
                             label="上传时间">
              <template slot-scope="scope">
                <p v-if="scope.row.createTime">{{scope.row.createTime | filtedate}}</p>
                <p v-else>--</p>
              </template>

            </el-table-column>

            <el-table-column prop="createUserName"
                             show-overflow-tooltip
                             label="上传人">

              <template slot-scope="scope">
                <p v-if="scope.row.createUserName">
                  {{scope.row.createUserName}}
                </p>
                <p v-else>
                  --
                </p>
              </template>
            </el-table-column>

            <el-table-column prop="downNum"
                             show-overflow-tooltip
                             label="下载次数">
              <template slot-scope="scope">
                <p v-if="scope.row.downNum">{{scope.row.downNum}}</p>
                <p v-else>0</p>
              </template>

            </el-table-column>

          </el-table>

        </div>

        <!-- 右侧内容 end-->
      </div>

      <!-- <div slot="footer">
        <el-button @click="dialogVisible_file = false">取 消</el-button>
        <el-button type="primary"
                   @click="dialogVisible_file = false">确 定</el-button>
      </div> -->
    </el-dialog>

    <!-- 文件管理 end-->

  </div>
</template>

<script>
import axios from "axios";
import { pageList, save_query, loadcascader, update, deleteEntity, toManagementList, uploadFile, queryByFid, deleteAttachment, fileDownload } from
  '@SDMOBILE/api/shandong/excellentcases'
import { fmtDate } from "@SDMOBILE/model/time.js";

export default {
  components: {},
  data () {
    return {
      isDisable: false,//不可编辑

      dqtoken: "",
      headers: '',
      activeName: 0,//0:资料清单,1:主要发现
      is_add: 1,//新增
      loading: false,
      list_query: {
        pageNo: 1,
        pageSize: 10,
        dataTitle: '',//筛选
      },
      // 列表
      tableData_list: [
        { title: '1' }
      ],//
      isDisable: false,
      dialogVisible: false,//弹窗
      edit_title: '新增资料',//新增 编辑 资料清单 弹窗
      // 添加资料清单参数
      add_data: {
        dataTitle: '',//标题
        dataSortId: '',//分类id
        dataSortCode: '',//分类code
        dataSortName: '',//分类name
        sourceItem: '',//来源项目
        dataIntroduce: '',// 简介
        referenceTableUuid: '',//主键id
      },
      // 验证
      rules: {
        dataTitle: [{ required: true, message: '请填写资料标题', trigger: 'blur' }],
        dataSortName: [{ required: true, message: '请选择分类', trigger: 'change' }],
      },

      success_btn2: 0,// 上传
      // 资料分类
      options_select: [],

      dialogVisible_file: false,//文件管理弹窗
      // 资料树
      data_list: [
      ],
      defaultProps: {
        // children: 'children',
        label: 'dictname',

      },
      checkDefault: [],
      pdictid: "",//默认选择节点
      expandDefault: [],//默认展开的资料书


      referenceTableUuid: '',//主键id
      loading_file_table: false,//资料右侧列表loading
      file_table: [],// 文件列表
      data_list_check: [],//列表多选
      isDisable: false,//防止重复提交

      // 上传
      fileList: [],
    }
  },
  computed: {},
  watch: {},
  created () {
    this.headers = { 'TOKEN': sessionStorage.getItem('TOKEN') }
    this.dqtoken = sessionStorage.getItem("TOKEN");
    this.pageList_data();//列表
  },
  mounted () {

  },

  filters: {
    filtedate: function (date) {
      let t = new Date(date);
      // return fmtDate(t, 'yyyy-MM-dd hh:mm:ss');
      return fmtDate(t, "yyyy-MM-dd ");
    },
  },
  methods: {
    // 顶部tab 切换事件
    handleClick (val, event) {
      if (val.index == 0) {
      } else {
        console.log(2);
      }
    },
    // 列表数据
    pageList_data () {
      let params = {
        pageNo: this.list_query.pageNo,
        pageSize: this.list_query.pageSize,
        condition: {
          dataTitle: this.list_query.dataTitle,
        }
      };
      this.loading = true;
      pageList(params).then(resp => {
        this.loading = false;
        this.tableData_list = resp.data;
      })
    },
    // 资料清单 没页
    handleSizeChange_data (val) {
      this.list_query.pageSize = val;
    },
    // 资料清单 分页
    handleCurrentChange_data (val) {
      this.list_query.pageNo = val;
      this.pageList_data();//列表
    },
    // 筛选
    search_list (index) {
      if (index == 1) {
        // 资料清单
        this.pageList_data();//列表
      } else {
        // 主要发现
      }
    },
    // 新增资料弹窗
    add_data_click () {
      this.edit_title = '新增资料'
      this.dialogVisible = true;
      this.loadcascader_data();//资料分类
    },
    // 资料分类
    loadcascader_data () {
      let params = {
        typecode: 'zskyxaljnc'
      }
      loadcascader(params).then(resp => {
        this.options_select = resp.data
      })
    },
    // 获取分类
    select_val (val) {
      let obj = {};
      obj = this.options_select.find((item) => {
        return item.uuid == val;
      });
      this.add_data.dataSortId = obj.uuid; //分类id key
      this.add_data.dataSortCode = obj.value; //分类code
      this.add_data.dataSortName = obj.label; //分类name

    },
    // 新增保存
    add_save (add_data) {
      this.isDisable = true
      setTimeout(() => {
        this.isDisable = false
      }, 2000)

      this.$refs[add_data].validate((valid) => {
        if (valid) {
          let params = {
            dataTitle: this.add_data.dataTitle,//标题
            dataSortId: this.add_data.dataSortId,//分类id
            dataSortCode: this.add_data.dataSortCode,//分类code
            dataSortName: this.add_data.dataSortName,//分类name
            sourceItem: this.add_data.sourceItem,//来源项目
            dataIntroduce: this.add_data.dataIntroduce,// 简介
          }
          save_query(params).then(resp => {
            console.log(resp.data);
            if (resp.code == 0) {
              this.$message({
                message: "新增成功",
                type: "success",
              });
              this.dialogVisible = false;
              this.pageList_data(); // 刷新 列表
            } else {
              this.$message({
                message: resp.data.msg,
                type: "error",
              });
            }
          })
        } else {
          this.$message.info("请填写信息");
          return false;
        }
      })
    },

    // 关闭新增资料弹窗
    resetForm (add_data) {
      this.$refs[add_data].resetFields();//清空添加的值
      this.dialogVisible = false;
      this.add_data = {};//清空
    },

    // 编辑
    edit (data) {
      this.loadcascader_data();//资料分类
      this.isDisable = true
      setTimeout(() => {
        this.isDisable = false
      }, 2000)

      this.dialogVisible = true;
      this.edit_title = '编辑资料'
      this.add_data.dataTitle = data.dataTitle//标题
      this.add_data.dataSortId = data.dataSortId//分类id
      this.add_data.dataSortCode = data.dataSortCode //分类code
      this.add_data.dataSortName = data.dataSortName //分类name
      this.add_data.sourceItem = data.sourceItem //来源项目
      this.add_data.dataIntroduce = data.dataIntroduce // 简介
      this.add_data.referenceTableUuid = data.referenceTableUuid//主键id

      this.add_data = JSON.parse(JSON.stringify(this.add_data));
    },

    // 编辑保存
    update_save (add_data) {
      this.$refs[add_data].validate((valid) => {
        if (valid) {
          let params = {
            dataTitle: this.add_data.dataTitle,//标题
            dataSortId: this.add_data.dataSortId,//分类id
            dataSortCode: this.add_data.dataSortCode,//分类code
            dataSortName: this.add_data.dataSortName,//分类name
            sourceItem: this.add_data.sourceItem,//来源项目
            dataIntroduce: this.add_data.dataIntroduce,// 简介
            referenceTableUuid: this.add_data.referenceTableUuid,//主键id
          }
          update(params).then(resp => {
            console.log(resp.data);
            if (resp.code == 0) {
              this.$message({
                message: "编辑成功",
                type: "success",
              });
              this.dialogVisible = false;
              this.pageList_data(); // 刷新 列表
            } else {
              this.$message({
                message: resp.data.msg,
                type: "error",
              });
            }
          })
        } else {
          this.$message.info("请填写信息");
          return false;
        }
      })
    },
    // 外面列表删除
    remove (data) {
      this.add_data.referenceTableUuid = data.referenceTableUuid
      let params = {
        referenceTableUuid: this.add_data.referenceTableUuid
      }
      this.isDisable = true
      setTimeout(() => {
        this.isDisable = false
      }, 2000)

      this.$confirm(`将永久删除当前资料清单`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteEntity(params).then(resp => {
            console.log(resp.data);
            if (resp.code == 0) {
              this.$message({
                message: "删除成功",
                type: "success",
              });
              this.dialogVisible = false;
              let lastPageSize = (this.tableData_list.total - 1) % this.tableData_list.size;
              this.list_query.pageNo = lastPageSize < 1 ? this.tableData_list.current - 1 : this.tableData_list.current;
              this.pageList_data(); // 刷新 列表
            } else {
              this.$message({
                message: resp.data.msg,
                type: "error",
              });
            }


          })
        })
        .catch(() => { });


    },

    // 文件管理 资料树
    file_list (data) {
      this.dialogVisible_file = true;//显示 文件管理
      this.pdictid = data.dataSortId//左侧资料树
      this.referenceTableUuid = data.referenceTableUuid;//主键id
      let params = {
        pdictid: this.pdictid
      }
      // 资料树
      queryByFid(params).then(resp => {
        this.data_list = resp.data
        if (this.data_list.length > 0) {
          this.pdictid = this.data_list[0].uuid //默认展开第一个节点
          this.expandDefault.push(this.data_list[0].uuid)
          if (this.$refs.el_tree) {
            this.$nextTick(() => {
              this.$refs.el_tree.setCurrentKey(this.pdictid);
              this.toManagementList_data();//右侧列表
            })
          }
        }
      })
    },

    // 文件管理 点击资料树
    handleNodeClick (data) {
      this.pdictid = data.uuid
      this.toManagementList_data();//右侧列表
    },

    // 资料列表
    toManagementList_data () {
      let params = {
        referenceTableUuid: this.referenceTableUuid,//主键id
        dataSortId: this.pdictid,//左侧资料树
      }
      this.loading_file_table = true;//loading
      toManagementList(params).then(resp => {
        this.file_table = resp.data;
        this.loading_file_table = false;//loading
      })
    },

    // 文件管理列表选择
    handleSelectionChange_operation (val) {
      this.data_list_check = val
    },

    // 获取上传的id
    up (data, index) {
      // this.Index = index;
      // this.auditPreviousDemandDataUuid = data.auditPreviousDemandDataUuid
      // this.status = data.status
    },
    // 上传时
    up_ing (file) {
    },
    // 上传
    handleUploadForm (file) {
      this.success_btn2 = 1;//显示加载按钮  0成功  1 loaging
      let formData = new FormData()

      formData.append('referenceTableUuid', this.referenceTableUuid)//主键id
      formData.append('dicId', this.pdictid)
      formData.append('file', file.file)

      axios({
        method: 'post',
        url: '/wisdomaudit/referenceTable/uploadFile',
        headers: {
          TOKEN: this.dqtoken,
          'Content-Type': 'multipart/form-data'

        },
        data: formData,

      }).then(resp => {
        console.log(resp.data);
        if (resp.data.code == 0) {
          this.$message({
            message: '上传成功',
            type: 'success'
          });
          this.success_btn2 = 0;//隐藏加载按钮
          //刷新列表
          this.toManagementList_data();//右侧列表

        } else {
          this.$message({
            message: resp.msg,
            type: 'error'
          });
        }
      })
    },

    // 下载
    download () {
      this.isDisable = true
      setTimeout(() => {
        this.isDisable = false
      }, 2000)

      if (this.data_list_check.length == 0) {
        this.$message.info("请选择一条进行下载");
        return false
      } else {
        // let formData = new FormData()
        // formData.append(this.data_list_check)
        const fileName = [];//文件名称
        this.data_list_check.forEach((item) => {
          // fileName.push(item.fileName)
          this.download_click(item.attachmentUuid, item.fileName)//下载事件
        })


      }
    },
    // 下载事件
    download_click (attachmentUuid, fileName) {
      // let list = this.data_list_check;
      let formData = new FormData()
      formData.append('attachmentUuid', attachmentUuid)
      fileDownload(formData).then(resp => {
        const content = resp;
        console.log(content);
        const blob = new Blob([content],
          { type: 'application/octet-stream,charset=UTF-8' }
        )
        // 刷新列 
        this.pageList_data();//外层列表
        this.toManagementList_data();//右侧列表

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

    // 文件管理 删除
    remove_list () {

      this.isDisable = true
      setTimeout(() => {
        this.isDisable = false
      }, 2000)

      if (this.data_list_check.length == 0) {
        this.$message.info("请选择一条进行删除");
        return false
      } else {

        this.$confirm(`将永久删除当前文件`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {

            let list = this.data_list_check;
            deleteAttachment(list).then(resp => {
              console.log(resp.data);
              if (resp.code == 0) {
                this.$message({
                  message: "删除成功",
                  type: "success",
                });
                // this.dialogVisible = false;
                // let lastPageSize = (this.tableData_list.total - 1) % this.tableData_list.size;
                // this.list_query.pageNo = lastPageSize < 1 ? this.tableData_list.current - 1 : this.tableData_list.current;
                // this.pageList_data(); // 刷新 列表
                // 刷新列 
                this.pageList_data();//外层列表
                this.toManagementList_data();//右侧列表

              } else {
                this.$message({
                  message: resp.data.msg,
                  type: "error",
                });
              }
            })
          })
          .catch(() => { });


      }

    },

  },

}
</script>
<style  scoped>
@import "../../../assets/styles/css/lhg.css";
>>> .el-dialog--center .el-dialog__body {
  padding: 0 !important;
}
>>> .foot .el-button {
  font-weight: normal;
}
>>> .el-dialog--center .el-dialog__body .el-form-item__label {
  font-size: 14px;
}
>>> .el-input__inner::-webkit-input-placeholder,
>>> .el-textarea__inner::-webkit-input-placeholder {
  font-size: 12px;
  color: #c0c4cc !important;
}
.conter {
  padding: 20px;
  box-sizing: border-box;
}
.dlag_conter >>> .el-input__inner::placeholder {
  color: #c1c1c1 !important;
}
.titleMes {
  padding: 10px 0 0;
  box-sizing: border-box;
}
/* search */
.projectTab >>> .el-button,
.search >>> .el-input__inner {
  border-radius: 0px;
}
.search {
  display: flex;
  justify-content: flex-end;
  position: relative;
}
.search >>> .el-input__inner {
  width: 220px !important;
}
.search >>> .el-input__inner {
  width: 180px;
  display: flex;
  float: right;
}
.search >>> .search_icon {
  position: absolute;
  top: 0;
  right: 0;
  width: 37px;
  height: 37px;
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

/* search :end */

/* 分页 */
.page {
  width: 100%;
  padding: 20px 10px;
  display: flex;
  justify-content: flex-end;
}

/* 分页 end */

/* 弹窗 */
.dlag_conter {
  padding: 20px;
  box-sizing: border-box;
}

.dlag_conter >>> .el-textarea .el-textarea__inner {
  resize: none;
}
.dlag_conter >>> .el-form-item {
  margin-bottom: 20px !important;
  display: flex;
  justify-content: center;
}
.dlag_conter >>> .el-form-item__content {
  margin-left: 0 !important;
}
.dlag_conter >>> .el-input,
.dlag_conter >>> .el-textarea {
  width: 240px;
}

/* 附件管理 */
.list_conter {
  display: flex;
}
.left_data_list {
  min-width: 300px;
  padding: 10px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
}
.el-tree {
  background: transparent !important;
}
.el-tree-node__expand-icon {
  background: url("../../../assets/styles/image/buzou2.png") no-repeat;
}
.el-tree-node__expand-icon.is-leaf {
  background: none;
}
.el-icon-folder-opened {
  color: #efae4a !important;
}
.content-style img {
  width: 15px;
  margin-right: 5px;
}
/* 更换图标库 */
/* .pageTree >>> [class*=" el-icon-"],
[class^="el-icon-"] {
  font-family: "FontAwesome" !important;
} */
/*  动画取消 */
/* .pageTree >>> .el-tree-node__expand-icon.expanded {
  -webkit-transform: rotate(0deg);
  transform: rotate(0deg);
} */
/*  收起 */
.pageTree >>> .el-icon-caret-right:before {
  content: "+";
  font-weight: bold;
  font-size: 16px;
}
/* 展开 */
.pageTree >>> .el-tree-node__expand-icon.expanded.el-icon-caret-right:before {
  content: "-";
  font-size: 16px;
  font-weight: bold;
}

/* 资料树默认选择样式 */
.pageTree >>> .is-current {
  background: #f4fafe;
}
.pageTree >>> .is-current span {
  font-weight: 800;
}

.pageTree >>> .el-tree-node__expand-icon.expanded {
  transform: rotate(0deg) !important;
}
.content-style span {
  box-sizing: border-box;
  display: flex;
  align-items: center;
}
.right_table {
  flex: 1;
  padding: 0 10px 0 20px;
  box-sizing: border-box;
}
.btn_type {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}
.btn_type >>> .el-col {
  margin-left: 10px;
}
</style>>
