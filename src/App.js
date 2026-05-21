import React, { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from './supabase';
import { ALL, R1, R2, R3, getCourse, getFormat } from './data';
import { computeMatch, fmtPts, fmtVP, vpColor, scoreColor, scoreBg, scoreLabel, oddsColor } from './scoring';

const JK = '#f0c040';
const JO = '#e05c3a';

// ─── SCORE INPUT CELL ────────────────────────────────────────────────────────
function ScoreCell({ value, par, onChange, isWinner }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:2 }}>
      <div style={{ position:'relative' }}>
        {isWinner && (
          <div style={{ position:'absolute', inset:-3, borderRadius:6,
            border:`2px solid ${scoreColor(value, par)}`, pointerEvents:'none', zIndex:1 }} />
        )}
        <input
          type="number" inputMode="numeric" min="1" max="15" value={value}
          onChange={e => onChange(e.target.value)}
          style={{
            width:40, height:38, background:scoreBg(value, par),
            border:'1px solid #2a2a2a', borderRadius:6,
            color: value !== '' ? scoreColor(value, par) : '#333',
            textAlign:'center', fontSize:15, fontWeight:'bold',
            outline:'none', fontFamily:'Georgia,serif', padding:0,
            WebkitAppearance:'none', MozAppearance:'textfield',
          }}
        />
      </div>
      {value !== '' && (
        <div style={{ fontSize:9, color:scoreColor(value, par), lineHeight:1, fontWeight:'bold' }}>
          {scoreLabel(value, par)}
        </div>
      )}
    </div>
  );
}

// ─── STRIP ───────────────────────────────────────────────────────────────────
function Strip({ results, holes, height = 5 }) {
  return (
    <div style={{ display:'flex', gap:2, height, borderRadius:3, overflow:'hidden' }}>
      {Array(holes).fill(0).map((_, i) => {
        const r = results[i];
        return (
          <div key={i} style={{ flex:1, borderRadius:1,
            background: r==='j' ? JK : r==='o' ? JO : r==='h' ? '#555' : '#1e1e1e' }} />
        );
      })}
    </div>
  );
}

