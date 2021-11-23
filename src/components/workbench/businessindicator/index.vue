<template>
  <div class="indocator">
    <div class="filter-container">
      <el-button type="primary" @click="add()" v-if="userRole=='1'||userRole=='2'"
        >新增指标</el-button
      >
      <!--<div class="indocator-btn-box" v-if="!ifprojectmanage">-->
        <!--<el-button class="gary-border">提交</el-button>-->
        <!--<el-button class="gary-border" @click="importData()">导入</el-button>-->
        <!--<el-button class="gary-border" @click="exportData()">导出</el-button>-->
      <!--</div>-->
      <!--<div class="indocator-btn-box" v-else>-->
        <!--<el-button class="gary-border" @click="openExamine()">审核</el-button>-->
        <!--<el-button class="gary-border" @click="issued()">下发</el-button>-->
        <!--&lt;!&ndash; <el-button class="gary-border" @click="deleteData()">删除</el-button> &ndash;&gt;-->
      <!--</div>-->
    </div>
    <div class="jyzb-div">
      <table class="jyzb" style="table-layout: fixed">
        <tr>
          <th><div class="td-100">指标分类</div></th>
          <th><div class="td-150">指标名称</div></th>
          <th><div class="td-100">单位</div></th>
          <th v-for="item in yearRange"><div class="td-150">{{item}}</div></th>
          <th><div class="td-150">资料提供部门</div></th>
          <th><div class="td-100">联系人</div></th>
          <th><div class="td-100">操作</div></th>
        </tr>
      </table>
      <table class="jyzb" v-for="item in dataList" style="table-layout: fixed">
        <tr>
          <td class="jyzb-tr-title" :colspan="6+(yearRange.length)">{{item.indexType}}</td>
        </tr>
        <tr v-for="vtem in item.children">
          <td><div class="transparent td-100">指标分类</div></td>
          <td><div class="td-150">{{vtem.indexName}}</div></td>
          <td><div class="td-100">{{vtem.indexUnitName}}</div></td>
          <td v-for="y in vtem.operatingIndicatorsValueList">
            <div class="td-150" v-if="yearRange.indexOf(y.indexDate)!=-1">{{y.indexValue}}</div>
          </td>
          <td><div class="td-150">{{vtem.dataProvideDepartmentName}}</div></td>
          <td><div class="td-100">{{vtem.contactPerson}}</div></td>
          <td>
            <div class="td-100">
              <el-button type="text" class="blue" @click="edit(vtem)" v-if="userRole=='1'||userRole=='2'">编辑</el-button>
              <el-button type="text" class="red" @click="del(vtem.operatingIndicatorsUuid)" v-if="userRole=='1'||userRole=='2'">删除</el-button>
            </div>
          </td>
        </tr>
      </table>
    </div>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="pageQuery.pageNo"
      :limit.sync="pageQuery.pageSize"
      @pagination="getList"
    />
    <!-- 新增和编辑的弹框 -->
    <el-dialog
      title="经营指标审批"
      :visible.sync="dialogtextVisible"
      :close-on-click-modal="false"
    >
      <el-form v-model="examine">
        <el-form-item label="审批意见">
          <el-input
            type="textarea"
            v-model="examine.text"
            :autosize="{ minRows: 4, maxRows: 8 }"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogtextVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogtextVisible = false"
          >通过</el-button
        >
        <el-button type="danger" @click="dialogtextVisible = false"
          >驳回</el-button
        >
      </div>
    </el-dialog>
    <el-dialog
      title="经营指标列表"
      :visible.sync="dialoglistVisible"
      :close-on-click-modal="false"
    >
      <div style="display: flex; padding: 20px">
        指标名称：
        <el-input
          placeholder=""
          v-model="kupageQuery.condition.indexName"
          style="width: 300px"
        >
        </el-input>
        <el-button type="primary" class="gary-border" @click="getkulist()"
          >查询</el-button
        >
      </div>
      <el-table
        :data="kulistData"
        style="width: 100%"
        @selection-change="kulistSelectionChange"
      >
        <el-table-column type="selection" align="center" />
        <el-table-column prop="indexName" label="指标名称"></el-table-column>
      </el-table>
      <pagination
        v-show="kutotal > 0"
        :total="kutotal"
        :page.sync="kupageQuery.pageNo"
        :limit.sync="kupageQuery.pageSize"
        @pagination="getList"
      />
      <div slot="footer">
        <el-button @click="dialoglistVisible = false">取消</el-button>
        <el-button type="primary" @click="importSave()">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="编辑"
      :visible.sync="editVisible"
      :close-on-click-modal="false"
    >
      <el-form :model="formState" class="formData zb-edit"  label-width="150px">
        <el-form-item v-for="(item,index) in formState.operatingIndicatorsValueList" :label="item.indexDate" :key="index">
          <el-input
            v-model="item.indexValue"
            @input="item.indexValue=item.indexValue.replace(/[^\d]/g,'')"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="zb-edit-footer">
        <el-button @click="editVisible = false">取消</el-button>
        <el-button type="primary" @click="editSave">确定</el-button>
      </div>
    </el-dialog>
    <search-list ref="searchTabel" @refreshAdd="getAddInfo"></search-list>
  </div>
