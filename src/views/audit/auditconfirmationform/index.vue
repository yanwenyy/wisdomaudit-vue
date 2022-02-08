<template>
  <div class="auditConfirmation">
    <el-button type="primary"
               @click="addConfirmation()"
               class="subBtn">新增确认单</el-button>
    <Vault :vaultV="vaultV"
           :sceneId="sceneId"
           :approvers="approvers"
           :maxTime="maxTime"
           :dqtime="dqtime"
           :account="account"
           :appSessionId="appSessionId"
           @changevault="changevault"
           @vdownload="vdownload"></Vault>

    <!-- 审计确认单列表 -->
    <div class="min_height">
      <el-table @row-dblclick="getLook"
                v-loading="confirmaryData_loding"
                :header-cell-style="{'background-color': '#F4FAFF',}"
                :data="confirmaryData.records"
                style="margin-top: 1%"
                stripe
                class="confirmaryTable">
        <el-table-column algin="left"
                         width="50"
                         type="index"
                         label="序号"></el-table-column>
        <el-table-column algin="left"
                         label="审计(调查)事项"
                         prop="matter"></el-table-column>
        <el-table-column algin="left"
                         label="审计人员"
                         prop="auditorsName"></el-table-column>
        <el-table-column algin="left"
                         label="问题数"
                         prop="problemsNumber">
          <template slot-scope="scope">
            <p style="color:#4084F2">{{scope.row.problemsNumber?scope.row.problemsNumber:'--'}}</p>

          </template>
        </el-table-column>
        <el-table-column algin="left"
                         label="确认单">
          <template slot-scope="scope">
            <el-popover :popper-class="tableFileList==''?'no-padding':''"
                        v-if="scope.row.attachmentFileCounts"
                        placement="bottom"
                        width="250"
                        @show="getFileList('f'+scope.row.auditConfirmationUuid)"
                        trigger="click">

              <ul v-if="tableFileList.attachmentList1!=''"
                  class="fileList-ul">
                <li class="tableFileList-title">确认单附件</li>
                <li v-for="item in tableFileList.attachmentList1"
                    class="pointer blue tableFileList-li"
                    @click="openVault(item,'下载1')">
                  <div class="inline-block">{{item.file_name}}</div>
                  <!-- <span class="delFile inline-block"
                        @click.stop="delListFile(item.attachment_uuid)">X</span> -->
                </li>
              </ul>
              <div slot="reference"
                   class="pointer"
                   style="color:#4084F2"><i
                   class="el-icon-folder-opened list-folder"></i>{{scope.row.attachmentFileCounts}}
              </div>
            </el-popover>
            <p v-else>--</p>
          </template>
        </el-table-column>
        <el-table-column algin="left"
                         label="附件">
          <template slot-scope="scope">
            <el-popover :popper-class="tableFileList==''?'no-padding':''"
                        placement="bottom"
                        width="250"
                        @show="getFileList('f'+scope.row.auditConfirmationUuid)"
                        v-if="scope.row.fileCounts"
                        trigger="click">

              <ul v-if="tableFileList.attachmentList!=''"
                  class="fileList-ul">
                <li class="tableFileList-title">附件</li>
                <li v-for="item in tableFileList.attachmentList"
                    class="pointer blue tableFileList-li"
                    @click="openVault(item,'下载1')">
                  <div class="inline-block">{{item.file_name}}</div>
                  <!-- <span class="delFile inline-block"
                        @click.stop="delListFile(item.attachment_uuid)">X</span> -->
                </li>
              </ul>

              <ul v-if="tableFileList.problemList!=''"
                  class="fileList-ul">
                <li class="tableFileList-title">问题附件</li>
                <li v-for="item2 in tableFileList.problemList"
                    class="pointer blue tableFileList-li"
                    @click="openVault(item2,'下载2')">
                  <div class="inline-block">{{item2.fileName}}</div>
                  <!-- <span class="delFile inline-block"
                        @click.stop="delListFile(item2.attachmentUuid)">X</span> -->
                </li>
              </ul>

              <div slot="reference"
                   class="pointer"
                   style="color:#4084F2"><i class="el-icon-folder-opened list-folder"></i>{{scope.row.fileCounts}}
              </div>
            </el-popover>
            <p v-else>--</p>
          </template>
        </el-table-column>
        <el-table-column label="操作"
                         algin="left">
          <template slot-scope="scope">
            <el-button size="small"
                       type="text"
                       class="btnStyle editBtn"
                       @click="edit(scope.row,'edit')"
                       v-if="scope.row.createUserUuid==userInfo.user.id">编辑</el-button>
            <el-button size="small"
                       type="text"
                       class="btnStyle editBtn"
                       @click="edit(scope.row,'look')"
                       v-if="scope.row.createUserUuid==userInfo.user.id">查看</el-button>
            <el-button size="small"
                       type="text"
                       class="btnStyle red"
                       @click="deletes(scope.row.auditConfirmationUuid)"
                       v-if="scope.row.createUserUuid==userInfo.user.id">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column label="最终版扫描件"
                         algin="left">
          <template slot-scope="scope">

            <el-popover style="margin-right: 20px"
                        class="inline-block"
                        placement="bottom"
                        width="250"
                        @show="getFileList('z'+scope.row.auditConfirmationUuid)"
                        trigger="click"
                        v-if="scope.row.endFileCounts!==0">
              <ul v-if="tableFileList!=''"
                  class="fileList-ul">
                <li class="tableFileList-title">最终版扫描件</li>
                <li v-for="item in tableFileList.attachmentList"
                    class="pointer blue tableFileList-li"
                    @click="openVault(item,'下载1')">
                  <div class="inline-block">{{item.file_name}}</div><span class="delFile inline-block"
                        @click.stop="delListFile(item.attachment_uuid)">X</span>
                </li>
              </ul>
              <div slot="reference"
                   class="pointer"
                   style="color:#4084F2"><i class="el-icon-folder-opened list-folder"></i>{{scope.row.endFileCounts}}
              </div>
            </el-popover>
            <!--<el-upload v-if="scope.row.endConfirmationFile==''||scope.row.endConfirmationFile==null&&(scope.row.createUserUuid==userInfo.user.id)"-->
            <el-upload :show-file-list="false"
                       class="upload-demo inline-block btnStyle"
                       :on-change="fileChange"
                       :action="'/wisdomaudit/auditConfirmation/endFileUpload?auditConfirmationUuid='+scope.row.auditConfirmationUuid"
                       :on-success="list_data_start"
                       :headers="headers"
                       accept=".docx,.xls,.xlsx,.txt,.zip,.doc">
              <el-button size="small"
                         type="text"
                         style="background: transparent;padding:0"
                         class="editBtn">上传</el-button>
            </el-upload>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="page"
           v-show="this.confirmaryData.total>0">
        <el-pagination @size-change="handleSizeChange_zj"
                       @current-change="handleCurrentChange_zj"
                       :page-size="this.confirmaryData.size"
                       :current-page="this.confirmaryData.current"
                       :total="this.confirmaryData.total"
                       layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>

      </div>
      <!-- 分页 end-->
    </div>

    <!-- 新增确认单弹出框 -->
    <el-form :rules="rules"
             ref="addForm"
             class="formData qrdForm"
             label-width="180px"
             :model="formDetail">

      <el-dialog class="qrd-dialog"
                 :append-to-body='true'
                 :visible.sync="confirmationDialogVisible"
                 width="70%"
                 @close="handleClose('dataForm')">
        <div class="title">{{confirmationDialogTitle}}</div>

        <el-form-item label="审计项目名称:"
                      class="itemTwo">{{managementProjectName!=''?managementProjectName:'--'}}</el-form-item>
        <el-form-item label="被审计单位:"
                      class="itemTwo">{{auditOrgName!=''?auditOrgName:'--'}}</el-form-item>
        <!-- 二级部门 -->
        <el-form-item class="itemTwo"
                      v-if="compileDate ==true"
                      label="二级部门:">
          <el-select :disabled="ifLook"
                     @change="select_Company"
                     v-model="formDetail.auditDepart"
                     placeholder="请选择二级部门"
                     clearable>
            <el-option v-for="(item_com,index_com) in Company_data_list"
                       :label="item_com.orgName"
                       :value="item_com.auditOrgUuid"
                       :key="index_com">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item class="itemOne"
                      prop="matter"
                      label="审计（调查）事项:">
          <el-input :disabled="ifLook"
                    type="textarea"
                    v-model="formDetail.matter"></el-input>
        </el-form-item>
        <el-form-item class="itemOne"
                      prop="matterDetail"
                      label="审计(调查)事项描述:">

          <div style="display:flex">
            <el-button :disabled="ifLook"
                       type="primary"
                       @click="add_problem(1)"
                       class="relationBtn">新增问题</el-button>
            <el-button :disabled="ifLook"
                       @click="getRelationQues()"
                       class="relationBtn">编辑问题</el-button>
          </div>
          <el-input :readonly="ifLook"
                    rows="6"
                    :class="ifLook?'bag':''"
                    type="textarea"
                    v-model="formDetail.matterDetail"></el-input>

          <!-- 回显的数据列表 -->
          <ul class="query_list"
              v-if="fileArr && fileArr.length!=0">
            <li v-for="(item1,index2) in fileArr"
                :key="'fileArr'+index2">
              <div v-show="!ifLook"
                   class="edit">
                <i class="el-icon-folder-opened list-folder"></i>
                <p @click="openVault(item1,'下载2')">{{item1.fileName}}</p>
                <span @click="del_list_img(item1)">x</span>
              </div>

              <div v-show="ifLook"
                   class="look">
                <i class="el-icon-folder-opened list-folder"></i>
                <p>{{item1.fileName}}</p>
                <span>x</span>
              </div>

            </li>
          </ul>
        </el-form-item>
        <el-form-item prop="auditorsName"
                      class="itemTwo"
                      label="审计人员:">
          <el-select :disabled="ifLook"
                     v-model="formDetail.auditorsName"
                     placeholder="请选择审计人员"
                     clearable>
            <el-option v-for="(item3,index3) in sjryList"
                       :label="item3.peopleName"
                       :value="item3.peopleName"
                       :key="index3">
            </el-option>
          </el-select>
          <!--<el-input :disabled="ifLook"-->
          <!--placeholder="请输入"-->
          <!--v-model="formDetail.auditorsName"></el-input>-->
        </el-form-item>
        <el-form-item prop="reviewerName"
                      class="itemTwo"
                      label="复核人:">
          <el-select :disabled="ifLook"
                     v-model="formDetail.reviewerName	"
                     placeholder="请选择复核人"
                     clearable>
            <el-option v-for="(item_fh,index_fh) in FhrList"
                       :label="item_fh.realName"
                       :value="item_fh.realName"
                       :key="index_fh">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="compileDate"
                      class="itemTwo"
                      label="编制日期:">
          <el-date-picker :disabled="ifLook"
                          v-model="formDetail.compileDate"
                          type="date"
                          placeholder="选择日期"
                          format="yyyy-MM-dd"
                          value-format="yyyy-MM-dd"
                          style="width: 100%"></el-date-picker>
        </el-form-item>

        <el-form-item class="itemOne"
                      v-if="confirmationDialogTitle=='编辑确认单'||ifLook"
                      prop="compileDate"
                      label="被审计(调查)单位确认意见:">
          <el-input :disabled="ifLook"
                    type="textarea"
                    v-model="formDetail.auditOrgOpinion"></el-input>
        </el-form-item>
        <el-form-item label="上传附件:"
                      class="upload-yw">
          <div class="ifLook_upload"
               v-if="ifLook"></div>
          <el-upload class="upload-demo"
                     drag
                     :disabled="ifLook?true:false"
                     action="/wisdomaudit/auditBasy/filesUpload"
                     :on-success="( response, file, fileList)=>{uploadPorgress( response, file, fileList,attachmentList1)}"
                     :on-remove="( file, fileList)=>{handleRemove( file, fileList,attachmentList1,fileList1,fileList1_del)}"
                     multiple
                     :limit="3"
                     :key="key"
                     :on-exceed="handleExceed"
                     :headers="headers"
                     :file-list="fileList1">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              点击上传或将文件拖到虚线框<br />支持.docx .xls .xlsx .txt .zip .doc
            </div>
          </el-upload>
          <!-- <div class="inline-block"
               v-if="ifLook">
            <el-tooltip class="item"
                        effect="dark"
                        v-for="(item,index) in fileList1"
                        :key="index"
                        :content="item.fileName"
                        placement="top">
              <div class="blue pointer"
                   @click="openVault(item,'下载2')">
                {{item.fileName.length>20?item.fileName.slice(0,20)+"...":item.fileName}}</div>
            </el-tooltip>
          </div> -->
        </el-form-item>

        <span slot="footer"
              class="dialog-footer">
          <el-button @click="handleClose()">取 消</el-button>
          <el-button v-if="!ifLook"
                     type="primary"
                     :disabled="isDisable"
                     @click="saveForm('addForm',1)"
                     class="subBtn">确 定</el-button>

          <el-button v-if="!ifLook"
                     type="primary"
                     :disabled="isDisable"
                     @click="saveForm('addForm',2)"
                     class="subBtn">生 成</el-button>

        </span>
      </el-dialog>
    </el-form>

    <!-- 编辑问题列表 -->
    <!-- <search-list ref="searchTabel"
                 @refreshSearch="getSearchInfo"></search-list> -->
    <el-dialog center
               width="70%"
               title="问题列表"
               class="edit_table"
               :visible.sync="visible"
               :append-to-body="true">
      <div class="relation-div">
        <div class="relation-div-search search-form">

          <!-- <el-form :inline="true"
                   :model="searchform"
                   @keyup.enter.native="init(id)"
                   class="queryForm"> -->

          <!-- <el-form-item class="searchBtn">
              <el-input v-model="searchform.problem"
                        placeholder="问题名称"
                        clearable>
                <el-button slot="append"
                           style="height:36px;"
                           icon="el-icon-search"
                           @click="init(id)"></el-button>
              </el-input>
            </el-form-item> -->

          <el-row>
            <div class="search">

              <el-button type="primary"
                         size="medium"
                         @click="add_problem(2)">新增问题</el-button>

              <el-input v-model="searchform.problem"
                        placeholder="问题名称"
                        clearable>
              </el-input>
              <div class="search_icon"
                   style="background: rgb(12, 135, 214) !important"
                   @click="serch()">
                <i class="el-icon-search"
                   style="color: white"></i>
              </div>
            </div>
          </el-row>

          <!-- </el-form> -->
        </div>
        <div class="dlag"
             ref="myBox">

          <el-table :header-cell-style="{'text-align': 'center','background-color': '#F4FAFF',}"
                    ref="multipleTable"
                    :data="relationTabel2.records"
                    class="relationTabelClass"
                    tooltip-effect="dark"
                    style="width: 100%"
                    stripe
                    v-loading="load"
                    @selection-change="relationTabelSel">
            <el-table-column type="selection"
                             align="center" />
            <el-table-column align="center"
                             type="index"
                             label="序号">
            </el-table-column>
            <el-table-column align="center"
                             prop="field"
                             label="领域"
                             width="180">
            </el-table-column>
            <el-table-column align="center"
                             prop="problem"
                             width="250"
                             label="问题">
              <template slot-scope="scope">

                <!-- 详情 -->
                <el-popover placement="bottom"
                            visible-arrow='false'
                            popper-class="popover2"
                            :width=" details_list.style_width"
                            @show="details_show(scope.row,scope.$index+1)"
                            trigger="click">
                  <div class="problem_details_conter"
                       :width=" details_list.style_width + 'px'"
                       v-if="details == true">
                    <ul class="list">
                      <li class="one">
                        <p class="one_p"><span class="fl sp">序号：</span><span>{{Index+1}}</span></p>
                        <p class="one_p"><span class="fl sp">领域：</span><span>{{details_list.field}}</span></p>
                        <p class="one_p"><span class="fl sp">专题：</span><span>{{details_list.special}}</span></p>
                      </li>

                      <li class="one">
                        <p class="one_p"><span class="fl sp">涉及金额(万元)：</span>

                          <span>{{ parseFloat(details_list.riskAmount) }}</span>
                        </p>
                        <p class="one_p"><span class="fl sp">发现日期：</span>
                          <span>{{details_list.problemDiscoveryTime | dateformat}}</span>
                        </p>
                        <p class="one_p">
                          <span class="fl sp">发现人：</span>
                          <span>{{details_list.problemFindPeople}}</span>
                        </p>
                      </li>

                      <li class="one">
                        <p class="one_p">
                          <span class="fl sp">附件：</span><i
                             class="el-icon-folder-opened list-folder"></i><span>{{details_list.attachmentList.length}}</span>
                        </p>
                        <p class="one_p">
                          <span class="fl sp">关联任务：</span>
                          <!-- <div> -->
                          <span v-for="(it,ind) in taskList"
                                :key="'taskList'+ind"
                                style="margin-right:10px;">{{it.taskName}} <i>、</i></span>
                          <!-- </div> -->
                        </p>

                        <p class="one_p"
                           style="">
                        </p>

                      </li>

                      <li>
                        <span class="fl sp">问题：</span>
                        <p><span>{{details_list.problem}}</span></p>

                      </li>
                      <li>
                        <span class="fl sp">依据：</span>
                        <p><span>{{details_list.basis}}</span></p>

                      </li>
                      <li>
                        <span class="fl sp">描述：</span>

                        <p><span>{{details_list.describe}}</span></p>
                      </li>
                      <li>
                        <span class="fl sp">管理建议：</span>
                        <p><span>{{details_list.managementAdvice}}</span></p>

                      </li>

                    </ul>
                  </div>

                  <div slot="reference"
                       class="pointer">
                    <span v-if="scope.row.problem"
                          @click="details_show(scope.row,scope.$index)"
                          style="cursor: pointer;color:rgb(68, 163, 223);">{{scope.row.problem }}</span>
                    <span v-else>--</span>
                  </div>
                </el-popover>

              </template>
            </el-table-column>
            <el-table-column prop="riskAmount"
                             width="117px"
                             label="涉及金额(万元)"
                             align="right">
              <template slot-scope="scope">
                {{ parseFloat(scope.row.riskAmount) }}
              </template>
            </el-table-column>
            <el-table-column align="center"
                             prop="problemDiscoveryTime"
                             label="发现日期">
              <template slot-scope="scope">{{
              scope.row.problemDiscoveryTime | dateformat
              }}</template>
            </el-table-column>
            <el-table-column align="center"
                             prop="problemFindPeople"
                             label="发现人">
            </el-table-column>

            <!-- 附件 -->
            <el-table-column prop="attachmentList"
                             align="center"
                             label="附件">
              <template slot-scope="scope">
                <el-popover :popper-class="enclosure_details_list==''?'no-padding':''"
                            placement="bottom"
                            v-if="scope.row.attachmentList.length!==0"
                            width="250"
                            @show="open_enclosure_details(scope.row.attachmentList)"
                            trigger="click">
                  <ul v-if="enclosure_details_list!=''"
                      class="fileList-ul">
                    <li class="tableFileList-title">文件名称</li>
                    <li v-for="(item_file,index_file) in enclosure_details_list"
                        :key="index_file"
                        class="pointer blue"
                        @click="openVault(item_file,'下载2')">
                      {{item_file.fileName}}</li>
                    <!-- @click="download(item.attachmentUuid,item.fileName)" -->
                  </ul>
                  <div slot="reference"
                       style="color: #1371cc;"
                       class="pointer"><i
                       class="el-icon-folder-opened list-folder"></i>{{scope.row.attachmentList.length}}
                  </div>
                </el-popover>
                <span v-else>--</span>

              </template>
            </el-table-column>

            <!-- <el-table-column align="center"
                             prop="managementAdvice"
                             :show-overflow-tooltip="true"
                             label="管理建议">
            </el-table-column> -->

            <el-table-column label="操作"
                             width="100"
                             v-if="userRole == 1 || userRole == 2">
              <template slot-scope="scope">
                <el-button @click="list_openDetail(scope.row.problemListUuid)"
                           type="text"
                           style="color: #0c87d6">编辑</el-button>
                <el-button @click="del_list(scope.row.problemListUuid)"
                           type="text"
                           style="color: #ff8a72">删除</el-button>
              </template>
            </el-table-column>

          </el-table>

          <!-- <div class="mose"
               @click="close_mose"
               v-if="details == true"></div> -->

          <!-- 分页 -->
          <!-- v-show="this.relationTabel2.total>0" -->
          <div class="page">
            <el-pagination @size-change="handleSizeChange_wt"
                           @current-change="handleCurrentChange_wt"
                           :page-size="this.relationTabel2.size"
                           :current-page="this.relationTabel2.current"
                           :total="this.relationTabel2.total"
                           layout="total, sizes, prev, pager, next, jumper">
            </el-pagination>

          </div>
          <!-- 分页 end-->

        </div>

      </div>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="visible=false">取消</el-button>
        <el-button type="primary"
                   @click="setRelation()">生成</el-button>
      </div>
    </el-dialog>

    <!-- 新增审计问题 -->
    <!-- @close="resetForm('temp_problem')" -->
    <el-dialog title="新增审计问题"
               :append-to-body='true'
               :visible.sync="dialogFormVisible"
               :close-on-click-modal="false"
               width="70%"
               class="dlag_wi"
               center>
      <el-form ref="dataForm"
               :rules="rules_problem"
               :model="temp_problem"
               label-position="right"
               label-width="140px"
               class="problem-form formData">
        <el-form-item label="问题："
                      class="itemTwo"
                      prop="problem">
          <el-input v-model="temp_problem.problem"
                    placeholder="请输入问题" />
        </el-form-item>
        <el-form-item label="关联任务："
                      class="itemTwo task"
                      prop="auditTaskUuid">
          <el-select v-model="temp_problem.auditTaskUuid"
                     multiple
                     @change="changetempauditTaskUuid"
                     placeholder="请选择关联任务">
            <el-option v-for="item in auditTasklList"
                       :key="item.auditTaskUuid"
                       :label="item.taskName"
                       :value="item.auditTaskUuid">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="领域："
                      class="itemTwo"
                      prop="field">
          <el-select v-model="temp_problem.field"
                     placeholder="请选择领域">
            <el-option v-for="items in CategoryList"
                       :key="items.label"
                       :label="items.label"
                       :value="items.label">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="专题："
                      class="itemTwo"
                      prop="special">
          <el-select v-model="temp_problem.special"
                     placeholder="请选择专题"
                     v-if="input_select == true"
                     @change="change_zt">
            <el-option v-for="item_sp in SPECIALList"
                       :key="item_sp.value"
                       :label="item_sp.label"
                       :value="item_sp.value">
            </el-option>
          </el-select>
          <el-input v-model="temp_problem.special"
                    v-if="input_select == false"></el-input>
          <el-button v-if="input_select == false"
                     type="primary"
                     class="inline-block"
                     style="position: absolute;top:0;right: -90px"
                     @click="input_select=!input_select">重选</el-button>
        </el-form-item>

        <!-- <el-form-item> </el-form-item> -->
        <el-form-item label="依据："
                      style="margin-bottom:20px!important;"
                      prop="basis"
                      class="itemOne">
          <el-select v-model="temp_problem.basis"
                     class="inline-block yj-sel"
                     multiple
                     @visible-change="toopen"
                     placeholder="请选择依据"
                     no-data-text="请点击引用审计依据">
          </el-select>
          <el-button type="primary"
                     ref="basisbtn0"
                     class="citebtn inline-block"
                     @click="openbasis()">引用审计依据</el-button>
        </el-form-item>

        <el-form-item label="描述："
                      style="margin-bottom:20px!important;"
                      prop="describe"
                      class="itemOne">
          <!-- <el-input v-model="temp.describe" placeholder="请输入描述" /> -->
          <el-input type="textarea"
                    v-model="temp_problem.describe"
                    placeholder="请输入描述"
                    :autosize="{ minRows: 3}"></el-input>
        </el-form-item>
        <el-form-item label="管理建议："
                      style="margin-bottom:20px!important;"
                      prop="managementAdvice"
                      class="itemOne">
          <el-input type="textarea"
                    v-model="temp_problem.managementAdvice"
                    placeholder="请输入管理建议"
                    :autosize="{ minRows: 3}" />
        </el-form-item>
        <el-form-item label="发现日期："
                      class="itemTwo"
                      prop="problemDiscoveryTime">
          <!-- <el-input
            v-model="temp.problemDiscoveryTime"
            type="date"
            placeholder="请输入发现日期"
          /> -->
          <el-date-picker type="date"
                          placeholder="选择日期"
                          v-model="temp_problem.problemDiscoveryTime"
                          style="width: 100%"></el-date-picker>
        </el-form-item>
        <el-form-item label="发现人："
                      class="itemTwo"
                      prop="problemFindPeople">
          <el-select v-model="temp_problem.problemFindPeople"
                     placeholder="请选择发现人">
            <el-option v-for="(item, i) in personlist"
                       :key="'person' + i"
                       :label="item.realName"
                       :value="item.realName">
              {{ item.realName }}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="涉及金额(万元)："
                      class="itemTwo"
                      prop="riskAmount">
          <el-input v-model="temp_problem.riskAmount"
                    placeholder="请输入涉及金额"
                    @keyup.native="onlyNumOnePoint('temp_problem')"
                    @input="temp_problem.riskAmount = temp_problem.riskAmount.slice(0, 27)" />
        </el-form-item>
        <el-form-item label="上传附件："
                      class="itemTwo"
                      style="width:100%!important">
          <el-upload class="upload-demo"
                     drag
                     action="/wisdomaudit/auditBasy/filesUpload"
                     :on-success="( response, file, fileList)=>{
                       uploadPorgress2( response, file, fileList,attachmentList2)
                       }"
                     :on-remove="( file, fileList)=>{
                       handleRemove2( file, fileList,attachmentList2,fileList2,fileList2_del)
                       }"
                     :on-progress="update_ing"
                     multiple
                     :key="key"
                     :on-exceed="handleExceed"
                     :headers="headers"
                     :file-list="fileList2">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              点击上传或将文件拖到虚线框<br />支持.docx .xls .xlsx .txt .zip .doc
            </div>
          </el-upload>
          <!-- <div class="inline-block">
            <el-tooltip class="item"
                        effect="dark"
                        v-for="(item,index) in fileList2"
                        :key="index"
                        :content="item.fileName"
                        placement="top">
              <div class="blue pointer"
                   @click="downFile2(item.attachmentUuid,item.fileName)">
                {{item.fileName.length>20?item.fileName.slice(0,20)+"...":item.fileName}}</div>
            </el-tooltip>
          </div>-->
        </el-form-item>

      </el-form>
      <div slot="footer">
        <el-button v-if="!closeStatus"
                   @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="closeStatus"
                   type="primary"
                   @click="dialogFormVisible = false">关闭</el-button>

        <el-button type="primary"
                   v-if="success_btn==1"
                   :loading="true">上传中</el-button>

        <el-button v-if="success_btn==0 && !closeStatus"
                   type="primary"
                   @click="createData()">保存</el-button>
      </div>
    </el-dialog>

    <!-- 编辑审计问题 -->
    <!-- @close="resetForm('dqProblem')" -->
    <el-dialog width="70%"
               :title="ifadd == 1 ? '编辑问题' : '问题详情'"
               :visible.sync="dialogDetailVisible"
               :close-on-click-modal="false"
               :append-to-body='true'
               class="dlag_wi"
               center>
      <el-form ref="detailForm"
               :model="dqProblem"
               :rules="rules"
               label-position="right"
               label-width="140px"
               class="problem-form formData">
        <el-form-item label="问题："
                      class="itemTwo"
                      prop="problem">
          <el-input v-model="dqProblem.problem"
                    placeholder="请输入问题"
                    :disabled="ifadd != 2 ? false : true" />
        </el-form-item>
        <el-form-item label="关联任务："
                      class="itemTwo task"
                      prop="auditTaskUuid">
          <el-select disabled
                     v-model="dqProblem.auditTaskUuid"
                     multiple
                     @change="changedqProblemauditTaskUuid"
                     placeholder="请选择关联任务">
            <el-option v-for="item_audit in auditTasklList"
                       :key="item_audit.auditTaskUuid"
                       :label="item_audit.taskName"
                       :value="item_audit.auditTaskUuid">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="领域："
                      class="itemTwo"
                      prop="field">
          <el-select v-model="dqProblem.field"
                     placeholder="请选择领域"
                     :disabled="ifadd != 2 ? false : true">
            <el-option v-for="item in CategoryList"
                       :key="item.label"
                       :label="item.label"
                       :value="item.label">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="专题："
                      class="itemTwo"
                      prop="special">
          <el-select v-model="dqProblem.special"
                     placeholder="请选择专题"
                     :disabled="ifadd != 2 ? false : true"
                     v-if="input_selecte == true"
                     @change="change_zte">
            <el-option v-for="item_sp2 in SPECIALList"
                       :key="item_sp2.value"
                       :label="item_sp2.label"
                       :value="item_sp2.value">
            </el-option>
          </el-select>
          <el-input v-model="dqProblem.special"
                    v-if="input_selecte == false"
                    :disabled="ifadd != 2 ? false : true"></el-input>
          <el-button v-if="input_selecte == false"
                     type="primary"
                     class="inline-block"
                     style="position: absolute;top:0;right: -90px"
                     @click="input_selecte=!input_selecte">重选</el-button>
        </el-form-item>

        <el-form-item label="依据："
                      prop="basis"
                      class="itemOne">
          <el-select v-model="dqProblem.basis"
                     class="inline-block yj-sel"
                     multiple
                     @visible-change="toopen"
                     placeholder="请选择依据"
                     no-data-text="请点击引用审计依据"
                     :disabled="ifadd != 2 ? false : true">
          </el-select>
          <el-button v-if="ifadd != 2 ? true : false"
                     type="primary"
                     ref="basisbtn0"
                     class="citebtn inline-block"
                     @click="openbasis()">引用审计依据</el-button>
        </el-form-item>
        <el-form-item label="描述："
                      style="margin-bottom:20px!important;"
                      prop="describe"
                      class="itemOne">
          <el-input type="textarea"
                    v-model="dqProblem.describe"
                    placeholder="请输入描述"
                    :disabled="ifadd != 2 ? false : true"
                    :autosize="{ minRows: 3}" />
        </el-form-item>
        <el-form-item label="管理建议："
                      style="margin-bottom:20px!important;"
                      prop="managementAdvice"
                      class="itemOne">
          <el-input type="textarea"
                    v-model="dqProblem.managementAdvice"
                    placeholder="请输入管理建议"
                    :disabled="ifadd != 2 ? false : true"
                    :autosize="{ minRows: 3}" />
        </el-form-item>
        <el-form-item class="itemTwo"
                      label="发现日期："
                      prop="problemDiscoveryTime">
          <el-date-picker type="date"
                          placeholder="选择日期"
                          v-model="dqProblem.problemDiscoveryTime"
                          style="width: 100%"
                          :disabled="ifadd != 2 ? false : true"></el-date-picker>
        </el-form-item>
        <el-form-item class="itemTwo"
                      label="发现人："
                      prop="problemFindPeople">
          <el-select v-model="dqProblem.problemFindPeople"
                     placeholder="请选择发现人"
                     :disabled="ifadd != 2 ? false : true">
            <el-option v-for="(item_peole, i) in personlist"
                       :key="'person' + i"
                       :label="item_peole.realName"
                       :value="item_peole.realName">
              {{ item_peole.realName }}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="itemTwo"
                      label="涉及金额(万元)："
                      prop="riskAmount"
                      width="180">
          <el-input v-model="dqProblem.riskAmount"
                    placeholder="请输入涉及金额"
                    :disabled="ifadd != 2 ? false : true"
                    @keyup.native="onlyNumOnePoint('dqProblem')"
                    @input="temp.riskAmount = temp.riskAmount.slice(0, 27)" />
        </el-form-item>
        <el-form-item class="itemTwo"
                      style="width:100%!important"
                      label="上传附件：">
          <el-upload class="upload-demo"
                     drag
                     action="/wisdomaudit/auditBasy/filesUpload"
                     :on-success="( response, file, fileList)=>{
                       uploadPorgress2( response, file, fileList,attachmentList2)
                       }"
                     :on-remove="( file, fileList)=>{
                       handleRemove2( file, fileList,attachmentList2,fileList2,fileList2_del)
                       }"
                     :on-progress="update_ing"
                     multiple
                     :key="key"
                     :on-exceed="handleExceed"
                     :headers="headers"
                     :file-list="fileList2">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              点击上传或将文件拖到虚线框<br />支持.docx .xls .xlsx .txt .zip .doc
            </div>
          </el-upload>
          <!-- <div class="inline-block"
               v-if="ifLook==1">
            <el-tooltip class="item"
                        effect="dark"
                        v-for="(item,index) in fileList2"
                        :key="index"
                        :content="item.fileName"
                        placement="top">
              <div class="blue pointer"
                   @click="downFile2(item.attachmentUuid,item.fileName)">
                {{item.fileName.length>20?item.fileName.slice(0,20)+"...":item.fileName}}</div>
            </el-tooltip>
          </div> -->
        </el-form-item>

      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button type="primary"
                   @click="updateData()"
                   v-if="success_btn==0 && ifupdata">保存修改</el-button>

        <el-button type="primary"
                   v-if="success_btn==1"
                   :loading="true">上传中</el-button>

        <el-button type="primary"
                   @click="dialogDetailVisible = false">关闭</el-button>
      </div>
    </el-dialog>
    <!-- 引用设计依据 -->
    <el-dialog title="引用审计依据"
               :append-to-body='true'
               :visible.sync="basisdialog"
               width="70%"
               class="post"
               custom-class="outmax">
      <div style="display: flex; height: 100%; padding: 20px">
        <div style="max-height: 60vh; width: 50%; overflow: scroll">
          <el-form ref="basisform"
                   class="problem-form"
                   :model="dqbasis"
                   label-width="120px"
                   label-position="right">
            <el-form-item label="审计依据名称"
                          class="long">
              <el-select v-model="dqbasis.val"
                         placeholder="请选择依据名称"
                         filterable
                         remote
                         reserve-keyword
                         :remote-method="basisremoteMethod"
                         :loading="basisloading"
                         @change="getbasisdetail(dqbasis.val)">
                <el-option v-for="item_bs in basislist"
                           :key="item_bs.basy_uuid"
                           :label="item_bs.basy_name"
                           :value="item_bs.basy_uuid">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <el-card class="box-card"
                   style="width: 70%; min-height: 300px; margin: auto">
            <el-tree :data="dqbasis.info.tree"
                     :props="defaultProps"
                     @node-click="treeNodeClick"
                     default-expand-all
                     v-loading="basisload"
                     class="problemtree"></el-tree>
          </el-card>
        </div>
        <el-card class="box-card basiscard"
                 style="width: 50%"
                 v-loading="basisload">
          <div v-for="(item, index) in dqbasis.info.arr"
               :key="'dqbasisarr' + index">
            <div slot="header"
                 class="clearfix"
                 style="padding: 5px 0"
                 v-if="item.contentLev != 3">
              <span style="font-weight: bold"
                    :style="
                  item.contentLev == 1
                    ? 'font-size:18px;'
                    : item.contentLev == 2
                    ? 'font-size:16px;'
                    : 'font-size:14px;'
                ">{{ item.label }}</span>
            </div>

            <el-button style="padding: 10px 0 3px 20px; color: #ffba00; float: right"
                       v-if="item.contentLev == 3"
                       @click="choosebasis(item.attachmentContent)"
                       type="text">引用</el-button>
            <p class=""
               v-if="item.contentLev == 3">
              {{ item.attachmentContent }}
            </p>
          </div>
        </el-card>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="basisdialog = false">取 消</el-button>
        <el-button type="primary"
                   @click="surebasis()">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import axios from "axios";//金库
