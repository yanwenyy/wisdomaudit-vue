<template>
  <div class="correctiveParameter">
    <div style="width: 100%; overflow: hidden">
      <div style="float: right;">
        <el-form class="search-form" :inline="true" :model="searchForm" @keyup.enter.native="list_data_start()">
          <!--<el-button type="success" class="addBtn">设置整改跟进人</el-button>-->
          <el-input
            placeholder="请输入项目名称"
            v-model="searchForm.projectName"
            class="input-with-select"
          >
            <el-button type="primary" slot="append" icon="el-icon-search" @click="list_data_start"></el-button>
          </el-input>
        </el-form>
      </div>
    </div>

    <el-table
      fit
      :header-cell-style="{'text-align':'center','background-color': '#F4FAFF',}"
      style="width: 100%"
      border
      :data="tableData"
      highlight-current-row
    >
      <el-table-column
        label="项目编号"
        width="100"
        type="index"
        align="center"
      />
      <el-table-column
        label="审计项目名称"
        width="250px"
        prop="projectName"
        align="left"
      />
      <el-table-column
        label="被审计单位"
        prop="auditOrgName"
        align="center"
        width="150"
      />
      <el-table-column
        label="项目类型"
        prop="projectType"
        align="center"
      />
      <el-table-column
        label="项目负责人"
        prop="projectLeaderName"
        align="center"
        width="150"
      />
      <el-table-column
        label="项目组长"
        align="center"
        prop="projectChargemanName"
      />
      <el-table-column
        label="项目跟进人"
        align="center"
        prop="correctUserName"
        width="150"
      />
      <el-table-column
        label="整改期间"
        width="250"
        align="center"
        prop="date"
      >
        <template slot-scope="scope">
          <span>{{scope.row.beginTime | dateformat}}</span>至 <span>{{scope.row.endTime | dateformat}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="创建人"
        prop="createUserName"
        align="center"
      />
      <el-table-column
        label="创建日期"
        align="center"
        prop="createTimeStr"
        width="150"
      />
      <el-table-column
        label="操作"
        align="center"
      >
        <template slot-scope="scope">
          <el-button type="text" class="sh-btn blue" @click="toEditList(scope.row)">
            查看
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="page">
      <el-pagination
        :current-page="page.current"
        :page-size="page.size"
        :page-sizes="[10, 50, 100]"
        :total="page.total"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>
    </div>
    <!-- 分页 end-->
  </div>
</template>

<script>
  import {recAccountCorrect_pageList} from
      '@SDMOBILE/api/shandong/ls'
  export default {
    data() {
      return {
        searchForm: {
          pageNo: 1,
          pageSize: 10,
          projectName:''
        },
        page: {
          current: 1,
          size: 10,
          total: 0
        },
        tableData: []
      }
    },
    mounted(){
      this.list_data_start();
    },
    methods: {
      //列表数据
      list_data_start () {
        let params={
          pageNo: this.searchForm.pageNo,
          pageSize: this.searchForm.pageSize,
          condition: {
            projectName: this.searchForm.projectName,
          }
        };
        this.loading = true;
        recAccountCorrect_pageList(params).then(resp => {
          var datas=resp.data;
          this.tableData = datas.records;
          this.page={
            current:datas.current,
            size:datas.size,
            total:datas.total
          };
          this.loading = false;
        })
      },
      //分页点击
      handleSizeChange(val) {
        this.searchForm.pageSize = val;
        this.list_data_start();
      },
      handleCurrentChange(val) {
        this.searchForm.pageNo= val;
        this.list_data_start();
      },
      toEditList(row) {
        this.$router.push({name: 'correctiveParameterIndex',query:{'managementProjectUuid':row.managementProjectUuid}})
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '../../assets/styles/css/yw.css';

  .sh-btn {
    background: transparent !important;
  }

  .correctiveParameter {
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
