<template>
  <div class="sjzl">
    <!-- tab 切换 -->

    <el-tabs v-model="activeName"
             @tab-click="handleClick">
     

        <div class="projectTab">
         
<el-row class="titleMes">
            <el-col :span="1.5" class="add">
              <el-button type="primary" >提交反馈</el-button>
            </el-col>

           
          </el-row>
         <el-row class="titleMes" type="flex"  justify="end">
            <el-col :span="1.5">
          
              <el-button type="primary" @click="Import" class="daoru">导入
                <input id="upload" type="file" style="filter:alpha(opacity=0);opacity:0;width: 0;height: 0;" @change="importfxx(this)"  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
              </el-button>
            </el-col>
          </el-row>
          <el-table :data="tableData"
                    style="width: 100%;"
                    stripe
                    @select='Selects'>
            <el-table-column
               type="selection"
               width="55">
            </el-table-column>
            <el-table-column prop="date"
                             label="指标类型">
            </el-table-column>
            <el-table-column prop="name"
                             label="指标名称">
            </el-table-column>
            <el-table-column prop="province"
                             label="单位">
            </el-table-column>
            <el-table-column prop="city"
                             label="提供资料部门">
            </el-table-column>
            <el-table-column prop="address"
                             label="取数口径或公式">
            </el-table-column>
              <el-table-column prop="zip"
                             label="指标值(2016)">

                              <template slot-scope="scope">
                              <span v-if="scope.row.zip!=='-'"> {{scope.row.zip}}</span> 
                              <el-input v-else v-model="input[scope.$index]" placeholder="请输入内容"></el-input>

            </template>
            </el-table-column>
                          <el-table-column prop="zip"
                             label="指标值(2017)">

                              <template slot-scope="scope">
                              <span v-if="scope.row.zip!=='-'"> {{scope.row.zip}}</span> 
                              <el-input v-else v-model="input1[scope.$index]" placeholder="请输入内容"></el-input>

            </template>
            </el-table-column>
                          <el-table-column prop="zip"
                             label="指标值(2018)">

                              <template slot-scope="scope">
                              <span v-if="scope.row.zip!=='-'"> {{scope.row.zip}}</span> 
                              <el-input v-else v-model="input2[scope.$index]" placeholder="请输入内容"></el-input>

            </template>
            </el-table-column>
              <el-table-column prop="state"
                             label="状态">
            </el-table-column>
          </el-table>
        </div>
        <!-- 分页 -->
        <div class="page">
          <el-pagination background
                         layout="prev, pager, next"
                         :total="1000">
          </el-pagination>
        </div>
        <!-- 分页 end-->
     
     

      
    </el-tabs>

  </div>
</template>

<script>
export default {
  components: {},
  data () {
    return {
      input:[],
      input1:[],
      input2:[],
      btn:false,
      activeName: 0,
      // color: '',   // 上传文件icon 颜色
      toExamineIndex:[],
      toExamineData:[],
      tableData: [{
        index:'1',
        date: '资产、捐赠及收入结构指标',
        name: '经营业绩考核得分',
        province: '分',
        city: '财务部',
        address: '省公司下达当年度经营业绩效考核得分',
        zip: '34%',
        state:'-'
      }, {
        index:'2',
        date: '资产、捐赠及收入结构指标',
        name: '经营业绩考核得分',
        province: '分',
        city: '财务部',
        address: '省公司下达当年度经营业绩效考核得分',
        zip: '-',
        state:'-'
      },{
        index:'3',
        date: '资产、捐赠及收入结构指标',
        name: '经营业绩考核得分',
        province: '分',
        city: '财务部',
        address: '省公司下达当年度经营业绩效考核得分',
        zip: '-',
        state:'已下发'
      },{
        index:'4',
        date: '资产、捐赠及收入结构指标',
        name: '经营业绩考核得分',
        province: '分',
        city: '财务部',
        address: '省公司下达当年度经营业绩效考核得分',
        zip: '-',
        state:'-'
      },{
        index:'5',
        date: '资产、捐赠及收入结构指标',
        name: '经营业绩考核得分',
        province: '分',
        city: '财务部',
        address: '省公司下达当年度经营业绩效考核得分',
        zip: '-',
        state:'-'
      },{
        index:'6',
        date: '资产、捐赠及收入结构指标',
        name: '经营业绩考核得分',
        province: '分',
        city: '财务部',
        address: '省公司下达当年度经营业绩效考核得分',
        zip: '-',
        state:'-'
      },{
        index:'7',
        date: '资产、捐赠及收入结构指标',
        name: '经营业绩考核得分',
        province: '分',
        city: '财务部',
        address: '省公司下达当年度经营业绩效考核得分',
        zip: '-',
        state:'-'
      },{
        index:'8',
        date: '资产、捐赠及收入结构指标',
        name: '经营业绩考核得分',
        province: '分',
        city: '财务部',
        address: '省公司下达当年度经营业绩效考核得分',
        zip: '34%',
        state:'-'
      },{
        index:'9',
        date: '资产、捐赠及收入结构指标',
        name: '经营业绩考核得分',
        province: '分',
        city: '财务部',
        address: '省公司下达当年度经营业绩效考核得分',
        zip: '34%',
        state:'-'
      },{
        index:'10',
        date: '资产、捐赠及收入结构指标',
        name: '经营业绩考核得分',
        province: '分',
        city: '财务部',
        address: '省公司下达当年度经营业绩效考核得分',
        zip: '34%',
        state:'-'
      },]
    }
  },
  computed: {},
  watch: {},
  methods: {
    Import(){
document.getElementById("upload").click(); 
    },
    toExamine(){
      for(let i=0;i<this.toExamineData.length;i++){
        this.tableData[this.toExamineData[i].index-1].state='反馈中'
        // console.log(this.tableData[this.toExamineData[i].index-1],9999999);
      }
      
    },
    Issue(){
       for(let i=0;i<this.toExamineData.length;i++){
        this.tableData[this.toExamineData[i].index-1].state='已下发'
        // console.log(this.tableData[this.toExamineData[i].index-1],9999999);
      }
    },
  Selects(selection, row){
     if(selection.length==0){
      this.btn=false
    }
    if(selection.length!=0){
      this.btn=true

    }
   this.toExamineData=selection
   
    
  },
    handleClick (tab, event) {
      console.log(tab, event);
    },

    deleteRow (index, rows) {
      rows.splice(index, 1);
    }
  },
  created () {

  },
  mounted () {

  },
}
</script>

<style scoped>

.el-tabs{
  padding: 1%;
}
.btn{
  background: #ccc !important;
  color: black !important;
}
.sjzl .conter {
  width: 100%;
  float: left;
}
.tab_ul {
  width: 100%;
  float: left;
  height: 50px;

  border-bottom: 2px solid #eeeeee;
}
/* 内容  按钮 */
.titleMes {
  padding: 10px 0 0;
  box-sizing: border-box;
}
.table {
}
.sjzl >>> .el-table__header {
  border-top: none !important;
}
.update {
  display: flex;
  align-items: center;
  justify-content: center;
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
.page {
  width: 100%;
  padding: 20px 10px;
  display: flex;
  justify-content: flex-end;
}
</style>
