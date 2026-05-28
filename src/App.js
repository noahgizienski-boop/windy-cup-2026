import React, { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from './supabase';
import { ALL, R1, R2, R3, getCourse, getFormat } from './data';
import { computeMatch, fmtPts, fmtVP, vpColor, scoreColor, scoreBg, scoreLabel, oddsColor, oddsBg, oddsLabel } from './scoring';

// ─── THEME COLORS ─────────────────────────────────────────────────────────────
const JACK_COL  = '#1a5c2e';   // Deep green - Team Jack
const JACK_BG   = '#e8f5ec';   // Light green bg
const JOE_COL   = '#8b1a1a';   // Deep red - Team Joe  
const JOE_BG    = '#fdf0f0';   // Light red bg
const GREEN     = '#1e6b35';   // Windy Classic primary green
const WHITE     = '#ffffff';
const CREAM     = '#f8f6f0';   // Warm off-white background
const CARD_BG   = '#ffffff';
const BORDER    = '#e2e8e0';
const TEXT_DARK = '#1a2e1a';
const TEXT_MID  = '#4a5568';
const TEXT_LITE = '#718096';

// ─── MASTERS OF MUNI AD ───────────────────────────────────────────────────────
function MastersOfMuniAd({ compact = false }) {
  return (
    <a href="https://www.instagram.com/mastersofmuni" target="_blank" rel="noopener noreferrer"
      style={{
        display: 'flex', alignItems: 'center', gap: compact ? 8 : 10,
        background: WHITE, border: `1px solid ${BORDER}`,
        borderRadius: compact ? 8 : 10,
        padding: compact ? '7px 12px' : '10px 16px',
        textDecoration: 'none',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      }}>
      <img src="/masters-of-muni.png" alt="Masters of Muni"
        style={{ height: compact ? 28 : 36, width: 'auto', objectFit: 'contain' }} />
      <div>
        <div style={{ color: GREEN, fontSize: compact ? 10 : 11, fontWeight: 700, letterSpacing: 0.5 }}>
          Masters of Muni
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginTop: 1 }}>
          {/* Instagram icon SVG */}
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#c13584" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
            <circle cx="12" cy="12" r="4"/>
            <circle cx="17.5" cy="6.5" r="0.5" fill="#c13584" stroke="none"/>
          </svg>
          <span style={{ color: '#c13584', fontSize: compact ? 8 : 9 }}>@mastersofmuni</span>
        </div>
      </div>
      <div style={{ marginLeft: 'auto', color: TEXT_LITE, fontSize: 9, fontStyle: 'italic' }}>ad</div>
    </a>
  );
}

// ─── ODDS PILL ────────────────────────────────────────────────────────────────
function OddsPill({ playerName, odds, size = 'sm' }) {
  if (!odds || odds === 'N/A') return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4,
      background: '#f3f4f6', borderRadius: 6, padding: size === 'sm' ? '3px 7px' : '5px 10px' }}>
      <span style={{ color: TEXT_LITE, fontSize: size === 'sm' ? 10 : 12, fontWeight: 600 }}>TBD</span>
    </div>
  );

  const isFav = odds !== 'EVEN' && Number(odds) < 0;
  const isEven = odds === 'EVEN';

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      background: oddsBg(odds), border: `1px solid ${oddsColor(odds)}33`,
      borderRadius: 7, padding: size === 'sm' ? '4px 8px' : '6px 12px',
      minWidth: size === 'sm' ? 58 : 70,
    }}>
      {playerName && (
        <div style={{ color: TEXT_MID, fontSize: size === 'sm' ? 8 : 9, fontWeight: 600,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          maxWidth: size === 'sm' ? 80 : 120, marginBottom: 1 }}>
          {playerName.split(' ')[0]}
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
        <span style={{ color: oddsColor(odds), fontSize: size === 'sm' ? 11 : 14, fontWeight: 800 }}>
          {isEven ? 'EVEN' : odds}
        </span>
      </div>
      <div style={{ color: oddsColor(odds), fontSize: 8, fontWeight: 600, marginTop: 1 }}>
        {isFav ? '⭐ FAV' : isEven ? '—' : '🐶 DOG'}
      </div>
    </div>
  );
}

