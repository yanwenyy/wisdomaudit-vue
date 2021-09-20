import { AppMain } from '@/layout/components'
import Layout from '@/layout/index'


const riskmonitoringRouter =
{
  path: '/modelmanagement',
  component: Layout,
  // redirect: '/audit/project',
  name: 'modelmanagement',
  meta: {
    title: '模型管理',
    icon: 'nested'
  },
  children: [
    {
      path: 'model',
      name: 'model',
      component: AppMain,
      meta: {
        title: '模型管理',
      },
      children: [
        {
          path: 'aduitmodel',
          name: 'aduitmodel',
          component: () => import('@SDMOBILE/views/audit/responseAdd'),
          meta: {
            title: '审计模型'
          },
        },
        {
          path: 'result',
          name: 'result',
          component: () => import('@SDMOBILE/views/audit/responseAdd'),
          meta: {
            title: '模型结果'
          },
        },
        {
          path: 'parameter',
          name: 'parameter',
          component: () => import('@SDMOBILE/views/audit/responseAdd'),
          meta: {
            title: '模型参数'
          },
        },
      ]
    },
    {
      path: 'runbatch',
      name: 'runbatch',
      component: AppMain,
      meta: {
        title: '模型跑批',
      },
      children: [
        {
          path: 'settings',
          name: 'settings',
          component: () => import('@SDMOBILE/views/audit/responseAdd'),
          meta: {
            title: '模型跑批设置'
          },
        },
        {
          path: 'runresult',
          name: 'runresult',
          component: () => import('@SDMOBILE/views/audit/responseAdd'),
          meta: {
            title: '模型跑批结果'
          },
        },
        {
          path: 'warnmanagement',
          name: 'warnmanagement',
          component: () => import('@SDMOBILE/views/audit/responseAdd'),
          meta: {
            title: '预警阈值管理'
          },
        },
      ]
    },


    {
        path: 'clueverification',
        name: 'clueverification',
        component: AppMain,
        meta: {
          title: '线索核实',
        },
        children: [
          {
            path: 'verification',
            name: 'verification',
            component: () => import('@SDMOBILE/views/audit/responseAdd'),
            meta: {
              title: '线索核实'
            },
          },
        ]
      },

    
    
      {
        path: 'analuslstools',
        name: 'analuslstools',
        component: AppMain,
        meta: {
          title: '分析工具',
        },
        children: [
          {
            path: 'sql',
            name: 'sql',
            component: () => import('@SDMOBILE/views/audit/responseAdd'),
            meta: {
              title: 'SQL编辑器'
            },
          },
          {
            path: 'modeltools',
            name: 'modeltools',
            component: () => import('@SDMOBILE/views/audit/responseAdd'),
            meta: {
              title: '图形化建模工具'
            },
          },
          {
            path: 'indicatortools',
            name: 'indicatortools',
            component: () => import('@SDMOBILE/views/audit/responseAdd'),
            meta: {
              title: '指标分析工具'
            },
          },
          {
            path: 'configuration',
            name: 'configuration',
            component: () => import('@SDMOBILE/views/audit/responseAdd'),
            meta: {
              title: '专属展示配置'
            },
          },
        ]
      },
   
  ]
}



export default riskmonitoringRouter
