<template>
  <div>


     <div class="content">
      <div class="kuan">模型名称:</div>
      <el-input v-model="name" placeholder="请输入关键字"></el-input>
     <el-button type="primary">查询</el-button>
      <el-button  style="border:1px solid #cccc;" >筛选</el-button>
    </div>

  <div>
            <el-table :data="tableData" style="width: 100%" >
          <el-table-column  type="index"
      label="模型编号"> </el-table-column>
          <el-table-column prop="name" label="所属领域"> </el-table-column>
          <el-table-column prop="province" label="所属专题"> </el-table-column>
          <el-table-column prop="city" label="模型名称"> </el-table-column>
          <el-table-column prop="address" label="业务规则"> </el-table-column>
          <el-table-column prop="leixing" label="逻辑说明"> </el-table-column>
          <el-table-column label="操作">

              <el-link type="primary" >查看</el-link>


          </el-table-column>
        </el-table>
      </div>
      <!-- 分页 -->
      <div class="page">
        <el-pagination background layout="prev, pager, next" :total="1000">
        </el-pagination>
      </div>
      <!-- 分页 end-->
  </div>


</template>

<script>
export default {
  data() {
    return {
      input: "",
      name: "",
      tableData: [
        {
          date: "1",
          name: "个人",
          province: "欠费",
          city: "欠费未缴清再开卡",
          address: "结合欠费未缴清用户信息表...",
          leixing: "根据用户欠费的欠费号码的...",
          zip: "条款xxx",
          state: "3",
        },
        {
          date: "1",
          name: "个人",
          province: "欠费",
          city: "欠费未缴清再开卡",
          address: "结合欠费未缴清用户信息表...",
          leixing: "根据用户欠费的欠费号码的...",
          zip: "条款xxx",
          state: "3",
        },
        {
          date: "1",
          name: "个人",
          province: "欠费",
          city: "欠费未缴清再开卡",
          address: "结合欠费未缴清用户信息表...",
          leixing: "根据用户欠费的欠费号码的...",
          zip: "条款xxx",
          state: "3",
        },
        {
          date: "1",
          name: "个人",
          province: "欠费",
          city: "欠费未缴清再开卡",
          address: "结合欠费未缴清用户信息表...",
          leixing: "根据用户欠费的欠费号码的...",
          zip: "条款xxx",
          state: "3",
        },
        {
          date: "1",
          name: "个人",
          province: "欠费",
          city: "欠费未缴清再开卡",
          address: "结合欠费未缴清用户信息表...",
          leixing: "根据用户欠费的欠费号码的...",
          zip: "条款xxx",
          state: "3",
        },
        {
          date: "1",
          name: "个人",
          province: "欠费",
          city: "欠费未缴清再开卡",
          address: "结合欠费未缴清用户信息表...",
          leixing: "根据用户欠费的欠费号码的...",
          zip: "条款xxx",
          state: "3",
        },
        {
          date: "1",
          name: "个人",
          province: "欠费",
          city: "欠费未缴清再开卡",
          address: "结合欠费未缴清用户信息表...",
          leixing: "根据用户欠费的欠费号码的...",
          zip: "条款xxx",
          state: "3",
        },
        {
          date: "1",
          name: "个人",
          province: "欠费",
          city: "欠费未缴清再开卡",
          address: "结合欠费未缴清用户信息表...",
          leixing: "根据用户欠费的欠费号码的...",
          zip: "条款xxx",
          state: "3",
        },
        {
          date: "1",
          name: "个人",
          province: "欠费",
          city: "欠费未缴清再开卡",
          address: "结合欠费未缴清用户信息表...",
          leixing: "根据用户欠费的欠费号码的...",
          zip: "条款xxx",
          state: "3",
        },
        {
          date: "1",
          name: "个人",
          province: "欠费",
          city: "欠费未缴清再开卡",
          address: "结合欠费未缴清用户信息表...",
          leixing: "根据用户欠费的欠费号码的...",
          zip: "条款xxx",
          state: "3",
        },
      ],
    };
  },
};
</script>
<style>
.el-table__header {
  border: none !important;
}</style>
<style  scoped lang='scss'>

.content {
  display: flex;
  align-items: center;
  .kuan {
    width: 100px;
  }
  .el-input {
    width: 300px;
  }
  .el-button {
    margin-left: 20px;
  }

}
.page {
  width: 100%;
  padding: 20px 10px;
  display: flex;
  justify-content: flex-end;
}
</style>>
