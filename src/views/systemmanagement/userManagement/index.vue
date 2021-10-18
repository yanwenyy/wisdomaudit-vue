<template>
  <div class="sjzl">
    <div class="conter">
      <div class="two">
        <div class="projectTab">
          <el-row class="titleMes" type="flex" justify="space-between">
            <el-col :span="7">
              <div class="search">
                <el-input placeholder="请输入角色名称搜索" v-model="queryInfo.userName"> </el-input>
                <el-button class="search_icon" @click="searchUser">
                  <i class="el-icon-search" style="color: #fff"></i>
                </el-button>
                <el-button type="primary" @click="searchUser">搜索</el-button>
              </div>
            </el-col>
            <el-col :span="2">
              <el-button type="primary" @click="new_add()">新增</el-button>
            </el-col>

            <!-- <el-col :span="1.5">
              <el-button type="primary"
                         style="background: #1371cc !important;">自建任务</el-button>
            </el-col> -->
          </el-row>
          <!-- 表单 -->
          <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="userName" label="用户账户">
            </el-table-column>
            <el-table-column prop="mobile" label="OA账号"> </el-table-column>
            <el-table-column prop="realName" label="真实姓名">
            </el-table-column>
            <el-table-column prop="email" label="邮箱"> </el-table-column>
            <el-table-column prop="roleName" label="角色名称">
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间">
            </el-table-column>
            <el-table-column prop="address" label="操作">
              <template slot-scope="scope">
                <el-link type="primary" @click.native.prevent="det_obj(scope.row.id)"
                  >编辑</el-link
                >
                <el-link
                  type="danger"
                  @click.native.prevent="deleteRow(scope.row.id)"
                  >删除</el-link
                >
              </template>
            </el-table-column>
          </el-table>
          <!-- 表单 end-->
        </div>

        <!-- 分页 -->
        <div class="page">
          <pagination
            :total="total"
            :page.sync="pageNo"
            :limit.sync="pageSize"
            @handleSizeChange="handleSizeChange"
            @handleCurrentChange="handleCurrentChange"
          />
        </div>
        <!-- 分页 end-->
      </div>
    </div>
  </div>
</template>

<script>
import { getUserList ,removeUser} from "../../../api/user";
import Pagination from "@/components/Pagination";
export default {
  components: { Pagination },
  data() {
    return {
      color: "white", // 上传文件icon 颜色
      tab: [{ name: "审计资料任务列表" }, { name: "已操作的资料列表" }],
      label: "黄金糕",
      dia_tit: "新增",
      visible: false,
      setDialogVisible: false, //设置参数
      getDialogVisible: false, //下载
      addDialogVisible: false, //新增/编辑弹框
      detDialogVisible: false, //查看结果
      options: [
        {
          value: "选项1",
          label: "黄金糕",
        },
        {
          value: "选项2",
          label: "双皮奶",
        },
        {
          value: "选项3",
          label: "蚵仔煎",
        },
        {
          value: "选项4",
          label: "龙须面",
        },
        {
          value: "选项5",
          label: "北京烤鸭",
        },
      ],
      value: "",
      tableData: [],
      value1: "",
      value2: "",
      total: "1",
      queryInfo: {
        userName: "",
        // 当前页数
        pageCurrent: 1,
        // 每页显示多少条
        pageSize: 10,
      },
    };
  },
  computed: {},
  watch: {},
  methods: {
   async searchUser(){
       let data = {
        pageCurrent: this.queryInfo.pageCurrent,
        pageSize: this.queryInfo.pageSize,
        userName: this.queryInfo.userName,
      };
        let res = await getUserList(data);
       this.tableData = res.data.list;
    },
    async getUserLists() {
      let res = await getUserList();
      console.log(res, 111);
      this.tableData = res.data.list;
      this.total = res.data.total;
      this.pageSize = res.data.pageSize;
    },

    async handleSizeChange(val) {
      let data = {
        pageCurrent: this.queryInfo.pageCurrent,
        pageSize: val,
        // roleName: this.queryInfo.roleName,
      };
      let res = await getUserList(data);
      console.log(res, "翻页");
      this.tableData = res.data.list;
    },
    async handleCurrentChange(val) {
      let data = {
        pageCurrent: val,
        pageSize: this.queryInfo.pageSize,
        // roleName: this.queryInfo.roleName,
      };
      let res = await getUserList(data);
      this.tableData = res.data.list;
    },
    // 新增
    new_add() {
      this.$router.push({
        name: "newUserManagement",
      });
    },
    // 编辑
    det_obj(id) {
      console.log(id);
      this.$router.push({
        name: "editUserManagement",
         query: {
          id: id,
        },
      });
    },
    // 删除
    deleteRow(id) {
        console.log(id);
         this.$confirm("是否删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let ids = {
            userId:id,
          };
          let res = await removeUser(ids);
          if (res.status == 0) {
            this.$message({
              message: "删除成功",
              type: "success",
            });
            this.getUserLists();
          } else {
            this.$message({
              message: "删除失败",
              type: "warning",
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });

    },
    // 查看结果
    see_val() {
      this.detDialogVisible = true;
    },
    // 下载
    getInfo() {
      this.getDialogVisible = true;
    },
  },
  created() {
    this.getUserLists();
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
.el-divider {
  margin: 10px 0 20px 0;
}
.enclosurenum {
  margin-right: 30px !important;
}
.el-link {
  margin-right: 8px;
}
.sjzl .conter {
  width: 100%;
  float: left;
}
/* 内容  按钮 */
.sjzl >>> .el-button--primary {
  background-color: #42d7a5 !important;
  border: none;
}
.titleMes {
  padding: 10px 0 10px 0;
  box-sizing: border-box;
}
.btn_row {
  text-align: center;
  margin: 20px 0;
}
.sjzl >>> .el-button {
  background: none;
  border: none;
}
.sjzl >>> .el-table__header {
  border-top: none !important;
}
.update {
  display: flex;
  align-items: center;
}
.update_icon {
  width: 15px;
  height: 15px;
}
.update_icon svg {
  float: left;
  width: 15px;
  height: 15px;
}
.update span {
  color: #1371cc;
  margin-left: 5px;
}

.search {
  display: flex;
  justify-content: flex-end;
  position: relative;
}
.search >>> .el-input__inner {
  width: 180px;
  display: flex;
  float: right;
}
.search_icon {
  position: absolute;
  top: 0;
  right: 70px;
  background: #1371cc;
  width: 37px;
  height: 37px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}
.search >>> .el-button {
  background: #1371cc !important;
}

.page {
  width: 100%;
  padding: 20px 10px;
  display: flex;
  justify-content: flex-end;
}

.addForm {
  margin-top: 2%;
  .el-select,
  .el-input,
  .el-textarea,
  .upload-demo {
    position: relative;
    top: -35px;
    width: 400px;
  }
  .el-form-item {
    margin-bottom: -25px !important;
  }
}
.initializeProject {
  margin: 2% 1% 1% 0;
  ul {
    width: 100%;
    // margin-bottom: 1%;
    li {
      display: inline-block;
      width: 400px;
      background: #f1f5fb;
      margin-left: 0.2%;
      padding: 1.5%;
      border-radius: 10px;
      p {
        margin-bottom: 10px;
      }
      span:nth-child(2) {
        margin-right: 30px;
      }
    }
    .upload_val {
      float: right;
    }
  }
}
.det_tit {
  margin: 20px 10px;
  padding: 10px;
  font-size: 18px;
  border-bottom: 5px solid #999;
  color: #1371cc;
}
.det_btn {
  margin: 10px 0;
  text-align: right;
}
</style>