// ─── MATCH DETAIL MODAL ──────────────────────────────────────────────────────
function MatchDetail({ match, scores, onChange, onClose }) {
  const state = computeMatch(scores, match);
  const course = getCourse(match.c);
  const format = getFormat(match.id);
  const statusColor = state.leader==='j' ? JK : state.leader==='o' ? JO : '#888';

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.96)', zIndex:200,
        overflowY:'auto', WebkitOverflowScrolling:'touch',
        display:'flex', justifyContent:'center', alignItems:'flex-start', padding:8 }}
    >
      <div style={{ background:'#0a0a0a', border:'1px solid #2a2a2a', borderRadius:14,
        width:'100%', maxWidth:740, margin:'auto', padding:'20px 13px',
        fontFamily:'Georgia, serif' }}>

        {/* Header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
          <div>
            <div style={{ color:'#8a7a5a', fontSize:9, letterSpacing:3, textTransform:'uppercase', marginBottom:4 }}>
              {format==='scramble'?'2-Man Scramble':format==='bestball'?'2-Man Best Ball':'Singles'} · {course.name}
            </div>
            <div style={{ color:'#e8d5a3', fontSize:17, fontWeight:'bold', marginBottom:7 }}>{match.lb}</div>
            <div style={{ color:JK, fontSize:13, marginBottom:3 }}>🟡 {match.j.join(' & ')}</div>
            <div style={{ color:JO, fontSize:13 }}>🔴 {match.o.join(' & ')}</div>
            {/* Odds for singles */}
            {format === 'singles' && match.odds && (
              <div style={{ display:'flex', gap:12, marginTop:8 }}>
                <div style={{ background:'#111', borderRadius:6, padding:'4px 10px', textAlign:'center' }}>
                  <div style={{ color:'#666', fontSize:8, letterSpacing:1 }}>JACK ODDS</div>
                  <div style={{ color:oddsColor(match.odds[0]), fontSize:14, fontWeight:'bold' }}>{match.odds[0]}</div>
                </div>
                <div style={{ background:'#111', borderRadius:6, padding:'4px 10px', textAlign:'center' }}>
                  <div style={{ color:'#666', fontSize:8, letterSpacing:1 }}>JOE ODDS</div>
                  <div style={{ color:oddsColor(match.odds[1]), fontSize:14, fontWeight:'bold' }}>{match.odds[1]}</div>
                </div>
              </div>
            )}
          </div>
          <div style={{ display:'flex', alignItems:'flex-start', gap:8, flexShrink:0, marginLeft:12 }}>
            <div style={{ textAlign:'center' }}>
              <div style={{ fontSize:24, fontWeight:'bold', color:statusColor }}>{state.txt}</div>
              <div style={{ color:'#444', fontSize:9, marginTop:2 }}>
                {state.status==='done' ? 'FINAL' : `thru ${state.holesPlayed}`}
              </div>
            </div>
            <button onClick={onClose}
              style={{ background:'none', border:'none', color:'#666', fontSize:24, cursor:'pointer', padding:'0 2px', lineHeight:1 }}>✕</button>
          </div>
        </div>

        <Strip results={state.holeResults} holes={course.holes} />

        {format === 'bestball' && (
          <div style={{ color:'#5a5040', fontSize:9, marginTop:7, letterSpacing:0.3 }}>
            ℹ️ Enter each player's score — the lower score counts for the team
          </div>
        )}

        {/* Scorecard */}
        <div style={{ overflowX:'auto', marginTop:14, WebkitOverflowScrolling:'touch' }}>
          <table style={{ borderCollapse:'collapse', fontSize:11, minWidth: course.holes * 48 + 110 }}>
            <thead>
              <tr style={{ background:'#0f0f0f' }}>
                <td style={{ padding:'5px 9px', color:'#666', borderRight:'1px solid #1a1a1a', minWidth:100, whiteSpace:'nowrap' }}>Hole</td>
                {course.holeNums.map((h,i) => (
                  <td key={i} style={{ padding:'5px 3px', textAlign:'center', color:'#999', fontWeight:'bold', minWidth:48 }}>{h}</td>
                ))}
                <td style={{ padding:'5px 7px', textAlign:'center', color:'#666', borderLeft:'1px solid #1a1a1a', minWidth:48, fontSize:9 }}>TOT</td>
              </tr>
              <tr style={{ background:'#0d0d0d' }}>
                <td style={{ padding:'3px 9px', color:'#2e2e2e', fontSize:8, borderRight:'1px solid #1a1a1a' }}>Yards</td>
                {course.yards.map((y,i) => <td key={i} style={{ padding:'2px 3px', textAlign:'center', color:'#2e2e2e', fontSize:8 }}>{y}</td>)}
                <td style={{ padding:'2px 7px', textAlign:'center', color:'#2e2e2e', fontSize:8, borderLeft:'1px solid #1a1a1a' }}>{course.yards.reduce((a,b)=>a+b,0)}</td>
              </tr>
              <tr style={{ background:'#0d0d0d' }}>
                <td style={{ padding:'3px 9px', color:'#2e2e2e', fontSize:8, borderRight:'1px solid #1a1a1a' }}>Hdcp</td>
                {course.handicap.map((h,i) => <td key={i} style={{ padding:'2px 3px', textAlign:'center', color:'#2e2e2e', fontSize:8 }}>{h}</td>)}
                <td style={{ borderLeft:'1px solid #1a1a1a' }} />
              </tr>
              <tr style={{ background:'#141414' }}>
                <td style={{ padding:'5px 9px', color:'#9a8a6a', fontWeight:'bold', borderRight:'1px solid #1a1a1a', fontSize:13 }}>Par</td>
                {course.par.map((p,i) => <td key={i} style={{ padding:'4px 3px', textAlign:'center', color:'#9a8a6a', fontWeight:'bold', fontSize:13 }}>{p}</td>)}
                <td style={{ padding:'4px 7px', textAlign:'center', color:'#9a8a6a', fontWeight:'bold', borderLeft:'1px solid #1a1a1a', fontSize:13 }}>{course.par.reduce((a,b)=>a+b,0)}</td>
              </tr>
            </thead>
            <tbody>
              {/* Jack row */}
              <tr style={{ borderTop:'2px solid #1a1a1a' }}>
                <td style={{ padding:'5px 9px', color:JK, fontWeight:'bold', fontSize:10, borderRight:'1px solid #1a1a1a', whiteSpace:'nowrap' }}>
                  🟡 {match.j[0]}{match.j[1] ? ' / '+match.j[1] : ''}
                </td>
                {Array(course.holes).fill(0).map((_,i) => {
                  const s = scores[i] || { j:'', o:'' };
                  return (
                    <td key={i} style={{ padding:'3px 2px', textAlign:'center' }}>
                      <ScoreCell value={s.j} par={course.par[i]}
                        onChange={v => onChange(i,'j',v)}
                        isWinner={state.holeResults[i]==='j'} />
                    </td>
                  );
                })}
                <td style={{ textAlign:'center', borderLeft:'1px solid #1a1a1a', padding:'3px 7px' }}>
                  <div style={{ color:JK, fontWeight:'bold', fontSize:14 }}>{state.jTotal || '—'}</div>
                  {state.holesPlayed > 0 && <div style={{ fontSize:9, color:vpColor(state.jVsPar) }}>{fmtVP(state.jVsPar)}</div>}
                </td>
              </tr>
              {/* Joe row */}
              <tr style={{ borderTop:'1px solid #1a1a1a' }}>
                <td style={{ padding:'5px 9px', color:JO, fontWeight:'bold', fontSize:10, borderRight:'1px solid #1a1a1a', whiteSpace:'nowrap' }}>
                  🔴 {match.o[0]}{match.o[1] ? ' / '+match.o[1] : ''}
                </td>
                {Array(course.holes).fill(0).map((_,i) => {
                  const s = scores[i] || { j:'', o:'' };
                  return (
                    <td key={i} style={{ padding:'3px 2px', textAlign:'center' }}>
                      <ScoreCell value={s.o} par={course.par[i]}
                        onChange={v => onChange(i,'o',v)}
                        isWinner={state.holeResults[i]==='o'} />
                    </td>
                  );
                })}
                <td style={{ textAlign:'center', borderLeft:'1px solid #1a1a1a', padding:'3px 7px' }}>
                  <div style={{ color:JO, fontWeight:'bold', fontSize:14 }}>{state.oTotal || '—'}</div>
                  {state.holesPlayed > 0 && <div style={{ fontSize:9, color:vpColor(state.oVsPar) }}>{fmtVP(state.oVsPar)}</div>}
                </td>
              </tr>
              {/* Result row */}
              <tr style={{ borderTop:'1px solid #141414' }}>
                <td style={{ padding:'4px 9px', color:'#333', fontSize:9, borderRight:'1px solid #1a1a1a' }}>Result</td>
                {state.holeResults.map((r,i) => (
                  <td key={i} style={{ textAlign:'center', padding:'4px 2px', fontSize:12 }}>
                    {r==='j' && <span style={{ color:JK }}>▲</span>}
                    {r==='o' && <span style={{ color:JO }}>▲</span>}
                    {r==='h' && <span style={{ color:'#555' }}>–</span>}
                  </td>
                ))}
                <td style={{ borderLeft:'1px solid #1a1a1a' }} />
              </tr>
            </tbody>
          </table>
        </div>

        {/* Momentum bar */}
        <div style={{ marginTop:18 }}>
          <div style={{ color:'#333', fontSize:8, letterSpacing:2, marginBottom:5 }}>MATCH MOMENTUM</div>
          <div style={{ display:'flex', gap:2, alignItems:'flex-end', height:32 }}>
            {(() => {
              let run = 0;
              return state.holeResults.map((r,i) => {
                if (r==='j') run++; else if (r==='o') run--;
                const h = Math.abs(run);
                return (
                  <div key={i} style={{ flex:1, borderRadius:2, alignSelf:'flex-end',
                    height: h===0 ? 3 : Math.min(6+h*6, 32),
                    background: run>0 ? `rgba(240,192,64,${0.2+h*0.12})` : run<0 ? `rgba(224,92,58,${0.2+h*0.12})` : '#1e1e1e' }} />
                );
              });
            })()}
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', marginTop:4 }}>
            <span style={{ color:JK, fontSize:8 }}>🟡 Jack leads</span>
            <span style={{ color:JO, fontSize:8 }}>Joe leads 🔴</span>
          </div>
        </div>

        {/* Legend */}
        <div style={{ display:'flex', gap:10, marginTop:14, flexWrap:'wrap' }}>
          {[['Eagle+','#f0c040'],['Birdie','#4fc87a'],['Par','#e8d5a3'],['Bogey','#e05c3a'],['Double+','#c0392b']].map(([l,c]) => (
            <div key={l} style={{ display:'flex', alignItems:'center', gap:3 }}>
              <div style={{ width:8, height:8, borderRadius:2, background:c, opacity:0.75 }} />
              <span style={{ color:'#444', fontSize:8 }}>{l}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MATCH CARD ──────────────────────────────────────────────────────────────
function MatchCard({ match, scores, onClick }) {
  const state = computeMatch(scores, match);
  const format = getFormat(match.id);
  const course = getCourse(match.c);
  const statusColor = state.leader==='j' ? JK : state.leader==='o' ? JO : '#666';
  const done = state.status === 'done';

  return (
    <div onClick={onClick}
      style={{ background:'#0d0d0d', border:`1px solid ${done?'#2a2510':'#1c1c1c'}`,
        borderRadius:9, padding:'12px 13px', cursor:'pointer', userSelect:'none',
        WebkitUserSelect:'none', transition:'background .15s' }}
      onTouchStart={e => e.currentTarget.style.background='#161616'}
      onTouchEnd={e => e.currentTarget.style.background='#0d0d0d'}
    >
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ color:JK, fontSize:13, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', marginBottom:3 }}>
            🟡 {match.j.join(' & ')}
          </div>
          <div style={{ color:JO, fontSize:13, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
            🔴 {match.o.join(' & ')}
          </div>
          {/* Odds pill for singles */}
          {format === 'singles' && match.odds && match.odds[0] !== 'N/A' && (
            <div style={{ display:'flex', gap:6, marginTop:5 }}>
              <span style={{ background:'#111', borderRadius:4, padding:'2px 6px',
                color:oddsColor(match.odds[0]), fontSize:9, fontWeight:'bold' }}>{match.odds[0]}</span>
              <span style={{ color:'#333', fontSize:9, alignSelf:'center' }}>vs</span>
              <span style={{ background:'#111', borderRadius:4, padding:'2px 6px',
                color:oddsColor(match.odds[1]), fontSize:9, fontWeight:'bold' }}>{match.odds[1]}</span>
            </div>
          )}
        </div>
        <div style={{ textAlign:'right', marginLeft:10, flexShrink:0 }}>
          <div style={{ fontSize:15, fontWeight:'bold', color:statusColor }}>{state.txt}</div>
          <div style={{ color:'#333', fontSize:9, marginTop:2 }}>
            {done ? 'FINAL' : state.holesPlayed > 0 ? `thru ${state.holesPlayed}` : 'tap to score →'}
          </div>
        </div>
      </div>
      <Strip results={state.holeResults} holes={course.holes} />
    </div>
  );
}

// ─── SECTION ─────────────────────────────────────────────────────────────────
function Section({ title, subtitle, matches, allScores, onOpen, jackPts, joePts, expanded, onToggle }) {
  return (
    <div style={{ marginBottom:28 }}>
      <div onClick={onToggle}
        style={{ display:'flex', justifyContent:'space-between', alignItems:'center',
          borderBottom:'1px solid #1a1a1a', paddingBottom:9, marginBottom:11, cursor:'pointer', userSelect:'none' }}>
        <div>
          <div style={{ color:'#8a7a5a', fontSize:9, letterSpacing:3, textTransform:'uppercase' }}>{title}</div>
          {subtitle && <div style={{ color:'#282828', fontSize:9, marginTop:2 }}>{subtitle}</div>}
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ color:JK, fontWeight:'bold', fontSize:16 }}>{fmtPts(jackPts)}</span>
          <span style={{ color:'#252525', fontSize:14 }}>–</span>
          <span style={{ color:JO, fontWeight:'bold', fontSize:16 }}>{fmtPts(joePts)}</span>
          <span style={{ color:'#333', fontSize:13, marginLeft:3 }}>{expanded ? '▴' : '▾'}</span>
        </div>
      </div>
      {expanded && (
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {matches.map(m => (
            <MatchCard key={m.id} match={m} scores={allScores[m.id] || []} onClick={() => onOpen(m.id)} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── EMPTY SCORES ────────────────────────────────────────────────────────────
function emptyScores() {
  return Object.fromEntries(
    ALL.map(m => [m.id, Array(getCourse(m.c).holes).fill(null).map(() => ({ j:'', o:'' }))])
  );
}

// ─── MAIN APP ────────────────────────────────────────────────────────────────
export default function App() {
  const [allScores, setAllScores]   = useState(emptyScores);
  const [syncStatus, setSyncStatus] = useState('connecting');
  const [openId, setOpenId]         = useState(null);
  const [expanded, setExpanded]     = useState({ r1:true, r2:true, r3:true });
  const saveTimers = useRef({});

  // ── Load all scores on mount ──────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase.from('scores').select('match_id,hole,team,score');
        if (error) throw error;
        const next = emptyScores();
        data.forEach(({ match_id, hole, team, score }) => {
          if (next[match_id]?.[hole] !== undefined) {
            next[match_id][hole][team] = score === null ? '' : String(score);
          }
        });
        setAllScores(next);
        setSyncStatus('live');
      } catch {
        setSyncStatus('error');
      }
    })();
  }, []);

  // ── Real-time subscription ────────────────────────────────────────────────
  useEffect(() => {
    const channel = supabase
      .channel('scores_live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'scores' }, payload => {
        const { match_id, hole, team, score } = payload.new || {};
        if (!match_id) return;
        setAllScores(prev => {
          const ms = [...(prev[match_id] || [])];
          if (!ms[hole]) ms[hole] = { j:'', o:'' };
          ms[hole] = { ...ms[hole], [team]: score === null ? '' : String(score) };
          return { ...prev, [match_id]: ms };
        });
      })
      .subscribe(s => {
        if (s === 'SUBSCRIBED') setSyncStatus('live');
        if (s === 'CHANNEL_ERROR') setSyncStatus('error');
      });
    return () => supabase.removeChannel(channel);
  }, []);

  // ── Handle score change ───────────────────────────────────────────────────
  const handleChange = useCallback((matchId, holeIdx, team, val) => {
    setAllScores(prev => {
      const updated = (prev[matchId] || []).map((s, i) =>
        i === holeIdx ? { ...s, [team]: val } : s
      );
      return { ...prev, [matchId]: updated };
    });
    const key = `${matchId}_${holeIdx}_${team}`;
    clearTimeout(saveTimers.current[key]);
    saveTimers.current[key] = setTimeout(async () => {
      try {
        await supabase.from('scores').upsert(
          { match_id: matchId, hole: holeIdx, team, score: val === '' ? null : Number(val) },
          { onConflict: 'match_id,hole,team' }
        );
        setSyncStatus('live');
      } catch { setSyncStatus('error'); }
    }, 500);
  }, []);

  // ── Totals ────────────────────────────────────────────────────────────────
  function sectionPts(matches) {
    let j = 0, o = 0;
    matches.forEach(m => { const s = computeMatch(allScores[m.id] || [], m); j += s.pj; o += s.po; });
    return { j, o };
  }
  let jackTotal = 0, joeTotal = 0;
  ALL.forEach(m => { const s = computeMatch(allScores[m.id] || [], m); jackTotal += s.pj; joeTotal += s.po; });
  const r1 = sectionPts(R1), r2 = sectionPts(R2), r3 = sectionPts(R3);
  const openMatch = openId ? ALL.find(m => m.id === openId) : null;

  const syncDot  = syncStatus==='live' ? '#4fc87a' : syncStatus==='connecting' ? JK : '#e05c3a';
  const syncLabel = syncStatus==='live' ? 'Live' : syncStatus==='connecting' ? 'Connecting…' : 'Offline';

  return (
    <div style={{ minHeight:'100vh', background:'#080808', color:'#e8d5a3', paddingBottom:80,
      fontFamily:'Georgia, "Palatino Linotype", serif' }}>
      <style>{`
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance:none; margin:0; }
        input[type=number] { -moz-appearance:textfield; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        * { -webkit-tap-highlight-color: transparent; box-sizing: border-box; }
      `}</style>

      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <div style={{ background:'#0a0a0a', borderBottom:'1px solid #1a1a1a',
        padding:'20px 18px 14px', textAlign:'center', position:'sticky', top:0, zIndex:50 }}>

        {/* Live indicator */}
        <div style={{ position:'absolute', top:14, right:16, display:'flex', alignItems:'center', gap:5 }}>
          <div style={{ width:7, height:7, borderRadius:'50%', background:syncDot,
            boxShadow: syncStatus==='live' ? `0 0 8px ${syncDot}` : 'none',
            animation: syncStatus==='live' ? 'pulse 2s infinite' : 'none' }} />
          <span style={{ color:'#444', fontSize:9, letterSpacing:1 }}>{syncLabel}</span>
        </div>

        <div style={{ color:'#8a7a5a', fontSize:9, letterSpacing:4, textTransform:'uppercase', marginBottom:3 }}>
          Windy Cup 2026 · Hickory Valley GC
        </div>
        <div style={{ fontSize:24, fontWeight:'bold', letterSpacing:1 }}>⛳ The Windy Cup</div>
        <div style={{ color:'#252525', fontSize:10, marginTop:2 }}>
          May 30 · Ambassador & Presidential Courses
        </div>

        {/* Score bug */}
        <div style={{ display:'inline-flex', marginTop:12, borderRadius:10, overflow:'hidden', border:'1px solid #1e1e1e' }}>
          <div style={{ background: jackTotal > joeTotal ? 'rgba(240,192,64,0.13)' : '#0c0c0c',
            padding:'10px 24px', textAlign:'center', borderRight:'1px solid #1e1e1e', transition:'background .5s' }}>
            <div style={{ color:JK, fontSize:10, fontWeight:'bold', letterSpacing:2 }}>TEAM JACK</div>
            <div style={{ color:JK, fontSize:38, fontWeight:'bold', lineHeight:1.1 }}>{fmtPts(jackTotal)}</div>
          </div>
          <div style={{ background:'#080808', padding:'10px 12px',
            display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
            <div style={{ color:'#1a1a1a', fontSize:9, letterSpacing:1 }}>PTS</div>
            <div style={{ color:'#141414', fontSize:15 }}>–</div>
          </div>
          <div style={{ background: joeTotal > jackTotal ? 'rgba(224,92,58,0.13)' : '#0c0c0c',
            padding:'10px 24px', textAlign:'center', borderLeft:'1px solid #1e1e1e', transition:'background .5s' }}>
            <div style={{ color:JO, fontSize:10, fontWeight:'bold', letterSpacing:2 }}>TEAM JOE</div>
            <div style={{ color:JO, fontSize:38, fontWeight:'bold', lineHeight:1.1 }}>{fmtPts(joeTotal)}</div>
          </div>
        </div>

        <div style={{ color:'#1e1e1e', fontSize:9, marginTop:5 }}>
          {ALL.length} matches · real-time updates
        </div>
      </div>

      {/* ── MATCH SECTIONS ──────────────────────────────────────────────────── */}
      <div style={{ maxWidth:700, margin:'0 auto', padding:'22px 12px 0' }}>
        <Section
          title="Round 1 — 2-Man Scramble"
          subtitle="Ambassador Course · 18 holes · 7:30am Shotgun"
          matches={R1} allScores={allScores} onOpen={setOpenId}
          jackPts={r1.j} joePts={r1.o} expanded={expanded.r1}
          onToggle={() => setExpanded(p => ({ ...p, r1:!p.r1 }))} />

        <Section
          title="Round 2 — 2-Man Best Ball"
          subtitle="Presidential Course · Front 9 · 12:00pm"
          matches={R2} allScores={allScores} onOpen={setOpenId}
          jackPts={r2.j} joePts={r2.o} expanded={expanded.r2}
          onToggle={() => setExpanded(p => ({ ...p, r2:!p.r2 }))} />

        <Section
          title="Round 3 — Singles"
          subtitle="Presidential Course · Back 9 · Flights A–D"
          matches={R3} allScores={allScores} onOpen={setOpenId}
          jackPts={r3.j} joePts={r3.o} expanded={expanded.r3}
          onToggle={() => setExpanded(p => ({ ...p, r3:!p.r3 }))} />

        <div style={{ color:'#1a1a1a', fontSize:9, textAlign:'center', marginTop:8 }}>
          Win = 1 pt · Halved = ½ pt each
        </div>
      </div>

      {/* ── MATCH DETAIL ────────────────────────────────────────────────────── */}
      {openMatch && (
        <MatchDetail
          match={openMatch}
          scores={allScores[openId] || []}
          onChange={(hi, team, val) => handleChange(openId, hi, team, val)}
          onClose={() => setOpenId(null)} />
      )}
    </div>
  );
}
