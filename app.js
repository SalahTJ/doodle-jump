/* Константы, настройки, начальное состояние игры и справочные данные (скины, биомы, задания).
   Подключается обычным <script> по порядку из index.html: общая глобальная область видимости. */
const $=s=>document.querySelector(s),cv=$('#c'),ctx=cv.getContext('2d'),W=360,H=640;let DPR=Math.min(window.devicePixelRatio||1,2);
cv.width=W*DPR;cv.height=H*DPR;let rdt=1;
let S={lang:'auto',ctrl:'touch',sens:5,theme:'auto',sound:'on',color:0,diff:'normal',fire:'btn',vib:'on',music:'on',coins:0,owned:[0]};
try{Object.assign(S,JSON.parse(localStorage.getItem('dj_s')||'{}'))}catch(e){}
let best=0;try{best=+localStorage.getItem('dj_best')||0}catch(e){}
const save=()=>{try{localStorage.setItem('dj_s',JSON.stringify(S))}catch(e){}};
const COLORS=[['#8de86a','#3fa02b'],['#ffb366','#e07b2a'],['#c3cbd9','#7d8ba3'],['#ffffff','#c9d3ff'],['#4a5470','#1c2233'],['#ffffff','#9fb4d8'],['#ff8a65','#c2412a'],['#ffe6f7','#c79bff']];
const PRICE=[0,10,25,45,70,100,130,160],ICON=['🐥','🐱','🤖','👻','🐧','👨‍🚀','🐲','🦄'],NAMES=['Птенец','Кот','Робот','Призрак','Пингвин','Космонавт','Дракон','Единорог'],OLD=['Зелёный','Розовый','Синий','Золотой','Фиолетовый','Ниндзя','Космонавт','Король'];
const HINT={touch:'Держи левую или правую половину экрана',drag:'Двигай пальцем: персонаж едет за ним',tilt:'Наклоняй телефон влево и вправо'};
let hgt=0,boss=null,bossLvl=-1,ebs=[],shake=0,ammo=0,mid=null,bul=[],cool=0,mons=[],items=[],jet=0,sh=0,lvl=0,banner=null,frame=0,col={},P,plats,parts=[],bubbles=[],score=0,state='menu',dir=0,fx=null,tilt=0,keys={},ac=null;
for(let i=0;i<14;i++)bubbles.push({x:Math.random()*W,y:Math.random()*H,r:6+Math.random()*26,z:.15+Math.random()*.4});
const FINE=matchMedia('(hover:hover) and (pointer:fine)').matches,RM=matchMedia('(prefers-reduced-motion:reduce)');
const GAP={easy:.85,normal:1,hard:1.15};
const BIO=[{n:'Весна',tint:'#7be0a0',a:.18,g:.42,w:0,gap:1},{n:'Лето',tint:'#ffd54a',a:.22,g:.42,w:0,gap:1.05},{n:'Осень',tint:'#e8742a',a:.3,g:.42,w:.9,gap:1},{n:'Зима',tint:'#cfe8ff',a:.4,g:.36,w:0,gap:1.1},{n:'Ночь',tint:'#1b1f4a',a:.38,g:.42,w:0,gap:1.05}];const OLDB=[{n:'Луг',tint:'#000',a:0,g:.42,w:0,gap:1},{n:'Облака',tint:'#ffffff',a:.35,g:.42,w:.9,gap:1.05},{n:'Космос',tint:'#120a40',a:.6,g:.3,w:0,gap:1.3}];
const PC=[['#8de86a','#3fa02b'],['#c2e24f','#6fa01f'],['#f0a24a','#b8601f'],['#eef7ff','#9bc4e8'],['#b8c4ff','#6a76c9']];const B=()=>BIO[lvl%BIO.length];
const QP=[['Убей 5 монстров','kills',5,5],['Собери 30 монет','coins',30,6],['Победи босса','bosses',1,15],['Сделай 20 выстрелов','shots',20,4],['Набери 3000 очков','score',3000,8],['Сыграй 3 игры','games',3,5],['Выиграй гонку','wins',1,10]];
const AC=[['Первые шаги','games',1],['Охотник','kills',50],['Богач','coins',200],['Убийца боссов','bosses',3],['Снайпер','shots',200],['Рекордсмен','best',5000],['Победитель','wins',3],['Ветеран','games',25]];
const BOSS=['🐛','🐝','🦔','⛄','🦇'];

/* Перевод интерфейса: русский и английский. Язык хранится в S.lang: auto | ru | en
   (auto: русский для русских, украинских, белорусских и казахских браузеров, иначе английский).
   Весь код игры написан по-русски; в английском режиме тексты переводятся на лету:
   статические и динамические узлы DOM (через MutationObserver), подписи на canvas (через T()), prompt и confirm.
   Как добавить текст: впишите русскую строку в EX (целиком) или в PT (фрагмент) с английским переводом.
   Подключается обычным <script> по порядку из index.html: общая глобальная область видимости. */