</template>

<script>
import Pagination from "@WISDOMAUDIT/components/Pagination"; // secondary package based on el-pagination
import SearchList from "./searchList"
import _ from "lodash";
import axios from "axios";
import {indexManagement_pageList,indexManagement_edit,indexManagement_delete} from
    '@SDMOBILE/api/shandong/ls'
export default {
  components: { Pagination ,SearchList},
  filters: {},
  props:['active_project','userRole'],
  data() {
    return {
      editVisible:false,//编辑经营指标
      formState:{},//编辑的form
      yearRange:['2018','2019','2020'],
      tableKey: "indicator",
      list: null,
      total: 0,
      listLoading: false,
      dataList:[],
      pageQuery: {
        managementProjectUuid: "", //项目管理主键
        pageNo: 1,
        pageSize: 20,
      },
      temp: {
        // 业务分类
        indexType: null,
        indexName: null,
        indexUnit: null,
        dataProvideDepartment: null,
        accessCaliber: null,
        status: 1,
      },
      selections: [],
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "编辑指标",
        create: "新增指标",
        show: "查看指标",
      },
      // 新增的表单验证
      rules: {
        indexType: [
          { required: true, message: "请填写指标类型", trigger: "change" },
        ],
        indexName: [
          { required: true, message: "请填写指标名称", trigger: "change" },
        ],
        indexUnit: [
          { required: true, message: "请填写单位", trigger: "change" },
        ],
        dataProvideDepartment: [
          { required: true, message: "请填写资料提供部门", trigger: "change" },
        ],
        state: [
          {
            required: true,
            message: "请填写取数口径或公式",
            trigger: "change",
          },
        ],
      },
      options: [
        { value: "xxx1", label: "xxx1" },
        { value: "xxx2", label: "xxx2" },
      ],
      downloadLoading: false,
      headers: { "Content-Type": "multipart/form-data" },
      file: "",
      indicatortableSelection: [],
      ifprojectmanage: false,
      dialogtextVisible: false,
      examine: { text: "" },
      //导入经营指标相关
      dialoglistVisible: false,
      kulistData: [],
      kupageQuery: {
        condition: {
          indexName: "",
        },
        pageNo: 1,
        pageSize: 20,
      },
      kutotal: 0,
      kutableSelection: [],
    };
  },
  watch: {},
  mounted() {
    this.getList();
  },
  methods: {
    //start
    //删除
    del(val){
      this.$confirm(`确认删除该条数据吗?删除后数据不可恢复`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        indexManagement_delete(val).then(resp => {
          // console.log(resp.data);
          if (resp.code == 0) {
            this.$message({
              message: "删除成功",
              type: "success",
            });
            this.getList();
          } else {
            this.$message({
              message: resp.data.msg,
              type: "error",
            });
          }
        });
      }).catch(() => {})
    },
    //编辑按钮点击
    edit(row){
      this.formState=row;
      this.editVisible=true;
    },
    //编辑保存
    editSave(){
      // console.log(JSON.stringify(this.formState))
      indexManagement_edit(this.formState).then(resp => {
        if (resp.code == 0) {
          this.$message({
            message: "修改成功",
            type: "success",
          });
          this.editVisible=false;
          this.getList();
        } else {
          this.$message({
            message: resp.data.msg,
            type: "error",
          });
        }
      })
    },
    getList() {
      // console.log(this.active_project)
      this.listLoading = true;
      this.pageQuery.managementProjectUuid=this.active_project;
      indexManagement_pageList(this.pageQuery).then(resp => {
        var datas=resp.data;
        this.dataList=datas.dataList;
        this.yearRange=datas.titleHeadList;
        this.loading = false;
        // console.log(JSON.stringify(this.dataList))
      })
      // axios({
      //   url: `/wisdomaudit/operatingIndicators/pageList`,
      //   method: "post",
      //   data: this.pageQuery,
      // }).then((res) => {
      //   console.log(res);
      //   this.listLoading = false
      //   if (res.data.code == 0) {
      //     this.list = res.data.data.data;
      //     this.total = res.data.data.total;
      //   }
      // });
    },
    //end

    openExamine() {
      this.dialogtextVisible = true;
    },
    kulistSelectionChange(val) {
      this.kutableSelection = val;
    },
    add() {
      this.$nextTick(() => {
        this.$refs.searchTabel.init(this.active_project);
      });
    },
    //生成经营指标点击后事件
    getAddInfo(){
      console.log(111)
      this.getList();
    },
    importData() {
      this.getkulist();
      this.dialoglistVisible = true;
    },
    importSave() {
      axios({
        url: `/wisdomaudit/`,
        method: "post",
        data: this.kutableSelection,
      }).then((res) => {
        if (res.data.code == 0) {
          this.$message({
            message: "导入成功",
            type: "success",
          });
          this.dialoglistVisible = false;
        }
      });
    },
    getkulist() {
      this.kulistData = [{ indexName: "11" }];
      return;
      axios({
        url: `/wisdomaudit/`,
        method: "post",
        data: this.kupageQuery,
      }).then((res) => {
        this.kulistData = res.data.data;
        this.kutotal = res.data.total;
      });
    },
    exportData() {
      axios({
        url: `/wisdomaudit/`,
        method: "post",
        data: this.temp,
      }).then((res) => {});
    },
    createData() {
      axios({
        url: `/wisdomaudit/operatingIndicators/save`,
        method: "post",
        data: this.temp,
      }).then((res) => {
        console.log(res);
        if (res.data.code == 0) {
          this.$message({
            message: "新增成功",
            type: "success",
          });
          this.dialogFormVisible = false;
          this.getList();
        }
      });
    },
    updateData() {
      axios({
        url: `/wisdomaudit/operatingIndicators/update`,
        method: "put",
        data: this.temp,
      }).then((res) => {
        if (res.data.code == 0) {
          this.$message({
            message: "修改成功",
            type: "success",
          });
          this.dialogFormVisible = false;
          this.getList();
        }
      });
    },
    issued() {
      let rep = []
      for(let i =0;i<this.indicatortableSelection.length;i++){
        rep.push({operatingIndicatorsUuid:this.indicatortableSelection[i].operatingIndicatorsUuid})
      }
      let params = {
        managementProjectUuid: this.pageQuery.condition.managementProjectUuid,
        operatingIndicatorsList: rep,
      };
      axios({
        url: `/wisdomaudit/operatingIndicatorsBackTask/sendTask`,
        method: "post",
        data: params,
      }).then((res) => {
        if (res.data.code == 0) {
          this.$message({
            message: "下发成功",
            type: "success",
          });
          this.getList();
        }
      });
    },
    deleteData() {
      console.log(this.indicatortableSelection);
      let rep = [];
      for (let i = 0; i < this.indicatortableSelection.length; i++) {
        rep.push(this.indicatortableSelection[i].indexId);
      }
      rep = rep.join(",");
      axios({
        url: `/wisdomaudit/operatingIndicators/delete/` + rep,
        method: "delete",
        data: {},
      }).then((res) => {
        if (res.data.code == 0) {
          this.$message({
            message: "删除成功",
            type: "success",
          });
          this.getList();
        }
      });
    },
  },
};
</script>
<style scoped>
  .jyzb-tr-title{
    text-align: left!important;
  }
  .indocator{
    height: 100%;
  }
