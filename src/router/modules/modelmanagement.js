import Layout from '@/layout/index'


const modelManagement = {
  path: '/modelManagement',
  component: Layout,
  redirect: '/modelmanagement/modelManagementSon',
  name: 'modelManagement',
  meta: {
    title: '模型管理',
  },
  children: [
    {
      path: 'modelManagementSon',
      name: 'modelManagementson',
      component: () => import('@WISDOMAUDIT/views/modelmanagement/modelManagementSon'),
      meta: {
        title: '模型管理'
      },
      children:[
        {
          path: 'modeldictionary',
          name: 'modeldictionary',
          component: () => import('@WISDOMAUDIT/views/modelmanagement/modelManagementSon/modeldictionary'),
          meta: {
            title: '模型字典'
          },
        }, {
          path: 'modelresults',
          name: 'modelresults',
          component: () => import('@WISDOMAUDIT/views/modelmanagement/modelManagementSon/modelresults'),
          meta: {
            title: '模型结果'
          },
        }, {
          path: 'modelparameter',
          name: 'modelparameter',
          component: () => import('@WISDOMAUDIT/views/modelmanagement/modelManagementSon/modelparameter'),
          meta: {
            title: '模型参数'
          },
        }, 
      ]
    },
    {
      path: 'projectrunningbatch',
      name: 'projectrunningbatch',
      component: () => import('@WISDOMAUDIT/views/modelmanagement/projectrunningbatch'),
      meta: {
        title: '模型跑批'
      },
       children:[
        {
          path: 'Projectbatchsetting',
          name: 'Projectbatchsetting',
          component: () => import('@WISDOMAUDIT/views/modelmanagement/projectrunningbatch/Projectbatchsetting'),
          meta: {
            title: '模型跑批设置'
          },
        },  {
          path: 'Projectbatchresults',
          name: 'Projectbatchresults',
          component: () => import('@WISDOMAUDIT/views/modelmanagement/projectrunningbatch/Projectbatchresults'),
          meta: {
            title: '模型跑批结果'
          },
        },  {
          path: 'ThresholdManagement',
          name: 'ThresholdManagement',
          component: () => import('@WISDOMAUDIT/views/modelmanagement/projectrunningbatch/ThresholdManagement'),
          meta: {
            title: '预警阀值管理'
          },
        }, 
      ]
    },
    {
      path: 'Clueverification',
      name: 'Clueverification',
      component: () => import('@WISDOMAUDIT/views/modelmanagement/Clueverification'),
      alwaysShow: true,
      meta: {
        title: '线索核实'
      },
      children:[
        {
          path: 'Clueverification',
          name: 'Clueverification',
          component: () => import('@WISDOMAUDIT/views/modelmanagement/Clueverification'),
          meta: {
            title: '线索核实'
          },
        }, 
      ]
    },
    {
      path: 'Analysistools',
      name: 'Analysistools',
      component: () => import('@WISDOMAUDIT/views/modelmanagement/Analysistools'),
      meta: {
        title: '分析工具'
      },
      children:[
        {
          path: 'sqleditor',
          name: 'sqleditor',
          component: () => import('@WISDOMAUDIT/views/modelmanagement/Analysistools/sqleditor'),
          meta: {
            title: 'SQL编辑器'
          },
        },   {
          path: 'Graphicalmodeling',
          name: 'Graphicalmodeling',
          component: () => import('@WISDOMAUDIT/views/modelmanagement/Analysistools/Graphicalmodeling'),
          meta: {
            title: '图形化建模'
          },
        }, 
      ]
    },
  ]
  
}

export default modelManagement
