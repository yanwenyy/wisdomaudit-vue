<template>
  <div class="sjzl anmition_show">
    <div class="header">
      <div class="search_ms">
        <p>历史审计发现描述：</p>
        <el-input v-model="query.historyAuditFindDescribe"
                  placeholder="请输入描述名称"></el-input>
      </div>

      <!--自建任务 模型任务 筛选 -->
      <div class="search">
        <p style="min-width: 130px; text-align: right">发现人：</p>
        <el-input placeholder="请输入发现人"
                  v-model="query.findPeople">
        </el-input>
      </div>
      <el-button type="primary"
                 style="margin-left: 17px"
                 @click="search_list()">
        查询
      </el-button>
    </div>
    <div class="header"
         style="padding: 0 20px 20px">
      <el-button type="primary"
                 :disabled="isDisable"
                 @click="add_sj()">新增省内审计发现</el-button>
    </div>

    <div class="conter">
      <!-- 表单 -->
      <el-table :data="tableData_list"
                v-loading="loading"
                :header-cell-style="{ 'background-color': '#F4FAFF' }"
                style="width: 100%">
        <el-table-column type="index"
                         label="序号"
                         width="50">
        </el-table-column>
        <!-- 历史审计标题 -->
        <el-table-column prop="historyAuditFindDescribe"
                         width="200px"
                         :show-overflow-tooltip="true"
                         label="标题">
          <template slot-scope="scope">
            <div v-if="scope.row.historyAuditFindDescribe"
                 class="over">
              {{ scope.row.title}}
            </div>
            <div v-else>--</div>
          </template>
        </el-table-column>

        <!-- 历史审计发现描述 -->
        <el-table-column prop="historyAuditFindDescribe"
                         width="200px"
                         :show-overflow-tooltip="true"
                         label="历史审计发现描述">
          <template slot-scope="scope">
            <div v-if="scope.row.historyAuditFindDescribe"
                 class="over">
              {{ scope.row.historyAuditFindDescribe  }}
            </div>
            <div v-else>--</div>
          </template>
        </el-table-column>
        <!-- 被审计单位 -->
        <el-table-column prop="auditedEntityName"
                         :show-overflow-tooltip="true"
                         label="被审计单位">
          <template slot-scope="scope">
            <div v-if="scope.row.auditedEntityName">
              {{ scope.row.auditedEntityName }}
            </div>
            <div v-else>--</div>
          </template>
        </el-table-column>

        <!-- 发现人 -->
        <el-table-column prop="findPeople"
                         show-overflow-tooltip
                         label="发现人">
          <template slot-scope="scope">
            <div v-if="scope.row.findPeople">
              {{ scope.row.findPeople }}
            </div>
            <div v-else>--</div>
          </template>
        </el-table-column>

        <!-- 审计依据 -->
        <!-- <el-table-column prop="auditBasisName"
                         align="center"
                         show-overflow-tooltip
                         label="审计依据">

        </el-table-column> -->
        <!-- 发现时间 -->
        <el-table-column prop="findData"
                         show-overflow-tooltip
                         label="发现时间">
          <template slot-scope="scope">
            <p>{{ scope.row.findData | filtedate }}</p>
          </template>
        </el-table-column>
        <!-- 发现来源 -->
        <el-table-column prop="source"
                         label="发现来源 ">
          <template slot-scope="scope">
            <div v-if="scope.row.source">
              {{ scope.row.source }}
            </div>
            <div v-else>--</div>
          </template>
        </el-table-column>

        <!-- 风险金额 -->
        <el-table-column prop="riskAmount"
                         align="right"
                         show-overflow-tooltip
                         label="风险金额（万元）">
          <template slot-scope="scope">
            <div v-if="scope.row.riskAmount">
              {{ parseFloat(scope.row.riskAmount.toString()) }}
            </div>
            <div v-else>--</div>
          </template>
        </el-table-column>
        <el-table-column width="80">
        </el-table-column>
        <!-- 操作 -->
        <el-table-column prop="edit"
                         width="180"
                         label="操作">
          <template slot-scope="scope">
            <el-button @click="edit(scope.row.historyAuditFindUuid)"
                       type="text"
                       plain
                       :disabled="isDisable"
                       style="color: #0c87d6 !important; font-size: 14px !important"
                       size="small">
              编辑
            </el-button>
            <el-button @click="delete_model(scope.row.historyAuditFindUuid)"
                       plain
                       type="text"
                       style="color: #ff8a72 !important; font-size: 14px !important"
                       size="small">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 表单 end-->
    </div>

    <!-- 分页 -->
    <div class="page">
      <el-pagination @size-change="handleSizeChange"
                     :current-page="this.tableData.current"
                     @current-change="handleCurrentChange"
                     :page-size="this.tableData.size"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="this.tableData.total">
      </el-pagination>
    </div>
    <!-- 分页 end-->

    <!-- 新增历史审计发现描述 -->
    <el-dialog @close="resetForm2('add')"
               center
               :append-to-body='true'
               :close-on-click-modal="false"
               :visible.sync="dialogVisible"
               style="padding-bottom: 59px">
      <div class="title_dlag">{{ title }}</div>

      <div class="dlag_conter add">
        <el-form ref="add"
                 class="sjyjForm"
                 :model="add"
                 v-loading="ld"
                 :rules="rules">
          <!-- 历史审计发现描述 -->
          <el-form-item prop="title"
                        style="margin-bottom: 22px !important">
            <p><span style="color: red">*</span> 标题：</p>
            <el-input v-model="add.title"
                      placeholder="请输入标题"></el-input>
          </el-form-item>

          <!-- 历史审计发现描述 -->
          <el-form-item prop="historyAuditFindDescribe"
                        style="margin-bottom: 22px !important">
            <p><span style="color: red">*</span> 历史审计发现描述：</p>
            <el-input v-model="add.historyAuditFindDescribe"
                      placeholder="请输入历史审计发现描述"></el-input>
          </el-form-item>

          <!-- 被审计单位 -->
          <el-form-item prop="auditedEntity"
                        style="margin-bottom: 22px !important">
            <p>
              <span style="color: red">*</span> 被审计单位：
            </p>
            <el-select v-model="add.auditedEntity"
                       @change="changeHeader_danwei">
              <el-option v-for="item in audit_Company"
                         :key="item.auditOrgUuid"
                         :label="item.orgName"
                         :value="item.auditOrgUuid">
              </el-option>
            </el-select>
          </el-form-item>

          <!-- 领域 -->
          <el-form-item prop="field"
                        style="margin-bottom: 22px !important">
            <p><span style="color: red">*</span> 领域：</p>
            <el-select v-model="add.field"
                       @change="changeHeader_ly">
              <el-option v-for="item in problems_slect_ly"
                         :key="item.value"
                         :label="item.label"
                         :value="item.label">
              </el-option>
            </el-select>
          </el-form-item>

          <!-- 专题 -->
          <el-form-item prop="special"
                        style="margin-bottom: 22px !important">
            <p><span style="color: red">*</span> 专题：</p>
            <el-select v-model="add.special"
                       v-if="input_select==true"
                       @change="changeHeader_zt">
              <el-option v-for="item in problems_slect_zt"
                         :key="item.value"
                         :label="item.label"
                         :value="item.label">
              </el-option>
            </el-select>
            <el-input v-model="add.special"
                      v-if="input_select==false"></el-input>
          </el-form-item>

          <!-- 发现人 -->
          <el-form-item style="margin-bottom: 22px !important">
            <p>发现人：</p>
            <el-input v-model="add.findPeople"
                      placeholder="请输入发现人"></el-input>
          </el-form-item>

          <!--审计依据 -->
          <el-form-item style="margin-bottom: 22px !important">
            <p>审计依据：</p>
            <!-- <el-select v-model="add.auditBasis"
                       @change="changeHeader_yj">
              <el-option v-for="item in problems_slect_yj"
                         :key="item.basyUuid"
                         :label="item.basyName"
                         :value="item.basyUuid">
              </el-option>
            </el-select> -->
            <!-- <el-select v-model="dqProblem.basis" -->
            <el-select v-model="add.auditBasis"
                       multiple
                       @visible-change="toopen"
                       no-data-text="请点击引用审计依据">
            </el-select>
            <el-button type="primary"
                       ref="basisbtn0"
                       style="height:36px;"
                       class="citebtn"
                       @click="openbasis()">引用</el-button>
          </el-form-item>

          <!--发现日期 -->
          <el-form-item prop="findData"
                        style="margin-bottom: 22px!important">
            <p><span style="color: red">*</span>发现日期：</p>
            <el-date-picker v-model="add.findData"
                            type="date"
                            placeholder="选择日期">
            </el-date-picker>
          </el-form-item>

          <!--所属年份 -->
          <el-form-item style="margin-bottom: 22px !important">
            <p>所属年份：</p>
            <!-- <el-select v-model="add.year"
                     @change="changeHeader_nf">
            <el-option v-for="item in problems_slect"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select> -->
            <el-date-picker v-model="add.year"
                            type="year"
                            placeholder="选择年份"
                            value-format="yyyy">
            </el-date-picker>
          </el-form-item>

          <!-- 发现来源 -->
          <el-form-item style="margin-bottom: 22px !important">
            <p>发现来源：</p>
            <el-input v-model="add.source"
                      placeholder="请输入发现来源"></el-input>
          </el-form-item>

          <!-- 风险金额 -->
          <el-form-item style="margin-bottom: 22px !important">
            <p>风险金额（万元)：</p>
            <!--v-model.number="add.riskAmount"-->
            <el-input v-model="add.riskAmount"
                      type="number"
                      @keyup.native="add.riskAmount = oninput(add.riskAmount)"
                      placeholder="请输入风险金额"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer"
              class="foot">

          <el-button size="small"
                     plain
                     @click="dialogVisible = false">取 消</el-button>

          <el-button size="small"
                     type="primary"
                     v-if="title == '新增省内审计发现'"
                     :disabled="isDisable"
                     @click="save(1, 'add')">确 定</el-button>
          <el-button size="small"
                     type="primary"
                     v-else
                     :disabled="isDisable"
                     @click="save(2, 'add')">确 定</el-button>

        </span>
      </div>
    </el-dialog>

    <!-- 引用审计依据 -->
    <el-dialog title="引用审计依据"
               center
               :append-to-body='true'
               @close="resetForm()"
               :visible.sync="basisdialog"
               width="70%"
               class="post"
               custom-class="outmax">
      <div style="display: flex; height: 100%; padding: 20px">
        <div style="max-height: 60vh; width: 50%; overflow: scroll"
             class="dlag">
          <el-form ref="basisform"
                   class="problem-form problem-form-new"
                   :model="dqbasis"
                   label-width="120px"
                   label-position="right">
            <el-form-item label="审计依据名称"
                          class="long">
              <el-select v-model="dqbasis.val"
                         placeholder="请选择依据名称"
                         @change="getbasisdetail(dqbasis.val)">
                <el-option v-for="item in basislist"
                           :key="item.basy_uuid"
                           :label="item.basy_name"
                           :value="item.basy_uuid">
                </el-option>
              </el-select>

              <!-- <el-select v-model="add.auditBasis"
                        placeholder="请选择依据名称"
                       @change="changeHeader_yj">
              <el-option v-for="item in problems_slect_yj"
                         :key="item.basyUuid"
                         :label="item.basyName"
                         :value="item.basyUuid">
              </el-option>
            </el-select> -->
            </el-form-item>
          </el-form>
          <el-card class="box-card"
                   style="width: 80%; min-height: 300px; margin: auto">
            <el-tree :data="dqbasis.info.tree"
                     :props="defaultProps"
                     @node-click="treeNodeClick"
                     default-expand-all
                     v-loading="basisload"></el-tree>
          </el-card>
        </div>
        <el-card class="box-card basiscard"
                 style="width: 50%"
                 v-loading="basisload">
          <div v-for="(item, index) in dqbasis.info.arr"
               :key="'dqbasisarr' + index"
               class="card_son">
            <div slot="header"
                 class="clearfix"
                 style="padding: 5px 0;  text-align: left !important;">
              <span style="font-weight: bold; padding-left: 20px;
  box-sizing: border-box;"
                    :style="
                  item.contentLev == 1
                    ? 'font-size:18px;'
                    : item.contentLev == 2
                    ? 'font-size:16px;'
                    : 'font-size:14px;'
                "
                    v-if="item.contentLev != 3">{{ item.label }}</span>
            </div>
            <el-button style="padding: 3px 0 3px 20px; color: #ffba00; float: right"
                       v-if="item.contentLev == 3"
                       @click="choosebasis(item.attachmentContent)"
                       type="text">引用</el-button>
            <p class=""
               style="padding-left: 60px;
  box-sizing: border-box;line-height:24px; text-align: left !important;"
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
import { fmtDate } from "@SDMOBILE/model/time.js";
import {
  historicalaudit_pageList,
  historicalaudit_add,
  historicalaudit_details,
  historicalaudit_update,
  historicalaudit_delete,
  historicalaudit_loaauditorg,
  historicalaudit_yj,
} from "@SDMOBILE/api/shandong/Historicalaudit";
import { task_problems_loadcascader } from "@SDMOBILE/api/shandong/task";
import axios from "axios";
import $ from "jquery";

