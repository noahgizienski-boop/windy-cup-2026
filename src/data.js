// ─── COURSE DATA ─────────────────────────────────────────────────────────────
export const AMBASSADOR = {
  name: 'Ambassador Course',
  par:      [4,5,3,4,4,3,5,4,4, 4,3,5,4,4,3,4,5,4],
  handicap: [7,1,17,11,5,15,3,13,9, 8,16,2,12,6,18,10,4,14],
  yards:    [395,555,175,415,385,165,530,360,395, 390,155,545,375,405,135,385,520,385],
  holeNums: Array.from({length:18},(_,i)=>i+1),
  holes: 18,
};

export const PRES_FRONT = {
  name: 'Presidential Course',
  par:      [4,4,3,5,4,3,4,4,5],
  handicap: [5,9,17,1,13,15,7,11,3],
  yards:    [410,380,160,540,395,145,420,370,510],
  holeNums: [1,2,3,4,5,6,7,8,9],
  holes: 9,
};

export const PRES_BACK = {
  name: 'Presidential Course',
  par:      [4,3,5,4,4,3,4,5,4],
  handicap: [6,18,2,10,4,16,12,8,14],
  yards:    [400,140,560,380,415,155,395,530,395],
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

// ─── ROUND 1: 2-Man Scramble — Ambassador, 18 holes ─────────────────────────
// Each row = Jack pair vs Joe pair (read horizontally across spreadsheet)
export const R1 = [
  // A&D flights
  {id:'r1_1', lb:'Scramble 1',  c:'amb', j:['Timmy Gallagher','Aidan Reed'],       o:['Kevin Deprince','Ryan Buckton']},
  {id:'r1_2', lb:'Scramble 2',  c:'amb', j:['Brendan George','Austin Serra'],      o:['Kane Gallagher','Drew Rhoton']},
  {id:'r1_3', lb:'Scramble 3',  c:'amb', j:['Andrew Damico','John Seidman'],       o:['Brendan Farrell','Matt Gillen']},
  {id:'r1_4', lb:'Scramble 4',  c:'amb', j:['Sean Leyden','Tanner Robinson'],      o:['JT Smyth','Jake Ruane']},
  {id:'r1_5', lb:'Scramble 5',  c:'amb', j:['Pat Gallagher','Brian Ward'],         o:['Brendan McGroary','Tom Wertz']},
  {id:'r1_6', lb:'Scramble 6',  c:'amb', j:['Greg Damico','Declan Donaher'],       o:['Ryan Odgers','Will Higson']},
  {id:'r1_7', lb:'Scramble 7',  c:'amb', j:['JD Doemling','Nick Donegan'],         o:['Gerard Sweeney','John Rufo']},
  {id:'r1_8', lb:'Scramble 8',  c:'amb', j:['Colin McCormick','Connor Maloney'],   o:['Conor Gallagher','Ben Murphy']},
  // B&C flights
  {id:'r1_9', lb:'Scramble 9',  c:'amb', j:['Cillian Gilson','Chris Anderson'],    o:['Kevin Egan','Brendan Ahearn']},
  {id:'r1_10',lb:'Scramble 10', c:'amb', j:['Ryan George','Liam Sullivan'],        o:['PJ Tecco','Jack Wert']},
  {id:'r1_11',lb:'Scramble 11', c:'amb', j:['Shaun Jones','Jack Thornton'],        o:['Danny Roe','Noah Gizienski']},
  {id:'r1_12',lb:'Scramble 12', c:'amb', j:['Sean Donohue','Brian Stratton'],      o:['Bobby Castaldi','George Doemling']},
  {id:'r1_13',lb:'Scramble 13', c:'amb', j:['Matt Young','Brian Young'],           o:['Pat Rymal','Rob Macoy']},
  {id:'r1_14',lb:'Scramble 14', c:'amb', j:['Jerry Smyth','Jack Carpenter'],       o:['Jason Kuzmick','Danny Smyth']},
  {id:'r1_15',lb:'Scramble 15', c:'amb', j:['Mike Levy','Casey Gilroy'],           o:['Jack Armstrong','Fynn McNulty']},
  {id:'r1_16',lb:'Scramble 16', c:'amb', j:['Danny Sullivan','Tim Brown'],         o:['Jack Davin','Joe Carpenter']},
];

// ─── ROUND 2: 2-Man Best Ball — Presidential Front 9 ────────────────────────
export const R2 = [
  // A&C flights
  {id:'r2_1', lb:'Best Ball 1',  c:'pf', j:['Andrew Damico','Casey Gilroy'],      o:['Kane Gallagher','Brendan Ahearn']},
  {id:'r2_2', lb:'Best Ball 2',  c:'pf', j:['Timmy Gallagher','Jack Carpenter'],  o:['Brendan McGroary','Joe Carpenter']},
  {id:'r2_3', lb:'Best Ball 3',  c:'pf', j:['Sean Leyden','Brian Stratton'],      o:['Kevin DePrince','Danny Smyth']},
  {id:'r2_4', lb:'Best Ball 4',  c:'pf', j:['JD Doemling','Brian Young'],         o:['JT Smyth','George Doemling']},
  {id:'r2_5', lb:'Best Ball 5',  c:'pf', j:['Greg Damico','Tim Brown'],           o:['Ryan Odgers','Fynn McNulty']},
  {id:'r2_6', lb:'Best Ball 6',  c:'pf', j:['Colin McCormick','Chris Anderson'],  o:['Gerard Sweeney','Rob Macoy']},
  {id:'r2_7', lb:'Best Ball 7',  c:'pf', j:['Pat Gallagher','Jack Thornton'],     o:['Conor Gallagher','Jack Wert']},
  {id:'r2_8', lb:'Best Ball 8',  c:'pf', j:['Brendan George','Liam Sullivan'],    o:['Brendan Farrell','Noah Gizienski']},
  // B&D flights
  {id:'r2_9', lb:'Best Ball 9',  c:'pf', j:['Sean Donohue','Brian Ward'],         o:['Jack Armstrong','Drew Rhoton']},
  {id:'r2_10',lb:'Best Ball 10', c:'pf', j:['Matt Young','John Seidman'],         o:['PJ Tecco','Matt Gillen']},
  {id:'r2_11',lb:'Best Ball 11', c:'pf', j:['Danny Sullivan','Austin Serra'],     o:['Danny Roe','Ryan Buckton']},
  {id:'r2_12',lb:'Best Ball 12', c:'pf', j:['Ryan George','Tanner Robinson'],     o:['Jason Kuzmick','Ben Murphy']},
  {id:'r2_13',lb:'Best Ball 13', c:'pf', j:['Jerry Smyth','Aidan Reed'],          o:['Patrick Rymal','John Rufo']},
  {id:'r2_14',lb:'Best Ball 14', c:'pf', j:['Shaun Jones','Declan Donaher'],      o:['Kevin Egan','Will Higson']},
  {id:'r2_15',lb:'Best Ball 15', c:'pf', j:['Cole Humes','Conor Maloney'],        o:['Bobby Castaldi','Tom Wertz']},
  {id:'r2_16',lb:'Best Ball 16', c:'pf', j:['Cillian Gilson','Nick Donegan'],     o:['Jack Davin','Jake Ruane']},
];

// ─── ROUND 3: Singles — Presidential Back 9 ─────────────────────────────────
// odds: [jackOdds, joeOdds] — American format from spreadsheet
export const R3 = [
  // Flight A
  {id:'r3_a1',lb:'Singles A1',c:'pb',j:['Andrew Damico'],   o:['Kane Gallagher'],    odds:['-110','-110']},
  {id:'r3_a2',lb:'Singles A2',c:'pb',j:['Timmy Gallagher'], o:['Brendan McGroary'],  odds:['-155','+135']},
  {id:'r3_a3',lb:'Singles A3',c:'pb',j:['Sean Leyden'],     o:['Kevin DePrince'],    odds:['+140','-160']},
  {id:'r3_a4',lb:'Singles A4',c:'pb',j:['JD Doemling'],     o:['JT Smyth'],          odds:['-125','+105']},
  {id:'r3_a5',lb:'Singles A5',c:'pb',j:['Greg Damico'],     o:['Ryan Odgers'],       odds:['-200','+180']},
  {id:'r3_a6',lb:'Singles A6',c:'pb',j:['Colin McCormick'], o:['Gerard Sweeney'],    odds:['+130','-150']},
  {id:'r3_a7',lb:'Singles A7',c:'pb',j:['Pat Gallagher'],   o:['Conor Gallagher'],   odds:['-130','EVEN']},
  {id:'r3_a8',lb:'Singles A8',c:'pb',j:['Brendan George'],  o:['Brendan Farrell'],   odds:['+145','-170']},
  // Flight B
  {id:'r3_b1',lb:'Singles B1',c:'pb',j:['Sean Donohue'],    o:['Jack Armstrong'],    odds:['-800','+600']},
  {id:'r3_b2',lb:'Singles B2',c:'pb',j:['Matt Young'],      o:['PJ Tecco'],          odds:['+170','-190']},
  {id:'r3_b3',lb:'Singles B3',c:'pb',j:['Danny Sullivan'],  o:['Danny Roe'],         odds:['+275','-300']},
  {id:'r3_b4',lb:'Singles B4',c:'pb',j:['Ryan George'],     o:['Jason Kuzmick'],     odds:['-150','+135']},
  {id:'r3_b5',lb:'Singles B5',c:'pb',j:['Jerry Smyth'],     o:['Patrick Rymal'],     odds:['-500','+475']},
  {id:'r3_b6',lb:'Singles B6',c:'pb',j:['Shaun Jones'],     o:['Kevin Egan'],        odds:['-250','+225']},
  {id:'r3_b7',lb:'Singles B7',c:'pb',j:['Mike Levy'],       o:['Bobby Castaldi'],    odds:['N/A','N/A']},
  {id:'r3_b8',lb:'Singles B8',c:'pb',j:['Cillian Gilson'],  o:['Jack Davin'],        odds:['-110','-110']},
  // Flight C
  {id:'r3_c1',lb:'Singles C1',c:'pb',j:['Casey Gilroy'],    o:['Brendan Ahearn'],    odds:['+110','-130']},
  {id:'r3_c2',lb:'Singles C2',c:'pb',j:['Jack Carpenter'],  o:['Joe Carpenter'],     odds:['+405','-420']},
  {id:'r3_c3',lb:'Singles C3',c:'pb',j:['Brian Stratton'],  o:['Danny Smyth'],       odds:['-500','+485']},
  {id:'r3_c4',lb:'Singles C4',c:'pb',j:['Brian Young'],     o:['George Doemling'],   odds:['+145','-160']},
  {id:'r3_c5',lb:'Singles C5',c:'pb',j:['Tim Brown'],       o:['Fynn McNulty'],      odds:['-110','-110']},
  {id:'r3_c6',lb:'Singles C6',c:'pb',j:['Chris Anderson'],  o:['Rob Macoy'],         odds:['-400','+385']},
  {id:'r3_c7',lb:'Singles C7',c:'pb',j:['Jack Thornton'],   o:['Jack Wert'],         odds:['+225','-235']},
  {id:'r3_c8',lb:'Singles C8',c:'pb',j:['Liam Sullivan'],   o:['Noah Gizienski'],    odds:['-215','+200']},
  // Flight D
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
