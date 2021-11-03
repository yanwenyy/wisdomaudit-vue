<template>
  <div class="rectificationMeasures">
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
      :header-cell-style="{'text-align':'center','background-color': '#F4FAFF',}"
        style="width: 100%"
        border
        :data="tableData"
        highlight-current-row
    >
      <el-table-column
          label="序号"
          type="index"
          align="center"
      />
      <el-table-column
          label="问题"
          width="250px"
          prop="address"
          align="left"
      >
        <template slot-scope="scope">
          <span class="blue pointer" @click="look(scope.row)">{{scope.row.address}}</span>
        </template>
      </el-table-column>
      <el-table-column
          label="问题描述"
          width="250px"
          prop="address"
          align="left"
      />
      <el-table-column
          label="整改期间"
          width="200px"
          prop="date"
          align="center"
      />
      <el-table-column
          label="整改责任部门及联系人"
          width="180px"
          prop="name"
          align="center"
      >
      </el-table-column>

      <el-table-column
          label="状态"
          align="center"
          prop="name"
      >
      </el-table-column>
      <el-table-column
        label="整改结果"
        align="center"
        prop="name"
      >
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
    <detail ref="detail"></detail>

  </div>
</template>

<script>
import FeedBackDialog from './feedback-dialog'
import Detail from "../rectificationDetail";
export default {
  components: {
    FeedBackDialog,
    Detail
  },
  data() {
    return {
      visible: false,
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
    //查看点击
    look(row){
      this.$nextTick(()=>{
        this.$refs.detail.init('问题明细','zgtz_look');
      })
    },
    showFeedback() {
      this.visible = true
    },
    closeFeedback() {
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
  @import '../../../assets/styles/css/yw.css';
  .sh-btn{
    background: transparent!important;
  }
</style>