import Vault from "@WISDOMAUDIT/components/Vaultcertification";//金库

import { del_file, get_userInfo, projectMembership_listUserInfo, down_file, auditBasy_getFileList, auditConfirmation_pageList, auditConfirmation_save, auditConfirmation_delete, auditConfirmation_getDetail, auditConfirmation_update, Company } from
  '@SDMOBILE/api/shandong/ls'
import { task_pageList_query } from
  '@SDMOBILE/api/shandong/AuditReport'
import { task_select_people } from
  '@SDMOBILE/api/shandong/task'
import SearchList from "./searchList"
import $ from "jquery";
export default {
  components: {
    SearchList,
    Vault//金库
  },
  props: ['active_project', 'userRole'],
  data () {
    return {
      confirmaryData_loding: false,//确认单列表loadng
      Table_loading: false,
      vaultV: false,
      sceneId: 1557, //经营指标、模型结果编号:1556 附件上传后下载编号:1557
      approvers: [], //审批人列表
      maxTime: "",//最大时间
      dqtime: "",//当前时间
      account: "",//返回的账户
      appSessionId: "",//应用sessionid
      downloaobj: {},//暂存的下载目标
      dqtoken: '',
      //金库end
      compileDate: false,
      key: 0,
      attachmentList1: [],//附件上传列表
      fileList1: [],//附件上传回显列表
      fileList1_del: [],
      headers: {},
      isDisable: false,
      ifLook: false,
      confirmationDialogTitle: '新增确认单',
      confirmaryData: [],
      confirmationDialogVisible: false, //新增确认单弹框
      // confirmationDialogVisibleZx: false,//专项确认单编辑
      formDetail: {
        auditDepart: '',//被审计部门
        attachmentList: [],
        matter: '',
        matterDetail: '',
        auditorsName: '',
        reviewerName: '',
        compileDate: '',
        auditOrgOpinion: '',
        principalName: '',
        principalPost: '',
        signatureDate: '',
        auditOrgOpinion: '',
        fileArr: "",//生成 后的 数组
        fileArrList: "",
        butt: '',//是否 生成2
      },//确认单数据
      fileArr: [],//生成 后的 数组


      relationTabel: [],//关联问题
      relationStatus: false,//关联问题显示状态
      multipleSelection: [],//关联问题列表已选

      managementProjectName: '',//审计项目名称
      auditOrgName: '',//被审计单位
      projectType: '',//项目类型 jzsj经责审计  zxsj专项审计
      tableFileList: [],//确认单附件列表
      FhrList: [],//复核人列表
      sjryList: [],//审计人员列表
      userInfo: {
        user: {}
      },//用户信息
      // 新增的表单验证
      rules: {
        matter: [
          { required: true, message: "请填写审计（调查）事项", trigger: "blur" },
        ],
        matterDetail: [
          { required: true, message: "请填写审计（调查）事项描述", trigger: "change" },
        ],
        auditorsName: [
          { required: true, message: "请填写审计人员", trigger: "blur" },
        ],
        reviewerName: [
          { required: true, message: "请填写复核人", trigger: "blur" },
        ],
        compileDate: [
          { required: true, message: "请填写编制日期", trigger: "blur" },
        ],
      },

      // 被审计机构
      Company_data_list: [],

      success_btn: 0,//上传 ing
      // 新增审计问题
      temp_problem: {
        managementProjectUuid: this.active_project,
        // 业务分类
        auditTaskUuid: [],
        basis: [],
        describe: "",
        field: "",
        special: "",
        isDeleted: 0,
        problem: "",
        problemDiscoveryTime: "",
        problemFindPeople: "",
        managementAdvice: "",
        problemListUuid: "",
        riskAmount: "",
        status: 0,
        attachmentList: [],
        // zdyCode: 0,
        entity: {
          belongSpcialSize: '',
          dictname: '',
        },
      },
      attachmentList2: [],//附件上传列表
      fileList2: [],//附件上传回显列表
      fileList2_del: [],

      selections: [],
      dialogFormVisible: false,
      ifupdata: false,
      dialogDetailVisible: false,
      dialogStatus: "",
      // 新增的表单验证
      rules_problem: {
        auditTaskUuid: [
          { required: true, message: "请选择关联任务", trigger: "change" },
        ],
        // basis: [{ required: true, message: "请选择依据", trigger: "change" }],
        field: [{ required: true, message: "请选择领域", trigger: "change" }],
        problem: [{ required: true, message: "请填写问题", trigger: "change" }],
        problemDiscoveryTime: [
          { required: true, message: "请填写发现时间", trigger: "change" },
        ],
        problemFindPeople: [
          { required: true, message: "请填写发现人", trigger: "change" },
        ],
        special: [{ required: true, message: "请选择专题", trigger: "change" }],
        riskAmount: [
          { required: true, message: "请填写涉及金额", trigger: "change" },
        ],
      },
      closeStatus: false,
      headers: { "Content-Type": "multipart/form-data" },
      file: "",
      CategoryList: [],
      SPECIALList: [],
      auditTasklList: [],
      basisdialog: false,
      basislist: [],
      dqbasis: {
        val: "",
        info: "",
        choose: [],
      },
      defaultProps: {
        children: "children",
        label: "label",
      },
      basisload: false,
      ifadd: 0,
      personlist: [],
      me: "",
      input_select: true,
      input_selecte: true,
      basisloading: false,
      dqProblem: {},//编辑问题
      dqtoken: "",


      // 编辑问题弹窗
      relationTabel2: [],
      multipleSelection: [],
      visible: false,
      temp: {},
      dataList: [],
      searchform: {
        problem: ''
      },//关联问题搜索
      page: {
        current: 1,
        size: 10,
        total: 0
      },
      details: false,//悬浮问题 背景
      Index: '',
      style_px: 43,//悬浮定位
      details_list: [],//悬浮数据
      enclosure_details_list: [],//附件
      load: false,
      taskList: [],//详情  任务回显

      type: '',
      // 确认单列表
      params2: {
        pageNo: 1,
        pageSize: 10,
      },
      // 问题编辑
      params3: {
        pageNo: 1,
        pageSize: 10,
      },


      // 自定义专题
      zdyCode: 0,//区别自定义
      belongSpcialSize: '',//专题集合数
      belongSpcialCode: 'SPECIAL',


      style_w: '',


    };
  },
  created () {
    this.dqtoken = sessionStorage.getItem("TOKEN");
    this.list_data_start();
    this.getFhrList();
    this.getSjryList();
    this.getloadcascader("Category");
    this.getloadcascader("SPECIAL");
    this.getSelectTask();
    this.getbasis();//获取依据
    this.getperson();//获取人员
    this.getme();
    let params = {
      entity: {},
    }
    this.Company_data(params); // 被审计单位
  },
  mounted () {
    this.headers = { 'TOKEN': sessionStorage.getItem('TOKEN') }
  },
  methods: {

    // 新增选择任务
    changetempauditTaskUuid (val) {
      console.log(val);
      for (let i = 0; i < this.auditTasklList.length; i++) {
        if (this.auditTasklList[i].auditTaskUuid == val[0]) {
          if (this.temp_problem.field == "") {
            this.temp_problem.field = this.auditTasklList[i].belongField;
          }
          if (this.temp_problem.special == "") {
            this.temp_problem.special = this.auditTasklList[i].belongSpcial;
          }
        }
      }
    },
    // 编辑
    changedqProblemauditTaskUuid (val) {
      console.log(val);
      for (let i = 0; i < this.auditTasklList.length; i++) {
        if (this.auditTasklList[i].auditTaskUuid == val[0]) {
          if (this.dqProblem.field == "") {
            this.dqProblem.field = this.auditTasklList[i].belongField;
          }
          if (this.dqProblem.special == "") {
            this.dqProblem.special = this.auditTasklList[i].belongSpcial;
          }
        }
      }
    },

    // 确认单列表
    handleSizeChange_zj (val) {
      this.params2.pageSize = val
      this.list_data_start()//刷新已完成列表
    },
    // 已完成 分页
    handleCurrentChange_zj (val) {
      this.params2.pageNo = val
      this.list_data_start()//刷新已完成列表
    },

    // 问题编辑
    handleSizeChange_wt (val) {
      this.params3.pageSize = val
      this.init();
    },
    handleCurrentChange_wt (val) {
      this.params3.pageNo = val
      this.init();
    },
    // 筛选
    serch () {
      this.params3.pageNo = 1
      this.init();
    },

    //金库通过认证后的方法
    vdownload () {

      if (this.downloaobj.dtype == '下载1') {
        this.downFile(this.downloaobj.attachment_uuid, this.downloaobj.file_name)
      } else {
        this.downFile(this.downloaobj.attachmentUuid, this.downloaobj.fileName)
      }
    },
    //金库控制认证弹窗
    changevault (val) {
      this.vaultV = val;
    },
    //打开金库
    openVault (obj, downtype) {
      this.downloaobj = obj
      this.downloaobj.dtype = downtype
      axios({
        method: "post",
        url: `/wisdomaudit/treasury/getTreasuryStatus`,
        headers: {
          TOKEN: this.headers.TOKEN,
        },
        data: {
          sceneId: this.sceneId,
          sceneName: "附件上传后下载", //场景名称
          sensitiveData: "report_download", //敏感数据对应的编号：  data_export 经营指标、模型结果 report_download 附件上传后下载;
          sensitiveOperate: "download", //敏感操作对应的编号：export： 导出   select：查询
        },
      }).then((resp) => {
        //result 是否开启 开启：1  无需开启：0
        //resultDesc 无需开启原因（成功错误信息）
        //historyAppSessionId 历史有效应用sessionid（仅当已授权状态时必填属性）
        //relation 多值授权方式与访问方式关系
        //policyAuthMethod 授权方式： remoteAuth远程授权
        //policyAccessMethod
        //maxTime 授权条件（必填属性）单位为小时： 当为0时，为单次授权；否则为时间段授权即允许以当前时间为开始时间，开始时间+maxTime时间为最大结束时间，允许用户在此范围选择；
        //approvers 审批人列表
        //如果是线上环境
        if (resp.data.data.isVaultProfiles) {
          let rep = resp.data.data.treasuryStatusRsp;
          if (rep.result == 0) {
            this.$message('因金库未开启或服务异常，文件下载失败，请联系系统管理员。');
            return;
          } else {
            console.log('芝麻开门')
            this.approvers = rep.approvers || "";
            this.maxTime = rep.maxTime;
            this.dqtime = new Date();
            this.account = resp.data.data.account;
            this.appSessionId = resp.data.data.appSessionId;
            this.vaultV = true;
          }
        } else {
          //否则不处理或在此处直接进行后面的操作
          this.vdownload()
        }
      });
    },
    // 下载
    download (id, fileName) {
      let formData = new FormData()
      formData.append('fileId', id)
      down_file(formData).then(resp => {
        const content = resp;
        const blob = new Blob([content],
          { type: 'application/octet-stream,charset=UTF-8' }
        )
        if ('download' in document.createElement('a')) {
          // 非IE下载
          const elink = document.createElement('a')
          elink.download = fileName //下载后文件名
          elink.style.display = 'none'
          elink.href = window.URL.createObjectURL(blob)
          document.body.appendChild(elink)
          elink.click()
          window.URL.revokeObjectURL(elink.href) // 释放URL 对象
          document.body.removeChild(elink)
        } else {
          // IE10+下载
          navigator.msSaveBlob(blob, fileName)
        }
      }).catch((err) => {

      })
    },
    //获取当前人员信息
    getme () {
      axios({
        url: `/wisdomaudit/init/getCurrentInfo`,
        headers: {
          TOKEN: this.dqtoken,
        },
        method: "get",
        data: {},
      }).then((res) => {

        this.me = res.data.data.user.realName;
        this.userRole = res.data.data.userRole;
      });
    },
    // 查看附件详情
    open_enclosure_details (item) {
      this.enclosure_details_list = [];//清空附件
      if (item) {
        this.enclosure_details_list = item
      }
    },

    // 审计问题====================================
    // 新增审计问题
    add_problem (type) {

      this.fileList2 = [];
      this.fileList2_del = [];
      this.attachmentList2 = [];
      this.temp_problem.attachmentList = []; //清空附件
      this.getloadcascader('SPECIAL');//专题数据

      // 新增回显
      if (type == 1) {
        this.type = 1
      } else {
        // 新增刷列表
        this.type = 2

      }
      this.dialogFormVisible = true;//新增问题
      this.ifadd = 0;

      this.temp_problem.problemFindPeople = this.me;//发现人默认选择

      this.temp_problem = {};//清空
      this.temp_problem = {
        managementProjectUuid: this.active_project,
        // 业务分类
        auditTaskUuid: [],
        basis: [],
        describe: "",
        field: "",
        special: "",
        isDeleted: 0,
        problem: "",
        problemDiscoveryTime: "",
        problemFindPeople: "",
        managementAdvice: "",
        problemListUuid: "",
        riskAmount: "",
        status: 0,
      };
      this.temp_problem.problemFindPeople = this.me;
      this.temp_problem.problemDiscoveryTime = new Date();
      this.temp_problem.attachmentList = []; //清空附件
      this.fileList2 = [];

      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });


    },
    // 新增问题关闭
    resetForm (str) {
      this.temp_problem = {};//清空

      // 去除校验
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      })
      if (str == "temp_problem") {
        this.temp_problem = {};//清空
        this.temp_problem = {
          managementProjectUuid: this.active_project,
          // 业务分类
          auditTaskUuid: [],
          basis: [],
          describe: "",
          field: "",
          special: "",
          isDeleted: 0,
          problem: "",
          problemDiscoveryTime: "",
          problemFindPeople: "",
          managementAdvice: "",
          problemListUuid: "",
          riskAmount: "",
          status: 0,
        };
      } else if (str == "dqProblem") {
        this.dqProblem = {};
      }
      this.fileList2 = [];
      this.dialogFormVisible = false;//新增的弹窗

      this.input_select = true; //专题 恢复默认
      this.input_selecte = true; //专题 恢复默认
    },
    // 金额处理
    onlyNumOnePoint (str) {
      let number_only = "";
      if (str == "temp_problem") {
        number_only = this.temp_problem.riskAmount;
      } else {
        number_only = this.dqProblem.riskAmount;
      }
      //先把非数字的都替换掉，除了数字和小数点
      number_only = number_only.replace(/[^\d.]/g, "");
      //必须保证第一个为数字而不是小数点
      number_only = number_only.replace(/^\./g, "");
      //保证只有出现一个小数点而没有多个小数点
      number_only = number_only.replace(/\.{2,}/g, ".");
      //保证小数点只出现一次，而不能出现两次以上
      number_only = number_only
        .replace(".", "$#$")
        .replace(/\./g, "")
        .replace("$#$", ".");
      //保证只能输入两个小数
      number_only = number_only.replace(/^(\-)*(\d+)\.(\d{6}).*$/, "$1$2.$3");
      if (str == "temp_problem") {
        this.temp_problem.riskAmount = number_only;
      } else {
        this.dqProblem.riskAmount = number_only;
      }
    },
    // 点击依据
    toopen (val) {
      if (val) {
        let _this = this;
        setTimeout(function () {
          _this.$refs["basisbtn0"].handleClick();
        }, 100);
        return false;
      }
    },

    //获取人员
    getperson () {
      axios({
        url: `/wisdomaudit/user/listUserInfo?pageCurrent=1&pageSize=1000`,
        headers: {
          TOKEN: this.dqtoken,
        },
        method: "get",
        data: {},
      }).then((res) => {
        this.personlist = res.data.data.list;

      });
    },
    change_zt (value) {
      let obj = {};
      obj = this.SPECIALList.find((item) => {
        return item.value === value; //筛选出匹配数据
      });
      let val = obj.value;
      this.temp_problem.special = obj.label;
      if (val == "otherzt") {
        this.input_select = false;
        this.temp_problem.special = "";
        this.zdyCode = 1;//自定义标识
      } else {
        this.zdyCode = 0;//自定义标识
      }
    },
    change_zte (value) {

      let obj = {};
      obj = this.SPECIALList.find((item) => {
        return item.value === value; //筛选出匹配数据
      });
      let val = obj.value;
      this.dqProblem.special = obj.label;
      if (val == "otherzt") {
        this.input_selecte = false;
        this.dqProblem.special = "";
        this.zdyCode = 1;//自定义标识
      } else {
        this.zdyCode = 0;//自定义标识
      }
    },

    // 审计问题 end====================================

    // 依据==================================================
    //确定选择依据
    surebasis () {
      this.basisdialog = false;
      if (this.ifadd == 0) {
        this.temp_problem.basis = this.dqbasis.choose;
      } else {
        this.dqProblem.basis = this.dqbasis.choose;
      }
      this.dqbasis.choose = [];
    },
    //选择依据
    choosebasis (val) {
      if (this.dqbasis.choose.indexOf(val) > -1) {
        this.$message({
          message: "您已引用这一条",
          type: "warning",
        });
        return;
      } else {
        this.dqbasis.choose.push(val);
        this.$message({
          message: "引用成功",
          type: "success",
        });
      }
    },
    //依据树
    treeNodeClick () { },
    //打开依据
    openbasis () {
      this.basisdialog = true;
      this.dqbasis.choose = [];
      this.dqbasis.info = "";
      this.dqbasis.val = "";
    },
    //获取依据
    getbasis () {
      axios({
        url: `/wisdomaudit/auditBasy/getAuditbasyList`,
        headers: {
          TOKEN: this.dqtoken,
        },
        method: "post",
        data: {
          basyName: "",
        },
      }).then((res) => {
        this.basislist = res.data.data;
      });
    },
    //模糊查询依据详情
    basisremoteMethod (query) {
      this.basisloading = true
      axios({
        url: `/wisdomaudit/auditBasy/getAuditbasyList`,
        headers: {
          TOKEN: this.dqtoken,
        },
        method: "post",
        data: {
          basyName: query,
        },
      }).then((res) => {
        this.basislist = res.data.data;
        this.basisloading = false
      });
    },
    //获取依据详情
    getbasisdetail (bid) {
      this.basisload = true;
      axios({
        url: `/wisdomaudit/auditBasy/getById/` + bid + ``,
        headers: {
          TOKEN: this.dqtoken,
        },
        method: "get",
        data: {},
      }).then((res) => {
        this.dqbasis.info = res.data.data.treeData;
        this.basisload = false;
      });
    },

    // 获取专题接口
    getloadcascader (str) {
      axios({
        url: `/wisdomaudit/init/loadcascader`,
        headers: {
          TOKEN: this.dqtoken,
        },
        method: "post",
        data: {
          typecode: str,
        },
      }).then((res) => {
        if (str == "Category") {
          this.CategoryList = res.data.data;
        } else if (str == "SPECIAL") {
          this.SPECIALList = res.data.data;
        }
      });
    },

    // 依据 end==================================================
    getSelectTask () {
      axios({
        url: `/wisdomaudit/auditTask/selectTask`,
        headers: {
          TOKEN: this.dqtoken,
        },
        method: "post",
        data: {
          managementProjectUuid: this.active_project,
        },
      }).then((res) => {
        this.auditTasklList = res.data.data;
      });
    },
    // 编辑
    openDetail (int) {
      this.ifadd = 1;
      this.temp_problem.attachmentList = []; //清空附件
      this.fileList2 = [];//清空附件


      axios({
        url:
          `/wisdomaudit/problemList/getById/` + this.list[int].problemListUuid,
        headers: {
          TOKEN: this.dqtoken,
        },
        method: "get",
        data: {},
      }).then((res) => {


        this.dqProblem = res.data.data;
        this.dqProblem.riskAmount = parseFloat(this.dqProblem.riskAmount)
        this.dqProblem.auditTaskUuid = this.dqProblem.auditTaskUuid.split(",");
        this.dqProblem.basis = this.dqProblem.basis
          ? this.dqProblem.basis.split(",")
          : [];
        this.ifupdata = true;

        if (this.dqProblem.basis.length == 0) {
          this.show = false;
        }

        this.dialogDetailVisible = true;
        this.$nextTick(() => {
          this.$refs["detailForm"].clearValidate();
        });
      });
    },
    checkDetail (pid) {
      this.ifadd = 2;
      axios({
        url: `/wisdomaudit/problemList/getById/` + pid,
        headers: {
          TOKEN: this.dqtoken,
        },
        method: "get",
        data: {},
      }).then((res) => {
        this.dqProblem = res.data.data;
        this.dqProblem.riskAmount = parseFloat(this.dqProblem.riskAmount)
        this.dqProblem.auditTaskUuid = this.dqProblem.auditTaskUuid.split(",");
        this.dqProblem.basis = this.dqProblem.basis
          ? this.dqProblem.basis.split(",")
          : [];
        this.ifupdata = false;
        this.dialogDetailVisible = true;
        this.$nextTick(() => {
          this.$refs["detailForm"].clearValidate();
        });
      });
    },
    repDate (data) {
      let date = new Date(data);
      let Y = date.getFullYear() + "-";
      let M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      let D =
        (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
      let h =
        (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
      let m =
        (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
        ":";
      let s =
        date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      return Y + M + D;
    },
    handleExceed () { },
    // 上传时
    update_ing () {
      this.success_btn = 1;
    },
    //新增问题 附件上传
    uploadPorgress2 (response, file, fileList, tableList) {
      this.success_btn = 0;
      if (response && response.code === 0) {
        response.data.isDeleted = 2;
        tableList.push(response.data);
        this.$message({
          message: '上传成功',
          type: 'success',
          duration: 1500,
          onClose: () => {
            // response.data.isDeleted=2;
            // tableList.push(response.data);
          }
        })
      } else {
        this.$message({
          message: '上传失败',
          type: 'error',
          duration: 1500,
          onClose: () => {

          }
        })
      }
    },


    //新增问题 附件删除
    handleRemove2 (file, fileList, tableList, showList, delList) {
      if (file.response) {
        tableList.remove(file.response.data);
        // this.key = Math.random();
      } else {
        showList.remove(file);
        file.isDeleted = 1;
        file.attStatus = 3

        delList.push(file);

      }
    },
    //新增问题 附件下载
    downFile2 (id, fileName) {
      let formData = new FormData()
      formData.append('fileId', id)
      down_file(formData).then(resp => {
        const content = resp;
        const blob = new Blob([content],
          { type: 'application/octet-stream,charset=UTF-8' }
        )
        if ('download' in document.createElement('a')) {
          // 非IE下载
          const elink = document.createElement('a')
          elink.download = fileName //下载后文件名
          elink.style.display = 'none'
          elink.href = window.URL.createObjectURL(blob)
          document.body.appendChild(elink)
          elink.click()
          window.URL.revokeObjectURL(elink.href) // 释放URL 对象
          document.body.removeChild(elink)
        } else {
          // IE10+下载
          navigator.msSaveBlob(blob, fileName)
        }
      }).catch((err) => {

      })
    },
    // 新增问题保存
    createData () {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {

          // 判断自定义的专题是否重复
          // if (this.zdyCode == 1) {
          //   let msg = true;
          //   this.SPECIALList.forEach(item => {
          //     if (item.label == this.temp_problem.special) {
          //       msg = false
          //       return false
          //     }
          //   })
          //   if (msg == false) {
          //     this.$message({
          //       message: '该专题已经存在',
          //       type: 'warning'
          //     });
          //     return false
          //   }
          // }

          // 新增回显
          if (this.type == 1) {
            // 新增刷列表
            let uploadList2 = this.attachmentList2.concat(this.fileList2, this.fileList2_del);
            uploadList2.forEach((item) => {
              item.status = null;
            });
            // 专题
            let params = {
              managementProjectUuid: this.active_project,
              // 业务分类
              auditTaskUuid: this.temp_problem.auditTaskUuid
                ? this.temp_problem.auditTaskUuid.join(",")
                : "",
              basis: this.temp_problem.basis ? this.temp_problem.basis.join(",") : "",
              describe: this.temp_problem.describe,
              field: this.temp_problem.field,
              special: this.temp_problem.special,
              isDeleted: 0,
              problem: this.temp_problem.problem,
              problemDiscoveryTime: this.temp_problem.problemDiscoveryTime,
              problemFindPeople: this.temp_problem.problemFindPeople,
              managementAdvice: this.temp_problem.managementAdvice,
              problemListUuid: this.temp_problem.problemListUuid,
              riskAmount: parseFloat(this.temp_problem.riskAmount),
              status: 0,
              attachmentList: uploadList2,
              zdyCode: this.zdyCode,
              entity: {
                belongSpcialSize: this.SPECIALList.length,
                dictname: this.temp_problem.special,
              },
            };

            axios({
              url: `/wisdomaudit/problemList/save`,
              headers: {
                TOKEN: this.dqtoken,
              },
              method: "post",
              data: params,
            }).then((res) => {

              if (res.data.code == 0) {
                this.$message({
                  message: "新增成功",
                  type: "success",
                });
                this.resetForm('temp_problem');
                this.save_problem();//新增问题 既是选择当前这条

              } else {
                this.$message({
                  message: res.msg,
                  type: "error",
                });
              }
            });
          } else {

            // 新增刷列表
            let uploadList2 = this.attachmentList2.concat(this.fileList2, this.fileList2_del);
            uploadList2.forEach((item) => {
              item.status = null;
            });
            // 专题
            let params = {
              managementProjectUuid: this.active_project,
              // 业务分类
              auditTaskUuid: this.temp_problem.auditTaskUuid
                ? this.temp_problem.auditTaskUuid.join(",")
                : "",
              basis: this.temp_problem.basis ? this.temp_problem.basis.join(",") : "",
              describe: this.temp_problem.describe,
              field: this.temp_problem.field,
              special: this.temp_problem.special,
              isDeleted: 0,
              problem: this.temp_problem.problem,
              problemDiscoveryTime: this.temp_problem.problemDiscoveryTime,
              problemFindPeople: this.temp_problem.problemFindPeople,
              managementAdvice: this.temp_problem.managementAdvice,
              problemListUuid: this.temp_problem.problemListUuid,
              riskAmount: parseFloat(this.temp_problem.riskAmount),
              status: 0,
              attachmentList: uploadList2,
              zdyCode: this.zdyCode,
              entity: {
                belongSpcialSize: this.SPECIALList.length,
                dictname: this.temp_problem.special,
              },
            };

            axios({
              url: `/wisdomaudit/problemList/save`,
              headers: {
                TOKEN: this.dqtoken,
              },
              method: "post",
              data: params,
            }).then((res) => {

              if (res.data.code == 0) {
                this.$message({
                  message: "新增成功",
                  type: "success",
                });
                this.resetForm('dqProblem');
                this.save_problem();//新增问题 既是选择当前这条
                this.init();//刷列表
              } else {
                this.$message({
                  message: res.msg,
                  type: "error",
                });
              }
            });
          }
          return false
        } else {
          return false;
        }
      });
    },


    // 临时需求

    //生成关联问题
    save_problem () {
      //编辑问题列表
      let params = {
        condition: {
          managementProjectUuid: this.active_project,
          problem: this.searchform.problem
        }
      };

      task_pageList_query(params).then(resp => {
        let datas = resp.data;
        // this.one_list = datas.records[0];
        let arr = [];
        arr.push(datas.records[0]);
        this.one_list = arr;


        this.temp_problem.auditTaskUuid = [];
        this.temp_problem.basis = [];
        this.temp_problem.describe = "";
        this.temp_problem.field = "";
        this.temp_problem.problem = "";
        this.temp_problem.problemDiscoveryTime = "";
        this.temp_problem.problemFindPeople = "";
        this.temp_problem.managementAdvice = "";
        this.temp_problem.riskAmount = "";
        this.temp_problem.special = "";
        this.zdyCode = 0;
        // this.belongSpcialCode = '',
        this.temp_problem.attachmentList = [];


        //编辑问题列表
        if (this.one_list && this.one_list.length >= 1) {
          var str = '', problemListUuidList = [];
          this.one_list.forEach((item, index) => {
            str += (index + 1) + "." + item.problem + '\n' + "\xa0\xa0\xa0" + item.describe + '\n';
            problemListUuidList.push(item.problemListUuid)
          });
          let _data = {
            str: str,
            problemListUuidList: problemListUuidList,
            one_list: this.one_list
          };
          this.formDetail.matterDetail = _data.str;
          this.formDetail.problemListUuidList = _data.problemListUuidList;
          this.formDetail.problemsNumber = this.one_list.length;

          // 确认的附件
          let datas = [];
          this.one_list.forEach((item, index) => {
            datas.push(item.attachmentList)
          })

          let imglist = [];
          let arr = [];
          datas.forEach((i, index) => {
            if (i.length !== 0) {
              imglist.push(i)
              arr = arr.concat(i)
            }
          })
          //
          this.fileArr = arr;//生成确认的附件
        }
      })
      this.visible = false;
      this.details = false;
    },


    // 问题 更新编辑保存
    updateData () {
      this.$refs["detailForm"].validate((valid) => {
        if (valid) {


          // 判断自定义的专题是否重复
          // if (this.zdyCode == 1) {
          //   let msg = true;
          //   this.SPECIALList.forEach(item => {
          //     if (item.label == this.dqProblem.special) {
          //       msg = false
          //       return false
          //     }
          //   })
          //   if (msg == false) {
          //     this.$message({
          //       message: '该专题已经存在',
          //       type: 'warning'
          //     });
          //     return false
          //   }
          // }


          // let rep = this.dqProblem;
          // rep.riskAmount = parseFloat(rep.riskAmount)
          // rep.auditTaskUuid = rep.auditTaskUuid.join(",");
          // rep.basis = rep.basis.join(",");


          let uploadList2 = this.attachmentList2.concat(this.fileList2, this.fileList2_del);
          uploadList2.forEach((item) => {
            item.status = null;
            // 新增的
            if (item.attStatus != 1 && item.attStatus != 3) {
              item.attStatus = 2
            }
          });
          this.dqProblem.attachmentList = uploadList2;//附件

          // 专题
          // this.dqProblem.zdyCode = this.zdyCode;

          let params = {
            managementProjectUuid: this.active_project,
            // 业务分类
            // auditTaskUuid: this.dqProblem.auditTaskUuid,
            // basis: this.dqProblem.basis,

            auditTaskUuid: this.dqProblem.auditTaskUuid
              ? this.dqProblem.auditTaskUuid.join(",")
              : "",
            basis: this.dqProblem.basis ? this.dqProblem.basis.join(",") : "",



            describe: this.dqProblem.describe,
            field: this.dqProblem.field,
            special: this.dqProblem.special,
            isDeleted: 0,
            problem: this.dqProblem.problem,
            problemDiscoveryTime: this.dqProblem.problemDiscoveryTime,
            problemFindPeople: this.dqProblem.problemFindPeople,
            managementAdvice: this.dqProblem.managementAdvice,
            problemListUuid: this.dqProblem.problemListUuid,
            riskAmount: this.dqProblem.riskAmount,
            status: 0,
            attachmentList: uploadList2,
            zdyCode: this.zdyCode,
            entity: {
              belongSpcialSize: this.SPECIALList.length,
              dictname: this.dqProblem.special,
            },
          };



          axios({
            url: `/wisdomaudit/problemList/update`,
            headers: {
              TOKEN: this.dqtoken,
            },
            method: "put",
            data: params,
          }).then((res) => {
            if (res.data.code == 0) {
              this.$message({
                message: "编辑成功",
                type: "success",
              });
              this.dialogDetailVisible = false;
              this.init();//刷新问题编辑的列表

            }
          });
        }
      });

    },

    // 编辑问题 标题查看详情
    details_show (data, index) {
      // this.Index = index
      // this.$nextTick(() => {
      this.details = true
      this.details_list = data;
      this.taskList = [];//清空人任务

      // this.auditTasklList.forEach(item => {
      //   if (this.details_list.auditTaskUuid == item.auditTaskUuid) {
      //     this.taskList.push(item)
      //   }
      // })

      let arr = this.details_list.auditTaskUuid.split(",")
      // console.log(arr);
      // console.log(this.auditTasklList);
      // 任务列表
      this.auditTasklList.forEach(item => {
        // console.log(item);
        arr.forEach(it => {
          // console.log(it);
          if (it == item.auditTaskUuid) {
            // console.log('匹配');
            this.taskList.push(item)
          }
        })
      })
      console.log(this.taskList);


      this.style_w = this.$refs.myBox.offsetWidth

      this.$set(this.details_list, 'style_width', this.style_w)

      // });
    },
    // 关闭
    close_mose () {
      this.details = false
    },

    // 编辑问题
    list_openDetail (id) {
      this.getloadcascader('SPECIAL');//专题数据
      this.ifadd = 1;
      this.fileList2 = [];
      this.fileList2_del = [];
      this.attachmentList2 = [];
      this.dqProblem.attachmentList = [];
      axios({
        url:
          `/wisdomaudit/problemList/getById/` + id,
        headers: {
          TOKEN: this.dqtoken,
        },
        method: "get",
        data: {},
      }).then((res) => {
        this.dqProblem = res.data.data;


        this.dqProblem.special = res.data.data.special
        this.dqProblem.riskAmount = parseFloat(this.dqProblem.riskAmount)
        this.dqProblem.auditTaskUuid = this.dqProblem.auditTaskUuid.split(",");
        this.dqProblem.basis = this.dqProblem.basis
          ? this.dqProblem.basis.split(",")
          : [];
        this.ifupdata = true;

        if (this.dqProblem.basis.length == 0) {
          this.show = false;
        }

        // 附件
        let datas = res.data.data

        if (datas.attachmentList) {
          datas.attachmentList.forEach((item) => {
            item.name = item.fileName;
            item.url = item.filePath;
            item.isDeleted = 0;
          });
        }
        this.fileList2 = datas.attachmentList || [];




        this.dialogDetailVisible = true;
        this.$nextTick(() => {
          this.$refs["detailForm"].clearValidate();
        });
      });
    },
    // 删除
    del_list (pid) {
      this.$confirm("确认删除该条数据吗?删除后数据不可恢复?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        axios({
          url: `/wisdomaudit/problemList/delete/` + pid,
          headers: {
            TOKEN: this.dqtoken,
          },
          method: "delete",
          data: {},
        }).then((res) => {
          if (res.data.code == 0) {
            this.$message({
              message: "删除成功",
              type: "success",
            });
            this.init();
          }
        });
      });
      let rep = [];
      // for(let i = 0;i<this.problemtableSelection.length;i++){
      //   rep.push(this.problemtableSelection[i].problemListUuid)
      // }
      // rep =  rep.join(",")
    },

    // 删除指定元素
    del_list_img (item) {
      for (let i = 0; i < this.fileArr.length; i++) {
        if (this.fileArr[i] == item) {
          this.fileArr.splice(i, 1)
        }
      }

    },


    // 点击编辑问题弹窗
    //关联问题点击
    getRelationQues () {
      // this.$nextTick(() => {
      //   this.$refs.searchTabel.init(this.active_project);
      // });
      this.init();
      this.details = false;
      this.visible = true;//显示编辑弹窗



    },

    // 初始化
    init () {
      let params = {
        pageNo: this.params3.pageNo,
        pageSize: this.params3.pageSize,
        condition: {
          managementProjectUuid: this.active_project,
          problem: this.searchform.problem
        }
      };
      this.load = true;
      task_pageList_query(params).then(resp => {
        this.load = false;
        let datas = resp.data;
        this.relationTabel2 = datas;
        this.details = false;
        this.visible = true;


      })
    },
    //关联问题多选的时候
    relationTabelSel (row) {
      this.multipleSelection = row
    },
    //生成关联问题
    setRelation () {
      if (this.multipleSelection.length >= 1) {
        var str = '', problemListUuidList = [];
        this.multipleSelection.forEach((item, index) => {
          str += (index + 1) + "." + item.problem + '\n' + "\xa0\xa0\xa0" + item.describe + '\n';
          problemListUuidList.push(item.problemListUuid)
        });
        var data = {
          str: str,
          problemListUuidList: problemListUuidList,
          multipleSelection: this.multipleSelection
        };

        this.formDetail.matterDetail = data.str;
        this.formDetail.problemListUuidList = data.problemListUuidList;
        this.formDetail.problemsNumber = data.multipleSelection.length;

        // 确认的附件
        let datas = [];
        this.multipleSelection.forEach((item, index) => {
          datas.push(item.attachmentList)
        })
        let imglist = [];
        let arr = [];
        datas.forEach((i, index) => {
          if (i.length !== 0) {
            imglist.push(i)
            arr = arr.concat(i)
          }
        })

        this.fileArr = arr;//生成确认的附件


        // if (arr) {
        //   arr.attachmentList.forEach((item) => {
        //     item.name = item.fileName;
        //     item.url = item.filePath;
        //     item.isDeleted = 0;
        //   });
        // }
        // this.fileList2 = datas.attachmentList || [];


        // this.$emit('refreshSearch', data)
      } else {
        this.$message('请至少选择一条数据进行生成');
        return false
      }
      this.visible = false;
      this.details = false;
    },

    //获取关联的问题
    // getSearchInfo (data) {
    //   this.formDetail.matterDetail = data.str;
    //   this.formDetail.problemListUuidList = data.problemListUuidList;
    //   this.formDetail.problemsNumber = data.multipleSelection.length;
    // },


    //分页点击
    handleSizeChange (val) {
      this.searchForm.pageSize = val;
      this.getData();
    },
    handleCurrentChange (val) {
      this.searchForm.pageNo = val;
      this.getData();
    },


    // -------------------------------------------
    // 被审计单位
    Company_data (params) {

      Company(params).then(resp => {
        this.Company_data_list = resp.data
      })
    },
    select_Company (val) {
      this.formDetail.auditDepart = val;
    },
    //列表附件删除
    delListFile (id) {
      var that = this;
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        del_file(id).then(resp => {
          if (resp.code == 0) {
            that.$message({
              message: "删除成功",
              type: "success",
            });
            this.list_data_start();
          } else {
            that.$message({
              message: resp.data.msg,
              type: "error",
            });
          }
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });


    },
    handleExceed () { },
    //附件上传
    uploadPorgress (response, file, fileList, tableList) {
      if (response && response.code === 0) {
        response.data.isDeleted = 2;
        tableList.push(response.data);
        this.$message({
          message: '上传成功',
          type: 'success',
          duration: 1500,
          onClose: () => {
            // response.data.isDeleted=2;
            // tableList.push(response.data);
          }
        })
      } else {
        this.$message({
          message: '上传失败',
          type: 'error',
          duration: 1500,
          onClose: () => {

          }
        })
      }
    },
    //附件删除
    handleRemove (file, fileList, tableList, showList, delList) {
      if (file.response) {
        tableList.remove(file.response.data);
        // this.key = Math.random();
      } else {
        showList.remove(file);
        file.isDeleted = 1;
        delList.push(file);

      }
    },
    //附件下载
    downFile (id, fileName) {
      let formData = new FormData()
      formData.append('fileId', id)
      down_file(formData).then(resp => {
        const content = resp;
        const blob = new Blob([content],
          { type: 'application/octet-stream,charset=UTF-8' }
        )
        if ('download' in document.createElement('a')) {
          // 非IE下载
          const elink = document.createElement('a')
          elink.download = fileName //下载后文件名
          elink.style.display = 'none'
          elink.href = window.URL.createObjectURL(blob)
          document.body.appendChild(elink)
          elink.click()
          window.URL.revokeObjectURL(elink.href) // 释放URL 对象
          document.body.removeChild(elink)
        } else {
          // IE10+下载
          navigator.msSaveBlob(blob, fileName)
        }
      }).catch((err) => {

      })
    },
    //获取用户信息
    getUser () {
      var that = this;
      get_userInfo().then(resp => {
        that.userInfo = resp.data;
        that.formDetail.reviewerName = that.userInfo.managementProject.projectChargemanName;
        that.formDetail.auditorsName = this.userInfo.user.realName;

        // sj[1]=sj[1]<10?'0'+sj[1]:sj[1];

        if (!!window.ActiveXObject || "ActiveXObject" in window) {
          var sj = new Date().toLocaleDateString()
          sj = sj.replace(/(年|月)/g, '/').replace('日', '').replace(/[^\d-/]/g, '').split('/');
          sj[1] = sj[1] < 10 ? '0' + sj[1] : sj[1];
          sj[2] = sj[2] < 10 ? '0' + sj[2] : sj[2];
        } else {
          var sj = new Date().toLocaleDateString().split('/');
          sj[1] = sj[1].padStart(2, '0');
          sj[2] = sj[2].padStart(2, '0');
        }
        that.formDetail.compileDate = sj[0] + "-" + sj[1] + "-" + sj[2];
        //
      })
    },
    //复核人列表
    getFhrList () {
      projectMembership_listUserInfo(1, 10000).then(resp => {
        this.FhrList = resp.data.list;
      })
    },
    //审计人员列表
    getSjryList () {
      var params = {
        condition: {
          managementProjectUuid: this.active_project,
        },
        pageNo: 1,
        pageSize: 1000000,
      };
      task_select_people(params).then(resp => {
        this.sjryList = resp.data.records;
      })
    },
    //附件上传时
    fileChange (file, fileList) {
      const loading = this.$loading({
        lock: true,
        text: '上传中',
        spinner: 'el-icon-loading',
        background: 'transparent'
      });
      if (file.response && file.response.code === 0) {
        loading.close();
        this.$message({
          message: '上传成功',
          type: 'success',
          duration: 1500,
          onClose: () => {

          }
        })
      } else if (file.response && file.response.code != 0) {
        loading.close();
        this.$message({
          message: '上传失败',
          type: 'error',
          duration: 1500,
          onClose: () => {

          }
        })
      }
    },
    //附件下载
    downFile (id, fileName) {
      let formData = new FormData()
      formData.append('fileId', id)
      down_file(formData).then(resp => {
        const content = resp;
        const blob = new Blob([content],
          { type: 'application/octet-stream,charset=UTF-8' }
        )
        if ('download' in document.createElement('a')) {
          // 非IE下载
          const elink = document.createElement('a')
          elink.download = fileName //下载后文件名
          elink.style.display = 'none'
          elink.href = window.URL.createObjectURL(blob)
          document.body.appendChild(elink)
          elink.click()
          window.URL.revokeObjectURL(elink.href) // 释放URL 对象
          document.body.removeChild(elink)
        } else {
          // IE10+下载
          navigator.msSaveBlob(blob, fileName)
        }
      }).catch((err) => {

      })
    },
    //点击确认单附件显示附件列表
    getFileList (id) {
      // alert(11)
      this.tableFileList = [];
      auditBasy_getFileList(id).then(resp => {
        this.tableFileList = resp.data;//确认单附件

      })
    },
    //删除
    deletes (val) {
      this.$confirm(`确认删除该条数据吗?删除后数据不可恢复`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        auditConfirmation_delete(val).then(resp => {
          if (resp.code == 0) {
            this.$message({
              message: "删除成功",
              type: "success",
            });
            this.list_data_start();
          } else {
            this.$message({
              message: resp.data.msg,
              type: "error",
            });
          }
        });
      }).catch(() => { })

    },
    //编辑
    edit (row, name) {
      this.clearForm();
      this.fileArr = [];//清空回显附件
      if (name == 'edit') {
        this.confirmationDialogTitle = "编辑确认单";
        this.ifLook = false;

      } else if (name == 'look') {
        this.ifLook = true;
        this.confirmationDialogTitle = "查看确认单";
      }

      this.getDetail(row);


      // 显示二级部门
      if (this.auditOrgName == '省本部') {
        this.compileDate = true;
      }
    },
    getDetail (row) {
      auditConfirmation_getDetail(row.auditConfirmationUuid).then(resp => {
        var datas = resp.data;
        this.formDetail = datas;
        this.confirmationDialogVisible = true;//显示确认单
        if (this.formDetail.auditOrgOpinion.indexOf("情况属实") == -1) {
          this.formDetail.auditOrgOpinion = "情况属实\n" + this.formDetail.auditOrgOpinion
        }
        if (datas.attachmentList) {
          datas.attachmentList.forEach((item) => {
            item.name = item.fileName;
            item.url = item.filePath;
            item.isDeleted = 0;
          });
        }
        this.fileList1 = datas.attachmentList || [];
        this.fileArr = datas.fileArrList;//回显问题附件


        // if (this.projectType == 'zxsj') {
        //   this.confirmationDialogVisibleZx = true;
        //   if (this.formDetail.auditOrgOpinion.indexOf("情况属实") == -1) {
        //     this.formDetail.auditOrgOpinion = "情况属实\n" + this.formDetail.auditOrgOpinion
        //   }
        //   // }else if (this.projectType == 'jzsj') {
        // } else {
        //   this.confirmationDialogVisible = true;
        // }
      })
    },
    getLook (row, column, event) {
      this.clearForm();
      this.ifLook = true;
      this.isAdd = true;
      this.confirmationDialogTitle = "查看确认单";
      this.getDetail(row);
    },
    //列表数据
    list_data_start () {
      let params = {
        pageNo: this.params2.pageNo,
        pageSize: this.params2.pageSize,
        condition: {
          managementProjectUuid: this.active_project,
        }
      };

      this.confirmaryData_loding = true
      auditConfirmation_pageList(params).then(resp => {
        var datas = resp.data;
        this.confirmaryData = true;
        this.confirmaryData = datas.dataList;
        this.managementProjectName = datas.managementProjectName;
        this.auditOrgName = datas.auditOrgName;
        this.projectType = datas.projectType;
        this.confirmaryData_loding = false;
        this.getUser();
      })
    },
    //   新增确认单按钮事件
    addConfirmation () {
      this.clearForm();

      this.fileArr = [];//清空回显附件
      this.getUser();
      this.ifLook = false;
      this.confirmationDialogTitle = "新增确认单";
      this.confirmationDialogVisible = true;//显示确认单

      // 显示二级部门
      if (this.auditOrgName == '省本部') {
        this.compileDate = true;
      }

    },
    // 增加弹出框关闭事件
    handleClose () {
      // this.$refs[dataForm].resetFields();
      this.dataForm = {};//清空
      this.compileDate = false;//隐藏二级部门
      this.confirmationDialogVisible = false
      // this.confirmationDialogVisibleZx = false
    },


    debounce (fn, delay = 300) {   //默认300毫秒
      var timer;
      return function () {
        var args = arguments;
        if (timer) {
          clearTimeout(timer);
        }
        timer = setTimeout(() => {
          fn.apply(this, args);   // this 指向vue
        }, delay);
      };
    },
    //保存审计确认单
    saveForm (addForm, types) {
      this.isDisable = true;
      setTimeout(() => {
        this.isDisable = false;
      }, 3000);
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          var uploadList1 = this.attachmentList1.concat(this.fileList1, this.fileList1_del);


          uploadList1.forEach((item) => {
            item.status = null;
          });
          this.formDetail.attachmentList = uploadList1;
          if (this.confirmationDialogTitle == '新增确认单') {
            this.formDetail.managementProjectName = this.managementProjectName;
            this.formDetail.auditOrgName = this.auditOrgName;
            this.formDetail.managementProjectUuid = this.active_project;
            // let arr = this.fileArr.join(',');
            // let arr = { ...this.fileArr };

            this.formDetail.fileArrList = this.fileArr;//生成 后的 数组
            // 1确认 2生成
            if (types == 1) {
              this.formDetail.butt = ''
            } else {
              this.formDetail.butt = 2
              this.formDetail.auditOrgOpinion = '情况属实\n'
            }
            auditConfirmation_save(this.formDetail).then(resp => {
              if (resp.code == 0) {
                this.$message({
                  message: "保存成功",
                  type: "success",
                });
                this.confirmationDialogVisible = false;
                this.list_data_start();
              } else {
                this.$message({
                  message: resp.data.msg,
                  type: "error",
                });
              }

            })
          } else {
            // 1确认 2生成
            if (types == 1) {
              this.formDetail.butt = ''
            } else {
              this.formDetail.butt = 2
              this.formDetail.auditOrgOpinion = '情况属实\n'
            }

            this.formDetail.fileArrList = this.fileArr;//生成 后的 数组

            auditConfirmation_update(this.formDetail).then(resp => {
              if (resp.code == 0) {
                this.$message({
                  message: "修改成功",
                  type: "success",
                });
                this.confirmationDialogVisible = false;
                // this.confirmationDialogVisibleZx = false;
                this.list_data_start();
              } else {
                this.$message({
                  message: resp.data.msg,
                  type: "error",
                });
              }

            })
          }
        } else {
          this.$message.error("请添加必填项和正确的数据格式");
          return false;
        }
      });
    },
    clearForm () {
      this.formDetail = {
        attachmentList: [],
        matter: '',
        matterDetail: '',
        auditorsName: '',
        reviewerName: '',
        compileDate: '',
        auditOrgOpinion: '',
        principalName: '',
        principalPost: '',
        signatureDate: '',
      };
      this.attachmentList1 = [];
      this.fileList1 = [];
      this.fileList1_del = [];
      if (this.$refs['addForm']) {
        this.$refs['addForm'].resetFields();
      }

    },
  },
};
</script>

