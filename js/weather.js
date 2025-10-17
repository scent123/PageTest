// 날씨 코드 매핑
const weatherCodes = {
    0: '맑음',
    1: '대체로 맑음',
    2: '부분적으로 흐림',
    3: '흐림',
    45: '안개',
    48: '서리 안개',
    51: '이슬비',
    61: '비',
    63: '비',
    65: '폭우',
    71: '눈',
    73: '눈',
    75: '폭설',
    95: '천둥번개',
};

// 코드 -> 카테고리 변환
function codeToCondition(code) {
    if ([0, 1].includes(code)) return "Clear";
    if ([2, 3, 45, 48].includes(code)) return "clouds";
    if ([51, 61, 63, 65, 95].includes(code)) return "rain";
    if ([71, 73, 75].includes(code)) return "snow";
    return "clear";
}

function codeToIconURL(code) {
    const map = {
        clear: "01d",
        clouds: "03d",
        rain: "10d",
        snow: "13d",
    };
    const cond = codeToCondition(code);
    const iconCode = map[cond] || "01d";

    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

function setWeatherBackground(code) {
    const weatherWindow = document.querySelector(".window.weather");
    if (!weatherWindow) return;

    const hour = new Date().getHours();
    const cond = codeToCondition(code);

    const time =
        hour < 6 ? "night" :
            hour < 10 ? "morning" :
                hour < 17 ? "day" :
                    hour < 20 ? "evening" : "night";

    const gradients = {
        clear: {
            night: "linear-gradient(180deg, #0f2027, #203a43)",
            morning: "linear-gradient(180deg, #4facfe, #00f2fe)",
            day: "linear-gradient(180deg, #38bdf8, #60a5fa)",
            evening: "linear-gradient(180deg, #f97316, #fb7185)",
        },
        clouds: {
            night: "linear-gradient(180deg, #1c1f26, #343a40)",
            morning: "linear-gradient(180deg, #7f8c8d, #bdc3c7)",
            day: "linear-gradient(180deg, #a1a1aa, #e2e8f0)",
            evening: "linear-gradient(180deg, #9ca3af, #fcd34d)",
        },
        rain: {
            night: "linear-gradient(180deg, #1b2735, #283e51)",
            morning: "linear-gradient(180deg, #3a6073, #16222a)",
            day: "linear-gradient(180deg, #2c3e50, #4ca1af)",
            evening: "linear-gradient(180deg, #3a1c71, #d76d77)",
        },
        snow: {
            night: "linear-gradient(180deg, #1e3c72, #2a5298)",
            morning: "linear-gradient(180deg, #83a4d4, #b6fbff)",
            day: "linear-gradient(180deg, #83a4d4, #b6fbff)",
            evening: "linear-gradient(180deg, #a8c0ff, #3f2b96)",
        },
    };

    weatherWindow.style.background = gradients[cond]?.[time] || gradients.clear.day;
    weatherWindow.style.transition = "background 1.5s ease";
}

function applyWeatherOverlay(code) {
    const content = document.querySelector(".window.weather .content");
    if (!content) return;

    let overlay = content.querySelector(".weather-overlay");
    if (!overlay) {
        overlay = document.createElement("div");
        overlay.classList.add("weather-overlay");
        content.appendChild(overlay);
    }

    const cond = codeToCondition(code);
    overlay.style.transition = "opacity 1s ease";

    if (cond === "rain") {
        overlay.style.background = 'url("https://pixabay.com/gifs/rain-animated.gif") center/cover repeat';
        overlay.style.opacity = 0.3;
    }
    else if (cond === "snow") {
        overlay.style.background = 'url("https://pixabay.com/gifs/snow-animated.gif") center/cover repeat';
        overlay.style.opacity = 0.4;
    }
    else {
        overlay.style.background = "";
        overlay.style.opacity = 0;
    }
}

function renderCurrentWeather(data, locationName = "현재 위치") {
    const el = document.querySelector('.weather-current');
    if (!el) return;

    const tmep = data.current?.temperature_2m ?? null;
    const code = data.current?.weather_code ?? null;

    const max = data.daily?.temperature_2m_max?.[0] ?? null;
    const min = data.daily?.temperature_2m_min?.[0] ?? null;

    el.innerHTML = `
        <div class="current-main">
            <img src="${codeToIconURL(code)}" alt="${desc}">
            <div class="current-info">
                <div class="location">${locationName}</div>
                <div class="temp">${tmep !== null ? Math.round(temp) + '°' : '-'}</div>
                <div class="condition">${desc}</div>
                <div class="hi-low">
                    최고: ${max !== null ? max + '°' : '--'} /
                    최고: ${min !== null ? min + '°' : '--'} 
                </div>
            </div>
        </div>
    `;

    if (code !== null) {
        setWeatherBackground(code);
        applyWeatherOverlay(code);
    }
}

// 시간별 예보
function renderHourlyWeather(data) {
    const el = document.querySelector(".weather-hourly .hourly-scroll");
    if (!el) return;

    const times = data.hourly.time.slice(0, 12);
    const temps = data.hourly.temperature_2m.slice(0, 12);
    const codes = data.hourly.weather_code.slice(0, 12);

    el.innerHTML = times.map((t, i) => {
        const hour = new Date(t).getHours();
        return `
            <div class="hour-block">
                <div class="hour">${hour}시</div>
                <img src="${codeToIconURL(codes[i])}" alt="">
                <div class="htemp">${Math.round(temps[i])}°</div>
            </div>
        `;
    }).join("");
}

// 일별 예보
function renderDailyWeather(data) {
    const el = document.querySelector(".weather-daily .daily-scroll");
    if (!el) return;

    const days = data.daily.time.slice(0, 7);
    const minTemps = data.daily.temperature_2m_min.slice(0, 7);
    const maxTemps = data.daily.temperature_2m_max.slice(0, 7);
    const codes = data.daily.weather_code.slice(0, 7);

    el.innerHTML = days.map((d, i) => {
        const day = new Date(d).toLocaleDateString("ko-KR", { weekday: "short" });
        return `
            <div class="day-block">
                <div class="day">${day}</div>
                <img src="${codeToIconURL(codes[i])}" alt="">
                <div class="temp max">${Math.round(maxTemps[i])}</div>
                <div class="bar">
                    <div class="fill" style="width: ${(maxTemp[i] - minTemp[i]) * 3}px"></div>
                </div>
                <div class="temp min">${Math.round(minTemps[i])}°</div>
            </div>
        `;
    }).join("");
}

// 날씨 데이터 가져오기
async function fetchWeatherData(lat, lon, locationName = "현재 위치") {
    const API_URL = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&hourly=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto`;
    try {
        const res = await fetch(API_URL);
        const data = await res.json();
        renderCurrentWeather(data, locationName);
        renderHourlyWeather(data);
        renderDailyWeather(data);
    }
    catch (err) {
        console.log("날씨 데이터 불러오기 오류:", err);
    }
}

function getUserLocation() {
    if (!navigator.geolocation) {
        console.error("이 브라우저는 위치 정보를 지원하지 않습니다.");
        fetchWeatherData(37.5665, 126.9780, "서울");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (pos) => {
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;
            fetchWeatherData(lat, lon);
        },
        (err) => {
            console.warn("위치 접근 거부됨:", err.message);
            fetchWeatherData(37.5665, 126.9780, "서울");
        }
    );
}

document.addEventListener('DOMContentLoaded', getUserLocation);