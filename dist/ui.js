import {OpenWeatherAPIKey} from '../keys.js';

import {getCoordinates, getWeatherData, getWeatherForecast, getDateTime} from './script.js';

const locationSearch = document.getElementById("locationSearch");
const locationSearchContainer = document.getElementById("locationSearchContainer");
const locationIcon = document.getElementById("locationIcon");
const selectUnit = document.getElementById("selectUnit");
const unitList = document.getElementById("unitList");
const defaultBtn = document.getElementById("defaultBtn");
const defaultLocation = document.getElementById("defaultLocation");
const searchResult = document.getElementById("searchResult");
const searchSugestionContainer = document.getElementById("searchSugestionContainer");
const locationSearchBtn = document.getElementById("locationSearchBtn");
const searchWindow = document.getElementById("searchWindow");
const weatherDataContainer = document.getElementById("weatherDataContainer");
const notFoundWindow = document.getElementById("notFoundWindow");
const defaultLocationSelector = document.getElementById("defaultLocationSelector");

//-------------DOM modification elements ----------------------
const wCity = document.getElementById("city");
const wState = document.getElementById("state");
const wCountry = document.getElementById("country");
const mainTemp = document.getElementById("temp");
const shortDesc = document.getElementById("shortDescription");
const fullDesc = document.getElementById("fullDescription");
const cloudPer = document.getElementById("cloudPercentage");
const wImg = document.getElementById("weatherImg");
const today = document.getElementById("today");
const todayDate = document.getElementById("todayDate");
const meridiem = document.getElementById("meridiem");
const clock = document.getElementById("clock");
const wHumidity = document.getElementById("humidity");
const wPressure = document.getElementById("pressure");
const wWinSpeed = document.getElementById("winSpeed");
const wVisibility = document.getElementById("visibility");
const wMaxTemp = document.getElementById("maxTemp");
const wMinTemp = document.getElementById("minTemp");
const wSunrise = document.getElementById("sunrise");
const sunriseMeridiem = document.getElementById("sunriseMeridiem");
const wSunset = document.getElementById("sunset");
const sunsetMeridiem = document.getElementById("sunsetMeridiem");


if(window.localStorage.getItem("defaultLocation") === null){
    defaultLocation.textContent = "No default";
}
else{
    defaultLocation.textContent = window.localStorage.getItem("defaultLocation");
}



locationSearch.addEventListener("focusin", event => {
    locationSearchContainer.classList.add("outline");
    locationIcon.classList.replace("text-dark-txt", "text-accent/50");
})

locationSearch.addEventListener("focusout", event => {
    locationSearchContainer.classList.remove("outline");
    locationIcon.classList.replace("text-accent/50", "text-dark-txt");
})

const buttons = document.querySelectorAll(".focus");

buttons.forEach(button => {
    button.addEventListener("click", event => {
        event.target.classList.add("outline");
    })

    document.addEventListener("click", event => {
        if(event.target !== button && !button.contains(event.target)){
            button.classList.remove("outline");
        }
    })
})

selectUnit.addEventListener("click", event => {
    unitList.classList.remove("hidden");
})

document.addEventListener("click", event => {
    if(event.target !== selectUnit && event.target !== unitList){
        unitList.classList.add("hidden");
    }

    if(event.target !== searchSugestionContainer){
        searchSugestionContainer.classList.add("hidden");
        searchResult.classList.add("hidden");

        let sugestionList = document.querySelectorAll(".searchSugestions");
        sugestionList.forEach(sugestion => {
            searchSugestionContainer.removeChild(sugestion);
        });
    }
})

const allUnits = ['Select a unit', 'standard', 'metric', 'imperial'];

const units = document.querySelectorAll(".getUnit");
units.forEach(unit => {
    unit.addEventListener("click", event => {
        let unitId = event.target.id;
        selectUnit.innerHTML = `${allUnits[unitId]}&nbsp;&#11167;`;
    })
});

locationSearch.addEventListener("keyup", event => {
    locationSearch.value.length >= 5 ? defaultBtn.classList.remove("hidden") : defaultBtn.classList.add("hidden");

    if(locationSearch.value.length == 0){
        weatherDataContainer.classList.add("hidden");
        searchWindow.classList.remove("hidden");
        notFoundWindow.classList.add("hidden");
    }

    getCoordinates(locationSearch.value, 5, OpenWeatherAPIKey).then(
        (jsonList) => {

            let sugestionList = document.querySelectorAll(".searchSugestions");
            sugestionList.forEach(sugestion => {
                searchSugestionContainer.removeChild(sugestion);
            });

            for(let i = 0; i < jsonList.length; i++){
                let sugestion = `${jsonList[i].name}, ${jsonList[i].state}, ${jsonList[i].country}`;

                let sugestionDiv = document.createElement("div");
                sugestionDiv.classList.add("searchSugestions");
                sugestionDiv.id = `${jsonList[i].lat}|${jsonList[i].lon}|${jsonList[i].name}|${jsonList[i].state}|${jsonList[i].country}`;
                sugestionDiv.textContent = sugestion;
                searchSugestionContainer.appendChild(sugestionDiv);
                searchSugestionContainer.classList.remove("hidden");
                searchResult.classList.remove("hidden");

                sugestionDiv.addEventListener("click", event => {
                    // alert(event.target.id);
                    let locationArray = event.target.id.split('|');
                    setWeatherData(1, locationArray, "");
                });
            }
        }
    ).catch(error => {
        console.error(error);
    })
})

defaultBtn.onclick = () => {
    if(defaultLocation.textContent !== locationSearch.value){
        defaultLocation.textContent = locationSearch.value;
        localStorage.setItem("defaultLocation", locationSearch.value);
    }
}

