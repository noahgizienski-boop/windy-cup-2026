// ─── COURSE DATA — Hickory Valley GC, White Tees ─────────────────────────────

export const AMBASSADOR = {
  name: 'Ambassador Course',
  par:      [5,4,3,4,3,4,4,4,5, 5,4,3,4,4,4,3,4,4],
  handicap: [7,5,13,15,17,11,3,9,1, 6,8,12,2,4,14,18,10,16],
  yards:    [471,346,120,316,163,351,385,353,531, 440,330,153,413,365,258,164,384,367],
  holeNums: Array.from({length:18},(_,i)=>i+1),
  holes: 18,
};

export const PRESIDENTIAL = {
  name: 'Presidential Course',
  par:      [4,4,4,5,3,5,3,4,4, 4,3,4,4,5,3,4,5,4],
  handicap: [9,5,11,7,17,13,15,1,3, 2,14,6,12,8,18,4,16,10],
  yards:    [340,387,354,521,137,465,141,390,362, 428,188,362,369,528,112,420,451,335],
  holeNums: Array.from({length:18},(_,i)=>i+1),
  holes: 18,
};

export const PRES_FRONT = {
  name: 'Presidential Course',
  par:      [4,4,4,5,3,5,3,4,4],
  handicap: [9,5,11,7,17,13,15,1,3],
  yards:    [340,387,354,521,137,465,141,390,362],
  holeNums: [1,2,3,4,5,6,7,8,9],
  holes: 9,
};

export const PRES_BACK = {
  name: 'Presidential Course',
  par:      [4,3,4,4,5,3,4,5,4],
  handicap: [2,14,6,12,8,18,4,16,10],
  yards:    [428,188,362,369,528,112,420,451,335],
  holeNums: [10,11,12,13,14,15,16,17,18],
  holes: 9,
};

export function getCourse(key) {
  if (key === 'amb') return AMBASSADOR;
  if (key === 'pf')  return PRES_FRONT;
  return PRES_BACK;
}

export function getFormat(id) {
  if (id.startsWith('r1')) return 'scramble';
  if (id.startsWith('r2')) return 'bestball';
  return 'singles';
}

// ── ROUND 1: 2-Man Scramble, Ambassador, 7:30am Shotgun ──────────────────────
export const R1 = [
  {id:'r1_1', lb:'Scramble 1',  c:'amb', tee:'Hole 1',  j:['Timmy Gallagher','Aidan Reed'],       o:['Kevin Deprince','Ryan Buckton']},
  {id:'r1_2', lb:'Scramble 2',  c:'amb', tee:'Hole 2',  j:['Brendan George','Austin Serra'],      o:['Kane Gallagher','Drew Rhoton']},
  {id:'r1_3', lb:'Scramble 3',  c:'amb', tee:'Hole 3',  j:['Andrew Damico','John Seidman'],       o:['Brendan Farrell','Matt Gillen']},
  {id:'r1_4', lb:'Scramble 4',  c:'amb', tee:'Hole 4',  j:['Sean Leyden','Tanner Robinson'],      o:['JT Smyth','Jake Ruane']},
  {id:'r1_5', lb:'Scramble 5',  c:'amb', tee:'Hole 5',  j:['Pat Gallagher','Brian Ward'],         o:['Brendan McGroary','Tom Wertz']},
  {id:'r1_6', lb:'Scramble 6',  c:'amb', tee:'Hole 6',  j:['Greg Damico','Declan Donaher'],       o:['Ryan Odgers','Will Higson']},
  {id:'r1_7', lb:'Scramble 7',  c:'amb', tee:'Hole 7',  j:['JD Doemling','Nick Donegan'],         o:['Gerard Sweeney','John Rufo']},
  {id:'r1_8', lb:'Scramble 8',  c:'amb', tee:'Hole 8',  j:['Colin McCormick','Connor Maloney'],   o:['Conor Gallagher','Ben Murphy']},
  {id:'r1_9', lb:'Scramble 9',  c:'amb', tee:'Hole 9',  j:['Cillian Gilson','Chris Anderson'],    o:['Kevin Egan','Brendan Ahearn']},
  {id:'r1_10',lb:'Scramble 10', c:'amb', tee:'Hole 10', j:['Ryan George','Liam Sullivan'],        o:['PJ Tecco','Jack Wert']},
  {id:'r1_11',lb:'Scramble 11', c:'amb', tee:'Hole 11', j:['Shaun Jones','Jack Thornton'],        o:['Danny Roe','Noah Gizienski']},
  {id:'r1_12',lb:'Scramble 12', c:'amb', tee:'Hole 12', j:['Sean Donohue','Brian Stratton'],      o:['Bobby Castaldi','George Doemling']},
  {id:'r1_13',lb:'Scramble 13', c:'amb', tee:'Hole 13', j:['Matt Young','Aidan McNulty'],         o:['Pat Rymal','Rob Macoy']},
  {id:'r1_14',lb:'Scramble 14', c:'amb', tee:'Hole 14', j:['Jerry Smyth','Jack Carpenter'],       o:['Jason Kuzmick','Danny Smyth']},
  {id:'r1_15',lb:'Scramble 15', c:'amb', tee:'Hole 15', j:['Mike Levy','Casey Gilroy'],           o:['Jack Armstrong','Fynn McNulty']},
  {id:'r1_16',lb:'Scramble 16', c:'amb', tee:'Hole 16', j:['Danny Sullivan','PJ Murphy'],         o:['Jack Davin','Joe Carpenter']},
];

