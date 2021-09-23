<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="组员维护" name="first">
        <!-- <el-button  type="success" class="add">添加</el-button> -->
        <!-- 组员维护列表 -->
        <el-form ref="form" :model="form">
          <el-table
            ref="singleTable"
            :data="tableData"
            style="width: 100%"
            border
          >
            <el-table-column property="role" label="角色" width="200">
            </el-table-column>
            <el-table-column label="姓名" width="280">
              <template scope="scope">
                <el-form-item>
                  <el-select v-model="scope.row.name">
                    <el-option
                      v-for="item in sensitiveOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column property="mobile" label="联系方式">
            </el-table-column>
            <el-table-column property="affUnit" label="所属单位">
            </el-table-column>
            <el-table-column property="department" label="所属部门">
            </el-table-column>
            <el-table-column label="是否接口人" width="150">
              <template scope="scope">
                <el-form-item>
                  <el-select v-model="scope.row.contactPerson">
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
                  @click.native.prevent="deleteRow(scope.$index, tableData)"
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
      </el-tab-pane>
      <el-tab-pane label="审计任务维护" name="second">
        <TaskMaintenance />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import TaskMaintenance from "@/views/audit/task-maintenance/index";
export default {
  components: {
    TaskMaintenance,
  },
  data() {
    return {
      activeName: "first",
      tableData: [
        {
          role: "组员",
          name: "",
          mobile: "13999999999",
          affUnit: "审计系统",
          department: "内审部",
          contactPerson: "",
        },
        {
          role: "组员",
          name: "",
          mobile: "13999999999",
          affUnit: "审计系统",
          department: "内审部",
          contactPerson: "",
        },
        {
          role: "组员",
          name: "",
          mobile: "13999999999",
          affUnit: "审计系统",
          department: "内审部",
          contactPerson: "",
        },
        {
          role: "组员",
          name: "",
          mobile: "13999999999",
          affUnit: "审计系统",
          department: "内审部",
          contactPerson: "",
        },
        {
          role: "组员",
          name: "",
          mobile: "13999999999",
          affUnit: "审计系统",
          department: "内审部",
          contactPerson: "",
        },
        {
          role: "组员",
          name: "",
          mobile: "13999999999",
          affUnit: "审计系统",
          department: "内审部",
          contactPerson: "",
        },
      ],
      form: {
        region: "",
      },

      sensitiveOptions: [
        {
          value: "选项1",
          label: "用户一",
        },
        {
          value: "选项2",
          label: "用户二",
        },
        {
          value: "选项3",
          label: "用户三",
        },
        {
          value: "选项4",
          label: "用户四",
        },
        {
          value: "选项5",
          label: "用户五",
        },
      ],
      isconperOptions: [
        {
          value: "选项1",
          label: "是",
        },
        {
          value: "选项2",
          label: "否",
        },
      ],
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
     deleteRow(index, rows) {
      rows.splice(index, 1);
    },
    addData(){
       this.tableData.push({   
          role: "组员",
          name: "",
          mobile: "13999999999",
          affUnit: "审计系统",
          department: "内审部",
          contactPerson: "",
      });
    }
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
</style>
