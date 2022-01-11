<template>
  <div class="page-container auditproblem">
    <div class="filter-container">
      <el-row :gutter="24"
              class="titleMes">
        <!-- 自建新增   -->
        <el-col :span="1.5">
          <el-button type="primary"
                     @click="add()">新增审计问题</el-button>
        </el-col>

        <!-- <div class="search">
          <el-input
            placeholder="请输入问题"
            v-model="pageQuery.condition.problem"
            class="input-with-select"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              type="primary"
              @click="getList(1)"
            ></el-button>
          </el-input>
        </div> -->
        <div class="search">
          <el-input placeholder="请输入问题"
                    v-model="pageQuery.condition.problem">
          </el-input>
          <div class="search_icon"
               style="background: rgb(12, 135, 214) !important"
               @click="getList(1)">
            <i class="el-icon-search"
               style="color: white"></i>
          </div>
          <!-- <el-button type="primary"
                      >筛选</el-button> -->
        </div>
      </el-row>
      <!-- <div class="auditproblem-btn-box"></div> -->
    </div>
    <!-- @sort-change="sortChange"
       -->
    <div class="min_height">

      <el-table ref="problemtable"
                :key="tableKey"
                :header-cell-style="{'text-align':'left','background-color': '#F4FAFF',}"
                v-loading="listLoading"
                fit
                style="width: 100%"
                :data="list"
                border
                highlight-current-row
                height="calc(100vh - 300px)"
                max-height="calc(100vh - 300px)"
                @selection-change="handleSelectionChange">
        <el-table-column label="序号"
                         width="70">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="问题">
          <template slot-scope="scope">
            <div class="canclick"
                 @click="checkDetail(scope.row.problemListUuid)">
              {{ scope.row.problem }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="领域"
                         prop="field">
          <template slot-scope="scope">
            <div>
              <!-- {{ fieldFilter(scope.row.field) }} -->
              {{ scope.row.field }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="专题"
                         prop="special">
          <template slot-scope="scope">
            <div>
              {{ scope.row.special }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="风险金额（万元）"
                         width="140px"
                         prop="riskAmount"
                         align="right">
          <template slot-scope="scope">
            {{ parseFloat(scope.row.riskAmount) }}
          </template>
        </el-table-column>
        <el-table-column label=""
                         width="40px"> </el-table-column>
        <el-table-column label="发现日期">
          <template slot-scope="scope">
            {{ repDate(scope.row.problemDiscoveryTime) }}
          </template>
        </el-table-column>
        <el-table-column label="发现人"
                         prop="problemFindPeople" />
        <el-table-column label="操作"
                         width="100"
                         v-if="userRole == 1 || userRole == 2">
          <template slot-scope="scope">
            <el-button @click="openDetail(scope.$index)"
                       type="text"
                       style="color: #0c87d6">编辑</el-button>
            <el-button @click="del(scope.row.problemListUuid)"
                       type="text"
                       style="color: #ff8a72">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <pagination v-show="total > 0"
                :total="total"
                :page.sync="pageQuery.pageNo"
                :limit.sync="pageQuery.pageSize"
                @pagination="getList" />
    <!-- 新增和编辑的弹框 -->
    <el-dialog title="新增审计问题"
               class="add"
               :append-to-body='true'
               :visible.sync="dialogFormVisible"
               :close-on-click-modal="false"
               width="70%"
               @close="resetForm('temp')"
               center>
      <el-form ref="dataForm"
               :rules="rules"
               :model="temp"
               label-position="right"
               label-width="140px"
               class="problem-form formData">
        <el-form-item class="itemTwo"
                      label="问题："
                      prop="problem">
          <el-input v-model="temp.problem"
                    placeholder="请输入问题" />
        </el-form-item>
        <el-form-item class="itemTwo"
                      label="领域："
                      prop="field">
          <el-select v-model="temp.field"
                     placeholder="请选择领域">
            <el-option v-for="item in CategoryList"
                       :key="item.label"
                       :label="item.label"
                       :value="item.label">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="itemTwo"
                      label="专题："
                      prop="special">
          <el-select v-model="temp.special"
                     placeholder="请选择专题"
                     v-if="input_select == true"
                     @change="change_zt">
            <el-option v-for="item in SPECIALList"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
          <el-input v-model="temp.special"
                    v-if="input_select == false"></el-input>
          <el-button v-if="input_select == false"
                     type="primary"
                     class="inline-block"
                     style="position: absolute;top:0;right: -70px"
                     @click="input_select=!input_select">重选</el-button>
        </el-form-item>
        <!-- <el-form-item> </el-form-item> -->
        <el-form-item label="依据："
                      style="margin-bottom:20px!important;"
                      prop="basis"
                      class="itemOne">
          <el-select v-model="temp.basis"
                     class="inline-block yj-sel"
                     multiple
                     @visible-change="toopen"
                     placeholder="请选择依据"
                     no-data-text="请点击引用审计依据">
          </el-select>
          <el-button type="primary"
                     ref="basisbtn0"
                     class="citebtn inline-block"
                     @click="openbasis()">引用审计依据</el-button>
        </el-form-item>

        <el-form-item label="描述："
                      style="margin-bottom:20px!important;"
                      prop="describe"
                      class="itemOne">
          <!-- <el-input v-model="temp.describe" placeholder="请输入描述" /> -->
          <el-input type="textarea"
                    v-model="temp.describe"
                    placeholder="请输入描述"
                    :autosize="{ minRows: 3}"></el-input>
        </el-form-item>
        <el-form-item label="管理建议："
                      style="margin-bottom:20px!important;"
                      prop="managementAdvice"
                      class="itemOne">
          <el-input type="textarea"
                    v-model="temp.managementAdvice"
                    placeholder="请输入管理建议"
                    :autosize="{ minRows: 3}" />
        </el-form-item>
        <el-form-item class="itemTwo"
                      label="发现日期："
                      prop="problemDiscoveryTime">
          <!-- <el-input
            v-model="temp.problemDiscoveryTime"
            type="date"
            placeholder="请输入发现日期"
          /> -->
          <el-date-picker type="date"
                          placeholder="选择日期"
                          v-model="temp.problemDiscoveryTime"
                          style="width: 100%"></el-date-picker>
        </el-form-item>
        <el-form-item class="itemTwo"
                      label="发现人："
                      prop="problemFindPeople">
          <el-select v-model="temp.problemFindPeople"
                     placeholder="请选择发现人">
            <el-option v-for="(item, i) in personlist"
                       :key="'person' + i"
                       :label="item.realName"
                       :value="item.realName">
              {{ item.realName }}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="itemTwo"
                      label="风险金额（万元）："
                      prop="riskAmount">
          <el-input v-model="temp.riskAmount"
                    placeholder="请输入风险金额"
                    @keyup.native="onlyNumOnePoint('temp')"
                    @input="temp.riskAmount = temp.riskAmount.slice(0, 27)" />
        </el-form-item>
        <el-form-item class="itemTwo task"
                      label="关联任务："
                      prop="auditTaskUuid">
          <el-select v-model="temp.auditTaskUuid"
                     multiple
                     placeholder="请选择关联任务">
            <el-option v-for="item in auditTasklList"
                       :key="item.auditTaskUuid"
                       :label="item.taskName"
                       :value="item.auditTaskUuid">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item class="itemTwo"
                      label="上传附件：">
          <el-upload class="upload-demo"
                     drag
                     action="/wisdomaudit/auditBasy/filesUpload"
                     :on-success="( response, file, fileList)=>{
                       uploadPorgress2( response, file, fileList,attachmentList2)
                       }"
                     :on-remove="( file, fileList)=>{
                       handleRemove2( file, fileList,attachmentList2,fileList2,fileList2_del)
                       }"
                     :on-progress="update_ing"
                     multiple
                     :key="key"
                     :on-exceed="handleExceed"
                     :headers="headers"
                     :file-list="fileList2">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              点击上传或将文件拖到虚线框<br />支持.docx .xls .xlsx .txt .zip .doc
            </div>
          </el-upload>
          <!-- <div class="inline-block">
            <el-tooltip class="item"
                        effect="dark"
                        v-for="(item,index) in fileList2"
                        :key="index"
                        :content="item.fileName"
                        placement="top">
              <div class="blue pointer"
                   @click="downFile2(item.attachmentUuid,item.fileName)">
                {{item.fileName.length>20?item.fileName.slice(0,20)+"...":item.fileName}}</div>
            </el-tooltip>
          </div>-->
        </el-form-item>

      </el-form>
      <div slot="footer">
        <el-button v-if="!closeStatus"
                   @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="closeStatus"
                   type="primary"
                   @click="dialogFormVisible = false">关闭</el-button>

        <el-button type="primary"
                   v-if="success_btn==1"
                   :loading="true">上传中</el-button>

        <el-button v-if="success_btn==0 && !closeStatus"
                   type="primary"
                   @click="createData()">保存</el-button>
      </div>
    </el-dialog>

    <el-dialog width="70%"
               :title="ifadd == 1 ? '编辑问题' : '问题详情'"
               :visible.sync="dialogDetailVisible"
               :close-on-click-modal="false"
               :append-to-body='true'
               @close="resetForm('dqProblem')"
               center>
      <el-form ref="detailForm"
               :model="dqProblem"
               :rules="rules"
               label-position="right"
               label-width="140px"
               class="problem-form formData">
        <el-form-item class="itemTwo"
                      label="问题："
                      prop="problem">
          <el-input v-model="dqProblem.problem"
                    placeholder="请输入问题"
                    :disabled="ifadd != 2 ? false : true" />
        </el-form-item>
        <el-form-item class="itemTwo"
                      label="领域："
                      prop="field">
          <el-select v-model="dqProblem.field"
                     placeholder="请选择领域"
                     :disabled="ifadd != 2 ? false : true">
            <el-option v-for="item in CategoryList"
                       :key="item.label"
                       :label="item.label"
                       :value="item.label">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="itemTwo"
                      label="专题："
                      prop="special">
          <el-select v-model="dqProblem.special"
                     placeholder="请选择专题"
                     :disabled="ifadd != 2 ? false : true"
                     v-if="input_selecte == true"
                     @change="change_zte">
            <el-option v-for="item in SPECIALList"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
          <el-input v-model="dqProblem.special"
                    v-if="input_selecte == false"
                    :disabled="ifadd != 2 ? false : true"></el-input>
          <el-button v-if="input_selecte == false"
                     type="primary"
                     class="inline-block"
                     style="position: absolute;top:0;right: -70px"
                     @click="input_selecte=!input_selecte">重选</el-button>
        </el-form-item>
        <!--<el-form-item></el-form-item>-->
        <!-- <el-popover placement="top-start"
                    max-width="600"
                    ref="popoverSH"
                    trigger="click">
          <div v-if="dqProblem.basis"
              >
            <p v-for="(e, i) in dqProblem.basis"
               :key="'basis' + i">
              {{ e }}
            </p>
          </div> -->
        <el-form-item label="依据："
                      prop="basis"
                      class="itemOne yj">
          <el-select v-model="dqProblem.basis"
                     class="inline-block yj-sel"
                     multiple
                     @visible-change="toopen"
                     placeholder="请选择依据"
                     no-data-text="请点击引用审计依据"
                     :disabled="ifadd != 2 ? false : true">
          </el-select>
          <el-button v-if="ifadd != 2 ? true : false"
                     type="primary"
                     ref="basisbtn0"
                     class="citebtn inline-block"
                     @click="openbasis()">引用审计依据</el-button>
        </el-form-item>

        <!-- </el-popover> -->

        <el-form-item label="描述："
                      style="margin-bottom:20px!important;"
                      prop="describe"
                      class="itemOne">
          <el-input type="textarea"
                    v-model="dqProblem.describe"
                    placeholder="请输入描述"
                    :disabled="ifadd != 2 ? false : true"
                    :autosize="{ minRows: 3}" />
        </el-form-item>
        <el-form-item label="管理建议："
                      style="margin-bottom:20px!important;"
                      prop="managementAdvice"
                      class="itemOne">
          <el-input type="textarea"
                    v-model="dqProblem.managementAdvice"
                    placeholder="请输入管理建议"
                    :disabled="ifadd != 2 ? false : true"
                    :autosize="{ minRows: 3}" />
        </el-form-item>
        <el-form-item class="itemTwo"
                      label="发现日期："
                      prop="problemDiscoveryTime">
          <el-date-picker type="date"
                          placeholder="选择日期"
                          v-model="dqProblem.problemDiscoveryTime"
                          style="width: 100%"
                          :disabled="ifadd != 2 ? false : true"></el-date-picker>
        </el-form-item>
        <el-form-item class="itemTwo"
                      label="发现人："
                      prop="problemFindPeople">
          <el-select v-model="dqProblem.problemFindPeople"
                     placeholder="请选择发现人"
                     :disabled="ifadd != 2 ? false : true">
            <el-option v-for="(item, i) in personlist"
                       :key="'person' + i"
                       :label="item.realName"
                       :value="item.realName">
              {{ item.realName }}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="itemTwo"
                      label="风险金额（万元）："
                      prop="riskAmount"
                      width="180">
          <el-input v-model="dqProblem.riskAmount"
                    placeholder="请输入风险金额"
                    :disabled="ifadd != 2 ? false : true"
                    @keyup.native="onlyNumOnePoint('dqProblem')"
                    @input="temp.riskAmount = temp.riskAmount.slice(0, 27)" />
        </el-form-item>
        <el-form-item class="itemTwo task"
                      label="关联任务："
                      prop="auditTaskUuid">
          <el-select disabled
                     v-model="dqProblem.auditTaskUuid"
                     multiple
                     placeholder="请选择关联任务">
            <el-option v-for="item in auditTasklList"
                       :key="item.auditTaskUuid"
                       :label="item.taskName"
                       :value="item.auditTaskUuid">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item class="itemTwo"
                      label="上传附件：">
          <el-upload class="upload-demo"
                     drag
                     action="/wisdomaudit/auditBasy/filesUpload"
                     :on-success="( response, file, fileList)=>{
                       uploadPorgress2( response, file, fileList,attachmentList2)
                       }"
                     :on-remove="( file, fileList)=>{
                       handleRemove2( file, fileList,attachmentList2,fileList2,fileList2_del)
                       }"
                     :on-progress="update_ing"
                     multiple
                     :key="key"
                     :on-exceed="handleExceed"
                     :headers="headers"
                     :file-list="fileList2">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              点击上传或将文件拖到虚线框<br />支持.docx .xls .xlsx .txt .zip .doc
            </div>
          </el-upload>
          <!-- <div class="inline-block"
               v-if="ifLook==1">
            <el-tooltip class="item"
                        effect="dark"
                        v-for="(item,index) in fileList2"
                        :key="index"
                        :content="item.fileName"
                        placement="top">
              <div class="blue pointer"
                   @click="downFile2(item.attachmentUuid,item.fileName)">
                {{item.fileName.length>20?item.fileName.slice(0,20)+"...":item.fileName}}</div>
            </el-tooltip>
          </div> -->
        </el-form-item>

      </el-form>
      <div slot="footer"
           class="dialog-footer">

        <el-button @click="dialogDetailVisible = false">取消</el-button>

        <el-button type="primary"
                   @click="updateData()"
                   v-if="success_btn==0 && ifupdata">保存修改</el-button>

        <el-button type="primary"
                   v-if="success_btn==1"
                   :loading="true">上传中</el-button>

      </div>
    </el-dialog>
    <el-dialog title="引用审计依据"
               :append-to-body='true'
               :visible.sync="basisdialog"
               width="70%"
               class="post"
               custom-class="outmax">
      <div style="display: flex; height: 100%; padding: 20px">
        <div style="max-height: 60vh; width: 50%; overflow: scroll">
          <el-form ref="basisform"
                   class="problem-form"
                   :model="dqbasis"
                   label-width="120px"
                   label-position="right">
            <el-form-item label="审计依据名称"
                          class="long">
              <el-select v-model="dqbasis.val"
                         placeholder="请选择依据名称"
                         filterable
                         remote
                         reserve-keyword
                         :remote-method="basisremoteMethod"
                         :loading="basisloading"
                         @change="getbasisdetail(dqbasis.val)">
                <el-option v-for="item in basislist"
                           :key="item.basy_uuid"
                           :label="item.basy_name"
                           :value="item.basy_uuid">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <el-card class="box-card"
                   style="width: 70%; min-height: 300px; margin: auto">
            <el-tree :data="dqbasis.info.tree"
                     :props="defaultProps"
                     @node-click="treeNodeClick"
                     default-expand-all
                     v-loading="basisload"
                     class="problemtree"></el-tree>
          </el-card>
          <!-- <div
            v-for="(item, index) in basislist"
            :key="'basis' + index"
            style="line-height:40px;height:40px;border-bottom:1px solid #ddd;cursor:pointer;"
            @click="getbasisdetail(item.basy_uuid)"
          >
            {{ item.basy_name }}
          </div> -->
        </div>
        <el-card class="box-card basiscard"
                 style="width: 50%"
                 v-loading="basisload">
          <div v-for="(item, index) in dqbasis.info.arr"
               :key="'dqbasisarr' + index">
            <div slot="header"
                 class="clearfix"
                 style="padding: 5px 0"
                 v-if="item.contentLev != 3">
              <span style="font-weight: bold"
                    :style="
                  item.contentLev == 1
                    ? 'font-size:18px;'
                    : item.contentLev == 2
                    ? 'font-size:16px;'
                    : 'font-size:14px;'
                ">{{ item.label }}</span>
            </div>

            <el-button style="padding: 10px 0 3px 20px; color: #ffba00; float: right"
                       v-if="item.contentLev == 3"
                       @click="choosebasis(item.attachmentContent)"
                       type="text">引用</el-button>
            <p class=""
               v-if="item.contentLev == 3">
              {{ item.attachmentContent }}
            </p>
          </div>
        </el-card>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="basisdialog = false">取 消</el-button>
        <el-button type="primary"
                   @click="surebasis()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from "@WISDOMAUDIT/components/Pagination"; // secondary package based on el-pagination
