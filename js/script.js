// Переменные
const select = document.querySelector('.content__select');
const selectSelected = select.querySelector('.content__select-name');
const selectList = document.querySelector('.content__select-list');
const selectItem = document.querySelector('.content__select-list-item');
const selectedItem = document.querySelector('.selected');
const selectButtonArrow = document.querySelector('.content__select-icon');
const overlay = document.querySelector('.overlay');
const rooms = document.querySelector('.rooms');
const room = document.querySelectorAll('.rooms__item');
const settings = document.getElementById('settings');
const settingsTabs = document.getElementById('settings-tabs');
const settingsScreens = document.getElementById('settings-screens');
const temperatureLine = document.getElementById('line-active');
const temperatureRound = document.getElementById('round');
const temperatureInfo = document.querySelector('.settings__temperature-info');
const temperatureQuantity = document.getElementById('temperature-quantity');
const temperatureButton = document.getElementById('temperature-button');
const lineActive = document.querySelector('.line-active');
const powerTemperature = document.getElementById('power-temperature');
const powerTemperatureLabel = document.querySelector('.power__label');
const switches = {
  lights: {
    el: document.getElementById('lights-power-item'),
    value: document.getElementById('lights-power'),
  },
  humidty: {
    el: document.getElementById('humidty-power-item'),
    value: document.getElementById('humidty-power'),
  }
}

const sliders = {
  lights: document.getElementById('lights-slider'),
  humidty: document.getElementById('humidty-slider'),
}


// === Панель настроек комнаты === //
const roomsData = {
  livingroom: {
    temperature: 22,
    temperatureOff: false,
    lights: 100,
    lightsIncluded: true,
    humidty: 70,
    humidtyIncluded: true,
  },
  bedroom: {
    temperature: 22,
    temperatureOff: false,
    lights: 100,
    lightsIncluded: true,
    humidty: 70,
    humidtyIncluded: true,
  },
  kitchen: {
    temperature: 22,
    temperatureIncluded: false,
    lights: 100,
    lightsIncluded: true,
    humidty: 70,
    humidtyIncluded: true,
  },
  bathroom: {
    temperature: 22,
    temperatureIncluded: false,
    lights: 100,
    lightsIncluded: true,
    humidty: 70,
    humidtyIncluded: true,
  },
  studio: {
    temperature: 22,
    temperatureOff: false,
    lights: 100,
    lightsIncluded: true,
    humidty: 70,
    humidtyIncluded: true,
  },
  washingroom: {
    temperature: 22,
    temperatureOff: false,
    lights: 100,
    lightsIncluded: true,
    humidty: 70,
    humidtyIncluded: true,
  },

};

let activeRoom = 'all';
let activeTab = 'temperature';


// При клике на select, появляется выпадающей список
select.onclick = function () {
  selectButtonArrow.classList.toggle('content__select-icon--open');
  overlay.classList.toggle('overlay--active');

  if (selectButtonArrow.classList.contains('content__select-icon--open')) {
    selectList.style.maxHeight = selectList.scrollHeight + 'px';
  } else {
    selectList.style.maxHeight = null;
  }
}

// При клике на overlay (в любом месте, кроме выпадающего списка), закрываем список (выпадающий)
document.body.onclick = function (event) {
  const click = event.composedPath();

  if (click.includes(overlay)) {
    selectButtonArrow.classList.remove('content__select-icon--open');
    selectList.style.maxHeight = null;
    overlay.classList.remove('overlay--active');
  }
}

// Делаем активным элемент у списка, по которому был совершён клик и достаём его значение атрибута room
selectList.onclick = function (event) {
  // 1 Атрибут - событие; 2 Атрибут - массив события
  selectedEl(event, selectList);
}

// 
rooms.onclick = function (event) {
  // 1 Атрибут - событие; 2 Атрибут - массив события
  selectedElRoom(event, rooms)
}


