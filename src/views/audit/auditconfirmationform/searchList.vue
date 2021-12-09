<template>
  <div>
    <el-dialog
      center
      width="80%"
      title="问题列表"
      :visible.sync="visible"
      :append-to-body="true">
      <div class="relation-div">
        <div class="relation-div-search search-form">
          <el-form :inline="true" :model="searchform" @keyup.enter.native="init(id)" class="queryForm">
            <el-form-item class="searchBtn">
              <el-input v-model="searchform.problem" placeholder="问题名称" clearable>
                <el-button slot="append" icon="el-icon-search" @click="init(id)"></el-button>
              </el-input>
            </el-form-item>
          </el-form>
        </div>
        <el-table
          :header-cell-style="{'text-align': 'center','background-color': '#F4FAFF',}"
          ref="multipleTable"
          :data="relationTabel"
          class="relationTabelClass"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="relationTabelSel">
          <el-table-column type="selection" align="center" />
          <el-table-column
            align="center"
            type="index"
            label="序号">
          </el-table-column>
          <el-table-column
            align="center"
            prop="field"
            label="领域"
            width="180">
          </el-table-column>
          <el-table-column
            align="center"
            prop="problem"
            label="问题"
            width="180">
          </el-table-column>
          <el-table-column
            align="center"
            prop="basis"
            width="180"
            :show-overflow-tooltip="true"
            label="依据">
          </el-table-column>
          <el-table-column
            align="center"
            prop="describe"
            width="200"
            :show-overflow-tooltip="true"
            label="描述">
          </el-table-column>
          <el-table-column
            align="center"
            prop="problemDiscoveryTime"
            width="150"
            label="发现日期">
            <template slot-scope="scope">{{
              scope.row.problemDiscoveryTime | dateformat
              }}</template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="riskAmount"
            width="150"
            label="风险金额(万元)">
            <template slot-scope="scope">
              {{ parseFloat(scope.row.riskAmount) }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="managementAdvice"
            width="150"
            :show-overflow-tooltip="true"
            label="管理建议">
          </el-table-column>
          <el-table-column
            align="center"
            prop="problemFindPeople"
            width="150"
            label="发现人">
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="visible=false">取消</el-button>
        <el-button  type="primary" @click="setRelation">生成</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
  import { task_pageList_wt} from
      '@SDMOBILE/api/shandong/AuditReport'
  export default {
    name: "search-list",
    data() {
      return {
        id:'',
        relationTabel:[],
        multipleSelection:[],
        visible: false,
        dialogFormVisible:true,
        temp:{},
        dataList: [],
        searchform:{
          problem:''
        },//关联问题搜索
        page: {
          current: 1,
          size: 10,
          total: 0
        },
      }
    },
    methods: {
      // 初始化
      init(id) {
       if(id){
         this.id=id;
       }
        var params={
          condition:{
            managementProjectUuid:id,
            problem:this.searchform.problem
          }
        };
        task_pageList_wt(params).then(resp => {

          var datas=resp.data;
          this.relationTabel=datas.records;
          this.visible = true;
        })
      },
      //关联问题多选的时候
      relationTabelSel(row){
        this.multipleSelection =row
      },
      //生成关联问题
      setRelation(){
        if(this.multipleSelection.length>0){
          var str='',problemListUuidList=[];
          this.multipleSelection.forEach((item,index)=>{
            str+=index+"."+item.problem+'\n'+item.describe+'\n';
            problemListUuidList.push(item.problemListUuid)
          });
         var data={str:str,problemListUuidList:problemListUuidList,multipleSelection:this.multipleSelection};
          this.$emit('refreshSearch',data)
        }
        this.visible = false;
      },
      //分页点击
      handleSizeChange(val) {
        this.searchForm.pageSize = val;
        this.getData();
      },
      handleCurrentChange(val) {
        this.searchForm.pageNo = val;
        this.getData();
      },
    }
  }
</script>
<style scoped>
  >>>.zb-form .el-form-item{
    margin-bottom: 10px!important;
  }
  >>>.zb-form .el-form-item__content{
    width: 30%;
    display: inline-block;
  }
  >>>.zb-form .el-form-item__label{
    width: 20%!important;
    text-align: right!important;
    display: inline-block;
  }
  .relation-div-footer{
    margin-top: 10px;
    text-align: center;
  }
  >>>.relation-div-footer button{
    margin-left: 10px;
  }
  .relation-div{
    width: 100%;
    padding: 10px;
    margin-top: 10px;
  }
  >>>.relationTabelClass label{
    width: auto!important;
  }
  >>>.relation-div-search .el-form-item__content{
    position: static!important;
  }
  .relation-div-search{
    text-align: right;
    clear: both;
  }
  .searchBtn button{
    background: #0089D6!important;
    color:#fff;
  }

</style>
