<template>
  <div class="page-container">
    <div class="filter-container">
      <el-row>
        <el-col :span='3'>
          <el-select v-model="value" placeholder="请选择" @change='ChooseThetype'>
            <el-option
              v-for="item in options"
              :key="item.index"
              :label="item.typename"
              :value="item.type"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span='3'>
          <el-date-picker
      v-model="value2"
      type="month"
      value-format='yyyyMM'
      placeholder="选择月"
      @change="changesj"
      >
    </el-date-picker>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="20">
          <div style="margin-top: 20px">
            <el-radio-group v-model="radio2" size="medium" @change="changemx">
              <el-radio-button :label="item"  size="medium" v-for=" item in tablelist" :key="item.tab">{{item.tabName}}</el-radio-button>

            </el-radio-group>
          </div>
        </el-col>
        <el-col :span="4" style="text-align: right">
          <div style="margin-top: 20px">
            <span
              style="
                display: inline-block;
                height: 36px;
                vertical-align: middle;
                line-height: 36px;
              "
              >更多</span
            >
          </div>
        </el-col>
      </el-row>

  <el-row >
      <el-col :span="20">
      <frameset cols="87%,*" rows="*" frameborder="NO" border="0" framespacing="0" onload="load()">
    <frame id="linkHtml" :src='formdates'  />
</frameset>
      </el-col>
  </el-row>
    </div>
  </div>
</template>

<script>
import { getTabList ,getTypes } from '@SDMOBILE/api/risk/personage'
export default {
  name: "personalRiskScan",

  data() {
    return {
      options: [
        {
          type: "1",
          typename: "员工违规",
        },
        {
          type: "2",
          typename: "员工违规",
        },

      ],
 value2: "202010",
      radio2:  {
        tab:1,
        tabName:'员工违规消户余额',
        excuteUrl:'http://10.8.17.4:8080/webroot/decision/view/form?viewlet=Form17.frm',
        modifytime:''

      },

      activeName: "first",
    tablelist:[
      {
        tab:1,
        tabName:'员工违规消户余额',
        excuteUrl:'http://10.8.17.4:8080/webroot/decision/view/form?viewlet=Form17.frm',
        modifytime:''

      },
      {
        tab:2,
        tabName:'员工违规消户余额',
        excuteUrl:'http://10.8.17.4:8080/webroot/decision/view/form?viewlet=Form17.frm',
        modifytime:''

      }
    ],
    value:'',


      formdates:'http://10.8.17.4:8080/webroot/decision/view/form?viewlet=Form17.frm&tab=1&month=202010'
    };
  },
  created() {
    this.gettapylist()


  },
  mounted() {

  },
  methods: {
    changemx(val){

    this.formdates=val.excuteUrl+'&tab='+val.tab+'&month='+this.value2;
    console.log(this.formdates);
    console.log(this.value);
    },
    changesj(){
  this.formdates=this.radio2.excuteUrl+'&tab='+this.radio2.tab+'&month='+this.value2;
  console.log(this.formdates);




    },
// 获取二级分类
      async gettapylist(){

        let res = await getTypes('area=1');
        this.options= res.data
        this.value= res.data[0].type
        this.gettablelist(this.value)

    },
// 获取模型列表
    async gettablelist(){

        let res = await getTabList(`type=${this.value}`);
        this.tablelist=res.data
        this.radio2= res.data[0]



    },
     ChooseThetype(){
       this.gettablelist()

    },

  },
};
</script>

<style lang="scss" scoped>
.item-wapper {
  border-radius: 10px;
  margin-top: 20px;
  position: relative;

  padding: 10px;

  box-shadow: 1px 1px 10px#aaa;

  .month-position {
    position: absolute;
    right: 10px;

    z-index: 9;
  }
}
</style>

