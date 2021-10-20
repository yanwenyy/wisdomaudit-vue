<template>
  <div>
   
        <el-row type="flex" :gutter="20">
     <div>
       <el-col :span="6"> <div class="kuan">资料名称:</div> <el-input v-model="name" placeholder="请输入关键字"></el-input></el-col>
        <el-col :span="6"> <div  class="kuan">发文时间:</div>  <el-date-picker
      v-model="value1"
      type="date"
      placeholder="选择日期">
    </el-date-picker></el-col>
     <el-col :span="6">  <div  class="kuan">发文部门:</div> <el-input  v-model="input" placeholder="请输入关键字"></el-input></el-col>
     <el-col :span="3">  <el-button type="primary">查询</el-button></el-col>
    </div>
    </el-row>
    <auditbasis></auditbasis>
   
  </div>
</template>

<script>
import auditbasis from '@WISDOMAUDIT/components/workbench/auditbasis/index'
export default {
    components:{
        auditbasis
    },
    data(){
        return{
            input:'',
            name:''
        }
    }
};
</script>

<style  scoped>
.el-col{
    display: flex;
    align-items: center;
}
.kuan{
    width: 50%;
}
.el-row{
      padding: 10px 0 0 1%;
}
</style>>