const EN=S.lang==='en'||(S.lang!=='ru'&&!/^(ru|uk|be|kk)/i.test(navigator.language||''));
const LOC=EN?'en-US':'ru-RU';
/* EX: строка целиком (после обрезки пробелов) */
const EX={
'Для игры нужен включённый JavaScript.':'JavaScript must be enabled to play.',
'Прыгай как можно выше':'Jump as high as you can','рекорд':'best','монет':'coins','Играть':'Play',
'👥 Играть с другом':'👥 Play with a friend','🏅 Задания и достижения':'🏅 Quests & achievements','🏆 Таблица лидеров':'🏆 Leaderboard',
'Магазин скинов':'Skin shop','Настройки':'Settings','📲 Установить игру':'📲 Install game',
'← → или A D — движение · Пробел — выстрел · P — пауза':'← → or A D to move · Space to shoot · P to pause',
'Управление':'Controls','Касание':'Touch','Палец':'Finger','Наклон':'Tilt','Чувствительность':'Sensitivity',
'Сложность':'Difficulty','Лёгкая':'Easy','Средняя':'Medium','Сложная':'Hard','Стрельба':'Shooting','Кнопка 💥':'Button 💥',
'Авто':'Auto','Вибрация':'Vibration','Вкл':'On','Выкл':'Off','Музыка':'Music','Тема':'Theme','Светлая':'Light','Тёмная':'Dark',
'Звук':'Sound','Персонаж':'Character','Язык':'Language','Прогресс':'Progress','Сохранить в файл':'Save to file','Загрузить из файла':'Load from file',
'Готово':'Done','· монеты собирай в игре':'· collect coins in the game','Назад':'Back','Задания дня':'Daily quests','Достижения':'Achievements',
'Статистика':'Statistics','Игра с другом':'Play with a friend','Создать комнату':'Create room','Войти по коду':'Join by code',
'Начать гонку':'Start race','Как играть':'How to play','Понятно, играть!':'Got it, let’s play!','Таблица лидеров':'Leaderboard',
'Твоё имя':'Your name','Пауза':'Paused','Продолжить':'Resume','В меню':'Menu','Игра окончена':'Game over','очки':'points',
'Ещё раз':'Play again','📤 Поделиться результатом':'📤 Share result','Игровое поле Doodle Jump':'Doodle Jump game field','Огонь':'Fire','Имя':'Name',
'Игрок':'Player','Выбран':'Selected','Выбрать':'Select','Реванш':'Rematch','Ничья':'Draw',
'Птенец':'Chick','Кот':'Cat','Робот':'Robot','Призрак':'Ghost','Пингвин':'Penguin','Космонавт':'Astronaut','Дракон':'Dragon','Единорог':'Unicorn'
};
/* PT: фрагменты внутри строк (подставляются от самых длинных к коротким) */
const PT={
'Держи левую или правую половину экрана':'Hold the left or right half of the screen',
'Двигай пальцем: персонаж едет за ним':'Drag your finger: the character follows it',
'Наклоняй телефон влево и вправо':'Tilt your phone left and right',
'. Также: ← → или A D':'. Also: ← → or A D',
'Собирай монеты — за них открываются скины':'Collect coins to unlock skins',
'Стреляй по монстрам, когда есть патроны':'Shoot monsters when you have ammo',' (Пробел)':' (Space)',
'Не падай вниз и обходи монстров':'Don’t fall, and dodge the monsters',
'Создай комнату или введи код друга':'Create a room or enter your friend’s code',
'Весна':'Spring','Лето':'Summer','Осень':'Autumn','Зима':'Winter','Ночь':'Night',
'Убей 5 монстров':'Kill 5 monsters','Собери 30 монет':'Collect 30 coins','Победи босса':'Defeat a boss','Сделай 20 выстрелов':'Fire 20 shots',
'Набери 3000 очков':'Score 3000 points','Сыграй 3 игры':'Play 3 games','Выиграй гонку':'Win a race',
'Первые шаги':'First steps','Охотник':'Hunter','Богач':'Rich','Убийца боссов':'Boss slayer','Снайпер':'Sharpshooter',
'Рекордсмен':'Record holder','Победитель':'Winner','Ветеран':'Veteran',
'Лучший счёт':'Best score','Игр сыграно':'Games played','Монстров побеждено':'Monsters defeated','Боссов побеждено':'Bosses defeated',
'Монет собрано':'Coins collected','Выстрелов':'Shots fired','Побед в гонках':'Race wins','Задание выполнено! +':'Quest complete! +',
'Doodle Jump: прогресс':'Doodle Jump: progress','Файл готов ✓':'File ready ✓','Файл сохранён ✓':'File saved ✓',
'Это не файл прогресса Doodle Jump':'This is not a Doodle Jump progress file','Это не файл прогресса':'This is not a progress file',
'Файл повреждён':'File is damaged','Отменено':'Cancelled','Прогресс загружен ✓':'Progress loaded ✓',
'Заменить текущий прогресс (монеты, скины, статистику) данными из файла?':'Replace current progress (coins, skins, stats) with data from the file?',
'Файл слишком большой':'File is too large','Не удалось прочитать файл':'Could not read the file',
'Я набрал ':'I scored ',' очков в Doodle Jump! 🐥 Сможешь больше?':' points in Doodle Jump! 🐥 Can you beat that?',
'Скопировано ✓':'Copied ✓','Не удалось скопировать':'Could not copy',
'Уровень ':'Level ','🎉 Новый рекорд!':'🎉 New record!','Рекорд: ':'Best: ','⚠ Босс!':'⚠ Boss!','Босс побеждён! +10 🪙':'Boss defeated! +10 🪙',
'Датчик работает ✓':'Sensor works ✓',
'Датчик не отвечает. Внутри claude.ai он может быть заблокирован: открой игру из скачанного файла или выбери другой режим':'The sensor is not responding. Try another control mode or open the game in your browser',
'Загрузка…':'Loading…','Пока никого нет. Будь первым!':'Nobody here yet. Be the first!',
'Нет связи с таблицей. Проверь интернет':'Can’t reach the leaderboard. Check your connection',
'Сыграй хотя бы раз, чтобы отправить рекорд':'Play at least once to submit a record','Отправить рекорд':'Submit record',
'Новый рекорд! Как записать тебя в таблицу лидеров?\nЧтобы пропустить, нажми «Отмена».':'New record! What name should we put on the leaderboard?\nTo skip, press “Cancel”.',
'🎉 Новый рекорд! Он в таблице лидеров ✓':'🎉 New record! It’s on the leaderboard ✓',
'Введи имя (минимум 2 символа)':'Enter a name (at least 2 characters)','Отправляем…':'Sending…','Рекорд отправлен ✓':'Record sent ✓',
'Не удалось отправить':'Could not send','Нет связи. Попробуй позже':'No connection. Try again later',
'Ты: ':'You: ',' · друг ещё играет (':' · friend is still playing (','Ждём друга…':'Waiting for your friend…','🏆 Ты победил!':'🏆 You won!',
'Друг победил':'Your friend won',' · друг отключился':' · friend disconnected','Ждём хозяина…':'Waiting for the host…',
'Друг подключился! Жми «Начать гонку»':'Friend connected! Press “Start race”','Подключено! Ждём, пока хозяин начнёт':'Connected! Waiting for the host to start',
'Друг отключился':'Friend disconnected','Создаём комнату…':'Creating room…','Не удалось создать комнату':'Could not create the room',
'Скажи этот код другу и жди':'Tell this code to your friend and wait','Ошибка соединения: ':'Connection error: ',
'Нет связи с сервисом. Проверь интернет':'Can’t reach the service. Check your connection','Введи 4 цифры кода':'Enter the 4-digit code',
'Подключаемся…':'Connecting…','Не удалось подключиться. Проверь код':'Could not connect. Check the code','Не удалось подключиться':'Could not connect',
'Комната не найдена':'Room not found','Ур. ':'Lv ','Друг: ':'Friend: ','Цвет ':'Color ','Игра окончена. Очки: ':'Game over. Score: '
};
const PTK=Object.keys(PT).sort((a,b)=>b.length-a.length),CYR=/[А-Яа-яЁё]/,tcache=new Map();
function T(s){
 if(!EN||typeof s!=='string'||!CYR.test(s))return s;
 let r=tcache.get(s);if(r!==undefined)return r;
 const m=/^(\s*)([\s\S]*?)(\s*)$/.exec(s);r=EX[m[2]];
 if(r===undefined){r=m[2];for(const k of PTK)if(r.includes(k))r=r.split(k).join(PT[k])}
 r=m[1]+r+m[3];if(tcache.size>500)tcache.clear();tcache.set(s,r);return r}
if(EN){
 document.documentElement.lang='en';
 const AT=['aria-label','placeholder','title'];
 const skip=n=>{const e=n.nodeType===3?n.parentElement:n;return !!(e&&e.closest&&e.closest('#lbl .lbr,#lbname'))};   // имена игроков не переводим
 const tn=n=>{if(skip(n))return;const v=n.nodeValue;if(CYR.test(v)){const t=T(v);if(t!==v)n.nodeValue=t}};
 const te=e=>{for(const a of AT){const v=e.getAttribute&&e.getAttribute(a);if(v&&CYR.test(v)){const t=T(v);if(t!==v)e.setAttribute(a,t)}}};
 const walk=n=>{if(n.nodeType===3){tn(n);return}if(n.nodeType!==1||n.tagName==='SCRIPT'||n.tagName==='STYLE')return;te(n);n.childNodes.forEach(walk)};
 walk(document.body);
 const md=document.querySelector('meta[name=description]');if(md)md.content='Doodle Jump: jump as high as you can. Monsters, bosses, changing seasons, skins and races with a friend. Works offline.';
 new MutationObserver(ms=>{for(const m of ms){if(m.type==='characterData')tn(m.target);else if(m.type==='attributes')te(m.target);else m.addedNodes.forEach(walk)}})
  .observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:AT});
 const _p=window.prompt.bind(window),_c=window.confirm.bind(window);window.prompt=(m,d)=>_p(T(m),d);window.confirm=m=>_c(T(m));
}
/* смена языка в настройках применяется перезагрузкой страницы */
document.querySelectorAll('.seg[data-k=lang] button').forEach(b=>b.addEventListener('click',()=>setTimeout(()=>location.reload(),200)));

/* Звук, вибрация и фоновая музыка.
   Подключается обычным <script> по порядку из index.html: общая глобальная область видимости. */
function snd(f,d,t,v){if(S.sound!=='on')return;try{ac=ac||new (window.AudioContext||window.webkitAudioContext)();if(ac.state==='suspended')ac.resume();const o=ac.createOscillator(),g=ac.createGain();o.type=t||'sine';o.frequency.setValueAtTime(f,ac.currentTime);o.frequency.exponentialRampToValueAtTime(f*1.8,ac.currentTime+d);g.gain.setValueAtTime(v||.07,ac.currentTime);g.gain.exponentialRampToValueAtTime(.001,ac.currentTime+d);o.connect(g).connect(ac.destination);o.start();o.stop(ac.currentTime+d)}catch(e){}}
function vib(p){if(S.vib==='on'&&navigator.vibrate)try{navigator.vibrate(p)}catch(e){}}
function tone(f,d,t,v){if(S.sound!=='on')return;try{ac=ac||new (window.AudioContext||window.webkitAudioContext)();if(ac.state==='suspended')ac.resume();const o=ac.createOscillator(),g=ac.createGain();o.type=t;o.frequency.value=f;g.gain.setValueAtTime(v,ac.currentTime);g.gain.exponentialRampToValueAtTime(.001,ac.currentTime+d);o.connect(g).connect(ac.destination);o.start();o.stop(ac.currentTime+d)}catch(e){}}
const SC=[[0,2,4,7,9],[0,2,4,7,9],[0,3,5,7,10],[0,2,7,9,12],[0,2,3,7,8]],PAT=[0,2,4,2,5,4,2,1];let ms=0;
setInterval(()=>{if(S.music!=='on'||state!=='play')return;const sc=SC[lvl%SC.length],i=PAT[ms++%PAT.length],n=sc[i%5]+(i>4?12:0)+[0,2,-3,5,-1][lvl%5];tone(261.6*Math.pow(2,n/12),.3,'triangle',.035);if(ms%4===0)tone(130.8*Math.pow(2,sc[0]/12),.5,'sine',.04)},240);

/* Ввод: клавиатура, касания, датчик наклона, кнопка стрельбы.
   Подключается обычным <script> по порядку из index.html: общая глобальная область видимости. */
