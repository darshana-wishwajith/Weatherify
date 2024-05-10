import {OpenWeatherAPIKey} from '../keys.js';

export async function getCoordinates(city, limit){

    let geocodingAPIUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=${limit}&appid=${OpenWeatherAPIKey}`;

    try{
        const geoResponse = await fetch(geocodingAPIUrl);
        if(!geoResponse.ok){
            throw new Error(`Error : ${geoResponse.status} - ${geoResponse.statusText}`)
        }
        const geoJson = await geoResponse.json();

        let jsonList = [];

        for(let i=0; i<geoJson.length; i++){
            jsonList.push(
                {name : geoJson[i].name, state: geoJson[i].state, country : geoJson[i].country, lat : geoJson[i].lat, lon : geoJson[i].lon}
            );
        }

        //console.log(jsonList);
        return jsonList;
    }
    catch(error){
        console.error(error);
    }
}

export async function getWeatherData(lat, lon){
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

export async function getWeatherForecast(lat, lon){
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OpenWeatherAPIKey}&units=metric`;

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

export function getDateTime(){

    const days = ['Sunday', 'Monday', 'Tuesday', 'WednesDay', 'Thursday', 'Friday', 'Saturday'];

    const date = new Date();
    const today = days[date.getDay()];

    const dateObject = {
        year : date.getFullYear().toString(), 
        month : (date.getMonth() + 1).toString().padStart(2, 0),
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


