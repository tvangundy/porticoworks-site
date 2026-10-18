(() => {
  const root = document.querySelector("[data-agents-diagram]");
  if (!root) return;

  const NAMES = ["A", "B", "C", "D", "E", "F", "G"];
  const COLORS = [
    { name: "red",    hex: "#ff4d5e" },
    { name: "blue",   hex: "#4d8bff" },
    { name: "green",  hex: "#00e854" },
    { name: "amber",  hex: "#ffb020" },
    { name: "violet", hex: "#b06bff" },
    { name: "cyan",   hex: "#00c8e0" },
    { name: "pink",   hex: "#ff6bc1" },
  ];
  const PERSON_R = 255;
  const AGENT_R = 165;
  const HOLD_MS = 5200;
  const SPAWN_MS = 2400;
  const MAX_LIVE = 3;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const NS = "http://www.w3.org/2000/svg";
  const el = (tag, attrs = {}, parent) => {
    const n = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
    if (parent) parent.appendChild(n);
    return n;
  };

  const svg = root.querySelector("svg");
  const layers = {
    own: el("g", {}, svg),
    convo: el("g", {}, svg),
    agents: el("g", {}, svg),
    people: el("g", {}, svg),
  };
  const legend = root.querySelector(".agents-legend");
  const pauseBtn = root.querySelector("[data-action=pause]");
  const singleBtn = root.querySelector("[data-action=single]");
  const stepBtn = root.querySelector("[data-action=step]");

  const nodes = NAMES.map((name, i) => {
    const a = (i / NAMES.length) * Math.PI * 2 - Math.PI / 2;
    const p = { x: Math.cos(a) * PERSON_R, y: Math.sin(a) * PERSON_R };
    const g = { x: Math.cos(a) * AGENT_R, y: Math.sin(a) * AGENT_R };

    el("line", { class: "own-link", x1: p.x, y1: p.y, x2: g.x, y2: g.y }, layers.own);

    const agent = el("g", { transform: `translate(${g.x} ${g.y}) rotate(${(a * 180) / Math.PI + 90})` }, layers.agents);
    const agentBody = el("rect", { class: "agent-body", x: -16, y: -16, width: 32, height: 32, rx: 9 }, agent);
    const agentCore = el("circle", { class: "agent-core", r: 6 }, agent);

    const person = el("g", { transform: `translate(${p.x} ${p.y})` }, layers.people);
    const personBody = el("circle", { class: "person-body", r: 26 }, person);
    el("circle", { class: "person-glyph", cx: 0, cy: -7, r: 7 }, person);
    el("path", { class: "person-glyph", d: "M -12 15 Q -12 2 0 2 Q 12 2 12 15 Z" }, person);
    el("text", { class: "person-label", x: Math.cos(a) * 46, y: Math.sin(a) * 46 }, person).textContent = name;

    return { name, p, g, agentBody, agentCore, personBody };
  });

  // Bow each line slightly so lines into the same agent fan out instead of overlapping.
  const pathFor = (from, to) => {
    const mx = (from.x + to.x) / 2, my = (from.y + to.y) / 2;
    const dx = to.x - from.x, dy = to.y - from.y;
    const len = Math.hypot(dx, dy) || 1;
    const bow = Math.min(40, len * 0.12);
    return `M ${from.x} ${from.y} Q ${mx - (dy / len) * bow} ${my + (dx / len) * bow} ${to.x} ${to.y}`;
  };

  const shuffle = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const live = [];
  let colorCursor = Math.floor(Math.random() * COLORS.length);
  let paused = false;
  let single = false;
  let visible = false;

  function pickColor() {
    const used = new Set(live.map((c) => c.color.name));
    for (let k = 0; k < COLORS.length; k++) {
      const c = COLORS[(colorCursor + k) % COLORS.length];
      if (!used.has(c.name)) { colorCursor = (colorCursor + k + 1) % COLORS.length; return c; }
    }
    return COLORS[0];
  }

  function startConversation() {
    const hosts = live.map((c) => c.host);
    const candidates = nodes.filter((n) => !hosts.includes(n));
    if (!candidates.length) return;
    const host = candidates[Math.floor(Math.random() * candidates.length)];
    const invitees = shuffle(nodes.filter((n) => n !== host)).slice(0, 1 + Math.floor(Math.random() * 3));
    const members = [host, ...invitees];
    const color = pickColor();

    const group = el("g", {}, layers.convo);
    const lines = members.map((m) => {
      const d = m === host ? `M ${m.p.x} ${m.p.y} L ${host.g.x} ${host.g.y}` : pathFor(m.p, host.g);
      const path = el("path", { class: "convo-line", d, stroke: color.hex, filter: "url(#agents-glow)" }, group);
      const len = path.getTotalLength();
      path.style.strokeDasharray = len;
      path.style.strokeDashoffset = len;
      const dot = el("circle", { class: "pulse", r: 4.5, fill: color.hex }, group);
      return { path, len, dot, offset: Math.random() };
    });

    const item = document.createElement("div");
    item.className = "agents-legend-item";
    item.innerHTML =
      `<span class="swatch" style="background:${color.hex}"></span>` +
      `<span><strong>${host.name}</strong>'s agent</span>` +
      `<span class="who">${members.map((m) => m.name).join(", ")}</span>`;
    legend.appendChild(item);

    const convo = { host, members, color, group, lines, item, born: performance.now() };
    live.push(convo);

    members.forEach((m) => { m.personBody.style.stroke = color.hex; });
    host.agentBody.style.stroke = color.hex;
    host.agentBody.style.fill = color.hex + "33";
    host.agentCore.style.fill = color.hex;
    host.agentBody.setAttribute("filter", "url(#agents-glow)");

    requestAnimationFrame(() => {
      lines.forEach((l) => {
        l.path.classList.add("on");
        l.path.style.strokeDashoffset = 0;
        if (!reduceMotion) l.dot.classList.add("on");
      });
      item.classList.add("on");
    });

    convo.timer = setTimeout(() => endConversation(convo), HOLD_MS);
  }

  function endConversation(convo) {
    const i = live.indexOf(convo);
    if (i === -1) return;
    live.splice(i, 1);
    clearTimeout(convo.timer);

    convo.lines.forEach((l) => {
      l.path.classList.remove("on");
      l.dot.classList.remove("on");
    });
    convo.item.classList.remove("on");

    convo.members.forEach((m) => {
      const still = live.find((c) => c.members.includes(m));
      m.personBody.style.stroke = still ? still.color.hex : "";
    });
    const h = convo.host;
    h.agentBody.style.stroke = "";
    h.agentBody.style.fill = "";
    h.agentCore.style.fill = "";
    h.agentBody.removeAttribute("filter");

    setTimeout(() => {
      convo.group.remove();
      convo.item.remove();
    }, 900);
  }

  function animatePulses(now) {
    for (const c of live) {
      for (const l of c.lines) {
        const pt = l.path.getPointAtLength(l.len * ((((now - c.born) / 1600) + l.offset) % 1));
        l.dot.setAttribute("cx", pt.x);
        l.dot.setAttribute("cy", pt.y);
      }
    }
    requestAnimationFrame(animatePulses);
  }
  requestAnimationFrame(animatePulses);

  function tick() {
    if (paused || !visible) return;
    if (single ? live.length === 0 : live.length < MAX_LIVE) startConversation();
  }

  const clearAll = () => live.slice().forEach(endConversation);

  pauseBtn.addEventListener("click", () => {
    paused = !paused;
    pauseBtn.textContent = paused ? "Play" : "Pause";
    pauseBtn.setAttribute("aria-pressed", String(paused));
  });
  singleBtn.addEventListener("click", () => {
    single = !single;
    singleBtn.setAttribute("aria-pressed", String(single));
    if (single) clearAll();
  });
  stepBtn.addEventListener("click", () => {
    if (single || live.length >= MAX_LIVE) clearAll();
    startConversation();
  });

  new IntersectionObserver((entries) => {
    visible = entries[0].isIntersecting;
    if (visible && !paused && live.length === 0) startConversation();
  }, { threshold: 0.25 }).observe(root);

  setInterval(tick, reduceMotion ? SPAWN_MS * 2 : SPAWN_MS);
})();
