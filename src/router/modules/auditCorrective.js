import Layout from '@WISDOMAUDIT/layout/index'


const AuditCorrective = {
  path: '/auditCorrective',
  component: Layout,
  redirect: '/auditCorrective/rectificationPlan',
  name: 'auditCorrective',
  meta: {
    title: '审计整改',
  
  },
  children: [
    {
      path: 'rectificationPlan',
      name: 'rectificationPlan',
      component: () => import('@WISDOMAUDIT/views/auditCorrective/rectificationPlan'),
      meta: {
        title: '审计整改-整改计划'
      },
    },
    {
      path: 'rectificationPlan/questionList/:id?',
      name: 'questionList',
      hidden:true,
      component: () => import('@WISDOMAUDIT/views/auditCorrective/rectificationPlan/questionList'),
      meta: {
        title: '审计整改-整改计划/问题列表'
      },
    },
    {
      path: 'rectificationMeasures',
      name: 'rectificationMeasures',
      component: () => import('@WISDOMAUDIT/views/auditCorrective/rectificationMeasures'),
      meta: {
        title: '审计整改-整改措施'
      },
    },
    {
      path: 'rectificationMeasures/editList/:id?',
      name: 'rectificationMeasuresEditList',
      hidden:true,
      component: () => import('@WISDOMAUDIT/views/auditCorrective/rectificationMeasures/editList'),
      meta: {
        title: '审计整改-整改措施/问题'
      },
    },
    {
      path: 'correctiveParameter',
      name: 'correctiveParameter',
      component: () => import('@WISDOMAUDIT/views/auditCorrective/correctiveParameter'),
      meta: {
        title: '审计整改-整改台账'
      },
    },
    {
      path: 'correctiveParameter/index/:id?',
      name: 'correctiveParameterIndex',
      hidden:true,
      component: () => import('@WISDOMAUDIT/views/auditCorrective/correctiveParameter/index'),
      meta: {
        title: '审计整改-整改台账'
      },
    },
  ]
}

export default AuditCorrective