<style >
.el-popover.popover2 {
  padding: 0 !important;
  transform: translate(-50%, 0%);
  left: 50% !important;
  /* box-shadow: none !important;
  border: none !important;
  background: none !important; */
}
.el-popover.popover2[x-placement^="bottom"] .popper__arrow {
  left: 150px !important;
  opacity: 0 !important;
}
</style>

<style lang="scss" scoped>
.confirmaryTable {
  .update {
    display: flex;
    align-items: left;
    justify-content: left;
  }
  .update_icon {
    width: 15px;
    height: 15px;
  }
  .update_icon svg {
    float: left;
    width: 15px;
    height: 15px;
  }
  .update span {
    color: #1371cc;
    margin-left: 5px;
  }
  .btnStyle {
    background: none;
    border: 0px;
    margin: 0 3px;
    font-size: 14px;
  }
}
.title {
  border-bottom: 1px solid #d2d2d2;
  padding: 15px;
  text-align: center;
  font-weight: bold;
  font-size: 14px;
}
.formData {
  // border: 1px solid red;
  /*padding: 2%;*/
  .el-button {
    border-color: #ececec;
    color: #9e9e9f;
  }
}
</style>
<style scoped>
@import "../../../assets/styles/css/yw.css";
>>> .el-table__header {
  margin-top: 0 !important;
}