const isIOS=/iP(hone|ad|od)/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
let tiltOk=false,tiltSrc='';
function tiltHint(){if(S.ctrl==='tilt')$('#chint').textContent=tiltOk?'Датчик работает ✓':'Датчик не отвечает. Внутри claude.ai он может быть заблокирован: открой игру из скачанного файла или выбери другой режим'}
function setT(v,src){if(tiltOk&&tiltSrc!==src)return;tilt=v;if(!tiltOk){tiltOk=true;tiltSrc=src;tiltHint()}}
function askTilt(){try{[window.DeviceOrientationEvent,window.DeviceMotionEvent].forEach(E=>{if(E&&E.requestPermission)E.requestPermission().catch(()=>{})})}catch(e){}}
addEventListener('deviceorientation',e=>{if(e.gamma!=null)setT(e.gamma,'o')});
addEventListener('devicemotion',e=>{const a=e.accelerationIncludingGravity;if(a&&a.x!=null&&!(tiltOk&&tiltSrc==='o'))setT((isIOS?1:-1)*a.x/9.8*45,'m')});
function cx(e){const r=cv.getBoundingClientRect();return(e.clientX-r.left)/r.width*W}
cv.addEventListener('pointerdown',e=>{mid=e.pointerId;fx=cx(e);dir=fx<W/2?-1:1});
cv.addEventListener('pointermove',e=>{if(fx!==null&&e.pointerId===mid){fx=cx(e);dir=fx<W/2?-1:1}});
['pointerup','pointercancel'].forEach(n=>addEventListener(n,e=>{if(e.pointerId===mid){fx=null;dir=0}}));
addEventListener('keydown',e=>{const k=e.key.toLowerCase();keys[k]=1;if(k==='escape'||k==='p')pause();if(k==='arrowup'||k==='w'||k===' ')fire();if(k==='escape'&&$('#help').classList.contains('show'))show('menu');
 if((k==='enter'||k===' ')&&!/^(BUTTON|INPUT)$/.test(e.target.tagName)){if(state==='over'&&!net.race&&$('#over').classList.contains('show'))start();else if(state==='menu'&&$('#menu').classList.contains('show'))go()}});
addEventListener('keyup',e=>keys[e.key.toLowerCase()]=0);
$('#fire').addEventListener('pointerdown',e=>{e.preventDefault();fire()});

/* Гонка с другом по PeerJS: комнаты, обмен счётом, общий генератор случайных чисел.
   Подключается обычным <script> по порядку из index.html: общая глобальная область видимости. */
