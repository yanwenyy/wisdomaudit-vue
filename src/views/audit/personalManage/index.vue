<template>
  <div class="page-container">
    <div class="filter-container">
      <QueryField
        ref="queryfield"
        :form-data="queryFields"
        @submit="getList"
      />
    </div>
    <el-row>
      <el-col align="right">
        <!-- 新增 -->
        <el-button type="primary" class="oper-btn add" @click="handleCreate()" />
        <!-- 修改 -->
        <el-button type="primary" class="oper-btn edit" :disabled="selections.length !== 1" @click="handleUpdate()" />
        <!-- 删除 -->
        <el-button type="primary" class="oper-btn delete" :disabled="deleteStatus" @click="handleDelete()" />
        <!--启用-->
        <el-button type="primary" class="oper-btn online" :disabled="startStatus" @click="handleStart()" />
        <!--注销-->
        <el-button type="primary" class="oper-btn logout" icon="el-icon-s-release" :disabled="logoutStatus ||selections.length !== 1" @click="handleLogout()" />
        <!--解除锁定-->
        <el-button type="primary" class="oper-btn unlock btn-width-md" icon="el-icon-unlock" :disabled="lockStatus" @click="handleUnlock()" />
        <!--权限分配-->
        <el-button type="primary" class="oper-btn authority btn-width-md" icon="el-icon-user-solid" :disabled="authorityStatus || selections.length !== 1" @click="handleAuthority()" />
        <!-- 下载模板 -->
        <!--<el-button type="primary" class="oper-btn download-template" @click="handleDownloadProblem()" />-->
        <!--&lt;!&ndash; 导入 &ndash;&gt;-->
        <!--<el-upload-->
          <!--multiple class="upload-demo" action="" :on-remove="handleRemove" :headers="headers"-->
          <!--:http-request="uploadFile"-->
          <!--:limit="3"-->
          <!--:auto-upload="true"-->
          <!--:on-change="handleFileChange"-->
          <!--:show-file-list="false"-->
          <!--style="display: inline-block; padding-left: 10px"-->
        <!--&gt;-->
          <!--<el-button type="primary" class="oper-btn export" />-->
        <!--</el-upload>-->
      </el-col>
    </el-row>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      fit
      style="width: 100%;"
      :data="list"
      border
      highlight-current-row
      height="calc(100vh - 300px)"
      max-height="calc(100vh - 300px)"
      @sort-change="sortChange"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" align="center" />
      <el-table-column label="账号" width="200px" align="center" prop="userid" />
      <el-table-column label="姓名" width="200px" align="center" prop="personName">
        <template slot-scope="scope">
        <el-link
        :underline="false"
        type="primary"
        @click="showPerson(scope.row)"
        >{{ scope.row.personName }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="年龄" width="200px" align="center" prop="birthdate" :formatter="formatBirthday"/>
      <el-table-column label="性别" width="200px" align="center" prop="sex" :formatter="formatSex"/>
      <el-table-column label="职务" width="200px" align="center" prop="positionId" :formatter="formatJob" />
      <el-table-column label="学历" width="200px" align="center" prop="eduid" :formatter="formatEdu"/>
      <el-table-column label="专业" width="200px" align="center" prop="major" />
      <el-table-column label="职称" width="200px" align="center" prop="jobtitle" />
      <el-table-column label="主要岗位经历" width="200px" align="center" prop="mainJobExperience" />
      <el-table-column label="账号状态" width="200px" align="center" prop="accountstat" :formatter="formatAccountstat"/>
      <el-table-column label="密码锁定" width="200px" align="center" prop="loginfailnum" :formatter="formatIsLock"/>
      <el-table-column label="创建时间" width="200px" align="center" prop="createTime" />
      <el-table-column label="修改时间" width="200px" align="center" prop="updateTime" />
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="pageQuery.pageNo"
      :limit.sync="pageQuery.pageSize"
      @pagination="getList"
    />
    <!-- 人员新增和编辑的弹框 -->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
    >
      <!-- label-width="140px" -->
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        class="detail-form"
        style="height:68vh;overflow:auto;"
      >
        <el-row>
          <el-col :span="11">
            <el-form-item
              label="账号："
              prop="userid"
            >
              <el-input
                v-model="temp.userid"
                :placeholder="disableUpdate === true ? '' : '请输入人员工号'"
                :disabled="disableUpdate"
              />
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="2">
            <el-form-item
              label="密码："
              prop="password"
            >
              <el-input
                v-model="temp.password"
                :placeholder="disableUpdate === true ? '' : '请输入密码'"
                :disabled="disableUpdate"
                show-password
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item
              label="姓名："
              prop="personName"
            >
              <el-input
                v-model="temp.personName"
                :placeholder="disableUpdate === true ? '' : '请输入人员姓名'"
                :disabled="disableUpdate"
              />
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="2">
            <el-form-item label="性别：" prop="sex">
              <el-select
                v-model="temp.sex"
                :placeholder="disableUpdate === true ? '' : '请选择性别'"
                :disabled="disableUpdate"
                style="width:100%"
              >
                <el-option
                  v-for=" item in sexList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item
              label="出生日期："
              prop="birthdate"
            >
              <el-date-picker
                v-model="temp.birthdate"
                type="date"
                :placeholder="disableUpdate === true ? '' : '请输入出生日期'"
                value-format="yyyy-MM-dd"
                style="width:100%"
                :disabled="disableUpdate"
              />
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="2">
            <el-form-item label="学历：" prop="eduid">
              <el-select
                v-model="temp.eduid"
                :placeholder="disableUpdate === true ? '' : '请选择学历'"
                :disabled="disableUpdate"
                style="width:100%"
              >
                <el-option
                  v-for=" item in eduList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item
              label="毕业学校："
              prop="graduateSchool"
            >
              <el-input
                v-model="temp.graduateSchool"
                :placeholder="disableUpdate === true ? '' : '请输入毕业学校'"
                :disabled="disableUpdate"
              />
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="2">
            <el-form-item label="专业：" prop="major">
              <el-input
                v-model="temp.major"
                :placeholder="disableUpdate === true ? '' : '请输入专业'"
                :disabled="disableUpdate"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item
              label="办公室电话："
              prop="officetel"
            >
              <el-input
                v-model="temp.officetel"
                :placeholder="disableUpdate === true ? '' : '请输入办公室电话'"
                :disabled="disableUpdate"
              />
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="2">
            <el-form-item label="手机号码：" prop="mobile">
              <el-input
                v-model="temp.mobile"
                :placeholder="disableUpdate === true ? '' : '请输入手机号码'"
                :disabled="disableUpdate"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item
              label="入行时间："
              prop="entryOrgTime"
            >
              <el-date-picker
                v-model="temp.entryOrgTime"
                type="date"
                :placeholder="disableUpdate === true ? '' : '请输入入行时间'"
                value-format="yyyy-MM-dd"
                style="width:100%"
                :disabled="disableUpdate"
              />
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="2">
            <el-form-item label="从事审计工作时间：" prop="auditWorkTime">
              <el-date-picker
                v-model="temp.auditWorkTime"
                type="month"
                :placeholder="disableUpdate === true ? '' : '请输入从事审计工作时间'"
                value-format="yyyy-MM"
                style="width:100%"
                :disabled="disableUpdate"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item
              label="擅长审计业务："
              prop="adeptAudit"
            >
              <el-input
                v-model="temp.adeptAudit"
                :placeholder="disableUpdate === true ? '' : '请输入擅长审计业务'"
                :disabled="disableUpdate"
              />
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="2">
            <el-form-item label="职务：" prop="positionId">
              <el-select
                v-model="temp.positionId"
                :placeholder="disableUpdate === true ? '' : '请输入职务'"
                :disabled="disableUpdate"
                style="width:100%"
              >
                <el-option
                  v-for=" item in positionList"
                  :key="item.pid"
                  :label="item.pname"
                  :value="item.pid"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item
              label="审计资格证书持有情况："
              prop="hasCertificate"
            >
              <el-select
                v-model="temp.hasCertificate"
                :placeholder="disableUpdate === true ? '' : '请输入审计资格证书持有情况'"
                :disabled="disableUpdate"
                style="width:100%"
              >
                <el-option
                  v-for=" item in hasCertificateList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="2">
            <el-form-item label="审计机构：" prop="orguuid">
              <el-select
                v-model="temp.orguuid"
                :placeholder="disableUpdate === true ? '' : '请输入审计机构'"
                :disabled="disableUpdate"
                style="width:100%"
              >
                <el-option
                  v-for=" item in orgList"
                  :key="item.orguuid"
                  :label="item.cnname"
                  :value="item.orguuid"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="职称" prop="jobtitle">
              <el-input
                v-model="temp.jobtitle"
                :placeholder="disableUpdate === true ? '' : '请输入职称'"
                :disabled="disableUpdate"
                type="textarea"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="其他证书持有情况" prop="otherCertificate">
              <el-input
                v-model="temp.otherCertificate"
                :placeholder="disableUpdate === true ? '' : '请输入其他证书持有情况'"
                :disabled="disableUpdate"
                type="textarea"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="主要岗位经历" prop="mainJobExperience">
              <el-input
                v-model="temp.mainJobExperience"
                :placeholder="disableUpdate === true ? '' : '请输入主要岗位经历'"
                :disabled="disableUpdate"
                type="textarea"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="otherinfo">
              <el-input
                v-model="temp.otherinfo"
                :placeholder="disableUpdate === true ? '' : '备注'"
                :disabled="disableUpdate"
                type="textarea"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer">
        <el-button v-if="!closeStatus" @click="dialogFormVisible = false">取消</el-button>
        <el-button
          v-if="closeStatus"
          type="primary"
          @click="dialogFormVisible = false"
        >关闭
        </el-button>
        <el-button
          v-if="!closeStatus"
          type="primary"
          @click="dialogStatus==='create'?createData():updateData()"
        >保存
        </el-button>
      </div>
    </el-dialog>

    <!--注销账号填写调离日期弹窗-->
    <el-dialog
      title="提示"
      :visible.sync="logoutDialogVisible"
      width="30%"
      :close-on-click-modal="false"
    >
      <el-form
        ref="dataForm1"
        :rules="rules"
        :model="temp"
        label-position="right"
        class="detail-form"
        style="height:30vh;overflow:auto;"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="调离日期" prop="leaveTime">
              <el-date-picker
                v-model="temp.leaveTime"
                type="date"
                :placeholder="disableUpdate === true ? '' : '请输入调离日期'"
                style="width:100%"
                :disabled="disableUpdate"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer">
        <el-button  @click="logoutDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="unlockFunction()">保存</el-button>
      </div>
    </el-dialog>

    <!--权限分配弹窗-->
    <el-dialog
      title="提示"
      :visible.sync="authorityDialogVisible"
      width="30%"
      :close-on-click-modal="false"
    >
      <el-form
        ref="dataForm2"
        :rules="rules"
        :model="temp"
        label-position="right"
        class="detail-form"
        style="height:30vh;overflow:auto;"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="选择角色：" prop="roleId">
              <el-select
                v-model="temp.roleId"
                :placeholder="disableUpdate === true ? '' : '请选择角色'"
                :disabled="disableUpdate"
                multiple
                style="width:100%"
              >
                <el-option
                  v-for=" item in roleList"
                  :key="item.roleid"
                  :label="item.cnname"
                  :value="item.roleid"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer">
        <el-button  @click="authorityDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="authorityForPerson()">保存</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { listByPage, save, update, del, getOrgList, startPerson, logoutPerson, unlockPerson, getRoleList, getById, authorityForPerson, getPositionList} from
  '@SDMOBILE/api/sdmobile/personalManage'
import QueryField from '@/components/public/query-field/index'
import axios from 'axios'
export default {
  components: { Pagination, QueryField },

  data() {
    // 数字校验
    const isNum = (rule, value, callback) => {
      const price = /^[0-9]*$/
      if (value == null) {
        value = ''
      }
      if (!price.test(value)) {
        callback(new Error('该项必须填写数字'))
      } else {
        callback()
      }
    }

    return {
      tableKey: 'personaluuid',
      list: null, // 人员结果集
      orgList: null, // 审计机构结果集
      roleList: null, // 系统角色结果集
      positionList: null, // 系统职务结果集
      // 人员记录数
      total: 0,
      listLoading: false,
      queryFields: [
        { label: '账号', name: 'userid', type: 'text', value: '' },
        { label: '姓名', name: 'personName', type: 'text', value: '' },
        // { label: '模糊查询', name: 'keyword', type: 'fuzzyText' },
        {
          label: '账号状态', name: 'accountstat', type: 'select',
          data: [{ name: '正常', value: '0' }, { name: '锁定', value: '1' }, { name: '注销', value: '2' }
          ],
          default: ''
        }
      ],
      // 格式化参数列表
      formatMap: {
        // 职务
        job: {

        },
        // 账号状态
        accountstat: {
          0: '正常',
          1: '锁定',
          2: '注销'
        },
        // 性别
        sex: {
          0: '女',
          1: '男',
          null: ''
        },
        // 学历
        eduid: {
          '1': '博士后',
          '2': '博士',
          '3': '研究生',
          '4': '本科',
          '5': '本科以下',
          null: ''
        }
      },
      // 人员查询结果集
      pageQuery: {
        condition: {},
        pageNo: 1,
        pageSize: 20,
        sortBy: 'desc',
        sortName: 'updateTime'
      },
      // 审计机构结果集查询分页参数
      pageQueryOrgList: {
        condition: {},
        pageNo: 1,
        pageSize: 2000,
        sortBy: 'desc',
        sortName: 'createtime'
      },
      // 系统角色结果集查询分页参数
      pageQuerySysRoleList: {
        condition: {},
        pageNo: 1,
        pageSize: 1000,
        sortBy: 'desc',
        sortName: 'createtime'
      },
      // 系统职务查询分页参数
      pageQueryPositionList: {
        condition: {},
        pageNo: 1,
        pageSize: 1000,
        sortBy: 'asc',
        sortName: 'createtime'
      },
      // 人员属性绑定
      temp: {
        personuuid: null, // 人员UUID
        roleId: null, // 角色uuid
        personDetailUuid: null, // 人员扩展信息UUID
        userid: null, // 人员账号（工号）
        password: null, // 密码
        personName: null, // 姓名
        sex: null, // 性别
        birthdate: null, // 生日
        eduid: null, // 学历
        graduateSchool: null, // 毕业学校
        major: null, // 专业
        officetel: null, // 办公室电话
        mobile: null, // 手机号码
        entryOrgTime: null, // 入行时间
        auditWorkTime: null, // 从事审计工作时间
        adeptAudit: null, // 擅长审计业务
        positionId: null, // 职务id
        hasCertificate: null, // 审计资格证书持有情况
        orguuid: null, // 审计机构
        jobtitle: null, // 职称
        otherCertificate: null, // 其他证书持有情况
        mainJobExperience: null, // 主要岗位经历
        leaveTime: null, // 调离日志
        otherinfo: null // 备注
      },

      // 人员信息弹窗绑定
      selections: [],
      dialogFormVisible: false, // 弹窗打开/关闭控制
      dialogStatus: '', // 保存按钮新增/删除控制
      textMap: {
        update: '修改人员',
        create: '新增人员',
        show: '查看人员详情'
      },
      // 新增人员的表单验证
      rules: {
        userid: [{ required: true, message: '请填写账号', trigger: 'change' },
          { max: 6, message: '账号为6个字符以内', trigger: 'change' }],
        password: [{ required: true, message: '请输入密码', trigger: 'change' }],
        mobile: [{ required: true, message: '请输入手机号', trigger: 'change' }, { validator: isNum, trigger: 'change' }],
        personName: [{ required: true, message: '请输入姓名', trigger: 'change' }],
        officetel: [{ required: true, message: '请输入办公室电话', trigger: 'change' }, { validator: isNum, trigger: 'change' }],
        orguuid: [{ required: true, message: '请选择机构', trigger: 'change' }],
        leaveTime: [{ required: true, message: '请选择调离日期', trigger: 'change' }],
        roleId: [{ required: true, message: '请选择角色', trigger: 'change' }]
      },
      disableUpdate: false,
      logoutDialogVisible: false, // 注销人员弹窗属性
      authorityDialogVisible: false, //权限分配弹窗
      closeStatus: false, // 保存按钮的显示/隐藏控制
      startStatus: true, // 启用按钮 false可用/true不可用
      lockStatus: true, // 解锁按钮 false可用/true不可用
      logoutStatus: true, // 注销按钮 false可用/true不可用
      deleteStatus: true, // 删除按钮 false可用/true不可用
      authorityStatus: true, // 权限分配按钮false可用/true不可用
      // “性别”下拉框列表
      sexList: [{ label: '男', value: 1 }, { label: '女', value: 0 }],
      // “审计资格证书持有情况”下拉框列表
      hasCertificateList: [{ label: '是', value: 1 }, { label: '否', value: 0 }],
      // “学历”下拉框列表
      eduList: [{ label: '博士后', value: '1' }, { label: '博士', value: '2' },
        { label: '研究生', value: '3' }, { label: '本科', value: '4' }, { label: '本科以下', value: '5' }],
      // “职务”属性下拉框列表
     // jobList: [{ label: '总经理', value: '1' }, { label: '副总经理', value: '2' }, { label: '普通职员', value: '3' }]
    }
  },
  // 监听
  watch: {
    // 写法偏复杂，不考虑
    // 'selections': {
    //   handler:
    //     function() {
    //       if (this.selections.length > 0) {
    //         this.startStatus = false
    //       }else{
    //      this.startStatus = true
    //       }
    //     }
    // },
    // 监听选中的结果集
    selections() {
      if (this.selections.length > 0) {
        // 当选中记录时，默认按钮可点击
        this.startStatus = false
        this.logoutStatus = false
        this.lockStatus = false
        this.deleteStatus = false
        this.authorityStatus = false
        // 遍历选中的结果，对账号状态进行判断
        this.selections.forEach((r, i) => {
          // 当账号状态是正常时
          if (r.accountstat === 0) {
            this.startStatus = true
            this.lockStatus = true
            this.deleteStatus = true
          }
          // 当账号状态是锁定时
          if (r.accountstat === 1) {
            this.logoutStatus = true
            this.startStatus = true
            this.deleteStatus = true
            this.authorityStatus = true
          }
          // 当账号状态是注销时
          if (r.accountstat === 2) {
            this.logoutStatus = true
            this.lockStatus = true
            this.authorityStatus = true
          }
        })
      } else {
        this.startStatus = true
        this.logoutStatus = true
        this.lockStatus = true
        this.deleteStatus = true
        this.authorityStatus = true
      }
    }
  },
  // 界面加载时调用的函数
  created() {
    this.getList()
    // 打开添加窗口前遍历所有的审计机构
    getOrgList(this.pageQueryOrgList).then(resp => {
      this.orgList = resp.data.records
    })
    // 打开窗口前获取所有的职务
    getPositionList(this.pageQueryPositionList).then(resp => {
      this.positionList = resp.data.records
      for (let i=0;i<this.positionList.length;i++){
        this.$set(this.formatMap.job,this.positionList[i].pid,this.positionList[i].pname)
      }
      console.log(this.formatMap.job)
    })
  },
  methods: {
    getList(query) {
      this.listLoading = true
      if (query) {
        this.pageQuery.condition = query
        this.pageQuery.pageNo = 1
      }

      listByPage(this.pageQuery).then(resp => {
        this.total = resp.data.total
        this.list = resp.data.records
        this.listLoading = false
      })


    },
    handleFilter() {
      this.pageQuery.pageNo = 1
      this.getList()
    },
    sortChange(data) {
      const { prop, order } = data
      this.pageQuery.sortBy = order
      this.pageQuery.sortName = prop
      this.handleFilter()
    },
    // 人员表单初始化
    resetTemp() {
      this.temp = {
        personuuid: null, // 人员UUID
        personDetailUuid: null, // 人员扩展信息UUID
        userid: null, // 人员账号（工号）
        roleId: null, // 角色ID
        password: null, // 密码
        personName: null, // 姓名
        sex: null, // 性别
        birthdate: null, // 生日
        eduid: null, // 学历
        graduateSchool: null, // 毕业学校
        major: null, // 专业
        officetel: null, // 办公室电话
        mobile: null, // 手机号码
        entryOrgTime: null, // 入行时间
        auditWorkTime: null, // 从事审计工作时间
        adeptAudit: null, // 擅长审计业务
        positionId: null, // 职务id
        hasCertificate: null, // 审计资格证书持有情况
        orguuid: null, // 审计机构
        jobtitle: null, // 职称
        otherCertificate: null, // 其他证书持有情况
        mainJobExperience: null, // 主要岗位经历
        leaveTime: null, // 调离日期
        otherinfo: null // 备注
      }
    },
    // 新增人员
    handleCreate() {
      this.closeStatus = false
      this.disableUpdate = false
      this.resetTemp()
      // 打开添加窗口前遍历所有的审计机构
      getOrgList(this.pageQueryOrgList).then(resp => {
        this.orgList = resp.data.records
      })
      // 打开窗口前获取所有的职务
      getPositionList(this.pageQueryPositionList).then(resp => {
      this.positionList = resp.data.records
      })
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 新增人员
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          save(this.temp).then(() => {
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: this.$t('message.title'),
              message: this.$t('message.insert.success'),
              type: 'success',
              duration: 2000,
              position: 'bottom-right'
            })
          })
        }
      })
    },
    // 修改人员
    handleUpdate() {
      this.closeStatus = false
      this.disableUpdate = false
      // 打开添加窗口前遍历所有的审计机构
      getOrgList(this.pageQueryOrgList).then(resp => {
        this.orgList = resp.data.records
      })
      // 打开窗口前获取所有的职务
      getPositionList(this.pageQueryPositionList).then(resp => {
        this.positionList = resp.data.records
      })
      this.temp = Object.assign({}, this.selections[0]) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // 界面无输入域，自动赋值项目name和审计人员name
          // if (typeof (this.temp.projectUuid) !== 'undefined' && this.temp.projectUuid !== null) { this.temp.projectName = _.find(this.projectQueryList, ['projectUuid', this.temp.projectUuid]).projectName }
          // if (typeof (this.temp.auditPersonUuid) !== 'undefined' && this.temp.auditPersonUuid !== null) { this.temp.auditPersonName = _.find(this.personQueryList, ['auditPersonUuid', this.temp.auditPersonUuid]).auditPersonName }
          const tempData = Object.assign({}, this.temp)
          update(tempData).then(() => {
            const index = this.list.findIndex(v => v.personuuid === this.temp.personuuid)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.getList()
            this.$notify({
              title: this.$t('message.title'),
              message: this.$t('message.update.success'),
              type: 'success',
              duration: 2000,
              position: 'bottom-right'
            })
          })
        }
      })
    },
    // 删除人员
    handleDelete() {
      this.$confirm(this.$t('confirm.delete'), this.$t('confirm.title'), {
        confirmButtonText: this.$t('confirm.okBtn'),
        cancelButtonText: this.$t('confirm.cancelBtn'),
        type: 'warning'
      }).then(() => {
        var ids = []
        this.selections.forEach((r, i) => {
          ids.push(r.personuuid)
        })
        del(ids.join(',')).then(() => {
          this.getList()
          this.$notify({
            title: this.$t('message.title'),
            message: this.$t('message.delete.success'),
            type: 'success',
            duration: 2000,
            position: 'bottom-right'
          })
        })
      }).catch(() => {
        // this.$notify({
        //   title: '消息',
        //   message: '已取消删除',
        //   duration: 2000,
        //   position: 'bottom-right'
        // })
      })
    },
    // 启用人员
    handleStart() {
      this.$confirm(this.$t('确定要启用当前选中的人员吗？'), this.$t('confirm.title'), {
        confirmButtonText: this.$t('confirm.okBtn'),
        cancelButtonText: this.$t('confirm.cancelBtn'),
        type: 'warning'
      }).then(() => {
        var ids = []
        this.selections.forEach((r, i) => {
          ids.push(r.personuuid)
        })
        startPerson(ids.join(',')).then(() => {
          this.getList()
          this.$notify({
            title: this.$t('message.title'),
            message: this.$t('启用成功'),
            type: 'success',
            duration: 2000,
            position: 'bottom-right'
          })
        })
      }).catch(() => {
        // this.$notify({
        //   title: '消息',
        //   message: '已取消删除',
        //   duration: 2000,
        //   position: 'bottom-right'
        // })
      })
    },
    // 注销人员
    handleLogout() {
      this.$confirm(this.$t('确定要注销当前选中的人员吗？'), this.$t('confirm.title'), {
        confirmButtonText: this.$t('confirm.okBtn'),
        cancelButtonText: this.$t('confirm.cancelBtn'),
        type: 'warning'
      }).then(() => {
        this.logoutDialogVisible = true
        this.disableUpdate = false
        this.temp = Object.assign({}, this.selections[0])
        // 清空调离时间
        this.temp.leaveTime = null
      }).catch(() => {
        // this.$notify({
        //   title: '消息',
        //   message: '已取消删除',
        //   duration: 2000,
        //   position: 'bottom-right'
        // })
      })
    },
    // 注销人员
    unlockFunction() {
      this.$refs['dataForm1'].validate((valid) => {
        if (valid) {
          logoutPerson(this.temp.personuuid, this.temp.leaveTime, this.temp.personDetailUuid).then(() => {
            this.logoutDialogVisible = false
            this.getList()
            this.$notify({
              title: this.$t('message.title'),
              message: this.$t('注销成功'),
              type: 'success',
              duration: 2000,
              position: 'bottom-right'
            })
          })
        }
      })
    },
    // 解锁人员
    handleUnlock() {
      this.$confirm(this.$t('确定要解锁当前选中的人员吗？'), this.$t('confirm.title'), {
        confirmButtonText: this.$t('confirm.okBtn'),
        cancelButtonText: this.$t('confirm.cancelBtn'),
        type: 'warning'
      }).then(() => {
        var ids = []
        this.selections.forEach((r, i) => {
          ids.push(r.personuuid)
        })
        unlockPerson(ids.join(',')).then(() => {
          this.getList()
          this.$notify({
            title: this.$t('message.title'),
            message: this.$t('解锁成功'),
            type: 'success',
            duration: 2000,
            position: 'bottom-right'
          })
        })
      }).catch(() => {
        // this.$notify({
        //   title: '消息',
        //   message: '已取消删除',
        //   duration: 2000,
        //   position: 'bottom-right'
        // })
      })
    },
    // 权限分配
    handleAuthority() {
      this.closeStatus = false
      this.disableUpdate = false
      this.resetTemp()
      // 打开窗口前获取所有系统角色
     getRoleList(this.pageQuerySysRoleList).then((res)=>{
       this.roleList = res.data.records
     })
      // 打开窗口前，获取当前人员的角色信息
      getById(this.selections[0].personuuid).then((res)=>{
        this.temp = res.data[0]
      })
      //console.log(this.temp.roleId)
      this.authorityDialogVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm2'].clearValidate()
      })
    },
    // 权限分配
    authorityForPerson() {
      this.$refs['dataForm2'].validate((valid) => {
        if (valid) {
          // console.log(this.temp.roleId)
          // if (this.temp.roleId.substr(0,1) === ","){
          //    this.temp.roleId = this.temp.substr(1,this.temp.roleId);
          // }
          authorityForPerson(this.temp.personuuid, this.temp.roleId.join(',')).then(() => {
            this.getList()
            this.authorityDialogVisible = false
            this.$notify({
              title: this.$t('message.title'),
              message: this.$t('权限分配成功'),
              type: 'success',
              duration: 2000,
              position: 'bottom-right'
            })
          })
        }
      })
    },
    handleSelectionChange(val) {
      this.selections = val
    },

    getSortClass: function(key) {
      const sort = this.pageQuery.sort
      return sort === `+${key}` ? 'asc' : 'desc'
    },
    // 格式化职务
    formatJob(data) {
      return this.formatMap.job[data.positionId]
    },
    // 格式化性别
    formatSex(data) {
      return this.formatMap.sex[data.sex]
    },
    // 格式化账号状态
    formatAccountstat(data) {
      return this.formatMap.accountstat[data.accountstat]
    },
    // 格式化学历
    formatEdu(data) {
      return this.formatMap.eduid[data.eduid]
    },
    // 格式化密码是否锁定
    formatIsLock(data) {
      // 当登录错误次数小于5即为未锁定
      return data.loginfailnum < 5 ? '否' : '是'
    },
    // 格式化年龄
    formatBirthday(data) {
      if (data.birthdate != null) {
        return new Date().getFullYear() - data.birthdate.substr(0, 4)
      } else {
        return '暂无相关信息'
      }
    },
    // 显示人员详情
    showPerson(data) {
      this.closeStatus = true
      this.disableUpdate = true
      // 打开添加窗口前遍历所有的审计机构
      getOrgList(this.pageQueryOrgList).then(resp => {
        this.orgList = resp.data.records
      })
      // 打开窗口前获取所有的职务
      getPositionList(this.pageQueryPositionList).then(resp => {
        this.positionList = resp.data.records
      })
      this.temp = Object.assign({}, data) // copy obj
      this.dialogStatus = 'show'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    }
  }
}
</script>

