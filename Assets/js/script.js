//Display Today's Date
$(document).ready(function(){
    $("#todayDate").text(moment().format('L'));   
});

var input = document.getElementById("citySearch");
input.addEventListener("keyUp", function(event) { 
    if(event.keyCode === 13) //13 is "enter" hardcode known by browser
    {
        //event.preventDefault()
        addToSearchHistory();
    }
});
var searchHistory = [];

function fiveDayWeather (dailyData){

    var todayDate = new Date();

    var target = document.getElementById("dailyForecast");
    target.innerHTML = '';

    for(var i = 0; i < 5; i++){
        todayDate.setDate(todayDate.getDate()+i);
        var temp = dailyData[i].temp.day;
        var humidity = dailyData[i].humidity;
        var icon = dailyData[i].weather[0].icon;
        var iconImage = `http://openweathermap.org/img/wn/${icon}@2x.png`;
        var str = 
        `<div class="card w-70" style= "margin: 10px 10px 10px 0px">
            <div class="card-body">
            <span class="card-title font-weight-bold" id="date">${todayDate}</span>
            <p class="card-text">
                <img src="${iconImage}" alt="weatherIcon">
                <br>
                <span>Temperature: <span id="temp"> </span>${temp}F</span>
                <br>
                <span>Humidity: <span id="humid"> </span>${humidity}%</span>
            </p>
            </div>
        </div>`;

        var temp = document.createElement('div');
        temp.innerHTML = str;
        target.appendChild(temp.firstChild);

    }
}

function displayWeatherData(coordData, pastCity){
    //console.log(coordData);
    var requestUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordData.lat}&lon=${coordData.lon}&units=imperial&appid=6b441a7eb28a286138b94c00c12cbdda`;
    
    //Browser XMLHttpRequest, built in the browser and require more code.
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {

        var weatherToday = JSON.parse(xhr.response);
        var focusedData = weatherToday.current
        var dailyData = weatherToday.daily;

        fiveDayWeather(dailyData);

          //Displays searched city to CARD
        $("#cityName").text(pastCity);   

        $("#temp").text(focusedData.temp);   
        $("#humid").text(focusedData.humidity);   
        $("#speed").text(focusedData.wind_speed);

        var uvColors = document.createElement("button");
        var buttonColor;

        //Condtional to display UV index color variations
        if(focusedData.uvi <= 2)
        {
            buttonColor = "btn-success";
        } else if (focusedData.uvi >= 3 && focusedData.uvi <= 7) {
            buttonColor = "btn-warning";
        } else {
            buttonColor = "btn-danger";
        }
        uvColors.setAttribute("type", "button");
        uvColors.setAttribute("class", `btn ${buttonColor}`);
        uvColors.textContent = focusedData.uvi;
        $("#uv").replaceWith(uvColors);
    }
    };
    xhr.open('GET', requestUrl);
    xhr.send();    
}

function getCoordinates(pastCity){
    //reminder
    //#Pound is for IDs for jquery
    //. is for classes

    var requestUrl = `https://api.openweathermap.org/data/2.5/weather?q=${pastCity}&appid=6b441a7eb28a286138b94c00c12cbdda`;
    
    //Browser XMLHttpRequest, built in the browser and require more code.
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
        var coordData = JSON.parse(xhr.response).coord; //.coord to filter in coord data
        //Retrieves weather data from retrieved city coordinates
        displayWeatherData(coordData, pastCity);

      }
    };
    xhr.open('GET', requestUrl);
    xhr.send();   
}

function addToSearchHistory(){
    var pastCity = document.getElementById("citySearch").value;
    if(pastCity == "")
        return;
    searchHistory.push(pastCity); 


    ///Add Search history item to dom
    addToSearchHistoryList(pastCity);

    //Retrieve Weather Data Using API
    getCoordinates(pastCity);

    // Figure out how to reset search bar
    // pastCity = document.getElementById("citySearch").innerHTML.replace(pastCity, "");
}

function addToSearchHistoryList(pastCity){
    var node = document.createElement("button");
    node.classList.add("list-group-item");

    //Gives History Buttons values
    node.setAttribute("value", pastCity);


    node.onclick = function() {
       getCoordinates(this.value);
    };

    var text = document.createTextNode(pastCity);
    node.appendChild(text);
    document.getElementById("searchHistory").appendChild(node);
}

function addPastInput(){
    var autoPopulate= document.getElementById("#list").value;
}