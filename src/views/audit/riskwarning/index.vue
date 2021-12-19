<template>
  <div class="page-container">
    <div class="filter-container">
      <QueryField ref="queryfield"
                  :form-data="queryFields"
                  :text-width="110"
                  :time-period-width="130"
                  @submit="getList" />
    </div>
    <el-row>
      <el-col align="right">
        <!-- 新增 -->
        <el-button type="primary"
                   class="oper-btn add"
                   @click="handleCreate()" />
        <!-- 修改 -->
        <el-button type="primary"
                   class="oper-btn edit"
                   :disabled="selections.length !== 1"
                   @click="handleUpdate()" />
        <!-- 删除 -->
        <el-button type="primary"
                   class="oper-btn delete"
                   :disabled="selections.length === 0"
                   @click="handleDelete()" />
        <!-- 下载模板 -->
        <el-button type="primary"
                   class="oper-btn download-template btn-width-md"
                   @click="handleDownload()" />
        <!-- 导入 -->
        <el-upload multiple
                   class="upload-demo"
                   action=""
                   :on-remove="handleRemove"
                   :headers="headers"
                   :http-request="uploadFile"
                   :limit="3"
                   :auto-upload="true"
                   :on-change="handleFileChange"
                   :show-file-list="false"
                   style="display: inline-block; padding-left: 10px">
          <el-button type="primary"
                     class="oper-btn export" />
        </el-upload>
      </el-col>
    </el-row>
    <el-table :key="tableKey"
              v-loading="listLoading"
              fit
              style="width: 100%;"
              :data="list"
              border
              highlight-current-row
              height="calc(100vh - 300px)"
              max-height="calc(100vh - 300px)"
              @sort-change="sortChange"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection"
                       align="center" />
      <el-table-column label="风险提示名称"
                       prop="riskWarningName">
        <template slot-scope="scope">
          <el-link :underline="false"
                   type="primary"
                   @click="findRiskWarning(scope.row)">
            {{ scope.row.riskWarningName }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="项目名称">
        <template slot-scope="scope">{{ scope.row.projectUuid | formatProject(projectlist) }}</template>
      </el-table-column>
      <el-table-column label="业务类型"
                       prop="businessType" />
      <el-table-column label="风险提示描述"
                       show-overflow-tooltip
                       prop="riskWarningDesc" />
      <el-table-column label="创建时间"
                       width="180px"
                       align="center"
                       prop="createTime" />
      <el-table-column label="创建人名称"
                       prop="createUserName" />
      <el-table-column label="修改时间"
                       width="180px"
                       align="center"
                       prop="updateTime" />
      <el-table-column label="创建人名称"
                       prop="updateUserName" />
    </el-table>
    <pagination v-show="total>0"
                :total="total"
                :page.sync="pageQuery.pageNo"
                :limit.sync="pageQuery.pageSize"
                @pagination="getList" />
    <!-- 新增和编辑的弹框 -->
    <el-dialog :append-to-body='true'
               :title="textMap[dialogStatus]"
               :visible.sync="dialogFormVisible"
               :close-on-click-modal="false">
      <el-form ref="dataForm"
               :rules="rules"
               :model="temp"
               label-position="right"
               class="detail-form">
        <el-form-item label="风险提示名称"
                      prop="riskWarningName">
          <el-input v-model="temp.riskWarningName"
                    :placeholder="disableUpdate === true ? '' : '请输入风险提示名称'"
                    :disabled="disableUpdate" />
        </el-form-item>
        <el-form-item label="业务分类"
                      prop="businessType">
          <el-input v-model="temp.businessType"
                    :placeholder="disableUpdate === true ? '' : '请输入业务分类'"
                    :disabled="disableUpdate" />
        </el-form-item>
        <el-form-item label="风险提示描述"
                      prop="riskWarningDesc">
          <el-input v-model="temp.riskWarningDesc"
                    :placeholder="disableUpdate === true ? '' : '请输入风险提示描述'"
                    type="textarea"
                    :disabled="disableUpdate" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button v-if="!closeStatus"
                   @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="closeStatus"
                   type="primary"
                   @click="dialogFormVisible = false">关闭</el-button>
        <el-button v-if="!closeStatus"
                   type="primary"
                   @click="dialogStatus==='create'?createData():updateData()">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { listByPage, save, update, del, listProjectByPage } from '@WISDOMAUDIT/api/wisdomaudit/riskwarning'
import QueryField from '@/components/public/query-field/index'
import _ from 'lodash'
import axios from 'axios'

export default {
  components: { Pagination, QueryField },
  filters: {
    // 根据项目id查找项目名称
    formatProject (value, list) {
      const project = _.find(list, { 'projectUuid': value })
      if (typeof (project) !== 'undefined' && project != null) {
        return project.projectName
      }
      return ''
    }
  },
  props: {
    projectId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      dqtoken: "",
      tableKey: 'riskWarningUuid',
      list: null,
      total: 0,
      listLoading: false,
      projectlist: null,
      // text 精确查询   fuzzyText 模糊查询  select下拉框  timePeriod时间区间
      queryFields: [
        { label: '风险提示名称', name: 'riskWarningName', type: 'text', value: '' },
        { label: '业务分类', name: 'businessType', type: 'text', value: '' },
        { label: '创建时间', name: 'createTime', type: 'timePeriod', value: '' }
      ],
      // 查询风险提示条件
      pageQuery: {
        condition: {},
        pageNo: 1,
        pageSize: 20,
        sortBy: 'desc',
        sortName: 'createTime'
      },
      // 查询项目条件
      pageProjectQuery: {
        condition: {},
        pageNo: 1,
        pageSize: 2000,
        sortBy: 'desc',
        sortName: 'createTime'
      },
      temp: {
        // 业务分类
        businessType: null,
        createTime: null,
        createUserName: null,
        createUserUuid: null,
        projectUuid: null,
        riskWarningDesc: null,
        riskWarningName: null,
        riskWarningUuid: null,
        updateTime: null,
        updateUserName: null,
        updateUserUuid: null
      },
      selections: [],
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改风险提示',
        create: '新增风险提示',
        show: '查看风险提示'
      },
      // 新增的表单验证
      rules: {
        riskWarningName: [{ required: true, message: '请填写风险提示名称', trigger: 'change' },
        { max: 100, message: '风险提示名称在100个字符之内', trigger: 'change' }],
        riskWarningDesc: [{ max: 500, message: '风险提示描述在500个字符之内', trigger: 'change' }],
      },
      disableUpdate: false,
      closeStatus: false,
      downloadLoading: false,
      headers: '',
      file: ''
    }
  },
  watch: {
    // 监听父组件传值projectId
    projectId () {
      this.getList()
    }
  },
  created () {
    this.dqtoken = sessionStorage.getItem("TOKEN");
    this.headers = { 'Content-Type': 'multipart/form-data', 'TOKEN': sessionStorage.getItem("TOKEN") }
    this.getList()
  },
  methods: {
    findRiskWarning (data) {
      this.closeStatus = true
      this.disableUpdate = true
      this.temp = Object.assign({}, data) // copy obj
      this.dialogStatus = 'show'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    getList (query) {
      this.listLoading = true
      if (query) {
        this.pageQuery.condition = query
        this.pageQuery.pageNo = 1
      }
      // 给项目Id赋初始值
      this.pageQuery.condition.projectUuid = this.projectId
      listProjectByPage(this.pageProjectQuery).then(resp => {
        this.projectlist = resp.data.records
      })
      listByPage(this.pageQuery).then(resp => {
        this.total = resp.data.total
        this.list = resp.data.records
        this.listLoading = false
      })
    },
    handleFilter () {
      this.pageQuery.pageNo = 1
      this.getList()
    },
    sortChange (data) {
      const { prop, order } = data
      this.pageQuery.sortBy = order
      this.pageQuery.sortName = prop
      this.handleFilter()
    },
    resetTemp () {
      this.temp = {
        businessType: null,
        createTime: null,
        createUserName: null,
        createUserUuid: null,
        projectUuid: null,
        riskWarningDesc: null,
        riskWarningName: null,
        riskWarningUuid: null,
        updateTime: null,
        updateUserName: null,
        updateUserUuid: null
      }
    },
    handleCreate () {
      this.closeStatus = false
      this.disableUpdate = false
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.projectUuid = this.projectId
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
    handleUpdate () {
      this.closeStatus = false
      this.disableUpdate = false
      this.temp = Object.assign({}, this.selections[0]) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.projectUuid = this.projectId
          const tempData = Object.assign({}, this.temp)
          update(tempData).then(() => {
            const index = this.list.findIndex(v => v.riskWarningUuid === this.temp.riskWarningUuid)
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
    handleDelete () {
      this.$confirm(this.$t('confirm.delete'), this.$t('confirm.title'), {
        confirmButtonText: this.$t('confirm.okBtn'),
        cancelButtonText: this.$t('confirm.cancelBtn'),
        type: 'warning'
      }).then(() => {
        var ids = []
        this.selections.forEach((r, i) => { ids.push(r.riskWarningUuid) })
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
    handleSelectionChange (val) {
      this.selections = val
    },
    // 上传文件，获取文件流
    handleFileChange (file) {
      this.file = file.raw
    },
    handleRemove (file, fileList) {
      this.file = ''
    },
    beforeUpload (file) { },
    // 自定义上传
    uploadFile () {
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
      formData.append('riskWarningFile', this.file)
      formData.append('uploadFileName', 'git')
      formData.append('uploadFileContentType', suffix)
      var num = Math.random()
      axios({
        url: `/wisdomaudit/riskWarning/importFiles?${num}`,
        headers: {
          TOKEN: this.dqtoken,
        },
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
          message: '导入项目时发生异常',
          type: 'error',
          duration: 2000,
          position: 'bottom-right'
        })
        loading.close()
      })
    },
    handleDownload () {
      // 下载风险提示模板excel
      axios({
        method: 'get',
        url: `/wisdomaudit/riskWarning/downloadRiskWarningTemplate`,
        headers: {
          TOKEN: this.dqtoken,
        },
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
    getSortClass: function (key) {
      const sort = this.pageQuery.sort
      return sort === `+${key}` ? 'asc' : 'desc'
    }
  }
}
</script>