.citebtn {
  margin-left: 15px;
}
.dlag_wi >>> .el-dialog {
  min-width: 960px;
}

/* 上传的文件列表禁止删除 */
.upload-demo {
  position: relative;
}
.ifLook_upload {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  cursor: not-allowed;
}
/* 上传的文件列表禁止删除 */

/* 分页样式 */
.page {
  width: 100%;
  padding: 20px 10px;
  display: flex;
  justify-content: flex-end;
}
/* 分页样式 end*/
.one {
  /* display: flex; */
}
.one .one_p {
  box-sizing: border-box;
  width: 33%;
  float: left;
}
/* 生成后选择的附件 */
.query_list {
  width: 70%;
  margin-top: 20px;
  margin-bottom: 20px;
  float: left;
}
.query_list li {
  width: 100%;
  float: left;
  height: 20px;
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  position: relative;
}
.query_list li div {
  position: relative;
  padding: 0 3%;
}
.query_list li div i {
  position: absolute;
  left: 2px;
  top: 2px;
}

.query_list li p {
  float: left;
  width: 100%;
  height: 20px;
  line-height: 20px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  box-sizing: border-box;
  word-break: break-all;
}
.query_list li div,
.query_list span {
  cursor: pointer;
}
.edit span,
.edit p {
  cursor: pointer;
  color: rgba(0, 0, 0, 0.7) !important;
}
.edit span:hover,
.edit p:hover {
  color: #1890ff !important;
}
.look span,
.look p,
.look p:hover,
.look span:hover {
  cursor: not-allowed;
  color: rgba(0, 0, 0, 0.7) !important;
}
.query_list span {
  position: absolute;
  top: 0;
  right: 0;
  width: 20px;
  font-size: 14px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  cursor: pointer;
}
/* 筛选 */
.search >>> .el-input__inner::-webkit-input-placeholder {
  color: #c0c4cc !important;
}
.search {
  display: flex;
  justify-content: flex-end;
  padding: 20px;
  box-sizing: border-box;
  position: relative;
}
.search >>> .el-input__inner {
  width: 250px !important;
  display: flex;
  float: right;
  /* border-radius: 0 !important; */
}
.search >>> .el-button {
  /* border-radius: 0 !important; */
}
.search >>> .search_icon {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 36px;
  height: 36px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  cursor: pointer;
  border-radius: 0 4px 4px 0;
}
/* 筛选  end*/
/* .edit_table >>> .el-table__row,
.edit_table >>> table tr,
.edit_table >>> .el-table__cell,
.edit_table >>> .has-gutter {
  height: 40px;
  max-height: 40px;
} */
/* .dlag >>> .el-table__header-wrapper .has-gutter {
  border: 1px solid red;
  padding: 3px 0 !important;
} */
.edit_table >>> .el-dialog {
  min-width: 800px;
}
.edit_table >>> .el-table__row td {
  padding: 3px 0 !important;
  /* border: 1px solid blue; */
  box-sizing: border-box;
}

