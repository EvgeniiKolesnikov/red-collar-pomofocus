// - Создать таймер, который будет отсчитывать 25 минут работы и 5 минут отдыха (15 минут для длинных перерывов).
// - Предоставить пользователю возможность приостанавливать или сбрасывать таймер.
// - Все решения по дизайну остаются за разработчиком и при оценке учитываться не будут.
// - Опционально: Добавить возможность настройки количества помодоро и времени короткого и длинного перерывов.

// - Опционально: Добавить возможность добавления, удаления и редактирования задач для каждого помодоро.
// - Опционально: Добавить возможность отметить задачу выполненной и переключаться на следующую задачу.

// =============== variables ==============================
const alarm = new Audio('../src/sound/alarm.mp3');
alarm.volume = 0.5;

const colorRed = '#ba4949';
const colorGreen = '#38858a';
const colorBlue = '#397097';

const pomodoroTimeDefault = 25;
const shortTimeDefault = 5;
const longTimeDefault = 15;
const pomodoroCountDefault = 4;

let pomodoroTime = 25;
let shortTime = 5;
let longTime = 15;
let pomodoroCount = pomodoroCountDefault;

let mode = 'pomodoro'; // pomodoro || short || long
let pomodoroNumber = pomodoroCount;
let decrement = 1;

let onPlay = false;
let onEndTimer = false;
let autoRepeat = true;

// =============== functions ==============================
const add0 = (digit) => digit.toString().padStart(2, '0');
const getTime = (mins) => Math.floor(mins * 60);

let time = getTime(pomodoroTime);

const setActiveButon = () => {
  const buttons = Array.from(document.querySelector('.buttons-top').children);
  buttons.forEach((elem) =>
    elem.classList.contains('button_' + mode)
      ? elem.classList.add('button-active')
      : elem.classList.remove('button-active')
  );
};

const setColor = () => {
  const main = document.querySelector('.main');
  getTimes();
  if (mode === 'pomodoro') {
    main.style.backgroundColor = colorRed;
    time = getTime(pomodoroTime);
  } else if (mode === 'short') {
    main.style.backgroundColor = colorGreen;
    time = getTime(shortTime);
  } else {
    main.style.backgroundColor = colorBlue;
    time = getTime(longTime);
  }
};

const refreshTime = () => {
  const timeElem = document.querySelector('.time');
  const sec = time % 60;
  const min = Math.floor(time / 60);
  timeElem.textContent = `${add0(min)} ${add0(sec)}`;
};

const endTimer = () => {
  time = 0;
  decrement = 0;
  onEndTimer = true;
  alarm.play();
  setTimeout(setNextRound, 2000);
};

const updateTime = () => {
  if (time <= 0) {
    endTimer();
  }
  time -= decrement;
  refreshTime();
  if (onPlay && !onEndTimer) {
    setTimeout(updateTime, 1000);
  }
};

const startTimer = () => {
  if (!onPlay) {
    onPlay = true;
    updateTime();
    decrement = 1;
  }
};

const pauseTimer = () => {
  if (onPlay) {
    decrement = 0;
    onPlay = false;
  }
};

const resetTimer = () => {
  pauseTimer();
  setColor();
  setActiveButon();
  refreshTime();
};

const toggleMode = (modeName) => {
  mode = modeName;
  onEndTimer = false;
  resetTimer();
};

const setNextRound = () => {
  if (pomodoroNumber > pomodoroCount) {
    pomodoroNumber = pomodoroCount;
  }

  if (mode === 'pomodoro' && pomodoroNumber <= 1) {
    pomodoroNumber = pomodoroCount;
    toggleMode('long');
  } else if (mode === 'pomodoro' && pomodoroNumber > 1) {
    pomodoroNumber -= 1;
    toggleMode('short');
  } else if (mode === 'short' || mode === 'long') {
    toggleMode('pomodoro');
  }
  autoRepeat && startTimer();
};

const toggleRepeat = (e) => {
  autoRepeat = !autoRepeat;
  autoRepeat
    ? e.target.classList.add('repeat-active')
    : e.target.classList.remove('repeat-active');
};

const textEdit = (e) => {
  let text = e.target;
  text.contentEditable = true;
  text.focus();
  text.addEventListener('keydown', (e) => textBlur(e));
};

const textBlur = (e) => {
  if (e.key === 'Enter' || e.key === 'Escape') {
    e.target.contentEditable = false;
  }
};

const getTimes = () => {
  const min_pomodoro = document.querySelector('.min_pomodoro');
  const min_short = document.querySelector('.min_short');
  const min_long = document.querySelector('.min_long');
  const pomodoro_count = document.querySelector('.pomodoro_count');

  pomodoroTime = +min_pomodoro.textContent || pomodoroTimeDefault;
  shortTime = +min_short.textContent || shortTimeDefault;
  longTime = +min_long.textContent || longTimeDefault;
  pomodoroCount = +pomodoro_count.textContent || pomodoroCountDefault;
};

const button_pomodoro = document.querySelector('.button_pomodoro');
const button_short = document.querySelector('.button_short');
const button_long = document.querySelector('.button_long');

button_pomodoro.addEventListener('click', () => toggleMode('pomodoro'));
button_short.addEventListener('click', () => toggleMode('short'));
button_long.addEventListener('click', () => toggleMode('long'));

const button_start = document.querySelector('.button_start');
const button_pause = document.querySelector('.button_pause');
const button_reset = document.querySelector('.button_reset');

button_start.addEventListener('click', () => startTimer());
button_pause.addEventListener('click', () => pauseTimer());
button_reset.addEventListener('click', () => resetTimer());

const repeat = document.querySelector('.repeat');
repeat.addEventListener('click', (e) => toggleRepeat(e));

const min_pomodoro = document.querySelector('.min_pomodoro');
const min_short = document.querySelector('.min_short');
const min_long = document.querySelector('.min_long');
const pomodoro_count = document.querySelector('.pomodoro_count');

min_pomodoro.addEventListener('click', (e) => textEdit(e));
min_short.addEventListener('click', (e) => textEdit(e));
min_long.addEventListener('click', (e) => textEdit(e));
pomodoro_count.addEventListener('click', (e) => textEdit(e));

resetTimer();
