window.onload = () => {
  count = localStorage.getItem('count');
  if (count === null) count = 0;
  pomodoroCount.textContent = count;
};

const playButton = document.querySelector('.playButton');
const resetButton = document.querySelector('.resetButton');
const backwardButton = document.querySelector('.backwardButton');
const forwardButton = document.querySelector('.forwardButton');
const clock = document.querySelector('.clock');
const phase = document.querySelector('.phase');
const minute = document.querySelector('.time .minute');
const second = document.querySelector('.time .second');
const pomodoroCount = document.querySelector('.pomodoroCount');

const workTime = 60 * 1000 * 25;
const breakTime = 60 * 1000 * 5;
let remain = workTime;
let isPlaying = false;
let isWorking = true;
let intervalId = null;
let count = 0;

setButtonClickEvent();

function setButtonClickEvent() {
  playButton.addEventListener('click', startTimer);
  backwardButton.addEventListener('click', backward);
  forwardButton.addEventListener('click', forward);
  resetButton.addEventListener('click', () => {
    count = -1;
    updateCount();
  });
}

function startTimer() {
  checkPermission();
  isPlaying = !isPlaying;
  if (isPlaying) {
    if (isWorking)
      startWorking();
    else
      startBreaking();
  } else {
    stopTimer();
  }
}

async function checkPermission() {
  const result = await Notification.requestPermission();
  return result;
}

function makeNotification() {
  const title = 'Pomodoro Timer';
  const msg = (isWorking ? 'Work' : 'Break') + ' is finished.';
  const img = 'images/notification_icon.png';
  const notification = new Notification(title, {body: msg, icon: img});
}

function startWorking() {
  setTimer();
  playButton.innerHTML = '<i class="fas fa-stop-circle"></i>';
  phase.textContent = 'WORK';
  clock.style.backgroundColor = rgba(20, 100, 200, 0.3);
}

function startBreaking() {
  setTimer();
  playButton.innerHTML = '<i class="fas fa-stop-circle"></i>';
  phase.textContent = 'BREAK';
  clock.style.backgroundColor = rgba(20, 200, 100, 0.3);
}

function setTimer() {
  const start = new Date();
  const end = new Date(start);
  end.setMinutes(end.getMinutes() + getMinutes(remain));
  end.setSeconds(end.getSeconds() + getSeconds(remain));
  intervalId = setInterval(() => {countDown(end)}, 1000);
}

function stopTimer() {
  clearInterval(intervalId);
  playButton.innerHTML = '<i class="fas fa-play-circle"></i>';
}

function countDown(end) {
  const current = new Date();
  remain = end - current;
  if (remain < 0) remain = 0;
  updateTime();
  if (remain <= 0) {
    makeNotification();
    nextPhase();
  }
}

function updateTime() {
  minute.textContent = ('00' + getMinutes(remain)).slice(-2);
  second.textContent = ('00' + getSeconds(remain)).slice(-2);
}

function nextPhase() {
  isWorking = !isWorking;
  clearInterval(intervalId);
  if (isWorking) {
    remain = workTime;
    startWorking();
  } else {
    remain = breakTime;
    updateCount();
    startBreaking();
  }
}

function updateCount() {
  count++;
  localStorage.setItem('count', count);
  pomodoroCount.textContent = count;
}

function forward() {
  isPlaying = false;
  stopTimer();
  nextPhase();
  stopTimer();
  updateTime();
}

function backward() {
  isPlaying = false;
  stopTimer();
  if (isWorking)
    remain = workTime;
  else
    remain = breakTime;
  updateTime();
}

function getMinutes(millisecond) {
  return Math.floor(millisecond / (1000 * 60));
}

function getSeconds(millisecond) {
  return Math.floor(millisecond % (1000 * 60) / 1000);
}

function rgba(r, g, b, a) {
  return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
}