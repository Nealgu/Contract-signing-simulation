(function () {
  'use strict';

  const templates = [
    {
      title: '行业论坛临时征集 SAP 案例',
      description: '制造业论坛空出一个演讲席位，主办方希望分享一次 SAP 上线的经验。',
      choices: [
        { id: 'present', label: '提交匿名案例', description: '赶制演示材料，分享上线切换和库存核对的经验。', effects: { cash: -1800, stats: { reputation: 5 } } },
        { id: 'refer', label: '推荐客户主讲', description: '让客户的项目负责人分享内部推行经验，你帮忙准备提纲。', effects: { stats: { relationships: 2 } } },
      ],
      fallback: { label: '征集结束', description: '主办方把席位给了另一支顾问团队。', effects: {} },
    },
    {
      title: 'HANA 容灾演练中断',
      description: '演练环境的复制延迟突然升高。客户正在等团队演示主备切换。',
      choices: [
        { id: 'restore', label: '启用备用演练环境', description: '租用备用资源完成演示，并向客户交代原环境的问题。', effects: { cash: -2400, chance: 7 } },
        { id: 'investigate', label: '暂停切换并排查', description: '保留日志，复核复制延迟与切换条件。客户要改期看演示。', effects: { stats: { sap: 2 }, chance: -4 } },
      ],
      fallback: { label: '演练未能收尾', description: '客户没等到结论，本周对涉及系统上线的承诺更谨慎。', effects: { chance: -11 } },
    },
    {
      title: '承运商接口证书将到期',
      description: '承运商提醒，测试端点的证书今晚到期。明早还有一轮 SAP BTP 签收回执联测。',
      choices: [
        { id: 'renew', label: '安排夜间联测', description: '安排顾问与承运商更新证书，并跑通一条签收回执。', effects: { cash: -1200, stats: { relationships: 5 } } },
        { id: 'guide', label: '提供轮换清单', description: '发给客户更新证书、验证连接和失败恢复的检查步骤。', effects: { stats: { reputation: 2 } } },
      ],
      fallback: { label: '客户另约联测', description: '客户自己的运维团队接手，重新安排了测试时间。', effects: {} },
    },
    {
      title: '顾问工作坊空出席位',
      description: '合作伙伴的工作坊空出一席，可派团队带一个在手项目的难题参加。',
      choices: [
        { id: 'sap', label: '参加 S/4HANA 实施复盘', description: '拿主数据试迁移和月结验证的难题向实施顾问请教。', effects: { cash: -2600, stats: { sap: 5 } } },
        { id: 'ai', label: '参加企业 AI 验收实训', description: '带上失败样本，练习构建评测集和验证人工转接。', effects: { cash: -2600, stats: { ai: 5 } } },
      ],
      fallback: { label: '席位被补上', description: '主办方确认了候补团队的报名。', effects: {} },
    },
    {
      title: '仓储客户主动推荐',
      description: '一家客户在供应链交流会上介绍了你们的 EWM 上线项目。',
      automatic: { label: '收到同行转介', description: '与会企业听到客户的真实反馈，对团队的交付能力更有信心。', effects: { stats: { reputation: 3 }, chance: 9 } },
    },
    {
      title: '财务月结试跑对不上账',
      description: '客户验收 SAP 财务流程时，部分应收未清项与对账样本不符。财务负责人希望今天给出解释。',
      choices: [
        { id: 'specialist', label: '请 FI 顾问加急复核', description: '抽查原始凭证和清账规则，给客户一份有凭证支持的差异说明。', effects: { cash: -1500, chance: 3 } },
        { id: 'reconcile', label: '与客户核对样本', description: '一起确认测试数据的口径，约定下一轮复核时间。', effects: { stats: { relationships: 1 }, chance: -3 } },
      ],
      fallback: { label: '财务暂缓验收', description: '差异没有及时解释，客户想等月结流程再试一轮。', effects: { chance: -10 } },
    },
    {
      title: '收到智能财务联合提案邀约',
      description: '合作方想把 SAP 财务实施和 AI 发票识别放在同一份提案里，请你确认分工。',
      choices: [
        { id: 'lead', label: '牵头联合提案', description: '投入顾问工时，演示从发票识别到 SAP 待核对单据的过程。', effects: { cash: -3600, stats: { reputation: 6 }, chance: 6 } },
        { id: 'partner', label: '负责 AI 试点部分', description: '提供识别样本和人工复核设计，由伙伴负责整体提案。', effects: { stats: { relationships: 3, ai: 1 } } },
      ],
      fallback: { label: '同行另约伙伴', description: '对方先确定了另一家搭档。', effects: {} },
    },
    {
      title: '测试环境临时扩容',
      description: '新一轮 S/4HANA 迁移试跑超出了测试环境的存储配额。',
      automatic: { label: '支付临时资源费', description: '团队申请了额外存储以完成演练，资源费从可用资金中扣除。', effects: { cash: -2200 } },
    },
    {
      title: '知识库客户发来试点复盘',
      description: '老客户整理了 AI 知识库试用反馈，愿意授权分享脱敏后的成效。',
      choices: [
        { id: 'publish', label: '整理脱敏案例', description: '核对授权范围与成效口径，把案例整理成对外材料。', effects: { cash: -2100, stats: { reputation: 5 } } },
        { id: 'talk', label: '开展内部复盘', description: '和客户团队回看找不到出处的问答，优先处理最常见的问题。', effects: { stats: { relationships: 3 } } },
      ],
      fallback: { label: '复盘材料归档', description: '客户保留了反馈材料，等下次运维例会再讨论。', effects: {} },
    },
    {
      title: '企业 AI 试点补贴到账',
      description: '企业数字化计划通过了你们提交的 AI 视觉质检试点验收材料。',
      automatic: { label: '收到试点补贴', description: '试点补贴已计入公司可用资金。', effects: { cash: 2800 } },
    },
    {
      title: 'AI 演示引用了过期资料',
      description: '面向客户的问答演示引用了一份已废止的制度，业务负责人担心正式上线后也会发生。',
      choices: [
        { id: 'workshop', label: '组织专项复验', description: '请业务专家核对文档有效期，用脱敏样题重新验证回答和出处。', effects: { cash: -1900, stats: { relationships: 4 }, chance: 4 } },
        { id: 'demo', label: '暂停问答并修正索引', description: '先排除过期文档并补上回归样本，把完整演示延到下次。', effects: { stats: { ai: 2 }, chance: -4 } },
      ],
      fallback: { label: '客户暂缓试点', description: '团队没有及时回应引用问题，客户对本周的方案更谨慎。', effects: { chance: -12 } },
    },
    {
      title: '客户集中进入年审冻结期',
      description: '几家客户通知，审计期间暂停审批新的系统采购与技术服务。',
      automatic: { label: '本周审批放缓', description: '客户仍愿意讨论需求，但本周剩余签约的成功率暂时下降。', effects: { chance: -9 } },
    },
  ];

  function eventFor(state) {
    if (state?.phase !== 'week' || !state.contracts.some(contract => Number.isFinite(contract.arrivesAt))) return null;
    const week = state.week;
    const template = templates[(week - 1) % templates.length];
    const start = state.deadline - state.weekDuration * 1000;
    const pace = state.weekDuration / 60;
    const opensAt = start + (13 + (week * 7 % 24)) * pace * 1000;
    const decisionSeconds = Math.max(9, (12 + (week % 5)) * pace);
    const expiresAt = Math.min(state.deadline, opensAt + decisionSeconds * 1000);
    return { id: `w${week}-event`, opensAt, expiresAt, ...template };
  }

  function boundedEffects(state, effects) {
    const stats = {};
    for (const [key, points] of Object.entries(effects.stats || {})) {
      const original = state.stats[key];
      const applied = Math.max(0, Math.min(100, original + points)) - original;
      if (applied !== 0) stats[key] = applied;
    }
    const cash = Math.max(state.cash > 0 ? -state.cash : 0, effects.cash || 0);
    return { cash, stats, chance: effects.chance || 0 };
  }

  function current(state, now = Date.now()) {
    const event = eventFor(state);
    if (!event || now < event.opensAt) return null;
    const resolved = (state.eventHistory || []).find(entry => entry.id === event.id);
    const choices = resolved || now >= event.expiresAt ? [] : (event.choices || []).map(choice => {
      const cash = choice.effects.cash || 0;
      const affordable = cash >= 0 || state.cash + cash >= 0;
      return { ...choice, affordable, effects: affordable ? boundedEffects(state, choice.effects) : choice.effects };
    });
    const { id, title, description, opensAt, expiresAt } = event;
    return { id, title, description, opensAt, expiresAt, choices, resolved };
  }

  function resolve(state, event, choice) {
    const { cash, stats, chance } = boundedEffects(state, choice.effects);
    const record = {
      week: state.week, id: event.id, title: event.title,
      label: choice.label, description: choice.description, cash, stats, chance,
    };
    const nextStats = { ...state.stats };
    for (const [key, points] of Object.entries(stats)) nextStats[key] += points;
    return {
      ...state,
      cash: state.cash + cash,
      stats: nextStats,
      eventChanceWeek: state.week,
      eventChanceBonus: chance,
      eventHistory: [...(state.eventHistory || []), record],
    };
  }

  function tick(state, now = Date.now()) {
    const event = eventFor(state);
    if (!event || now < event.opensAt || state.eventHistory?.some(entry => entry.id === event.id)) return state;
    if (event.automatic) return resolve(state, event, event.automatic);
    if (now >= event.expiresAt) return resolve(state, event, event.fallback);
    return state;
  }

  function choose(state, eventId, choiceId, now = Date.now()) {
    const next = tick(state, now);
    const event = current(next, now);
    if (!event || event.id !== eventId) return next;
    const choice = event.choices.find(item => item.id === choiceId);
    return choice?.affordable ? resolve(next, event, choice) : next;
  }

  const api = { current, tick, choose };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else globalThis.CornerEvents = api;
})();
