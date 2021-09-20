<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="组员维护" name="first">
          <!-- <el-button  type="success" class="add">添加</el-button> -->
        <el-form ref="form" v-model="form">
        <el-table
          ref="singleTable"
          :data="tableData"
          style="width: 100%"
          border
        >
          <el-table-column property="role" label="角色" width="200">
          </el-table-column>
          <el-table-column label="姓名" width="280">
            <el-form-item>
              <el-select v-model="form.region" placeholder="请选择活动区域">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </el-form-item>
          </el-table-column>
          <el-table-column property="mobile" label="联系方式">
          </el-table-column>
          <el-table-column property="affUnit" label="所属单位">
          </el-table-column>
          <el-table-column property="department" label="所属部门">
          </el-table-column>
          <el-table-column
            label="是否接口人"
            width="150"
          >
           <el-select>
                <el-option label="是" value="shanghai"></el-option>
                <el-option label="否" value="beijing"></el-option>
              </el-select>
          </el-table-column>
           <el-table-column
            label="操作"
            width="150"
          >
          <el-button class="deleteBtn">删除</el-button>
          </el-table-column>
        </el-table>
      </el-form>
      <div class="addBtn">
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
import TaskMaintenance from '@/views/audit/task-maintenance/index'
export default {
  components:{
    TaskMaintenance
  },
     data() {
      return {
        activeName: 'first',
         tableData: [
        {
          role: "组员",
          name: "一一",
          mobile: "13999999999",
          affUnit: "审计系统",
          department: "内审部",
          contactPerson: "是",
        },
        {
          role: "组员",
          name: "二二",
          mobile: "13999999999",
          affUnit: "审计系统",
          department: "内审部",
          contactPerson: "否",
        },
         {
          role: "组员",
          name: "一一",
          mobile: "13999999999",
          affUnit: "审计系统",
          department: "内审部",
          contactPerson: "是",
        },
        {
          role: "组员",
          name: "二二",
          mobile: "13999999999",
          affUnit: "审计系统",
          department: "内审部",
          contactPerson: "否",
        },
         {
          role: "组员",
          name: "一一",
          mobile: "13999999999",
          affUnit: "审计系统",
          department: "内审部",
          contactPerson: "是",
        },
        {
          role: "组员",
          name: "二二",
          mobile: "13999999999",
          affUnit: "审计系统",
          department: "内审部",
          contactPerson: "否",
        },

      ],
       form: {
        region: "",
      },
      };
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      }
    }
};
</script>

<style lang="scss" scoped>
// .el-button{
//   background: #4BDCB4;
// }
.deleteBtn{
  color: red;
}
.addBtn{
  width: 100%;
  padding: 10px;
  color: #128AD7;
  text-align: center;
  border: 1px solid #EBEEF2;
}
</style>