// ── ROUND 2: 2-Man Best Ball, Presidential Front 9, 1:00pm–3:30pm ────────────
export const R2 = [
  {id:'r2_1', lb:'Best Ball 1',  c:'pf', tee:'1:00 PM', j:['Cillian Gilson','Nick Donegan'],     o:['Jack Davin','Jake Ruane']},
  {id:'r2_2', lb:'Best Ball 2',  c:'pf', tee:'1:10 PM', j:['Greg Damico','Aidan McNulty'],        o:['Ryan Odgers','Fynn McNulty']},
  {id:'r2_3', lb:'Best Ball 3',  c:'pf', tee:'1:20 PM', j:['Colin McCormick','Chris Anderson'],   o:['Gerard Sweeney','Rob Macoy']},
  {id:'r2_4', lb:'Best Ball 4',  c:'pf', tee:'1:30 PM', j:['Shaun Jones','Declan Donaher'],       o:['Kevin Egan','Will Higson']},
  {id:'r2_5', lb:'Best Ball 5',  c:'pf', tee:'1:40 PM', j:['Matt Young','John Seidman'],          o:['PJ Tecco','Matt Gillen']},
  {id:'r2_6', lb:'Best Ball 6',  c:'pf', tee:'1:50 PM', j:['JD Doemling','PJ Murphy'],            o:['JT Smyth','George Doemling']},
  {id:'r2_7', lb:'Best Ball 7',  c:'pf', tee:'2:00 PM', j:['Brendan George','Liam Sullivan'],     o:['Brendan Farrell','Noah Gizienski']},
  {id:'r2_8', lb:'Best Ball 8',  c:'pf', tee:'2:10 PM', j:['Sean Leyden','Brian Stratton'],       o:['Kevin DePrince','Danny Smyth']},
  {id:'r2_9', lb:'Best Ball 9',  c:'pf', tee:'2:20 PM', j:['Jerry Smyth','Aidan Reed'],           o:['Patrick Rymal','John Rufo']},
  {id:'r2_10',lb:'Best Ball 10', c:'pf', tee:'2:30 PM', j:['Timmy Gallagher','Jack Carpenter'],   o:['Brendan McGroary','Joe Carpenter']},
  {id:'r2_11',lb:'Best Ball 11', c:'pf', tee:'2:40 PM', j:['Danny Sullivan','Austin Serra'],      o:['Danny Roe','Ryan Buckton']},
  {id:'r2_12',lb:'Best Ball 12', c:'pf', tee:'2:50 PM', j:['Ryan George','Tanner Robinson'],      o:['Jason Kuzmick','Ben Murphy']},
  {id:'r2_13',lb:'Best Ball 13', c:'pf', tee:'3:00 PM', j:['Sean Donohue','Brian Ward'],          o:['Jack Armstrong','Drew Rhoton']},
  {id:'r2_14',lb:'Best Ball 14', c:'pf', tee:'3:10 PM', j:['Mike Levy','Conor Maloney'],          o:['Bobby Castaldi','Tom Wertz']},
  {id:'r2_15',lb:'Best Ball 15', c:'pf', tee:'3:20 PM', j:['Pat Gallagher','Jack Thornton'],      o:['Conor Gallagher','Jack Wert']},
  {id:'r2_16',lb:'Best Ball 16', c:'pf', tee:'3:30 PM', j:['Andrew Damico','Casey Gilroy'],       o:['Kane Gallagher','Brendan Ahearn']},
];

