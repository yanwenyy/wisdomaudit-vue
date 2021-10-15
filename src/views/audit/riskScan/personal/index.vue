<template>
  <div class="page-container">
    <div class="filter-container">
      <el-row>
        <el-col>
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="20">
          <div style="margin-top: 20px">
            <el-radio-group v-model="radio2" size="medium">
              <el-radio-button label="未邀请"></el-radio-button>
              <el-radio-button label="使用多卡"></el-radio-button>
              <el-radio-button label="再开卡"></el-radio-button>
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

      <el-row :gutter="20">
        <el-col :span="14">
          <div class="item-wapper">
            <img src="@/assets/personal/echart-bar.jpg" />
          </div>
        </el-col>
        <el-col :span="10">
          <div class="item-wapper">
            <img src="@/assets/personal/echart-map.jpg" />
          </div>
        </el-col>
      </el-row>

      <div class="item-wapper">
        <div class="month-position">
          <el-date-picker
            v-model="value2"
            format="yyyy-MM"
            type="month"
            placeholder="选择月"
          >
          </el-date-picker>
        </div>

        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="报表" name="first">
            <el-table :data="tableData" style="width: 100%" border>
              <el-table-column
                v-for="(item, index) in citys"
                :key="item.value"
                :property="item.value"
                :label="item.label"
              >
              </el-table-column> </el-table
          ></el-tab-pane>
          <el-tab-pane label="报表明细" name="second">
            <el-table :data="tableData" style="width: 100%" border>
              <el-table-column
                v-for="(item, index) in citys"
                :key="item.value"
                :property="item.value"
                :label="item.label"
              >
              </el-table-column> </el-table
          ></el-tab-pane>
        </el-tabs>
      </div>

      <el-row :gutter="20">
        <el-col :span="12">
          <div class="item-wapper">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>业务规则</span>
              </div>
              <div style="height: 50px">
                结合欠费表和用户信息表，筛选未缴清历史欠费，使用同身份证成功在开卡的记录
              </div>
            </el-card>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="item-wapper">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>逻辑说明</span>
              </div>
              <div style="height: 50px">
                根据用户欠费的欠费号码的身份证证件号码、开始欠费月份，筛选全量用户信息表中同证件且创建时间晚于欠费月份3个月的记录
              </div>
            </el-card>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: "personalRiskScan",

  data() {
    return {
      options: [
        {
          value: "欠费",
          label: "欠费",
        },
      ],
      value: "欠费",

      radio2: "未邀请",

      activeName: "first",

      citys: [
        { value: "weihai", label: "威海市" },
        { value: "weihai", label: "烟台市" },
        { value: "weihai", label: "青岛市" },
        { value: "weihai", label: "潍坊市" },

        { value: "weihai", label: "日照市" },
        { value: "weihai", label: "临沂市" },
        { value: "weihai", label: "枣庄市" },
        { value: "weihai", label: "济宁市" },

        { value: "weihai", label: "菏泽市" },
        { value: "weihai", label: "泰安市" },
        { value: "weihai", label: "济南市" },
        { value: "weihai", label: "淄博市" },

        { value: "weihai", label: "德州市" },
        { value: "weihai", label: "滨州市" },
        { value: "weihai", label: "东营市" },
      ],

      tableData: [
        {
          weihai: "0",
        },
      ],

      value2: "2021-04",
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
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

