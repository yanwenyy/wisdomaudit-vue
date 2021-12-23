<template>
  <div class="rectificationMeasures">
    <div style="width: 100%; overflow: hidden">
      <div style="float: left;">
        <el-form class="search-form"
                 :inline="true"
                 :model="searchForm"
                 @keyup.enter.native="list_data_start()">
          <el-form-item label="状态:">
            <el-select v-model="searchForm.correctStatus"
                       placeholder="请选择"
                       clearable>
              <el-option label="待提交"
                         value="1"></el-option>
              <el-option label="待审核"
                         value="2"></el-option>
              <el-option label="领导审核通过"
                         value="3"></el-option>
              <el-option label="整改跟进人审核通过"
                         value="4"></el-option>
              <el-option label="驳回待提交"
                         value="5"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="项目:">
            <el-select v-model="searchForm.projectName	"
                       placeholder="请选择"
                       @change="list_data_start"
                       clearable>
              <el-option v-for="(item,index) in projectList"
                         :label="item"
                         :value="item"
                         :key="index">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="问题:">
            <el-input clearable
                      placeholder="请输入问题"
                      v-model="searchForm.problemName"
                      class="input-with-select">

            </el-input>
          </el-form-item>
          <el-button type="primary"
                     @click="list_data_start">搜索</el-button>
          <el-button type="primary"
                     @click="exportList">导出</el-button>
        </el-form>
      </div>
    </div>
    <el-table style="width: 100%"
              :header-cell-style="{'text-align':'left','background-color': '#F4FAFF',}"
              border
              :data="tableData"
              @selection-change="handleSelectionChange"
              highlight-current-row>
      <el-table-column type="selection"
                       width="55">
      </el-table-column>
      <el-table-column :resizable="false"
                       label="序号"
                       algin="center"
                       width="100px"
                       type="index" />
      <el-table-column :resizable="false"
                       label="项目名称"
                       prop="projectName"
                       algin="left" />
      <el-table-column :resizable="false"
                       label="问题"
                       prop="problemName"
                       algin="left">
        <template slot-scope="scope">
          <span class="blue pointer"
                @click="look(scope.row)">{{scope.row.problemName}}</span>
        </template>
      </el-table-column>
      <el-table-column :resizable="false"
                       label="整改期间"
                       prop="createTime"
                       algin="left">
        <template slot-scope="scope">
          <span>{{scope.row.beginTime | dateformat}}</span>至 <span>{{scope.row.endTime | dateformat}}</span>
        </template>
      </el-table-column>
      <el-table-column :resizable="false"
                       label="整改责任部门及联系人"
                       width="250px"
                       algin="left"
                       prop="name">
        <template slot-scope="scope">
          <span>{{scope.row.correctDeptName+scope.row.correctPersonName||''}}</span>
        </template>
      </el-table-column>
      <el-table-column :resizable="false"
                       label="状态"
                       prop="correctStatus"
                       algin="left"
                       width="150px">
        <template slot-scope="scope">
          <span>{{scope.row.correctStatus=='1'?'待提交':scope.row.correctStatus=='2'?'待审核':scope.row.correctStatus=='3'?'领导审核通过':scope.row.correctStatus=='4'?'整改跟进人审核通过':scope.row.correctStatus=='5'?'驳回待提交':''}}</span>
        </template>
      </el-table-column>
      <el-table-column :resizable="false"
                       label="整改结果"
                       prop="name"
                       width="150px"
                       algin="left">
        <template slot-scope="scope">
          <span>{{scope.row.correctState=='0'?'未整改':scope.row.correctState=='1'?'整改中':scope.row.correctState=='2'?'已完成整改':'--'}}</span>
        </template>
      </el-table-column>
      <el-table-column :resizable="false"
                       label="操作"
                       algin="left"
                       width="100px">
        <template slot-scope="scope">
          <el-button class="blue sh-btn"
                     type="text"
                     @click="look(scope.row)">
            查看
          </el-button>
          <el-button v-if="scope.row.correctStatus=='3'"
                     class="blue sh-btn"
                     type="text"
                     @click="examine(scope.row)">
            审核
          </el-button>
        </template>
      </el-table-column>
    </el-table>

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
    <detail ref="detail"
            @refs="refreshList"></detail>
  </div>
