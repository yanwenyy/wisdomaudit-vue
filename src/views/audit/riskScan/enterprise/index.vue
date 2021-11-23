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
import { getTabList ,getTypes ,getSignature, getdataAuditApi} from '@SDMOBILE/api/risk/personage'
import { mapGetters } from 'vuex'
export default {
  name: "personalRiskScan",

  data() {
    return {
      options: [


      ],
      value2: "",
      radio2:  {


      },

      activeName: "",
      tablelist:[

      ],
      value:'',


      formdates:''
    };
  },
  created() {
    this.gettapylist()

  },
  computed: {
    ...mapGetters([
      'name',

    ])
  },
  mounted() {




  },
  methods: {
    changemx(val){

      this.formdates=val.excuteUrl+'&tab='+val.tab+'&month='+this.value2;
      console.log(this.formdates);
      console.log(this.value);
    },
    changesj(val){

      this.formdates=this.radio2.excuteUrl+'&tab='+this.radio2.tab+'&month='+val;





    },
// 获取二级分类
    async gettapylist(){
      try {


        let p = sessionStorage.getItem("store");
        let q= JSON.parse(p).user.datauserid;
        let result =  await getSignature(q)
        if(result.status == 0 && result.data.url!=null){

          let req = await getdataAuditApi(result.data.token)

          if(req.status == 0){
            let rem = await getTypes('area=2');
            this.options= rem.data
            this.value= rem.data[0].type
            this.gettablelist(this.value)

          }


        }else {
          let rem = await getTypes('area=2');
          this.options= rem.data
          this.value= rem.data[0].type
          this.gettablelist(this.value)

        }




      } catch (error) {
        console.log(error);

      }




    },

    gettime(){
      let date = new Date
      let year = date.getFullYear()
      let month = date.getMonth()-1
      let value= year+ ''+month
      this.value2=year+ '0'+ month
      this.changesj(value)


    },
// 获取模型列表
    async gettablelist(){

      try {
        let res = await getTabList(`type=${this.value}`);
        this.tablelist=res.data
        this.radio2= res.data[0]
        if (res.code == 0) {
          this.gettime()

        }


      } catch (error) {
        console.log(error);

      }



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

