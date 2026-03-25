'use client'

import { useEffect } from 'react'

export default function DeckClient({ content }: { content: any }) {
  useEffect(() => {
    const sel = '.anim, .anim-children, .anim-scale, .anim-fade, .anim-bar, .anim-progress'
    const els = document.querySelectorAll(sel)
    if (!els.length) return

    document.querySelectorAll('.anim-bar .fill').forEach((f: any) => {
      f.dataset.w = f.style.width
    })
    document.querySelectorAll('.anim-progress .progress-xl > div, .progress-xl.anim-progress > div').forEach((f: any) => {
      f.dataset.w = f.style.width
    })

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible')
            e.target.querySelectorAll('.fill[data-w]').forEach((f: any) => {
              f.style.setProperty('width', f.dataset.w, 'important')
            })
            e.target.querySelectorAll('.progress-xl > div[data-w]').forEach((f: any) => {
              f.style.setProperty('width', f.dataset.w, 'important')
            })
            if (e.target.classList.contains('progress-xl')) {
              const inner = e.target.querySelector('div[data-w]')
              if (inner) inner.style.setProperty('width', (inner as any).dataset.w, 'important')
            }
            observer.unobserve(e.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )
    els.forEach((el) => observer.observe(el))

    const metrics = document.querySelectorAll('.metric .num')
    const mObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          const el = e.target as HTMLElement
          mObs.unobserve(el)
          const text = el.textContent || ''
          const match = text.match(/^[â¬]?(\d[\d.,]*)/)
          if (!match) return
          const prefix = text.match(/^[â¬]/)?.[0] || ''
          const numStr = match[1].replace(/,/g, '')
          const suffix = text.slice(match[0].length)
          const target = parseFloat(numStr)
          if (isNaN(target) || target === 0) return
          const dur = 1200
          const start = performance.now()
          function ease(t: number) {
            return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
          }
          function step(now: number) {
            const t = Math.min((now - start) / dur, 1)
            const v = ease(t) * target
            const display = (target >= 100 ? Math.round(v) : Math.round(v * 10) / 10).toLocaleString('en')
            el.textContent = prefix + display + suffix
            if (t < 1) requestAnimationFrame(step)
            else el.textContent = text
          }
          el.textContent = prefix + '0' + suffix
          requestAnimationFrame(step)
        })
      },
      { threshold: 0.3 }
    )
    metrics.forEach((m) => mObs.observe(m))
  }, [])

  if (content.error) {
    return <div style={{ color: '#fca5a5', padding: '40px', textAlign: 'center' }}>{content.error}</div>
  }

  const slides = content.slides || []

  return (
    <div className="deck">
      {slides.map((slide: any) => (
        <Slide key={slide.number} slide={slide} />
      ))}
    </div>
  )
}

function Slide({ slide }: { slide: any }) {
  const n = parseInt(slide.number)
  return (
    <section className="slide">
      <div className="topbar">
        <div className="kicker">
          <b>{slide.kicker_title}</b> <span>{slide.kicker_subtitle}</span>
        </div>
        <div className="page">{slide.number}</div>
      </div>
      {slide.title && <h1 className="anim">{slide.title}</h1>}
      {slide.subtitle && <p className="subtitle anim">{slide.subtitle}</p>}
      {slide.big_statement && <p className="big-statement anim">{parseHTML(slide.big_statement)}</p>}
      {slide.metrics && slide.metrics.length > 0 && (
        <div className="metric-row anim-children">
          {slide.metrics.map((m: any, i: number) => (
            <div className="metric" key={i}>
              <div className="num">{m.value}</div>
              <div className="lbl">{m.label}</div>
            </div>
          ))}
        </div>
      )}
      {n === 1 && <SlideBody data={slide.body} renderer="one" />}
      {n === 2 && <SlideBody data={slide.body} renderer="two" />}
      {n === 3 && <SlideBody data={slide.body} renderer="three" />}
      {n === 4 && <SlideBody data={slide.body} renderer="four" />}
      {n === 5 && <SlideBody data={slide.body} renderer="five" />}
      {n === 6 && <SlideBody data={slide.body} renderer="six" />}
      {n === 7 && <SlideBody data={slide.body} renderer="seven" />}
      {n === 8 && <SlideBody data={slide.body} renderer="eight" />}
    </section>
  )
}

