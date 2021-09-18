/** When your routing table is too long, you can split it into small modules **/

import { AppMain } from '@/layout/components'
import Layout from '@/layout/index'

const wisdomauditRouter = {

  path: '/audit',
  component: Layout,
  redirect: '/audit/project',
  name: 'Audit',
  meta: {
    title: '首页',
    icon: 'nested'
  },
  children: [
    {
      path: 'project',
      name: 'project',
      component: () => import('@WISDOMAUDIT/views/audit/project'),
      meta: {
        title: '审计概览123'
      },
    },
    {
      path: 'projectInit',
      name: 'projectInit',
      redirect: '/audit/projectInit/application',
      component: AppMain,
      meta: {
        title: '风险监控'
      },
      children: [
        {
          path: 'application',
          name: 'application',
          component: () => import('@WISDOMAUDIT/views/audit/accountableAdd'),
          meta: {
            title: '立项申请'
          }
        },
        {
          path: 'responseAdd',
          name: 'responseAdd',
          component: () => import('@WISDOMAUDIT/views/audit/responseAdd'),
          meta: {
            title: '经责新增'
          }
        },
        {
          path: 'uninitialized',
          name: 'uninitialized',
          component: () => import('@WISDOMAUDIT/views/audit/uninitialized'),
          meta: {
            title: '未初始化'
          }
        },
        {
          path: 'subprojectInit',
          name: 'subprojectInit',
          component: () => import('@WISDOMAUDIT/views/audit/subprojectInit'),
          meta: {
            title: '子项目立项申请'
          }
        },
        {
          path: 'modelReference',
          name: 'modelReference',
          component: () => import('@WISDOMAUDIT/views/audit/modelReference'),
          meta: {
            title: '模型引用'
          }
        },
        {
          path: 'indexReference',
          name: 'indexReference',
          component: () => import('@WISDOMAUDIT/views/audit/indexReference'),
          meta: {
            title: '指标引用'
          }
        },
        {
          path: 'modelparamSetting',
          name: 'modelparamSetting',
          component: () => import('@WISDOMAUDIT/views/audit/modelparamSetting'),
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
          component: () => import('@WISDOMAUDIT/views/audit/projectmanagement'),
          meta: {
            title: '项目管理'
          }
        },
        {
          path: 'projectWorkbench',
          name: 'projectWorkbench',
          component: () => import('@WISDOMAUDIT/views/audit/projectworkbench'),
          meta: {
            title: '项目工作台'
          }
        },
      ]
    },
    {
      path: 'personalManage',
      name: 'personalManage',
      component: () => import('@WISDOMAUDIT/views/audit/personalManage'),
      meta: {
        title: '知识库'
      }
    },
    {
      path: 'audittasknode',
      name: 'audittasknode',
      component: () => import('@WISDOMAUDIT/views/audit/audittasknode'),
      meta: {
        title: '数据管理'
      }
    },
    {
      path: 'riskwarning',
      name: 'riskwarning',
      component: () => import('@WISDOMAUDIT/views/audit/riskwarning'),
      meta: {
        title: '风险提示'
      },
      hidden: true
    },
    {
      path: 'manageSuggest',
      name: 'manageSuggest',
      component: () => import('@WISDOMAUDIT/views/audit/manageSuggest'),
      meta: {
        title: '管理建议'
      },
      hidden: true
    },
    {
      path: 'statisticsReport',
      name: 'statisticsReport',
      component: () => import('@WISDOMAUDIT/views/audit/statisticsReport'),
      meta: {
        title: '模型管理'
      },
    },
    {
      path: 'statisticsReport',
      name: 'statisticsReport',
      component: () => import('@WISDOMAUDIT/views/audit/statisticsReport'),
      meta: {
        title: '系统管理'
      },
    },
  ]
}

export default wisdomauditRouter
