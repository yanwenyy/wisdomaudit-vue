<template>
  <div class="auditedInstitution">
    <el-row>
      <el-col :span="18">
        <!-- 添加按钮 -->
        <el-button class="queryBtn">新增项目</el-button>
      </el-col>
      <div class="search">
        <el-input placeholder="请输入项目名称" @keyup.enter.native="queryName">
        </el-input>
        <div
          class="search_icon"
          style="background: rgb(12, 135, 214) !important"
          @click="queryName"
        >
          <i class="el-icon-search" style="color: white"></i>
        </div>
      </div>
    </el-row>

    <!-- 项目管理列表 -->
    <el-table
      class="table"
      :data="orgTableData"
      style="margin-top: 1%; width: 100%"
      border
      stripe
      fit
      :header-cell-style="{ 'background-color': '#F4FAFF' }"
    >
      <el-table-column type="selection" width="40"> </el-table-column>
      <el-table-column
        align="center"
        prop="orgCode"
        width="105"
        label="机构编码"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        min-width="90px"
        align="center"
        prop="orgName"
        label="机构名称"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        align="center"
        min-width="90px"
        prop="auditOrgName"
        label="被审计对象"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        align="center"
        prop="projectTypeName"
        label="项目类型"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        align="center"
        prop="specialName"
        label="专题"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        align="center"
        prop="fieldName"
        label="领域"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        align="center"
        min-width="90px"
        prop="projectLeaderName"
        label="项目负责人"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        align="center"
        prop="projectChargemanName"
        label="项目组长"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="auditStartData"
        label="审计期间"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{ scope.row.auditStartData }} - {{ scope.row.auditFinishData }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="createUserName"
        label="创建人"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        align="center"
        prop="createTime"
        label="创建日期"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button
            type="text"
            style="color: #44a3df; background: none; border: 0"
            size="small"
            @click="editDialog(scope.row)"
          >
            编辑
          </el-button>

          <el-button
            type="text"
            style="color: #44a3df; background: none; border: 0"
            size="small"
            @click="confirm_problem(scope.row.managementProjectUuid)"
          >
            确认整改问题清单
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  
    <!-- 分页 -->
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryInfo.pageNo"
      :limit.sync="queryInfo.pageSize"
      @pagination="queryName"
    />
    <!-- 分页end -->
  </div>
</template>

<script>
import { auditOrgList } from "@SDMOBILE/api/shandong/auditedInstitution";
import Pagination from "@WISDOMAUDIT/components/Pagination";
export default {
  components: { Pagination },
  data() {
    return {
      orgTableData: [], //被审计机构table
      total:0, //table 总条数
      queryInfo: {  //模糊查询入参
        condition: {
          orgName: "",
        },
        pageNo: 1,
        pageSize: 10,
      },
    };
  },
  created() {
    this.getauditOrgList(this.queryInfo);
  },
  methods: {
    // 被审计机构列表查询
    getauditOrgList(data) {
      auditOrgList(data).then((resp) => {
        console.log(resp);
        this.orgTableData = resp.data.data;
        this.total = resp.data.total;
      });
    },
    //模糊查询被审计机构
    queryName() {
       this.getauditOrgList(this.queryInfo);
    },
  },
};
</script>

<style lang="scss" scoped>
.auditedInstitution {
  padding: 1%;
  // border: 1px solid red;
}
</style>
<style scoped>
@import "../../../assets/styles/css/yw.css";
.search {
  display: flex;
  justify-content: flex-end;
  position: relative;
}
.search >>> .el-input__inner {
  width: 220px !important;
  border-radius: 5px 0 0 5px;
}
.search >>> .el-input__inner {
  width: 250px !important;
  display: flex;
  float: right;
  border-radius: 0 !important;
}
.search >>> .search_icon {
  cursor: pointer;
  position: absolute;
  top: 0;
  right: 0%;
  width: 36px;
  height: 36px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  border-radius: 0 5px 5px 0;
}
</style>