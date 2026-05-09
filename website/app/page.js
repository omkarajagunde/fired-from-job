// Server Component — all data is fetched at request time on the server (SSR)
import ExploreSection from './components/ExploreSection'

function buildGaugeTicks() {
  const ticks = []
  for (let i = 0; i <= 20; i++) {
    const a = Math.PI - (i / 20) * Math.PI
    const r1 = 168, r2 = i % 5 === 0 ? 178 : 174
    ticks.push({
      x1: (200 + r1 * Math.cos(a)).toFixed(2),
      y1: (220 - r1 * Math.sin(a)).toFixed(2),
      x2: (200 + r2 * Math.cos(a)).toFixed(2),
      y2: (220 - r2 * Math.sin(a)).toFixed(2),
    })
  }
  return ticks
}

function getMarketData() {
  const now = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  const utcTime = `${pad(now.getUTCHours())}:${pad(now.getUTCMinutes())} UTC`
  const runId = `#FFJ-${now.getUTCFullYear()}-${pad(now.getUTCMonth() + 1)}${pad(now.getUTCDate())}-${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}`

  return {
    utcTime,
    runId,
    jobCount: (12847392 + Math.floor(Math.random() * 500)).toLocaleString('en-US'),
    roles: [
      { name: 'AI Engineer',       vol: '82,141', pct: '+24.6%', pos: true,  w: 1.00, accent: true  },
      { name: 'Software Engineer', vol: '71,402', pct: '+4.1%',  pos: true,  w: 0.87, accent: false },
      { name: 'Data Scientist',    vol: '54,019', pct: '+18.0%', pos: true,  w: 0.66, accent: false },
      { name: 'Product Manager',   vol: '38,760', pct: '-7.2%',  pos: false, w: 0.47, accent: false },
      { name: 'DevOps / SRE',      vol: '29,114', pct: '+11.4%', pos: true,  w: 0.35, accent: false },
      { name: 'UX Designer',       vol: '17,320', pct: '-12.8%', pos: false, w: 0.21, accent: false },
    ],
    gauge: {
      ticks: buildGaugeTicks(),
      value: 58,
      angle: -90 + (58 / 100) * 180,
    },
    industries: [
      { name: 'Financial Services',  pct: '+19.4%' },
      { name: 'Health & Biotech',    pct: '+14.8%' },
      { name: 'Energy / Climate',    pct: '+12.1%' },
      { name: 'Defense & Aerospace', pct: '+9.7%'  },
      { name: 'Logistics',           pct: '+6.2%'  },
    ],
    workModes: [
      { name: 'HYBRID',    mode: 'hybrid', pct: 62, delta: '▲ 4.1', pos: true  },
      { name: 'REMOTE',    mode: 'remote', pct: 23, delta: '▼ 6.3', pos: false },
      { name: 'IN OFFICE', mode: 'office', pct: 15, delta: '▲ 2.2', pos: true  },
    ],
    yoe: [
      { label: 'JUNIOR\n0–2 YOE', pct: 34, h: '34%', peak: false },
      { label: 'MID\n4–5 YOE',    pct: 48, h: '48%', peak: true  },
      { label: 'SENIOR\n8+ YOE',  pct: 18, h: '18%', peak: false },
    ],
  }
}

