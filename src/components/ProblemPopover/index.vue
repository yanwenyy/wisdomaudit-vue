<template>
  <div class="problempopover">
    <!-- 选择复核人 -->
    <el-dialog title="提交审核"
               :append-to-body='true'
               :visible.sync="todo"
               append-to-body
               :close-on-click-modal="false">
      <div style="padding: 20px">
        <el-form :model="todolist"
                 label-width="80px">
          <el-form-item label="选择复核人">
            <el-select style="width: 70%"
                       v-model="todolist.person">
              <el-option label="测试"
                         value="12345" />
            </el-select>
          </el-form-item>
        </el-form>
        <el-row>
          <el-col align="right">
            <el-button @click="todo = false">取消 </el-button>
            <el-button type="primary"
                       @click="pushtodo()">确定 </el-button>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
    <!-- 问题新增和编辑的弹框 -->
    <!-- <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="problemdialogFormVisible"
      :close-on-click-modal="false"
    > -->
    <div>
      <!-- label-width="140px" -->
      <el-form ref="dataFormcomp"
               :rules="rules"
               :model="temp"
               label-position="right"
               class="detail-form"
               style="height: 62vh; overflow: auto">
        <el-row>
          <el-col :span="11">
            <el-form-item label="问题名称"
                          prop="problemName">
              <el-input v-model="temp.problemName"
                        :placeholder="disableUpdate === true ? '' : '请输入问题名称'"
                        :disabled="disableUpdate" />
            </el-form-item>
          </el-col>
          <el-col :span="11"
                  :offset="2">
            <el-form-item label="问题来源"
                          prop="problemSource">
              <el-select v-model="temp.problemSource"
                         :placeholder="disableUpdate === true ? '' : '问题来源'"
                         style="width: 100%"
                         disabled="disabled">
                <el-option v-for="item in problemSourceList"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="项目名称"
                          prop="projectUuid">
              <el-select v-model="temp.projectUuid"
                         :placeholder="disableUpdate === true ? '' : '请选择项目名称'"
                         :disabled="disableUpdate"
                         style="width: 100%"
                         @change="resetAudit">
                <el-option v-for="item in projectQueryList"
                           :key="item.projectUuid"
                           :label="item.projectName"
                           :value="item.projectUuid" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11"
                  :offset="2">
            <el-form-item label="是否重要"
                          prop="isImportant">
              <el-select v-model="temp.isImportant"
                         :placeholder="disableUpdate === true ? '' : '请选择是否重要'"
                         :disabled="disableUpdate"
                         style="width: 100%">
                <el-option v-for="item in isImportantList"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="审计人员"
                          prop="auditPersonUuid">
              <el-select v-model="temp.auditPersonUuid"
                         :placeholder="disableUpdate === true ? '' : '请选择审计人员'"
                         :disabled="disableUpdate"
                         style="width: 100%">
                <el-option v-for="item in personQueryList"
                           :key="item.auditPersonUuid"
                           :label="item.auditPersonName"
                           :value="item.auditPersonUuid" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11"
                  :offset="2">
            <el-form-item label="问题发现时间"
                          prop="discoveryTime">
              <el-date-picker v-model="temp.discoveryTime"
                              type="datetime"
                              value-format="yyyy-MM-dd HH:mm:ss"
                              :placeholder="
                  disableUpdate === true ? '' : '请选择问题发现时间'
                "
                              style="width: 100%"
                              :disabled="disableUpdate" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="问题分类"
                          prop="problemType">
              <el-input v-model="temp.problemType"
                        :placeholder="disableUpdate === true ? '' : '请选择问题分类'"
                        :disabled="disableUpdate"
                        @focus="handleTreeView()" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="21">
            <el-form-item label="问题明细:" />
          </el-col>
          <el-col align="right">
            <!-- 新增 -->
            <el-button type="primary"
                       class="oper-btn add"
                       :disabled="disableUpdate"
                       @click="detailHandleCreate()" />
            <!-- 修改 -->
            <!--<el-button type="primary" class="oper-btn edit"-->
            <!--:disabled="detailSelections.length !== 1 && disableUpdate"-->
            <!--@click="detailHandleUpdate()"/>-->
            <!-- 删除 -->
            <!--<el-button type="primary" class="oper-btn delete" :disabled="detailSelections.length === 0 && disableUpdate"-->
            <!--@click=""/>-->
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <template>
              <el-table :key="detailTableKey"
                        v-loading="detailListLoading"
                        stripe
                        fit
                        style="width: 100%"
                        border
                        :data="temp.problemDetailsList"
                        highlight-current-row
                        @selection-change="handleDetailSelectionChange">
                <!--<el-table-column  label="序号"  align="center"  type="index" />-->
                <!--<el-table-column type="selection" align="center" v-if="!disableUpdate"/>-->
                <el-table-column label="问题明细"
                                 width="200px"
                                 align="center"
                                 prop="problemDetailDesc">
                  <template slot-scope="scope">
                    <el-link :underline="false"
                             type="primary"
                             @click="showProblemDetail(scope.row)">{{ scope.row.problemDetailDesc }}</el-link>
                  </template>
                </el-table-column>
                <el-table-column label="整改措施"
                                 width="200px"
                                 align="center"
                                 prop="rectifyMeasure" />
                <el-table-column label="最晚整改时间"
                                 width="200px"
                                 align="center"
                                 prop="rectifyTime" />
                <el-table-column label="责任人"
                                 width="200px"
                                 align="center"
                                 prop="dutyPerson" />
                <el-table-column label="违规积分"
                                 width="200px"
                                 align="center"
                                 prop="violationPoints" />
                <el-table-column label="处罚金额"
                                 width="200px"
                                 align="center"
                                 prop="penalty" />
                <el-table-column label="是否入账"
                                 width="200px"
                                 align="center"
                                 prop="isEnterAccount"
                                 :formatter="formatIsImportant" />
                <el-table-column label="整改状态"
                                 width="200px"
                                 align="center"
                                 prop="rectifyStatus"
                                 :formatter="formatStatus" />
                <el-table-column label="操作"
                                 width="200px"
                                 align="center"
                                 fixed="right">
                  <template slot-scope="scope">
                    <!--修改-->
                    <el-button type="primary"
                               class="oper-btn edit"
                               @click="detailHandleUpdate(scope.$index)"
                               :disabled="disableUpdate" />
                    <!--删除-->
                    <el-button type="primary"
                               class="oper-btn delete"
                               @click="detailHandleDelete(scope.$index)"
                               :disabled="disableUpdate" />
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- </el-dialog> -->
    <!--问题明细新增+编辑框-->
    <el-dialog :title="detailTextMap[detailDialogStatus]"
               :visible.sync="detailDialogFormVisible"
               :append-to-body='true'
               :close-on-click-modal="false"
               append-to-body>
      <!-- label-width="140px" -->
      <el-form ref="detailDataFormcomp"
               :rules="detailRules"
               :model="detailTemp"
               label-position="right"
               class="detail-form"
               style="height: 62vh; overflow: auto">
        <el-row>
          <el-col :span="11">
            <el-form-item label="责任人"
                          prop="dutyPerson">
              <el-input v-model="detailTemp.dutyPerson"
                        :placeholder="
                  detailDisableUpdate === true ? '' : '请输入责任人'
                "
                        :disabled="detailDisableUpdate" />
            </el-form-item>
          </el-col>
          <el-col :span="11"
                  :offset="2">
            <el-form-item label="整改状态"
                          prop="rectifyStatus">
              <el-select v-model="detailTemp.rectifyStatus"
                         :placeholder="detailDisableUpdate === true ? '' : '整改状态'"
                         :disabled="detailDisableUpdate"
                         style="width: 100%">
                <el-option v-for="item in rectifyStatusList"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="违规积分"
                          prop="violationPoints">
              <el-input v-model="detailTemp.violationPoints"
                        :placeholder="
                  detailDisableUpdate === true ? '' : '请输入违规积分'
                "
                        :disabled="detailDisableUpdate" />
            </el-form-item>
          </el-col>
          <el-col :span="11"
                  :offset="2">
            <el-form-item label="整改时间"
                          prop="rectifyTime">
              <el-date-picker v-model="detailTemp.rectifyTime"
                              type="datetime"
                              value-format="yyyy-MM-dd HH:mm:ss"
                              :placeholder="
                  detailDisableUpdate === true ? '' : '请选择整改时间'
                "
                              style="width: 100%"
                              :disabled="detailDisableUpdate" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="处罚金额"
                          prop="penalty">
              <el-input v-model="detailTemp.penalty"
                        :placeholder="
                  detailDisableUpdate === true ? '' : '请输入处罚金额'
                "
                        :disabled="detailDisableUpdate" />
            </el-form-item>
          </el-col>
          <el-col :span="11"
                  :offset="2">
            <el-form-item label="是否入账"
                          prop="isEnterAccount">
              <el-select v-model="detailTemp.isEnterAccount"
                         :placeholder="
                  detailDisableUpdate === true ? '' : '请选择是否入账'
                "
                         :disabled="detailDisableUpdate"
                         style="width: 100%">
                <el-option v-for="item in isEnterAccountList"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="问题明细"
                          prop="problemDetailDesc">
              <el-input v-model="detailTemp.problemDetailDesc"
                        :placeholder="
                  detailDisableUpdate === true ? '' : '请输入问题明细'
                "
                        :disabled="detailDisableUpdate"
                        type="textarea" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="整改措施"
                          prop="rectifyMeasure">
              <el-input v-model="detailTemp.rectifyMeasure"
                        :placeholder="
                  detailDisableUpdate === true ? '' : '请输入整改措施'
                "
                        :disabled="detailDisableUpdate"
                        type="textarea" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer">
        <el-button v-if="!detailCloseStatus"
                   @click="detailDialogFormVisible = false">取消</el-button>
        <el-button v-if="detailCloseStatus"
                   type="primary"
                   @click="detailDialogFormVisible = false">关闭
        </el-button>
        <el-button v-if="!detailCloseStatus"
                   type="primary"
                   @click="
            detailDialogStatus === 'detailCreate'
              ? detailCreateData()
              : detailUpdateData()
          ">保存
        </el-button>
      </div>
    </el-dialog>
    <!--树弹框-->
    <el-dialog title="请选择问题分类"
               :append-to-body='true'
               :visible.sync="dialogTreeFormVisible"
               :close-on-click-modal="false"
               append-to-body>
      <div style="height: 62vh; overflow: auto">
        <el-input v-model="filterText"
                  placeholder="输入关键字进行过滤" />
        <!-- :check-strictly="true" 父子节点不关联 -->
        <el-tree ref="tree"
                 :data="ptFatherTreeData"
                 :props="defaultProps"
                 :check-strictly="true"
                 show-checkbox
                 default-expand-all
                 :filter-node-method="filterNode"
                 node-key="id"
                 style="margin-top: 10px"
                 @node-click="handleNodeClick"
                 @check-change="checkChange" />
      </div>
      <div slot="footer">
        <el-button v-if="!closeStatus"
                   @click="dialogTreeFormVisible = false">取消</el-button>
        <el-button v-if="closeStatus"
                   type="primary"
                   @click="dialogTreeFormVisible = false">确定</el-button>
        <el-button v-if="!closeStatus"
                   type="primary"
                   @click="insertOrg()">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getDictList } from '@/utils'
