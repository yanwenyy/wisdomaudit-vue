<template>
  <div class="new-user-management-g-wrapper">
    <!-- 面包屑导航 -->
    <el-form
        ref="newUserManagementForm"
        :model="form"
        :rules="rules"
        label-position="right"
        label-width="108px"
        class="auditInfoForm"
    >
      <el-form-item class="u-margin-top-20" label-width="108px" label="用户账号：" prop="userAccout">
        <el-input
            minlength="6"
            maxlength="50"
            class="m-input-normal"
            placeholder="请输入"
            v-model.trim="form.userAccout"
        ></el-input>
        <!-- 防止浏览器自动填充用户名 -->
        <input type="text" style="position:fixed;bottom:-9999px;"/>
      </el-form-item>
      <el-form-item class="u-margin-top-20" label-width="108px" label="真实姓名：" prop="realName">
        <el-input
            minlength="2"
            maxlength="50"
            class="m-input-normal"
            placeholder="请输入"
            v-model="form.realName"
        ></el-input>
      </el-form-item>
      <el-form-item class="u-margin-top-20" label-width="108px" label="手机号：" prop="mobile">
        <el-input maxlength="11" class="m-input-normal" placeholder="请输入" v-model="form.mobile"></el-input>
      </el-form-item>
      <el-form-item class="u-margin-top-20" label-width="108px" label="邮箱：" prop="email">
        <el-input class="m-input-normal" placeholder="请输入" v-model="form.email"></el-input>
      </el-form-item>
      <el-form-item class="u-margin-top-20" label-width="108px" label="角色名称：" prop="roleName">
        <el-select v-model="form.roleName" class="m-select-normal" multiple placeholder="请选择" @change='getRoleName'>
          <el-option
              v-for="item in roleNameList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="u-margin-top-20" label-width="108px" label="OA账号" prop="oaId">
        <el-input maxlength="100" class="m-input-normal" placeholder="请输入" v-model="form.oaId"></el-input>
      </el-form-item>
      <el-form-item class="u-margin-top-20" label-width="108px" label="所属组织：">
        <el-col :span="10" style="margin-right:20px;">
          <el-form-item prop="areaCode">
            <!-- <com-single-select
              ref="areaSelect"
              class="m-select-normal g-search-select"
              :options="areaList"
              label="orgName"
              keyValue="id"
              v-model="form.areaCode"
              @change="areaCodeChange"
            /> -->
            <el-cascader
                ref="user"
                :options="areaList"
                :props="props"
                @change='getUserId'
            ></el-cascader>
          </el-form-item>


        </el-col>
        <!-- <el-col :span="10" :offset="1">
          <el-form-item prop="countyCode">
            <com-single-select
              ref="countySelect"
              class="m-select-normal g-search-select u-margin-left-20"
              :options="countyList"
              label="orgName"
              keyValue="id"
              v-model="form.countyCode"
            />
          </el-form-item>
        </el-col> -->
      </el-form-item>
      <el-form-item label-width="108px">
        <el-row class="g-footer">
          <el-button class="m-button-normal u-margin-left-20" @click="cancle()">取消</el-button>
          <el-button class="m-button-normal" @click="submit">确定</el-button>
        </el-row>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {getUserTree, searchRole, addUser} from '../../../../api/user'

/**
 * @name: newUserManagement.vue
 * @description: 用户管理新建
 * @author: Shan Youjing(mail)
 * @update: 2019-01-18
 */
// 通用组件引入