/* 问题详情框 */
.mose {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 9998;
}
.dlag {
  position: relative;
}
.problem_details_conter {
  width: 100%;
  /* position: absolute; */
  /* top: 90px; */
  /* left: 0; */
  /* padding: 0 20px; */
  box-sizing: border-box;
  /* z-index: 100;
  border: 1px solid red; */
  float: right;
}
.problem_details_conter .list {
  margin: 0 auto;
  width: 100%;
  padding: 20px 0 20px 20px;
  box-sizing: border-box;
  background: #f5f5f9;
  display: flex;
  flex-wrap: wrap;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  height: 250px;
  /* overflow-y: auto; */
  overflow-y: scroll;
  overflow-x: hidden;
}
.list li {
  float: left;
  width: 100%;
  margin-bottom: 20px;
  text-align: left;
  line-height: 20px;
  box-sizing: border-box;
  color: rgba(0, 0, 0, 0.8);
}
.list li:last-child {
  margin-bottom: 0;
}
.list li p {
  /* width: 33%;
  float: left; */
  text-align: left;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  display: inline-block;
  width: calc(100% - 130px);
  line-height: 20px;
}
.list li .sp {
  /* width: 130px; */
  text-align: right;
}
.list li p span {
  font-weight: 500;
}
/* 问题详情框 end*/