// Выбор комнаты
function selectRoom(roomEl) {
  const selectedRoom = rooms.querySelector('.selected');
  const selectedEl = selectList.querySelector('.selected');

  if (selectedRoom) {
    selectedRoom.classList.remove('selected');
  }

  selectedEl.classList.remove('selected');

  if (roomEl !== 'all') {
    const newSelectedRoom = rooms.querySelector(`[data-room=${roomEl}]`);
    activeRoom = roomEl;
    const temperatureData = roomsData[activeRoom].temperature;
    const isIncluded = roomsData[activeRoom][`${activeTab}Included`];
    newSelectedRoom.classList.add('selected');
    renderScreen(false);
    temperatureQuantity.innerText = temperatureData;
    renderTemperature(temperatureData);
    setTemperaturePower();
    changeTab(activeTab);
    changeSlider(roomsData[activeRoom].lights, sliders.lights);
    changeSlider(roomsData[activeRoom].humidty, sliders.humidty);
    changeSwitch('lights', isIncluded);
    changeSwitch('humidty', isIncluded);
  } else {
    renderScreen(true);
  }

  const newSelectedEl = selectList.querySelector(`[data-room=${roomEl}]`);
  newSelectedEl.classList.add('selected');

  selectSelected.innerText = newSelectedEl.innerText;
}


function selectedElRoom(event, array) {
  const click = event.composedPath();
  const room = click[1];

  const el = array.children;
  let elValue;

  if (click.includes(room)) {
    elValue = room.dataset.room;
  }

  for (let i = 0; i < el.length; i++) {
    const childs = el[i];

    if (childs.classList.contains('selected')) {
      childs.classList.remove('selected');
    }
  }

  event.target.classList.add('selected');

  selectRoom(elValue);
}

function selectedEl(event, array) {
  const el = array.children;
  const elValue = event.target.dataset.room;

  for (let i = 0; i < el.length; i++) {
    const childs = el[i];

    if (childs.classList.contains('selected')) {
      childs.classList.remove('selected');
    }
  }

  event.target.classList.add('selected');

  selectRoom(elValue);
}

function renderScreen(isRooms) {
  setTimeout(() => {
    if (isRooms) {
      rooms.style.display = 'grid';
      settings.style.display = 'none';
    } else {
      rooms.style.display = 'none';
      settings.style.display = 'block';
    }
  }, 200);
}


// Отрисовка изменения температуры
function renderTemperature(temperature) {
  // Тип температуры
  const chilly = 16;
  const warmly = 24
  const hot = 30;
  const maxHot = 40;

  // Для температуры
  const min = 16;
  const max = 40;
  const range = max - min;
  const percent = range / 100;

  // Для заполняющей линии регулировки
  const lineMin = 47;
  const lineMax = 270;
  const lineRange = lineMax - lineMin;
  const linePercent = lineRange / 100;

  // Для кружка регулировки
  const roundMin = 122;
  const roundMax = 408;
  const roundRange = roundMax - roundMin;
  const roundPercent = roundRange / 100;

  if (temperature >= min && temperature <= max) {
    const percentTemperature = Math.round((temperature - min) / percent)
    const finishPercentLine = lineMin + linePercent * percentTemperature;
    const finishPercentRound = roundMin + roundPercent * percentTemperature;

    temperatureLine.style.strokeDasharray = `${finishPercentLine} 270`;
    temperatureRound.style.transform = `rotate(${finishPercentRound}deg)`
    temperatureQuantity.innerText = temperature;
  }

  if (temperature >= chilly && temperature < warmly) {
    temperatureInfo.style.boxShadow = '0 0 10px rgba(151, 205, 152, 1)';
    lineActive.style.stroke = 'rgba(151, 205, 152, 1)';
  } else if (temperature >= warmly && temperature < hot) {
    temperatureInfo.style.boxShadow = '0 0 10px rgba(255, 248, 2, 1)';
    lineActive.style.stroke = 'rgba(255, 248, 2, 1)';
  } else if (temperature >= hot && temperature <= 40) {
    temperatureInfo.style.boxShadow = '0 0 10px rgba(250, 2, 20, 1)';
    lineActive.style.stroke = 'rgba(250, 2, 20, 1)';
  }
}

