<template>
  <div class="add-history-popover">
    <el-form ref="form" :model="form">
      <el-row>
        <el-col :span="11">
          <el-form-item label="领域：">
            <el-select v-model="form.domain" placeholder="请选择领域">
              <el-option v-for="item in domains" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="2">
          <el-form-item label="问题：">
            <el-input v-model="form.problem" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="依据：" class="form-item-gist">
            <el-button class="gist-btn" @click="quoteBtn">引用知识库</el-button>
            <el-input type="textarea" v-model="form.gist" placeholder="请输入" :autosize="{ minRows: 3, maxRows: 3}">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="2">
          <el-form-item label="描述：" class="form-item-describe">
            <el-input type="textarea" v-model="form.describe" placeholder="请输入" :autosize="{ minRows: 3, maxRows: 3}">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="发现人：">
            <el-input v-model="form.discoverer" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="2">
          <el-form-item label="涉及金额(万元)：">
            <el-input v-model="form.money" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="发现时间：">
            <el-select v-model="form.time" placeholder="请选择发现时间">
              <el-option v-for="item in times" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6" :offset="2">
          <el-form-item label="关联项目：">
            <el-select v-model="form.item" placeholder="请选择关联项目">
              <el-option v-for="item in items" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6" :offset="2">
          <el-form-item label="上传附件：">
            <el-upload :show-file-list="false">
              <el-button type="primary">附件上传</el-button>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      form: {
        domain: 1,
        problem: "",
        gist: "",
        describe: "",
        discoverer: "",
        money: "",
        time: 1,
        item: 1,
      },
      domains: [
        {
          value: 1,
          label: "个人",
        },
        {
          value: 2,
          label: "财务",
        },
        {
          value: 3,
          label: "网络",
        },
        {
          value: 3,
          label: "政企",
        },
      ],
      times: [
        {
          value: 1,
          label: 2021,
        },
        {
          value: 2,
          label: 2020,
        },
        {
          value: 3,
          label: 2019,
        },
      ],
      items: [
        {
          value: 1,
          label: "模型1",
        },
        {
          value: 2,
          label: "模型2",
        },
        {
          value: 3,
          label: "自建任务1",
        },
        {
          value: 4,
          label: "自建任务2",
        },
      ],
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    // 引用知识库
    quoteBtn() {
      this.form.gist = "依据xxx";
    },
  },
};
</script>

<style lang="scss" scoped>
.add-history-popover {
  color: #383839;
  .el-form-item {
    margin-top: 10px;
  }
  .form-item-gist {
    position: relative;
    margin-top: 20px;
    .gist-btn {
      border: 1px solid #dcdfe6;
      position: absolute;
      z-index: 1;
      top: -43px;
      left: 45px;
      font-weight: normal;
    }
  }
  .form-item-describe {
    margin-top: 20px;
  }
}
.add-history-popover .form-item-gist ::v-deep .el-form-item__content,
.add-history-popover .form-item-describe ::v-deep .el-form-item__content {
  margin-top: 8px;
}
.add-history-popover ::v-deep .el-form-item__label {
  font-size: 14px;
  color: #383839;
  font-weight: normal;
}
</style>