/* 编辑   */
.edit_table >>> .zb-form .el-form-item {
  margin-bottom: 10px !important;
}
.edit_table >>> .zb-form .el-form-item__content {
  width: 30%;
  display: inline-block;
}
.edit_table >>> .zb-form .el-form-item__label {
  width: 20% !important;
  text-align: right !important;
  display: inline-block;
}
.relation-div-footer {
  margin-top: 10px;
  text-align: center;
}
.edit_table >>> .relation-div-footer button {
  margin-left: 10px;
}
.relation-div {
  width: 100%;
  padding: 10px;
  margin-top: 10px;
}
.edit_table >>> .relationTabelClass label {
  width: auto !important;
}
.edit_table >>> .relation-div-search .el-form-item__content {
  position: static !important;
}
.relation-div-search {
  text-align: right;
  clear: both;
}
.searchBtn button {
  background: #0089d6 !important;
  color: #fff !important;
}
.edit_table >>> .searchBtn .el-input-group__append {
  border: none !important;
}
/* 编辑  end */

.qrd-dialog >>> .el-dialog__header,
.qrd-dialog >>> .el-dialog__body {
  padding: 0 !important;
}
.qrd-dialog >>> .el-dialog__headerbtn {
  top: 15px !important;
  right: 15px !important;
}
.qrd-dialog >>> .el-dialog__footer {
  padding-left: 35px !important;
  padding-right: 35px !important;
}
.relationBtn {
  margin-bottom: 10px;
  border-color: #dcdfe6 !important;
  display: block;
}
.list-folder {
  color: orange;
  margin-right: 5px;
}
.smb-folder {
  transform: scale(1.1);
  display: inline-block;
}
.smb-btn {
  font-size: 14px !important;
  color: #666;
  font-weight: normal !important;
}
>>> .list-folder-btn {
  font-weight: normal;
  background: transparent;
  border: none;
  color: blue;
}
.zxTabel-div {
  padding: 20px;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
}
.zxTabel {
  box-sizing: border-box;
  border: 1px solid #ddd;
  width: 100%;
}
.zxTabel > tr:not(:last-child) {
  border-bottom: 1px solid #ddd;
  background: #fff;
}
.zxTabel td {
  padding: 10px;
}
.zxTabel td:not(:last-child) {
  border-right: 1px solid #ddd;
}
.inline-block {
  display: inline-block !important;
}
.blue {
  color: blue;
}
.orange {
  color: orange;
}
>>> .el-form-item {
  margin-bottom: 20px !important;
}
>>> .el-dialog__footer {
  text-align: center;
}
>>> .btnStyle .el-upload {
  width: 100% !important;
  margin: 0 !important;
  text-align: center !important;
}