// ── ROUND 3: Singles, Presidential Back 9 ────────────────────────────────────
export const R3 = [
  {id:'r3_a1',lb:'Singles A1',c:'pb',j:['Andrew Damico'],   o:['Kane Gallagher'],    odds:['-110','-110']},
  {id:'r3_a2',lb:'Singles A2',c:'pb',j:['Timmy Gallagher'], o:['Brendan McGroary'],  odds:['-155','+135']},
  {id:'r3_a3',lb:'Singles A3',c:'pb',j:['Sean Leyden'],     o:['Kevin DePrince'],    odds:['+140','-160']},
  {id:'r3_a4',lb:'Singles A4',c:'pb',j:['JD Doemling'],     o:['JT Smyth'],          odds:['-125','+105']},
  {id:'r3_a5',lb:'Singles A5',c:'pb',j:['Greg Damico'],     o:['Ryan Odgers'],       odds:['-200','+180']},
  {id:'r3_a6',lb:'Singles A6',c:'pb',j:['Colin McCormick'], o:['Gerard Sweeney'],    odds:['+130','-150']},
  {id:'r3_a7',lb:'Singles A7',c:'pb',j:['Pat Gallagher'],   o:['Conor Gallagher'],   odds:['-130','EVEN']},
  {id:'r3_a8',lb:'Singles A8',c:'pb',j:['Brendan George'],  o:['Brendan Farrell'],   odds:['+145','-170']},
  {id:'r3_b1',lb:'Singles B1',c:'pb',j:['Sean Donohue'],    o:['Jack Armstrong'],    odds:['-800','+600']},
  {id:'r3_b2',lb:'Singles B2',c:'pb',j:['Matt Young'],      o:['PJ Tecco'],          odds:['+170','-190']},
  {id:'r3_b3',lb:'Singles B3',c:'pb',j:['Danny Sullivan'],  o:['Danny Roe'],         odds:['+275','-300']},
  {id:'r3_b4',lb:'Singles B4',c:'pb',j:['Ryan George'],     o:['Jason Kuzmick'],     odds:['-150','+135']},
  {id:'r3_b5',lb:'Singles B5',c:'pb',j:['Jerry Smyth'],     o:['Patrick Rymal'],     odds:['-500','+475']},
  {id:'r3_b6',lb:'Singles B6',c:'pb',j:['Shaun Jones'],     o:['Kevin Egan'],        odds:['-250','+225']},
  {id:'r3_b7',lb:'Singles B7',c:'pb',j:['Mike Levy'],       o:['Bobby Castaldi'],    odds:['N/A','N/A']},
  {id:'r3_b8',lb:'Singles B8',c:'pb',j:['Cillian Gilson'],  o:['Jack Davin'],        odds:['-110','-110']},
  {id:'r3_c1',lb:'Singles C1',c:'pb',j:['Casey Gilroy'],    o:['Brendan Ahearn'],    odds:['+110','-130']},
  {id:'r3_c2',lb:'Singles C2',c:'pb',j:['Jack Carpenter'],  o:['Joe Carpenter'],     odds:['+405','-420']},
  {id:'r3_c3',lb:'Singles C3',c:'pb',j:['Brian Stratton'],  o:['Danny Smyth'],       odds:['-500','+485']},
  {id:'r3_c4',lb:'Singles C4',c:'pb',j:['Aidan McNulty'],   o:['George Doemling'],   odds:['+145','-160']},
  {id:'r3_c5',lb:'Singles C5',c:'pb',j:['PJ Murphy'],       o:['Fynn McNulty'],      odds:['-110','-110']},
  {id:'r3_c6',lb:'Singles C6',c:'pb',j:['Chris Anderson'],  o:['Rob Macoy'],         odds:['-400','+385']},
  {id:'r3_c7',lb:'Singles C7',c:'pb',j:['Jack Thornton'],   o:['Jack Wert'],         odds:['+225','-235']},
  {id:'r3_c8',lb:'Singles C8',c:'pb',j:['Liam Sullivan'],   o:['Noah Gizienski'],    odds:['-215','+200']},
  {id:'r3_d1',lb:'Singles D1',c:'pb',j:['Brian Ward'],      o:['Drew Rhoton'],       odds:['-170','+160']},
  {id:'r3_d2',lb:'Singles D2',c:'pb',j:['John Seidman'],    o:['Matt Gillen'],       odds:['+165','-180']},
  {id:'r3_d3',lb:'Singles D3',c:'pb',j:['Austin Serra'],    o:['Ryan Buckton'],      odds:['-355','+340']},
  {id:'r3_d4',lb:'Singles D4',c:'pb',j:['Tanner Robinson'], o:['Ben Murphy'],        odds:['+135','-150']},
  {id:'r3_d5',lb:'Singles D5',c:'pb',j:['Aidan Reed'],      o:['John Rufo'],         odds:['-2000','+1800']},
  {id:'r3_d6',lb:'Singles D6',c:'pb',j:['Declan Donaher'],  o:['Will Higson'],       odds:['+285','-300']},
  {id:'r3_d7',lb:'Singles D7',c:'pb',j:['Conor Maloney'],   o:['Tom Wertz'],         odds:['-220','+205']},
  {id:'r3_d8',lb:'Singles D8',c:'pb',j:['Nick Donegan'],    o:['Jake Ruane'],        odds:['+165','-175']},
];

export const ALL = [...R1, ...R2, ...R3];
