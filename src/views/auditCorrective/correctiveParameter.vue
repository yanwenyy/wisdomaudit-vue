<template>
  <div class="correctiveParameter">
    <div style="width: 100%; overflow: hidden">
      <div style="float: right;">
        <el-form class="search-form" :inline="true" :model="form" @keyup.enter.native="init()">
          <!--<el-button type="success" class="addBtn">设置整改跟进人</el-button>-->
          <el-input
            placeholder="请输入项目名称"
            v-model="form.info"
            class="input-with-select"
          >
            <el-button type="primary" slot="append" icon="el-icon-search"></el-button>
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
        prop="address"
        align="left"
      />
      <el-table-column
        label="被审计单位"
        prop="name"
        align="center"
        width="150"
      />
      <el-table-column
        label="项目类型"
        prop="name"
        align="center"
      />
      <el-table-column
        label="项目负责人"
        prop="name"
        align="center"
        width="150"
      />
      <el-table-column
        label="项目组长"
        align="center"
        prop="name"
      />
      <el-table-column
        label="项目跟进人"
        align="center"
        prop="name"
        width="150"
      />
      <el-table-column
        label="审计期间"
        width="150"
        align="center"
        prop="date"
      />
      <el-table-column
        label="创建人"
        prop="name"
        align="center"
      />
      <el-table-column
        label="创建日期"
        align="center"
        prop="date"
        width="150"
      />
      <el-table-column
        label="操作"
        align="center"
      >
        <template slot-scope="scope">
          <el-button type="text" class="sh-btn blue" @click="toEditList">
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
  export default {
    data() {
      return {
        form: {},
        page: {
          current: 1,
          size: 10,
          total: 0
        },
        tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }]
      }
    },
    methods: {
      //分页点击
      handleSizeChange(val) {
        this.searchForm.pageSize = val;
        this.list_data_start();
      },
      handleCurrentChange(val) {
        this.searchForm.pageNo= val;
        this.list_data_start();
      },
      toEditList() {
        this.$router.push({name: 'correctiveParameterIndex'})
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
