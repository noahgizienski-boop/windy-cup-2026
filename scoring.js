import { getCourse } from './data';

export function computeMatch(scores, match) {
  const course = getCourse(match.c);
  const pars = course.par;
  let standing = 0, holesPlayed = 0;
  const holeResults = [];

  for (let i = 0; i < course.holes; i++) {
    const s = scores[i] || { j: '', o: '' };
    const a = s.j === '' ? null : Number(s.j);
    const b = s.o === '' ? null : Number(s.o);
    if (a === null || b === null) { holeResults.push(null); continue; }
    holesPlayed++;
    if (a < b)      { standing++; holeResults.push('j'); }
    else if (b < a) { standing--; holeResults.push('o'); }
    else            { holeResults.push('h'); }
  }

  const rem = course.holes - holesPlayed;
  let status = 'live', txt = 'AS', leader = null;

  if (standing > 0) {
    leader = 'j'; const u = standing;
    if (u > rem)       { status = 'done'; txt = `${u}&${rem}`; }
    else if (rem === 0){ status = 'done'; txt = `${u} UP`; }
    else                 txt = `${u} UP`;
  } else if (standing < 0) {
    leader = 'o'; const u = -standing;
    if (u > rem)       { status = 'done'; txt = `${u}&${rem}`; }
    else if (rem === 0){ status = 'done'; txt = `${u} UP`; }
    else                 txt = `${u} UP`;
  } else if (rem === 0) { status = 'done'; txt = 'HALVED'; }

  let pj = 0, po = 0;
  if (status === 'done') {
    if (leader === 'j') pj = 1;
    else if (leader === 'o') po = 1;
    else { pj = 0.5; po = 0.5; }
  }

  let jTotal = 0, oTotal = 0, jVsPar = 0, oVsPar = 0;
  for (let i = 0; i < course.holes; i++) {
    const s = scores[i] || { j: '', o: '' };
    if (s.j !== '') { jTotal += Number(s.j); jVsPar += Number(s.j) - pars[i]; }
    if (s.o !== '') { oTotal += Number(s.o); oVsPar += Number(s.o) - pars[i]; }
  }

  return { holeResults, holesPlayed, rem, leader, status, txt, pj, po, jTotal, oTotal, jVsPar, oVsPar };
}

export function fmtPts(n) { return n % 1 === 0 ? String(n) : n.toFixed(1); }
export function fmtVP(v)  { return v === 0 ? 'E' : v > 0 ? `+${v}` : `${v}`; }
export function vpColor(v){ return v < 0 ? '#4fc87a' : v > 0 ? '#e05c3a' : '#e8d5a3'; }

export function scoreColor(s, p) {
  if (s === '') return '#444';
  const d = Number(s) - p;
  if (d <= -2) return '#f0c040';
  if (d === -1) return '#4fc87a';
  if (d === 0)  return '#e8d5a3';
  if (d === 1)  return '#e05c3a';
  return '#c0392b';
}
export function scoreBg(s, p) {
  if (s === '') return '#111';
  const d = Number(s) - p;
  if (d <= -2) return 'rgba(240,192,64,.22)';
  if (d === -1) return 'rgba(79,200,122,.18)';
  if (d === 0)  return 'rgba(232,213,163,.07)';
  if (d === 1)  return 'rgba(224,92,58,.2)';
  return 'rgba(192,57,43,.3)';
}
export function scoreLabel(s, p) {
  if (s === '') return '';
  const d = Number(s) - p;
  return d === 0 ? 'E' : d > 0 ? `+${d}` : `${d}`;
}

export function oddsColor(odds) {
  if (!odds || odds === 'N/A' || odds === 'EVEN') return '#888';
  const n = Number(odds);
  if (n < 0) return '#4fc87a';  // favorite = green
  return '#e05c3a';              // underdog = red
}
