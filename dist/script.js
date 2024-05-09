import {OpenWeatherAPIKey} from '../keys.js';

const city = "Colombo";
const limit = 1;

async function getCoordinates(city, limit, apiKey){

    let geocodingAPIUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=${limit}&appid=${apiKey}`;

    try{
        const geoResponse = await fetch(geocodingAPIUrl);
        if(!geoResponse.ok){
            throw new Error(`Error : ${geoResponse.status} - ${geoResponse.statusText}`)
        }
        const geoJson = await geoResponse.json();
        return {name : geoJson[0].name, lat : geoJson[0].lat, lon : geoJson[0].lon};
    }
    catch(error){
        console.error(error);
    }
}

async function getWeatherData(lat, lon){
    let openWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OpenWeatherAPIKey}&units=metric`;

    try{
        const weatherResponse = await fetch(openWeatherUrl);
        if(!weatherResponse.ok){
            throw new Error(`Error : ${weatherResponse.status} - ${weatherResponse.statusText}`);
        }
        const weatherJson = await weatherResponse.json();
        return weatherJson;
    }
    catch(error){
        console.error(error);
    }
}

async function getWeatherForecast(lat, lon, apiKey){
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    try{
        const forecastResponse = await fetch(forecastUrl);

        if(!forecastResponse.ok){
            throw new Error(`Error : ${forecastResponse.status} - ${forecastResponse.statusText}`);
        }

        const forecastJson = forecastResponse.json();
        return forecastJson;
    }
    catch(error){
        console.error(error);
    }
}

async function processWeatherData(){

    const coordinates = await getCoordinates(city, limit, OpenWeatherAPIKey);
    const weatherData = await getWeatherData(coordinates.lat, coordinates.lon);
    const forecastData = await getWeatherForecast(coordinates.lat, coordinates.lon, OpenWeatherAPIKey);

    const dateTime = getDateTime();

    const days = ['Sunday', 'Monday', 'Tuesday', 'WednesDay', 'Thursday', 'Friday', 'Saturday'];

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

    //console.log(forecastData.list);

    let forecastList = [];

    for(let i=0; i<forecastData.list.length; i++){
        if(forecastData.list[i].dt_txt.split(" ")[1] == '12:00:00'){
            forecastList.push(i);
        } 
    }

    //unix time comes from API is in seconds, it must be coverted to miliseconds for Date object.(*1000)
    forecastList.forEach(index => {
        let newDate = new Date(forecastData.list[index].dt * 1000);
        // console.log(newDate.toUTCString());
        // console.log(days[newDate.getDay()]);
        // console.log(forecastData.list[index].main.temp.toFixed(1)+"°C")
        
        
    });

    //let sr = new Date(sunset * 1000);
    //console.log(sr.getHours(), sr.getMinutes(), sr.getSeconds());
}

processWeatherData();



function getDateTime(){

    const days = ['Sunday', 'Monday', 'Tuesday', 'WednesDay', 'Thursday', 'Friday', 'Saturday'];

    const date = new Date();
    const today = days[date.getDay()];

    const dateObject = {
        year : date.getFullYear().toString(), 
        month : date.getMonth().toString().padStart(2, 0),
        date : date.getDate().toString().padStart(2, 0),
        day : today
    };

    let hours = date.getHours();
    let meridiem = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();

    const currentTimeObject = {
        hours : hours.toString().padStart(2, 0),
        minutes : minutes.toString().padStart(2, 0),
        seconds : seconds.toString().padStart(2, 0),
        meridiem: meridiem
    }

    return {
        dateObject : dateObject,
        timeObject : currentTimeObject
    };
}