// ─── SCORE INPUT CELL ─────────────────────────────────────────────────────────
function ScoreCell({ value, par, onChange, isWinner, teamColor }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:2 }}>
      <div style={{ position:'relative' }}>
        {isWinner && (
          <div style={{ position:'absolute', inset:-3, borderRadius:6,
            border:`2px solid ${teamColor}`, pointerEvents:'none', zIndex:1 }} />
        )}
        <input
          type="number" inputMode="numeric" min="1" max="15" value={value}
          onChange={e => onChange(e.target.value)}
          style={{
            width:40, height:38, background: value !== '' ? scoreBg(value, par) : '#f9fafb',
            border: `1px solid ${value !== '' ? scoreColor(value,par)+'44' : BORDER}`,
            borderRadius:6,
            color: value !== '' ? scoreColor(value, par) : '#9ca3af',
            textAlign:'center', fontSize:15, fontWeight:'bold',
            outline:'none', fontFamily:'Georgia,serif', padding:0,
            WebkitAppearance:'none', MozAppearance:'textfield',
          }}
        />
      </div>
      {value !== '' && (
        <div style={{ fontSize:9, color:scoreColor(value,par), lineHeight:1, fontWeight:'bold' }}>
          {scoreLabel(value, par)}
        </div>
      )}
    </div>
  );
}

// ─── STRIP ────────────────────────────────────────────────────────────────────
function Strip({ results, holes, height = 6 }) {
  return (
    <div style={{ display:'flex', gap:2, height, borderRadius:3, overflow:'hidden' }}>
      {Array(holes).fill(0).map((_, i) => {
        const r = results[i];
        return (
          <div key={i} style={{ flex:1, borderRadius:1,
            background: r==='j' ? JACK_COL : r==='o' ? JOE_COL : r==='h' ? '#cbd5e0' : '#e2e8f0' }} />
        );
      })}
    </div>
  );
}