import _ from "lodash";
import axios from "axios";
import $ from "jquery";
export default {
  props: ["active_project"],
  components: { Pagination },
  filters: {},
  data () {
    return {
      show: false,
      dqtoken: "",
      dqProblem: {},//编辑问题
      options: [
        { value: "xxx1", label: "xxx1" },
        { value: "xxx2", label: "xxx2" },
      ],
      tableKey: "indicator",
      list: null,
      total: 0,
      key: 0,

      listLoading: false,
      pageQuery: {
        condition: {
          managementProjectUuid: this.active_project,
          problem: "",
        },
        pageNo: 1,
        pageSize: 20,
        sortBy: "",
        sortName: "",
      },
      temp: {
        managementProjectUuid: this.active_project,
        // 业务分类
        auditTaskUuid: [],
        basis: [],
        describe: "",
        field: "",
        special: "",
        isDeleted: 0,
        problem: "",
        problemDiscoveryTime: "",
        problemFindPeople: "",
        managementAdvice: "",
        problemListUuid: "",
        riskAmount: "",
        status: 0,
        attachmentList: [],
      },
      attachmentList1: [],//附件上传列表
      success_btn: 0,//上传 ing
      attachmentList2: [],//附件上传列表
      fileList2: [],//附件上传回显列表
      fileList2_del: [],


      selections: [],
      dialogFormVisible: false,
      ifupdata: false,
      dialogDetailVisible: false,
      dialogStatus: "",
      // 新增的表单验证
      rules: {
        auditTaskUuid: [
          { required: true, message: "请选择关联任务", trigger: "change" },
        ],
        // basis: [{ required: true, message: "请选择依据", trigger: "change" }],
        field: [{ required: true, message: "请选择领域", trigger: "change" }],
        problem: [{ required: true, message: "请填写问题", trigger: "change" }],
        problemDiscoveryTime: [
          { required: true, message: "请填写发现时间", trigger: "change" },
        ],
        problemFindPeople: [
          { required: true, message: "请填写发现人", trigger: "change" },
        ],
        special: [{ required: true, message: "请选择专题", trigger: "change" }],
        riskAmount: [
          { required: true, message: "请填写风险金额", trigger: "change" },
        ],
      },
      closeStatus: false,
      downloadLoading: false,
      headers: { "Content-Type": "multipart/form-data" },
      file: "",
      problemtableSelection: [],
      CategoryList: [],
      SPECIALList: [],
      auditTasklList: [],
      basisdialog: false,
      basislist: [],
      dqbasis: {
        val: "",
        info: "",
        choose: [],
      },
      defaultProps: {
        children: "children",
        label: "label",
      },
      basisload: false,
      ifadd: 0,
      personlist: [],
      me: "",
      userRole: 0,
      input_select: true,
      input_selecte: true,
      basisloading: false,
    };
  },
  watch: {},
  created () {
    this.dqtoken = sessionStorage.getItem("TOKEN");
    this.getloadcascader("Category");
    this.getloadcascader("SPECIAL");
    this.getSelectTask();
    this.getperson();
    this.getme();
    this.getbasis();
    this.getList();
  },
  mounted () {
    this.headers = { 'TOKEN': sessionStorage.getItem('TOKEN') }
  },
  methods: {
    // 新增问题关闭
    resetForm (str) {
      if (str == "temp") {
        this.temp = {
          managementProjectUuid: this.active_project,
          // 业务分类
          auditTaskUuid: [],
          basis: [],
          describe: "",
          field: "",
          special: "",
          isDeleted: 0,
          problem: "",
          problemDiscoveryTime: "",
          problemFindPeople: "",
          managementAdvice: "",
          problemListUuid: "",
          riskAmount: "",
          status: 0,
        };
      } else if (str == "dqProblem") {
        this.dqProblem = {};
      }
      this.input_select = true; //专题 恢复默认
      this.input_selecte = true; //专题 恢复默认
    },
    change_zt (val) {
      this.temp.special = val;
      if (val == "otherzt") {
        this.input_select = false;
        this.temp.special = "";
      }
    },
    change_zte (val) {
      this.dqProblem.special = val;
      if (val == "otherzt") {
        this.input_selecte = false;
        this.dqProblem.special = "";
      }
    },
    // UpNumber(e){
    //   //输入框中只允许输入数字
    //   e.target.value = e.target.value.replace(/[^\d.]/g,'')
    //   //输入框只允许输入小数点和数字，小数点后一位
    //   e.target.value = (e.target.value.match(/^\d*(\.?\d{0,1})/g)[0])
    // },
    onlyNumOnePoint (str) {
      let number_only = "";
      if (str == "temp") {
        number_only = this.temp.riskAmount;
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
      if (str == "temp") {
        this.temp.riskAmount = number_only;
      } else {
        this.dqProblem.riskAmount = number_only;
      }
    },
    toopen (val) {
      if (val) {
        let _this = this;
        setTimeout(function () {
          _this.$refs["basisbtn0"].handleClick();
        }, 100);
        return false;
      }
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
    //确定选择依据
    surebasis () {
      this.basisdialog = false;
      if (this.ifadd == 0) {
        this.temp.basis = this.dqbasis.choose;
      } else {
        this.dqProblem.basis = this.dqbasis.choose;
      }
      this.dqbasis.choose = [];
    },
    //选择依据
    choosebasis (val) {
      if (this.dqbasis.choose.indexOf(val) > -1) {
        this.$message({
          message: "您已引用这一条",
          type: "warning",
        });
        return;
      } else {
        this.dqbasis.choose.push(val);
        this.$message({
          message: "引用成功",
          type: "success",
        });
      }
    },
    //依据树
    treeNodeClick () { },
    //打开依据
    openbasis () {
      this.basisdialog = true;
      this.dqbasis.choose = [];
      this.dqbasis.info = "";
      this.dqbasis.val = "";
    },
    //获取依据
    getbasis () {
      axios({
        url: `/wisdomaudit/auditBasy/getAuditbasyList`,
        headers: {
          TOKEN: this.dqtoken,
        },
        method: "post",
        data: {
          basyName: "",
        },
      }).then((res) => {
        this.basislist = res.data.data;
      });
    },
    //模糊查询依据详情
    basisremoteMethod (query) {
      this.basisloading = true
      axios({
        url: `/wisdomaudit/auditBasy/getAuditbasyList`,
        headers: {
          TOKEN: this.dqtoken,
        },
        method: "post",
        data: {
          basyName: query,
        },
      }).then((res) => {
        this.basislist = res.data.data;
        this.basisloading = false
      });
    },
    //获取依据详情
    getbasisdetail (bid) {
      this.basisload = true;
      axios({
        url: `/wisdomaudit/auditBasy/getById/` + bid + ``,
        headers: {
          TOKEN: this.dqtoken,
        },
        method: "get",
        data: {},
      }).then((res) => {
        this.dqbasis.info = res.data.data.treeData;
        this.basisload = false;
      });
    },
    //领域返显
    fieldFilter (str) {
      let rep = "";
      this.CategoryList.forEach((e) => {
        if (e.value == str) {
          rep = e.label;
        }
      });
      return rep;
    },
    //专题返显
    specialFilter (str) {
      let rep = "";
      this.SPECIALList.forEach((e) => {
        if (e.value == str) {
          rep = e.label;
        }
      });
      return rep;
    },
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
    // 编辑
    openDetail (int) {
      this.ifadd = 1;
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

        // 附件
        let datas = res.data.data
        if (datas.attachmentList) {
          datas.attachmentList.forEach((item) => {
            item.name = item.fileName;
            item.url = item.filePath;
            item.isDeleted = 0;
          });
        }
        this.fileList2 = datas.attachmentList || [];



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
    getList (page) {
      if (page == 1) {
        this.pageQuery.pageNo = 1;
      }
      this.listLoading = true;
      axios({
        url: `/wisdomaudit/problemList/pageList`,
        headers: {
          TOKEN: this.dqtoken,
        },
        method: "post",
        data: this.pageQuery,
      }).then((res) => {
        this.listLoading = false;
        if (res.data.code == 0) {
          this.list = res.data.data.records;
          this.total = res.data.data.total;
        }
      });
    },
    add () {
      this.dialogFormVisible = true;

      this.ifadd = 0;
      this.temp.problemFindPeople = this.me;
      this.temp.problemDiscoveryTime = new Date();

      this.temp.attachmentList = []; //清空附件
      this.fileList2 = [];
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    handleSelectionChange (val) {
      this.problemtableSelection = val;
    },
    del (pid) {
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
            this.getList();
          }
        });
      });
      let rep = [];
      // for(let i = 0;i<this.problemtableSelection.length;i++){
      //   rep.push(this.problemtableSelection[i].problemListUuid)
      // }
      // rep =  rep.join(",")
    },


    // 附件 -------------------------------------

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
        console.log(showList, delList)
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
        console.log(err);
      })
    },

    // 附件 end-------------------------------------


    createData () {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          let rep = this.temp;
          rep.riskAmount = parseFloat(rep.riskAmount)
          rep.auditTaskUuid = rep.auditTaskUuid
            ? rep.auditTaskUuid.join(",")
            : "";
          rep.basis = rep.basis ? rep.basis.join(",") : "";

          // 附件
          let uploadList2 = this.attachmentList2.concat(this.fileList2, this.fileList2_del);
          console.log(uploadList2);
          uploadList2.forEach((item) => {
            console.log(item);
            item.status = null;
          });
          this.temp.attachmentList = uploadList2;
          // this.temp.attachmentList = [];

          axios({
            url: `/wisdomaudit/problemList/save`,
            headers: {
              TOKEN: this.dqtoken,
            },
            method: "post",
            data: rep,
          }).then((res) => {
            if (res.data.code == 0) {
              this.$message({
                message: "新增成功",
                type: "success",
              });
              this.dialogFormVisible = false;
              this.temp.auditTaskUuid = [];
              this.temp.basis = [];
              this.temp.describe = "";
              this.temp.field = "";
              this.temp.problem = "";
              this.temp.problemDiscoveryTime = "";
              this.temp.problemFindPeople = "";
              this.temp.managementAdvice = "";
              this.temp.riskAmount = "";
              this.temp.special = "";
              this.getList(1);
            }
          });
        } else {
          return false;
        }
      });
    },
    updateData () {
      this.$refs["detailForm"].validate((valid) => {
        if (valid) {
          let rep = this.dqProblem;
          rep.riskAmount = parseFloat(rep.riskAmount)
          rep.auditTaskUuid = rep.auditTaskUuid.join(",");
          rep.basis = rep.basis.join(",");

          // 附件
          let uploadList2 = this.attachmentList2.concat(this.fileList2, this.fileList2_del);
          uploadList2.forEach((item) => {
            item.status = null;
            // 新增的
            if (item.attStatus != 1 && item.attStatus != 3) {
              item.attStatus = 2
            }
          });
          this.dqProblem.attachmentList = uploadList2;

          axios({
            url: `/wisdomaudit/problemList/update`,
            headers: {
              TOKEN: this.dqtoken,
            },
            method: "put",
            data: rep,
          }).then((res) => {
            if (res.data.code == 0) {
              this.$message({
                message: "编辑成功",
                type: "success",
              });
              this.dialogDetailVisible = false;

              this.getList();
            }
          });
        }
      });
    },
  },
};
</script>
<style scoped>
.popperclass {
  display: none;
}

