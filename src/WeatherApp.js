import React, { useEffect, useState } from "react";
import axios from "axios";
const initialCities = [];
const initialWeather = [];
export const WeatherApp = () => {
  const [city, setCity] = useState("");
  const [cities, setCities] = useState(initialCities);
  const [weather, setWeather] = useState(initialWeather);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [showList, setShowList] = useState("hide");

  useEffect(() => {
    setShowList(cities.length === 0 ? "hide" : "show");
  }, [cities]);
  const handleInputChange = ({ target }) => {
    setCity(target.value);
  };
  const getCities = (e) => {
    e.preventDefault();
    axios
      .get(
        `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${process.env.ACCUWEATHER_KEY}&q=${city}&language=en-us`
      )
      .then((response) => {
        setCities(response.data);
        setShowList("show");
      })
      .catch((err) => console.log(err));
  };

  const getWeather = (cityKey, cityName) => {
    setShowList("hide");
    axios
      .get(
        `http://dataservice.accuweather.com/currentconditions/v1/${cityKey}?apikey=xiBYqWhyAXMTNR8YMypqaJA6CXzQiOnp&details=true`
      )
      .then((response) => {
        setCurrentWeather({ ...response.data[0], cityName });
        axios
          .get(
            `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${cityKey}?apikey=xiBYqWhyAXMTNR8YMypqaJA6CXzQiOnp&language=en-us&details=true&metric=true`
          )
          .then((response) => {
            setWeather(response.data.DailyForecasts);
          });
      })

      .catch((err) => console.log(err));
  };

  return (
    <div className="app" onClick={() => setShowList("hide")}>
      <div className="info">
        <div className="form">
          <form onSubmit={getCities}>
            <input
              name="city"
              value={city}
              onChange={handleInputChange}
              placeholder="City"
            />
            <button type="submit">Search</button>
          </form>
        </div>
        <div className={`${showList} list-cities`}>
          {cities.length > 0
            ? cities.map((city, index) => (
                <div
                  key={index}
                  onClick={() => getWeather(city.Key, city.LocalizedName)}
                >
                  <p>
                    City: {city.LocalizedName},{" "}
                    {city.AdministrativeArea.LocalizedName}
                  </p>
                  <p>Country: {city.Country.LocalizedName}</p>
                  <hr />
                </div>
              ))
            : null}
        </div>
        <div className="weather-info">
          {currentWeather !== null ? (
            <div>
              <h1>{currentWeather.cityName}</h1>
              <img
                src={`${process.env.PUBLIC_URL}/assets/icons/${currentWeather.WeatherIcon}.png`}
                alt="icon"
              />
              <h2>{currentWeather.Temperature.Metric.Value}°C</h2>
              <h3>Wind speed: {currentWeather.Wind.Speed.Metric.Value} km/h</h3>
            </div>
          ) : null}
          <div className="days">
            {weather.map((obj, index) => {
              let date = new Date(obj.Date);
              return (
                <div key={index} className="day">
                  <img
                    src={`${process.env.PUBLIC_URL}/assets/icons/${obj.Day.Icon}.png`}
                    alt="icon"
                  />
                  <div>
                    <h3>{date.toLocaleDateString()}</h3>

                    <h3>Max: {obj.Temperature.Maximum.Value}°C</h3>
                    <h3>Min: {obj.Temperature.Minimum.Value}°C</h3>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
