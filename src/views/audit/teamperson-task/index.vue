<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="组员维护" name="first">
        <!-- <el-button  type="success" class="add">添加</el-button> -->
        <!-- 组员维护列表 -->
        <el-form>
          <el-table
            ref="singleTable"
            :data="tableData"
            style="width: 100%"
            border
            v-loading="loading"
          >
            <el-table-column label="角色" width="200">组员 </el-table-column>
            <el-table-column
              label="姓名"
              width="280"
              prop="peopleTable.peopleName"
            >
              <template slot-scope="scope">
                <el-form-item>
                  <el-select
                    v-model="scope.row.peopleTable.peopleName"
                    filterable
                    @change="selectChange(scope.row)"
                  >
                    <el-option
                      v-for="item in form"
                      :key="item.peopleTableUuid"
                      :label="item.peopleName"
                      :value="item.peopleName"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              property="peopleTable.memberPhone"
              label="联系方式"
            >
            </el-table-column>
            <el-table-column
              property="peopleTable.memberCompany"
              label="所属单位"
            >
            </el-table-column>
            <el-table-column
              property="peopleTable.memberDepartment"
              label="所属部门"
            >
            </el-table-column>
            <el-table-column
              property="isLiaison"
              label="是否接口人"
              width="150"
            >
              <template slot-scope="scope">
                <el-form-item>
                  <el-select
                    v-model="scope.row.isLiaison"
                    placeholder="请选择"
                    @change="selectisLiaison(scope.row)"
                  >
                    <el-option
                      v-for="item in isconperOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  style="color: #db454b"
                  size="small"
                  @click.native.prevent="deleteRow(scope.row, tableData)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form>

        <div class="addBtn" @click="addData">
          <i class="el-icon-plus"></i>
          <span>新增</span>
        </div>
        <!-- 分页 -->
        <!-- <div class="page">
          <el-pagination
            background
            :hide-on-single-page="false"
            layout="prev, pager, next"
            :page-sizes="[2, 4, 6, 8]"
            :current-page="this.tableData.current"
            @current-change="handleCurrentChange"
            :page-size="this.tableData.size"
            :total="this.tableData.total"
          ></el-pagination>
        </div> -->
        <!-- 分页 end-->
      </el-tab-pane>
      <el-tab-pane label="审计任务维护" name="second">
        <TaskMaintenance />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import TaskMaintenance from "@/views/audit/task-maintenance/index";
import {
  projectMembership,
  editprojectMembership,
  getProjectMember,
  deletprojectMembership,
  addprojectMembership,
} from "@SDMOBILE/api/shandong/memberMaintenance.js";

export default {
  components: {
    TaskMaintenance,
  },
  data() {
    return {
      selectName: {},
      editId: "",
      loading: false,
      activeName: "first",
      query: {
        condition: {
          managementProjectUuid: "",
        },
        pageNo: 1,
        pageSize: 10,
      },
      select: {},
      tableData: [],
      form: [],
      isconperOptions: [
        {
          value: 0,
          label: "是",
        },
        {
          value: 1,
          label: "否",
        },
      ],
      value: "",
    };
  },
  created() {
    this.projectMember(this.query);
    this.getSelectData(this.select);
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    // 删除当前人员
    deleteRow(row, rows) {
      if (!row.peopleTableUuid) {
        rows.splice(row.index+3, 1);
      } else {
        deletprojectMembership(row.projectMembershipUuid).then((resp) => {
          console.log(this.resp);
        });
        this.projectMember(this.query);
      }
    },
    // 添加一行新数据
    addData() {
      var id = 0;
      id++,
      this.tableData.push({
        index:id,
        role: "组员",
        peopleTableUuid: "",
        peopleTable: {
          peopleName: "",
          memberPhone: "",
          memberCompany: "",
          memberDepartment: "",
        },
        isLiaison: "",
      });
    },
    projectMember(data) {
      projectMembership(data).then((resp) => {
        this.loading = true;
        this.tableData = resp.data.records;
        console.log(this.tableData);
        this.loading = false;
      });
    },
    getSelectData(data) {
      getProjectMember(data).then((resp) => {
        this.form = resp.data.records;
      });
    },
    // 姓名下拉框的方法
    selectChange(obj) {
      for (var i = 0; i < this.form.length; i++) {
        if (obj.peopleTable.peopleName == this.form[i].peopleName) {
          this.editId = this.form[i].peopleTableUuid;
        }
      }
      for (var i = 0; i < this.tableData.length; i++) {
        if (
          obj.peopleTable.peopleName ==
            this.tableData[i].peopleTable.peopleName &&
          obj.peopleTable.peopleTableUuid !==
            this.tableData[i].peopleTable.peopleTableUuid
        ) {
          this.$message.warning("请勿选择相同组员");
          return this.projectMember(this.query);
        }
      }
      if (!obj.peopleTableUuid) {
        var Data = {
          peopleTableUuid: this.editId,
        };
        addprojectMembership(Data).then((resp) => {
          this.$message.success("添加成功！");
        });
        this.projectMember(this.query);
      } else {
        var Data = {
          peopleTableUuid: this.editId,
          projectMembershipUuid: obj.projectMembershipUuid,
        };
        editprojectMembership(Data).then((resp) => {
          this.$message.success("修改成功！");
        });

        this.projectMember(this.query);
      }
    },
    selectisLiaison(obj, val) {
      console.log(obj);
      console.log(val);
      if (!obj.peopleTableUuid) {
        this.$message.warning("请选择姓名！");
      } else {
        var Data = {
          isLiaison: obj.isLiaison,
          projectMembershipUuid: obj.projectMembershipUuid,
        };
        editprojectMembership(Data).then((resp) => {
          this.$message.success("修改成功！");
        });
      }
    },
  },
};
</script>
  
<style lang="scss" scoped>
// .el-button{
//   background: #4BDCB4;
// }
.deleteBtn {
  color: red;
}
.addBtn {
  width: 100%;
  padding: 10px;
  color: #128ad7;
  text-align: center;
  border: 1px solid #ebeef2;
  cursor: pointer;
}
.page {
  width: 100%;
  padding: 20px 10px;
  display: flex;
  justify-content: flex-end;
}
</style>