function mul(a){return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function gen(f){if(!net.race||!net.rng)return f();const R=Math.random;Math.random=net.rng;try{f()}finally{Math.random=R}}
const net={race:false,on:false,peer:null,conn:null,host:false,opp:0,oppDead:false,me:false,t0:0,last:0};
function ns(t){$('#nst').textContent=t}
function nsend(m){try{if(net.conn&&net.conn.open)net.conn.send(m)}catch(e){}}
function netReset(){try{if(net.conn)net.conn.close();if(net.peer)net.peer.destroy()}catch(e){}net.on=false;net.peer=net.conn=null;net.opp=0;net.oppDead=false;$('#ngo').style.display='none';$('#nbox').textContent=''}
function raceStart(seed){net.cnt=0;net.race=true;net.rng=mul(seed||1);net.me=false;net.opp=0;net.oppDead=false;net.t0=performance.now();net.last=0;start()}
function res(){if(!net.race||state!=='over'||!net.me)return;const fb=$('#fb'),ag=$('#again');
 if(!net.oppDead&&net.on){fb.textContent='Ты: '+score+' · друг ещё играет ('+net.opp+')…';ag.textContent='Ждём друга…';ag.disabled=true;return}
 if(score>net.opp&&!net.cnt){net.cnt=1;ev('wins')}fb.textContent=(score>net.opp?'🏆 Ты победил!':score<net.opp?'Друг победил':'Ничья')+' ('+score+' : '+net.opp+')'+(net.on?'':' · друг отключился');
 ag.textContent=net.host?'Реванш':'Ждём хозяина…';ag.disabled=!net.host||!net.on}
function wire(c){net.conn=c;c.on('open',()=>{net.on=true;ns(net.host?'Друг подключился! Жми «Начать гонку»':'Подключено! Ждём, пока хозяин начнёт');if(net.host)$('#ngo').style.display='block'});
 c.on('data',m=>{if(m.t==='go')raceStart(m.seed);else if(m.t==='s'){net.opp=m.v;res()}else if(m.t==='f'){net.opp=m.v;net.oppDead=true;res()}});
 c.on('close',()=>{if(net.on){net.on=false;ns('Друг отключился');res()}})}
function makeRoom(){const code=String(1000+Math.floor(Math.random()*9000));ns('Создаём комнату…');let p;try{p=new Peer('djump-race-'+code)}catch(x){ns('Не удалось создать комнату');return}net.peer=p;
 p.on('open',()=>{$('#nbox').innerHTML="<div class='big' style='letter-spacing:8px'>"+code+'</div>';ns('Скажи этот код другу и жди')});
 p.on('connection',c=>{if(!net.conn)wire(c)});
 p.on('error',e=>{if(e.type==='unavailable-id'){try{p.destroy()}catch(x){}makeRoom()}else ns('Ошибка соединения: '+e.type)})}
$('#ncreate').onclick=()=>{netReset();if(!window.Peer){ns('Нет связи с сервисом. Проверь интернет');return}net.host=true;makeRoom()};
$('#njoin').onclick=()=>{const code=$('#ncode').value.trim();if(code.length!==4){ns('Введи 4 цифры кода');return}netReset();if(!window.Peer){ns('Нет связи с сервисом. Проверь интернет');return}
 net.host=false;ns('Подключаемся…');let p;try{p=new Peer()}catch(x){ns('Не удалось подключиться');return}net.peer=p;
 p.on('open',()=>{wire(p.connect('djump-race-'+code,{reliable:true}));setTimeout(()=>{if(!net.on)ns('Не удалось подключиться. Проверь код')},8000)});
 p.on('error',e=>ns(e.type==='peer-unavailable'?'Комната не найдена':'Ошибка соединения: '+e.type))};
$('#ngo').onclick=()=>{if(net.on){const sd=Date.now()%1e9;nsend({t:'go',seed:sd});raceStart(sd)}};
$('#nback').onclick=()=>{if(!net.race)netReset();show('menu')};

/* Ежедневные задания, достижения и статистика.
   Подключается обычным <script> по порядку из index.html: общая глобальная область видимости. */
function chk(){const d=new Date().toLocaleDateString('en-CA');S.st=Object.assign({kills:0,coins:0,bosses:0,games:0,shots:0,wins:0,best:0},S.st);if(S.dq&&S.dq.d===d)return;const h=[...d].reduce((a,c)=>(a*31+c.charCodeAt(0))|0,7),s=Math.abs(h)%7;S.dq={d,q:[s,(s+2)%7,(s+4)%7],p:[0,0,0],x:[0,0,0]};save()}
function qd(i){const q=QP[S.dq.q[i]];if(S.dq.p[i]>=q[2]){S.dq.x[i]=1;S.coins+=q[3];banner={t:150,s:'Задание выполнено! +'+q[3]+' 🪙'}}}
function ev(k,n){n=n||1;chk();const o=S.st[k]||0;S.st[k]=o+n;
 S.dq.q.forEach((q,i)=>{if(QP[q][1]===k&&!S.dq.x[i]){S.dq.p[i]+=n;qd(i)}});
 AC.forEach(a=>{if(a[1]===k&&o<a[2]&&S.st[k]>=a[2]){S.coins+=10;banner={t:150,s:'🏅 '+a[0]+' +10 🪙'}}});save()}
function evMax(v){chk();const o=S.st.best;if(v>o){S.st.best=v;AC.forEach(a=>{if(a[1]==='best'&&o<a[2]&&v>=a[2])S.coins+=10})}
 S.dq.q.forEach((q,i)=>{if(QP[q][1]==='score'&&!S.dq.x[i]){S.dq.p[i]=Math.max(S.dq.p[i],v);qd(i)}});save()}
function renderQ(){chk();const row=(t,p,g,ok)=>`<div class='qr${ok?' ok':''}'><span>${t}</span><b>${Math.min(p,g)}/${g}</b><div class='qb'><i style='width:${Math.min(100,p/g*100)}%'></i></div></div>`;
 $('#ql').innerHTML=S.dq.q.map((q,i)=>row(QP[q][0]+' (+'+QP[q][3]+' 🪙)',S.dq.p[i],QP[q][2],S.dq.x[i])).join('');
 $('#al').innerHTML=AC.map(a=>row(a[0],S.st[a[1]]||0,a[2],(S.st[a[1]]||0)>=a[2])).join('');
 const SL=[['Лучший счёт','best'],['Игр сыграно','games'],['Монстров побеждено','kills'],['Боссов побеждено','bosses'],['Монет собрано','coins'],['Выстрелов','shots'],['Побед в гонках','wins']];
 $('#stl').innerHTML=SL.map(x=>`<div class='qr'><span>${x[0]}</span><b style='font-size:14px;color:inherit'>${(S.st[x[1]]||0).toLocaleString(LOC)}</b></div>`).join('')}
$('#qback').onclick=()=>show('menu');

/* Магазин скинов.
   Подключается обычным <script> по порядку из index.html: общая глобальная область видимости. */
$('#sback').onclick=()=>show('menu');
function renderShop(){const g=$('#grid');g.innerHTML='';COLORS.forEach((c,i)=>{const own=S.owned.includes(i),b=document.createElement('button');b.className='sk'+(S.color===i?' on':'');
 b.innerHTML='<i style="background:linear-gradient(135deg,'+c[0]+','+c[1]+');display:grid;place-items:center;font-size:20px;font-style:normal">'+ICON[i]+'</i><span>'+NAMES[i]+'</span><em>'+(own?(S.color===i?'Выбран':'Выбрать'):'🪙 '+PRICE[i])+'</em>';
 b.onclick=()=>{if(own)S.color=i;else if(S.coins>=PRICE[i]){S.coins-=PRICE[i];S.owned.push(i);S.color=i;snd(600,.2,'triangle')}else{snd(150,.2,'square');return}save();renderShop()};g.appendChild(b)});$('#cn2').textContent=S.coins}

/* Игровая логика: старт, конец игры, шаг физики, генерация платформ, стрельба, частицы.
   Подключается обычным <script> по порядку из index.html: общая глобальная область видимости. */
function mk(y,easy){const t=Math.random(),h=Math.min(hgt/1500,1)*(DF()==='hard'?1.4:DF()==='easy'?.6:1);let type='n';
 if(!easy){if(t<.12+h*.12)type='m';else if(t<.26+h*.2)type=glv()%BIO.length===3?'c':'b';else if(glv()%BIO.length===3&&t>.7)type='c'}
 return{x:Math.random()*(W-70),y,w:70,type,dx:(1+Math.random()*1.4)*(Math.random()<.5?-1:1),dead:false,spring:!easy&&type==='n'&&Math.random()<.1}}
function start(){askTilt();score=0;hgt=0;ev('games');parts=[];bul=[];ammo=0;ub();boss=null;bossLvl=-1;ebs=[];cool=0;mons=[];items=[];jet=0;sh=0;lvl=0;banner={t:120,s:'Уровень 1: Весна'};P={x:W/2-18,y:H-120,vx:0,vy:-11,w:36,h:40,face:1};
 plats=[{x:W/2-35,y:H-60,w:70,type:'n',dx:0,dead:false,spring:false}];gen(()=>{for(let y=H-130;y>-H;y-=60)plats.push(mk(y,y>H-300))});
 state='play';show('')}
function end(){state='over';vib([80,40,120]);shake=8;evMax(score);snd(220,.5,'sawtooth',.06);const nb=score>best;if(nb){best=score;try{localStorage.setItem('dj_best',best)}catch(e){}}
 $('#fs').textContent=score;$('#fb').textContent=nb?'🎉 Новый рекорд!':'Рекорд: '+best;if(net.race){net.me=true;nsend({t:'f',v:score});res()}else{$('#again').textContent='Ещё раз';$('#again').disabled=false}show('over');if((nb||S.lbpend)&&!net.race)lbAuto(nb)}
function step(){
 const m=.6+S.sens*.14;let d=0;if(keys.arrowleft||keys.a)d=-1;if(keys.arrowright||keys.d)d=1;
 if(d){P.vx+=d*.9*m-P.vx*.12}
 else if(S.ctrl==='touch'){P.vx+=dir*.9*m-P.vx*.12}
 else if(S.ctrl==='drag'){if(fx!==null){P.vx=Math.max(-14,Math.min(14,(fx-P.w/2-P.x)*.22*m))}else P.vx*=.8}
 else if(!tiltOk){P.vx+=dir*.9*m-P.vx*.12}
 else{P.vx+=(Math.max(-1,Math.min(1,tilt/18))*7*m-P.vx)*.25}
 P.vx=Math.max(-14,Math.min(14,P.vx));if(Math.abs(P.vx)>.6)P.face=P.vx>0?1:-1;
 P.x+=P.vx;if(P.x<-P.w)P.x=W;if(P.x>W)P.x=-P.w;
 P.vy+=B().g;if(jet>0){jet--;P.vy=-13;parts.push({x:P.x+P.w/2+(Math.random()-.5)*8,y:P.y+P.h,vx:(Math.random()-.5)*1.5,vy:2+Math.random()*2,l:.9,c:'255,'+(120+Math.random()*100|0)+',40'})}P.y+=P.vy;P.x+=B().w*Math.sin(frame/80);frame++;if(P.sq>0)P.sq--;
 for(const p of plats){if(p.sa>0)p.sa--;if(p.sq>0)p.sq--;if(p.dead){p.fall+=.7;p.y+=p.fall}else if(p.type==='m'){p.x+=p.dx;if(p.x<0||p.x+p.w>W)p.dx*=-1}}
 if(P.vy>0)for(const p of plats){if(p.dead)continue;const px=P.x+P.w/2;
  if(px>p.x-6&&px<p.x+p.w+6&&P.y+P.h>=p.y&&P.y+P.h-P.vy<=p.y+4){
   if(p.type==='b'||p.type==='c'){p.dead=true;p.fall=0;spark(p.x+p.w/2,p.y,'200,170,120',8);snd(p.type==='c'?400:120,.2,p.type==='c'?'sine':'square',.05)}
   const sp=p.spring&&px>p.x+p.w/2-16&&px<p.x+p.w/2+16;P.vy=sp?-19:-11.5;p.sq=8;P.sq=10;if(sp){p.sa=14;shake=5;vib(30)}snd(sp?520:340,sp?.3:.15,'triangle');
   for(let i=0;i<(sp?14:6);i++)parts.push({x:px,y:p.y,vx:(Math.random()-.5)*4,vy:Math.random()*-2,l:1});break}}
 if(P.y<H*.4){const s=H*.4-P.y;P.y=H*.4;plats.forEach(p=>p.y+=s);mons.forEach(m=>m.y+=s);bul.forEach(b=>b.y+=s);ebs.forEach(e=>e.y+=s);items.forEach(i=>i.y+=s);bubbles.forEach(b=>{b.y+=s*b.z;if(b.y-b.r>H){b.y=-b.r;b.x=Math.random()*W}});score+=Math.round(s);hgt+=s}
 plats=plats.filter(p=>p.y<H+20);
 let top=Math.min(...plats.map(p=>p.y));const g=GAP[DF()];
 gen(()=>{while(top>-20){top-=(44+Math.random()*Math.min(38,16+hgt/200))*g*BIO[glv()%BIO.length].gap;const np=mk(top,false);plats.push(np);spawn(np)}});
 if(net.race){const now=performance.now();if(net.on&&now-net.last>250){net.last=now;nsend({t:'s',v:score})}if(now-net.t0>120000&&state==='play')end()}
 if(cool>0)cool--;if(S.fire==='auto')fire();bul.forEach(b=>b.y+=b.vy);bul=bul.filter(b=>b.y>-20);
 const L=Math.floor(hgt/2500);if(L!==lvl&&!boss){lvl=L;ebs=[];banner={t:140,s:'Уровень '+(L+1)+': '+B().n}}
 if(banner&&--banner.t<=0)banner=null;
 mons.forEach(m=>{if(m.dead){m.y+=6;return}bul.forEach(b=>{if(b.x>m.x&&b.x<m.x+m.w&&b.y>m.y&&b.y<m.y+m.h){m.dead=1;b.y=-99;score+=100;boom(m.x+m.w/2,m.y+m.h/2,'232,80,91',14);ev('kills');snd(260,.2,'square',.06)}});if(m.dead)return;m.x+=m.dx;if(m.x<0||m.x+m.w>W)m.dx*=-1;m.ph+=.1;
  if(P.x+P.w>m.x+4&&P.x<m.x+m.w-4&&P.y+P.h>m.y&&P.y<m.y+m.h){
   if(jet>0||P.vy>0&&P.y+P.h-P.vy<=m.y+12){m.dead=1;if(jet<=0)P.vy=-12;score+=100;boom(m.x+m.w/2,m.y+m.h/2,'232,80,91',14);ev('kills');snd(260,.2,'square',.06)}
   else if(sh){sh=0;m.dead=1;boom(P.x+P.w/2,P.y+P.h/2,'120,200,255',12);snd(180,.25,'sawtooth',.06)}
   else if(state==='play')end()}});
 mons=mons.filter(m=>m.y<H+40);
 items=items.filter(i=>{const dx=P.x+P.w/2-i.x,dy=P.y+P.h/2-i.y;if(dx*dx+dy*dy<900){if(i.t==='c'){score+=50;S.coins++;save();ev('coins');sp(i.x,i.y,'255,210,63',6);vib(8);snd(700,.12,'sine',.06)}else if(i.t==='a'){ammo=Math.min(ammo+5,15);ub();snd(800,.15,'triangle')}else if(i.t==='j'){jet=110;vib(40);snd(300,.4,'sawtooth',.05)}else{sh=1;snd(500,.25,'triangle')}return false}return i.y<H+30});
 if(bossLvl!==lvl&&hgt>=lvl*2500+1800){bossLvl=lvl;ammo=Math.min(ammo+8,15);ub();const hp=Math.min(6+lvl*2,24);boss={x:W/2-40,y:70,w:80,h:64,hp,max:hp,dx:1.6+lvl*.15,t:0,hit:0};banner={t:140,s:'⚠ Босс!'}}
 if(boss){boss.t++;boss.x+=boss.dx;if(boss.x<0||boss.x+boss.w>W)boss.dx*=-1;boss.y=70+Math.sin(boss.t/20)*12;if(boss.hit>0)boss.hit--;
  if(boss.t%70===0)ebs.push({x:boss.x+boss.w/2,y:boss.y+boss.h,vy:3.2+lvl*.12});
  bul.forEach(b=>{if(boss&&b.x>boss.x&&b.x<boss.x+boss.w&&b.y>boss.y&&b.y<boss.y+boss.h){b.y=-99;boss.hp--;boss.hit=6;sp(b.x,boss.y+boss.h,'255,200,80',5);snd(200,.1,'square',.05);
   if(boss.hp<=0){boom(boss.x+boss.w/2,boss.y+boss.h/2,'255,180,60',30);score+=500;S.coins+=10;save();ev('bosses');ebs=[];banner={t:160,s:'Босс побеждён! +10 🪙'};boss=null}}})}
 ebs.forEach(e=>{e.y+=e.vy;const dx=P.x+P.w/2-e.x,dy=P.y+P.h/2-e.y;if(dx*dx+dy*dy<400){const ex=e.x,ey=e.y;e.y=H+99;if(sh){sh=0;sp(ex,ey,'120,200,255',10)}else if(jet<=0&&state==='play')end()}});ebs=ebs.filter(e=>e.y<H+20);
 if(P.y>H+40&&state==='play')end()}
function sp(x,y,c,n){for(let i=0;i<n;i++)parts.push({x,y,vx:(Math.random()-.5)*8,vy:(Math.random()-.7)*7,l:1,c})}
const spark=(...a)=>sp(...a);
function boom(x,y,c,n){sp(x,y,c,n);shake=Math.max(shake,5);vib([40,30,40])}
const glv=()=>Math.floor(hgt/2500),DF=()=>net.race?'normal':S.diff;
function ub(){const f=$('#fire');f.textContent='💥'+(ammo>0?' '+ammo:'');f.style.opacity=ammo>0?1:.4}
function fire(){if(state!=='play'||cool>0||ammo<=0)return;ammo--;ub();ev('shots');bul.push({x:P.x+P.w/2,y:P.y,vy:-11});cool=16;snd(900,.08,'square',.04)}
function spawn(p){const r=Math.random(),cx=p.x+p.w/2;
 if(p.type==='n'&&!p.spring){if(r<.3)items.push({x:cx,y:p.y-24,t:'c'});else if(r<.33)items.push({x:cx,y:p.y-26,t:'j'});else if(r<.4)items.push({x:cx,y:p.y-26,t:'s'});else if(r<(boss?.7:.48))items.push({x:cx,y:p.y-26,t:'a'})}
 if(hgt>600&&Math.random()<.04+Math.min(glv(),6)*.025)mons.push({x:Math.random()*(W-40),y:p.y-60,w:38,h:30,dx:(Math.random()<.5?-1:1)*(.8+lvl*.2),dead:0,ph:Math.random()*6})}

/* Отрисовка на canvas: фон, платформы, персонаж, скины, монстры, боссы, интерфейс поверх игры.
   Подключается обычным <script> по порядку из index.html: общая глобальная область видимости. */
function rr(x,y,w,h,r){ctx.beginPath();ctx.roundRect(x,y,w,h,r)}
function draw(){ctx.setTransform(DPR,0,0,DPR,0,0);ctx.clearRect(0,0,W,H);if(RM.matches)shake=0;if(shake>.3){ctx.translate((Math.random()-.5)*shake,(Math.random()-.5)*shake);shake*=Math.pow(.85,rdt)}else shake=0;
 const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,col.sky1);g.addColorStop(1,col.sky2);ctx.fillStyle=g;ctx.fillRect(0,0,W,H);const bo=B();if(bo.a){ctx.globalAlpha=bo.a;ctx.fillStyle=bo.tint;ctx.fillRect(0,0,W,H);ctx.globalAlpha=1}
 const sn=lvl%BIO.length;ctx.fillStyle=['rgba(255,170,200,.6)','rgba(255,240,150,.22)','rgba(230,110,30,.6)','rgba(255,255,255,.85)','rgba(210,220,255,.8)'][sn];bubbles.forEach(b=>{const rm=RM.matches?.25:1;b.y+=(.35+b.z)*rdt*rm;b.x+=Math.sin(performance.now()/900+b.r)*.5*rdt*rm;if(b.y-b.r>H){b.y=-b.r;b.x=Math.random()*W}ctx.beginPath();if(sn===1)ctx.arc(b.x,b.y,b.r,0,7);else if(sn===3)ctx.arc(b.x,b.y,b.r*.2+1.5,0,7);else ctx.ellipse(b.x,b.y,b.r*.25+2,b.r*.12+1,performance.now()/1500+b.r,0,7);ctx.fill()});
 if(!plats)return;
 for(const p of plats){ctx.globalAlpha=p.dead?Math.max(0,1-p.fall/12):1;const c=p.type==='n'?PC[lvl%BIO.length]:p.type==='m'?['#7cc4ff','#3b8fe0']:p.type==='c'?['#7fd3ff','#3a9be0']:['#d9a877','#a06c3b'];
  const pg=ctx.createLinearGradient(0,p.y,0,p.y+14);pg.addColorStop(0,c[0]);pg.addColorStop(1,c[1]);
  ctx.shadowColor='rgba(0,0,0,.2)';ctx.shadowBlur=8;ctx.shadowOffsetY=3;ctx.fillStyle=pg;rr(p.x,p.y+(p.sq>0?Math.sin(p.sq/8*Math.PI)*4:0),p.w,14,7);ctx.fill();ctx.shadowColor='transparent';
  if(p.type==='b'){ctx.strokeStyle='rgba(0,0,0,.35)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(p.x+30,p.y+1);ctx.lineTo(p.x+36,p.y+8);ctx.lineTo(p.x+32,p.y+13);ctx.stroke()}
  if(p.spring){const sx=p.x+p.w/2,k=p.sa>0?(p.sa>9?.4:1+p.sa/9*.9):1,st=3.5*k;ctx.strokeStyle='#ff5a5f';ctx.lineWidth=3;ctx.beginPath();for(let i=0;i<4;i++){ctx.moveTo(sx-8,p.y-2-i*st);ctx.lineTo(sx+8,p.y-2-st/2-i*st)}ctx.stroke();ctx.fillStyle='#ff5a5f';rr(sx-11,p.y-6-4*st,22,4,2);ctx.fill()}}
 ctx.shadowColor='transparent';ctx.globalAlpha=1;drawObjs();
 parts.forEach(q=>{q.x+=q.vx;q.y+=q.vy;q.vy+=.15;q.l-=.04;ctx.fillStyle=`rgba(${q.c||'255,255,255'},${Math.max(q.l,0)})`;ctx.beginPath();ctx.arc(q.x,q.y,3*q.l+1,0,7);ctx.fill()});parts=parts.filter(q=>q.l>0);
 const c=COLORS[S.color]||COLORS[0],st=(1+Math.max(-.12,Math.min(.18,-P.vy*.012)))*(P.sq>6?.82:1);
 ctx.save();ctx.translate(P.x+P.w/2,P.y+P.h);ctx.scale(1/st,st);
 if(S.color>0)skin(S.color,c,P.face);else{const bg=ctx.createLinearGradient(0,-P.h,0,-6);bg.addColorStop(0,c[0]);bg.addColorStop(1,c[1]);
 ctx.shadowColor='rgba(0,0,0,.25)';ctx.shadowBlur=10;ctx.shadowOffsetY=4;ctx.fillStyle=bg;rr(-17,-P.h,34,P.h-6,14);ctx.fill();ctx.shadowColor='transparent';
 ctx.strokeStyle=c[1];ctx.lineWidth=4;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(-8,-6);ctx.lineTo(-8,0);ctx.moveTo(8,-6);ctx.lineTo(8,0);ctx.stroke();
 const f=P.face;ctx.fillStyle='#fff';[-6,7].forEach(x=>{ctx.beginPath();ctx.arc(x+f*2,-28,6,0,7);ctx.fill()});
 ctx.fillStyle='#1c2433';[-6,7].forEach(x=>{ctx.beginPath();ctx.arc(x+f*4,-28,2.6,0,7);ctx.fill()});
 ctx.fillStyle='#ffb84d';ctx.beginPath();ctx.moveTo(f*3,-20);ctx.lineTo(f*15,-16);ctx.lineTo(f*3,-12);ctx.closePath();ctx.fill();
 }const sk=-1;if(sk===5){ctx.fillStyle='#e53935';ctx.fillRect(-17,-37,34,6);ctx.fillRect(-f*17-(f>0?8:0),-37,8,3)}
 else if(sk===6){ctx.strokeStyle='rgba(170,215,255,.95)';ctx.lineWidth=3;ctx.beginPath();ctx.roundRect(-20,-44,40,42,18);ctx.stroke()}
 else if(sk===7){ctx.fillStyle='#ffd23f';ctx.strokeStyle='#b8860b';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-13,-38);ctx.lineTo(-13,-50);ctx.lineTo(-6,-43);ctx.lineTo(0,-53);ctx.lineTo(6,-43);ctx.lineTo(13,-50);ctx.lineTo(13,-38);ctx.closePath();ctx.fill();ctx.stroke()}
 ctx.restore();
 if(state==='play'||state==='pause'){ctx.fillStyle=col.glass;rr(12,12,Math.max(84,40+String(score).length*14),42,21);ctx.fill();ctx.fillStyle=col.ink;ctx.font='800 22px system-ui';ctx.textAlign='left';ctx.fillText(score,28,41);
 ctx.fillStyle=col.glass;rr(12,60,jet>0?225:195,24,12);ctx.fill();ctx.fillStyle=col.ink;ctx.font='600 12px system-ui';ctx.fillText(T('Ур. '+(lvl+1)+' · '+B().n+' · 🪙'+S.coins+(jet>0?'  🚀':'')),22,76);
 if(net.race){ctx.fillStyle=col.glass;rr(12,90,170,24,12);ctx.fill();ctx.fillStyle=col.ink;ctx.font='600 12px system-ui';ctx.textAlign='left';ctx.fillText(T('Друг: '+net.opp+(net.oppDead?' ✖':'')),22,106)}
 if(banner){ctx.globalAlpha=Math.min(1,banner.t/30);ctx.fillStyle=col.glass;rr(W/2-130,120,260,46,23);ctx.fill();ctx.fillStyle=col.ink;ctx.textAlign='center';ctx.font='800 20px system-ui';ctx.fillText(T(banner.s),W/2,150);ctx.globalAlpha=1}}}