.indocator-btn-box {
  float: right;
}
.gary-border {
  border: 1px solid #ccc;
}
.canclick {
  color: rgb(27, 168, 250);
  cursor: pointer;
}
  .jyzb-div{
    width:100%;
    overflow:scroll;
  }
  .jyzb{
    border: 1px solid #ddd;
    min-width: 100vw;
    width: auto;
    overflow-x: auto;
    box-sizing: border-box;
  }
  .jyzb tr:not(:last-child){
    border-bottom: 1px solid #ddd;
  }
  .jyzb td:not(:last-child),.jyzb th:not(:last-child){
     border-right: 1px solid #ddd;
   }
  .jyzb td,.jyzb th{
    padding: 10px;
    background: #fff;
    text-align: center;
    box-sizing: border-box;
    word-break: break-all;
  }
  .jyzb td div,.jyzb th div{
    display: inline-block;
    box-sizing: border-box;
    word-break: break-all;
  }
  .blue{
    color: blue;
  }
  .red{
    color:red;
  }
  .jyzb button{
    border: none!important;
  }
  >>>.zb-edit .el-form-item__content{
    width: 70%!important;
  }
  .zb-edit-footer{
    text-align: center;
  }
  .transparent{
    visibility: hidden;
  }
  .td-150{
    width: 150px!important;
    box-sizing: border-box;
  }
  .td-100{
    width: 100px!important;
    box-sizing: border-box;
  }
  .td-200{
     width: 200px!important;
     box-sizing: border-box;
   }
  .td-250{
    width: 250px!important;
    box-sizing: border-box;
  }
</style>

