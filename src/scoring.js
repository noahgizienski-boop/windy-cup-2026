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
    if (a < b) { standing++; holeResults.push('j'); }
    else if (b < a) { standing--; holeResults.push('o'); }
    else holeResults.push('h');
  }
  const rem = course.holes - holesPlayed;
  let status = 'live', txt = 'AS', leader = null;
  if (standing > 0) {
    leader = 'j'; const u = standing;
    if (u > rem) { status = 'done'; txt = `${u}&${rem}`; }
    else if (rem === 0) { status = 'done'; txt = `${u} UP`; }
    else txt = `${u} UP`;
  } else if (standing < 0) {
    leader = 'o'; const u = -standing;
    if (u > rem) { status = 'done'; txt = `${u}&${rem}`; }
    else if (rem === 0) { status = 'done'; txt = `${u} UP`; }
    else txt = `${u} UP`;
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
export function fmtVP(v) { return v === 0 ? 'E' : v > 0 ? `+${v}` : `${v}`; }
export function vpColor(v) { return v < 0 ? '#2d7a3a' : v > 0 ? '#c0392b' : '#4a5568'; }

export function scoreColor(s, p) {
  if (s === '') return '#9ca3af';
  const d = Number(s) - p;
  if (d <= -2) return '#b7791f';
  if (d === -1) return '#2d7a3a';
  if (d === 0) return '#2d3748';
  if (d === 1) return '#c0392b';
  return '#7b1d1d';
}
export function scoreBg(s, p) {
  if (s === '') return '#f9fafb';
  const d = Number(s) - p;
  if (d <= -2) return 'rgba(183,121,31,.15)';
  if (d === -1) return 'rgba(45,122,58,.12)';
  if (d === 0) return 'rgba(45,55,72,.06)';
  if (d === 1) return 'rgba(192,57,43,.1)';
  return 'rgba(123,29,29,.15)';
}
export function scoreLabel(s, p) {
  if (s === '') return '';
  const d = Number(s) - p;
  return d === 0 ? 'E' : d > 0 ? `+${d}` : `${d}`;
}
export function oddsColor(odds) {
  if (!odds || odds === 'N/A') return '#9ca3af';
  if (odds === 'EVEN') return '#6b7280';
  const n = Number(odds);
  if (n < 0) return '#2d7a3a';
  return '#b7791f';
}
export function oddsBg(odds) {
  if (!odds || odds === 'N/A') return '#f3f4f6';
  if (odds === 'EVEN') return '#f3f4f6';
  const n = Number(odds);
  if (n < 0) return 'rgba(45,122,58,.1)';
  return 'rgba(183,121,31,.1)';
}
export function oddsLabel(odds) {
  if (!odds || odds === 'N/A') return 'TBD';
  if (odds === 'EVEN') return 'EVEN';
  const n = Number(odds);
  return n < 0 ? '⭐ FAV' : '🐶 DOG';
}
