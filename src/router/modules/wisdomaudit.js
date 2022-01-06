/** When your routing table is too long, you can split it into small modules **/


const wisdomauditRouter = {
  path: "/audit",
  component:  () => import('@WISDOMAUDIT/layout/index'),
  redirect: "/audit/home",
  name: "Audit",
  meta: {
    title: "首页",
    icon: "nested"
  },
  children: [
    {
      path: "home",
      name: "home",
      component: () => import("@WISDOMAUDIT/views/audit/home"),
      meta: {
        title: "首页"
      }
    },
    {
      path: "project",
      name: "project",
      component: () => import("@WISDOMAUDIT/views/audit/project"),
      meta: {
        title: "审计概览"
      }
    },

    // {
    //   path: "riskMonitoring",
    //   name: "riskMonitoring",
    //   redirect: "/riskMonitoring/riskScan/personal",
    //   component:  () => import('@WISDOMAUDIT/layout/components'),
    //   meta: {
    //     title: "风险监控"
    //   },
    //   children: [
    //     {
    //       path: "riskScan",
    //       name: "riskScan",
    //       component: () => import("@WISDOMAUDIT/layout/blank"),
    //       // component: () => import('@WISDOMAUDIT/views/audit/accountableAdd'),
    //       // wisdomaudit-vue\src\views\audit\riskScan\personal
    //       meta: {
    //         title: "风险扫描"
    //       },
    //       children: [
    //         {
    //           path: "personal",
    //           name: "personal",
    //           component: () =>
    //             import("@WISDOMAUDIT/views/audit/riskScan/personal"),
    //           meta: {
    //             title: "个人"
    //           }
    //         },
    //         {
    //           path: "enterprise",
    //           name: "enterprise",
    //           component: () =>
    //             import("@WISDOMAUDIT/views/audit/riskScan/enterprise"),
    //           meta: {
    //             title: "政企"
    //           }
    //         }
    //       ]
    //     }
    //   ]
    // },

    // {
    //   path: "projectInit",
    //   name: "projectInit",
    //   redirect: "/audit/projectInit/application",
    //   component: AppMain,
    //   meta: {
    //     title: "风险监控"
    //   },
    //   children: [
    //     {
    //       path: "application",
    //       name: "application",
    //       component: () => import("@WISDOMAUDIT/views/audit/accountableAdd"),
    //       meta: {
    //         title: "立项申请"
    //       }
    //     },
    //     {
    //       path: "responseAdd",
    //       name: "responseAdd",
    //       component: () => import("@WISDOMAUDIT/views/audit/responseAdd"),
    //       meta: {
    //         title: "经责新增"
    //       }
    //     },
    //     {
    //       path: "uninitialized",
    //       name: "uninitialized",
    //       component: () => import("@WISDOMAUDIT/views/audit/uninitialized"),
    //       meta: {
    //         title: "未初始化"
    //       }
    //     },
    //     {
    //       path: "subprojectInit",
    //       name: "subprojectInit",
    //       component: () => import("@WISDOMAUDIT/views/audit/subprojectInit"),
    //       meta: {
    //         title: "子项目立项申请"
    //       }
    //     },
    //     {
    //       path: "modelReference",
    //       name: "modelReference",
    //       component: () => import("@WISDOMAUDIT/views/audit/modelReference"),
    //       meta: {
    //         title: "模型引用"
    //       }
    //     },
    //     {
    //       path: "indexReference",
    //       name: "indexReference",
    //       component: () => import("@WISDOMAUDIT/views/audit/indexReference"),
    //       meta: {
    //         title: "指标引用"
    //       }
    //     },
    //     {
    //       path: "modelparamSetting",
    //       name: "modelparamSetting",
    //       component: () => import("@WISDOMAUDIT/views/audit/modelparamSetting"),
    //       meta: {
    //         title: "模型参数设置"
    //       }
    //     }
    //   ]
    // },

    {
      path: "auditItems",
      name: "auditItems",
      component:  () => import('@WISDOMAUDIT/layout/components'),
      meta: {
        title: "审计项目"
      },
      children: [
        {
          path: "application",
          name: "application",
          component: () => import("@WISDOMAUDIT/views/audit/projectmanagement"),
          meta: {
            title: "项目管理"
          }
        },
        {
          path: "projectWorkbench",
          name: "projectWorkbench",
          component: () => import("@WISDOMAUDIT/views/audit/projectworkbench"),
          meta: {
            title: "项目工作台"
          }
        },
        {
          path: "feedback",
          name: "Feedback",
          component: () => import("@WISDOMAUDIT/views/audit/feedback"),
          meta: {
            title: "反馈审计资料"
          }
        }
      ]
    },
    {
      path: "personalManage",
      name: "personalManage",
      component:  () => import('@WISDOMAUDIT/layout/components'),
      // component: () => import('@WISDOMAUDIT/views/audit/personalManage'),
      meta: {
        title: "知识库"
      },
      children: [
        {
          path: "auditbasis",
          name: "Auditbasis",
          component: () => import("@WISDOMAUDIT/views/audit/auditbasis"),
          meta: {
            title: "审计依据"
          }
        },
        {
          path: "excellentcases",
          name: "Excellentcases",
          component: () => import("@WISDOMAUDIT/views/audit/excellentcases"),
          meta: {
            title: "优秀案例及内参"
          }
        },
        {
          path: "ModelList",
          name: "ModelList",
          component: () => import("@WISDOMAUDIT/views/audit/ModelList"),
          meta: {
            title: "模型清单"
          }
        },
        {
          path: "auditHistory",
          name: "auditHistory",
          component: () => import("@WISDOMAUDIT/views/audit/knowledgeBase/Historicalaudit"),
          meta: {
            title: "省内审计发现"
          }
        }
      ]
    },
    {
      path: "audittasknode",
      name: "audittasknode",
      component: () => import("@WISDOMAUDIT/views/audit/audittasknode"),
      meta: {
        title: "数据管理"
      }
    }
  ]
};

export default wisdomauditRouter;
