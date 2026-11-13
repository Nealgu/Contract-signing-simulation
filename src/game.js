(() => {
  "use strict";

  const game = window.CornerGame;
  const events = window.CornerEvents;
  const $ = (id) => document.getElementById(id);
  const dialog = $("dialog");
  const dialogContent = $("dialog-content");
  const saveKey = "corner-office.game.v1";
  const cashFormatter = new Intl.NumberFormat("zh-CN", { maximumFractionDigits: 0 });
  const money = (amount) => `${amount < 0 ? "−" : ""}¥${cashFormatter.format(Math.abs(amount))}`;
  const weekNumber = (week) => String(week).padStart(2, "0");
  const calendarLabel = (round) => `${Math.ceil(round / 2)}月${round % 2 ? "上" : "下"}半月`;
  const monthEndLabel = (round) => `${Math.ceil(round / 2)}月末`;
  const icons = {
    store: '<path d="M3 10l2-6h14l2 6M3 10a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0M5 13v7h14v-7M10 20v-5h4v5"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M9 9a3 3 0 1 1 4 2.8c-.7.3-1 .8-1 1.7m0 3.2h.01"/>',
    rotate: '<path d="M3 12a9 9 0 1 1 2.6 6.4M3 12V5m0 7h7"/>',
    calendar: '<rect x="4" y="5" width="16" height="16" rx="2"/><path d="M8 3v4m8-4v4M4 10h16m-12 5h3m3 0h2"/>',
    map: '<path d="m3 6 6-2 6 2 6-2v14l-6 2-6-2-6 2Zm6-2v14m6-12v14"/>',
    pointer: '<path d="m6 3 13 10-6 1-2 6-5-17Z"/>',
    list: '<rect x="5" y="4" width="14" height="16" rx="2"/><path d="M9 9h6m-6 3h6m-6 3h4"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    bolt: '<path d="m13 2-9 12h7l-1 8 10-12h-7l1-8Z"/>',
    wallet: '<path d="M20 8H6a2 2 0 0 1 0-4h12m-14 2v12a2 2 0 0 0 2 2h14v-5m-4-5h5v5h-5a2.5 2.5 0 0 1 0-5Zm0 2.5h.1"/>',
    sparkles: '<path d="M12 3l2.3 6.7L21 12l-6.7 2.3L12 21l-2.3-6.7L3 12l6.7-2.3L12 3ZM5 3v4M3 5h4"/>',
    star: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z"/>',
    users: '<circle cx="9" cy="8" r="3"/><path d="M3 20v-2a5 5 0 0 1 5-5h2a5 5 0 0 1 5 5v2m1-15a3 3 0 0 1 0 6m3 9v-2a4.5 4.5 0 0 0-2.5-4"/>',
    box: '<path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Zm-8 4.5 8 4.5 8-4.5M12 12v9m-4-15.8 8 4.6"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    arrow: '<path d="M4 12h15m-6-6 6 6-6 6"/>',
    doc: '<path d="M5 3h9l4 4v14H5V3Zm9 0v5h4M8 12h7m-7 4h5"/>',
    megaphone: '<path d="m4 10 15-5v14L4 14v-4Zm4 5 2 5h3l-1.5-4M2 10v4"/>',
    exhibition: '<rect x="4" y="4" width="16" height="12" rx="2"/><path d="M12 16v5m-4 0h8M8 12l3-3 2 2 3-3"/>',
    coffee: '<path d="M4 8h13v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8Zm13 1h2a2 2 0 1 1 0 4h-2M3 21h18M8 3v2m5-2v2"/>',
    training: '<path d="m2 9 10-5 10 5-10 5L2 9Zm4 2v6c4 3 8 3 12 0v-6m4-2v6"/>',
    gift: '<rect x="3" y="8" width="18" height="5" rx="1"/><path d="M5 13v8h14v-8M12 8v13m0-13c-2-7-9-5-6-1 1 1.3 4 1 6 1Zm0 0c2-7 9-5 6-1-1 1.3-4 1-6 1Z"/>'
  };
  const statVisuals = {
    reputation: ["star", "#c18c35"],
    relationships: ["users", "#74976a"],
    sap: ["box", "#639e9c"],
    ai: ["sparkles", "#8f82af"]
  };
  const routes = [
    { start: 4, end: 95, top: 82, still: 15 },
    { start: 96, end: 5, top: 91, still: 38 },
    { start: 5, end: 95, top: 94, still: 64 },
    { start: 95, end: 5, top: 86, still: 85 }
  ];

  function icon(name) {
    return `<svg class="glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || icons.sparkles}</svg>`;
  }

  function sprite(id) {
    return `<svg class="sprite" viewBox="0 0 72 100" aria-hidden="true"><use href="#${id}"></use></svg>`;
  }

  function load() {
    try {
      return game.restoreGame(JSON.parse(localStorage.getItem(saveKey)));
    } catch {
      // A fresh game is available if storage is disabled or an old save cannot be read.
    }
    return null;
  }

  let state = load();
  let selectedRole = game.roles[0].id;
  let toastTimeout;
  const walkers = new Map();
  let eventMarkup;
  const prefersStill = window.matchMedia("(prefers-reduced-motion: reduce)");
  const roleData = () => game.roles.find((role) => role.id === (state?.roleId || selectedRole));

  function commit(next) {
    state = next;
    try {
      if (state) localStorage.setItem(saveKey, JSON.stringify(state));
      else localStorage.removeItem(saveKey);
      $("save-status").innerHTML = "<i></i> 本地自动存档";
    } catch {
      $("save-status").textContent = "当前窗口无法存档";
    }
    renderBoard();
  }

  function toast(message) {
    $("toast").textContent = message;
    $("toast").hidden = false;
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => { $("toast").hidden = true; }, 3200);
  }

  function remainingVisitMs(contract, now) {
    const visitEnd = Number.isFinite(contract.leavesAt)
      ? state.deadline - (state.weekDuration - contract.leavesAt) * 1000 : state.deadline;
    return Math.max(0, visitEnd - now);
  }

  function renderClock(now = Date.now()) {
    const duration = state?.weekDuration ?? game.roundSeconds;
    const seconds = state?.phase === "week"
      ? Math.min(duration, Math.max(0, Math.ceil((state.deadline - now) / 1000)))
      : state ? 0 : duration;
    const label = `${weekNumber(Math.floor(seconds / 60))}:${weekNumber(seconds % 60)}`;
    if ($("timer").textContent !== label) $("timer").textContent = label;
    $("timer-fill").style.width = `${100 * seconds / duration}%`;
    $("timer").parentElement.dataset.low = seconds > 0 && seconds <= 10;
    const contractTimer = $("contract-timer");
    if (contractTimer && dialog.dataset.contractId) {
      const contract = state.contracts.find((item) => item.id === dialog.dataset.contractId);
      const visitLabel = contract ? `${Math.ceil(remainingVisitMs(contract, now) / 1000)} 秒` : "";
      if (contractTimer.textContent !== visitLabel) contractTimer.textContent = visitLabel;
    }
  }

  function moveWalker(walker, now) {
    const { element, route, contract } = walker;
    const progress = game.contractVisitProgress(state, contract, now);
    const left = prefersStill.matches || progress === null
      ? route.still : route.start + (route.end - route.start) * progress;
    element.style.left = `${left}%`;
  }

  function renderTraffic(now) {
    const phase = state?.phase || "start";
    const active = new Set();
    let onTheWay = false;
    let missed = 0;
    if (phase === "week") {
      state.contracts.forEach((contract, index) => {
        if (contract.status !== "open") return;
        if (!game.isContractAvailable(state, contract, now)) {
          if (remainingVisitMs(contract, now) === 0) missed++;
          else onTheWay = true;
          return;
        }
        active.add(contract.id);
        if (walkers.has(contract.id)) return;
        const route = routes[index % routes.length];
        const support = contract.kind === "support";
        const element = document.createElement("button");
        element.type = "button";
        element.className = "walker walker-button";
        element.dataset.action = "contract";
        element.dataset.id = contract.id;
        element.dataset.kind = support ? "support" : "project";
        element.setAttribute("aria-label", `查看${contract.client}的${support ? "月付支持" : "项目"}合同`);
        element.style.top = `${route.top}%`;
        element.style.zIndex = route.top;
        element.innerHTML = `<span class="walker-tag">${icon("doc")} ${support ? "月付" : "合同"}</span>
          <span class="walker-body">${sprite(`client-${(state.week - 1 + index) % 6}`)}</span>`;
        const walker = { element, route, contract };
        moveWalker(walker, now);
        walkers.set(contract.id, walker);
        $("traffic").append(element);
      });
    }
    for (const [id, walker] of walkers) {
      if (active.has(id)) continue;
      walker.element.remove();
      walkers.delete(id);
    }
    const liveLabel = active.size ? `街上 ${active.size} 位客户`
      : onTheWay ? "下一批客户正在路上" : "本轮客户已走完";
    const caption = {
      start: "选好角色，即可开门营业",
      week: missed ? `${liveLabel} · 错过 ${missed} 位` : liveLabel,
      opportunities: "休息一下，看看轮末机遇",
      summary: "创业第一年结束了"
    }[phase];
    if ($("street-caption").textContent !== caption) $("street-caption").textContent = caption;
  }

  function animateWalkers() {
    const now = Date.now();
    for (const walker of walkers.values()) moveWalker(walker, now);
    requestAnimationFrame(animateWalkers);
  }

  function renderBoard() {
    const phase = state?.phase || "start";
    const role = roleData();
    $("reset-button").hidden = !state;
    const status = $("district-status");
    status.dataset.phase = phase;
    status.innerHTML = `<i></i> ${{ start: "等待开业", week: "营业中", opportunities: "本轮打烊", summary: "年度已完成" }[phase]}`;
    $("week-text").textContent = calendarLabel(state?.week || 1);
    $("round-text").textContent = `第 ${weekNumber(state?.week || 1)} 轮 / ${game.roundsPerYear} 轮`;
    const cash = state?.cash ?? game.startCash;
    $("cash-label").textContent = cash < 0 ? "资金缺口" : "可用资金";
    $("cash-value").textContent = money(cash);
    $("cash-value").dataset.negative = cash < 0;
    const schedule = state && game.getSupportSchedule(state);
    const supportMeter = $("support-meter");
    supportMeter.hidden = !schedule?.activeCount;
    supportMeter.innerHTML = schedule?.activeCount ? `<div><span>支持合同月收入</span><strong>${money(schedule.monthlyIncome)}</strong></div>
      <small>${schedule.activeCount} 份在执行 · ${schedule.nextWeek ? `下次${monthEndLabel(schedule.nextWeek)}到账` : "余款跨年"} </small>` : "";
    const costsWeek = state && game.getMonthlyCostsSchedule(state);
    const payroll = state ? game.getMonthlyPayroll(state) : game.monthlyPayroll;
    const employees = (state?.opportunityPurchases || []).filter((purchase) => purchase.employeeId);
    const costMeter = $("cost-meter");
    costMeter.hidden = !costsWeek;
    costMeter.innerHTML = costsWeek ? `<div><span>月度固定支出</span><strong>${money(payroll + game.monthlyOperatingCost)}</strong></div>
      <small>${monthEndLabel(costsWeek)}扣款（第 ${weekNumber(costsWeek)} 轮结束）</small><br>
      <small>工资 ${money(payroll)} · 运营费 ${money(game.monthlyOperatingCost)}</small>
      ${employees.length ? `<br><small>已雇佣 ${employees.map((employee) => employee.employeeName).join("、")}</small>` : ""}` : "";
    $("clock-caption").textContent = { start: "签约窗口", week: "签约倒计时", opportunities: "签约已截止", summary: "年度已结算" }[phase];
    const weekAction = $("week-action");
    weekAction.hidden = phase === "week" || phase === "start";
    weekAction.dataset.action = phase === "summary" ? "summary" : "shop";
    weekAction.innerHTML = phase === "summary" ? `查看年终总结 ${icon("arrow")}` : `进入机遇商店 ${icon("arrow")}`;

    $("role-summary").innerHTML = state
      ? `<div class="mini-avatar">${sprite(role.spriteId)}</div><div><b>${role.name}</b>${role.title}</div>`
      : `<div class="mini-avatar">${sprite(role.spriteId)}</div><div><b>轮岗角色待定</b>选角后获得起始属性</div>`;
    $("stats").innerHTML = Object.entries(game.statLabels).map(([key, label]) => {
      const value = (state?.stats || role.stats)[key];
      const [glyph, color] = statVisuals[key];
      return `<div class="stat" style="--stat-color:${color}"><div class="stat-title">${icon(glyph)} ${label}<strong>${value}</strong></div>
        <div class="stat-track"><span style="width:${value}%"></span></div></div>`;
    }).join("");

    $("founder").innerHTML = state ? `<div class="walker player" style="left:50%;top:77.5%;z-index:78">
      <span class="walker-tag">你</span><span class="walker-body">${sprite(role.spriteId)}</span></div>` : "";
    const now = Date.now();
    renderTraffic(now);
    renderEvents(now);
    renderClock(now);
  }

  function button(label, action, options = {}) {
    return `<button class="button${options.accent ? " accent" : ""}" data-action="${action}"${options.id ? ` data-id="${options.id}"` : ""}${options.disabled ? " disabled" : ""}>${label}</button>`;
  }

  function show(view, kicker, title, description, body, actions, close = true) {
    dialog.dataset.view = view;
    delete dialog.dataset.contractId;
    delete dialog.dataset.awaiting;
    dialogContent.innerHTML = `<div class="dialog-inner"><header class="dialog-head">
      <span class="dialog-kicker">${kicker}</span><h2 id="dialog-title">${title}</h2>
      ${description ? `<p>${description}</p>` : ""}
      ${close ? `<button class="icon-button" data-action="close" aria-label="关闭">${icon("close")}</button>` : ""}
      </header>${body}${actions ? `<div class="dialog-actions">${actions}</div>` : ""}</div>`;
    if (!dialog.open) dialog.showModal();
    renderClock();
  }

  function showRoles(focusId) {
    const roleCards = game.roles.map((role) => `<button class="role-card" data-action="role" data-id="${role.id}" aria-pressed="${role.id === selectedRole}">
      <span class="role-art" role="img" aria-label="${role.name}，${role.gender === "F" ? "女性" : "男性"}，${role.glasses ? "戴眼镜" : "无眼镜"}" style="--role-color:${role.color}">${sprite(role.spriteId)}</span>
      <span class="role-name">${role.name}</span><span class="role-title">${role.title}</span>
      <span class="role-desc">${role.description}</span><span class="role-bonus">${role.bonus}</span></button>`).join("");
    show("roles", "轮岗安排  /  NEW GAME", "本轮由谁来经营？",
      "选择一位轮岗负责人。选中的员工本局会从机遇商店的招聘池中移除。",
      `<div class="role-grid">${roleCards}</div>`,
      `<span class="push">启动资金 <b>${money(game.startCash)}</b></span>${button(`开门营业 ${icon("arrow")}`, "start", { accent: true })}`, false);
    if (focusId) dialogContent.querySelector(`[data-id="${focusId}"]`)?.focus();
  }

  function figure(label, value, risk = "") {
    return `<div class="figure"${risk ? ` data-risk="${risk}"` : ""}><small>${label}</small><strong>${value}</strong></div>`;
  }

  function showContract(id, now = Date.now()) {
    const contract = state?.contracts.find((item) => item.id === id);
    if (!contract) return;
    const canSign = game.isContractAvailable(state, contract, now);
    const support = contract.kind === "support";
    const firstPaymentWeek = support ? game.firstSupportPaymentWeek(state.week) : null;
    const firstPaymentLabel = firstPaymentWeek > game.roundsPerYear
      ? "次年度起开始回款" : `${monthEndLabel(firstPaymentWeek)}首次到账`;
    const chance = canSign || contract.status !== "open"
      ? contract.chance ?? game.calcChance(state, contract) : null;
    const risk = chance === null ? "" : chance < 35 ? "high" : chance < 65 ? "medium" : "";
    const wonMessage = support
      ? `支持合同已生效，每月 ${money(contract.amount)}，${firstPaymentLabel}。`
      : `签约成功，${money(contract.amount)} 已到账。`;
    const outcome = contract.status === "won" ? wonMessage
      : contract.status === "lost" ? "签约失败，这份合同没有产生收入。"
      : canSign ? "" : "客户已经离开街区，这份合同已过期。";
    const deliverable = contract.deliverable
      ? `<div class="document-deliverable"><h3>${support ? "每月服务范围" : "交付与验收"}</h3><p>${contract.deliverable}</p></div>` : "";
    const body = `<div class="document"><h3>${support ? "月付支持需求" : "客户需求"}</h3><p>${contract.description}</p>${deliverable}</div>
      <div class="contract-figures">${figure(support ? "每月固定收入" : "签约即到账", money(contract.amount))}
      ${figure("签约成功率", chance === null ? "已截止" : `${chance}%`, risk)}</div>
      <p class="contract-note">主要考量 <strong>${game.statLabels[contract.focus]}</strong>
      ${support ? ` · 连续 ${contract.months} 个月 · ${firstPaymentLabel}` : ""}</p>
      ${outcome ? `<div class="result" data-status="${contract.status === "open" ? "expired" : contract.status}">${outcome}</div>` : ""}`;
    const actions = canSign
      ? `<span class="push">客户将在 <b id="contract-timer"></b>后离开</span>${button("暂不签约", "close")}${button("尝试签约", "sign", { id, accent: true })}`
      : button("知道了", "close", { accent: true });
    show("contract", `客户合同  /  ${contract.client}`, contract.title, "", body, actions);
    dialog.dataset.contractId = id;
    dialog.dataset.awaiting = String(canSign);
    renderClock(now);
  }

  function signedChange(value) {
    return `${value > 0 ? "+" : "−"}${Math.abs(value)}`;
  }

  function eventEffects(effects) {
    const descriptions = [];
    if (effects.cash) descriptions.push(`${effects.cash > 0 ? "+" : "−"}${money(Math.abs(effects.cash))}`);
    for (const [key, points] of Object.entries(effects.stats || {})) {
      if (points) descriptions.push(`${game.statLabels[key]} ${signedChange(points)}`);
    }
    if (effects.chance) descriptions.push(`本轮签约率 ${signedChange(effects.chance)} 个百分点`);
    return descriptions.join(" · ");
  }

  function renderEvents(now) {
    const event = state && events.current(state, now);
    const resolved = event?.resolved || state?.eventHistory?.find((entry) => game.isCurrentRoundRecord(state, entry));
    const active = Boolean(event && !resolved);
    const badge = $("event-badge");
    const seconds = active ? Math.max(0, Math.ceil((event.expiresAt - now) / 1000)) : 0;
    const badgeText = active ? `剩余 ${seconds} 秒` : resolved ? "已处理" : "街区动态";
    if (badge.textContent !== badgeText) badge.textContent = badgeText;
    badge.dataset.active = active;
    const markup = resolved
      ? `<h3>${resolved.title}</h3><p>${resolved.description}</p><p class="event-effects"><b>${resolved.label}</b>
        ${eventEffects(resolved) || " · 无数值变动"}</p>`
      : active
        ? `<h3>${event.title}</h3><p>${event.description}</p>
          <div class="event-choices">${event.choices.map((choice) => `<button class="event-choice" type="button" data-action="event-choice"
            data-id="${event.id}" data-choice="${choice.id}"${choice.affordable ? "" : " disabled"}>
            <strong>${choice.label}</strong><small>${choice.description}</small>
            <small>${choice.affordable ? eventEffects(choice.effects) || "无数值变动" : "资金不足"}</small></button>`).join("")}</div>`
        : `<h3>街上暂时平静</h3><p>${state?.phase === "week" ? "留意这里。营业中可能发生需要立即处理的事。" : "营业中的街区消息会出现在这里。"}</p>`;
    if (markup !== eventMarkup) {
      $("event-body").innerHTML = markup;
      eventMarkup = markup;
    }
  }

  function boostsMarkup(boosts) {
    return Object.entries(boosts).map(([key, points]) => `<span>${game.statLabels[key]} +${points}</span>`).join("");
  }

  function showShop() {
    if (state?.phase !== "opportunities") return;
    const cards = state.opportunities.map((item) => {
      const employee = Boolean(item.employeeId);
      const employeeProfile = employee && game.roles.find((role) => role.employeeId === item.employeeId);
      const artwork = employeeProfile
        ? `<div class="shop-icon employee-avatar">${sprite(employeeProfile.spriteId)}</div>`
        : `<div class="shop-icon" data-icon>${icon(item.icon)}</div>`;
      const purchase = state.opportunityPurchases.find((record) => record.id === item.id
        || (employee && record.employeeId === item.employeeId));
      const purchased = item.purchased || Boolean(purchase);
      const unaffordable = state.cash < item.cost;
      const boosts = purchased
        ? purchase?.boosts || item.boosts
        : Object.fromEntries(Object.entries(item.boosts)
          .map(([key, points]) => [key, Math.min(points, 100 - state.stats[key])])
          .filter(([, points]) => points > 0));
      const maxed = Object.keys(boosts).length === 0;
      const label = purchased ? (employee ? "已入职" : "已购买") : maxed ? "相关属性已满"
        : unaffordable ? `资金不足 · ${money(item.cost)}` : `${employee ? "雇佣" : "购买"} · ${money(item.cost)}`;
      const salary = employee ? `<p class="employee-salary">每月工资 +${money(item.monthlySalary)}</p>
        <p>入职后，从下一次月末结算开始计薪。每位员工限雇佣一次。</p>` : "";
      return `<article class="shop-card"${employee ? ' data-kind="employee"' : ""}>${artwork}
        <h3>${item.title}</h3><p>${item.description}</p><div class="boosts">${boostsMarkup(boosts)}</div>
        ${salary}${button(label, "buy", { id: item.id, disabled: purchased || unaffordable || maxed })}</article>`;
    }).join("");
    const results = state.weekResults.at(-1);
    const supportIncome = results?.supportRevenue ? `，其中月度支持回款 ${money(results.supportRevenue)}` : "";
    const monthlySettlement = results?.payroll || results?.operatingCost
      ? `<p class="monthly-settlement"><b>本月已扣款</b><span>工资 ${money(-results.payroll)}</span>
        <span>运营费 ${money(-results.operatingCost)}</span></p>` : "";
    const refreshCost = game.getOpportunityRefreshCost(state);
    const canRefresh = game.canRefreshOpportunities(state);
    const refreshLabel = refreshCost === 0 ? "免费刷新"
      : canRefresh ? `刷新 · ${money(refreshCost)}` : `资金不足 · ${money(refreshCost)}`;
    const toolbar = `<div class="shop-toolbar"><div class="shop-balance" data-negative="${state.cash < 0}">${state.cash < 0 ? "资金缺口" : "可用资金"} ${money(state.cash)}
      <small>每轮首次免费，之后每次 ${money(game.opportunityRefreshCost)}</small>
      <small>刷新换出 3 张新卡，已购买的升级会保留</small>
      <small>当前月工资 ${money(game.getMonthlyPayroll(state))}，雇佣员工后增加</small></div>
      ${button(`${icon("rotate")} ${refreshLabel}`, "refresh-shop", { disabled: !canRefresh })}</div>`;
    show("shop", `${calendarLabel(state.week)}结束  /  ROUND ${weekNumber(state.week)}`, "轮末机遇商店",
      `本轮签约成功 ${results?.won ?? 0} 单，错过 ${results?.expired ?? 0} 位客户，收入 ${money(results?.revenue ?? 0)}${supportIncome}。`,
      `${monthlySettlement}${toolbar}<div class="shop-grid">${cards}</div>`,
      `<span class="push">机遇可选购，每张限购一次</span>${button(
        state.week === game.roundsPerYear ? `查看年终总结 ${icon("arrow")}` : `进入${calendarLabel(state.week + 1)} ${icon("arrow")}`,
        "next", { accent: true })}`);
  }

  function showSummary() {
    if (state?.phase !== "summary") return;
    const result = game.summarize(state);
    const rate = result.signed ? Math.round(result.won / result.signed * 100) : 0;
    const body = `<div class="summary-figures">
      ${figure("期末资金", money(result.finalCash))}${figure("全年收入", money(result.revenue))}
      ${figure("全年支出", money(result.spent))}${figure("项目收入", money(result.projectRevenue))}
      ${figure("支持合同回款", money(result.supportRevenue))}${figure("全年工资", money(result.payroll))}
      ${figure("全年运营费", money(result.operatingCost))}${figure("商店刷新支出", money(result.refreshSpent))}
      ${figure("年度资金净变动", money(result.net))}${figure("签约成功 / 尝试", `${result.won} / ${result.signed}`)}
      ${figure("实际签约成功率", `${rate}%`)}
      </div><div class="summary-stats boosts">${Object.entries(state.stats).map(([key, value]) => `<span>${game.statLabels[key]} ${value}</span>`).join("")}</div>`;
    show("summary", "年度结算  /  YEAR 01", "创业第一年，收官！",
      `${roleData().name}完成了全年 ${game.roundsPerYear} 轮经营，拿下 ${result.won} 份合同，投资了 ${state.opportunityPurchases.length} 次机遇。`,
      body, `${button("经营记录", "history")}${button("开启新档", "reset", { accent: true })}`);
  }

  function showHistory() {
    const entries = [
      ...(state?.history || []).map((entry) => ({
        week: entry.week, title: entry.title, detail: entry.client,
        result: entry.status !== "won" ? "签约失败"
          : entry.kind === "support" ? `签约 · ${money(entry.amount)}/月` : `+${money(entry.amount)}`
      })),
      ...(state?.eventHistory || []).map((entry) => ({
        week: entry.week, title: entry.title, detail: `突发事件 · ${entry.label}`,
        result: eventEffects(entry) || "已处理"
      })),
      ...(state?.supportPayments || []).map((entry) => ({
        week: entry.week, title: entry.title, detail: `${entry.client} · 月度支持回款`, result: `+${money(entry.amount)}`
      })),
      ...(state?.weekResults || []).flatMap((entry) => [
        ["发放工资", entry.payroll], ["运营费", entry.operatingCost]
      ].filter(([, amount]) => amount > 0).map(([title, amount]) => ({
        week: entry.week, title, detail: "月度固定支出", result: money(-amount)
      }))),
      ...(state?.opportunityPurchases || []).map((entry) => ({
        week: entry.week, title: entry.title,
        detail: entry.employeeId ? `${entry.employeeRole} · 每月工资 +${money(entry.monthlySalary)}` : "轮末机遇",
        result: `−${money(entry.cost)}`
      })),
      ...(state?.opportunityRefreshes || []).map((entry) => ({
        week: entry.week, title: "刷新机遇商店", detail: "轮末机遇", result: entry.cost === 0 ? "免费" : `−${money(entry.cost)}`
      }))
    ].reverse().sort((a, b) => b.week - a.week);
    show("history", "经营档案  /  LOGBOOK", "经营记录", "回顾签约、回款、突发事件和经营支出。",
      entries.length ? `<ul class="history-list">${entries.map((entry) => `<li>
        <div><b>${entry.title}</b><br><small>${calendarLabel(entry.week)} · 第 ${weekNumber(entry.week)} 轮 · ${entry.detail}</small></div><strong>${entry.result}</strong></li>`).join("")}</ul>`
        : '<p class="empty-records">接待客户、处理事件或购买机遇后，这里会留下记录。</p>',
      button("关闭", "close", { accent: true }));
  }

  function showHelp() {
    show("help", "经营手册  /  HOW TO PLAY", "公司怎么经营？", "",
      `<ol class="help-list"><li>选择本轮经营角色，带着 ${money(game.startCash)} 启动资金开业。选中的员工本局会从招聘机遇中移除。</li>
      <li>每轮推进半个月，每月分为上半月和下半月，全年共 ${game.roundsPerYear} 轮。每轮有 ${game.roundSeconds} 秒营业时间，客户离开后本轮就错过了这份合同。点击客户可查看金额、成功率和离开倒计时。</li>
      <li>项目签约后即时到账。标记「月付」的支持合同通常更难签，从签约轮之后的首个月末开始按月回款：上半月签约当月末首次到账，下半月签约下月末首次到账。</li>
      <li>月末自动扣除基础工资 ${money(game.monthlyPayroll)}、已雇佣员工的月薪和运营费 ${money(game.monthlyOperatingCost)}。资金不足时余额会变为负数，后续收入可填补缺口。</li>
      <li>营业中可能遇到接口故障、上线变更或演示插曲。限时决定会影响资金、公司属性或本轮签约率，超时会自动结算。</li>
      <li>每轮结束可安排技术演练、客户交流等活动来升级公司属性。每轮首次刷新机遇免费，之后每次 ${money(game.opportunityRefreshCost)}。准备好后手动进入下半月或下个月。</li>
      <li>开店或刷新时，有 ${Math.round(game.employeeAppearanceChance * 100)}% 的概率出现一张员工卡。花费招聘费可立即提升属性，后续每个月末增加工资支出。每位员工在本局中只能雇佣一次。</li>
      <li>每个下半月结束时结算月度工资、运营费和到期支持回款，一年共结算 12 次。经营满 ${game.roundsPerYear} 轮后，查看年度总结。</li>
      <li>进度保存在本机。营业倒计时会持续计时，轮末商店可随时回来继续。</li></ol>`,
      button("开始经营", "close", { accent: true }));
  }

  function checkDeadline(now = Date.now()) {
    const next = state && game.tick(events.tick(state, now), now);
    const changed = next !== state;
    if (changed) {
      const weekEnded = next.phase === "opportunities" && state.phase === "week";
      commit(next);
      if (weekEnded) {
        showShop();
        return;
      }
    }
    if (dialog.open && dialog.dataset.awaiting === "true") {
      const id = dialog.dataset.contractId;
      const contract = state.contracts.find((item) => item.id === id);
      if (contract && (changed || !game.isContractAvailable(state, contract, now))) showContract(id, now);
    }
    renderTraffic(now);
    renderEvents(now);
    renderClock(now);
  }

  document.addEventListener("click", (event) => {
    const control = event.target.closest("button[data-action]");
    if (!control || control.disabled) return;
    const { action, id } = control.dataset;
    const now = Date.now();
    switch (action) {
      case "role":
        selectedRole = id;
        renderBoard();
        showRoles(id);
        break;
      case "start":
        commit(game.createGame(selectedRole, now));
        dialog.close();
        toast("O一下 信息科技有限公司开业了！");
        break;
      case "contract":
        checkDeadline(now);
        if (state?.phase === "week") showContract(id, now);
        break;
      case "sign": {
        checkDeadline(now);
        if (state?.phase !== "week") break;
        const next = game.signContract(state, id, now);
        if (next !== state) commit(next);
        showContract(id, now);
        break;
      }
      case "event-choice": {
        checkDeadline(now);
        if (state?.phase !== "week") break;
        const next = events.choose(state, id, control.dataset.choice, now);
        if (next !== state) commit(next);
        break;
      }
      case "buy": {
        const next = game.buyOpportunity(state, id);
        if (next !== state) commit(next);
        showShop();
        if (next.opportunities.find((item) => item.id === id)?.purchased) {
          dialogContent.querySelector('[data-action="next"]')?.focus();
        }
        break;
      }
      case "refresh-shop": {
        const next = game.refreshOpportunities(state);
        if (next === state) break;
        commit(next);
        showShop();
        dialogContent.querySelector(game.canRefreshOpportunities(state) ? '[data-action="refresh-shop"]' : '[data-action="next"]')?.focus();
        break;
      }
      case "next": {
        const next = game.nextWeek(state, now);
        if (next === state) break;
        commit(next);
        if (state.phase === "summary") showSummary();
        else {
          dialog.close();
          toast(`${calendarLabel(state.week)}开始，客户已经到了。`);
        }
        break;
      }
      case "shop": showShop(); break;
      case "summary": showSummary(); break;
      case "history": showHistory(); break;
      case "help": showHelp(); break;
      case "reset":
        show("reset", "重新经营  /  NEW GAME", "开启新的第一年？",
          "确认后，当前本地存档会被清除。你可以重新选择经营角色。", "",
          `${button("返回", "close")}${button("清除存档并重开", "confirm-reset", { accent: true })}`);
        break;
      case "confirm-reset":
        selectedRole = game.roles[0].id;
        commit(null);
        showRoles();
        break;
      case "close": dialog.close(); break;
    }
  });

  dialog.addEventListener("cancel", (event) => {
    if (dialog.dataset.view === "roles") event.preventDefault();
  });
  document.addEventListener("visibilitychange", () => checkDeadline());
  window.addEventListener("pageshow", () => checkDeadline());
  document.querySelectorAll("[data-icon]").forEach((element) => {
    element.innerHTML = icon(element.dataset.icon);
  });

  if (state) {
    const now = Date.now();
    commit(game.tick(events.tick(state, now), now));
    if (state.phase === "opportunities") showShop();
    if (state.phase === "summary") showSummary();
  } else {
    renderBoard();
    showRoles();
  }
  setInterval(checkDeadline, 150);
  requestAnimationFrame(animateWalkers);
})();