// ─── MATCH DETAIL MODAL ───────────────────────────────────────────────────────
function MatchDetail({ match, scores, onChange, onClose }) {
  const state = computeMatch(scores, match);
  const course = getCourse(match.c);
  const format = getFormat(match.id);
  const isSingles = format === 'singles';
  const statusColor = state.leader==='j' ? JACK_COL : state.leader==='o' ? JOE_COL : TEXT_MID;
  const statusBg = state.leader==='j' ? JACK_BG : state.leader==='o' ? JOE_BG : '#f7fafc';

  return (
    <div onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)',
        zIndex:200, overflowY:'auto', WebkitOverflowScrolling:'touch',
        display:'flex', justifyContent:'center', alignItems:'flex-start', padding:8 }}>
      <div style={{ background:CREAM, borderRadius:16, width:'100%', maxWidth:740,
        margin:'auto', fontFamily:'Georgia, serif', overflow:'hidden',
        boxShadow:'0 20px 60px rgba(0,0,0,0.2)' }}>

        {/* Modal header band */}
        <div style={{ background:GREEN, padding:'14px 16px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div>
              <div style={{ color:'rgba(255,255,255,0.7)', fontSize:9, letterSpacing:3, textTransform:'uppercase', marginBottom:3 }}>
                {format==='scramble'?'2-Man Scramble':format==='bestball'?'2-Man Best Ball':'Singles'} · {course.name}
              </div>
              <div style={{ color:WHITE, fontSize:17, fontWeight:'bold' }}>{match.lb}</div>
            </div>
            <button onClick={onClose}
              style={{ background:'rgba(255,255,255,0.2)', border:'none', color:WHITE,
                fontSize:18, cursor:'pointer', borderRadius:6, width:32, height:32,
                display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
          </div>
        </div>

        <div style={{ padding:'16px 14px' }}>
          {/* Teams + status */}
          <div style={{ display:'flex', gap:10, marginBottom:14 }}>
            {/* Jack */}
            <div style={{ flex:1, background:JACK_BG, borderRadius:10, padding:'10px 12px',
              border:`1.5px solid ${JACK_COL}33` }}>
              <div style={{ color:JACK_COL, fontSize:9, fontWeight:700, letterSpacing:2,
                textTransform:'uppercase', marginBottom:4 }}>Team Jack</div>
              <div style={{ color:JACK_COL, fontSize:12, fontWeight:600 }}>
                {match.j.join(' & ')}
              </div>
              {isSingles && match.odds && (
                <div style={{ marginTop:8 }}>
                  <OddsPill playerName={match.j[0]} odds={match.odds[0]} size="md" />
                </div>
              )}
            </div>

            {/* Status */}
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center',
              justifyContent:'center', flexShrink:0 }}>
              <div style={{ background:statusBg, borderRadius:10, padding:'8px 12px',
                textAlign:'center', border:`1.5px solid ${statusColor}33` }}>
                <div style={{ fontSize:22, fontWeight:'bold', color:statusColor, lineHeight:1 }}>{state.txt}</div>
                <div style={{ color:TEXT_LITE, fontSize:9, marginTop:3 }}>
                  {state.status==='done'?'FINAL':`thru ${state.holesPlayed}`}
                </div>
              </div>
            </div>

            {/* Joe */}
            <div style={{ flex:1, background:JOE_BG, borderRadius:10, padding:'10px 12px',
              border:`1.5px solid ${JOE_COL}33` }}>
              <div style={{ color:JOE_COL, fontSize:9, fontWeight:700, letterSpacing:2,
                textTransform:'uppercase', marginBottom:4 }}>Team Joe</div>
              <div style={{ color:JOE_COL, fontSize:12, fontWeight:600 }}>
                {match.o.join(' & ')}
              </div>
              {isSingles && match.odds && (
                <div style={{ marginTop:8 }}>
                  <OddsPill playerName={match.o[0]} odds={match.odds[1]} size="md" />
                </div>
              )}
            </div>
          </div>

          <Strip results={state.holeResults} holes={course.holes} height={8} />

          {format === 'bestball' && (
            <div style={{ color:TEXT_LITE, fontSize:9, marginTop:8, fontStyle:'italic' }}>
              Enter each player's score — the lower score counts for match play
            </div>
          )}

          {/* Scorecard */}
          <div style={{ overflowX:'auto', marginTop:14, WebkitOverflowScrolling:'touch' }}>
            <table style={{ borderCollapse:'collapse', fontSize:11, minWidth:course.holes*48+120, width:'100%' }}>
              <thead>
                <tr style={{ background:'#f0f4f0' }}>
                  <td style={{ padding:'5px 9px', color:TEXT_MID, borderRight:`1px solid ${BORDER}`, minWidth:110, fontWeight:600, fontSize:10 }}>Hole</td>
                  {course.holeNums.map((h,i) => (
                    <td key={i} style={{ padding:'5px 3px', textAlign:'center', color:TEXT_DARK, fontWeight:'bold', minWidth:48, fontSize:12 }}>{h}</td>
                  ))}
                  <td style={{ padding:'5px 7px', textAlign:'center', color:TEXT_MID, borderLeft:`1px solid ${BORDER}`, minWidth:48, fontSize:9 }}>TOT</td>
                </tr>
                <tr style={{ background:'#f8faf8' }}>
                  <td style={{ padding:'3px 9px', color:TEXT_LITE, fontSize:8, borderRight:`1px solid ${BORDER}` }}>Yards</td>
                  {course.yards.map((y,i) => <td key={i} style={{ padding:'2px 3px', textAlign:'center', color:TEXT_LITE, fontSize:8 }}>{y}</td>)}
                  <td style={{ padding:'2px 7px', textAlign:'center', color:TEXT_LITE, fontSize:8, borderLeft:`1px solid ${BORDER}` }}>{course.yards.reduce((a,b)=>a+b,0)}</td>
                </tr>
                <tr style={{ background:'#f8faf8' }}>
                  <td style={{ padding:'3px 9px', color:TEXT_LITE, fontSize:8, borderRight:`1px solid ${BORDER}` }}>Hdcp</td>
                  {course.handicap.map((h,i) => <td key={i} style={{ padding:'2px 3px', textAlign:'center', color:TEXT_LITE, fontSize:8 }}>{h}</td>)}
                  <td style={{ borderLeft:`1px solid ${BORDER}` }} />
                </tr>
                <tr style={{ background:'#e8f0e8' }}>
                  <td style={{ padding:'5px 9px', color:GREEN, fontWeight:'bold', borderRight:`1px solid ${BORDER}`, fontSize:13 }}>Par</td>
                  {course.par.map((p,i) => <td key={i} style={{ padding:'4px 3px', textAlign:'center', color:GREEN, fontWeight:'bold', fontSize:13 }}>{p}</td>)}
                  <td style={{ padding:'4px 7px', textAlign:'center', color:GREEN, fontWeight:'bold', borderLeft:`1px solid ${BORDER}`, fontSize:13 }}>{course.par.reduce((a,b)=>a+b,0)}</td>
                </tr>
              </thead>
              <tbody>
                {/* Jack row */}
                <tr style={{ borderTop:`2px solid ${BORDER}`, background:'#f7fdf9' }}>
                  <td style={{ padding:'5px 9px', color:JACK_COL, fontWeight:'bold', fontSize:10, borderRight:`1px solid ${BORDER}`, whiteSpace:'nowrap' }}>
                    🟩 {match.j[0]}{match.j[1]?' / '+match.j[1]:''}
                  </td>
                  {Array(course.holes).fill(0).map((_,i) => {
                    const s = scores[i]||{j:'',o:''};
                    return (
                      <td key={i} style={{ padding:'3px 2px', textAlign:'center' }}>
                        <ScoreCell value={s.j} par={course.par[i]}
                          onChange={v=>onChange(i,'j',v)}
                          isWinner={state.holeResults[i]==='j'}
                          teamColor={JACK_COL} />
                      </td>
                    );
                  })}
                  <td style={{ textAlign:'center', borderLeft:`1px solid ${BORDER}`, padding:'3px 7px' }}>
                    <div style={{ color:JACK_COL, fontWeight:'bold', fontSize:14 }}>{state.jTotal||'—'}</div>
                    {state.holesPlayed>0&&<div style={{ fontSize:9, color:vpColor(state.jVsPar) }}>{fmtVP(state.jVsPar)}</div>}
                  </td>
                </tr>
                {/* Joe row */}
                <tr style={{ borderTop:`1px solid ${BORDER}`, background:'#fdf7f7' }}>
                  <td style={{ padding:'5px 9px', color:JOE_COL, fontWeight:'bold', fontSize:10, borderRight:`1px solid ${BORDER}`, whiteSpace:'nowrap' }}>
                    🟥 {match.o[0]}{match.o[1]?' / '+match.o[1]:''}
                  </td>
                  {Array(course.holes).fill(0).map((_,i) => {
                    const s = scores[i]||{j:'',o:''};
                    return (
                      <td key={i} style={{ padding:'3px 2px', textAlign:'center' }}>
                        <ScoreCell value={s.o} par={course.par[i]}
                          onChange={v=>onChange(i,'o',v)}
                          isWinner={state.holeResults[i]==='o'}
                          teamColor={JOE_COL} />
                      </td>
                    );
                  })}
                  <td style={{ textAlign:'center', borderLeft:`1px solid ${BORDER}`, padding:'3px 7px' }}>
                    <div style={{ color:JOE_COL, fontWeight:'bold', fontSize:14 }}>{state.oTotal||'—'}</div>
                    {state.holesPlayed>0&&<div style={{ fontSize:9, color:vpColor(state.oVsPar) }}>{fmtVP(state.oVsPar)}</div>}
                  </td>
                </tr>
                {/* Result row */}
                <tr style={{ borderTop:`1px solid ${BORDER}`, background:'#f9fafb' }}>
                  <td style={{ padding:'4px 9px', color:TEXT_LITE, fontSize:9, borderRight:`1px solid ${BORDER}` }}>Result</td>
                  {state.holeResults.map((r,i) => (
                    <td key={i} style={{ textAlign:'center', padding:'4px 2px', fontSize:12 }}>
                      {r==='j'&&<span style={{ color:JACK_COL, fontWeight:'bold' }}>▲</span>}
                      {r==='o'&&<span style={{ color:JOE_COL, fontWeight:'bold' }}>▲</span>}
                      {r==='h'&&<span style={{ color:'#cbd5e0' }}>–</span>}
                    </td>
                  ))}
                  <td style={{ borderLeft:`1px solid ${BORDER}` }} />
                </tr>
              </tbody>
            </table>
          </div>

          {/* Momentum */}
          <div style={{ marginTop:16 }}>
            <div style={{ color:TEXT_LITE, fontSize:8, letterSpacing:2, marginBottom:5 }}>MATCH MOMENTUM</div>
            <div style={{ display:'flex', gap:2, alignItems:'flex-end', height:28 }}>
              {(() => {
                let run = 0;
                return state.holeResults.map((r,i) => {
                  if (r==='j') run++; else if (r==='o') run--;
                  const h = Math.abs(run);
                  return (
                    <div key={i} style={{ flex:1, borderRadius:2, alignSelf:'flex-end',
                      height: h===0?3:Math.min(5+h*5,28),
                      background: run>0?`${JACK_COL}${Math.min(30+h*20,99).toString(16).padStart(2,'0')}`:
                        run<0?`${JOE_COL}${Math.min(30+h*20,99).toString(16).padStart(2,'0')}`:'#e2e8f0' }} />
                  );
                });
              })()}
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', marginTop:3 }}>
              <span style={{ color:JACK_COL, fontSize:8, fontWeight:600 }}>🟩 Jack leads</span>
              <span style={{ color:JOE_COL, fontSize:8, fontWeight:600 }}>Joe leads 🟥</span>
            </div>
          </div>

          {/* Legend */}
          <div style={{ display:'flex', gap:10, marginTop:12, flexWrap:'wrap' }}>
            {[['Eagle+','#b7791f'],['Birdie','#2d7a3a'],['Par','#2d3748'],['Bogey','#c0392b'],['Double+','#7b1d1d']].map(([l,c]) => (
              <div key={l} style={{ display:'flex', alignItems:'center', gap:3 }}>
                <div style={{ width:8, height:8, borderRadius:2, background:c, opacity:0.8 }} />
                <span style={{ color:TEXT_LITE, fontSize:8 }}>{l}</span>
              </div>
            ))}
          </div>

          {/* Ad */}
          <div style={{ marginTop:16 }}>
            <MastersOfMuniAd compact />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MATCH CARD ───────────────────────────────────────────────────────────────
function MatchCard({ match, scores, onClick }) {
  const state = computeMatch(scores, match);
  const format = getFormat(match.id);
  const course = getCourse(match.c);
  const isSingles = format === 'singles';
  const done = state.status === 'done';
  const statusColor = state.leader==='j'?JACK_COL:state.leader==='o'?JOE_COL:TEXT_MID;

  return (
    <div onClick={onClick}
      style={{ background:CARD_BG, border:`1px solid ${done?GREEN+'44':BORDER}`,
        borderRadius:10, padding:'12px 14px', cursor:'pointer',
        boxShadow: done ? `0 2px 8px ${GREEN}22` : '0 1px 3px rgba(0,0,0,0.06)',
        transition:'all .15s', userSelect:'none', WebkitUserSelect:'none' }}
      onTouchStart={e=>e.currentTarget.style.background='#f0f4f0'}
      onTouchEnd={e=>e.currentTarget.style.background=CARD_BG}
    >
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
        <div style={{ flex:1, minWidth:0 }}>
          {/* Jack player */}
          <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:4 }}>
            <div style={{ width:10, height:10, borderRadius:2, background:JACK_COL, flexShrink:0 }} />
            <div style={{ color:JACK_COL, fontSize:12, fontWeight:600,
              overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
              {match.j.join(' & ')}
            </div>
          </div>
          {/* Joe player */}
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <div style={{ width:10, height:10, borderRadius:2, background:JOE_COL, flexShrink:0 }} />
            <div style={{ color:JOE_COL, fontSize:12, fontWeight:600,
              overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
              {match.o.join(' & ')}
            </div>
          </div>

          {/* Odds for singles - shown on card */}
          {isSingles && match.odds && match.odds[0] !== 'N/A' && (
            <div style={{ display:'flex', gap:5, marginTop:7, alignItems:'center' }}>
              <OddsPill playerName={match.j[0]} odds={match.odds[0]} size="sm" />
              <span style={{ color:TEXT_LITE, fontSize:9 }}>vs</span>
              <OddsPill playerName={match.o[0]} odds={match.odds[1]} size="sm" />
            </div>
          )}
        </div>

        <div style={{ textAlign:'right', marginLeft:10, flexShrink:0 }}>
          <div style={{ fontSize:16, fontWeight:'bold', color:statusColor,
            background: state.leader ? (state.leader==='j'?JACK_BG:JOE_BG) : '#f7fafc',
            borderRadius:6, padding:'4px 10px', display:'inline-block' }}>
            {state.txt}
          </div>
          <div style={{ color:TEXT_LITE, fontSize:9, marginTop:3 }}>
            {done?'FINAL':state.holesPlayed>0?`thru ${state.holesPlayed}`:'tap to score →'}
          </div>
        </div>
      </div>

      <Strip results={state.holeResults} holes={course.holes} />
    </div>
  );
}

// ─── SECTION ──────────────────────────────────────────────────────────────────
function Section({ title, subtitle, matches, allScores, onOpen, jackPts, joePts, expanded, onToggle }) {
  return (
    <div style={{ marginBottom:24 }}>
      <div onClick={onToggle}
        style={{ display:'flex', justifyContent:'space-between', alignItems:'center',
          borderBottom:`2px solid ${GREEN}33`, paddingBottom:10, marginBottom:12,
          cursor:'pointer', userSelect:'none' }}>
        <div>
          <div style={{ color:GREEN, fontSize:10, letterSpacing:3, textTransform:'uppercase', fontWeight:700 }}>{title}</div>
          {subtitle&&<div style={{ color:TEXT_LITE, fontSize:9, marginTop:2 }}>{subtitle}</div>}
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <div style={{ display:'flex', alignItems:'center', gap:6,
            background:WHITE, borderRadius:8, padding:'4px 10px', border:`1px solid ${BORDER}`,
            boxShadow:'0 1px 3px rgba(0,0,0,0.06)' }}>
            <span style={{ color:JACK_COL, fontWeight:'bold', fontSize:16 }}>{fmtPts(jackPts)}</span>
            <span style={{ color:TEXT_LITE, fontSize:13 }}>–</span>
            <span style={{ color:JOE_COL, fontWeight:'bold', fontSize:16 }}>{fmtPts(joePts)}</span>
          </div>
          <span style={{ color:TEXT_LITE, fontSize:13 }}>{expanded?'▴':'▾'}</span>
        </div>
      </div>
      {expanded && (
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {matches.map(m => (
            <MatchCard key={m.id} match={m} scores={allScores[m.id]||[]} onClick={()=>onOpen(m.id)} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── EMPTY SCORES ─────────────────────────────────────────────────────────────
function emptyScores() {
  return Object.fromEntries(
    ALL.map(m => [m.id, Array(getCourse(m.c).holes).fill(null).map(()=>({j:'',o:''})) ])
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [allScores, setAllScores]   = useState(emptyScores);
  const [syncStatus, setSyncStatus] = useState('connecting');
  const [openId, setOpenId]         = useState(null);
  const [expanded, setExpanded]     = useState({r1:true,r2:true,r3:true});
  const saveTimers = useRef({});

  // Load scores
  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase.from('scores').select('match_id,hole,team,score');
        if (error) throw error;
        const next = emptyScores();
        data.forEach(({ match_id, hole, team, score }) => {
          if (next[match_id]?.[hole] !== undefined)
            next[match_id][hole][team] = score===null?'':String(score);
        });
        setAllScores(next);
        setSyncStatus('live');
      } catch { setSyncStatus('error'); }
    })();
  }, []);

  // Real-time
  useEffect(() => {
    const channel = supabase.channel('scores_live')
      .on('postgres_changes',{event:'*',schema:'public',table:'scores'}, payload => {
        const { match_id, hole, team, score } = payload.new||{};
        if (!match_id) return;
        setAllScores(prev => {
          const ms = [...(prev[match_id]||[])];
          if (!ms[hole]) ms[hole]={j:'',o:''};
          ms[hole]={...ms[hole],[team]:score===null?'':String(score)};
          return {...prev,[match_id]:ms};
        });
      })
      .subscribe(s => {
        if (s==='SUBSCRIBED') setSyncStatus('live');
        if (s==='CHANNEL_ERROR') setSyncStatus('error');
      });
    return () => supabase.removeChannel(channel);
  }, []);

  const handleChange = useCallback((matchId, holeIdx, team, val) => {
    setAllScores(prev => {
      const updated = (prev[matchId]||[]).map((s,i)=>i===holeIdx?{...s,[team]:val}:s);
      return {...prev,[matchId]:updated};
    });
    const key = `${matchId}_${holeIdx}_${team}`;
    clearTimeout(saveTimers.current[key]);
    saveTimers.current[key] = setTimeout(async () => {
      try {
        await supabase.from('scores').upsert(
          {match_id:matchId,hole:holeIdx,team,score:val===''?null:Number(val)},
          {onConflict:'match_id,hole,team'}
        );
        setSyncStatus('live');
      } catch { setSyncStatus('error'); }
    }, 500);
  }, []);

  function sectionPts(matches) {
    let j=0,o=0;
    matches.forEach(m=>{const s=computeMatch(allScores[m.id]||[],m);j+=s.pj;o+=s.po;});
    return {j,o};
  }
  let jackTotal=0,joeTotal=0;
  ALL.forEach(m=>{const s=computeMatch(allScores[m.id]||[],m);jackTotal+=s.pj;joeTotal+=s.po;});
  const r1=sectionPts(R1),r2=sectionPts(R2),r3=sectionPts(R3);
  const openMatch = openId?ALL.find(m=>m.id===openId):null;

  const syncDot = syncStatus==='live'?'#2d7a3a':syncStatus==='connecting'?'#b7791f':'#c0392b';

  return (
    <div style={{ minHeight:'100vh', background:CREAM, color:TEXT_DARK, paddingBottom:80,
      fontFamily:'Georgia, "Palatino Linotype", serif' }}>
      <style>{`
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}
        input[type=number]{-moz-appearance:textfield}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}
        *{-webkit-tap-highlight-color:transparent;box-sizing:border-box}
      `}</style>

      {/* ── HEADER ── */}
      <div style={{ background:GREEN, boxShadow:'0 2px 12px rgba(0,0,0,0.15)',
        padding:'0 16px', position:'sticky', top:0, zIndex:50 }}>

        {/* Live dot */}
        <div style={{ position:'absolute', top:10, right:14, display:'flex', alignItems:'center', gap:4 }}>
          <div style={{ width:7, height:7, borderRadius:'50%', background:syncDot,
            boxShadow:syncStatus==='live'?`0 0 6px ${syncDot}`:'none',
            animation:syncStatus==='live'?'pulse 2s infinite':'none' }} />
          <span style={{ color:'rgba(255,255,255,0.6)', fontSize:8, letterSpacing:1 }}>
            {syncStatus==='live'?'Live':syncStatus==='connecting'?'…':'Offline'}
          </span>
        </div>

        {/* Logo + title */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center',
          gap:12, padding:'12px 0 10px' }}>
          <img src="/windy-logo.png" alt="Windy Classic"
            style={{ height:52, width:'auto', objectFit:'contain', borderRadius:4 }} />
          <div style={{ textAlign:'center' }}>
            <div style={{ color:WHITE, fontSize:20, fontWeight:'bold', letterSpacing:1, lineHeight:1.1 }}>
              The Windy Classic
            </div>
            <div style={{ color:'rgba(255,255,255,0.7)', fontSize:9, marginTop:2, letterSpacing:1 }}>
              HICKORY VALLEY GC · MAY 30, 2026
            </div>
          </div>
        </div>

        {/* Score bug */}
        <div style={{ display:'flex', justifyContent:'center', paddingBottom:12 }}>
          <div style={{ display:'inline-flex', borderRadius:10, overflow:'hidden',
            border:'1.5px solid rgba(255,255,255,0.2)', boxShadow:'0 2px 8px rgba(0,0,0,0.2)' }}>
            <div style={{ background:jackTotal>joeTotal?'rgba(255,255,255,0.2)':'rgba(0,0,0,0.15)',
              padding:'8px 20px', textAlign:'center', borderRight:'1px solid rgba(255,255,255,0.15)',
              transition:'background .4s' }}>
              <div style={{ color:'rgba(255,255,255,0.75)', fontSize:9, fontWeight:700, letterSpacing:2 }}>TEAM JACK</div>
              <div style={{ color:WHITE, fontSize:34, fontWeight:'bold', lineHeight:1.1 }}>{fmtPts(jackTotal)}</div>
            </div>
            <div style={{ background:'rgba(0,0,0,0.1)', padding:'8px 12px',
              display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
              <div style={{ color:'rgba(255,255,255,0.4)', fontSize:9 }}>PTS</div>
              <div style={{ color:'rgba(255,255,255,0.3)', fontSize:14 }}>–</div>
            </div>
            <div style={{ background:joeTotal>jackTotal?'rgba(255,255,255,0.2)':'rgba(0,0,0,0.15)',
              padding:'8px 20px', textAlign:'center', borderLeft:'1px solid rgba(255,255,255,0.15)',
              transition:'background .4s' }}>
              <div style={{ color:'rgba(255,255,255,0.75)', fontSize:9, fontWeight:700, letterSpacing:2 }}>TEAM JOE</div>
              <div style={{ color:WHITE, fontSize:34, fontWeight:'bold', lineHeight:1.1 }}>{fmtPts(joeTotal)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ maxWidth:700, margin:'0 auto', padding:'20px 12px 0' }}>

        {/* Ad banner */}
        <div style={{ marginBottom:20 }}>
          <MastersOfMuniAd />
        </div>

        <Section title="Round 1 — 2-Man Scramble" subtitle="Ambassador Course · 18 holes · 7:30am Shotgun"
          matches={R1} allScores={allScores} onOpen={setOpenId}
          jackPts={r1.j} joePts={r1.o} expanded={expanded.r1}
          onToggle={()=>setExpanded(p=>({...p,r1:!p.r1}))} />

        <Section title="Round 2 — 2-Man Best Ball" subtitle="Presidential Course · Front 9 · 12:00pm"
          matches={R2} allScores={allScores} onOpen={setOpenId}
          jackPts={r2.j} joePts={r2.o} expanded={expanded.r2}
          onToggle={()=>setExpanded(p=>({...p,r2:!p.r2}))} />

        <Section title="Round 3 — Singles" subtitle="Presidential Course · Back 9 · Flights A–D"
          matches={R3} allScores={allScores} onOpen={setOpenId}
          jackPts={r3.j} joePts={r3.o} expanded={expanded.r3}
          onToggle={()=>setExpanded(p=>({...p,r3:!p.r3}))} />

        <div style={{ color:TEXT_LITE, fontSize:9, textAlign:'center', marginTop:8, marginBottom:24 }}>
          Win = 1 pt · Halved = ½ pt each · tap any match to score
        </div>

        {/* Bottom ad */}
        <MastersOfMuniAd />
      </div>

      {/* ── MODAL ── */}
      {openMatch && (
        <MatchDetail
          match={openMatch}
          scores={allScores[openId]||[]}
          onChange={(hi,team,val)=>handleChange(openId,hi,team,val)}
          onClose={()=>setOpenId(null)} />
      )}
    </div>
  );
}