// Изменения температуры мышью
function changeTemperature() {
  let mouseover = false;
  let mousedown = false;
  let positionClick = 0;
  let range = 0;
  let change = 0;

  temperatureButton.onmouseover = () => {
    mouseover = true;
    mousedown = false;
  }
  temperatureButton.onmouseout = () => mouseover = false;
  temperatureButton.onmousedown = (e) => {
    mousedown = true;
    range = 0;
    positionClick = e.offsetY;
  }
  temperatureButton.onmouseup = () => mousedown = false;
  temperatureButton.onmousemove = (e) => {
    if (mouseover && mousedown) {
      let temperature = +temperatureQuantity.innerText;
      range = e.offsetY - positionClick;
      const newChange = Math.round(range / -5);

      if (newChange !== change) {
        if (newChange < change) {
          temperature -= 1;
        } else {
          temperature += 1;
        }

        renderTemperature(temperature);
        change = newChange;
        roomsData[activeRoom].temperature = temperature;
      }
    }
  }
}

changeTemperature();

powerTemperature.onclick = function () {
  powerTemperature.classList.toggle('off');

  if (powerTemperature.classList.contains('off')) {
    roomsData[activeRoom].temperatureOff = true;
    powerTemperatureLabel.innerText = 'Выключено';
  } else {
    roomsData[activeRoom].temperatureOff = false;
    powerTemperatureLabel.innerText = 'Включено';
  }
}

function setTemperaturePower() {
  if (roomsData[activeRoom].temperatureOff) {
    powerTemperature.classList.add('off');
  } else {
    powerTemperature.classList.remove('off');
  }
}

settingsTabs.querySelectorAll('.settings__type').forEach((tab) => {
  tab.onclick = function () {
    const tabSelected = settingsTabs.querySelector('.settings__type.selected');
    const tabSettingsSelected = settingsScreens.querySelector('.settings__screen.selected');
    const tabType = tab.dataset.type;
    activeTab = tabType;

    tabSelected.classList.remove('selected');
    tabSettingsSelected.classList.remove('selected');
    changeTab(activeTab);
  }
})

function changeTab(type) {
  const tab = settingsTabs.querySelector(`[data-type="${type}"]`);
  const tabSettings = settingsScreens.querySelector(`[data-type="${type}"]`)
  tab.classList.add('selected');
  tabSettings.classList.add('selected');
}

function changeSlider(percent, slider) {
  if (percent >= 0 && percent <= 100) {
    const type = slider.dataset.type;
    const sliderProgressText = slider.querySelector('span');
    const sliderProgress = slider.querySelector('.slider__progress');
    sliderProgressText.innerText = percent;
    sliderProgress.style.height = `${percent}%`;
    roomsData[activeRoom][type] = percent;
  }
}

function watchSlider(slider) {
  let mouseover = false;
  let mousedown = false;
  let positionClick = 0;
  let range = 0;
  let change = 0;

  slider.onmouseover = () => {
    mouseover = true;
    mousedown = false;
  }
  slider.onmouseout = () => mouseover = false;
  slider.onmousedown = (e) => {
    mousedown = true;
    range = 0;
    positionClick = e.offsetY;
  }
  slider.onmouseup = () => mousedown = false;
  slider.onmousemove = (e) => {
    if (mouseover && mousedown) {
      let percent = +slider.querySelector('span').innerText;
      range = e.offsetY - positionClick;
      const newChange = Math.round(range / -2);

      if (newChange !== change) {
        if (newChange < change) {
          percent -= 1;
        } else {
          percent += 1;
        }

        changeSlider(percent, slider);
        change = newChange;
      }
    }
  }
}

watchSlider(sliders.lights);
watchSlider(sliders.humidty);

function changeSwitch(activeTab, isIncluded) {
  if (isIncluded) {
    switches[activeTab].value.classList.add('included');
  } else {
    switches[activeTab].value.classList.remove('included');
  }

  roomsData[activeRoom][`${activeTab}Included`] = isIncluded;
}

switches.humidty.value.onclick = function() {
  let isIncluded = !switches.humidty.value.classList.contains('included');
  
  changeSwitch(activeTab, isIncluded);
}

switches.lights.value.onclick = function() {
  let isIncluded = !switches.lights.value.classList.contains('included');
  
  changeSwitch(activeTab, isIncluded);
}