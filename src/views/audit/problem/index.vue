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
        <el-button type="primary" class="oper-btn add" @click="handleProblemCreate()" />
        <!-- 修改 -->
        <el-button type="primary" class="oper-btn edit" :disabled="selections.length !== 1" @click="handleProblemUpdate()" />
        <!-- 删除 -->
        <el-button type="primary" class="oper-btn delete" :disabled="selections.length === 0" @click="handleDelete()" />
        <!-- 下载模板 -->
        <el-button type="primary" class="oper-btn download-template btn-width-md" @click="handleDownloadProblem()" />
        <!-- 导入 -->
        <el-upload
          multiple class = "upload-demo" action="" :on-remove="handleRemove" :headers="headers"
          :http-request="uploadFile"
          :limit="3"
          :auto-upload="true"
          :on-change="handleFileChange"
          :show-file-list="false"
          style="display: inline-block; padding-left: 10px"
        >
          <el-button type="primary" class="oper-btn export" />
        </el-upload>
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
      <el-table-column label="问题名称" width="200px" align="center" prop="problemName">
        <template slot-scope="scope">
          <el-link
            :underline="false"
            type="primary"
            @click="showProblemDeatil(scope.row)"
          >{{ scope.row.problemName }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="项目名称" width="200px" align="center" prop="projectName" />
      <el-table-column label="问题分类" width="200px" align="center" prop="problemType" />
      <el-table-column label="审计人员" width="200px" align="center" prop="auditPersonName" />
      <el-table-column label="复核人员" width="200px" align="center" prop="recheckPersonName" />
      <el-table-column label="问题发现时间" width="200px" align="center" prop="discoveryTime" />
      <el-table-column label="问题最晚整改时间" width="200px" align="center" prop="rectifyTime" />
      <el-table-column label="整改状态" width="200px" align="center" prop="rectifyStatus" :formatter="formatStatus" />
      <el-table-column label="整改率" width="200px" align="center" prop="" />
      <el-table-column label="线索核实结果" width="200px" align="center" prop="" />
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="pageQuery.pageNo"
      :limit.sync="pageQuery.pageSize"
      @pagination="getList"
    />
    <!-- ProblemPopover组件  temp实例对象 dialogStatus功能参数（）-->
    <!-- :dialogFormVisible="dialogFormVisiblenew" -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisiblenew" :close-on-click-modal="false">
      <ProblemPopover
        ref="problempopover"
        :temp="temp"
        :dialogStatus="dialogStatus"
        :closeStatus="closeStatus"
        :disableUpdate="disableUpdate"
        @changedialogFormVisible="changedialogFormVisible"
        @refreshesParent="refreshesParent"
      />
      <div slot="footer">
        <el-button v-if="!closeStatus" @click="changedialogFormVisible(false)"
          >取消</el-button
        >
        <el-button
          v-if="closeStatus"
          type="primary"
          @click="changedialogFormVisible(false)"
          >关闭
        </el-button>
        <el-button v-if="!closeStatus" type="primary" @click="handleAudit()"
          >提交审核
        </el-button>
        <el-button
          v-if="!closeStatus"
          type="primary"
          @click="dialogStatus === 'create' ? createProblemData() : updateProbleData()"
          >保存
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { listByPage, del } from '@WISDOMAUDIT/api/wisdomaudit/problem'
import QueryField from '@/components/public/query-field/index'
import _ from 'lodash'
import axios from 'axios'
import ProblemPopover from '@WISDOMAUDIT/components/ProblemPopover'
export default {
  components: { Pagination, QueryField, ProblemPopover },
  data() {
    return {
      dialogFormVisiblenew: false,
      tableKey: 'problemUuid',
      list: null, // 问题结果集
      // 问题记录数
      total: 0,
      listLoading: false,
      headers: { 'Content-Type': 'multipart/form-data' }, // 导入属性
      file: '', // 初始化导入文件
      // text 精确查询   fuzzyText 模糊查询  select下拉框  timePeriod时间区间
      queryFields: [
        { label: '问题名称', name: 'problemName', type: 'text', value: '' },
        { label: '项目名称', name: 'projectName', type: 'text', value: '' },
        // { label: '模糊查询', name: 'keyword', type: 'fuzzyText' },
        {
          label: '整改状态', name: 'rectifyStatus', type: 'select',
          data: [{ name: '未整改', value: '1' }, { name: '整改中', value: '2' },
            { name: '已整改', value: '3' }, { name: '无法整改', value: '4' }
          ],
          default: ''
        },
        // {label: '问题分类', name: 'problemType', type: 'select', data: [{ name: '未知', value: '1' }], default: ''},
        {
          label: '审核状态', name: 'rectifyStatus', type: 'select',
          data: [{ name: '已通过', value: '1' }, { name: '未通过', value: '2' }
          ],
          default: ''
        }
      ],
      // 格式化参数列表
      formatMap: {
        rectifyStatus: {
          1: '未整改',
          2: '整改中',
          3: '已整改',
          4: '无法整改',
          null: ''
        },
        isImportant: {
          1: '是',
          0: '否'
        }
      },
      // 问题查询结果集
      pageQuery: {
        condition: {},
        pageNo: 1,
        pageSize: 20,
        sortBy: 'desc',
        sortName: 'updateTime'
      },
      // 项目结果集查询分页参数
      pageQueryProjectList: {
        condition: {},
        pageNo: 1,
        pageSize: 2000,
        sortBy: 'desc',
        sortName: 'updateTime'
      },
      // 问题属性绑定
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
        problemDetailsList: []// 问题明细List
      },
      // 问题信息弹窗绑定
      selections: [],
      dialogFormVisible: false,
      dialogStatus: 'create',
      textMap: {
        update: '修改问题',
        create: '新增问题',
        show: '查看问题详情'
      },
      disableUpdate: false,
      closeStatus: false,
      downloadLoading: false,
      detailDownloadLoading: false,
    }
  },
  created() {
    this.getList()
  },
  methods: {
    //父组件刷新
    refreshesParent(){
      this.getList()
    },
    // 提交审核
    handleAudit(){
      this.$refs.problempopover.todoaudit()
    },
    // 问题添加
    createProblemData(){
      this.$refs.problempopover.createData()
    },
    // 问题修改
    updateProbleData(){
      this.$refs.problempopover.updateData()
    },
    // 更改弹窗状态
    changedialogFormVisible(val){
      this.dialogFormVisiblenew = val
    },
    // 问题添加前打开弹窗
    handleProblemCreate(){
      this.closeStatus = false
      this.disableUpdate = false
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisiblenew = true
      this.$refs.problempopover.getPreLoadProjectList()
    },
    // 问题修改前打开弹窗
    handleProblemUpdate() {
      this.resetTemp()
      this.closeStatus = false
      this.disableUpdate = false
      this.temp = Object.assign({}, this.selections[0]) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisiblenew = true
      this.$refs.problempopover.getPreLoadProjectList()
    },
    // 查看问题详情
    showProblemDeatil(data) {
      this.resetTemp()
      this.closeStatus = true
      this.disableUpdate = true
      this.temp = Object.assign({}, data) // copy obj
      this.dialogStatus = 'show'
      this.dialogFormVisiblenew = true
      this.$refs.problempopover.getPreLoadProjectList()
    },
    // 查询list
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
    // 问题表单初始化
    resetTemp() {
      this.temp = {
        problemUuid: null, // 问题UUID
        problemName: null, // 问题name
        problemSource: '1', // 问题来源
        projectUuid: null, // 项目UUID
        projectName: null, // 项目name
        isImportant: null, // 是否重要
        auditPersonUuid: null, // 审计人员UUID
        auditPersonName: null, // 审计人员name
        discoveryTime: null, // 问题发现时间
        problemType: null, // 问题类型
        problemDetailsList: []// 问题明细List
      }
    },
    // 删除
    handleDelete() {
      this.$confirm(this.$t('confirm.delete'), this.$t('confirm.title'), {
        confirmButtonText: this.$t('confirm.okBtn'),
        cancelButtonText: this.$t('confirm.cancelBtn'),
        type: 'warning'
      }).then(() => {
        var ids = []
        this.selections.forEach((r, i) => {
          ids.push(r.problemUuid)
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
    handleSelectionChange(val) {
      this.selections = val
    },
    getSortClass: function(key) {
      const sort = this.pageQuery.sort
      return sort === `+${key}` ? 'asc' : 'desc'
    },
    // 格式化整改状态
    formatStatus(data) {
      return this.formatMap.rectifyStatus[data.rectifyStatus]
    },
    handleDownloadProblem() {
      // 下载问题模板excel
      axios({
        method: 'get',
        url: `/wisdomaudit/problem/downloadProblemTemplate`,
        responseType: 'blob'
      }).then((res) => {
        // if (res.code !== 0) this.$message.error(res.msg)
        const filename = decodeURI(
          res.headers['content-disposition'].split(';')[1].split('=')[1]
        )
        const blob = new Blob([res.data], {
          type: 'application/octet-stream'
        })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', filename)
        document.body.appendChild(link)
        link.click()
      })
    },
    // 上传文件，获取文件流
    handleFileChange(file) {
      this.file = file.raw
    },
    handleRemove(file, fileList) {
      this.file = ''
    },
    // 自定义上传
    uploadFile() {
      const loading = this.$loading({
        lock: true,
        // spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const index = this.file.name.lastIndexOf('.')
      const suffix = this.file.name.substr(index + 1)
      // 创建表单对象
      const formData = new FormData()
      // 后端接受参数 ，可以接受多个参数
      formData.append('problemFile', this.file)
      formData.append('uploadFileName', 'git')
      formData.append('uploadFileContentType', suffix)
      var num = Math.random()
      axios({
        url: `/wisdomaudit/problem/importFiles?${num}`,
        method: 'post',
        data: formData
      }).then((res) => {
        if (res.data.code === 2501) {
          this.$message({
            type: 'error',
            message: res.data.msg
          })
          loading.close()
        } else {
          this.getList()
          this.$notify({
            title: this.$t('message.title'),
            message: '导入成功',
            type: 'success',
            duration: 5000,
            position: 'bottom-right'
          })
          loading.close()
        }
      }).catch(() => {
        this.$notify({
          title: this.$t('message.title'),
          message: '导入问题时发生异常',
          type: 'error',
          duration: 2000,
          position: 'bottom-right'
        })
        loading.close()
      })
    }
  }
}
</script>

