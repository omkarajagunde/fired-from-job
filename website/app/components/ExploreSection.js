'use client'

import { useState, useMemo } from 'react'

const ROLE_NAMES = {
  AI: 'AI Engineer', PM: 'Product Manager', SWE: 'Software Eng',
  DS: 'Data Scientist', DEV: 'DevOps', UX: 'UX Designer',
  CON: 'Consultant', FIN: 'Financial Analyst',
}

const SERIES_COLORS = ['#1463ff', '#14110d', '#5b554a', '#1f7a45', '#ff5b1f', '#a23ab8']

// Deterministic LCG so server-rendered HTML matches client hydration
function seeded(seed) {
  let s = seed >>> 0
  return () => {
    s = Math.imul(1664525, s) + 1013904223 >>> 0
    return s / 0xffffffff
  }
}

function makeSeries(role, index) {
  const rand = seeded(index * 7919 + role.charCodeAt(0) * 31)
  const pts = []
  let v = 30 + ((index * 13) % 25)
  const trend = ((index * 7) % 11) - 5
  for (let w = 0; w < 18; w++) {
    v += (rand() - 0.5) * 6 + trend * 0.18
    v = Math.max(6, Math.min(96, v))
    pts.push(v)
  }
  return pts
}

function computePoints(fs) {
  const c  = fs.country.length || 0.4
  const ci = fs.city.length    || 0.4
  const r  = fs.role.length    || 0.4
  const m  = fs.mode.length    || 0.4
  const s  = fs.src.length     || 0.4
  return Math.floor(28000 * c * (1 + ci * 0.3) * r * (m * 0.7 + 0.3) * (s * 0.4 + 0.4))
}

function ChartSVG({ activeRoles, vizType }) {
  const W = 800, H = 420
  const padL = 44, padR = 18, padT = 18, padB = 36
  const innerW = W - padL - padR
  const innerH = H - padT - padB

  const series = (activeRoles.length ? activeRoles : ['AI']).slice(0, 5).map((r, i) => ({
    key: r,
    name: ROLE_NAMES[r] || r,
    data: makeSeries(r, i + 1),
    color: SERIES_COLORS[i % SERIES_COLORS.length],
  }))

  const x = (i) => padL + (i / 17) * innerW
  const y = (v) => padT + (1 - v / 100) * innerH

  const els = []

  // axes
  els.push(
    <line key="ax" className="axis-line" x1={padL} y1={padT + innerH} x2={padL + innerW} y2={padT + innerH} />,
    <line key="ay" className="axis-line" x1={padL} y1={padT} x2={padL} y2={padT + innerH} />,
  )

  // grid + y-axis labels
  for (let g = 0; g <= 4; g++) {
    const yy = padT + (g / 4) * innerH
    els.push(
      <line key={`yg${g}`} x1={padL} y1={yy} x2={padL + innerW} y2={yy} stroke="rgba(0,0,0,0.06)" strokeDasharray="2 4" />,
      <text key={`yt${g}`} className="axis-tick" x={padL - 8} y={yy + 3} textAnchor="end">{100 - g * 25}</text>,
    )
  }

  // x-axis labels
  for (let w = 0; w < 18; w += 3) {
    els.push(
      <text key={`xt${w}`} className="axis-tick" x={x(w)} y={padT + innerH + 16} textAnchor="middle">
        W{String(w + 1).padStart(2, '0')}
      </text>,
    )
  }

  if (vizType === 'line' || vizType === 'area') {
    series.forEach((s, si) => {
      const d = s.data.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ')
      if (vizType === 'area') {
        els.push(<path key={`area${si}`} className="series-area" d={`${d} L ${x(17)},${padT + innerH} L ${x(0)},${padT + innerH} Z`} fill={s.color} />)
      }
      els.push(<path key={`line${si}`} className="series-line" d={d} stroke={s.color} />)
      s.data.forEach((v, i) => {
        if (i % 3 === 0) els.push(
          <circle key={`dot${si}-${i}`} className="series-dot" cx={x(i)} cy={y(v)} r={3} fill={s.color} />,
        )
      })
    })
  } else {
    // bars
    const bw = (innerW / 18) * 0.78
    const sliceW = bw / Math.max(series.length, 1)
    series.forEach((s, si) => {
      s.data.forEach((v, i) => {
        const xx = x(i) - bw / 2 + si * sliceW
        const yy = y(v)
        els.push(
          <rect key={`bar${si}-${i}`} x={xx.toFixed(1)} y={yy.toFixed(1)} width={Math.max(0, sliceW - 1).toFixed(1)} height={(padT + innerH - yy).toFixed(1)} fill={s.color} opacity={0.92} />,
        )
      })
    })
  }

  return { svgEls: els, series }
}

