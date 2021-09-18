<template>
  <div class="noecresAdd">
    <el-card>
      <el-row :gutter="24" class="titleMes">
        <el-col :span="1.5">
          <span class="title">基本信息</span>
        </el-col>
        <el-col :span="1.2">
          <el-button type="primary">保存</el-button>
        </el-col>
        <el-col :span="1">
          <el-button type="primary" @click="goback">返回</el-button>
        </el-col>
      </el-row>

      <el-form ref="addForm">
        <div class="table-box">
          <table class="tables">
            <tr>
              <td>项目编号</td>
              <td>123456</td>
              <td>项目名称</td>
              <td>
                <el-form-item>
                  <el-input
                    placeholder="XXX经责审计项目"
                    class="projectInput"
                  ></el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td>项目类型</td>
              <td>
                <el-form-item>
                <el-select placeholder="专项审计">
                  <el-option label="是" value="shi"></el-option>
                  <el-option label="否" value="fou"></el-option>
                </el-select>
                </el-form-item>
              </td>
              <td>项目负责人</td>
              <td>
                <el-form-item>
                <el-select placeholder="张三">
                  <el-option label="是" value="shi"></el-option>
                  <el-option label="否" value="fou"></el-option>
                </el-select>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td>审计期间</td>
              <td>
                <el-form-item>
                  <el-date-picker
                    type="datetime"
                    placeholder="选择日期"
                    style="width: 200px"
                  ></el-date-picker>
                  <span> - </span>
                  <el-date-picker
                    type="datetime"
                    placeholder="选择日期"
                    style="width: 200px"
                  ></el-date-picker>
                </el-form-item>
              </td>
              <td></td>
              <td></td>
            </tr>
          </table>
        </div>
        <el-card class="table">
          <el-row :gutter="24" class="titleMes">
            <el-col :span="1.5">
              <span class="title">设置组长</span>
            </el-col>
            <el-col :span="1">
              <el-button type="primary" @click="addgroupLeader">新增</el-button>
            </el-col>
          </el-row>
          <el-table :data="tableData" style="width: 100%" :cell-style="{ textAlign: 'center' }" :show-header="false"  border>
            <el-table-column prop="itemCode" width="300"> </el-table-column>
            <el-table-column width="250"> 被审计对象 </el-table-column>
            <el-table-column prop="auditeeValue" width="250">
              <el-form-item>
              <el-select placeholder="经责审计">
                <el-option label="是" value="shi"></el-option>
                <el-option label="否" value="fou"></el-option>
              </el-select>
              </el-form-item>
            </el-table-column>
            <el-table-column prop="address" width="250"> 组长 </el-table-column>
            <el-table-column prop="identityValue" width="250">
              <el-form-item>
              <el-select placeholder="张三">
                <el-option label="是" value="shi"></el-option>
                <el-option label="否" value="fou"></el-option>
              </el-select>
              </el-form-item>
            </el-table-column>
            <el-table-column>
              <template slot-scope="scope">
                <el-button type="primary" @click="deleteLine(scope.row.itemCode)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        {
          itemCode: "JZ2021001-1",
        },
        {
          itemCode: "JZ2021001-2",
        },
         {
          itemCode: "JZ2021001-3",
        },
      ],
    };
  },
  methods: {
    goback() {
      this.$router.push({ path: "/audit/project" });
    },
    addgroupLeader(){
      // var id =0;
      // id++;
      this.tableData.push({
        itemCode:"JZ2021001-1",
        // id:id,
      })
    },
    deleteLine(id){
      // console.log(id);
      var deleteTab = [];
      for(var i=0; i<this.tableData.length; i++){
        if(this.tableData[i].itemCode != id){
          deleteTab.push(
            {itemCode:this.tableData[i].itemCode}
          )
        }
      }
      this.tableData = deleteTab;
    }
  },
};
</script>

<style lang="scss" scoped>
.noecresAdd {
  .title {
    font-size: 13px;
    position: relative;
    top: 10px;
  }

  .el-card {
    background-color: #efefef;
  }
  .titleMes {
    margin-bottom: 1%;
  }
}
.table_box {
  width: 60%;
  height: 500px;
  margin: 0 auto;
}

.projectInput {
  width: 200px !important;
}

table {
  border: 1px solid #000;
  border-radius: 10px;
  border-spacing: 1;
  box-shadow: 2px 2px 2px #ccc;
  border-spacing: 0;
  width: 97%;
  background-color: #fff;
  margin-left:1.6% ;
}

table tr {
  text-align: center;
}
table td,
table th {
  border-right: 1px solid #000;
  /*设置表格单元格外边框，只设置右下边框*/
  border-bottom: 1px solid #000;
  padding: 10px;
  /*设置单元格内边距，单元格内容显得不拥挤*/
  text-align: center;
  width: 600px;
}
tr:last-child td:first-child {
  border-radius: 0 0 0 10px;
}
tr:last-child td:last-child {
  border-radius: 0 0 10px 0;
}
tr:last-child td {
  border-bottom: none;
}
tr td:last-child,
tr th:last-child {
  border-right: none;
}

.table{
  margin-top: 3%;
}
</style>