export default {
  components: {},
  data () {
    return {
      dqtoken: "",
      loading: false,
      dialogVisible: false,
      title: "",
      tableData: [], //列表
      tableData_list: [], //列表
      historyAuditFindUuid: "", //id 删除 编辑

      query: {
        pageNo: 1,
        pageSize: 10,
        findPeople: "", //发现人
        historyAuditFindDescribe: "", //描述
      },

      // 新增
      add: {
        title: '',//标题
        historyAuditFindDescribe: "", //发现描述
        auditedEntity: "", //被审计单位
        auditedEntityName: "", //单位name

        field: "", //领域
        special: "", //专题
        findPeople: "", //发现人
        auditBasis: [], //依据
        auditBasisName: "", //依据name
        findData: "", //发现日期
        year: "", //所属年份
        source: "", //来源
        riskAmount: "", //金额
      },
      problems_slect_ly: [], //领域
      problems_slect_zt: [], //专题
      audit_Company: [], //审计单位
      problems_slect_yj: [], //评审依据
      rules: {
        title: {
          required: true,
          message: "请填写标题",
          trigger: "blue",
        },
        historyAuditFindDescribe: {
          required: true,
          message: "请填写描述",
          trigger: "blue",
        },
        auditedEntity: {
          required: true,
          message: "请选择被审计单位",
          trigger: "change",
        },
        field: {
          required: true,
          message: "请选择领域",
          trigger: "change",
        },
        special: {
          required: true,
          message: "请选择专题",
          trigger: "change",
        },
        findData: {
          required: true,
          message: "请选择发现日期",
          trigger: "change",
        },
      },
      isDisable: false, //防止重复提交
      ld: false,

      // 审计依据
      dqProblem: {},
      dqbasis: {
        val: "",
        info: "",
        choose: [],
      },
      basislist: [],
      defaultProps: {
        children: "children",
        label: "label",
      },
      basisdialog: false,
      basisload: false,
      ifadd: 0,
      personlist: [],
      me: "",
      userRole: 0,
      input_select: true,
    };
  },
  computed: {},
  watch: {},
  created () {
    this.dqtoken = sessionStorage.getItem("TOKEN");
    // list
    let params = {
      pageNo: this.query.pageNo,
      pageSize: this.query.pageSize,
      condition: {
        findPeople: this.query.findPeople,
        historyAuditFindDescribe: this.query.historyAuditFindDescribe,
      },
    };
    this.page_list(params);

    let params2 = {
      typecode: "Category",
    };
    this.lingyu(params2); //领域

    let params3 = {
      typecode: "SPECIAL",
    };
    this.zhuanti(params3); //专题

    let params4 = {
      entity: {},
    };
    this.Company(params4); //审计单位

    let params5 = {
      pageNo: 1,
      pageSize: 100000,
    };
    this.yiju(params5);

    this.getbasis(); //依据
  },
  mounted () { },

  filters: {
    filtedate: function (date) {
      let t = new Date(date);
      // return fmtDate(t, 'yyyy-MM-dd hh:mm:ss');
      return fmtDate(t, "yyyy-MM-dd");
    },

    formatLongText (value) {
      if (value === undefined || value === null || value === '') {
        return '暂无';
      } else if (value.length > 8) {
        return value.substr(0, 8) + '...';
      } else {
        return value;
      }
    },

    ellipsis (value, limit) {
      if (!value) return ''
      if (value.length > limit) {
        return value.slice(0, limit) + '...'
      }
      return value
    },


  },

  methods: {
    // 关闭 清空引用依据
    resetForm () {
      this.dqbasis.val = '';
      this.basisdialog = false;
    },
    // 金额限制
    oninput (number) {
      let str = number.toString().replace();
      let len1 = str.substr(0, 1);
      let len2 = str.substr(1, 1);
      //如果第一位是0，第二位不是点，就用数字把点替换掉
      if (str.length > 1 && len1 == 0 && len2 != ".") {
        str = str.substr(1, 1);
      }
      //第一位不能是.
      if (len1 == ".") {
        str = "";
      }
      if (len1 == "+") {
        str = "";
      }
      if (len1 == "-") {
        str = "";
      }

      //限制只能输入一个小数点
      if (str.indexOf(".") != -1) {
        let str_ = str.substr(str.indexOf(".") + 1);
        if (str_.indexOf(".") != -1) {
          str = str.substr(0, str.indexOf(".") + str_.indexOf(".") + 1);
        }
      }
      //正则替换
      str = str.replace(/[^\d^\.]+/g, ""); // 保留数字和小数点
      str = str.replace(/^\D*([0-9]\d*\.?\d{0,6})?.*$/, "$1"); // 小数点后只能输 2 位
      // str=str.slice(0,27);
      if (str.length > 27) {
        str = str.slice(0, 27);
      }
      return str;
    },
    toopen (val) {
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
    //打开依据
    openbasis () {
      this.basisdialog = true;
      this.dqbasis.choose = [];
    },
    //确定选择依据
    surebasis () {
      this.basisdialog = false;
      // if (this.ifadd == 0) {
      // this.temp.basis = this.dqbasis.choose;
      // } else {
      this.add.auditBasis = this.dqbasis.choose;
      // }
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
    },
    //获取依据
    getbasis () {
      axios({
        url: `/wisdomaudit/auditBasy/getAuditbasyList`,
        headers: {
          TOKEN: this.dqtoken,
        },
        method: "post",
        data: {},
      }).then((res) => {
        this.basislist = res.data.data;
      });
    },
    //获取依据 change详情
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
        console.log(this.dqbasis.info);
        this.basisload = false;
      });
    },

    // 列表
    page_list (params) {
      this.loading = true;
      historicalaudit_pageList(params).then((resp) => {
        this.tableData = resp.data;
        this.tableData_list = resp.data.records;
        this.loading = false;
      });
    },
    handleSizeChange (val) {
      this.query.pageSize = val;
    },
    // 分页
    handleCurrentChange (val) {
      let params = {
        pageNo: val,
        pageSize: this.query.pageSize,
        condition: {
          findPeople: this.query.findPeople,
          historyAuditFindDescribe: this.query.historyAuditFindDescribe,
        },
      };
      this.page_list(params);
    },
    // 筛选人
    search_list () {
      let params = {
        pageNo: 1,
        pageSize: this.query.pageSize,
        condition: {
          findPeople: this.query.findPeople,
          historyAuditFindDescribe: this.query.historyAuditFindDescribe,
        },
      };
      this.page_list(params);
    },
    // 新增
    add_sj () {
      this.isDisable = true;
      setTimeout(() => {
        this.isDisable = false;
      }, 2000);
      this.add = {};
      this.title = "新增省内审计发现";
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs["add"].clearValidate();
      });
    },
    // 新增 编辑保存
    save (index, add) {
      this.isDisable = true;
      setTimeout(() => {
        this.isDisable = false;
      }, 2000);
      if (index == 1) {
        this.$refs[add].validate((valid) => {
          if (valid) {
            // 新增保存
            if (this.add.auditBasis) {
              this.auditBasis = this.add.auditBasis.join(",");
            } else {
              this.auditBasis = [];
            }

            let params = {
              title: this.add.title,
              historyAuditFindDescribe: this.add.historyAuditFindDescribe, //发现描述
              auditedEntity: this.add.auditedEntity, //被审计单位
              auditedEntityName: this.add.auditedEntityName, //被审计单位 name
              field: this.add.field, //领域
              auditBasis: this.auditBasis, //依据
              auditBasisName: this.add.auditBasisName, //依据name
              special: this.add.special, //专题
              findPeople: this.add.findPeople, //发现人

              findData: this.add.findData, //发现日期
              year: this.add.year, //所属年份
              source: this.add.source, //来源
              riskAmount: this.add.riskAmount, //金额
            };
            // 新增
            historicalaudit_add(params).then((resp) => {
              if (resp.code == 0) {
                this.$message({
                  message: "新增成功",
                  type: "success",
                });
                this.dialogVisible = false;
                // 刷新列表
                let params = {
                  pageNo: this.query.pageNo,
                  pageSize: this.query.pageSize,
                  condition: {
                    findPeople: this.query.findPeople,
                    historyAuditFindDescribe:
                      this.query.historyAuditFindDescribe,
                  },
                };
                this.page_list(params);
              } else {
                this.$message({
                  message: resp.msg,
                  type: "error",
                });
              }
            });
          } else {
            this.$message.info("请填写信息");
            return false;
          }
        });
      } else {
        this.$refs[add].validate((valid) => {
          if (valid) {
            if (this.add.auditBasis) {
              this.auditBasis = this.add.auditBasis.join(",");
            } else {
              this.auditBasis = [];
            }
            // 编辑保存
            let params = {
              title: this.add.title,
              historyAuditFindDescribe: this.add.historyAuditFindDescribe, //发现描述
              auditedEntity: this.add.auditedEntity, //被审计单位
              auditedEntityName: this.add.auditedEntityName, //被审计单位 name

              field: this.add.field, //领域
              special: this.add.special, //专题
              findPeople: this.add.findPeople, //发现人
              auditBasis: this.auditBasis, //依据
              auditBasisName: this.add.auditBasisName, //依据name

              findData: this.add.findData, //发现日期
              year: this.add.year, //所属年份
              source: this.add.source, //来源
              riskAmount: this.add.riskAmount, //金额
              historyAuditFindUuid: this.historyAuditFindUuid, // 主键id
            };

            // 编辑保存
            historicalaudit_update(params).then((resp) => {
              if (resp.code == 0) {
                this.$message({
                  message: "编辑成功",
                  type: "success",
                });
                this.dialogVisible = false;
                // 刷新列表
                let params = {
                  pageNo: this.query.pageNo,
                  pageSize: this.query.pageSize,
                  condition: {
                    findPeople: this.query.findPeople,
                    historyAuditFindDescribe:
                      this.query.historyAuditFindDescribe,
                  },
                };
                this.page_list(params);
              } else {
                this.$message({
                  message: resp.msg,
                  type: "error",
                });
              }
            });
          } else {
            this.$message.info("请填写信息");
            return false;
          }
        });
      }
    },

    // 编辑
    edit (id) {
      this.ld = true;
      this.isDisable = true;
      setTimeout(() => {
        this.isDisable = false;
      }, 2000);
      this.historyAuditFindUuid = id;
      this.title = "编辑省内审计发现";
      this.dialogVisible = true;
      let params = {
        id: this.historyAuditFindUuid,
      };
      (this.add = {
        title: "",
        historyAuditFindDescribe: "", //发现描述
        auditedEntity: "", //被审计单位
        field: "", //领域
        special: "", //专题
        findPeople: "", //发现人
        auditBasis: "", //依据
        findData: "", //发现日期
        year: "", //所属年份
        source: "", //来源
        riskAmount: "", //金额
      }),
        //清空
        this.$nextTick(() => {
          this.$refs["add"].clearValidate();
        });

      // 编辑详情
      historicalaudit_details(params).then((resp) => {
        this.ld = false;

        let data = resp.data;
        (this.add.historyAuditFindDescribe = data.historyAuditFindDescribe), //发现描述
          (this.add.auditedEntity = data.auditedEntity); //被审计单位
        this.add.title = data.title;//标题
        this.add.field = data.field; //领域
        this.add.special = data.special; //专题
        this.add.findPeople = data.findPeople; //发现人
        this.add.auditBasis = data.auditBasis ? data.auditBasis.split(",") : []; //依据
        // this.add.auditBasisName = data
        // auditBasisName:this.add.auditBasisName ,
        this.add.findData = data.findData; //发现日期
        this.add.year = data.year; //所属年份
        this.add.source = data.source; //来源
        this.add.riskAmount = data.riskAmount; //金额
      });
    },

    // 新增任务关闭
    resetForm2 (add) {
      this.$refs[add].resetFields();
      this.add.auditBasis = []; //清空 依据
      this.dqbasis.info = [];
      // 关闭验证
      this.input_select = true;//专题 恢复默认

    },
    // 删除
    delete_model (id) {
      this.$confirm(`将永久删除当前内容`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // let params = {
          //   ids: id,
          // }
          // this.task_problems_delete_btn(params);

          this.historyAuditFindUuid = id;
          let params = {
            ids: this.historyAuditFindUuid,
          };
          // 删除
          historicalaudit_delete(params).then((resp) => {
            if (resp.code == 0) {
              this.$message({
                message: "删除成功",
                type: "success",
              });
              let params = {
                pageNo: this.query.pageNo,
                pageSize: this.query.pageSize,
                condition: {
                  findPeople: this.query.findPeople,
                  historyAuditFindDescribe: this.query.historyAuditFindDescribe,
                },
              };
              this.page_list(params);
            } else {
              this.$message({
                message: resp.msg,
                type: "error",
              });
            }
          });
        })
        .catch(() => { });
    },

    // 领域select
    lingyu (params) {
      task_problems_loadcascader(params).then((resp) => {
        this.problems_slect_ly = resp.data;
      });
    },
    // 专题
    zhuanti (params) {
      task_problems_loadcascader(params).then((resp) => {
        this.problems_slect_zt = resp.data;
      });
    },
    // 审计单位
    Company (params) {
      historicalaudit_loaauditorg(params).then((resp) => {
        this.audit_Company = resp.data;
      });
    },
    // 依据
    yiju (params) {
      historicalaudit_yj(params).then((resp) => {
        this.problems_slect_yj = resp.data.records;
        console.log(resp.data);
      });
    },
    // 单位
    changeHeader_danwei (val) {
      // this.add.auditedEntity = val;

      let obj = {};
      obj = this.audit_Company.find((item) => {
        return item.auditOrgUuid === val;
      });
      this.add.auditedEntity = val; //依据   key
      this.add.auditedEntityName = obj.orgName; //依据 name
    },

    // 领域change
    changeHeader_ly (val) {
      this.add.field = val;
    },
    // 专题change
    changeHeader_zt (val) {
      this.add.special = val;
      if (val == '其他') {
        this.input_select = false;
        this.add.special = ''
      }
    },

    // 依据change
    changeHeader_yj (val) {
      // this.add.auditBasis = val
      // console.log(this.add.auditBasis);
      let obj = {};
      obj = this.problems_slect_yj.find((item) => {
        return item.basyUuid === val;
      });
      this.add.auditBasis = val; //依据   key
      this.add.auditBasisName = obj.basyName; //依据 name
    },
    // 年份change
    changeHeader_nf (val) {
      this.add.year = val;
    },
  },
};
</script>

