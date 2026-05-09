// Server Component — initial data fetched at request time (SSR); insights section polls via client component
import ExploreSection from './components/ExploreSection'
import MarketDashboard from './components/MarketDashboard'

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
          <MarketDashboard initialData={data} />
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