function skin(i,c,f){i=Math.min(i,7);const g=ctx.createLinearGradient(0,-40,0,-4);g.addColorStop(0,c[0]);g.addColorStop(1,c[1]);
 ctx.shadowColor='rgba(0,0,0,.25)';ctx.shadowBlur=10;ctx.shadowOffsetY=4;ctx.fillStyle=g;ctx.strokeStyle=c[1];ctx.lineWidth=3;ctx.lineCap='round';ctx.lineJoin='round';
 const eye=(x,y,r)=>{ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(x+f*1.5,y,r,0,7);ctx.fill();ctx.fillStyle='#1c2433';ctx.beginPath();ctx.arc(x+f*3,y,r*.45,0,7);ctx.fill()};
 const lg=Math.sin(frame/3)*(P.vy<0?3:1),legs=()=>{ctx.strokeStyle=c[1];ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-8,-6);ctx.lineTo(-8+lg,1);ctx.moveTo(8,-6);ctx.lineTo(8-lg,1);ctx.stroke()};
 if(i===1){ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(-f*14,-12);ctx.quadraticCurveTo(-f*30,-12,-f*25,-32);ctx.stroke();ctx.lineWidth=3;
  ctx.fillStyle=c[0];ctx.beginPath();ctx.moveTo(-15,-30);ctx.lineTo(-11,-47);ctx.lineTo(-3,-35);ctx.moveTo(15,-30);ctx.lineTo(11,-47);ctx.lineTo(3,-35);ctx.fill();ctx.stroke();
  ctx.fillStyle=g;ctx.beginPath();ctx.roundRect(-16,-36,32,30,13);ctx.fill();ctx.shadowColor='transparent';eye(-6,-25,5);eye(7,-25,5);
  ctx.fillStyle='#ff7a8a';ctx.beginPath();ctx.arc(f*2+.5,-18,2,0,7);ctx.fill();ctx.strokeStyle='rgba(0,0,0,.35)';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(-8,-17);ctx.lineTo(-19,-19);ctx.moveTo(-8,-15);ctx.lineTo(-19,-14);ctx.moveTo(10,-17);ctx.lineTo(21,-19);ctx.moveTo(10,-15);ctx.lineTo(21,-14);ctx.stroke();legs()}
 else if(i===2){ctx.beginPath();ctx.moveTo(0,-36);ctx.lineTo(0,-45);ctx.stroke();ctx.fillStyle='#ff5a5f';ctx.beginPath();ctx.arc(0,-46,3.5,0,7);ctx.fill();
  ctx.fillStyle=g;ctx.beginPath();ctx.roundRect(-16,-36,32,30,6);ctx.fill();ctx.shadowColor='transparent';ctx.fillStyle='#1c2433';ctx.beginPath();ctx.roundRect(-12,-31,24,13,5);ctx.fill();
  ctx.fillStyle=Math.sin(frame/6)>0?'#4df0ff':'#2aa5b0';[-5,5].forEach(x=>{ctx.beginPath();ctx.arc(x+f*2,-24.5,3,0,7);ctx.fill()});ctx.fillStyle='#ffd23f';ctx.fillRect(-6,-14,12,4);ctx.fillStyle=c[1];ctx.fillRect(-20,-28,4,12);ctx.fillRect(16,-28,4,12);legs()}
 else if(i===3){ctx.globalAlpha=.93;ctx.beginPath();ctx.arc(0,-24,16,Math.PI,0);ctx.lineTo(16,-8);for(let k=0;k<3;k++)ctx.quadraticCurveTo(16-k*10.67-5.33,2+Math.sin(frame/5+k)*3,16-(k+1)*10.67,-8);ctx.closePath();ctx.fill();ctx.stroke();ctx.shadowColor='transparent';ctx.globalAlpha=1;
  ctx.fillStyle='#1c2433';[-6,6].forEach(x=>{ctx.beginPath();ctx.ellipse(x+f*2,-25,3,4.5,0,0,7);ctx.fill()});ctx.beginPath();ctx.arc(f*3,-15,3,0,7);ctx.fill()}
 else if(i===4){ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(0,-22,16,18,0,0,7);ctx.fill();ctx.shadowColor='transparent';const fl=P.vy<0?-.7:.35;ctx.fillStyle=c[1];[-1,1].forEach(s=>{ctx.beginPath();ctx.ellipse(s*17,-20,4,10,s*fl,0,7);ctx.fill()});
  ctx.fillStyle='#fff';ctx.beginPath();ctx.ellipse(f*1.5,-18,10,13,0,0,7);ctx.fill();eye(-5,-30,3.6);eye(6,-30,3.6);ctx.fillStyle='#ff9f1c';ctx.beginPath();ctx.moveTo(f,-26);ctx.lineTo(f*10,-23);ctx.lineTo(f,-20);ctx.closePath();ctx.fill();
  [-7,7].forEach((x,k)=>{ctx.beginPath();ctx.ellipse(x+lg*(k?-.5:.5),-2,6,3,0,0,7);ctx.fill()})}
 else if(i===6){const w=Math.sin(frame/4)*(P.vy<0?9:3);ctx.fillStyle=c[1];ctx.globalAlpha=.9;ctx.beginPath();ctx.moveTo(-f*13,-24);ctx.quadraticCurveTo(-f*36,-36-w,-f*30,-12);ctx.closePath();ctx.fill();ctx.stroke();ctx.globalAlpha=1;
  ctx.fillStyle='#ffd23f';ctx.beginPath();ctx.moveTo(-9,-35);ctx.lineTo(-13,-48);ctx.lineTo(-3,-37);ctx.moveTo(9,-35);ctx.lineTo(13,-48);ctx.lineTo(3,-37);ctx.fill();
  ctx.fillStyle=g;ctx.beginPath();ctx.roundRect(-16,-36,32,30,12);ctx.fill();ctx.stroke();ctx.shadowColor='transparent';eye(-6,-26,4.5);eye(7,-26,4.5);
  ctx.fillStyle='#ffe3c2';ctx.beginPath();ctx.ellipse(f*2,-14,9,5.5,0,0,7);ctx.fill();ctx.fillStyle='#8a2a14';[-3,3].forEach(x=>{ctx.beginPath();ctx.arc(f*2+x,-14,1.3,0,7);ctx.fill()});legs()}
 else if(i===7){ctx.fillStyle=g;ctx.beginPath();ctx.roundRect(-16,-36,32,30,13);ctx.fill();ctx.stroke();ctx.shadowColor='transparent';
  ['#ff8fb1','#ffd36b','#8fd3ff'].forEach((m,k)=>{ctx.fillStyle=m;ctx.beginPath();ctx.ellipse(-f*15,-30+k*7,4,5,0,0,7);ctx.fill()});
  ctx.fillStyle='#ffd23f';ctx.strokeStyle='#e0a800';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-4,-35);ctx.lineTo(0,-51);ctx.lineTo(4,-35);ctx.closePath();ctx.fill();ctx.stroke();
  eye(-6,-25,4.5);eye(7,-25,4.5);ctx.fillStyle='#ff9ab8';ctx.beginPath();ctx.arc(f*3,-15,2.2,0,7);ctx.fill();legs()}
 else{ctx.fillStyle='#9fb4d8';ctx.beginPath();ctx.roundRect(f>0?-23:17,-30,6,18,3);ctx.fill();ctx.fillStyle=g;ctx.beginPath();ctx.roundRect(-16,-36,32,30,12);ctx.fill();ctx.stroke();ctx.shadowColor='transparent';
  ctx.fillStyle='#16224a';ctx.beginPath();ctx.roundRect(-12,-33,24,17,8);ctx.fill();ctx.fillStyle='#8be9ff';[-4,5].forEach(x=>{ctx.beginPath();ctx.arc(x+f*2,-24,2,0,7);ctx.fill()});
  ctx.fillStyle='rgba(255,255,255,.55)';ctx.beginPath();ctx.ellipse(-6,-29,3,2,-.5,0,7);ctx.fill();ctx.fillStyle='#ff5a5f';ctx.beginPath();ctx.arc(7,-11,2.5,0,7);ctx.fill();legs()}}
