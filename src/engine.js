(function () {
  'use strict';

  const startCash = 30000;
  const weeksPerYear = 52;
  const weekSeconds = 30;
  const legacyWeekSeconds = 60;
  const monthEndWeeks = [4, 8, 13, 17, 21, 26, 30, 34, 39, 43, 47, 52];
  const monthlyPayroll = 12000;
  const monthlyOperatingCost = 4000;
  const opportunityRefreshCost = 2500;
  const employeeAppearanceChance = 0.1;

  const statLabels = {
    reputation: '公司名声',
    relationships: '公司关系',
    sap: 'SAP 专业技能',
    ai: 'AI 技能',
  };
  const statKeys = Object.keys(statLabels);

  const leadershipRoles = [
    {
      id: 'strategist', name: 'Randal', title: '老板', color: '#da845e',
      spriteId: 'player-0',
      description: '负责公司方向与项目统筹，擅长建立公司信誉，带领团队拓展业务。',
      bonus: '公司名声起步领先',
      stats: { reputation: 32, relationships: 20, sap: 16, ai: 16 },
    },
    {
      id: 'connector', name: 'Jason', title: '销售总监', color: '#6b9d82',
      spriteId: 'player-1',
      description: '负责销售策略与客户开拓，擅长推进签约，把商机发展为长期合作。',
      bonus: '公司关系起步领先',
      stats: { reputation: 18, relationships: 34, sap: 17, ai: 15 },
    },
  ];

  const contractTemplates = [
    {
      client: '河畔制造', title: 'SAP S/4HANA 采购库存实施', focus: 'sap', amount: 17200, baseChance: 27,
      description: '客户要给新工厂上线 SAP，先覆盖一个工厂的采购、入库和库存盘点。',
      deliverable: '交付流程配置和初始库存迁移结果，陪关键用户跑通采购订单、收货、退货和盘点差异处理。',
    },
    {
      client: '星桥物流', title: 'SAP BTP 物流接口接入', focus: 'sap', amount: 11400, baseChance: 40,
      description: '承运商仍靠邮件反馈签收。客户希望 SAP 发出发运数据，并自动接收运单号和签收状态。',
      deliverable: '用 SAP Integration Suite 交付双向接口和字段映射，联测超时重试、重复回执和失败补发。',
    },
    {
      client: '晴天百货', title: 'SAP FI 银行对账', focus: 'sap', amount: 8700, baseChance: 54,
      description: '财务每天从网银下载流水，逐笔找出应收发票并核销。先试点一个银行账户。',
      deliverable: '交付电子银行对账单导入和自动清账规则，验证正常到账、部分付款和未匹配款项。',
    },
    {
      client: '雨燕设计', title: 'AI 企业知识库', focus: 'ai', amount: 9400, baseChance: 53,
      description: '员工找不到最新的制度和项目模板，常把旧版本发给同事。客户想先接入已批准的文档。',
      deliverable: '交付带出处的问答助手，用样题检查引用正确性、权限隔离和无依据时的拒答。',
    },
    {
      client: '海角家居', title: 'SAP 采购流程诊断', focus: 'reputation', amount: 4200, baseChance: 73,
      description: '采购主管想评估现有流程，优先解决无订单收货和审批反复退回的问题。',
      deliverable: '主持一次业务访谈，交付现状流程图、问题优先级和下一阶段实施范围。',
    },
    {
      client: '麦田食品', title: 'AI 发票识别与校验', focus: 'ai', amount: 10400, baseChance: 44,
      description: '财务每天手工录入供应商 PDF 发票，希望先把可识别字段预填到审核工作台。',
      deliverable: '识别发票号、金额和税额，与 SAP 采购单及收货记录比对，差异交人工复核。',
    },
    {
      client: '北辰零售', title: 'SAP Fiori 权限梳理', focus: 'relationships', amount: 5800, baseChance: 64,
      description: '新门店常拿不到岗位需要的应用，财务和门店对角色边界也有分歧。',
      deliverable: '与岗位负责人确认权限矩阵，使用收银、店长和财务三类测试账号验收。',
    },
    {
      client: '南风电器', title: 'AI 售后工单分流', focus: 'ai', amount: 7200, baseChance: 66,
      description: '售后邮件混着换货、安装和保修咨询，客服主管想减少手动分派。',
      deliverable: '交付分类与转派试点，用标注工单验收，并将低置信度请求留在人工队列。',
    },
    {
      client: '杉谷仪器', title: 'SAP HANA 升级演练', focus: 'sap', amount: 9600, baseChance: 48,
      description: '客户计划升级 HANA 2.0 数据库，想先确认兼容性、停机时间和恢复能力。',
      deliverable: '在测试环境完成升级与恢复演练，记录耗时，复测关键交易和报表。',
    },
    {
      client: '海风汽配', title: 'SAP HANA 生产库升级', focus: 'sap', amount: 17600, baseChance: 22,
      description: '生产系统的 HANA 2.0 数据库需要升级，工厂只批准了周末停机窗口。',
      deliverable: '核对兼容性和系统复制状态，完成备份恢复演练与切换预案，在生产升级后验证订单和过账。',
    },
    {
      client: '云帆纺织', title: 'SAP FI/CO 成本月结', focus: 'sap', amount: 15600, baseChance: 28,
      description: '生产订单的实际成本和差异对不上，财务希望试点一条产线的月结流程。',
      deliverable: '交付在制品、生产差异和订单结算检查清单，用样本单据复核成本与总账。',
    },
    {
      client: '铂川工业', title: 'AI 销售订单录入', focus: 'ai', amount: 10800, baseChance: 46,
      description: '销售内勤每天从客户邮件和附件抄录物料与交期，经常漏掉包装单位。',
      deliverable: '从订单附件提取行项目，对照 SAP 物料编码并生成订单草稿，用历史样本检查字段准确率。',
    },
    {
      client: '晨港供应链', title: 'SAP EWM 仓储实施', focus: 'sap', amount: 16800, baseChance: 25,
      description: '客户准备给一个配送中心上线 SAP EWM，先覆盖托盘收货、上架和出库拣配。',
      deliverable: '交付仓位和仓库作业配置，联测入出库交货、拣货差异及 SAP 库存回传。',
    },
    {
      client: '双叶商联', title: 'SAP BTP 审批流程自动化', focus: 'relationships', amount: 8300, baseChance: 51,
      description: '采购、财务和信息部门需要统一临时采购审批，当前常因职责不清而卡单。',
      deliverable: '用 SAP Build Process Automation 交付表单和审批流，验证金额分级、驳回和超时提醒。',
    },
    {
      client: '锦河会展', title: 'SAP 上线切换评审', focus: 'reputation', amount: 5300, baseChance: 67,
      description: '客户准备上线 SAP，管理层希望有一份能判断是否具备切换条件的评审。',
      deliverable: '复核冻结窗口、迁移依赖和回退条件，主持切换桌面演练并提交风险清单。',
    },
    {
      client: '银杏工场', title: 'AI 视觉质检试点', focus: 'ai', amount: 12400, baseChance: 34,
      description: '质检组想在一条产线识别划痕和缺角，现有缺陷样本不均衡。',
      deliverable: '交付缺陷识别试点，用独立样本验收误报与漏检，并保留人工复判。',
    },
    {
      client: '赤陶建材', title: 'SAP 主数据迁移', focus: 'sap', amount: 8900, baseChance: 53,
      description: '新系统上线前要整理物料和供应商资料，旧系统有重复编码和缺失字段。',
      deliverable: '交付字段映射与清洗规则，在 SAP S/4HANA 中试迁移，核对数量和异常清单。',
    },
    {
      client: '远航设备', title: 'AI 供应链交付预警', focus: 'ai', amount: 11800, baseChance: 38,
      description: '采购团队想提前发现供应商可能延迟交付的订单。',
      deliverable: '结合 SAP 采购订单与收货记录生成预警，用历史订单回测命中率并解释高风险原因。',
    },
    {
      client: '长桥工业', title: 'SAP ECC 转 S/4HANA 评估', focus: 'reputation', amount: 8600, baseChance: 46,
      description: '集团仍运行 SAP ECC，立项前需要了解转换的主要风险和工作量。',
      deliverable: '交付业务范围、关键简化项、自开发与接口影响清单，并提出分阶段转换计划。',
    },
    {
      client: '泉桥物流', title: 'SAP BTP API 管理', focus: 'sap', amount: 10200, baseChance: 41,
      description: '合作仓库直接调用多个内部接口，信息部门希望统一认证、流量限制与调用审计。',
      deliverable: '在 SAP Integration Suite 中配置 API 代理和访问策略，验证授权、限流和异常追踪。',
    },
    {
      client: '云栖商贸', title: 'SAP 跨公司往来对账', focus: 'sap', amount: 11500, baseChance: 39,
      description: '集团内部交易在不同公司账上常因日期或币种不同而对不上。',
      deliverable: '配置并试跑内部往来匹配，交付未匹配项清单，验证跨币种和跨期差异。',
    },
    {
      client: '松林物业', title: 'AI 费用单据预审', focus: 'ai', amount: 7600, baseChance: 59,
      description: '财务希望在人工审批前发现重复报销、缺少附件和单据金额不一致。',
      deliverable: '交付单据提取和规则核验试点，标出异常原因，把边界案例转给审核员。',
    },
    {
      client: '九号工坊', title: 'SAP 与 MES 报工集成', focus: 'sap', amount: 13200, baseChance: 32,
      description: '车间在 MES 完工后还要到 SAP 重录产量和废品，导致库存更新滞后。',
      deliverable: '打通生产订单下发与完工确认回传，验证部分报工、撤销以及重复消息处理。',
    },
    {
      client: '临港机电', title: 'AI 采购询价比对', focus: 'ai', amount: 9800, baseChance: 51,
      description: '采购员收到的报价单规格和单位各异，想先自动整理同一物料的候选报价。',
      deliverable: '从报价附件抽取规格、单价和交期，保留原文引用，交由采购员确认不一致项。',
    },
    {
      client: '潮汐零售', title: 'SAP SD 退货流程改造', focus: 'relationships', amount: 9500, baseChance: 48,
      description: '门店、仓库和财务对退货收货与贷项处理的时点有争议。',
      deliverable: '确认跨部门流程并调整试点配置，用正常退货、部分退货和退款异常验收。',
    },
    {
      client: '灯塔科技', title: 'AI 月结异常助手', focus: 'ai', amount: 6500, baseChance: 62,
      description: '财务团队想更快了解哪些 SAP 月结作业失败，以及该把问题交给谁排查。',
      deliverable: '只读接入样例日志，生成附原始记录的异常摘要和排查建议，用历史案例验证并交财务复核。',
    },
    {
      client: '北陆医材', title: 'SAP S/4HANA 财务实施', focus: 'sap', amount: 17800, baseChance: 24,
      description: '新子公司要上线总账、应收和应付，切换前需核对期初余额与未清项。',
      deliverable: '交付单公司代码的流程配置和初始数据迁移，验收开票、收付款、清账及试结账。',
    },
  ];

  const supportTemplates = [
    {
      client: '海风汽配', title: 'SAP HANA 月度巡检', focus: 'sap', amount: 3600, months: 6, baseChance: 24,
      description: '客户需要持续跟踪 HANA 生产库的容量、备份和系统复制状态。',
      deliverable: '每月核查备份结果和复制告警，提交巡检报告及容量、性能风险处理建议。',
    },
    {
      client: '云岭工程', title: 'AI 企业知识库运维', focus: 'ai', amount: 2500, months: 4, baseChance: 33,
      description: '制度和模板每月都在更新，客户希望员工查到的答案及时反映最新版本。',
      deliverable: '每月同步已审核文档，抽测引用正确性和权限，记录需人工修正的问题。',
    },
    {
      client: '赤陶建材', title: 'SAP 采购库存月度支持', focus: 'relationships', amount: 4100, months: 6, baseChance: 20,
      description: '采购和仓库希望有人持续协调收货、退货和库存差异工单。',
      deliverable: '每月协助处理异常单据，和业务团队回顾处理时效及反复出现的问题。',
    },
    {
      client: '北陆医材', title: 'SAP FI/CO 月结值守', focus: 'sap', amount: 4700, months: 6, baseChance: 18,
      description: '财务需要在结账窗口有人协助定位订单结算失败和总账差异。',
      deliverable: '每个月末跟进结账工单，复核成本差异，更新异常处理手册。',
    },
    {
      client: '星桥物流', title: 'SAP BTP 接口运维', focus: 'sap', amount: 3200, months: 5, baseChance: 27,
      description: '承运商接口上线后，证书到期或报文格式变更都会造成回执积压。',
      deliverable: '每月检查失败消息和证书有效期，协助安全补发，向物流团队提交运行月报。',
    },
    {
      client: '河畔制造', title: 'AI 质检模型维护', focus: 'ai', amount: 5200, months: 6, baseChance: 17,
      description: '产线更换材料或灯光后，质检模型的误报开始波动。',
      deliverable: '每月复查误报与漏检，补充标注样本，验证后才建议替换生产模型。',
    },
    {
      client: '晨港供应链', title: 'SAP EWM 仓库运维', focus: 'sap', amount: 3800, months: 5, baseChance: 23,
      description: '仓库上线后仍会碰到任务卡住和交货状态不一致，影响班次交接。',
      deliverable: '每月排查仓库任务、交货和库存回传异常，汇总解决记录及改进建议。',
    },
    {
      client: '铂川工业', title: 'AI 单据识别运维', focus: 'ai', amount: 2300, months: 3, baseChance: 34,
      description: '订单识别上线后，客户经常更换附件模板，业务希望及时跟进识别错误。',
      deliverable: '每月抽查订单字段和人工修正记录，为高频模板补充回归样本。',
    },
    {
      client: '河畔制造', title: 'SAP 上线后业务支持', focus: 'relationships', amount: 3000, months: 4, baseChance: 31,
      description: '关键用户熟悉了日常录入，跨部门疑难工单仍需要顾问协调。',
      deliverable: '每月主持问题复盘，按业务影响分级处理工单，向关键用户移交操作指引。',
    },
  ];

  const opportunityTemplates = [
    { title: 'S/4HANA 转型公开课', icon: 'megaphone', cost: 4800, boosts: { reputation: 6 }, description: '为准备更换 ERP 的企业讲解转型范围、试迁移和上线验收，分享一份上线准备清单。' },
    { title: '仓库流程共创会', icon: 'coffee', cost: 3200, boosts: { relationships: 5 }, description: '请客户的仓库主管和 IT 团队一起走查出库与签收，明确异常交接由谁负责。' },
    { title: 'SAP FI/CO 月结训练营', icon: 'training', cost: 5700, boosts: { sap: 7 }, description: '在练习系统跑完生产差异分析、订单结算和总账核对，复盘常见月结失败。' },
    { title: '企业数字化展台', icon: 'exhibition', cost: 9800, boosts: { reputation: 8, relationships: 3 }, description: '带着 BTP 物流接口和 AI 发票预审的演示参展，现场与企业负责人聊试点范围。' },
    { title: '企业 AI 评测工作坊', icon: 'sparkles', cost: 6200, boosts: { ai: 7 }, description: '用脱敏发票与内部制度样本检验字段识别、答案出处和人工接管，建立试点验收清单。' },
    { title: '上线复盘与交接', icon: 'gift', cost: 3700, boosts: { relationships: 5, reputation: 1 }, description: '请客户关键用户复盘 SAP 上线，交付常见问题手册和运维联系表，逐项确认遗留问题。' },
    { title: '企业 AI 演示开放日', icon: 'exhibition', cost: 7300, boosts: { reputation: 5, relationships: 3 }, description: '邀请财务、采购和质检团队体验 AI 样例，现场讨论权限边界与人工复核。' },
    { title: 'BTP 与 AI 联调训练', icon: 'training', cost: 8500, boosts: { sap: 5, ai: 4 }, description: '让集成顾问和 AI 同事联调发票预审，把异常送进人工审核，演练失败告警和补发。' },
    { title: 'HANA 升级案例分享', icon: 'megaphone', cost: 4300, boosts: { reputation: 5 }, description: '经客户同意发布匿名复盘，说明如何安排升级演练、验证备份恢复与核对关键交易。' },
    { title: '财务负责人圆桌会', icon: 'coffee', cost: 6600, boosts: { relationships: 7, reputation: 2 }, description: '邀请客户交流银行对账、跨公司往来和月结难点，汇总下一轮适合试点的场景。' },
    { title: 'HANA 升级沙盘', icon: 'training', cost: 5100, boosts: { sap: 6 }, description: '租用测试环境，演练升级前兼容性检查、备份恢复和升级后的应用验证。' },
    { title: '工业 AI 质检交流', icon: 'sparkles', cost: 4600, boosts: { ai: 5, relationships: 1 }, description: '与工厂质检团队交流样本标注，用光照变化的样本复查误报、漏检与人工复判。' },
  ];

  const employeeTemplates = [
    { employeeId: 'steven', employeeName: 'Steven', employeeRole: '开发', color: '#7997b6', boosts: { ai: 12 } },
    { employeeId: 'jeff', employeeName: 'Jeff', employeeRole: '顾问', color: '#b18b6d', boosts: { sap: 12 } },
    { employeeId: 'albert', employeeName: 'Albert', employeeRole: '开发', color: '#9184b0', boosts: { ai: 12 } },
    { employeeId: 'davy', employeeName: 'Davy', employeeRole: '开发', color: '#6e9c96', boosts: { ai: 12 } },
    { employeeId: 'charles', employeeName: 'Charles', employeeRole: '顾问', color: '#a28f6c', boosts: { sap: 12 } },
  ].map(employee => ({
    ...employee,
    spriteId: `employee-${employee.employeeId}`,
    title: `雇佣 ${employee.employeeName} · ${employee.employeeRole}`,
    icon: 'users',
    cost: 8000,
    monthlySalary: 3000,
    description: `${employee.employeeName} 加入团队，负责${employee.employeeRole}工作，立即提升公司的专业能力。`,
  }));

  const roles = [
    ...leadershipRoles,
    ...employeeTemplates.map(employee => ({
      id: employee.employeeId,
      employeeId: employee.employeeId,
      name: employee.employeeName,
      title: employee.employeeRole,
      color: employee.color,
      spriteId: employee.spriteId,
      description: `以${employee.employeeRole}身份轮岗经营，发挥专业所长，带领团队承接客户项目。`,
      bonus: `${employee.employeeRole === '开发' ? 'AI 技能' : 'SAP 专业技能'}起步领先`,
      stats: Object.fromEntries(statKeys.map(key => [key, 18 + (employee.boosts[key] || 0)])),
    })),
  ];

  function roundPrice(value) {
    return Math.round(value / 100) * 100;
  }

  // Rotation keeps each group of offers off the street for two full weeks.
  const rotationLength = 3;
  const visitWindows = [
    [0, 7], [0, 9], [1, 11], [2, 13], [7, 17], [9, 19],
    [11, 21], [13, 23], [17, 28], [19, 29], [21, 30], [23, 30],
  ];
  const supportSlots = [2, 6, 9];

  function makeContracts(week) {
    const group = (week - 1) % rotationLength;
    const round = Math.floor((week - 1) / rotationLength);
    const projectCount = contractTemplates.length / rotationLength;
    const supportCount = supportTemplates.length / rotationLength;
    const scale = 1 + Math.floor((week - 1) / 13) * 0.12;
    let projectIndex = round * 4;
    let supportIndex = round;
    return visitWindows.map(([arrivesAt, leavesAt], index) => {
      const support = supportSlots.includes(index);
      const template = support
        ? supportTemplates[group * supportCount + supportIndex++ % supportCount]
        : contractTemplates[group * projectCount + projectIndex++ % projectCount];
      return {
        ...template,
        id: `w${week}-c${index + 1}`,
        kind: support ? 'support' : 'project',
        amount: roundPrice(template.amount * scale),
        arrivesAt,
        leavesAt,
        status: 'open',
      };
    });
  }

  function weekAge(state, now) {
    return state.weekDuration - (state.deadline - now) / 1000;
  }

  function isContractAvailable(state, contract, now = Date.now()) {
    if (state.phase !== 'week' || contract?.status !== 'open') return false;
    const age = weekAge(state, now);
    return age >= (contract.arrivesAt ?? 0) && age < (contract.leavesAt ?? state.weekDuration);
  }

  function contractVisitProgress(state, contract, now = Date.now()) {
    if (state.phase !== 'week' || !Number.isFinite(contract?.arrivesAt)) return null;
    const progress = (weekAge(state, now) - contract.arrivesAt) / (contract.leavesAt - contract.arrivesAt);
    return Math.min(1, Math.max(0, progress));
  }

  function opportunityCards(week, templates, refreshCount = 0) {
    const scale = 1 + Math.floor((week - 1) / 13) * 0.15;
    const prefix = refreshCount ? `w${week}-r${refreshCount}` : `w${week}`;
    return templates.map((template, index) => ({
      ...template,
      id: `${prefix}-o${index + 1}`,
      cost: template.employeeId ? template.cost : roundPrice(template.cost * scale),
      boosts: { ...template.boosts },
      purchased: false,
    }));
  }

  function includeEmployeeOpportunity(state, templates, random) {
    const unavailableIds = new Set([
      state.roleId,
      ...state.opportunityPurchases.map(record => record.employeeId),
      ...state.opportunities.map(card => card.employeeId),
    ]);
    const available = employeeTemplates.filter(employee => !unavailableIds.has(employee.employeeId));
    if (!available.length || random() >= employeeAppearanceChance) return templates;
    const employee = available[Math.floor(random() * available.length)];
    templates[Math.floor(random() * templates.length)] = employee;
    return templates;
  }

  function makeOpportunities(state, random) {
    const { week } = state;
    const start = ((week - 1) * 5) % opportunityTemplates.length;
    const templates = Array.from({ length: 3 }, (_, index) =>
      opportunityTemplates[(start + index) % opportunityTemplates.length]);
    return opportunityCards(week, includeEmployeeOpportunity(state, templates, random));
  }

  function getOpportunityRefreshCost(state) {
    const refreshedThisWeek = state.opportunityRefreshes.some(record => record.week === state.week);
    return refreshedThisWeek ? opportunityRefreshCost : 0;
  }

  function canRefreshOpportunities(state) {
    return state.phase === 'opportunities' && Math.max(0, state.cash) >= getOpportunityRefreshCost(state);
  }

  function refreshOpportunities(state, random = Math.random) {
    if (!canRefreshOpportunities(state)) return state;
    const visibleTitles = new Set(state.opportunities.map(card => card.title));
    const pool = opportunityTemplates.filter(template => !visibleTitles.has(template.title));
    const refreshCount = state.opportunityRefreshes.filter(record => record.week === state.week).length + 1;
    const templates = Array.from({ length: 3 }, () =>
      pool.splice(Math.floor(random() * pool.length), 1)[0]);
    const record = {
      week: state.week, id: `w${state.week}-r${refreshCount}`, cost: getOpportunityRefreshCost(state),
    };
    return {
      ...state,
      cash: state.cash - record.cost,
      opportunities: opportunityCards(state.week, includeEmployeeOpportunity(state, templates, random), refreshCount),
      opportunityRefreshes: [...state.opportunityRefreshes, record],
    };
  }

  function openWeek(state, week, now) {
    return {
      ...state,
      week,
      phase: 'week',
      weekDuration: weekSeconds,
      deadline: now + weekSeconds * 1000,
      contracts: makeContracts(week),
      opportunities: [],
    };
  }

  function createGame(roleId, now = Date.now()) {
    const role = roles.find(item => item.id === roleId) || roles[0];
    return openWeek({
      version: 2,
      roleId: role.id,
      cash: startCash,
      stats: { ...role.stats },
      history: [],
      weekResults: [],
      opportunityPurchases: [],
      opportunityRefreshes: [],
      supportContracts: [],
      supportPayments: [],
      eventHistory: [],
    }, 1, now);
  }

  function restoreGame(saved) {
    const baseArrays = ['contracts', 'opportunities', 'history', 'weekResults', 'opportunityPurchases'];
    const roleId = saved?.roleId === 'technologist' ? 'connector' : saved?.roleId;
    const role = roles.find(item => item.id === roleId);
    if (!saved || ![1, 2].includes(saved.version)
      || !role
      || !['week', 'opportunities', 'summary'].includes(saved.phase)
      || !Number.isInteger(saved.week) || saved.week < 1 || saved.week > weeksPerYear
      || !Number.isFinite(saved.cash)
      || (saved.phase === 'week' && !Number.isFinite(saved.deadline))
      || !saved.stats || !statKeys.every(key => Number.isFinite(saved.stats[key])
        && saved.stats[key] >= 0 && saved.stats[key] <= 100)
      || !baseArrays.every(key => Array.isArray(saved[key]))
      || (saved.eventHistory !== undefined && !Array.isArray(saved.eventHistory))) return null;

    const eventHistory = saved.eventHistory ?? [];
    const opportunities = role.employeeId
      ? saved.opportunities.filter(card => card.employeeId !== role.employeeId)
      : saved.opportunities;
    const weekDuration = Number.isFinite(saved.weekDuration) && saved.weekDuration > 0
      ? saved.weekDuration : legacyWeekSeconds;
    if (saved.version === 2) {
      const newArrays = ['opportunityRefreshes', 'supportContracts', 'supportPayments'];
      if (!newArrays.every(key => Array.isArray(saved[key]))) return null;
      return { ...saved, roleId, opportunities, eventHistory, weekDuration };
    }
    return {
      ...saved,
      version: 2,
      roleId,
      opportunities,
      weekDuration,
      contracts: saved.contracts.map(contract => ({ ...contract, kind: 'project' })),
      history: saved.history.map(record => ({ ...record, kind: 'project' })),
      weekResults: saved.weekResults.map(record => ({
        ...record,
        projectRevenue: record.revenue,
        supportRevenue: 0,
        eventRevenue: 0,
        eventSpent: 0,
      })),
      opportunityRefreshes: [],
      supportContracts: [],
      supportPayments: [],
      eventHistory,
    };
  }

  function firstSupportPaymentWeek(week) {
    const yearStart = Math.floor((week - 1) / weeksPerYear) * weeksPerYear;
    const monthEnd = monthEndWeeks.find(end => end > week - yearStart);
    return yearStart + (monthEnd ?? weeksPerYear + monthEndWeeks[0]);
  }

  function getMonthlyCostsSchedule(state) {
    if (state.phase === 'summary') return null;
    const firstUnsettledWeek = state.week + (state.phase === 'opportunities' ? 1 : 0);
    return monthEndWeeks.find(week => week >= firstUnsettledWeek) ?? null;
  }

  function getMonthlyPayroll(state) {
    return monthlyPayroll + state.opportunityPurchases.reduce((total, record) =>
      total + (record.monthlySalary ?? 0), 0);
  }

  function getSupportSchedule(state) {
    const active = state.supportContracts.filter(contract => contract.remainingMonths > 0);
    const nextWeek = active.reduce((next, contract) =>
      Math.min(next, contract.nextPaymentWeek), Infinity);
    const dueThisYear = nextWeek <= weeksPerYear;
    return {
      monthlyIncome: active.reduce((sum, contract) => sum + contract.amount, 0),
      nextWeek: dueThisYear ? nextWeek : null,
      nextAmount: dueThisYear ? active.reduce((sum, contract) =>
        sum + (contract.nextPaymentWeek === nextWeek ? contract.amount : 0), 0) : 0,
      activeCount: active.length,
    };
  }

  function settleSupportPayments(state) {
    const payments = [];
    const contracts = state.supportContracts.map(contract => {
      if (contract.remainingMonths === 0 || contract.nextPaymentWeek !== state.week) return contract;
      const { id, title, client, amount } = contract;
      payments.push({ week: state.week, id, title, client, amount });
      const remainingMonths = contract.remainingMonths - 1;
      return {
        ...contract,
        remainingMonths,
        nextPaymentWeek: remainingMonths ? firstSupportPaymentWeek(state.week) : null,
      };
    });
    return { contracts, payments };
  }

  function eventTotals(events = []) {
    return events.reduce((totals, event) => {
      totals.eventRevenue += Math.max(0, event.cash);
      totals.eventSpent += Math.max(0, -event.cash);
      return totals;
    }, { eventRevenue: 0, eventSpent: 0 });
  }

  function calcChance(state, contract) {
    const average = statKeys.reduce((sum, key) => sum + state.stats[key], 0) / statKeys.length;
    const eventBonus = state.eventChanceWeek === state.week ? state.eventChanceBonus || 0 : 0;
    const chance = Math.round(contract.baseChance + state.stats[contract.focus] * 0.32 + average * 0.1 + eventBonus);
    return Math.max(5, Math.min(96, chance));
  }

  function tick(state, now = Date.now(), random = Math.random) {
    if (state.phase !== 'week' || now < state.deadline) return state;

    const won = state.contracts.filter(contract => contract.status === 'won');
    const lost = state.contracts.filter(contract => contract.status === 'lost').length;
    const signed = won.length + lost;
    const { contracts, payments } = settleSupportPayments(state);
    const projectRevenue = won.reduce((sum, contract) =>
      sum + (contract.kind === 'support' ? 0 : contract.amount), 0);
    const supportRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const isMonthEnd = monthEndWeeks.includes(state.week);
    const payroll = isMonthEnd ? getMonthlyPayroll(state) : 0;
    const operatingCost = isMonthEnd ? monthlyOperatingCost : 0;
    const events = (state.eventHistory || []).filter(event => event.week === state.week);
    const { eventRevenue, eventSpent } = eventTotals(events);
    const result = {
      week: state.week,
      revenue: projectRevenue + supportRevenue + eventRevenue,
      projectRevenue,
      supportRevenue,
      payroll,
      operatingCost,
      eventRevenue,
      eventSpent,
      signed,
      won: won.length,
      lost,
      expired: state.contracts.length - signed,
    };
    return {
      ...state,
      phase: 'opportunities',
      deadline: null,
      cash: state.cash + supportRevenue - payroll - operatingCost,
      supportContracts: contracts,
      supportPayments: [...state.supportPayments, ...payments],
      opportunities: makeOpportunities(state, random),
      weekResults: [...state.weekResults, result],
    };
  }

  function signContract(state, id, now = Date.now(), random = Math.random) {
    const current = tick(state, now);
    if (current.phase !== 'week') return current;
    const contract = current.contracts.find(item => item.id === id);
    if (!isContractAvailable(current, contract, now)) return current;

    const chance = calcChance(current, contract);
    const succeeded = random() * 100 < chance;
    const status = succeeded ? 'won' : 'lost';
    const result = { ...contract, status, chance };
    const kind = contract.kind || 'project';
    const record = {
      week: current.week, id, client: contract.client, title: contract.title,
      amount: contract.amount, status, chance, kind,
      ...(kind === 'support' ? { months: contract.months } : {}),
    };
    const supportContracts = succeeded && kind === 'support'
      ? [...current.supportContracts, {
        week: current.week,
        id,
        client: contract.client,
        title: contract.title,
        amount: contract.amount,
        remainingMonths: contract.months,
        nextPaymentWeek: firstSupportPaymentWeek(current.week),
      }] : current.supportContracts;
    return {
      ...current,
      cash: current.cash + (succeeded && kind === 'project' ? contract.amount : 0),
      supportContracts,
      contracts: current.contracts.map(item => item.id === id ? result : item),
      history: [...current.history, record],
    };
  }

  function buyOpportunity(state, id) {
    if (state.phase !== 'opportunities') return state;
    const card = state.opportunities.find(item => item.id === id);
    if (!card || card.purchased || card.cost > state.cash) return state;
    if (card.employeeId && (card.employeeId === state.roleId
      || state.opportunityPurchases.some(record => record.employeeId === card.employeeId))) return state;

    const stats = { ...state.stats };
    const boosts = {};
    for (const [key, points] of Object.entries(card.boosts)) {
      const applied = Math.min(points, 100 - stats[key]);
      if (applied > 0) {
        stats[key] += applied;
        boosts[key] = applied;
      }
    }
    if (Object.keys(boosts).length === 0) return state;
    const record = {
      week: state.week, id, title: card.title, cost: card.cost, boosts,
      ...(card.employeeId ? {
        employeeId: card.employeeId,
        employeeName: card.employeeName,
        employeeRole: card.employeeRole,
        monthlySalary: card.monthlySalary,
      } : {}),
    };
    return {
      ...state,
      cash: state.cash - card.cost,
      stats,
      opportunities: state.opportunities.map(item => item.id === id ? { ...card, purchased: true } : item),
      opportunityPurchases: [...state.opportunityPurchases, record],
    };
  }

  function nextWeek(state, now = Date.now()) {
    if (state.phase !== 'opportunities') return state;
    if (state.week === weeksPerYear) return { ...state, phase: 'summary' };
    return openWeek(state, state.week + 1, now);
  }

  function summarize(state) {
    const wins = state.history.filter(record => record.status === 'won');
    const projectRevenue = wins.reduce((sum, record) =>
      sum + (record.kind === 'support' ? 0 : record.amount), 0);
    const supportRevenue = state.supportPayments.reduce((sum, record) => sum + record.amount, 0);
    const opportunitySpent = state.opportunityPurchases.reduce((sum, record) => sum + record.cost, 0);
    const refreshSpent = state.opportunityRefreshes.reduce((sum, record) => sum + record.cost, 0);
    const payroll = state.weekResults.reduce((sum, record) => sum + (record.payroll ?? 0), 0);
    const operatingCost = state.weekResults.reduce((sum, record) => sum + (record.operatingCost ?? 0), 0);
    const { eventRevenue, eventSpent } = eventTotals(state.eventHistory);
    const revenue = projectRevenue + supportRevenue + eventRevenue;
    const spent = opportunitySpent + refreshSpent + eventSpent + payroll + operatingCost;
    return {
      revenue,
      spent,
      projectRevenue,
      supportRevenue,
      opportunitySpent,
      refreshSpent,
      payroll,
      operatingCost,
      eventRevenue,
      eventSpent,
      signed: state.history.length,
      won: wins.length,
      lost: state.history.length - wins.length,
      net: revenue - spent,
      finalCash: state.cash,
    };
  }

  const api = {
    roles, statLabels, startCash, weeksPerYear, weekSeconds,
    restoreGame, firstSupportPaymentWeek, getSupportSchedule,
    monthlyPayroll, monthlyOperatingCost, getMonthlyCostsSchedule, getMonthlyPayroll,
    employeeTemplates, employeeAppearanceChance,
    opportunityRefreshCost, getOpportunityRefreshCost, canRefreshOpportunities, refreshOpportunities,
    isContractAvailable, contractVisitProgress,
    createGame, calcChance, tick, signContract, buyOpportunity, nextWeek, summarize,
  };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else globalThis.CornerGame = api;
})();
