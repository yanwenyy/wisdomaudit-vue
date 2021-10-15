<template>
  <div>
   
        <el-row type="flex" :gutter="20">
     <div>
       <el-col :span="6"> <div class="kuan">文件名称:</div> <el-input v-model="name" placeholder="请输入文件名称"></el-input></el-col>
     <el-col :span="6">  <div  class="kuan">内容:</div> <el-input  v-model="input" placeholder="请输入内容"></el-input></el-col>

        <el-col :span="6"> <div  class="kuan">发文时间:</div>  <el-date-picker
      v-model="value1"
      type="date"
      placeholder="选择日期">
    </el-date-picker></el-col>
     <el-col :span="3">  <el-button type="primary">查询</el-button></el-col>
    </div>
    </el-row>
    <cases></cases>
   
  </div>
</template>

<script>
import cases from '@/components/workbench/cases/index'
export default {
    components:{
        cases
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