function drawBoss(){ebs.forEach(e=>{ctx.fillStyle='#ff4d4d';ctx.beginPath();ctx.arc(e.x,e.y,7,0,7);ctx.fill();ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.stroke()});if(!boss)return;
 ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='64px system-ui';ctx.globalAlpha=boss.hit>0&&boss.hit%2?.4:1;ctx.fillText(BOSS[lvl%BIO.length],boss.x+boss.w/2,boss.y+boss.h/2);ctx.globalAlpha=1;ctx.textBaseline='alphabetic';
 ctx.fillStyle='rgba(0,0,0,.35)';rr(W/2-70,96,140,10,5);ctx.fill();ctx.fillStyle='#ff4d4d';rr(W/2-70,96,Math.max(0,140*boss.hp/boss.max),10,5);ctx.fill()}
function drawObjs(){drawBoss();ctx.textAlign='center';ctx.font='22px system-ui';
 bul.forEach(b=>{ctx.fillStyle='#ff9f1c';ctx.beginPath();ctx.arc(b.x,b.y,4.5,0,7);ctx.fill()});
 items.forEach(i=>{if(i.t==='c'){ctx.fillStyle='#ffd23f';ctx.beginPath();ctx.ellipse(i.x,i.y,Math.abs(Math.cos(frame/10+i.x))*8+1.5,8,0,0,7);ctx.fill();ctx.strokeStyle='#e0a100';ctx.lineWidth=2;ctx.stroke()}else ctx.fillText(i.t==='a'?'🔫':i.t==='j'?'🚀':'🛡️',i.x,i.y+8+Math.sin(frame/9+i.x)*3)});
 mons.forEach(m=>{ctx.save();ctx.translate(m.x+m.w/2,m.y+m.h/2+Math.sin(m.ph)*3);if(m.dead)ctx.rotate(.8);
  ctx.fillStyle='#e8505b';ctx.beginPath();ctx.roundRect(-19,-15,38,30,14);ctx.fill();
  ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(-7,-3,5,0,7);ctx.arc(7,-3,5,0,7);ctx.fill();
  ctx.fillStyle='#1c2433';ctx.beginPath();ctx.arc(-6,-2,2.4,0,7);ctx.arc(8,-2,2.4,0,7);ctx.fill();
  ctx.strokeStyle='#1c2433';ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(-13,-11);ctx.lineTo(-3,-7);ctx.moveTo(13,-11);ctx.lineTo(3,-7);ctx.stroke();
  ctx.fillRect(-8,6,16,3);ctx.restore()});
 if(sh){ctx.strokeStyle='rgba(120,200,255,.9)';ctx.lineWidth=3;ctx.fillStyle='rgba(120,200,255,.18)';ctx.beginPath();ctx.arc(P.x+P.w/2,P.y+P.h/2,32,0,7);ctx.fill();ctx.stroke()}
 if(jet>0)ctx.fillText('🔥',P.x+P.w/2,P.y+P.h+22)}

