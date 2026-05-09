/* ==========================================================
   FIRED FROM JOB! — app.js
   ========================================================== */
(function () {
  'use strict';

  /* ---------- DATA ---------- */
  const ROLES = [
    "AI Engineer",
    "Product Manager",
    "Consultant",
    "Data Scientist",
    "DevOps Engineer",
    "UX Designer",
    "Security Analyst",
    "ML Researcher",
    "Solutions Architect"
  ];

  const VOLUME_ROLES = [
    {name:"AI Engineer",        vol:"82,141", pct:"+24.6%", dir:"pos", w:1.00, accent:true},
    {name:"Software Engineer",  vol:"71,402", pct:"+4.1%",  dir:"pos", w:0.87},
    {name:"Data Scientist",     vol:"54,019", pct:"+18.0%", dir:"pos", w:0.66},
    {name:"Product Manager",    vol:"38,760", pct:"-7.2%",  dir:"neg", w:0.47},
    {name:"DevOps / SRE",       vol:"29,114", pct:"+11.4%", dir:"pos", w:0.35},
    {name:"UX Designer",        vol:"17,320", pct:"-12.8%", dir:"neg", w:0.21}
  ];

  const INDUSTRIES = [
    {n:"Financial Services",  p:"+19.4%"},
    {n:"Health & Biotech",    p:"+14.8%"},
    {n:"Energy / Climate",    p:"+12.1%"},
    {n:"Defense & Aerospace", p:"+9.7%"},
    {n:"Logistics",           p:"+6.2%"}
  ];

  const QMOVES = [
    {name:"Prompt Engineer",      pct: 64,  dir:"pos", spark:"▁▂▂▃▅▆█"},
    {name:"AI Safety Researcher", pct: 52,  dir:"pos", spark:"▂▂▃▄▅▆▇"},
    {name:"ML Platform Eng",      pct: 41,  dir:"pos", spark:"▂▃▃▄▅▆▆"},
    {name:"Security Operations",  pct: 33,  dir:"pos", spark:"▂▃▄▅▅▅▆"},
    {name:"Data Engineer",        pct: 22,  dir:"pos", spark:"▃▃▃▄▄▅▅"},
    {name:"Solutions Architect",  pct: 12,  dir:"pos", spark:"▃▃▄▃▄▄▄"},
    {name:"Product Designer",     pct: -6,  dir:"neg", spark:"▅▄▄▄▃▃▃"},
    {name:"Frontend Developer",   pct: -11, dir:"neg", spark:"▆▅▅▄▄▃▃"},
    {name:"Customer Support",     pct: -18, dir:"neg", spark:"▇▆▅▄▃▃▂"},
    {name:"QA Engineer",          pct: -24, dir:"neg", spark:"█▇▆▅▄▃▂"},
    {name:"Recruiter",            pct: -29, dir:"neg", spark:"█▇▅▄▃▂▂"},
    {name:"Junior PM",            pct: -38, dir:"neg", spark:"█▇▅▄▃▂▁"}
  ];

  /* ---------- LIVE CLOCK ---------- */
  function tickClock() {
    const el = document.getElementById('liveClock');
    if (!el) return;
    const d = new Date();
    const pad = n => String(n).padStart(2,'0');
    el.textContent = `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`;
  }

  /* ---------- HERO ROLE ROTATOR ---------- */
  function startRoleRoll() {
    const wrap = document.getElementById('roleRoll');
    if (!wrap) return;
    let i = 0;
    setInterval(() => {
      i = (i + 1) % ROLES.length;
      wrap.innerHTML = `<span class="hero-track-role">${ROLES[i]}</span>`;
    }, 2200);
  }

  /* ---------- HERO LIVE COUNT ---------- */
  function startJobCount() {
    const el = document.getElementById('jobCount');
    if (!el) return;
    let n = 12847392;
    setInterval(() => {
      n += Math.floor(Math.random() * 19) + 1;
      el.textContent = n.toLocaleString('en-US');
    }, 1400);
  }

  /* ---------- HERO SPARKLINE ---------- */
  function drawHeroSpark() {
    const line = document.getElementById('heroSpark');
    if (!line) return;
    const W = 1200, H = 60;
    const pts = [];
    let v = 30;
    for (let i = 0; i < 60; i++) {
      v += (Math.random() - 0.45) * 7;
      v = Math.max(8, Math.min(54, v));
      const x = (i / 59) * W;
      pts.push(`${x.toFixed(1)},${(H - v).toFixed(1)}`);
    }
    line.setAttribute('points', pts.join(' '));
  }

  /* ---------- VOLUME LIST ---------- */
  function renderVolume() {
    const ul = document.getElementById('volList');
    if (!ul) return;
    ul.innerHTML = VOLUME_ROLES.map((r, i) => `
      <li class="vol-row">
        <span class="vol-rank">0${i+1}</span>
        <div class="vol-name-wrap">
          <div class="vol-name">${r.name}</div>
          <div class="bar-wrap ${r.accent ? 'is-accent':''}"><span style="width:${(r.w*100).toFixed(0)}%"></span></div>
        </div>
        <span class="vol-volume">${r.vol}</span>
        <span class="vol-pct ${r.dir}">${r.dir==='pos'?'▲':'▼'} ${r.pct}</span>
      </li>
    `).join('');
  }

  /* ---------- GAUGE ---------- */
  function setupGauge() {
    const ticks = document.getElementById('gaugeTicks');
    const needle = document.getElementById('gaugeNeedle');
    if (!ticks || !needle) return;
    // Build ticks along arc 180° → 0°
    let html = '';
    for (let i = 0; i <= 20; i++) {
      const a = Math.PI - (i/20) * Math.PI;
      const r1 = 168, r2 = i % 5 === 0 ? 178 : 174;
      const cx = 200, cy = 220;
      const x1 = cx + r1 * Math.cos(a);
      const y1 = cy - r1 * Math.sin(a);
      const x2 = cx + r2 * Math.cos(a);
      const y2 = cy - r2 * Math.sin(a);
      html += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" />`;
    }
    ticks.innerHTML = html;

    // Set needle to "Caution · 58" — value 58/100 → angle from -90 to +90
    const value = 58;
    const angle = -90 + (value/100) * 180;
    needle.style.transform = `rotate(${angle}deg)`;
  }

  /* ---------- INDUSTRIES ---------- */
  function renderIndustries() {
    const ol = document.getElementById('industryList');
    if (!ol) return;
    ol.innerHTML = INDUSTRIES.map((it, i) => `
      <li>
        <span class="rk mono">0${i+1}</span>
        <span class="nm">${it.n}</span>
        <span class="pct pos">${it.p}</span>
      </li>
    `).join('');
  }

  /* ---------- QUARTERLY MOVES ---------- */
  function renderQMoves() {
    const wrap = document.getElementById('qmoveWrap');
    if (!wrap) return;
    const maxAbs = Math.max(...QMOVES.map(m => Math.abs(m.pct)));
    wrap.innerHTML = QMOVES.map((m, i) => {
      const widthPct = (Math.abs(m.pct) / maxAbs) * 50;  // half-track each side
      const style = m.dir === 'pos'
        ? `left: 50%; width: ${widthPct}%;`
        : `right: 50%; width: ${widthPct}%;`;
      return `
        <div class="qmove-row">
          <span class="qmove-rk mono">${String(i+1).padStart(2,'0')}</span>
          <span class="qmove-name">${m.name}</span>
          <div class="qmove-track">
            <div class="qmove-bar ${m.dir}" style="${style}"></div>
          </div>
          <span class="qmove-pct ${m.dir}">${m.dir==='pos'?'+':''}${m.pct}%</span>
          <span class="qmove-spark">${m.spark}</span>
        </div>
      `;
    }).join('');
  }

  /* ---------- DOT NAV / SECTION OBSERVER ---------- */
  function setupDotNav() {
    const dots = document.querySelectorAll('.dot');
    const scroller = document.getElementById('scroller');
    const sections = ['sec1','sec2','sec3','sec4'].map(id => document.getElementById(id));

    dots.forEach(d => {
      d.addEventListener('click', e => {
        e.preventDefault();
        const targetId = d.getAttribute('data-target');
        const target = document.getElementById(targetId);
        if (!target || !scroller) return;
        scroller.scrollTo({ top: target.offsetTop - scroller.offsetTop, behavior: 'smooth' });
      });
    });

    if (!('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting && en.intersectionRatio > 0.5) {
          dots.forEach(d => d.classList.toggle('active', d.getAttribute('data-target') === en.target.id));
        }
      });
    }, { root: scroller, threshold: [0.5, 0.8] });
    sections.forEach(s => s && io.observe(s));
  }

  /* ---------- FILTERS / EXPLORE ---------- */
  const FilterState = {
    country: ['IN','US'],
    city:    ['BLR'],
    role:    ['AI','PM','SWE'],
    mode:    ['HYB','REM'],
    src:     ['LI','NK','MJ','IND']
  };
  const ROLE_NAMES = {
    AI:"AI Engineer", PM:"Product Manager", SWE:"Software Eng",
    DS:"Data Scientist", DEV:"DevOps", UX:"UX Designer",
    CON:"Consultant", FIN:"Financial Analyst"
  };

  function setupFilters() {
    document.querySelectorAll('.chips').forEach(group => {
      const groupName = group.getAttribute('data-group');
      group.addEventListener('click', e => {
        const btn = e.target.closest('.chip');
        if (!btn) return;
        btn.classList.toggle('is-on');
        const v = btn.getAttribute('data-v');
        const isOn = btn.classList.contains('is-on');
        const arr = FilterState[groupName] || (FilterState[groupName] = []);
        if (isOn && !arr.includes(v)) arr.push(v);
        if (!isOn) {
          const idx = arr.indexOf(v);
          if (idx >= 0) arr.splice(idx, 1);
        }
        updateFilterUI();
        updateChart();
      });
    });
    updateFilterUI();
  }

  function updateFilterUI() {
    const regionN = document.getElementById('regionCount');
    const roleN   = document.getElementById('roleCount');
    const modeN   = document.getElementById('modeCount');
    const srcN    = document.getElementById('srcCount');
    if (regionN) regionN.textContent = `${FilterState.country.length + FilterState.city.length} active`;
    if (roleN)   roleN.textContent   = `${FilterState.role.length} active`;
    if (modeN)   modeN.textContent   = `${FilterState.mode.length} active`;
    if (srcN)    srcN.textContent    = `${FilterState.src.length} active`;

    const fetched  = computePoints();
    const analysed = Math.floor(fetched * 0.918);
    const conf     = (97 + Math.random() * 2.5).toFixed(1);
    animateNum('dpFetched', fetched);
    animateNum('dpAnalysed', analysed);
    const q = document.getElementById('dpQuality');
    if (q) q.innerHTML = `${conf}<span class="unit">%</span>`;

    const summary = document.getElementById('appliedSummary');
    if (summary) {
      summary.innerHTML = `
        <div class="summary-row"><span class="lbl">REGION</span>
          <span class="val">${FilterState.country.join(', ') || '—'} · ${FilterState.city.join(', ') || '—'}</span></div>
        <div class="summary-row"><span class="lbl">ROLES</span>
          <span class="val acc">${FilterState.role.length ? FilterState.role.map(r=>ROLE_NAMES[r]||r).join(' · ') : '—'}</span></div>
        <div class="summary-row"><span class="lbl">MODE</span>
          <span class="val">${FilterState.mode.join(' · ') || '—'}</span></div>
        <div class="summary-row"><span class="lbl">SOURCES</span>
          <span class="val">${FilterState.src.join(' · ') || '—'}</span></div>
        <div class="summary-row"><span class="lbl">WINDOW</span><span class="val">18 weeks · 2026 H1</span></div>
      `;
    }
    const qhash = document.getElementById('queryHash');
    if (qhash) {
      const hash = (Math.random() * 0xffff).toString(16).padStart(4, '0');
      const tail = (Math.random() * 0xffff).toString(16).padStart(4, '0');
      qhash.textContent = `0x${hash}…${tail}`;
    }
  }

  function computePoints() {
    const c = FilterState.country.length || 0.4;
    const ci = FilterState.city.length    || 0.4;
    const r = FilterState.role.length     || 0.4;
    const m = FilterState.mode.length     || 0.4;
    const s = FilterState.src.length      || 0.4;
    const base = 28000;
    return Math.floor(base * c * (1 + ci*0.3) * r * (m * 0.7 + 0.3) * (s * 0.4 + 0.4));
  }

  function animateNum(id, target) {
    const el = document.getElementById(id);
    if (!el) return;
    const cur = parseInt((el.textContent||'0').replace(/[^\d]/g,''), 10) || 0;
    const start = performance.now();
    const dur = 600;
    function frame(t) {
      const k = Math.min(1, (t - start) / dur);
      const e = 1 - Math.pow(1 - k, 3);
      const val = Math.floor(cur + (target - cur) * e);
      el.textContent = val.toLocaleString('en-US');
      if (k < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* ---------- CHART ---------- */
  let currentViz = 'line';
  const SERIES_COLORS = {};
  function getColors() {
    const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#ff5b1f';
    return [accent, '#14110d', '#5b554a', '#1f7a45', '#1463ff', '#a23ab8'];
  }

  function makeSeries(role, salt) {
    // 18 weeks
    const pts = [];
    let v = 30 + ((salt * 13) % 25);
    const trend = ((salt * 7) % 11) - 5;  // -5..5 per period
    for (let w = 0; w < 18; w++) {
      v += (Math.random() - 0.5) * 6 + trend * 0.18;
      v = Math.max(6, Math.min(96, v));
      pts.push(v);
    }
    return pts;
  }

  function updateChart() {
    const svg = document.getElementById('chartSvg');
    const legend = document.getElementById('chartLegend');
    if (!svg || !legend) return;
    const W = 800, H = 420;
    const padL = 44, padR = 18, padT = 18, padB = 36;
    const innerW = W - padL - padR;
    const innerH = H - padT - padB;
    const colors = getColors();

    const roles = FilterState.role.length ? FilterState.role.slice(0, 5) : ['AI'];
    const series = roles.map((r, i) => ({ key: r, name: ROLE_NAMES[r] || r, data: makeSeries(r, i+1+r.charCodeAt(0)), color: colors[i % colors.length] }));

    // Y scale 0..100
    const x = (i) => padL + (i / 17) * innerW;
    const y = (v) => padT + (1 - v / 100) * innerH;

    let svgInner = '';
    // axes
    svgInner += `<line class="axis-line" x1="${padL}" y1="${padT+innerH}" x2="${padL+innerW}" y2="${padT+innerH}" />`;
    svgInner += `<line class="axis-line" x1="${padL}" y1="${padT}" x2="${padL}" y2="${padT+innerH}" />`;
    // y ticks
    for (let g = 0; g <= 4; g++) {
      const yy = padT + (g/4) * innerH;
      svgInner += `<line x1="${padL}" y1="${yy}" x2="${padL+innerW}" y2="${yy}" stroke="rgba(0,0,0,0.06)" stroke-dasharray="2 4" />`;
      svgInner += `<text class="axis-tick" x="${padL-8}" y="${yy+3}" text-anchor="end">${100 - g*25}</text>`;
    }
    // x ticks
    for (let w = 0; w < 18; w += 3) {
      const xx = x(w);
      svgInner += `<text class="axis-tick" x="${xx}" y="${padT+innerH+16}" text-anchor="middle">W${String(w+1).padStart(2,'0')}</text>`;
    }

    if (currentViz === 'line' || currentViz === 'area') {
      series.forEach(s => {
        const path = s.data.map((v, i) => `${i===0?'M':'L'}${x(i)},${y(v)}`).join(' ');
        if (currentViz === 'area') {
          const areaPath = path + ` L ${x(17)},${padT+innerH} L ${x(0)},${padT+innerH} Z`;
          svgInner += `<path class="series-area" d="${areaPath}" fill="${s.color}" />`;
        }
        svgInner += `<path class="series-line" d="${path}" stroke="${s.color}" />`;
        s.data.forEach((v, i) => {
          if (i % 3 === 0) svgInner += `<circle class="series-dot" cx="${x(i)}" cy="${y(v)}" r="3" fill="${s.color}" />`;
        });
      });
    } else if (currentViz === 'bars') {
      const bw = innerW / 18 * 0.78;
      const sliceW = bw / Math.max(series.length, 1);
      series.forEach((s, si) => {
        s.data.forEach((v, i) => {
          const xx = x(i) - bw/2 + si * sliceW;
          const yy = y(v);
          const hh = padT+innerH - yy;
          svgInner += `<rect x="${xx}" y="${yy}" width="${sliceW-1}" height="${hh}" fill="${s.color}" opacity="0.92" />`;
        });
      });
    } else if (currentViz === 'heat') {
      const cellW = innerW / 18;
      const rowH = innerH / Math.max(series.length, 1);
      series.forEach((s, si) => {
        s.data.forEach((v, i) => {
          const op = Math.max(0.06, Math.min(1, v/100));
          svgInner += `<rect x="${padL + i*cellW}" y="${padT + si*rowH}" width="${cellW-1}" height="${rowH-1}" fill="${s.color}" opacity="${op.toFixed(2)}" />`;
        });
      });
      // labels at left
      series.forEach((s, si) => {
        svgInner += `<text class="axis-tick" x="${padL-6}" y="${padT + si*rowH + rowH/2 + 3}" text-anchor="end" fill="${s.color}">${(s.name||'').slice(0,10)}</text>`;
      });
    } else if (currentViz === 'scatter') {
      series.forEach(s => {
        s.data.forEach((v, i) => {
          const r = 3 + (v % 7) * 0.4;
          svgInner += `<circle cx="${x(i)}" cy="${y(v)}" r="${r}" fill="${s.color}" opacity="0.85" />`;
        });
      });
    }

    svg.innerHTML = svgInner;

    legend.innerHTML = series.map(s =>
      `<span class="legend-item"><span class="legend-mark" style="background:${s.color}"></span>${s.name}</span>`
    ).join('');
  }

  function setupViz() {
    const tog = document.getElementById('vizToggle');
    if (!tog) return;
    tog.addEventListener('click', e => {
      const b = e.target.closest('.viz-btn');
      if (!b) return;
      tog.querySelectorAll('.viz-btn').forEach(x => x.classList.remove('is-on'));
      b.classList.add('is-on');
      currentViz = b.getAttribute('data-viz');
      updateChart();
    });
  }

  /* ---------- TWEAKS ---------- */
  const PRESETS = [
    {name:"Orange",  c:"#ff5b1f"},
    {name:"Amber",   c:"#f5b800"},
    {name:"Green",   c:"#1f9e5a"},
    {name:"Blue",    c:"#1463ff"},
    {name:"Magenta", c:"#c8345b"}
  ];

  const tweaks = Object.assign({
    accent: "#ff5b1f",
    density: "comfortable",
    snap: "on"
  }, window.__TWEAK_DEFAULTS__ || {});

  function applyTweaks() {
    document.documentElement.style.setProperty('--accent', tweaks.accent);
    document.documentElement.setAttribute('data-density', tweaks.density);
    document.documentElement.setAttribute('data-snap', tweaks.snap);
    updateChart();
  }
  function persistTweaks(patch) {
    try { window.parent.postMessage({type:'__edit_mode_set_keys', edits: patch}, '*'); } catch(e){}
  }

  function buildSwatches() {
    const wrap = document.getElementById('tweakSwatches');
    if (!wrap) return;
    wrap.innerHTML = PRESETS.map(p =>
      `<button class="tweak-sw ${p.c.toLowerCase()===tweaks.accent.toLowerCase()?'is-on':''}" style="--c:${p.c}" data-c="${p.c}" title="${p.name}"></button>`
    ).join('');
    wrap.addEventListener('click', e => {
      const b = e.target.closest('.tweak-sw');
      if (!b) return;
      const c = b.getAttribute('data-c');
      tweaks.accent = c;
      const colorInput = document.getElementById('tweakColor');
      if (colorInput) colorInput.value = c;
      buildSwatches();
      applyTweaks();
      persistTweaks({accent: c});
    }, { once: false });
  }

  function setupTweaks() {
    buildSwatches();
    const ci = document.getElementById('tweakColor');
    if (ci) {
      ci.value = tweaks.accent;
      ci.addEventListener('input', e => {
        tweaks.accent = e.target.value;
        buildSwatches();
        applyTweaks();
        persistTweaks({accent: tweaks.accent});
      });
    }
    bindSegm('tweakDensity', v => { tweaks.density = v; applyTweaks(); persistTweaks({density: v}); });
    bindSegm('tweakSnap',    v => { tweaks.snap    = v; applyTweaks(); persistTweaks({snap: v}); });

    // sync segm UI to defaults
    syncSegm('tweakDensity', tweaks.density);
    syncSegm('tweakSnap',    tweaks.snap);

    // tweaks open/close
    const panel = document.getElementById('tweaksPanel');
    const close = document.getElementById('tweaksClose');
    if (close && panel) {
      close.addEventListener('click', () => {
        panel.hidden = true;
        showFab();
        try { window.parent.postMessage({type:'__edit_mode_dismissed'}, '*'); } catch(e){}
      });
    }

    // host-driven activation
    window.addEventListener('message', ev => {
      const t = ev.data && ev.data.type;
      if (t === '__activate_edit_mode')   { if (panel) panel.hidden = false; hideFab(); }
      if (t === '__deactivate_edit_mode') { if (panel) panel.hidden = true;  showFab(); }
    });
    try { window.parent.postMessage({type:'__edit_mode_available'}, '*'); } catch(e){}
  }

  function bindSegm(id, fn) {
    const wrap = document.getElementById(id);
    if (!wrap) return;
    wrap.addEventListener('click', e => {
      const b = e.target.closest('button');
      if (!b) return;
      wrap.querySelectorAll('button').forEach(x => x.classList.remove('is-on'));
      b.classList.add('is-on');
      fn(b.getAttribute('data-v'));
    });
  }
  function syncSegm(id, v) {
    const wrap = document.getElementById(id);
    if (!wrap) return;
    wrap.querySelectorAll('button').forEach(b => b.classList.toggle('is-on', b.getAttribute('data-v') === v));
  }

  /* ---------- FAB to open tweaks (when host hasn't activated) ---------- */
  function showFab() {
    if (document.getElementById('tweakFab')) return;
    const fab = document.createElement('button');
    fab.id = 'tweakFab';
    fab.className = 'tweak-toggle-fab';
    fab.textContent = '⚙ TWEAKS';
    fab.addEventListener('click', () => {
      const panel = document.getElementById('tweaksPanel');
      if (panel) panel.hidden = false;
      hideFab();
    });
    document.body.appendChild(fab);
  }
  function hideFab() {
    const fab = document.getElementById('tweakFab');
    if (fab) fab.remove();
  }

  /* ---------- INIT ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    tickClock(); setInterval(tickClock, 1000);
    startRoleRoll();
    startJobCount();
    drawHeroSpark();
    renderVolume();
    setupGauge();
    renderIndustries();
    renderQMoves();
    setupDotNav();
    setupFilters();
    setupViz();
    updateChart();
    applyTweaks();
    setupTweaks();
    showFab();
  });
})();