defaultLocationSelector.addEventListener("click", event => {
    if(defaultLocation.textContent !== "No default"){
        setWeatherData(2, [], defaultLocation.textContent);
    }
});

locationSearchBtn.addEventListener("click", event => {

    if(locationSearch.value == ""){
        alert("Please type a location");
    }
    else if(!isNaN(locationSearch.value)){
        alert("Location can't be a number");
    }
    else{
        setWeatherData(2, [], locationSearch.value);
    }
});

async function setWeatherData(coordType, coods=[], city=""){

    let weatherData = null;
    let forecastData = null;

    let cityName = '';
    let citystate = '';
    let cityCountry = '';

    let errors = false;

    // 1 = lat, lon
    if(coordType == 1){
        try{
            weatherData = await getWeatherData(coods[0], coods[1]);
            forecastData = await getWeatherForecast(coods[0], coods[1]);
            cityName = coods[2];
            citystate = coods[3];
            cityCountry = coods[4];
        }
        catch(error){
            console.log(error);
            errors = true;
        }
        
    }
    //2 = Location name
    else if(coordType == 2){
        try{
            const coordinates = await getCoordinates(city, 1, OpenWeatherAPIKey);
            weatherData = await getWeatherData(coordinates[0].lat, coordinates[0].lon);
            forecastData = await getWeatherForecast(coordinates[0].lat, coordinates[0].lon);
            cityName = coordinates[0].name;
            citystate = coordinates[0].state;
            cityCountry = coordinates[0].country;
        }
        catch(error){
            console.log(error);
            errors = true;
        }
    }

    if(errors){
        searchWindow.classList.add("hidden");
        weatherDataContainer.classList.add("hidden");
        notFoundWindow.classList.remove("hidden");
    }
    else{
        notFoundWindow.classList.add("hidden");
        searchWindow.classList.add("hidden");
        weatherDataContainer.classList.remove("hidden");
    }

    const {

        clouds:{all:cloudsPercentage},
        coord:{lon:longitude, lat:latitude},
        main:{humidity, pressure, temp, temp_max, temp_min},
        name:currentCity,
        rain,
        sys:{country, sunrise, sunset},
        timezone,
        visibility,
        weather:[{id:weatherId, main:shortDescription, description, icon: weatherImg}],
        wind:{deg:windDirection, speed:windSpeed, gust:windGust}

    } = weatherData;

    //console.log(weatherData);

    // console.log(forecastData);

    //--------------- DOM modifications -----------------------

    wCity.textContent = cityName;
    wState.textContent = citystate;
    wCountry.textContent = cityCountry;
    mainTemp.textContent = temp;
    shortDesc.textContent = shortDescription;
    fullDesc.textContent = description;
    cloudPer.textContent = cloudsPercentage + '%';

    wImg.src = `../resources/images/${weatherImg}.png`;

    const dateTime = getDateTime();
    today.textContent = dateTime.dateObject.day.toUpperCase();
    todayDate.textContent = `${dateTime.dateObject.year}-${dateTime.dateObject.month}-${dateTime.dateObject.date}`;
    meridiem.textContent = dateTime.timeObject.meridiem;

    setInterval(() => {
        let currentTime = getDateTime().timeObject;
        clock.textContent = `${currentTime.hours}:${currentTime.minutes}:${currentTime.seconds}`;
    }, 1000);

    wHumidity.textContent = humidity+' %';
    wPressure.textContent = pressure+' mPa';
    wWinSpeed.textContent = windSpeed+' m/s';
    wVisibility.textContent = (visibility/1000).toFixed(2)+' km';

    wMaxTemp.textContent = temp_max;
    wMinTemp.textContent = temp_min;

    let ss = new Date(sunset * 1000);
    let sr = new Date(sunrise * 1000);

    wSunrise.textContent = `${(sr.getHours() % 12 || 12).toString().padStart(2, 0)}:${sr.getMinutes().toString().padStart(2, 0)}`;

    sunriseMeridiem.textContent = sr.getHours() >= 12 ? 'PM' : 'AM';

    wSunset.textContent = `${(ss.getHours() % 12 || 12).toString().padStart(2, 0)}:${ss.getMinutes().toString().padStart(2, 0)}`;

    sunsetMeridiem.textContent = ss.getHours() >= 12 ? 'PM' : 'AM';



    const days = ['Sunday', 'Monday', 'Tuesday', 'WednesDay', 'Thursday', 'Friday', 'Saturday'];

    let forecastList = [];

    for(let i=0; i<forecastData.list.length; i++){
        if(forecastData.list[i].dt_txt.split(" ")[1] == '12:00:00'){
            forecastList.push(i);
        } 
    }

    console.log(forecastData);

    //unix time comes from API is in seconds, it must be coverted to miliseconds for Date object.(*1000)
    forecastList.forEach((index, i) => {

        let foreDay = document.getElementById('foreDay'+i);
        let foreDate = document.getElementById('foreDate'+i);
        let foreImg = document.getElementById('foreImg'+i);
        let foreDesc = document.getElementById('foreDesc'+i);
        let foreTemp = document.getElementById('foreTemp'+i);

        let newDate = new Date(forecastData.list[index].dt * 1000);
        foreDay.textContent = (days[newDate.getDay()]).slice(0,3).toUpperCase();
        foreDate.textContent = `${newDate.getMonth().toString().padStart(2, 0)}/${newDate.getDate().toString().padStart(2, 0)}`;
        foreImg.src = `../resources/images/${forecastData.list[index].weather[0].icon}.png`;
        foreDesc.textContent = forecastData.list[index].weather[0].main;
        foreTemp.textContent = forecastData.list[index].main.temp+"°C";
    });
}