function parseHTML(html: string) {
  return html.split(/(<b>.*?<\/b>)/).map((part: string, i: number) => {
    if (part.startsWith('<b>')) return <b key={i}>{part.replace(/<\/?b>/g, '')}</b>
    return part
  })
}

function SlideBody({ data, renderer }: { data: any; renderer: string }) {
  if (!data) return null
  switch (renderer) {
    case 'one': return <BodyOne d={data} />
    case 'two': return <BodyTwo d={data} />
    case 'three': return <BodyThree d={data} />
    case 'four': return <BodyFour d={data} />
    case 'five': return <BodyFive d={data} />
    case 'six': return <BodySix d={data} />
    case 'seven': return <BodySeven d={data} />
    case 'eight': return <BodyEight d={data} />
    default: return null
  }
}

/* ââ Slide 1 ââ */
function BodyOne({ d }: { d: any }) {
  return (
    <div className="anim-children">
      <div className="panel strong">
        <div className="card-title">{d.card_title}</div>
        <p className="small">{d.text}</p>
      </div>
    </div>
  )
}

/* ââ Slide 2 ââ */
function BodyTwo({ d }: { d: any }) {
  return (
    <div className="cols-2 anim-children">
      <div className="panel">
        <div className="card-title">{d.left_title}</div>
        <div className="bars">
          {(d.bars || []).map((bar: any, i: number) => (
            <div className="bar" key={i}>
              <div className="bar-top"><span>{bar.label}</span><span>{bar.value}</span></div>
              <div className="track"><div className={`fill ${bar.color || ''}`} style={{ width: bar.width }}></div></div>
            </div>
          ))}
        </div>
      </div>
      <div className="panel">
        <div className="card-title">{d.right_title}</div>
        <div className="bullet">
          {(d.bullets || []).map((b: string, i: number) => (
            <div className="item" key={i}><div className="dot"></div><p>{b}</p></div>
          ))}
        </div>
        <div className="chip-row">
          {(d.chips || []).map((c: string, i: number) => (
            <div className="chip" key={i}>{c}</div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ââ Slide 3 ââ */
function BodyThree({ d }: { d: any }) {
  return (
    <div className="anim-children">
      <div style={{ fontSize: '13px', color: 'var(--red)', textTransform: 'uppercase', letterSpacing: '.08em', fontWeight: 650, marginTop: '22px', position: 'relative', zIndex: 2 }}>
        Problem
      </div>
      <div className="cols-3">
        {(d.problems || []).map((p: any, i: number) => (
          <div className="panel strong" key={i}>
            <div className="card-title">{p.title}</div>
            <p className="small">{p.text}</p>
          </div>
        ))}
      </div>
      <div style={{ fontSize: '13px', color: 'var(--good)', textTransform: 'uppercase', letterSpacing: '.08em', fontWeight: 650, marginTop: '26px', position: 'relative', zIndex: 2 }}>
        Solution
      </div>
      <div style={{ border: '1px solid var(--line)', borderRadius: 'var(--radius)', padding: '18px', background: 'rgba(134,239,172,.04)', position: 'relative', zIndex: 2, marginTop: '6px' }}>
        <div className="flow">
          {(d.steps || []).map((s: any, i: number) => (
            <div className="step" key={i}>
              <div className="n">{s.num}</div>
              <h3>{s.title}</h3>
              <p className="small">{s.text}</p>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '14px', fontSize: '13px', color: 'var(--good)', textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 600 }}>
          {d.solution_footer}
        </div>
      </div>
    </div>
  )
}

/* ââ Slide 4 ââ */
function BodyFour({ d }: { d: any }) {
  return (
    <div>
      <div style={{ fontSize: '12px', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '.08em', fontWeight: 650, marginTop: '18px', marginBottom: '6px', position: 'relative', zIndex: 2 }} className="anim">
        {d.section1_label}
      </div>
      <div className="diagram anim-children">
        <div className="core anim-scale">
          <div className="lines">
            <svg viewBox="0 0 1000 600" preserveAspectRatio="none">
              <path d="M500 300 C350 170, 240 120, 155 95" />
              <path d="M500 300 C650 155, 770 120, 850 115" />
              <path d="M500 300 C360 390, 220 485, 155 520" />
              <path d="M500 300 C650 390, 790 480, 850 525" />
              <path d="M500 300 C295 290, 160 300, 105 300" />
              <path d="M500 300 C705 300, 840 300, 895 300" />
            </svg>
          </div>
          <div className="core-center">
            <div className="title">{d.center_title}</div>
            <p className="small" style={{ marginTop: '10px', color: '#eef3ff' }}>{d.center_subtitle}</p>
          </div>
          {(d.orbits || []).map((o: string, i: number) => (
            <div className={`orbit o${i + 1}`} key={i}>{o}</div>
          ))}
        </div>
        <div className="rightbox">
          <div className="panel strong">
            <div className="card-title">{d.synergy_title}</div>
            <div className="bullet">
              {(d.synergy_bullets || []).map((b: string, i: number) => (
                <div className="item" key={i}><div className="dot"></div><p>{b}</p></div>
              ))}
            </div>
          </div>
          <div className="panel strong">
            <div className="card-title">{d.layers_title}</div>
            <div className="bullet">
              {(d.layers || []).map((l: any, i: number) => (
                <div className="item" key={i}><div className="dot"></div><p>{parseHTML(l)}</p></div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div style={{ fontSize: '12px', color: 'var(--warn)', textTransform: 'uppercase', letterSpacing: '.08em', fontWeight: 650, marginTop: '6px', marginBottom: '6px', position: 'relative', zIndex: 2 }} className="anim">
        {d.section2_label}
      </div>
      <div className="diagram anim">
        <div className="panel">
          <div className="card-title">{d.real_estate_title}</div>
          <p className="small">{d.real_estate_text}</p>
        </div>
        <div></div>
      </div>
    </div>
  )
}

/* ââ Slide 5 ââ */
function BodyFive({ d }: { d: any }) {
  return (
    <div className="cols-2 anim-children">
      <div className="panel strong anim-bar">
        <div className="card-title">{d.left_title}</div>
        <div className="bars">
          {(d.bars_top || []).map((bar: any, i: number) => (
            <div className="bar" key={i}>
              <div className="bar-top"><span>{bar.label}</span><span>{bar.value}</span></div>
              <div className="track"><div className={`fill ${bar.color || ''}`} style={{ width: bar.width }}></div></div>
            </div>
          ))}
          <div className="spectrum-divider"><span>{d.divider_text}</span></div>
          {(d.bars_bottom || []).map((bar: any, i: number) => (
            <div className="bar" key={i}>
              <div className="bar-top"><span>{bar.label}</span><span>{bar.value}</span></div>
              <div className="track"><div className={`fill ${bar.color || ''}`} style={{ width: bar.width }}></div></div>
            </div>
          ))}
        </div>
        <p className="small" style={{ marginTop: '14px' }}>{d.left_footer}</p>
      </div>
      <div className="panel">
        <div className="card-title">{d.right_title}</div>
        <div className="bullet">
          {(d.right_bullets || []).map((b: string, i: number) => (
            <div className="item" key={i}><div className="dot"></div><p>{parseHTML(b)}</p></div>
          ))}
        </div>
        <div className="chip-row">
          {(d.chips || []).map((c: string, i: number) => (
            <div className="chip" key={i}>{c}</div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ââ Slide 6 ââ */
function BodySix({ d }: { d: any }) {
  return (
    <div className="cols-2 anim-children">
      <div className="panel strong">
        <div className="card-title">{d.table_title}</div>
        <table>
          <thead><tr><th>Archetype</th><th>Why interesting</th><th>Priority</th></tr></thead>
          <tbody>
            {(d.rows || []).map((r: any, i: number) => (
              <tr key={i}><td>{r.archetype}</td><td>{r.why}</td><td><span className="tag">{r.priority}</span></td></tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="panel">
        <div className="card-title">{d.filter_title}</div>
        <div className="bullet">
          {(d.filters || []).map((f: string, i: number) => (
            <div className="item" key={i}><div className="dot"></div><p>{f}</p></div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ââ Slide 7 ââ */
function BodySeven({ d }: { d: any }) {
  return (
    <div className="status-grid anim-children">
      <div className="status-stack">
        {(d.status_cards || []).map((card: any, i: number) => (
          <div className="status-card" key={i}>
            <div className="status-head">
              <h3>{card.title}</h3>
              <div className="status-tag">{card.tag}</div>
            </div>
            <p className="small">{card.text}</p>
            {card.items && (
              <div className="mini-list">
                {card.items.map((item: string, j: number) => (
                  <div className="mini-item" key={j}><div className="mini-dot"></div><span>{item}</span></div>
                ))}
              </div>
            )}
            {card.progress && (
              <div className="progress-xl anim-progress"><div style={{ width: card.progress }}></div></div>
            )}
            {card.brands && (
              <div className="brand-pill-row">
                {card.brands.map((b: string, j: number) => (
                  <div className="brand-pill" key={j}>{b}</div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="now-board">
        <div className="card-title">{d.board_title}</div>
        <p className="small">{d.board_text}</p>
        <div className="strategic-timeline" style={{ marginTop: '18px' }}>
          {(d.timeline || []).map((t: any, i: number) => (
            <div className={`tl-item ${t.status}`} key={i}>
              <div className="tl-marker">{t.marker}</div>
              <div className="tl-body">
                <div className="tl-date">{t.date}</div>
                <div className="tl-label">{t.label}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="panel strong" style={{ marginTop: '16px' }}>
          <div className="card-title">{d.build_title}</div>
          <div className="timeline" style={{ marginTop: '14px' }}>
            {(d.phases || []).map((p: any, i: number) => (
              <div className="phase" key={i}>
                <div className="when">{p.when}</div>
                <h3>{p.title}</h3>
                <p className="small">{p.text}</p>
                {p.progress && (
                  <>
                    <div className="progress-xl anim-progress" style={{ marginTop: '8px' }}>
                      <div style={{ width: p.progress }}></div>
                    </div>
                    <div className="small" style={{ textAlign: 'right', marginTop: '2px', color: 'var(--good)', fontWeight: 600, fontSize: '11px' }}>
                      {p.progress}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ââ Slide 8 ââ */
function BodyEight({ d }: { d: any }) {
  return (
    <div className="cols-2 anim-children">
      <div className="panel strong" style={{ minHeight: '430px', display: 'flex', alignItems: 'center' }}>
        <div>
          <div className="card-title">{d.thesis_label}</div>
          <div className="quote" style={{ fontSize: '40px' }}>
            {d.thesis_before}
            <span style={{ background: 'linear-gradient(90deg,#7dd3fc,#c4b5fd)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
              {d.thesis_highlight}
            </span>
            {d.thesis_after}
          </div>
        </div>
      </div>
      <div className="panel">
        <div className="card-title">{d.why_title}</div>
        <div className="bullet">
          {(d.why_bullets || []).map((b: string, i: number) => (
            <div className="item" key={i}><div className="dot"></div><p>{b}</p></div>
          ))}
        </div>
      </div>
    </div>
  )
}
