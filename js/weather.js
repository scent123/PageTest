export function initWeather() {

    /** -------------------------
     *  코드 → 날씨 설명 매핑
     *  ------------------------- */
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

    /** -------------------------
     *  코드 → 카테고리 변환
     *  ------------------------- */
    function codeToCondition(code) {
        if ([0, 1].includes(code)) return "clear";
        if ([2, 3, 45, 48].includes(code)) return "clouds";
        if ([51, 61, 63, 65, 95].includes(code)) return "rain";
        if ([71, 73, 75].includes(code)) return "snow";
        return "clear";
    }

    /** -------------------------
     *  코드 → 아이콘 URL (Meteocons, 수정)
     *  ------------------------- */
    function codeToIconURL(code) {
        // 실제 CDN 파일명 기준
        const map = {
            0: "clear-day.svg",           // 맑음
            1: "partly-cloudy-day.svg",   // 대체로 맑음
            2: "partly-cloudy-day.svg",   // 부분적으로 흐림
            3: "overcast.svg",            // 흐림
            45: "fog.svg",                // 안개
            48: "fog.svg",                // 서리 안개
            51: "drizzle.svg",            // 이슬비
            53: "drizzle.svg",
            55: "drizzle.svg",
            61: "rain.svg",               // 비
            63: "rain.svg",
            65: "rain.svg",               // 폭우
            71: "snow.svg",               // 눈
            73: "snow.svg",
            75: "snow.svg",               // 폭설
            80: "rain.svg",               // 소나기
            81: "rain.svg",
            82: "rain.svg",
            85: "snow.svg",               // 눈 소나기
            86: "snow.svg",
            95: "thunderstorms.svg",      // 천둥번개
            96: "thunderstorms.svg",      // 천둥번개 강함
            99: "thunderstorms.svg",      // 천둥번개 극심
        };

        const fileName = map[code] ||
            (code >= 60 && code <= 67 ? "rain.svg" :
                code >= 70 && code <= 77 ? "snow.svg" :
                    code >= 80 && code <= 86 ? "rain.svg" :
                        code >= 90 ? "thunderstorms.svg" :
                            "clear-day.svg");

        if (!map[code]) console.warn(`Weather icon missing for code: ${code}`);
        return `https://cdn.jsdelivr.net/gh/basmilius/weather-icons/production/fill/all/${fileName}`;
    }

    /** -------------------------
     *  배경 그라디언트 설정
     *  ------------------------- */
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
        // weatherWindow.style.transition = "background 1.5s ease";
    }

    /** -------------------------
     *  비/눈 오버레이 효과 (미구현)
     *  ------------------------- */
    // function applyWeatherOverlay(code) {
    //     const content = document.querySelector(".window.weather .content");
    //     if (!content) return;

    //     let overlay = content.querySelector(".weather-overlay");
    //     if (!overlay) {
    //         overlay = document.createElement("div");
    //         overlay.classList.add("weather-overlay");
    //         content.appendChild(overlay);
    //     }

    //     overlay.style.transition = "opacity 1s ease";
    //     overlay.style.pointerEvents = "none";
    //     overlay.style.position = "absolute";
    //     overlay.style.top = 0;
    //     overlay.style.left = 0;
    //     overlay.style.right = 0;
    //     overlay.style.bottom = 0;
    //     overlay.style.zIndex = 5;

    //     const cond = codeToCondition(code);

    //     if (cond === "rain") {
    //         overlay.style.background = 'url("https://i.postimg.cc/7Z0G7hZy/rain-overlay.gif") center/cover repeat';
    //         overlay.style.opacity = 0.3;
    //     }
    //     else if (cond === "snow") {
    //         overlay.style.background = 'url("https://i.postimg.cc/KjM87F1K/snow-overlay.gif") center/cover repeat';
    //         overlay.style.opacity = 0.4;
    //     }
    //     else { // clear / clouds는 맑음 오버레이
    //         overlay.style.background = 'url("https://i.postimg.cc/zBq7fY9H/sunny-overlay.png") center/cover no-repeat';
    //         overlay.style.opacity = 0.15;
    //     }
    // }

    /** -------------------------
     *  현재 날씨 렌더링
     *  ------------------------- */
    function renderCurrentWeather(data, locationName = "현재 위치") {
        const el = document.querySelector('.weather-current');
        if (!el) return;

        const temp = data.current?.temperature_2m ?? null;
        const code = data.current?.weather_code ?? null;
        const desc = weatherCodes[code] || "Unknown";

        const max = data.daily?.temperature_2m_max?.[0] ?? null;
        const min = data.daily?.temperature_2m_min?.[0] ?? null;

        el.innerHTML = `
            <div class="current-main">
                <img src="${codeToIconURL(code)}" alt="${desc}">
                <div class="current-info">
                    <div class="location">${locationName}</div>
                    <div class="temp">${temp !== null ? Math.round(temp) + '°' : '-'}</div>
                    <div class="condition">${desc}</div>
                    <div class="hi-low">
                        최고: ${max !== null ? max + '°' : '--'} /
                        최저: ${min !== null ? min + '°' : '--'}
                    </div>
                </div>
            </div>
        `;

        if (code !== null) {
            setWeatherBackground(code);
            // applyWeatherOverlay(code);
        }
    }

    /** -------------------------
     *  시간별 예보 렌더링
     *  ------------------------- */
    function renderHourlyWeather(data) {
        const el = document.querySelector(".weather-hourly .hourly-scroll");
        if (!el) return;

        const now = new Date();
        const currentHourISO = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            now.getHours()
        ).toString();

        let startIndex = data.hourly.time.indexOf(currentHourISO);

        if (startIndex === -1) {
            startIndex = data.hourly.time.findIndex(t => {
                const th = new Date(t).getHours();
                return th === now.getHours();
            });
        }

        if (startIndex < 0) startIndex = 0;

        const times = data.hourly.time.slice(startIndex, startIndex + 12);
        const temps = data.hourly.temperature_2m.slice(startIndex, startIndex + 12);
        const codes = data.hourly.weather_code.slice(startIndex, startIndex + 12);

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

    function updateWeatherSummary(data) {
        const el = document.querySelector('.weather-hourly .hourly-summary');
        if (!el) return;

        const maxToday = data.daily.temperature_2m_max?.[0];
        const maxTomorrow = data.daily.temperature_2m_max?.[1];

        if (maxToday == null || maxTomorrow == null) {
            el.textContent = '-';
            return;
        }

        const diff = Math.round(maxTomorrow - maxToday);
        const trend = diff > 0 ? "더 높은" : diff < 0 ? "더 낮은" : "비슷한";

        el.textContent = `내일의 최고 기온은 ${maxTomorrow}° 로, ${trend} 기온이 예상됩니다.`
    }

    /** -------------------------
     *  일별 예보 렌더링
     *  ------------------------- */
    function renderDailyWeather(data) {
        const el = document.querySelector(".weather-daily .daily-scroll");
        if (!el) return;

        const days = data.daily.time.slice(0, 10);
        const minTemps = data.daily.temperature_2m_min.slice(0, 10);
        const maxTemps = data.daily.temperature_2m_max.slice(0, 10);
        const codes = data.daily.weather_code.slice(0, 10);

        const globalMin = Math.min(...minTemps);
        const globalMax = Math.max(...maxTemps);
        const range = globalMax - globalMin;

        el.innerHTML = days.map((d, i) => {
            const day = new Date(d).toLocaleDateString("ko-KR", { weekday: "short" });
            const offset = ((minTemps[i] - globalMin) / range) * 100;
            const width = ((maxTemps[i] - minTemps[i]) / range) * 100;
            return `
                <div class="day-block">
                    <div class="day">${day}</div>
                    <img src="${codeToIconURL(codes[i])}" alt="">
                    <div class="temp min">${Math.round(minTemps[i])}°</div>
                    <div class="bar">
                    <div class="fill" style="width: ${width}%; left:${offset}%"></div>
                    </div>
                    <div class="temp max">${Math.round(maxTemps[i])}°</div>
                </div>
            `;
        }).join("");
    }

    /** -------------------------
     *  좌표 → 위치 이름 변환
     *  ------------------------- */
    async function getLocationName(lat, lon) {
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
            const data = await res.json();
            const location = data.address.city || data.address.town || data.address.village || data.address.state;
            return location || "현재 위치";
        } catch (err) {
            console.error("위치 이름 가져오기 실패:", err);
            return "현재 위치";
        }
    }

    /** -------------------------
     *  날씨 데이터 불러오기
     *  ------------------------- */
    async function fetchWeatherData(lat, lon) {
        const locationName = await getLocationName(lat, lon);
        const API_URL =
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
            `&current=temperature_2m,weather_code` +
            `&hourly=temperature_2m,weather_code` +
            `&daily=temperature_2m_max,temperature_2m_min,weather_code` +
            `&forecast_days=10&timezone=auto`;

        try {
            const res = await fetch(API_URL);
            const data = await res.json();
            renderCurrentWeather(data, locationName);
            renderHourlyWeather(data);
            renderDailyWeather(data);
            updateWeatherSummary(data);
        } catch (err) {
            console.log("날씨 데이터 불러오기 오류:", err);
        }
    }

    /** -------------------------
     *  사용자 위치 요청
     *  ------------------------- */
    function getUserLocation() {
        if (!navigator.geolocation) {
            console.error("이 브라우저는 위치 정보를 지원하지 않습니다.");
            fetchWeatherData(37.5665, 126.9780); // fallback: 서울
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
                fetchWeatherData(35.126033, 126.831302); // fallback: 서울
            }
        );
    }

    // 초기 실행
    getUserLocation();
}