/* Экраны и меню: показ экранов, настройки, обучение, доступность, пауза.
   Подключается обычным <script> по порядку из index.html: общая глобальная область видимости. */
function colors(){const s=getComputedStyle(document.documentElement);['sky1','sky2','ink','glass'].forEach(k=>col[k]=s.getPropertyValue('--'+k).trim())}
function apply(){const r=document.documentElement;S.theme==='auto'?r.removeAttribute('data-theme'):r.setAttribute('data-theme',S.theme);colors();
 document.querySelectorAll('.seg button').forEach(b=>{const on=String(S[b.parentNode.dataset.k])===b.dataset.v;b.classList.toggle('on',on);b.setAttribute('aria-pressed',on)});
 $('#sens').value=S.sens;$('#chint').textContent=HINT[S.ctrl];tiltHint()}
matchMedia('(prefers-color-scheme:dark)').addEventListener('change',colors);
COLORS.forEach((c,i)=>{const b=document.createElement('button');b.dataset.v=i;b.style.background=`linear-gradient(135deg,${c[0]},${c[1]})`;b.setAttribute('aria-label','Цвет '+(i+1));document.querySelector('.sw').appendChild(b)});
document.querySelectorAll('.seg button').forEach(b=>b.onclick=()=>{const k=b.parentNode.dataset.k,v=b.dataset.v;S[k]=k==='color'?+v:v;if(k==='ctrl'&&v==='tilt')askTilt();save();apply()});
$('#sens').oninput=e=>{S.sens=+e.target.value;save()};
function show(id){document.querySelectorAll('.screen').forEach(s=>s.classList.toggle('show',s.id===id));$('#pb').style.display=state==='play'&&!net.race?'block':'none';$('#fire').style.display=state==='play'&&S.fire==='btn'?'block':'none';$('#bestm').textContent=best;$('#cn').textContent=S.coins;$('#cn2').textContent=S.coins;
 if(id==='over'){$('#live').textContent='Игра окончена. Очки: '+score;$('#share').style.display=net.race?'none':'block';$('#lbover').style.display=LB_ON&&!net.race?'block':'none';$('#share').textContent='📤 Поделиться результатом'}
 if(id){const t=document.querySelector('#'+id+' button');if(t)try{t.focus({preventScroll:true})}catch(e){}}}
let from='menu';
document.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>{from=state;if(b.dataset.open==='online'&&!net.on)ns('Создай комнату или введи код друга');if(b.dataset.open==='quests')renderQ();if(b.dataset.open==='shop')renderShop();if(b.dataset.open==='lb')lbOpen();show(b.dataset.open)});
$('#back').onclick=()=>show('menu');
function go(){net.race=false;if(!S.seen){helpShow();return}start()}
function helpShow(){const l=[['🎮',HINT[S.ctrl]+(FINE?'. Также: ← → или A D':'')],['🪙','Собирай монеты — за них открываются скины'],['💥','Стреляй по монстрам, когда есть патроны'+(FINE?' (Пробел)':'')],['⚠️','Не падай вниз и обходи монстров']];
 $('#hbody').innerHTML=l.map(x=>'<p>'+x[0]+' '+x[1]+'</p>').join('');show('help')}
$('#hgo').onclick=()=>{S.seen=1;save();start()};
$('#play').onclick=go;
if(FINE)$('#khint').style.display='block';
document.querySelectorAll('.screen').forEach(s=>{s.setAttribute('role','dialog');s.setAttribute('aria-modal','true');const h=s.querySelector('h1,h2');if(h){h.id=h.id||s.id+'-t';s.setAttribute('aria-labelledby',h.id)}});
document.querySelectorAll('.seg').forEach(g=>{g.setAttribute('role','group');const l=g.parentNode.querySelector('label');if(l)g.setAttribute('aria-label',l.textContent)});$('#again').onclick=()=>{if(net.race){if(net.host&&net.on){const sd=Date.now()%1e9;nsend({t:'go',seed:sd});raceStart(sd)}}else start()};
$('#tomenu1').onclick=$('#tomenu2').onclick=()=>{netReset();net.race=false;state='menu';show('menu')};
$('#pb').onclick=pause;$('#resume').onclick=()=>{state='play';show('')};
function pause(){if(net.race)return;if(state==='play'){state='pause';show('pause')}else if(state==='pause'){state='play';show('')}}

/* Экспорт и импорт прогресса, кнопка «Поделиться».
   Подключается обычным <script> по порядку из index.html: общая глобальная область видимости. */
