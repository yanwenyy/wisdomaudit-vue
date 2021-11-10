<template>
  <div class="auditedInstitution">
    <el-row :gutter="24">
      <el-col :span="6">
        <el-input placeholder="输入关键字进行过滤" v-model="filterText">
        </el-input>

        <el-tree
          class="filter-tree"
          :data="data"
          :props="defaultProps"
          default-expand-all
          :filter-node-method="filterNode"
          ref="tree"
          @node-click="getCheckedNodes"
        >
        </el-tree>
      </el-col>
      <el-col :span="18">
        <el-row>
          <el-col :span="10">
            <!-- 导入按钮 -->
            <el-upload
              ref="upload"
              class="upload-demo"
              action="#"
              :on-progress="handleChange"
              :file-list="fileList"
            >
              <el-button size="small" type="primary">文件导入</el-button>
            </el-upload>
          </el-col>
          <div class="search">
            <el-input
              placeholder="请输入项目名称"
              v-model="queryInfo.condition.orgName"
              @keyup.enter.native="queryName"
            >
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
            min-width="120px"
            align="center"
            prop="orgName"
            label="机构名称"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            align="center"
            prop="leaderName"
            label="被审计单位领导"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            align="center"
            prop="userName"
            label="被审计单位接口人"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column label="操作" width="180px">
            <template slot-scope="scope">
              <el-button
                type="text"
                style="color: #44a3df; background: none; border: 0"
                size="small"
                @click="auditOrgLook(scope.row)"
              >
                查看
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
      </el-col>
    </el-row>

    <!-- 查看弹框 -->
    <el-dialog
      :visible.sync="look_auditOrg"
      width="30%"
    >
      <div class="mainTitle">被审计机构</div>
      <div class="formStyle">
        <el-form label-width="110px" ref="dictionaryRef" :model="auditOrgForm" disabled>
          <el-form-item prop="orgCode" label="ㅤ机ㅤ构ㅤ编ㅤ码:">
            <el-input v-model="auditOrgForm.orgCode"> </el-input>
          </el-form-item>
          <el-form-item prop="orgName" label="ㅤ机ㅤ构ㅤ名ㅤ称:">
            <el-input v-model="auditOrgForm.orgName"> </el-input>
          </el-form-item>
           <el-form-item prop="leaderName" label="ㅤ被审计单位领导:">
            <el-input v-model="auditOrgForm.leaderName"> </el-input>
          </el-form-item>
           <el-form-item prop="userName" label="被审计单位接口人:">
            <el-input v-model="auditOrgForm.userName"> </el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  auditOrgList,
  auditOrgTree,
  auditDetail
} from "@SDMOBILE/api/shandong/auditedInstitution";
import Pagination from "@WISDOMAUDIT/components/Pagination";
export default {
  components: { Pagination },
  data() {
    return {
      orgTableData: [], //被审计机构table
      total: 0, //table 总条数
      queryTree: {},
      queryInfo: {
        //模糊查询入参
        condition: {
          orgName: "",
          parentOrgCode: 1,
        },
        pageNo: 1,
        pageSize: 10,
      },
      fileList: [],
      filterText: "",
      data: [], //树形数据
      defaultProps: {
        children: "auditOrgs",
        label: "orgName",
      },
      look_auditOrg: false, //查看弹框
      auditOrgForm:{},//查看详情表单
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  created() {
    // 获取左侧树形List
    this.getauditOrgTree(this.queryTree);
  },
  methods: {
    //对树节点进行筛选时执行的方法
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },

    //被审计机构管理树形列表
    getauditOrgTree(data) {
      auditOrgTree(data).then((resp) => {
        this.data = resp.data;
        // 获取右侧列表数据
        this.getauditOrgList(this.queryInfo);
      });
    },

    //点击树形查看事件
    getCheckedNodes(data) {
      console.log(data);
      if (data.auditOrgs.length > 0) {
        this.queryInfo.condition.parentOrgCode = data.orgCode;
        // 获取右侧列表数据
        this.getauditOrgList(this.queryInfo);
      } else {
        return this.$message({
          showClose: true,
          message: "该节点没有下级节点！",
          type: "warning",
        });
      }
    },

    // 被审计机构列表查询
    getauditOrgList(data) {
      auditOrgList(data).then((resp) => {
        this.orgTableData = resp.data.records;
        this.total = resp.data.total;
      });
    },
    //模糊查询被审计机构
    queryName() {
      this.getauditOrgList(this.queryInfo);
    },
    //点击上传文件
    handleChange(event,file, fileList) {
      console.log(file);
      console.log(fileList);
      // this.$refs.upload.clearFiles();

      let formData = new FormData();
      // formData.append("file", file[0]);

      //  for(let i=0;i<fileList.length;i++){
      //    if(fileList[i].raw){
      //      formData.append("file", fileList[i].raw);
      //    }
      //  }
      fileList.forEach(item => {
         if (item.raw) {
          formData.append("orgFile", item.raw);
        }
      });
       

      this.$axios({
        method: "post",
        url: "/wisdomaudit/auditOrg/importFiles",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }).then((resp) => {
        console.log(resp);
      });
    },

    //查看按钮事件
    auditOrgLook(row) {
      console.log(row);
      this.look_auditOrg = true;
      auditDetail(row.auditOrgUuid).then((resp)=>{
          this.auditOrgForm = resp.data;
      })
    },
  },
};
</script>

<style lang="scss" scoped>
.auditedInstitution {
  padding: 1%;
  // border: 1px solid red;
}
.el-tree {
  margin-top: 5.5%;
}
.mainTitle {
  text-align: center;
  padding: 10px;
  border-bottom: 1px solid #d2d2d2;
}
.formStyle {
  margin-left: 15%;
  // border: 1px solid red;
  margin-top: 3%;
  padding: 5%;
  .el-input {
    position: relative;
    top: -35px;
    width: 70%;
  }
.el-form-item{
  margin-top:-4% ;
}
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
/* .el-upload >>> .el-upload-list__item-name{
  display: none !important;
} */
</style>