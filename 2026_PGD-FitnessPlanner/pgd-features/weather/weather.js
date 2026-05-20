(async function loadWeatherMunich() {
    // München Koordinaten
    const lat = 48.137;
    const lon = 11.575;
  
    const url =
      "https://api.open-meteo.com/v1/forecast" +
      `?latitude=${lat}&longitude=${lon}` +
      "&current=temperature_2m,wind_speed_10m,weather_code" +
      "&timezone=Europe%2FBerlin";
  
    const el = document.getElementById("weatherStatus");
  
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
  
      const temp = data?.current?.temperature_2m;
      const wind = data?.current?.wind_speed_10m;
      const code = data?.current?.weather_code;
  
      el.textContent = `Aktuell: ${temp}°C · Wind: ${wind} km/h · Code: ${code}`;
    } catch (err) {
      el.textContent = `Wetter konnte nicht geladen werden: ${err.message}`;
    }
  })();