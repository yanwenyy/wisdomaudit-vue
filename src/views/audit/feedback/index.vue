<template>
  <div class="feeback">
    <p class="title">反馈资料列表</p>

    <div class="task_type">
      <!-- 表单 -->
      <el-table :data="tableData_list"
                v-loading="loading"
                style="width: 100%">
        <el-table-column prop="name"
                         label="发起日期">
        </el-table-column>
        <el-table-column prop="name"
                         label="项目名称">
        </el-table-column>
        <el-table-column prop="name"
                         label="标题">
        </el-table-column>
        <el-table-column prop="name"
                         label="发起人">
        </el-table-column>
        <el-table-column prop="name"
                         label="状态">
        </el-table-column>
        <el-table-column prop="name"
                         label="发起日期">
        </el-table-column>

        <el-table-column label="操作"
                         width="250">
          <template scope="scope">
            <el-button @click="see(scope.row)"
                       type="text"
                       style="color:#1371CC"
                       size="small">
              查看
            </el-button>
            <el-button @click="feedback(scope.row)"
                       type="text"
                       style="color:#1371CC"
                       size="small">
              反馈
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="page">
        <el-pagination background
                       layout="prev, pager, next"
                       :page-sizes="[2, 4, 6, 8]"
                       :current-page="this.list_data.current"
                       @current-change="handleCurrentChange"
                       :page-size="this.list_data.size"
                       :total="this.list_data.total"></el-pagination>
      </div>
      <!-- 分页 end-->
    </div>
  </div>
</template>

<script>
<<<<<<< HEAD
import {
  data_pageList
} from
  '@SDMOBILE/api/shandong/feedback'
=======
import OperatingIndicatorsTow from "@WISDOMAUDIT/components/workbench/OperatingIndicatorsTow/index"; //经营指标
>>>>>>> 2fa9ade958802c7be923e50ca5351317be6aa073

export default {
  components: {
  },
  data () {
    return {
      loading: false,
      tableData_list: [
        { name: 111 },
        { name: 111 },
      ],
      list_data: {
        current: '',
        size: '',
        total: '',
      },
      params: {
        pageNo: '',
        pageSize: '',
      }
    }
  },
  props: ['active_project'],
  created () {
    this.managementProjectUuid = this.active_project;

    let params = {
      pageNo: this.params.pageNo,
      pageSize: this.params.pageSize,
      condition: {
        managementProjectUuid: this.managementProjectUuid,
      }
    }
    // this.list_data(params); // 模型  自建任务列表
  },
  methods: {
    handleCurrentChange (val) {
      console.log(val);
      this.list_data(params);
    },
    // 列表
    list_data (params) {
      page(params).then(resp => {
        console.log(resp);
      })
    }
  },
  // 查看
  see () {

  },
  // 反馈
  feedback () {

  },

};
</script>

<style  scoped>
.feeback {
  padding: 20px;
  box-sizing: border-box;
  background-color: #fff;
}
.title {
  width: 100%;
}
.task_type {
  padding: 10px 10px 20px 10px;
}

.page {
  width: 100%;
  padding: 20px 10px;
  display: flex;
  justify-content: flex-end;
}
</style>