export default {
  name: 'newUserManagement',
  data() {
    // 用户名校验
    const validChineseName = (rule, value, callback) => {
      // let reg = /^[\u0391-\uFFE5A-Za-z]+[\u0391-\uFFE5A-Za-z1-9]{2}$/
      let reg = /^[\u0391-\uFFE5A-Za-z]+[1-9]*$/
      if (reg.test(value)) {
        callback()
      } else {
        return callback(
            new Error('姓名只能包含中英文,最后可以是数字，如张三，张三1')
        )
      }
    }
    // 手机号码校验
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号不能为空'))
      } else {
        const reg = /^1[3|4|5|7|8｜9][0-9]\d{8}$/
        if (reg.test(value)) {
          callback()
        } else {
          return callback(new Error('请输入正确的手机号'))
        }
      }
    }
    // 密码校验
    var validateNewPassword = (rule, value, callback) => {
      let reg = /^.*(?=.{8,50})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*?]).*$/
      if (reg.test(value)) {
        callback()
      } else {
        return callback(
            new Error(
                '密码应为8-50个大小写字母、数字和特殊字符的组合，特殊字符范围：!@#$%^&*'
            )
        )
      }
    }
    var validateConfirmPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      props: {children: 'childList', label: 'orgName', value: 'id', checkStrictly: true},
      form: {
        userAccout: '',
        password: '',
        confirmPassword: '',
        email: '',
        mobile: '',
        realName: '',
        roleId: '',
        oaId: '',
        areaCode: '',
        countyCode: '',
        roleName: ''
      },
      roleNameList: [],
      areaList: [],
      countyList: [],
      rules: {
        userAccout: [
          {
            required: true,
            message: '请输入用户账号名称',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 50,
            message: '最短2个字符，最长50个字符',
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            required: true,
            validator: checkPhone,
            trigger: 'blur'
          }
        ],
        realName: [
          {
            required: true,
            trigger: 'blur',
            message: '真实姓名不能为空'
          },
          {
            min: 2,
            max: 50,
            message: '真实姓名长度为2~50个字符',
            trigger: 'blur'
          },
          {
            validator: validChineseName,
            trigger: 'blur'
          }
        ],
        roleName: [
          {
            required: true,
            trigger: 'blur',
            message: '角色必选'
          }
        ],
        oaId: [
          {
            max: 100,
            message: '长度不得超过100个字符',
            trigger: 'blur'
          }
        ],
        email: [
          {
            required: true,
            message: '请输入邮箱地址',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 50,
            message: '邮箱长度限制2~50个字符',
            trigger: 'blur'
          },
          {
            type: 'email',
            message: '请输入正确的邮箱格式',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    // this.getRoleListInfo()
    this.getOrgTree()
    this.getRoleList()
  },
  methods: {
    /**
     * 地市下拉框change事件
     */
    // areaCodeChange(val) {
    //   this.areaCode = val
    //   this.countyList = this.areaList.filter(item => {
    //     return item.id === this.areaCode
    //   })[0].childList
    // },
    /**
     *
     * orgTree树查询方法
     */
    getRoleName(val) {
      this.form.roleId = [...val]
      console.log(this.form.roleId)
    },


    getUserId(val) {
      this.form.orgId = val[val.length - 1]
    },
    async getRoleList() {
      let res = await searchRole()
      console.log(res)
      this.roleNameList = res.data.list

    },

    async getOrgTree() {

      let res = await getUserTree()
      console.log(res)
      this.areaList = res.data
      // this.form.countyCode=res.data
      // console.log();
      // this.$http.get(OrgTree).then(
      //   res => {
      //     if (
      //       !res.data ||
      //       res.data.length === 0 ||
      //       !res.data[0].childList ||
      //       res.data[0].childList.length === 0
      //     ) {
      //       return
      //     }
      //     this.areaList = res.data[0].childList
      //     console.log(this.areaList)
      //   },
      //   err => {
      //     console.log('err', err)
      //   }
      // )
    },
    /**
     * 获取角色名称列表
     */
    getRoleListInfo() {
      this.$http
          .get(GetRoleListInfo, {
            pageCurrent: 1,
            pageSize: 100
          })
          .then(res => {
            this.roleNameList = res.data.list
          })
    },
    /**
     * 确定按钮点击事件
     * @param { Object } e 提交点击事件对象
     */
    submit() {
      // let target = e.target
      let _self = this
      _self.$refs.newUserManagementForm.validate(async valid => {
        if (!valid) {
          return
        }
        let data = {
          userName: this.form.userAccout,  //用户账号：
          realName: this.form.realName, //真实姓名
          mobile: this.form.mobile, //手机号：
          email: this.form.email, //邮箱：
          orgId: this.form.orgId, //所属组织：
          oaId: this.form.oaId, //OA账号
          roleId: this.form.roleId//角色名称：
        }

        let res = await addUser(data)
        console.log(res, '添加')
        if (res.status == 0) {
          this.$message({
            message: '添加成功',
            type: 'success'
          })
          _self.$router.go(-1)
        } else {
          this.$message({
            message: '添加失败',
            type: 'warning'
          })
        }
        // let data = {
        //   userName: this.common.encryptAES(_self.form.userAccout),
        //   realName: _self.form.realName,
        //   mobile: _self.form.mobile,
        //   email: _self.form.email,
        //   roleId: _self.form.roleName,
        //   oaId: _self.form.oaId,
        //   orgId: Number(
        //     _self.form.countyCode ? _self.form.countyCode : _self.form.areaCode
        //   )
        // }
        // _self.$http.post(AddUser, data).then(
        //   res => {
        //     _self.$router.go(-1)
        //   },
        //   err => {
        //     console.log('err', err)
        //     this.common.showErrorToast(err.message)
        //   }
        // )
      })
    },
    /**
     * 取消按钮点击事件
     */
    cancle() {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped lang='scss'>
.new-user-management-g-wrapper .g-form {
  margin: 0 auto;
  width: 550px;
  text-align: left;
}

.new-user-management-g-wrapper .g-form .g-form-item {
  width: 500px;
}

.new-user-management-g-wrapper .g-form .line {
  text-align: center;
}

.new-user-management-g-wrapper .g-form .el-date-editor.el-input,
.new-user-management-g-wrapper .g-form .el-date-editor.el-input__inner {
  width: auto;
}

.new-user-management-g-wrapper .g-form .el-input__prefix {
  left: auto;
  right: 0;
}

.new-user-management-g-wrapper .g-form .g-upload {
  display: inline;
  height: 40px;
  line-height: 55px;
}

.new-user-management-g-wrapper .g-form .el-upload-button {
  padding: 0 15px;
  height: 28px !important;
  line-height: 28px;
}

.new-user-management-g-wrapper .g-form .show-off-class .g-divider {
  margin-right: 10px;
}

.new-user-management-g-wrapper .g-form .show-off-class .iconfont {
  cursor: pointer;
}

.new-user-management-g-wrapper .g-form .high-setup-class {
  margin-top: 10px;
  min-height: 200px;
  border: 1px dashed #888;
  background: rgba(245, 247, 253, 1);
}

.new-user-management-g-wrapper .g-form .el-checkbox {
  width: 130px;
}

.new-user-management-g-wrapper .g-form .g-checkbox .el-checkbox__label {
  vertical-align: middle;
}

.new-user-management-g-wrapper .g-form .g-checkbox .tool-tip-g-content {
  width: 105px;
}

.new-user-management-g-wrapper .g-form .g-check-box-class {
  margin-left: 0;
}

.new-user-management-g-wrapper .el-row {
  text-align: center;
}

.g-footer .m-button-normal {
  float: unset;
  width: 88px;
}

.g-footer button:last-child {
  color: #fff;
  background: #3f6acb;
}

/* .new-user-management-g-wrapper .g-search-select {
    width: 132px;
  } */

.new-user-management-g-wrapper .el-col-10 {
  width: 30.66667%;
}

.new-user-management-g-wrapper .el-col-offset-1 {
  margin-left: 0;
}

.el-upload-filelist-wrapper {
  text-align: left;
}

.el-upload-filelist {
  display: block;
  float: left;
  width: 270px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
  line-height: 36px;
  color: #2aa3f0;
}

.el-upload-close {
  color: #606266;
  font-size: 14px;
  float: right;
  line-height: 36px;
}

.buttom-upload {
  width: 68px !important;
}

.auditInfoForm {
  margin-top: 5%;
  margin-left: 30%;

  .el-input, .el-select {
    position: relative;
    //top: -35px;
    width: 30%;
    /* left: -30px; */
  }

  .el-button {
    position: relative;
    margin-top: 30px;
    left: -35%;

  }
}
</style>