</template>

<script>
import { correctStep_export, correctStep_pageList, correctStep_getProjectList } from
  '@SDMOBILE/api/shandong/ls'
import Detail from "./rectificationDetail";
export default {
  data () {
    return {
      projectList: [],//项目下拉列表
      multipleSelection: [],
      searchForm: {
        pageNo: 1,
        pageSize: 10,
        correctStatus: '',
        projectName: '',
        problemName: ''
      },
      page: {
        current: 1,
        size: 10,
        total: 0
      },
      tableData: [],
    }
  },
  components: {
    Detail
  },
  mounted () {
    this.list_data_start();
    this.list_data_start("getProjectList");
    // correctStep_getProjectList().then(resp => {
    //   this.projectList = resp.data;
    // })
  },
  methods: {
    handleSelectionChange (val) {
      this.multipleSelection = val;
    },
    exportList () {
      if (this.searchForm.projectName == '') {
        this.$message.error("请选择项目后导出");
        return false;
      }
      if (this.multipleSelection == '') {
        this.$message.error("请选择要导出的数据");
        return false;
      }
      var ids = [];
      this.multipleSelection.forEach((item) => {
        ids.push(item.correctStepUuid);
      });
      ids = ids.join(",");
      let formData = new FormData();
      formData.append('ids', ids)
      correctStep_export(formData).then(resp => {
        const content = resp;
        const blob = new Blob([content],
          { type: 'application/octet-stream,charset=UTF-8' }
        )
        if ('download' in document.createElement('a')) {
          // 非IE下载
          const elink = document.createElement('a')
          elink.download = "内部审计整改事项明细表.xlsx" //下载后文件名
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
    //详情保存后刷新列表
    refreshList () {
      this.list_data_start();
    },
    //列表数据
    list_data_start (ifsel) {
      let params = {
        pageNo: this.searchForm.pageNo,
        pageSize: ifsel == 'getProjectList' ? 1000000 : this.searchForm.pageSize,
        condition: {
          correctStatus: ifsel == 'getProjectList' ? '' : this.searchForm.correctStatus,
          projectName: ifsel == 'getProjectList' ? '' : this.searchForm.projectName,
          problemName: ifsel == 'getProjectList' ? '' : this.searchForm.problemName,
        }
      };
      this.loading = true;
      correctStep_pageList(params).then(resp => {
        var datas = resp.data;
        this.tableData = datas.records;
        this.page = {
          current: datas.current,
          size: datas.size,
          total: datas.total
        };
        this.loading = false;
        var projectList = [];
        if (ifsel == "getProjectList") {
          datas.records.forEach((item) => {
            if (projectList.indexOf(item.projectName) == -1) {
              projectList.push(item.projectName);
            }
          });
          this.projectList = projectList;
          // this.projectList=new Set(projectList);
        }
      })
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
    //提交点击
    sub (row) { },
    //审核点击
    examine (row) {
      this.$nextTick(() => {
        this.$refs.detail.init('整改事项明细', 'zgcs_examine', row.correctStepUuid, 'gjr');
      });
    },
    //查看点击
    look (row) {
      this.$nextTick(() => {
        this.$refs.detail.init('问题详情', 'zgtz_look', row.correctStepUuid);
      })
    }
  }
}
</script>

<style scoped lang="scss">
.rectificationMeasures {
  padding: 1%;
  .addBtn {
    background: #4bdcb4 !important;
    color: #fff;
  }
}

.page {
  width: 100%;
  padding: 20px 10px;
  display: flex;
  justify-content: flex-end;
}
</style>
<style scoped>
@import "../../assets/styles/css/yw.css";
.sh-btn {
  background: transparent !important;
}
</style>
