<template>
  <el-dialog title="整改事项明细"
             v-on="$listeners"
             v-bind="$attrs"
             center
             :append-to-body='true'
             width="50%">
    <el-form class="feedbackDialog"
             ref="form"
             :model="form"
             :inline="true"
             label-width="230px">
      <el-row>
        <el-form-item label="问题:"
                      style="width: 100%">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="问题描述:">
          <el-input type="textarea"
                    v-model="form.name"></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="整改建议:">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="整改时限:"
                        class="otherInput">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="整改责任部门及联系人:"
                        class="otherInput">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
        </el-col>

      </el-row>
      <el-row>
        <el-form-item label="整改计划:">
          <el-input type="textarea"
                    v-model="form.name"></el-input>

        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="整改落实情况:">
          <el-input type="textarea"
                    v-model="form.name"></el-input>

        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="支撑资料列表:">
          <el-row style="margin-top: 20px">
            <el-col :span="12">
              <el-form-item label-width="100"
                            label="制度化流程优化:"
                            class="otherInput">
                <el-input style="width: 100px"
                          v-model="form.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-button icon="el-icon-upload2"
                         type="primary">上传</el-button>
            </el-col>
          </el-row>
          <el-row style="margin-top: 20px">
            <el-col :span="12">
              <el-form-item label-width="100px"
                            label="其他措施:"
                            class="otherInput">
                <el-input style="width: 100px"
                          v-model="form.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-button icon="el-icon-upload2"
                         type="primary">上传</el-button>
            </el-col>
          </el-row>
          <el-row style="margin-top: 20px">
            <el-col :span="12">
              <el-form-item label-width="100px"
                            label="系统升级改造:"
                            class="otherInput">
                <el-input style="width: 100px"
                          v-model="form.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-button icon="el-icon-upload2"
                         type="primary">上传</el-button>
            </el-col>
          </el-row>

        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="未完成整改原因及预计完成整改时间:">
          <el-row style="margin-top: 20px">
            <el-col :span="12">
              <el-form-item label-width="120px"
                            label="未完成整改原因:"
                            class="otherInput">
                <el-input style="width: 100px"
                          v-model="form.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label-width="120px"
                            label="预计完成整改日期:"
                            class="otherInput">
                <el-input style="width: 100px"
                          v-model="form.name"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="备注">
          <el-input type="textarea"
                    v-model="form.name"></el-input>
        </el-form-item>
      </el-row>
    </el-form>
    <div slot="footer"
         class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary"
                 @click="close">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'feedBack-dialog',
  data () {
    return {
      form: {}
    }
  },
  methods: {
    close () {
      this.$emit('closeDialog', false)
    }
  }
}
</script>

<style lang="scss">
.feedbackDialog {
  .el-form-item {
    width: 100%;
    .el-form-item__content {
      width: 70%;
    }
  }

  .otherInput {
    .el-form-item__content {
      width: 40%;
    }
  }
}
</style>