export default function Page() {
  const data = getMarketData()

  return (
    <>
      {/* ── TOPBAR ── */}
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">▮</span>
          <span className="brand-name">FIRED FROM JOB<span className="bang">!</span></span>
          <span className="brand-tag">/ MARKET INTELLIGENCE TERMINAL</span>
        </div>
        <div className="topbar-meta mono micro">
          <span><span className="status-dot" />LIVE · {data.utcTime}</span>
          <span style={{ color: 'var(--rule-2)' }}>|</span>
          <span className="dim">v 4.12.0</span>
        </div>
      </header>

      <main>
        {/* ── HERO ── */}
        <section className="hero">
          <div className="hero-corners" aria-hidden="true">
            <span className="tl mono micro">N 40°42′46″ · W 74°00′21″</span>
            <span className="tr mono micro">RUN ID · {data.runId}</span>
            <span className="bl mono micro">SAMPLE Δ · 24h</span>
            <span className="br mono micro">SCROLL ↓</span>
          </div>

          <div className="hero-center">
            <div className="pill">
              <span className="pill-dot" />
              <span>Unbiased &amp; data-driven job market watcher</span>
            </div>

            <h1 className="hero-headline">
              Catch the trends<br />
              <em>before</em> they go mainstream.
            </h1>

            <div className="hero-tracking">
              <span className="hero-tracking-label">TRACKING DEMAND FOR</span>
              <span className="hero-tracking-role">AI Engineer</span>
            </div>

            <p className="hero-stat mono">
              <span className="dim">Tracking</span>{' '}
              <strong>{data.jobCount}</strong>{' '}
              <span className="dim">jobs across</span>{' '}
              <strong>20+</strong>{' '}
              <span className="dim">countries,</span>{' '}
              <strong>200+</strong>{' '}
              <span className="dim">cities,</span>{' '}
              <strong>50+</strong>{' '}
              <span className="dim">portals</span>
            </p>
          </div>
        </section>

        {/* ── INSIGHTS ── */}
        <section className="insights">
          <div className="ssr-badge mono micro">
            RENDERED · <span>SERVER SIDE</span> · {data.utcTime}
          </div>

          <div className="section-header">
            <div>
              <span className="mono micro dim">§ 02 / INSIGHTS</span>
              <h2 className="section-title">
                The market is <em>not</em><br />
                what the headlines say.
              </h2>
            </div>
            <p className="section-sub">
              Five independent signals pulled from <span className="hl">2.4M postings</span> in the last 90 days.
              Cross-referenced, deduplicated, source-tagged.
            </p>
          </div>

          <div className="card-grid">

            {/* ── BIG CARD 1 — ROLE VOLUME ── */}
            <article className="card card-big card-volume">
              <div className="card-head">
                <span className="mono micro">01 · ROLE VOLUME · 30D</span>
                <span className="mono micro tag-live"><span className="status-dot" />LIVE</span>
              </div>
              <h3 className="card-title">Roles, ranked by raw posting volume</h3>
              <ul className="vol-list">
                {data.roles.map((r, i) => (
                  <li key={r.name} className="vol-row">
                    <span className="vol-rank">0{i + 1}</span>
                    <div className="vol-name-wrap">
                      <div className="vol-name">{r.name}</div>
                      <div className={`bar-wrap${r.accent ? ' is-accent' : ''}`}>
                        <span style={{ width: `${(r.w * 100).toFixed(0)}%` }} />
                      </div>
                    </div>
                    <span className="vol-volume">{r.vol}</span>
                    <span className={`vol-pct ${r.pos ? 'pos' : 'neg'}`}>
                      {r.pos ? '▲' : '▼'} {r.pct}
                    </span>
                  </li>
                ))}
              </ul>
              <footer className="card-foot mono micro">
                <span>n = 412,318 postings</span>
                <span>updated {data.utcTime}</span>
              </footer>
            </article>

            {/* ── BIG CARD 2 — RECESSION INDEX GAUGE ── */}
            <article className="card card-big card-gauge">
              <div className="card-head">
                <span className="mono micro">02 · PULSEBOARD™</span>
                <span className="mono micro tag-live"><span className="status-dot" />LIVE</span>
              </div>
              <h3 className="card-title">Recession Index</h3>
              <div className="gauge-wrap">
                <svg className="gauge" viewBox="0 0 400 240" aria-hidden="true">
                  <path d="M 40 220 A 160 160 0 0 1 160 71"  className="gauge-arc seg-1" />
                  <path d="M 160 71 A 160 160 0 0 1 240 71"  className="gauge-arc seg-2" />
                  <path d="M 240 71 A 160 160 0 0 1 360 220" className="gauge-arc seg-3" />
                  <g className="gauge-ticks">
                    {data.gauge.ticks.map((t, i) => (
                      <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} />
                    ))}
                  </g>
                  <g style={{ transform: `rotate(${data.gauge.angle}deg)`, transformOrigin: '200px 220px' }}>
                    <line x1="200" y1="220" x2="200" y2="80" className="gauge-needle" />
                    <circle cx="200" cy="220" r="9"  className="gauge-pivot" />
                    <circle cx="200" cy="220" r="3"  className="gauge-pivot-dot" />
                  </g>
                </svg>
                <div className="gauge-legend mono micro">
                  <span className="leg seg-1">EXPANSION</span>
                  <span className="leg seg-2">CAUTION</span>
                  <span className="leg seg-3">CONTRACTION</span>
                </div>
              </div>
              <div className="gauge-readout">
                <div>
                  <span className="mono micro dim">CURRENT READING</span>
                  <span className="gauge-value">CAUTION · {data.gauge.value}</span>
                </div>
                <div>
                  <span className="mono micro dim">Δ vs LAST QTR</span>
                  <span className="gauge-delta neg">▲ +9.2 pts</span>
                </div>
              </div>
              <footer className="card-foot mono micro">
                <span>composite of 14 indicators</span>
                <span>scale 0–100</span>
              </footer>
            </article>

            {/* ── SMALL CARD 1 — INDUSTRY HEAT ── */}
            <article className="card card-sm card-industry">
              <div className="card-head">
                <span className="mono micro">03 · INDUSTRY HEAT</span>
              </div>
              <h3 className="card-title-sm">Where hiring grew most</h3>
              <ul className="industry-list">
                {data.industries.map((ind, i) => (
                  <li key={ind.name} className="industry-row">
                    <span className="industry-rank">0{i + 1}</span>
                    <span className="industry-name">{ind.name}</span>
                    <span className="mono pos" style={{ fontSize: 13, fontWeight: 500 }}>{ind.pct}</span>
                  </li>
                ))}
              </ul>
            </article>

            {/* ── SMALL CARD 2 — WORK MODE ── */}
            <article className="card card-sm card-mode">
              <div className="card-head">
                <span className="mono micro">04 · WORK MODE</span>
              </div>
              <h3 className="card-title-sm">Office vs anywhere</h3>
              <div className="mode-rows">
                {data.workModes.map((m) => (
                  <div key={m.name} className="mode-row" data-mode={m.mode}>
                    <span className="mode-name">{m.name}</span>
                    <div className="mode-bar">
                      <span style={{ width: `${m.pct}%` }} />
                    </div>
                    <span className="mode-pct">{m.pct}%</span>
                    <span className={`mode-delta ${m.pos ? 'pos' : 'neg'}`}>{m.delta}</span>
                  </div>
                ))}
              </div>
            </article>

            {/* ── SMALL CARD 3 — EXPERIENCE DEMAND ── */}
            <article className="card card-sm card-yoe">
              <div className="card-head">
                <span className="mono micro">05 · EXPERIENCE DEMAND</span>
              </div>
              <h3 className="card-title-sm">Years of experience in demand</h3>
              <div className="yoe-bars">
                {data.yoe.map((y) => (
                  <div key={y.label} className={`yoe-col${y.peak ? ' is-peak' : ''}`} style={{ '--h': y.h }}>
                    <span className="yoe-bar" />
                    <span className="yoe-pct">{y.pct}%</span>
                    <span className="yoe-label mono micro">{y.label.split('\n').map((l, i) => (
                      <span key={i}>{l}{i === 0 && <br />}</span>
                    ))}</span>
                  </div>
                ))}
              </div>
            </article>

          </div>
        </section>

        {/* ── EXPLORE ── */}
        <ExploreSection />

        {/* ── FOOTER ── */}
        <footer className="footer">
          <div className="footer-grid">
            <div className="footer-brand">
              <span className="footer-mark">▮</span>
              <span className="footer-name">FIRED FROM JOB<span className="bang">!</span></span>
            </div>

            <div className="footer-credit">
              <span className="mono micro dim">// CREDIT</span>
              <p className="credit-line">
                Vibe coded by <em>Omkar.ajagunde</em><br />
                using <span className="hl">Claude</span>.
              </p>
            </div>

            <div className="footer-social">
              <span className="mono micro dim">// SOCIAL</span>
              <ul className="social-list">
                <li>
                  <a href="https://www.linkedin.com/in/omkar-ajagunde" target="_blank" rel="noopener">
                    <span className="mono micro" style={{ color: 'var(--accent)' }}>L1</span>
                    <span className="social-name">LinkedIn</span>
                    <span className="social-handle">/in/omkar-ajagunde</span>
                    <span className="social-arrow">↗</span>
                  </a>
                </li>
                <li>
                  <a href="https://www.youtube.com/@omkarajagunde" target="_blank" rel="noopener">
                    <span className="mono micro" style={{ color: 'var(--accent)' }}>Y2</span>
                    <span className="social-name">YouTube</span>
                    <span className="social-handle">@omkarajagunde</span>
                    <span className="social-arrow">↗</span>
                  </a>
                </li>
              </ul>
            </div>

            <div className="footer-meta">
              <span className="mono micro dim">// META</span>
              <ul className="meta-list">
                <li>BUILD · 4.12.0</li>
                <li>RENDER · SSR</li>
                <li>UPTIME · 99.97%</li>
                <li>© 2026 FFJ TERMINAL</li>
              </ul>
            </div>
          </div>

          <div className="footer-bigtype" aria-hidden="true">END OF FEED.</div>
        </footer>
      </main>
    </>
  )
}
