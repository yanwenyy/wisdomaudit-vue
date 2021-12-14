<template>
  <div class="rectificationMeasures">
    <div style="width: 100%; overflow: hidden">
      <el-button class="back-group"
                 style="float: left"
                 @click="back"><i class="el-icon-back backBtn"></i></el-button>
      <div style="float: right;">
        <el-form class="search-form"
                 :inline="true"
                 :model="searchForm"
                 @keyup.enter.native="init()">
          <!--<el-button type="success" class="addBtn">设置整改跟进人</el-button>-->
          <el-input placeholder="请输入问题名称"
                    v-model="searchForm.problemName"
                    class="input-with-select">
            <el-button type="primary"
                       slot="append"
                       icon="el-icon-search"
                       @click="list_data_start"></el-button>
          </el-input>
        </el-form>
      </div>
    </div>
    <el-table :header-cell-style="{'text-align':'left','background-color': '#F4FAFF',}"
              style="width: 100%"
              border
              :data="tableData"
              highlight-current-row>
      <el-table-column label="序号"
                       type="index"
                       algin="left" />
      <el-table-column label="问题"
                       width="150px"
                       prop="problemName"
                       align="left">
        <template slot-scope="scope">
          <span class="blue pointer"
                @click="look(scope.row)">{{scope.row.problemName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="问题描述"
                       width="150px"
                       prop="problemDesc"
                       align="left" />
      <el-table-column label="整改期间"
                       width="200px"
                       prop="date"
                       algin="left">
        <template slot-scope="scope">
          <span>{{scope.row.beginTimeStr}}</span>至 <span>{{scope.row.endTimeStr}}</span>
        </template>
      </el-table-column>
      <el-table-column label="整改责任部门及联系人"
                       prop="name"
                       algin="left">
        <template slot-scope="scope">
          <span>{{scope.row.correctDeptName+scope.row.correctPersonName||''}}</span>
        </template>
      </el-table-column>

      <el-table-column label="状态"
                       algin="left"
                       prop="correctStatus">
        <template slot-scope="scope">
          <span>{{scope.row.correctStatus=='1'?'待提交':scope.row.correctStatus=='2'?'待审核':scope.row.correctStatus=='3'?'领导审核通过':scope.row.correctStatus=='4'?'整改跟进人审核通过':scope.row.correctStatus=='5'?'驳回待提交':''}}</span>
        </template>
      </el-table-column>
      <el-table-column label="整改结果"
                       algin="left"
                       prop="correctState">
        <template slot-scope="scope">
          <span>{{scope.row.correctState=='0'?'未整改':scope.row.correctState=='1'?'整改中':scope.row.correctState=='2'?'已完成整改':'--'}}</span>
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
    <detail ref="detail"></detail>

  </div>
</template>

<script>
import FeedBackDialog from './feedback-dialog'
import Detail from "../rectificationDetail";
import { recAccountCorrect_correctStepPageList } from
  '@SDMOBILE/api/shandong/ls'
export default {
  components: {
    FeedBackDialog,
    Detail
  },
  data () {
    return {
      visible: false,
      searchForm: {
        pageNo: 1,
        pageSize: 10,
        problemName: '',
        projectId: this.$route.query.managementProjectUuid
      },
      page: {
        current: 1,
        size: 10,
        total: 0
      },
      tableData: []
    }
  },
  mounted () {
    this.list_data_start();
  },
  methods: {
    back () {
      this.$router.back();
    },
    //列表数据
    list_data_start () {
      let params = {
        pageNo: this.searchForm.pageNo,
        pageSize: this.searchForm.pageSize,
        condition: {
          problemName: this.searchForm.problemName,
          managementProjectUuid: this.searchForm.projectId,
        }
      };
      this.loading = true;
      recAccountCorrect_correctStepPageList(params).then(resp => {
        var datas = resp.data;
        this.tableData = datas.records;
        this.page = {
          current: datas.current,
          size: datas.size,
          total: datas.total
        };
        this.loading = false;
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
    //查看点击
    look (row) {
      this.$nextTick(() => {
        this.$refs.detail.init('问题明细', 'zgtz_look', row.correctStepUuid);
      })
    },
    showFeedback () {
      this.visible = true
    },
    closeFeedback () {
      this.visible = false

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
@import "../../../assets/styles/css/yw.css";
.sh-btn {
  background: transparent !important;
}
</style>
