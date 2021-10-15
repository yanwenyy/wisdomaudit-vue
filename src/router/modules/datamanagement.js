import Layout from '@/layout/index'


const datamanagement= {
  path: '/datamanagement',
  component: Layout,
  redirect: '/datamanagement/datadictionary',
  name: 'datamanagement',
  meta: {
    title: '数据管理',
   
  },
  children: [
    {
      path: 'datadictionary',
      name: 'datadictionary',
      component: () => import('@WISDOMAUDIT/views/datamanagement/datadictionary'),
      meta: {
        title: '数据字典'
      },
    },
    {
      path: 'Dataresourcedirectory',
      name: 'Dataresourcedirectory',
      component: () => import('@WISDOMAUDIT/views/datamanagement/Dataresourcedirectory'),
      meta: {
        title: '数据资源目录'
      },
    },
    {
      path: 'Datascheduling',
      name: 'Datascheduling',
      component: () => import('@WISDOMAUDIT/views/datamanagement/Datascheduling'),
      meta: {
        title: '数据调度'
      },
    },
    {
      path: 'Dataauthorization',
      name: 'rectificatDataauthorizationionMeasuresEditList',
      component: () => import('@WISDOMAUDIT/views/datamanagement/Dataauthorization'),
      meta: {
        title: '数据授权'
      },
    },
   
  ]
}

export default datamanagement