<style scoped>
@import "../../../assets/styles/css/yw2.css";
@import "../../../assets/styles/css/lhg.css";
.sjyjForm .el-tag.el-tag--info {
  width: 250px !important;
}
.conter >>> .el-tooltip div {
  display: block;
  width: auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

>>> .el-select__tags-text {
  max-width: 250px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dlag >>> .el-form-item__content,
.dlag >>> .el-card__body .clearfix {
  text-align: left !important;
  box-sizing: border-box;
}

/* 引用依据 */
.post >>> .el-tree-node {
  white-space: break-spaces !important;
}
.post >>> .el-tree-node__content {
  cursor: pointer;
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
.dlag >>> .el-card__body .clearfix span {
  text-align: left !important;
}

>>> .el-dialog--center .el-dialog__body {
  padding: 0 !important;
}
>>> .foot .el-button {
  font-weight: normal;
}
.dlag_conter >>> ::-webkit-input-placeholder {
  color: #c0c4cc !important;
}
.dlag_conter >>> .el-form {
  padding: 20px 0 0;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  width: 525px;
}
/* 引用按钮 */
.dlag_conter >>> .citebtn {
  margin-left: 10px;
  height: 40px;
}

.header >>> .el-input__inner::-webkit-input-placeholder {
  color: #c0c4cc !important;
}
.app-main {
  background-color: #fff;
}
.sjzl >>> .el-dialog--center .el-dialog__body {
  padding: 0;
}
.dlag_conter {
  padding: 0 20px 20px 20px;
  box-sizing: border-box;
}
.header {
  display: flex;
  padding: 20px;
  box-sizing: border-box;
  align-items: center;
}
.search_ms {
  display: flex;
  align-items: center;
}
.search_ms p {
  min-width: 130px;
}
.search {
  display: flex;
  justify-content: flex-end;
  position: relative;
  align-items: center;
}
.search >>> .el-input__inner {
  width: 180px;
  display: flex;
  float: right;
  border-radius: 0;
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
  color: #fff;
  cursor: pointer;
  background: rgb(12, 135, 214) !important;
}
.search >>> .el-icon-search {
  color: #fff !important;
}
.search >>> .el-button {
  border-radius: 0 5px 5px 0;
  /* background: #1371cc !important; */
}

.conter {
  display: flex;
  padding: 0 20px;
  box-sizing: border-box;
}
.conter >>> .el-table {
  min-height: 500px;
}
.dlag_conter {
  padding-bottom: 25px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.dlag_conter >>> p {
  min-width: 135px;
  text-align: right;
}
.dlag_conter >>> .foot {
  width: 100%;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 20px;
}
.dlag_conter >>> .foot .is-plain {
  background: #ffffff;
  border: 1px solid #dcdfe6;
}
.dlag_conter >>> .el-form {
  padding: 20px 0 0;
  box-sizing: border-box;
}
.dlag_conter >>> .el-form-item__error {
  left: 130px !important;
}
.dlag_conter >>> .el-form-item__content {
  /* margin-bottom: 20px; */
  width: 100%;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  box-sizing: border-box;
}
.dlag_conter >>> .el-input {
  width: 300px;
}

.page {
  width: 100%;
  padding: 20px 10px;
  display: flex;
  justify-content: flex-end;
}

.dlag >>> .el-form-item__label {
  width: 120px;
  float: left !important;
}
.dlag >>> .el-form-item__content {
  float: left !important;
  margin-left: 0 !important;
}
.sjyjForm {
  text-align: left !important;
}
>>> .sjyjForm .el-form-item__label {
  float: left !important;
}
</style>