>>> .itemOne .el-form-item__content {
  width: 77% !important;
}
.itemOne .el-select,
.itemOne .el-textarea {
  width: 70% !important;
}
>>> .itemThree .el-form-item__content {
  margin-left: 140px !important;
}
.itemTwo {
  width: 48.5%;
}
.itemTwo .el-select {
  width: 100% !important;
}
>>> .itemTwo .el-form-item__content {
  width: 53% !important;
}
>>> .itemThree .el-form-item__label {
  width: 130px !important;
}
>>> .upload-yw .el-form-item__content {
  width: 60% !important;
}
.tableFileList-li > div {
  width: 85%;
  vertical-align: middle;
}
.delFile {
  width: 15%;
  text-align: right;
  vertical-align: middle;
  font-weight: bold;
}

/* 依据 */
.yj-sel >>> .el-select__tags > span,
.task >>> .el-select__tags > span {
  width: 100%;
  display: block !important;
}
.yj-sel >>> .el-tag--info,
.task >>> .el-tag--info {
  float: left;
}
.yj-sel >>> .el-tree-node__children {
  overflow: hide !important;
}
>>> .el-tree-node__label {
  overflow: hidden;
  text-overflow: ellipsis;
  box-sizing: border-box;
  word-break: break-all;
  white-space: normal !important;
  height: 16px;
  font-size: 14px;
  line-height: 16px;
}
>>> .tree {
  background: #f2f2f2 !important;
}
>>> .el-tree-node__content {
  cursor: pointer;
  height: 24px !important;
  padding-right: 10px;
  box-sizing: border-box;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  box-sizing: border-box;
  word-break: break-all;
}
.bag >>> .el-textarea__inner,
.bag >>> .el-textarea__inner:focus {
  border: 1px solid #dfe4ed !important;
  color: rgba(0, 0, 0, 0.25) !important;
  /* color: #606266 !important; */
  background: #f5f7fa !important;
  cursor: not-allowed;
}
</style>
