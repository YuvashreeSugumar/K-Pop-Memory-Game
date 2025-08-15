const IMG_DIR = 'images/';
const IMG_FILES = [
  'card1.png','card2.png','card3.png','card4.png','card5.png','card6.png',
  'card7.png','card8.png','card9.png','card10.png','card11.png','card12.png'
];

let deck = [...IMG_FILES, ...IMG_FILES]; // 24 cards
const board = document.getElementById('game-board');
const timeEl = document.getElementById('time');
const matchesEl = document.getElementById('matches');
const streakEl = document.getElementById('streak');
let flipped = [];
let lock = false;
let matches = 0;
let streak = 0;
let startTime = 0;
let timerId = null;

function shuffle(a){ for(let i=a.length-1;i>0;i--){ const j = Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }

function buildCard(src){
  const card = document.createElement('div');
  card.className = 'card';
  const inner = document.createElement('div');
  inner.className = 'card-inner';
  const front = document.createElement('div');
  front.className = 'front';
  const img = document.createElement('img');
  img.loading = 'lazy';
  img.src = IMG_DIR + src;
  front.appendChild(img);
  const back = document.createElement('div');
  back.className = 'back';
  back.textContent = 'K‑POP';
  inner.appendChild(front);
  inner.appendChild(back);
  card.appendChild(inner);
  card.addEventListener('click', () => onFlip(card, src));
  return card;
}

function draw(){
  board.innerHTML = '';
  shuffle(deck).forEach(src => board.appendChild(buildCard(src)));
}

function startTimer(){
  startTime = performance.now();
  timerId = requestAnimationFrame(tick);
}

function tick(now){
  const t = ((now - startTime)/1000).toFixed(1);
  timeEl.textContent = t;
  timerId = requestAnimationFrame(tick);
}

function onFlip(card, src){
  if(lock || card.classList.contains('flipped')) return;
  if(!timerId) startTimer();
  card.classList.add('flipped');
  flipped.push({card, src});
  if(flipped.length === 2){
    lock = true;
    setTimeout(checkMatch, 450);
  }
}

function checkMatch(){
  const [a,b] = flipped;
  if(a.src === b.src){
    matches++; streak++;
    matchesEl.textContent = matches;
    streakEl.textContent = streak;
    // keep matched cards flipped & disable clicks
    a.card.style.pointerEvents = 'none';
    b.card.style.pointerEvents = 'none';
    // subtle celebration
    a.card.style.boxShadow = '0 0 0 3px #7bd88f inset';
    b.card.style.boxShadow = '0 0 0 3px #7bd88f inset';
  }else{
    streak = 0; streakEl.textContent = 0;
    a.card.classList.remove('flipped');
    b.card.classList.remove('flipped');
  }
  flipped = [];
  lock = false;
  if(matches === IMG_FILES.length){
    cancelAnimationFrame(timerId);
    setTimeout(()=>alert('You win! Time: '+timeEl.textContent+'s'), 200);
  }
}

function reset(){
  matches = 0; streak = 0;
  matchesEl.textContent = 0; streakEl.textContent = 0;
  flipped = []; lock = false;
  deck = [...IMG_FILES, ...IMG_FILES];
  cancelAnimationFrame(timerId); timerId = null; timeEl.textContent = '0.0';
  draw();
}

document.getElementById('resetBtn').addEventListener('click', reset);
window.addEventListener('load', reset);
