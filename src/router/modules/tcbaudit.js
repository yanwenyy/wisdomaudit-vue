/** When your routing table is too long, you can split it into small modules **/

import { AppMain } from '@/layout/components'
import Layout from '@/layout/index'

const sdmobileRouter = {
  path: '/audit',
  component: Layout,
  redirect: '/audit/project',
  name: 'Audit',
  meta: {
    title: '审计项目管理',
    icon: 'nested'
  },
  children: [
    {
      path: 'project',
      name: 'project',
      component: () => import('@SDMOBILE/views/audit/project'),
      meta: {
        title: '项目负责人查看'
      },
    },
    {
      path: 'projectInit',
      name: 'projectInit',
      redirect: '/audit/projectInit/application',
      component: AppMain,
      meta: {
        title: '项目立项'
      },
      children: [
        {
          path: 'application',
          name: 'application',
          component: () => import('@SDMOBILE/views/audit/accountableAdd'),
          meta: {
            title: '立项申请'
          }
        },
        {
          path: 'responseAdd',
          name: 'responseAdd',
          component: () => import('@SDMOBILE/views/audit/responseAdd'),
          meta: {
            title: '经责新增'
          }
        },
        {
          path: 'uninitialized',
          name: 'uninitialized',
          component: () => import('@SDMOBILE/views/audit/uninitialized'),
          meta: {
            title: '未初始化'
          }
        },
        {
          path: 'subprojectInit',
          name: 'subprojectInit',
          component: () => import('@SDMOBILE/views/audit/subprojectInit'),
          meta: {
            title: '子项目立项申请'
          }
        },
        {
          path: 'modelReference',
          name: 'modelReference',
          component: () => import('@SDMOBILE/views/audit/modelReference'),
          meta: {
            title: '模型引用'
          }
        },
        {
          path: 'indexReference',
          name: 'indexReference',
          component: () => import('@SDMOBILE/views/audit/indexReference'),
          meta: {
            title: '指标引用'
          }
        },
        {
          path: 'modelparamSetting',
          name: 'modelparamSetting',
          component: () => import('@SDMOBILE/views/audit/modelparamSetting'),
          meta: {
            title: '模型参数设置'
          }
        },
      ],
    },
    {
      path: 'auditItems',
      name: 'auditItems',
      component: AppMain,
      meta: {
        title: '审计项目'
      },
      children: [
        {
          path: 'application',
          name: 'application',
          component: () => import('@SDMOBILE/views/audit/projectmanagement'),
          meta: {
            title: '项目管理'
          }
        },
        {
          path: 'projectWorkbench',
          name: 'projectWorkbench',
          component: () => import('@SDMOBILE/views/audit/projectworkbench'),
          meta: {
            title: '项目工作台'
          }
        },
      ]
    },
    {
      path: 'personalManage',
      name: 'personalManage',
      component: () => import('@SDMOBILE/views/audit/personalManage'),
      meta: {
        title: '人员管理'
      }
    },
    {
      path: 'audittasknode',
      name: 'audittasknode',
      component: () => import('@SDMOBILE/views/audit/audittasknode'),
      meta: {
        title: '项目资料树'
      }
    },
    {
      path: 'riskwarning',
      name: 'riskwarning',
      component: () => import('@SDMOBILE/views/audit/riskwarning'),
      meta: {
        title: '风险提示'
      },
      hidden: true
    },
    {
      path: 'manageSuggest',
      name: 'manageSuggest',
      component: () => import('@SDMOBILE/views/audit/manageSuggest'),
      meta: {
        title: '管理建议'
      },
      hidden: true
    },
    {
      path: 'statisticsReport',
      name: 'statisticsReport',
      component: () => import('@SDMOBILE/views/audit/statisticsReport'),
      meta: {
        title: '报表统计'
      },
    }
    // ,
    // {
    //   path: 'servermonitor',
    //   name: 'servermonitor',
    //   component: () => import('@SDMOBILE/views/audit/servermonitor'),
    //   meta: {
    //     title: '服务器监控'
    //   },
    //   hidden: true
    // },
    //
    // {
    //   // 传递状态为1为查看，0为编辑
    //   path: 'definition/:id/:status',
    //   name: 'projectsdefinitiondetails',
    //   component: resolve => require(['@SDMOBILE/views/audit/workflow/details/index'], resolve),
    //   meta: {
    //     title: `流程定义详情`
    //   },
    //   hidden: true
    // }
  ]
}

export default sdmobileRouter
