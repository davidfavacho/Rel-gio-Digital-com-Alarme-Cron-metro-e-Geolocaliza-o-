// Função para obter a localização
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        document.getElementById("gps-info").innerHTML = "Geolocalização não disponível.";
    }
}

function showPosition(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=pt`)
        .then(response => response.json())
        .then(data => {
            const city = data.locality || 'Desconhecida';
            const country = data.countryName || 'Desconhecido';
            document.getElementById('gps-info').textContent = `Localização: ${city}, ${country}`;
        })
        .catch(error => {
            document.getElementById("gps-info").innerHTML = "Erro ao obter a localização.";
        });
}

function showError(error) {
    document.getElementById("gps-info").innerHTML = "Erro ao acessar a geolocalização.";
}

// Função para atualizar o relógio
let lastUpdate = 0;

function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();
    
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    document.getElementById('time').textContent = `${hours}:${minutes}:${seconds}`;

    const day = now.getDate();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    const date = `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`;
    document.getElementById('date').textContent = date;

    checkAlarm(hours, minutes, seconds);

    lastUpdate = now.getTime();
    requestAnimationFrame(updateClock);
}

// Função para definir o alarme
let alarmTime = null;

function setAlarm() {
    const alarmInput = document.getElementById('alarm-time').value;
    if (alarmInput) {
        alarmTime = alarmInput;
        document.getElementById('alarm-message').textContent = `Alarme definido para: ${alarmTime}`;
    } else {
        document.getElementById('alarm-message').textContent = "Por favor, defina o horário para o alarme.";
    }
}

function checkAlarm(hours, minutes) {
    if (alarmTime && `${hours}:${minutes}` === alarmTime) {
        document.getElementById('alarm-sound').play();
        alert("Alarme! Hora de acordar!");
        alarmTime = null;
    }
}

function deactivateAlarm() {
    document.getElementById('alarm-sound').pause();
    document.getElementById('alarm-sound').currentTime = 0;
    document.getElementById('alarm-message').textContent = "Alarme desativado.";
}

// Funções do cronômetro
let chronoInterval;
let chronoSeconds = 0;
let chronoRunning = false;

function startStopChrono() {
    if (chronoRunning) {
        clearInterval(chronoInterval);
        chronoRunning = false;
    } else {
        chronoInterval = setInterval(updateChrono, 1000);
        chronoRunning = true;
    }
}

function updateChrono() {
    chronoSeconds++;
    const hours = Math.floor(chronoSeconds / 3600);
    const minutes = Math.floor((chronoSeconds % 3600) / 60);
    const seconds = chronoSeconds % 60;

    document.getElementById('chrono-display').textContent = `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`;
}

function formatTime(time) {
    return time < 10 ? `0${time}` : time;
}

function resetChrono() {
    clearInterval(chronoInterval);
    chronoRunning = false;
    chronoSeconds = 0;
    document.getElementById('chrono-display').textContent = "00:00:00";
}

// Inicia o relógio
requestAnimationFrame(updateClock);

// Chama a função uma vez ao carregar a página
getLocation();
