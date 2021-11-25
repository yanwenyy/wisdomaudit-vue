<template>
  <div class="page-container auditproblem">
    <div class="filter-container">
      <el-row :gutter="24" class="titleMes">
        <!-- 自建新增   -->
        <el-col :span="1.5">
          <el-button type="primary" @click="add()">新增审计问题</el-button>
        </el-col>

        <div class="search">
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
        </div>
      </el-row>
      <!-- <div class="auditproblem-btn-box"></div> -->
    </div>
    <!-- @sort-change="sortChange"
       -->
    <el-table
      ref="problemtable"
      :key="tableKey"
      v-loading="listLoading"
      fit
      style="width: 100%"
      :data="list"
      border
      highlight-current-row
      height="calc(100vh - 300px)"
      max-height="calc(100vh - 300px)"
      @selection-change="handleSelectionChange"
    >
      <el-table-column label="序号">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="问题">
        <template slot-scope="scope">
          <div class="canclick" @click="checkDetail(scope.row.problemListUuid)">
            {{ scope.row.problem }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="领域" prop="field">
        <template slot-scope="scope">
          <div>
            <!-- {{ fieldFilter(scope.row.field) }} -->
            {{ scope.row.field }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="专题" prop="special">
        <template slot-scope="scope">
          <div>
            {{ specialFilter(scope.row.special) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="风险金额（万元）"
        width="180px"
        prop="riskAmount"
      />
      <el-table-column label="发现日期">
        <template slot-scope="scope">
          {{ repDate(scope.row.problemDiscoveryTime) }}
        </template>
      </el-table-column>
      <el-table-column label="发现人" prop="problemFindPeople" />
      <el-table-column label="操作" width="200" v-if="userRole==1||userRole==2">
        <template slot-scope="scope">
          <el-button
            @click="openDetail(scope.$index)"
            type="text"
            style="color: #1371cc"
            >编辑</el-button
          >
          <el-button
            @click="del(scope.row.problemListUuid)"
            type="text"
            style="color: red"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="pageQuery.pageNo"
      :limit.sync="pageQuery.pageSize"
      @pagination="getList"
    />
    <!-- 新增和编辑的弹框 -->
    <el-dialog
      title="新增问题"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      center
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="120px"
        class="problem-form"
      >
        <el-form-item label="问题" prop="problem">
          <el-input v-model="temp.problem" placeholder="请输入问题" />
        </el-form-item>
        <el-form-item label="领域" prop="field">
          <el-select v-model="temp.field" placeholder="请选择领域">
            <el-option
              v-for="item in CategoryList"
              :key="item.label"
              :label="item.label"
              :value="item.label"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="专题" prop="special">
          <el-select v-model="temp.special" placeholder="请选择专题">
            <el-option
              v-for="item in SPECIALList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item> </el-form-item>
        <el-form-item label="依据" prop="basis" class="long">
          <el-select
            v-model="temp.basis"
            multiple
            @visible-change="toopen"
            placeholder="请选择"
            no-data-text="请点击引用审计依据"
          >
          </el-select>
        </el-form-item>
        <el-button
          type="primary"
          ref="basisbtn0"
          class="citebtn"
          @click="openbasis()"
          >引用审计依据</el-button
        >
        <el-form-item label="描述" prop="describe" class="long">
          <el-input v-model="temp.describe" placeholder="请输入描述" />
        </el-form-item>
        <el-form-item label="管理建议" prop="managementAdvice" class="long">
          <el-input
            v-model="temp.managementAdvice"
            placeholder="请输入管理建议"
          />
        </el-form-item>
        <el-form-item label="发现日期" prop="problemDiscoveryTime">
          <!-- <el-input
            v-model="temp.problemDiscoveryTime"
            type="date"
            placeholder="请输入发现日期"
          /> -->
          <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="temp.problemDiscoveryTime"
            style="width: 100%"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="发现人" prop="problemFindPeople">
          <el-select
            v-model="temp.problemFindPeople"
            placeholder="请选择发现人"
          >
            <el-option
              v-for="(item, i) in personlist"
              :key="'person' + i"
              :label="item.realName"
              :value="item.realName"
            >
              {{ item.realName }}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="风险金额（万元）" prop="riskAmount">
          <el-input
            v-model="temp.riskAmount"
            placeholder="请输入风险金额"
            @keyup.native="onlyNumOnePoint"
          />
        </el-form-item>
        <el-form-item label="关联任务" prop="auditTaskUuid">
          <el-select v-model="temp.auditTaskUuid" multiple placeholder="请选择">
            <el-option
              v-for="item in auditTasklList"
              :key="item.auditTaskUuid"
              :label="item.taskName"
              :value="item.auditTaskUuid"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <!-- <el-form-item label="上传附件" prop="int">
          <el-upload
            class="upload-demo"
            drag
            action="https://jsonplaceholder.typicode.com/posts/"
            multiple
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
          </el-upload>
        </el-form-item> -->
      </el-form>
      <div slot="footer">
        <el-button v-if="!closeStatus" @click="dialogFormVisible = false"
          >取消</el-button
        >
        <el-button
          v-if="closeStatus"
          type="primary"
          @click="dialogFormVisible = false"
          >关闭</el-button
        >
        <el-button v-if="!closeStatus" type="primary" @click="createData()"
          >保存</el-button
        >
      </div>
    </el-dialog>

    <el-dialog
      title="问题详情"
      :visible.sync="dialogDetailVisible"
      :close-on-click-modal="false"
    >
      <el-form
        ref="detailForm"
        :model="dqProblem"
        :rules="rules"
        label-position="right"
        label-width="120px"
        class="problem-form"
      >
        <el-form-item label="问题" prop="problem">
          <el-input
            v-model="dqProblem.problem"
            placeholder="请输入问题"
            :disabled="ifadd != 2 ? false : true"
          />
        </el-form-item>
        <el-form-item label="领域" prop="field">
          <el-select
            v-model="dqProblem.field"
            placeholder="请选择领域"
            :disabled="ifadd != 2 ? false : true"
          >
            <el-option
              v-for="item in CategoryList"
              :key="item.label"
              :label="item.label"
              :value="item.label"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="专题" prop="special">
          <el-select
            v-model="dqProblem.special"
            placeholder="请选择专题"
            :disabled="ifadd != 2 ? false : true"
          >
            <el-option
              v-for="item in SPECIALList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item></el-form-item>
        <el-form-item label="依据" prop="basis" class="long">
          <el-select
            v-model="dqProblem.basis"
            multiple
            @visible-change="toopen"
            placeholder="请选择"
            no-data-text="请点击引用审计依据"
            :disabled="ifadd != 2 ? false : true"
          >
          </el-select>
        </el-form-item>
        <el-button
          v-if="ifadd != 2 ? true : false"
          type="primary"
          ref="basisbtn0"
          class="citebtn"
          @click="openbasis()"
          >引用审计依据</el-button
        >
        <el-form-item label="描述" prop="describe" class="long">
          <el-input
            v-model="dqProblem.describe"
            placeholder="请输入描述"
            :disabled="ifadd != 2 ? false : true"
          />
        </el-form-item>
        <el-form-item label="管理建议" prop="managementAdvice" class="long">
          <el-input
            v-model="dqProblem.managementAdvice"
            placeholder="请输入管理建议"
            :disabled="ifadd != 2 ? false : true"
          />
        </el-form-item>
        <el-form-item label="发现日期" prop="problemDiscoveryTime">
          <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="dqProblem.problemDiscoveryTime"
            style="width: 100%"
            :disabled="ifadd != 2 ? false : true"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="发现人" prop="problemFindPeople">
          <el-select
            v-model="dqProblem.problemFindPeople"
            placeholder="请选择发现人"
            :disabled="ifadd != 2 ? false : true"
          >
            <el-option
              v-for="(item, i) in personlist"
              :key="'person' + i"
              :label="item.realName"
              :value="item.realName"
            >
              {{ item.realName }}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="风险金额（万元）" prop="riskAmount" width="180">
          <el-input
            v-model="dqProblem.riskAmount"
            placeholder="请输入风险金额"
            :disabled="ifadd != 2 ? false : true"
            @keyup.native="onlyNumOnePoint"
          />
        </el-form-item>
        <el-form-item label="关联任务" prop="auditTaskUuid">
          <el-select
            disabled
            v-model="dqProblem.auditTaskUuid"
            multiple
            placeholder="请选择"
          >
            <el-option
              v-for="item in auditTasklList"
              :key="item.auditTaskUuid"
              :label="item.taskName"
              :value="item.auditTaskUuid"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <!-- <el-form-item label="领域" prop="field">
          <el-input
            v-model="dqProblem.field"
            disabled
            placeholder="请输入问题"
          />
        </el-form-item>
        <el-form-item label="问题" prop="problem">
          <el-input
            v-model="dqProblem.problem"
            disabled
            placeholder="请输入问题"
          />
        </el-form-item>
        <el-form-item label="描述" prop="describe">
          <el-input
            v-model="dqProblem.describe"
            disabled
            placeholder="请输入描述"
          />
        </el-form-item>
        <el-form-item label="管理建议" prop="managementAdvice">
          <el-input
            v-model="dqProblem.managementAdvice"
            disabled
            placeholder="请输入管理建议"
          />
        </el-form-item>
        <el-form-item label="发现日期" prop="problemDiscoveryTime">
          <el-input
            :value="repDate(dqProblem.problemDiscoveryTime)"
            disabled
            placeholder="请输入发现日期"
          />
        </el-form-item>
        <el-form-item label="发现人" prop="problemFindPeople">
          <el-input
            v-model="dqProblem.problemFindPeople"
            disabled
            placeholder="请输入发现人"
          />
        </el-form-item>
        <el-form-item label="风险金额（万元）" prop="riskAmount">
          <el-input
            v-model="dqProblem.riskAmount"
            disabled
            placeholder="请输入风险金额"
          />
        </el-form-item>
        <el-form-item label="关联任务" prop="auditTaskUuid">
          <el-input
            v-model="dqProblem.auditTaskUuid"
            disabled
            placeholder="请输入关联任务"
          />
        </el-form-item>
        <el-form-item label="依据" prop="basis">
          <el-input
            v-model="dqProblem.basis"
            disabled
            placeholder="请输入依据"
          />
        </el-form-item> -->
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="updateData()" v-if="ifupdata"
          >保存修改</el-button
        >
        <el-button type="primary" @click="dialogDetailVisible = false"
          >关闭</el-button
        >
      </div>
    </el-dialog>
    <el-dialog
      title="引用审计依据"
      :visible.sync="basisdialog"
      width="60%"
      custom-class="outmax"
    >
      <div style="display: flex; height: 100%; padding: 20px">
        <div style="max-height: 60vh; width: 50%; overflow: scroll">
          <el-form
            ref="basisform"
            class="problem-form"
            :model="dqbasis"
            label-width="120px"
            label-position="right"
          >
            <el-form-item label="审计依据名称" class="long">
              <el-select
                v-model="dqbasis.val"
                placeholder="请选择依据名称"
                @change="getbasisdetail(dqbasis.val)"
              >
                <el-option
                  v-for="item in basislist"
                  :key="item.basy_uuid"
                  :label="item.basy_name"
                  :value="item.basy_uuid"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <el-card
            class="box-card"
            style="width: 70%; min-height: 300px; margin: auto"
          >
            <el-tree
              :data="dqbasis.info.tree"
              :props="defaultProps"
              @node-click="treeNodeClick"
              default-expand-all
              v-loading="basisload"
            ></el-tree>
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
        <el-card
          class="box-card basiscard"
          style="width: 50%"
          v-loading="basisload"
        >
          <div
            v-for="(item, index) in dqbasis.info.arr"
            :key="'dqbasisarr' + index"
          >
            <div slot="header" class="clearfix" style="padding: 5px 0">
              <span
                style="font-weight: bold"
                :style="
                  item.contentLev == 1
                    ? 'font-size:18px;'
                    : item.contentLev == 2
                    ? 'font-size:16px;'
                    : 'font-size:14px;'
                "
                v-if="item.contentLev != 3"
                >{{ item.label }}</span
              >
            </div>
            <el-button
              style="padding: 3px 0 3px 20px; color: #ffba00; float: right"
              v-if="item.contentLev == 3"
              @click="choosebasis(item.attachmentContent)"
              type="text"
              >引用</el-button
            >
            <p class="" v-if="item.contentLev == 3">
              {{ item.attachmentContent }}
            </p>
          </div>
        </el-card>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="basisdialog = false">取 消</el-button>
        <el-button type="primary" @click="surebasis()">确 定</el-button>
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
  data() {
    return {
      dqProblem: {},
      options: [
        { value: "xxx1", label: "xxx1" },
        { value: "xxx2", label: "xxx2" },
      ],
      tableKey: "indicator",
      list: null,
      total: 0,
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
        basis: "",
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
      },
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
        describe: [
          { required: true, message: "请填写描述", trigger: "change" },
        ],
        field: [{ required: true, message: "请选择领域", trigger: "change" }],
        managementAdvice: [
          { required: true, message: "请填写意见", trigger: "change" },
        ],
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
      userRole:0
    };
  },
  watch: {},
  created() {
    this.getloadcascader("Category");
    this.getloadcascader("SPECIAL");
    this.getSelectTask();
    this.getperson();
    this.getme();
    this.getbasis();
    this.getList();
  },
  methods: {
    // UpNumber(e){
    //   //输入框中只允许输入数字
    //   e.target.value = e.target.value.replace(/[^\d.]/g,'')
    //   //输入框只允许输入小数点和数字，小数点后一位
    //   e.target.value = (e.target.value.match(/^\d*(\.?\d{0,1})/g)[0])
    // },
    onlyNumOnePoint(e) {
      let number_only = e.target.value;
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
      number_only = number_only.replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3");
      e.target.value = number_only;
    },
    toopen(val) {
      console.log(val);
      if (val) {
        let _this = this;
        setTimeout(function () {
          _this.$refs["basisbtn0"].handleClick();
        }, 100);

        console.log(_this.$refs["basisbtn0"]);
        return false;
      }
    },
    //获取当前人员信息
    getme() {
      this.$axios({
        url: `/wisdomaudit/init/getCurrentInfo`,
        method: "get",
        data: {},
      }).then((res) => {
        this.me = res.data.data.user.realName;
        this.userRole = res.data.data.userRole;
      });
    },
    //获取人员
    getperson() {
      this.$axios({
        url: `/wisdomaudit/user/listUserInfo?pageCurrent=1&pageSize=1000`,
        method: "get",
        data: {},
      }).then((res) => {
        this.personlist = res.data.data.list;
      });
    },
    //确定选择依据
    surebasis() {
      this.basisdialog = false;
      if (this.ifadd == 0) {
        this.temp.basis = this.dqbasis.choose;
      } else {
        this.dqProblem.basis = this.dqbasis.choose;
      }
      this.dqbasis.choose = [];
    },
    //选择依据
    choosebasis(val) {
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
    treeNodeClick() {},
    //打开依据
    openbasis() {
      this.basisdialog = true;
      this.dqbasis.choose = [];
    },
    //获取依据
    getbasis() {
      this.$axios({
        url: `/wisdomaudit/auditBasy/getAuditbasyList`,
        method: "get",
        data: {},
      }).then((res) => {
        this.basislist = res.data.data;
      });
    },
    //获取依据详情
    getbasisdetail(bid) {
      this.basisload = true;
      this.$axios({
        url: `/wisdomaudit/auditBasy/getById/` + bid + ``,
        method: "get",
        data: {},
      }).then((res) => {
        this.dqbasis.info = res.data.data.treeData;
        this.basisload = false;
      });
    },
    //领域返显
    fieldFilter(str) {
      let rep = "";
      this.CategoryList.forEach((e) => {
        if (e.value == str) {
          rep = e.label;
        }
      });
      return rep;
    },
    //专题返显
    specialFilter(str) {
      let rep = "";
      this.SPECIALList.forEach((e) => {
        if (e.value == str) {
          rep = e.label;
        }
      });
      return rep;
    },
    getSelectTask() {
      this.$axios({
        url: `/wisdomaudit/auditTask/selectTask`,
        method: "post",
        data: {
          managementProjectUuid: this.active_project,
        },
      }).then((res) => {
        this.auditTasklList = res.data.data;
      });
    },
    getloadcascader(str) {
      this.$axios({
        url: `/wisdomaudit/init/loadcascader`,
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
    openDetail(int) {
      this.ifadd = 1;
      this.$axios({
        url:
          `/wisdomaudit/problemList/getById/` + this.list[int].problemListUuid,
        method: "get",
        data: {},
      }).then((res) => {
        this.dqProblem = res.data.data;
        this.dqProblem.auditTaskUuid = this.dqProblem.auditTaskUuid.split(",");
        this.dqProblem.basis = this.dqProblem.basis
          ? this.dqProblem.basis.split(",")
          : [];
        this.ifupdata = true;
        this.dialogDetailVisible = true;
        this.$nextTick(() => {
          this.$refs["detailForm"].clearValidate();
        });
      });
    },
    checkDetail(pid) {
      this.ifadd = 2;
      this.$axios({
        url: `/wisdomaudit/problemList/getById/` + pid,
        method: "get",
        data: {},
      }).then((res) => {
        this.dqProblem = res.data.data;
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
    repDate(data) {
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
    getList(page) {
      if (page == 1) {
        this.pageQuery.pageNo = 1;
      }
      this.listLoading = true;
      this.$axios({
        url: `/wisdomaudit/problemList/pageList`,
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
    add() {
      this.dialogFormVisible = true;
      this.ifadd = 0;
      this.temp.problemFindPeople = this.me;
      this.temp.problemDiscoveryTime = new Date();
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    handleSelectionChange(val) {
      this.problemtableSelection = val;
    },
    del(pid) {
      this.$confirm("确认删除该条数据吗?删除后数据不可恢复?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$axios({
          url: `/wisdomaudit/problemList/delete/` + pid,
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
    createData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          let rep = this.temp;
          rep.auditTaskUuid = rep.auditTaskUuid.join(",");
          rep.basis = rep.basis.join(",");
          this.$axios({
            url: `/wisdomaudit/problemList/save`,
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
              this.temp.basis = "";
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
    updateData() {
      this.$refs["detailForm"].validate((valid) => {
        if (valid) {
          let rep = this.dqProblem;
          rep.auditTaskUuid = rep.auditTaskUuid.join(",");
          rep.basis = rep.basis.join(",");
          this.dialogDetailVisible = false;
          this.$axios({
            url: `/wisdomaudit/problemList/update`,
            method: "put",
            data: rep,
          }).then((res) => {
            if (res.data.code == 0) {
              this.$message({
                message: "编辑成功",
                type: "success",
              });
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
.auditproblem-btn-box {
  float: right;
}
.gary-border {
  border: 1px solid #ccc;
}
</style>
<style>
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
.auditproblem .citebtn {
  height: 40px;
  margin-bottom: 6px;
}
.canclick {
  color: rgb(27, 168, 250);
  cursor: pointer;
}
.search {
  display: flex;
  justify-content: flex-end;
  position: relative;
}
.search .el-input__inner {
  width: 220px !important;
  border-radius: 5px 0 0 5px;
}
.search .el-input__inner {
  width: 180px;
  display: flex;
  float: right;
}
.search .search_icon {
  position: absolute;
  top: 0;
  right: 70px;
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
</style>