function ChipGroup({ group, items, active, onToggle }) {
  return (
    <div className="chips">
      {items.map(({ v, label }) => (
        <button
          key={v}
          className={`chip${active.includes(v) ? ' is-on' : ''}`}
          onClick={() => onToggle(group, v)}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

export default function ExploreSection() {
  const [filters, setFilters] = useState({
    country: ['IN', 'US'],
    city:    ['BLR'],
    role:    ['AI', 'PM', 'SWE'],
    mode:    ['HYB', 'REM'],
    src:     ['LI', 'NK', 'MJ', 'IND'],
  })
  const [vizType, setVizType] = useState('line')

  function toggle(group, v) {
    setFilters(prev => {
      const arr = prev[group]
      return { ...prev, [group]: arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v] }
    })
  }

  const fetched  = useMemo(() => computePoints(filters), [filters])
  const analysed = Math.floor(fetched * 0.918)

  const { svgEls, series } = ChartSVG({ activeRoles: filters.role, vizType })

  const VIZ_LABELS = { line: '◢◣ LINE', bars: '▮▮▮ BARS', area: '▲▲▲ AREA' }

  return (
    <section className="explore">
      <div className="explore-head">
        <span className="mono micro dim">§ 03 / EXPLORE</span>
        <h2 className="explore-title">Drill <em>IN</em>!</h2>
        <p className="explore-sub mono">Slice 12.8M postings by region, role, work mode and source.</p>
      </div>

      <div className="explore-body">

        {/* ── LEFT: FILTER PANEL ── */}
        <aside className="filters" aria-label="Filters">
          <div className="filter-block">
            <header className="filter-head">
              <span className="mono micro">F1 · REGION</span>
              <span className="mono micro dim">{filters.country.length + filters.city.length} active</span>
            </header>
            <div className="filter-sub">
              <label className="mono micro dim">COUNTRY</label>
              <ChipGroup group="country" active={filters.country} onToggle={toggle} items={[
                { v: 'IN', label: 'India' }, { v: 'US', label: 'United States' },
                { v: 'UK', label: 'United Kingdom' }, { v: 'DE', label: 'Germany' },
                { v: 'SG', label: 'Singapore' }, { v: 'AU', label: 'Australia' },
              ]} />
              <label className="mono micro dim">CITY</label>
              <ChipGroup group="city" active={filters.city} onToggle={toggle} items={[
                { v: 'BLR', label: 'Bengaluru' }, { v: 'NYC', label: 'New York' },
                { v: 'SFO', label: 'San Francisco' }, { v: 'LDN', label: 'London' },
                { v: 'BER', label: 'Berlin' }, { v: 'MUM', label: 'Mumbai' },
              ]} />
            </div>
          </div>

          <div className="filter-block">
            <header className="filter-head">
              <span className="mono micro">F2 · JOB ROLE</span>
              <span className="mono micro dim">{filters.role.length} active</span>
            </header>
            <ChipGroup group="role" active={filters.role} onToggle={toggle} items={[
              { v: 'AI',  label: 'AI Engineer' }, { v: 'PM',  label: 'Product Manager' },
              { v: 'SWE', label: 'Software Eng' }, { v: 'DS',  label: 'Data Scientist' },
              { v: 'DEV', label: 'DevOps' },       { v: 'UX',  label: 'UX Designer' },
              { v: 'CON', label: 'Consultant' },   { v: 'FIN', label: 'Financial Analyst' },
            ]} />
          </div>

          <div className="filter-block">
            <header className="filter-head">
              <span className="mono micro">F3 · WORK MODE</span>
              <span className="mono micro dim">{filters.mode.length} active</span>
            </header>
            <ChipGroup group="mode" active={filters.mode} onToggle={toggle} items={[
              { v: 'HYB', label: 'Hybrid' }, { v: 'REM', label: 'Remote' }, { v: 'OFF', label: 'In Office' },
            ]} />
          </div>

          <div className="filter-block">
            <header className="filter-head">
              <span className="mono micro">F4 · SOURCES</span>
              <span className="mono micro dim">{filters.src.length} active</span>
            </header>
            <ChipGroup group="src" active={filters.src} onToggle={toggle} items={[
              { v: 'LI',  label: 'LinkedIn' },    { v: 'NK',  label: 'Naukri' },
              { v: 'MJ',  label: 'MonsterJobs' }, { v: 'IND', label: 'Indeed' },
              { v: 'GD',  label: 'Glassdoor' },   { v: 'WW',  label: 'Wellfound' },
              { v: 'HF',  label: 'Hirect' },      { v: 'ZIP', label: 'ZipRecruiter' },
            ]} />
          </div>
        </aside>

        {/* ── CENTER: CHART ── */}
        <div className="chart-area">
          <header className="chart-head">
            <div className="viz-toggle" role="tablist">
              {Object.entries(VIZ_LABELS).map(([v, label]) => (
                <button
                  key={v}
                  className={`viz-btn${vizType === v ? ' is-on' : ''}`}
                  onClick={() => setVizType(v)}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="chart-meta mono micro">
              <span>X · WEEK (Wk 1 → Wk 18)</span>
              <span className="sep">|</span>
              <span>Y · POSTINGS / 1K</span>
            </div>
          </header>

          <div className="chart-stage">
            <svg className="chart-svg" viewBox="0 0 800 420" preserveAspectRatio="none">
              {svgEls}
            </svg>
          </div>

          <div className="chart-legend">
            {series.map(s => (
              <span key={s.key} className="legend-item">
                <span className="legend-mark" style={{ background: s.color }} />
                {s.name}
              </span>
            ))}
          </div>
        </div>

        {/* ── RIGHT: APPLIED FILTERS ── */}
        <aside className="applied" aria-label="Applied filters">
          <header className="applied-head">
            <span className="mono micro">APPLIED FILTERS</span>
          </header>
          <div className="applied-readout">
            <div className="applied-num">
              <span className="num">{fetched.toLocaleString('en-US')}</span>
              <span className="mono micro dim">DATA POINTS FETCHED</span>
            </div>
            <div className="applied-num">
              <span className="num">{analysed.toLocaleString('en-US')}</span>
              <span className="mono micro dim">ANALYSED · POST-DEDUPE</span>
            </div>
            <div className="applied-num">
              <span className="num small">98.4<span className="unit">%</span></span>
              <span className="mono micro dim">CONFIDENCE</span>
            </div>
          </div>
          <div className="applied-summary">
            <div className="summary-row">
              <span className="lbl">REGION</span>
              <span className="val">{filters.country.join(', ') || '—'} · {filters.city.join(', ') || '—'}</span>
            </div>
            <div className="summary-row">
              <span className="lbl">ROLES</span>
              <span className="val acc">{filters.role.length ? filters.role.map(r => ROLE_NAMES[r] || r).join(' · ') : '—'}</span>
            </div>
            <div className="summary-row">
              <span className="lbl">MODE</span>
              <span className="val">{filters.mode.join(' · ') || '—'}</span>
            </div>
            <div className="summary-row">
              <span className="lbl">SOURCES</span>
              <span className="val">{filters.src.join(' · ') || '—'}</span>
            </div>
            <div className="summary-row">
              <span className="lbl">WINDOW</span>
              <span className="val">18 weeks · 2026 H1</span>
            </div>
          </div>
          <footer className="applied-foot mono micro">
            <span className="status-dot" />
            <span>QUERY · <span>0x9a4f…c2b1</span></span>
            <span className="dim">· 218 ms</span>
          </footer>
        </aside>

      </div>
    </section>
  )
}
