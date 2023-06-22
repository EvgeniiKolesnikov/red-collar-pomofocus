// - Создать таймер, который будет отсчитывать 25 минут работы и 5 минут отдыха (15 минут для длинных перерывов).
// - Предоставить пользователю возможность приостанавливать или сбрасывать таймер.
// - Все решения по дизайну остаются за разработчиком и при оценке учитываться не будут.

const colorRed = '#ba4949';
const colorGreen = '#38858a';
const colorBlue = '#397097';

const pomodoroTime = 1500; // 25
const shortTime = 300; // 5
const longTime = 900; // 15

let time = pomodoroTime;
let timer = null;

let mode = 'pomodoro'; // short || long
let numberShort = 0;

let onPlay = false;
let onEndTimer = false;

const add0 = (digit) => {
  return digit.toString().padStart(2, '0');
};

const setColor = () => {
  const main = document.querySelector('.main');
  if (mode === 'pomodoro') {
    main.style.backgroundColor = colorRed;
  } else if (mode === 'short') {
    main.style.backgroundColor = colorGreen;
  } else {
    main.style.backgroundColor = colorBlue;
  }
};

const startTime = () => {
  if (!onPlay) {
    onPlay = true;
    updateTime();
  }
};

const pauseTime = () => {
  if (onPlay) {
    onPlay = false;
    refreshTime();
  }
};

const resetTime = () => {
  onPlay = false;
  if (mode === 'pomodoro') {
    time = pomodoroTime;
  } else if (mode === 'short') {
    time = shortTime;
  } else {
    time = longTime;
  }
  refreshTime();
};

const refreshTime = () => {
  const timeElem = document.querySelector('.time');
  const sec = time % 60;
  const min = Math.floor(time / 60);
  timeElem.textContent = `${add0(min)}:${add0(sec)}`;
};

const updateTime = () => {
  if (time <= 0) {
    time = 0;
    onEndTimer = true;
  }
  refreshTime();
  time -= 1;
  if (onPlay && !onEndTimer) setTimeout(updateTime, 1000);
};

const setMode = (modeName) => {
  onPlay = false;
  mode = modeName;
  resetTime();
  setColor();
  refreshTime();
};

const button_start = document.querySelector('.button_start');
const button_pause = document.querySelector('.button_pause');
const button_reset = document.querySelector('.button_reset');

button_start.addEventListener('click', () => startTime());
button_pause.addEventListener('click', () => pauseTime());
button_reset.addEventListener('click', () => resetTime());

const button_pomodoro = document.querySelector('.button_pomodoro');
const button_short = document.querySelector('.button_short');
const button_long = document.querySelector('.button_long');

button_pomodoro.addEventListener('click', () => setMode('pomodoro'));
button_short.addEventListener('click', () => setMode('short'));
button_long.addEventListener('click', () => setMode('long'));

setColor();
