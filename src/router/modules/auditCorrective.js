
const AuditCorrective = {
  path: '/auditCorrective',
  component: () => import('@WISDOMAUDIT/layout/index'),
  redirect: '/auditCorrective/rectificationPlan',
  name: 'auditCorrective',
  meta: {
    title: '审计整改'

  },
  children: [
    {
      path: 'rectificationPlan',
      name: 'rectificationPlan',
      component: () => import('@WISDOMAUDIT/views/auditCorrective/rectificationPlan'),
      meta: {
        title: '审计整改-整改计划'
      }
    },
    {
      path: 'rectificationPlan/details/:id?',
      name: 'rectificationPlanDetails',
      component: () => import('@WISDOMAUDIT/views/auditCorrective/rectificationPlan/details'),
      hidden: true,
      meta: {
        title: '审计整改-整改计划'
      }
    },

    {
      path: 'rectificationPlan/examine/:id?',
      name: 'rectificationPlanDetails',
      component: () => import('@WISDOMAUDIT/views/auditCorrective/rectificationPlan/examine'),
      hidden: true,
      meta: {
        title: '审计整改-整改计划'
      }
    },

    {
      path: 'rectificationPlan_audited',
      name: 'rectificationPlan_audited',
      component: () => import('@WISDOMAUDIT/views/auditCorrective/rectificationPlan_audited'),
      meta: {
        title: '审计整改-整改计划反馈'
      }
    },
    // 编辑
    {
      path: 'rectificationPlan_audited/edit/:id?',
      name: 'rectificationPlanEdit',
      component: () => import('@WISDOMAUDIT/views/auditCorrective/rectificationPlan_audited/edit'),
      hidden: true,
      meta: {
        title: '审计整改-整改计划反馈'
      }
    },

    {
      path: 'rectificationPlan/questionList/:id?',
      name: 'questionList',
      hidden: true,
      component: () => import('@WISDOMAUDIT/views/auditCorrective/rectificationPlan/questionList'),
      meta: {
        title: '审计整改-整改计划反馈'
      }
    },
    {
      path: 'rectificationMeasures',
      name: 'rectificationMeasures',
      component: () => import('@WISDOMAUDIT/views/auditCorrective/rectificationMeasures'),
      meta: {
        title: '审计整改-整改措施'
      }
    },
    {
      path: 'rectificationMeasuresInterface',
      name: 'rectificationMeasuresInterface',
      component: () => import('@WISDOMAUDIT/views/auditCorrective/rectificationMeasuresInterface'),
      meta: {
        title: '审计整改-整改措施反馈'
      }
    },
    {
      path: 'rectificationMeasuresLeader',
      name: 'rectificationMeasuresLeader',
      component: () => import('@WISDOMAUDIT/views/auditCorrective/rectificationMeasuresLeader'),
      meta: {
        title: '审计整改-整改措施审核'
      }
    },
    {
      path: 'rectificationMeasures/editList/:id?',
      name: 'rectificationMeasuresEditList',
      hidden: true,
      component: () => import('@WISDOMAUDIT/views/auditCorrective/rectificationMeasures/editList'),
      meta: {
        title: '审计整改-整改措施/问题'
      }
    },
    {
      path: 'correctiveParameter',
      name: 'correctiveParameter',
      component: () => import('@WISDOMAUDIT/views/auditCorrective/correctiveParameter'),
      meta: {
        title: '审计整改-整改台账'
      }
    },
    {
      path: 'correctiveParameter/index/:id?',
      name: 'correctiveParameterIndex',
      hidden: true,
      component: () => import('@WISDOMAUDIT/views/auditCorrective/correctiveParameter/index'),
      meta: {
        title: '审计整改-整改台账'
      }
    }
  ]
}

export default AuditCorrective