import { save, update, del, personList, getProjectList, toTreeData } from '@WISDOMAUDIT/api/wisdomaudit/problem'
export default {
  props: {
    closeStatus: false,
    // 问题是否能修改
    disableUpdate: true,
    temp: {
      problemUuid: null, // 问题UUID
      problemName: null, // 问题name
      problemSource: null, // 问题来源
      projectUuid: null, // 项目UUID
      projectName: null, // 项目name
      isImportant: null, // 是否重要
      auditPersonUuid: null, // 审计人员UUID
      auditPersonName: null, // 审计人员name
      discoveryTime: null, // 问题发现时间
      problemType: null, // 问题类型
      problemDetailsList: [], // 问题明细List
    },
    dialogStatus: 'create',
  },
  data () {
    // 数字校验
    const isNum = (rule, value, callback) => {
      const price = /^[0-9]*$/;
      if (value == null) {
        value = "";
      }
      if (!price.test(value)) {
        callback(new Error("该项必须填写数字"));
      } else {
        callback();
      }
    };
    return {
      list: null, // 问题结果集
      problemdialogFormVisible: true,
      // 格式化参数列表
      formatMap: {
        rectifyStatus: {
          1: "未整改",
          2: "整改中",
          3: "已整改",
          4: "无法整改",
          null: "",
        },
        isImportant: {
          1: "是",
          0: "否",
        },
      },
      // 问题属性绑定
      //   temp: {
      //     problemUuid: null, // 问题UUID
      //     problemName: null, // 问题name
      //     problemSource: null, // 问题来源
      //     projectUuid: null, // 项目UUID
      //     projectName: null, // 项目name
      //     isImportant: null, // 是否重要
      //     auditPersonUuid: null, // 审计人员UUID
      //     auditPersonName: null, // 审计人员name
      //     discoveryTime: null, // 问题发现时间
      //     problemType: null, // 问题类型
      //     problemDetailsList: [], // 问题明细List
      //   },
      // 问题明细属性绑定
      detailTemp: {
        dutyPerson: null, // 责任人
        problemUuid: null, // 问题Uuid
        rectifyStatus: null, // 整改状态
        violationPoints: null, // 违规积分
        rectifyTime: null, // 整改时间
        penalty: null, // 处罚金额
        isEnterAccount: null, // 是否入账
        problemDetailDesc: null, // 问题明细
        rectifyMeasure: null, // 整改措施
      },
      // 问题信息弹窗绑定
      selections: [],
      textMap: {
        update: "修改问题",
        create: "生成问题",
        show: "查看问题详情",
      },
      // 问题详细信息弹窗绑定
      detailSelections: [],
      detailDialogFormVisible: false,
      detailDialogStatus: "",
      detailTextMap: {
        detailUpdate: "修改问题明细",
        detailCreate: "新增问题明细",
        detailShow: "查看问题明细详情",
      },
      // 新增问题的表单验证
      rules: {
        problemName: [
          { required: true, message: "请填写问题名称", trigger: "change" },
          { max: 100, message: "问题名称在100个字符之内", trigger: "change" },
        ],
        problemSource: [{ required: true }],
        projectUuid: [
          { required: true, message: "请选择项目名称", trigger: "change" },
        ],
        isImportant: [{ required: true, message: "请选择", trigger: "change" }],
        auditPersonUuid: [
          { required: true, message: "请选择审计人员", trigger: "change" },
        ],
        problemType: [
          { required: true, message: "请选择问题分类", trigger: "change" },
        ],
      },
      // 新增问题明细的表单验证
      detailRules: {
        dutyPerson: [
          { required: true, message: "请填写责任人", trigger: "change" },
          { max: 100, message: "问题名称在100个字符之内", trigger: "change" },
        ],
        rectifyStatus: [
          { required: true, message: "请选择整改状态", trigger: "change" },
        ],
        problemDetailDesc: [
          { required: true, message: "请输入问题明细", trigger: "change" },
        ],
        violationPoints: [
          { required: false, message: "请输入违规积分", trigger: "change" },
          { validator: isNum, trigger: "change" },
        ],
      },
      // 问题明细窗口属性
      detailDisableUpdate: false,
      detailCloseStatus: false,
      // “问题来源属性”下拉框列表
      problemSourceList: [
        { label: "现场审计", value: '1' },
        { label: "审计模型", value: '2' },
      ],
      // “整改状态”下拉框列表
      rectifyStatusList: [
        { label: "未整改", value: 1 },
        { label: "整改中", value: 2 },
        { label: "已整改", value: 3 },
        { label: "无法整改", value: 4 },
      ],
      // “是否重要”属性下拉框列表
      isImportantList: [
        { label: "是", value: 1 },
        { label: "否", value: 2 },
      ],
      // “是否入账”属性下拉框列表
      isEnterAccountList: [
        { label: "是", value: 1 },
        { label: "否", value: 2 },
      ],
      // 修改、删除时锁定记录下标
      detailIndex: null,
      detailList: null, // 问题明细结果集
      projectQueryList: null, // 项目结果集
      personQueryList: null, // 所属项目组成员结果集
      ptFatherTreeData: [""], // 问题分类树组件父节点数据
      ptSonTreeData: [""], // 问题分类树组件子节点数据
      ptHeadTreeData: [""], // 问题分类一级节点数据
      detailListLoading: false,
      detailTableKey: "problemDetailUuid",
      // 问题分类树相关属性
      filterText: "",
      checkedId: null,
      dialogTreeFormVisible: false,
      defaultProps: {
        children: "children",
        label: "label",
        id: "id",
        value: "",
      },
      todo: false,
      todolist: { preson: "12345" },
    };
  },
  created () {
    // 项目列表初始化
    this.getPreLoadProjectList()
  },
  watch: {
    // 监听控制参数
    dialogFormVisible: {
      handler: function () {
        if (this.dialogFormVisible) {
          this.problemdialogFormVisible = this.dialogFormVisible;
        }
        // this.getProjectPerson(this.temp.projectUuid);
      },
    },
    problemdialogFormVisible: {
      handler: function () {
        if (!this.problemdialogFormVisible) {
          console.log(
            "problemdialogFormVisible:" + this.problemdialogFormVisible
          );
          this.changeparent(false);
        }
        // this.getProjectPerson(this.temp.projectUuid);
      },
    },
    filterText (val) {
      this.$refs.tree.filter(val)
    },
    // 监听项目UUID
    "temp.projectUuid": {
      handler: function () {
        this.getProjectPerson(this.temp.projectUuid);
      },
    },
    // 监听问题明细违规积分
    "detailTemp.violationPoints": {
      handler: function () {
        if (
          typeof this.detailTemp.violationPoints != "undefined" &&
          this.detailTemp.violationPoints != null
        ) {
          this.detailTemp.penalty = this.detailTemp.violationPoints * 100;
        }
      },
    },
  },
  methods: {
    /**
   * 自动生成8位Uuid
   */
    randomString4Len () {
      //var len = 64 * 1
      var len = 8;
      var $chars =
        "ABCDEFGHILJKMNOPQRSTUVWXYZabcdefghijklmnoprstuvwxyz1234567890";
      var maxLen = $chars.length;
      var str = "";
      for (var i = 0; i < len; i++) {
        str += $chars.charAt(Math.floor(Math.random() * maxLen));
      }
      return str;
    },
    getNowFormatDay () {
      var date = new Date();
      return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDay();
    },
    pushtodo () {
      this.todo = false
      console.log(this.randomString4Len())
      console.log(this.getNowFormatDay())

    },
    todoaudit () {
      this.todo = true;
    },
    changeparent (val) {
      this.$emit("changedialogFormVisible", val);
      return;
    },
    // 问题明细表单初始化
    detailResetTemp () {
      this.detailTemp = {
        dutyPerson: null, // 责任人
        problemUuid: null, // 问题Uuid
        rectifyStatus: null, // 整改状态
        violationPoints: null, // 违规积分
        rectifyTime: null, // 整改时间
        penalty: null, // 处罚金额
        isEnterAccount: null, // 是否入账
        problemDetailDesc: null, // 问题明细
        rectifyMeasure: null, // 整改措施
      };
    },
    // 加载项目列表
    getPreLoadProjectList () {
      getProjectList().then((resp) => {
        this.projectQueryList = resp.data;
        if (this.dialogStatus == 'create') {
          if (resp.data !== null && resp.data.length && this.temp.projectUuid === null) {
            this.temp.projectUuid = resp.data[0].projectUuid;
            this.temp.projectName = resp.data[0].projectName;
            this.getProjectPerson(resp.data[0].projectUuid);
          }
          if (this.temp.projectUuid !== null) {
            this.getProjectPerson(this.temp.projectUuid);
          }
        }
      });
      // 去除校验
      this.$nextTick(() => {
        this.$refs["dataFormcomp"].clearValidate();
      })
      switch (this.dialogStatus) {
        case 'update':
          this.getProjectPerson(this.temp.projectUuid)
          break
        case 'show':
          // 编辑明细禁用
          this.detailDisableUpdate = true
          break

      }
    },
    // 问题明细添加按钮触发函数
    detailHandleCreate () {
      this.detailCloseStatus = false;
      this.detailDisableUpdate = false;
      this.detailResetTemp();
      this.detailDialogStatus = "detailCreate";
      this.detailDialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["detailDataFormcomp"].clearValidate();
      });
    },
    // 新增问题
    createData () {
      this.$refs["dataFormcomp"].validate((valid) => {
        if (valid) {
          // 界面无输入域，自动赋值项目Uuid和审计人员Name
          if (
            typeof this.temp.projectUuid !== "undefined" &&
            this.temp.projectUuid !== null
          ) {
            this.temp.projectName = _.find(this.projectQueryList, [
              "projectUuid",
              this.temp.projectUuid,
            ]).projectName;
          }
          if (
            typeof this.temp.auditPersonUuid !== "undefined" &&
            this.temp.auditPersonUuid !== null
          ) {
            this.temp.auditPersonName = _.find(this.personQueryList, [
              "auditPersonUuid",
              this.temp.auditPersonUuid,
            ]).auditPersonName;
          }
          if (this.temp.problemDetailsList) {
          } else {
            this.temp.problemDetailsList = [];
          }
          save(this.temp).then(() => {
            this.$emit("refreshesParent");
            this.$emit("changedialogFormVisible", false);
            // this.dialogFormVisible = false;
            this.$notify({
              title: this.$t("message.title"),
              message: this.$t("message.insert.success"),
              type: "success",
              duration: 2000,
              position: "bottom-right",
            });
          });
        }
      });
    },
    // 新增问题明细
    detailCreateData () {
      this.$refs["detailDataFormcomp"].validate((valid) => {
        // 判断问题明细List是否为空，为空则将其转为数组防止无法push
        if (valid) {
          if (this.temp.problemDetailsList === null)
            this.temp.problemDetailsList = [];
          this.temp.problemDetailsList.push(this.detailTemp); // 将明细表单的值存入问题的List
          this.detailDialogFormVisible = false;
        }
      });
    },
    updateData () {
      this.$refs["dataFormcomp"].validate((valid) => {
        if (valid) {
          // 界面无输入域，自动赋值项目name和审计人员name
          if (
            typeof this.temp.projectUuid !== "undefined" &&
            this.temp.projectUuid !== null
          ) {
            this.temp.projectName = _.find(this.projectQueryList, [
              "projectUuid",
              this.temp.projectUuid,
            ]).projectName;
          }
          if (
            typeof this.temp.auditPersonUuid !== "undefined" &&
            this.temp.auditPersonUuid !== null
          ) {
            this.temp.auditPersonName = _.find(this.personQueryList, [
              "auditPersonUuid",
              this.temp.auditPersonUuid,
            ]).auditPersonName;
          }
          const tempData = Object.assign({}, this.temp);
          if (tempData.problemDetailsList) {
          } else {
            tempData.problemDetailsList = [];
          }
          update(tempData).then(() => {
            // const index = this.list.findIndex(
            //   (v) => v.problemUuid === this.temp.problemUuid
            // );
            // this.list.splice(index, 1, this.temp);
            this.$emit("changedialogFormVisible", false);
            // this.dialogFormVisible = false;
            this.$emit("refreshesParent");
            this.$notify({
              title: this.$t("message.title"),
              message: this.$t("message.update.success"),
              type: "success",
              duration: 2000,
              position: "bottom-right",
            });
          });
        }
      });
    },
    // 点击问题明细修改按钮事件
    detailHandleUpdate (str) {
      // this.detailIndex = str //将取得的下标做临时存储
      this.detailCloseStatus = false;
      this.detailDisableUpdate = false;
      this.detailTemp = this.temp.problemDetailsList[str]; // copy obj
      this.detailDialogStatus = "detailUpdate";
      this.detailDialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["detailDataFormcomp"].clearValidate();
      });
    },
    detailUpdateData () {
      this.$refs["detailDataFormcomp"].validate((valid) => {
        if (valid) {
          // this.temp.problemDetailsList.splice(this.detailIndex,1,this.detailTemp)
          this.detailDialogFormVisible = false;
        }
      });
    },
    // 显示问题明细详情
    showProblemDetail (data) {
      this.detailCloseStatus = true;
      this.detailDisableUpdate = true;
      this.detailTemp = Object.assign({}, data); // copy obj
      this.detailDialogStatus = "detailShow";
      this.detailDialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["detailDataFormcomp"].clearValidate();
      });
    },
    // 删除问题明细
    detailHandleDelete (str) {
      this.$confirm(this.$t("confirm.delete"), this.$t("confirm.title"), {
        confirmButtonText: this.$t("confirm.okBtn"),
        cancelButtonText: this.$t("confirm.cancelBtn"),
        type: "warning",
      }).then(() => {
        this.temp.problemDetailsList.splice(str, 1);
      });
    },
    // 树节点过滤
    filterNode (value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    handleNodeClick (item, node, self) {
      // 自己定义的editCheckId，防止单选出现混乱
      this.checkedId = item.id;
      this.$refs.tree.setCheckedKeys([item.id]);
    },
    checkChange (item, node, self) {
      if (node === true) {
        this.checkedId = item.id;
        this.$refs.tree.setCheckedKeys([item.id]);
      } else {
        if (this.checkedId === item.id) {
          this.$refs.tree.setCheckedKeys([item.id]);
        }
      }
    },
    // 控制树是否显示
    handleTreeView () {
      // this.ptSonTreeData = getDictSonList("002004")
      this.ptFatherTreeData = getDictList("002004");
      this.ptFatherTreeData = toTreeData(
        this.ptFatherTreeData,
        "codeUuid",
        "parentCodeUuid",
        "codeName",
        "002004"
      );
      this.dialogTreeFormVisible = true;
    },
    insertOrg () {
      if (
        typeof this.$refs.tree.getCheckedNodes()[0] !== "undefined" &&
        this.$refs.tree.getCheckedNodes()[0] != null
      ) {
        this.temp.problemType = this.$refs.tree.getCheckedNodes()[0].label;
        this.dialogTreeFormVisible = false;
      } else {
        this.$message.error("请选择问题分类");
      }
      this.checkedId = null;
    },
    handleSelectionChange (val) {
      this.selections = val;
    },

    handleDetailSelectionChange (val) {
      this.detailSelections = val;
    },

    getSortClass: function (key) {
      const sort = this.pageQuery.sort;
      return sort === `+${key}` ? "asc" : "desc";
    },
    // 格式化整改状态
    formatStatus (data) {
      return this.formatMap.rectifyStatus[data.rectifyStatus];
    },
    // 格式化是否入账
    formatIsImportant (data) {
      return this.formatMap.isImportant[data.isImportant];
    },
    // 获取当前项目的参与审计人员
    getProjectPerson (id) {
      personList(id).then((resp) => {
        this.personQueryList = resp.data;
      });
    },
    // 初始化审计人员
    resetAudit () {
      this.temp.auditPersonUuid = null;
    },
  },
};
</script>
<style scoped>
</style>