.min_height {
  min-height: 500px;
}
.auditproblem-btn-box {
  float: right;
}
.gary-border {
  border: 1px solid #ccc;
}
@import "../../../assets/styles/css/yw.css";

/* 引用依据 */
.post >>> .el-tree-node {
  white-space: break-spaces !important;
}
.post >>> .el-tree-node__content {
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

.auditproblem .titleMes .el-button--primary {
  border-radius: 0 !important;
  border: #0c87d6 !important;
  border-color: #0c87d6 !important;
}
.auditproblem .problemtree .el-tree-node {
  overflow: auto;
}
.auditproblem .el-form-item {
  width: 49%;
  margin: 10px 1% 10px 0 !important;
}
.auditproblem .problem-form {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  flex-wrap: wrap;
  padding: 0px 20px;
}
.problem-form .el-form-item__label {
  float: left !important;
}
.auditproblem .el-select {
  width: 100%;
}
.auditproblem >>> .citebtn {
  height: 40px;
  margin-left: 10px;
  margin-bottom: 1%;
}
.canclick {
  color: #0c87d6;
  cursor: pointer;
}
.auditproblem .search {
  display: flex;
  justify-content: flex-end;
  position: relative;
}
.search >>> .el-input {
  width: 250px !important;
  border-radius: 5px 0 0 5px;
}
.search .el-input__inner {
  width: 250px !important;
  display: flex;
  float: right;
  border-radius: 0 !important;
}
.titleMes .el-button {
  border-radius: 0 !important;
}
.search .search_icon {
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
.search .el-button {
  border-radius: 0 5px 5px 0;
  /* background: #1371cc !important; */
}
.long {
  width: 70% !important;
}
.basiscard p {
  padding: 10px 0 10px 20px;
}
.page {
  width: 100%;
  padding: 20px 10px;
  display: flex;
  justify-content: flex-end;
}
.el-select {
  width: 100% !important;
}
.itemOne .el-select,
.itemOne .el-textarea {
  width: 70% !important;
}
>>> .itemOne .el-form-item__content {
  width: 77% !important;
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
.yj-sel >>> .el-select__tags-text {
  max-width: 400px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.task >>> .el-select__tags-text {
  max-width: 220px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
</style>

