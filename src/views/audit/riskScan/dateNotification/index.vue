<template>
  <div class="page-container">
    <div class="filter-container">
      <el-row>
        <el-form :inline="true"
                 :model="formInline"
                 class="demo-form-inline">
          <el-form-item label="专题:">
            <el-select v-model="value"
                       placeholder="请选择专题"
                       @change="ChooseThetype">
              <el-option v-for="item in options"
                         :key="item.index"
                         :label="item.typename"
                         :value="item.type">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="审计月份:">
            <el-date-picker v-model="value2"
                            type="month"
                            value-format="yyyyMM"
                            placeholder="选择月"
                            @change="changesj">
            </el-date-picker>
          </el-form-item>

        </el-form>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div>
            <el-radio-group v-model="radio2"
                            size="medium"
                            @change="changemx">
              <el-radio-button :label="item"
                               size="medium"
                               v-for="item in tablelist"
                               :key="item.tab">
                <el-tooltip class="item"
                            effect="dark"
                            :content="item.tabName"
                            placement="top-start">
                  <span>{{ item.tabName }}</span>
                </el-tooltip>
              </el-radio-button>
            </el-radio-group>
          </div>
        </el-col>
      </el-row>

      <div width="100%"
           height="1000px">
        <iframe :src="formdates"
                frameborder="0"
                width="100%"
                height="1000px"></iframe>
      </div>

    </div>
  </div>
</template>

<script>
import {
  getTabList,
  getTypes,
  getSignature,
  getdataAuditApi,
} from "@SDMOBILE/api/risk/personage";
export default {
  name: "personalRiskScan",

  data () {
    return {
      formInline: {},
      options: [],
      value2: "",
      radio2: {},

      activeName: "",
      tablelist: [
        // { tabName: '已支付铁塔服务费但未起租' },
        // { tabName: '为不真实站点结算铁塔服务费哈' },
        // { tabName: "起租表中塔类产品类型、机房类型、生命状态与实际不一致" },
        // { tabName: '同一站点重复支付场地费哈' },
        // { tabName: '同一站点重复结算铁塔服务费、铁塔代维费' },
        // { tabName: '同站点按次工单结算类型与包年规模不一致，多支付代维费' },

      ],
      value: "",

      formdates: "",
    };
  },

  created () {

    let arr = {
      '/personal': 1,
      '/enterprise': 2,
      '/dateenterprise': 3,
      '/datenetwork': 4,
      '/dateFinance': 5,
      '/dataindividual': 21,
      '/datagovernment': 22,
      '/continuousprocurement': 23,
      '/dataauditnetwork': 24,
      '/dateenterprisefinance': 25
    }


    this.code = arr[this.$route.path]

  },

  mounted () {
    this.gettapylist();

  },

  methods: {
    changemx (val) {
      this.formdates =
        val.excuteUrl + "&tab=" + val.tab + "&month=" + this.value2;
      console.log(this.formdates);
      console.log(this.value);
    },
    changesj (val) {
      this.formdates =
        this.radio2.excuteUrl + "&tab=" + this.radio2.tab + "&month=" + val;
    },
    // 获取二级分类
    gettapylist () {
      let p = this.$store.state.user.datauserid
      getSignature(p).then((result) => {
        if (result.code == 0 && result.data.url !== null) {
          getdataAuditApi(result.data.token).then((res) => {

            if (res.status == 'success') {
              getTypes(`area=${this.code}`).then((rem) => {
                this.options = rem.data;
                this.value = rem.data[0].type;
                this.gettablelist(this.value);
                console.log("获取外面之前的接口", rem);
              });

            }
          });


        }
      }).catch(err => {
        let rem = getTypes(`area=${this.code}`);
        this.options = rem.data;
        this.value = rem.data[0].type;
        this.gettablelist(this.value);
      });
    },

    gettime () {
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth();
      let value = year + "" + month;
      this.value2 = year + "" + month;
      this.changesj(value);
    },
    // 获取模型列表
    async gettablelist () {
      console.log('执行了gettablelist');
      try {
        let res = await getTabList(`type=${this.value}`);
        this.tablelist = res.data;
        this.radio2 = res.data[0];
        if (res.code == 0) {
          this.gettime();
        }
      } catch (error) {
        console.log(error);
      }
    },
    ChooseThetype () {
      this.gettablelist();
    },
  }
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
.el-radio-button {
  width: 180px;
  margin-top: 16px;
  margin-left: 2px;
}

.el-radio-button ::v-deep .el-radio-button__inner {
  font-size: 12px;
  width: 180px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  border: 1px solid #dcdfe6;
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
  box-shadow: none !important  ;
}
.el-radio-button::v-deep .el-radio-button__inner {
  padding: 10px 15px;
}
</style>