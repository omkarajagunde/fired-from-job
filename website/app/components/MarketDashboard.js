'use client'

import { useState, useEffect } from 'react'

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

export default function MarketDashboard({ initialData }) {
  const [data, setData] = useState(initialData)
  const [refreshCount, setRefreshCount] = useState(0)
  const [fetching, setFetching] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setFetching(true)
      try {
        const res = await fetch(`${API_BASE}/events`)
        if (res.ok) {
          const json = await res.json()
          setData(json)
          setRefreshCount(c => c + 1)
        }
      } catch {
        // silently skip failed polls
      } finally {
        setFetching(false)
      }
    }

    const id = setInterval(fetchData, 10_000)
    return () => clearInterval(id)
  }, [])

  // lk changes every poll cycle — used as key on live values to trigger
  // the CSS entry animation on the remounted DOM node
  const lk = refreshCount

  return (
    <>
      <div className="ssr-badge mono micro">
        {fetching
          ? <>FETCHING · <span>CLIENT SIDE</span> · <span key={lk}>{data.utcTime}</span></>
          : <>POLLING · <span>CLIENT SIDE</span> · <span key={lk}>{data.utcTime}</span></>
        }
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

        {/* 01 · ROLE VOLUME */}
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
                <span key={`vol-${r.name}-${lk}`} className="vol-volume live-value">{r.vol}</span>
                <span key={`pct-${r.name}-${lk}`} className={`vol-pct ${r.pos ? 'pos' : 'neg'} live-value`}>
                  {r.pos ? '▲' : '▼'} {r.pct}
                </span>
              </li>
            ))}
          </ul>
          <footer className="card-foot mono micro">
            <span>n = 412,318 postings</span>
            <span key={`vol-ts-${lk}`} className="live-value">updated {data.utcTime}</span>
          </footer>
        </article>

        {/* 02 · PULSEBOARD™ — RECESSION INDEX GAUGE */}
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
              <span key={`gauge-val-${lk}`} className="gauge-value live-value">CAUTION · {data.gauge.value}</span>
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

        {/* 03 · INDUSTRY HEAT */}
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
                <span key={`ind-${ind.name}-${lk}`} className="mono pos live-value" style={{ fontSize: 13, fontWeight: 500 }}>{ind.pct}</span>
              </li>
            ))}
          </ul>
        </article>

        {/* 04 · WORK MODE */}
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
                <span key={`mode-pct-${m.name}-${lk}`} className="mode-pct live-value">{m.pct}%</span>
                <span key={`mode-delta-${m.name}-${lk}`} className={`mode-delta ${m.pos ? 'pos' : 'neg'} live-value`}>{m.delta}</span>
              </div>
            ))}
          </div>
        </article>

        {/* 05 · EXPERIENCE DEMAND */}
        <article className="card card-sm card-yoe">
          <div className="card-head">
            <span className="mono micro">05 · EXPERIENCE DEMAND</span>
          </div>
          <h3 className="card-title-sm">Years of experience in demand</h3>
          <div className="yoe-bars">
            {data.yoe.map((y) => (
              <div key={y.label} className={`yoe-col${y.peak ? ' is-peak' : ''}`} style={{ '--h': y.h }}>
                <span className="yoe-bar" />
                <span key={`yoe-pct-${y.label}-${lk}`} className="yoe-pct live-value">{y.pct}%</span>
                <span className="yoe-label mono micro">{y.label.split('\n').map((l, i) => (
                  <span key={i}>{l}{i === 0 && <br />}</span>
                ))}</span>
              </div>
            ))}
          </div>
        </article>

      </div>
    </>
  )
}
