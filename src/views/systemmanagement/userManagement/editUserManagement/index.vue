<template>
  <div class="edit-user-management-g-wrapper">
    <el-form
      ref="editUserManagementForm"
      :model="form"
      :rules="rules"
      label-position="right"
      class="auditInfoForm"
    >
      <el-form-item
        class="u-margin-top-20"
        label-width="108px"
        label="用户账号："
        prop="userAccout"
      >
        <el-input
          minlength="6"
          maxlength="50"
          class="m-input-normal"
          placeholder="请输入"
          v-model="form.userAccout"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item
        class="u-margin-top-20"
        label-width="108px"
        label="真实姓名："
        prop="realName"
      >
        <el-input
          minlength="2"
          maxlength="50"
          class="m-input-normal"
          placeholder="请输入"
          v-model="form.realName"
        ></el-input>
      </el-form-item>
      <el-form-item
        class="u-margin-top-20"
        label-width="108px"
        label="手机号："
        prop="mobile"
      >
        <el-input
          maxlength="11"
          class="m-input-normal"
          placeholder="请输入"
          v-model="form.mobile"
        ></el-input>
      </el-form-item>
      <el-form-item
        class="u-margin-top-20"
        label-width="108px"
        label="邮箱："
        prop="email"
      >
        <el-input
          class="m-input-normal"
          placeholder="请输入"
          v-model="form.email"
        ></el-input>
      </el-form-item>
      <el-form-item
        class="u-margin-top-20"
        label-width="108px"
        label="角色名称："
        prop="roleId"
      >
        <el-select
          v-model="form.roleId"
          placeholder="请选择"
          class="m-select-normal"
          multiple
          @change="getRoleName"
        >
          <el-option
            v-for="item in roleNameList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        class="u-margin-top-20"
        label-width="108px"
        label="OA账号"
        prop="oaId"
      >
        <el-input
          maxlength="100"
          class="m-input-normal"
          placeholder="请输入"
          v-model="form.oaId"
        ></el-input>
      </el-form-item>
      <el-form-item
        class="u-margin-top-20"
        label-width="108px"
        label="所属组织："
      >
        <el-col :span="10">
          <el-form-item prop="areaCode">
            <!-- <el-select
              v-model="form.areaCode"
              placeholder="请选择"
              class="m-select-normal"
              clearable
            >
              <el-option
                v-for="item in areaList"
                :key="item.id"
                :label="item.orgName"
                :value="item.id"
              ></el-option>
            </el-select> -->

            <el-cascader
              ref="user"
              :options="areaList"
              v-model="form.areaCode"

              :props="props"
              @change="getUserId"
            ></el-cascader>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item class="u-margin-top-20" label-width="108px">
        <el-row class="g-footer">
          <div class="g-footer-button">
            <el-button class="m-button-normal" @click="submit($event)"
              >确定</el-button
            >
            <el-button
              class="m-button-normal u-margin-left-20"
              @click="cancle()"
              >取消</el-button
            >
          </div>
        </el-row>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { obtainUser, searchRole, getUserTree ,modifyUser} from "../../../../api/user";

/**
 * @name: newUserManagement.vue
 * @description: 用户管理新建
 * @author: Shan Youjing(mail)
 * @update: 2019-01-18
 */
// 通用组件引入

// 混入引入

// 接口引入