const dh=t=>{$('#dhint').textContent=t};
async function exportData(){chk();
 const data={app:'doodle-jump',v:1,date:new Date().toISOString(),best,coins:S.coins,owned:S.owned,color:S.color,st:S.st};
 const name='doodle-jump-progress.json',blob=new Blob([JSON.stringify(data,null,1)],{type:'application/json'});
 try{const f=new File([blob],name,{type:'application/json'});
  if(navigator.canShare&&navigator.canShare({files:[f]})){await navigator.share({files:[f],title:T('Doodle Jump: прогресс')});dh('Файл готов ✓');return}}catch(e){if(e&&e.name==='AbortError')return}
 const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(a.href),4000);dh('Файл сохранён ✓')}
function importData(txt){
 let d;try{d=JSON.parse(txt)}catch(e){return 'Это не файл прогресса'}
 if(!d||d.app!=='doodle-jump'||d.v!==1)return 'Это не файл прогресса Doodle Jump';
 const num=(x,max)=>Number.isFinite(x)&&x>=0&&x<=max?Math.floor(x):null;
 const coins=num(d.coins,1e7),bst=num(d.best,1e9);
 if(coins===null||bst===null||!Array.isArray(d.owned)||!d.st||typeof d.st!=='object')return 'Файл повреждён';
 const owned=[...new Set([0,...d.owned.filter(i=>Number.isInteger(i)&&i>=0&&i<COLORS.length)])];
 const st={kills:0,coins:0,bosses:0,games:0,shots:0,wins:0,best:0};
 for(const k in st){const v=num(d.st[k],1e9);if(v!==null)st[k]=v}
 if(!confirm('Заменить текущий прогресс (монеты, скины, статистику) данными из файла?'))return 'Отменено';
 S.coins=coins;S.owned=owned;S.st=st;S.color=owned.includes(d.color)?d.color:0;
 best=Math.max(best,bst);try{localStorage.setItem('dj_best',best)}catch(e){}
 save();show('settings');return 'Прогресс загружен ✓'}
$('#exp').onclick=exportData;
$('#imp').onclick=()=>$('#impf').click();
$('#impf').onchange=e=>{const f=e.target.files[0];e.target.value='';if(!f)return;
 if(f.size>200000){dh('Файл слишком большой');return}
 f.text().then(t=>dh(importData(t))).catch(()=>dh('Не удалось прочитать файл'))};
$('#share').onclick=async()=>{
 const text=T('Я набрал '+score+' очков в Doodle Jump! 🐥 Сможешь больше?'),url=location.href.split('#')[0];
 try{if(navigator.share){await navigator.share({title:'Doodle Jump',text,url});return}}catch(e){if(e&&e.name==='AbortError')return}
 try{await navigator.clipboard.writeText(text+' '+url);$('#share').textContent='Скопировано ✓'}catch(e){$('#share').textContent='Не удалось скопировать'}};

/* Таблица лидеров на Supabase (REST). Адрес проекта и публичный ключ задаются в lb-config.js.
   Читаем таблицу scores напрямую, пишем только через функцию submit_score (см. supabase.sql).
   Подключается обычным <script> по порядку из index.html: общая глобальная область видимости. */
const LBU=(typeof SB_URL==='string'?SB_URL.trim():'').replace(/\/+$/,''),LBK=typeof SB_KEY==='string'?SB_KEY.trim():'',LB_ON=!!(LBU&&LBK);
function lbClean(n){return String(n||'').replace(/[\u0000-\u001f\u007f<>]/g,'').replace(/\s+/g,' ').trim().slice(0,16)}
function lbId(){if(!/^[a-z0-9]{10,40}$/.test(S.pid||'')){const a=new Uint8Array(12);crypto.getRandomValues(a);S.pid=[...a].map(x=>(x%36).toString(36)).join('');save()}return S.pid}
async function lbHash(t){const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(t));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}
async function lbFetch(path,opt){const c=new AbortController(),t=setTimeout(()=>c.abort(),8000);
 try{const o=Object.assign({signal:c.signal},opt);o.headers=Object.assign({apikey:LBK},o.headers);return await fetch(LBU+path,o)}finally{clearTimeout(t)}}
async function lbLoad(){
 const box=$('#lbl');box.textContent='Загрузка…';
 try{const me=S.pid?await lbHash(S.pid):'';
  const r=await lbFetch('/rest/v1/scores?select=uid,name,score&order=score.desc&limit=20');
  if(!r.ok)throw new Error('http');const d=await r.json();
  const rows=(Array.isArray(d)?d:[]).filter(v=>v&&typeof v.score==='number').map(v=>({id:v.uid,name:lbClean(v.name)||'Игрок',score:v.score})).sort((a,b)=>b.score-a.score);
  box.textContent='';
  if(!rows.length){box.textContent='Пока никого нет. Будь первым!';return}
  rows.forEach((x,i)=>{const row=document.createElement('div');row.className='lbr'+(me&&x.id===me?' me':'');
   const n=document.createElement('b');n.textContent=i+1;
   const s=document.createElement('span');s.textContent=x.name;
   const p=document.createElement('em');p.textContent=x.score.toLocaleString(LOC);
   row.append(n,s,p);box.appendChild(row)})
 }catch(e){box.textContent='Нет связи с таблицей. Проверь интернет'}}
function lbOpen(){
 $('#lbname').value=S.name||'';$('#lbhint').textContent=best>0?'':'Сыграй хотя бы раз, чтобы отправить рекорд';
 $('#lbsend').textContent='Отправить рекорд'+(best>0?' ('+best+')':'');$('#lbsend').disabled=best<=0;lbLoad()}
async function lbSubmit(name){
 const r=await lbFetch('/rest/v1/rpc/submit_score',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({p_pid:lbId(),p_name:name,p_score:best})});
 return r.ok}
/* Автоотправка: после нового рекорда (и повторная попытка, если прошлая не удалась).
   Имя спрашиваем один раз; «Отмена» отключает вопрос, отправить можно вручную в таблице. */
function lbAuto(nb){
 if(!LB_ON)return;
 setTimeout(async()=>{
  let name=lbClean(S.name);
  if(name.length<2){
   if(!nb||S.lbno)return;
   const a=lbClean(prompt('Новый рекорд! Как записать тебя в таблицу лидеров?\nЧтобы пропустить, нажми «Отмена».','')||'');
   if(a.length<2){S.lbno=1;save();return}
   name=S.name=a;save()}
  let ok=false;try{ok=await lbSubmit(name)}catch(e){}
  S.lbpend=!ok;save();
  if(ok&&state==='over')$('#fb').textContent='🎉 Новый рекорд! Он в таблице лидеров ✓'},600)}
$('#lbsend').onclick=async()=>{
 const name=lbClean($('#lbname').value),h=$('#lbhint'),btn=$('#lbsend');
 if(name.length<2){h.textContent='Введи имя (минимум 2 символа)';return}
 S.name=name;save();btn.disabled=true;h.textContent='Отправляем…';
 try{const ok=await lbSubmit(name);S.lbpend=!ok;save();
  h.textContent=ok?'Рекорд отправлен ✓':'Не удалось отправить'
 }catch(e){h.textContent='Нет связи. Попробуй позже'}
 btn.disabled=best<=0;lbLoad()};
$('#lbback').onclick=()=>show(from==='over'?'over':'menu');
if(LB_ON)$('#lbbtn').style.display='block';

/* Игровой цикл, пауза при сворачивании, service worker, установка PWA, запуск.
   Подключается обычным <script> по порядку из index.html: общая глобальная область видимости. */
const STEP=1000/60;let lastT=0,acc=0,ft=0,fn=0;
function loop(t){
 if(!lastT)lastT=t;
 const raw=t-lastT,el=Math.min(raw,50);lastT=t;rdt=el/STEP;acc+=el;
 let n=0;while(acc>=STEP&&n<3){if(state==='play')step();acc-=STEP;n++}
 if(acc>=STEP)acc=0;
 draw();
 if(raw<250){ft+=raw;fn++;if(fn>=90){const avg=ft/fn;ft=0;fn=0;
  if(avg>24&&DPR>1){DPR=Math.max(1,DPR-.5);cv.width=Math.round(W*DPR);cv.height=Math.round(H*DPR)}}}
 requestAnimationFrame(loop)}
document.addEventListener('visibilitychange',()=>{
 if(document.hidden){if(state==='play'&&!net.race)pause()}
 lastT=0;acc=0;keys={};dir=0;fx=null});
try{if('serviceWorker' in navigator&&(location.protocol==='https:'||/^(localhost|127\.0\.0\.1)$/.test(location.hostname))){
 const had=!!navigator.serviceWorker.controller;let rl=false;
 navigator.serviceWorker.addEventListener('controllerchange',()=>{if(!had||rl)return;rl=true;if(state!=='play')location.reload()});
 navigator.serviceWorker.register('sw.js').catch(()=>{})}}catch(e){}
let dip=null;addEventListener('beforeinstallprompt',e=>{e.preventDefault();dip=e;$('#inst').style.display='block'});
$('#inst').onclick=()=>{if(dip){dip.prompt();dip=null;$('#inst').style.display='none'}};
addEventListener('appinstalled',()=>{$('#inst').style.display='none'});
apply();show('menu');requestAnimationFrame(loop);