export default {
  name: "newUserManagement",
  data() {
    // 用户名校验
    const validChineseName = (rule, value, callback) => {
      // let reg = /^[\u0391-\uFFE5A-Za-z]+[\u0391-\uFFE5A-Za-z1-9]{2}$/
      let reg = /^[\u0391-\uFFE5A-Za-z]+[1-9]*$/;
      if (reg.test(value)) {
        callback();
      } else {
        return callback(
          new Error("姓名只能包含中英文,最后可以是数字，如张三，张三1")
        );
      }
    };
    // 手机号码校验
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("手机号不能为空"));
      } else {
        const reg = /^1[3|4|5|7|8｜9][0-9]\d{8}$/;
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error("请输入正确的手机号"));
        }
      }
    };
    return {
       props: { children: 'childList',label: 'orgName',value:'id', checkStrictly: true},

      form: {
        userAccout: "",
        email: "",
        mobile: "",
        realName: "",
        roleId: [],
        roleName: [],
        userId: "",
        oaId: "",
        areaCode: null,
        countyCode: "",
      },
      roleNameList: [],
      areaList: [],
      countyList: [],
      rules: {
        mobile: [
          {
            required: true,
            validator: checkPhone,
            trigger: "blur",
          },
        ],
        realName: [
          {
            required: true,
            trigger: "blur",
            message: "真实姓名不能为空",
          },
          {
            validator: validChineseName,
            trigger: "blur",
          },
        ],
        roleId: [
          {
            required: true,
            trigger: "blur",
            message: "角色必选",
          },
        ],
        oaId: [
          {
            max: 100,
            message: "长度不得超过100个字符",
            trigger: "blur",
          },
        ],
        email: [
          {
            required: true,
            message: "请输入邮箱地址",
            trigger: "blur",
          },
          {
            type: "email",
            message: "请输入正确的邮箱格式",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    // this.getRoleListInfo()
    this.getOrgTree();
    this.getRoleList();
    this.getUserinfo();
  },
  methods: {
    async getUserinfo() {
      let userId = this.$route.query.id;
      let res = await obtainUser({ userId: userId });
      let arr = res.data.roleId.split(",").map(Number);

      console.log(res, "userinfo");

      this.form.userAccout = res.data.userName;

      (this.form.realName = res.data.realName), //真实姓名
        (this.form.mobile = res.data.mobile), //手机号：
        (this.form.email = res.data.email), //邮箱：
        (this.form.areaCode = res.data.orgId*1), //所属组织：
        (this.form.oaId = res.data.oaId), //OA账号
        (this.form.roleId = arr); //角色名称：
      //  this.form.areaCode =[183]; //组织id
       this.form.roleName.push(res.data.roleName); //角色名称：
    },
    async getOrgTree() {
      let res = await getUserTree();
      console.log(res);
      this.areaList = res.data;
    },


    getUserId(val){
       this.form.areaCode=val[val.length-1]
       console.log(this.form.areaCode);
    },
    getRoleName(val) {
      console.log(val);
      this.form.roleId = [...val];
      console.log(this.form.roleId);
    },
    async getRoleList() {
      let res = await searchRole();
      console.log(res);
      this.roleNameList = res.data.list;
    },

    // /**
    //  * 地市下拉框change事件
    //  */
    // areaCodeChange(val) {
    //   this.areaCode = val
    //   this.form.countyCode = ''
    //   this.countyList = this.areaList.filter(item => {
    //     return item.id === this.areaCode
    //   })[0].childList
    // },
    // /**
    //  * 获取下拉框信息
    //  */
    // async getRoleListInfo() {
    //   // 获取审计组织下拉选项
    //   let res = await this.$http.get(OrgTree)
    //   this.areaList = res.data[0].childList

    //   // 获取角色下拉选项
    //   let res1 = await this.$http.get(GetRoleListInfo, {
    //     pageSize: 100
    //   })
    //   this.roleNameList = res1.data.list

    //   // 根据id获取角色信息以及默认选项
    //   let res2 = await this.$http.get(GetUserInfoById, {
    //     userId: this.$route.params.id
    //   })
    //   this.form.userAccout = res2.data.userName
    //   this.form.email = res2.data.email
    //   this.form.mobile = res2.data.mobile
    //   this.form.realName = res2.data.realName
    //   this.form.userId = res2.data.id
    //   this.form.oaId = res2.data.oaId
    //   this.form.roleId = res2.data.roleId.split(',').map(item => Number(item))
    //   if (
    //     Number(res2.data.parentId) === 0 ||
    //     Number(res2.data.parentId) === 1
    //   ) {
    //     this.form.areaCode = Number(res2.data.orgId)
    //     if (this.form.areaCode == 0 || this.form.areaCode == 1) {
    //       this.form.areaCode = ''
    //     }
    //     this.form.countyCode = ''
    //   } else {
    //     this.form.areaCode = Number(res2.data.parentId)
    //     this.countyList = this.areaList.filter(item => {
    //       return item.id === this.form.areaCode
    //     })[0].childList
    //     this.form.countyCode = Number(res2.data.orgId)
    //   }
    //   console.log(this.form.areaCode)
    // },
    /**
     * 确定按钮点击事件
     * @param { Object } e 提交点击事件对象
     */
    submit() {
      let _self = this;
      _self.$refs.editUserManagementForm.validate( async (valid) => {
        if (!valid) {
          return;
        }

         let data={
           userId:this.$route.query.id,
        userName:this.form.userAccout,  //用户账号：
        realName:this.form.realName, //真实姓名
        mobile:this.form.mobile, //手机号：
        email:this.form.email, //邮箱：
        orgId:this.form.areaCode, //所属组织：
        oaId:this.form.oaId, //OA账号
        roleId:this.form.roleId//角色名称：
      }




        let  res = await modifyUser(data)
console.log(res,'修改');
         if(res.status==0){
           this.$message({
          message: '修改成功',
          type: 'success'
        });
           _self.$router.go(-1)
        }else{
          this.$message({
          message: '修改失败',
          type: 'warning'
        });}

        console.log(res , '修改');
        // let data = {
        //   realName: _self.form.realName,
        //   mobile: _self.form.mobile,
        //   email: _self.form.email,
        //   roleId: _self.form.roleId,
        //   userId: _self.$route.params.id,
        //   oaId: _self.form.oaId,
        //   orgId: Number(
        //     _self.form.countyCode ? _self.form.countyCode : _self.form.areaCode
        //   ),
        // };
        // _self.$http.post(UpdateUser, data).then(
        //   (res) => {
        //     _self.$router.push({
        //       name: "userManagement",
        //     });
        //   },
        //   (err) => {
        //     console.log("err", err);
        //     this.common.showErrorToast(err.message);
        //   }
        // );
      });
    },
    /**
     * 取消按钮点击事件
     */
    cancle() {
       this.$router.go(-1)
    },
  },
};
</script>

<style scoped lang='scss'>
.edit-user-management-g-wrapper .g-form {
  margin: 20px 0 0 200px;
  width: 800px;
  text-align: left;
}

.edit-user-management-g-wrapper .g-form .g-form-item {
  width: 500px;
  margin: 0 auto;
}

.edit-user-management-g-wrapper .g-form .line {
  text-align: center;
}

.edit-user-management-g-wrapper .g-form .el-date-editor.el-input,
.edit-user-management-g-wrapper .g-form .el-date-editor.el-input__inner {
  width: auto;
}

.edit-user-management-g-wrapper .g-form .el-input__prefix {
  left: auto;
  right: 0;
}

.edit-user-management-g-wrapper .g-form .g-upload {
  display: inline;
  height: 40px;
  line-height: 55px;
}

.edit-user-management-g-wrapper .g-form .el-upload-button {
  padding: 0 15px;
  height: 28px !important;
  line-height: 28px;
}

.edit-user-management-g-wrapper .g-form .show-off-class .g-divider {
  margin-right: 10px;
}

.edit-user-management-g-wrapper .g-form .show-off-class .iconfont {
  cursor: pointer;
}

.edit-user-management-g-wrapper .g-form .high-setup-class {
  margin-top: 10px;
  min-height: 200px;
  border: 1px dashed #888;
  background: rgba(245, 247, 253, 1);
}

.edit-user-management-g-wrapper .g-form .el-checkbox {
  width: 130px;
}

.edit-user-management-g-wrapper .g-form .g-checkbox .el-checkbox__label {
  vertical-align: middle;
}

.edit-user-management-g-wrapper .g-form .g-checkbox .tool-tip-g-content {
  width: 105px;
}

.edit-user-management-g-wrapper .g-form .g-check-box-class {
  margin-left: 0;
}

.g-footer .g-footer-btn {
  width: 200px;
  margin: 0 auto;
}

.g-footer .m-button-normal {
  float: unset;
  width: 88px;
}

.g-footer button:first-child {
  color: #fff;
  background: #3f6acb;
}

.edit-user-management-g-wrapper .el-col-10 {
  width: 33.66667%;
}

.edit-user-management-g-wrapper .el-col-offset-1 {
  margin-left: 12px;
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
  .el-input,
  .el-select {
    width: 30%;
    /* left: -30px; */
  }
  .el-button {
    position: relative;
    margin-top: 30px;
  }
}
</style>
