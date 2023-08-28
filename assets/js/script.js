const searchInput = document.querySelector('#search-input');
const submitButton = document.querySelector('#submit');

var historyList = document.querySelector('#history-list')
var searchOptionList = document.querySelector('#search-options-list')
var searchOptionContainer = document.querySelector('#search-option-container');
var currentWeather = document.querySelector('#current-weather');
submitButton.addEventListener('click', fetchChoices);

const apiKey = "302d05c6f5d859a7057c6224b7b6b172";

function fetchChoices(event) {
    event.preventDefault();
    clearOptions();
    let searchValue = searchInput.value.trim();
    if (searchValue){
        fetch ('http://api.openweathermap.org/geo/1.0/direct?q='+searchValue+'&limit=5&appid='+apiKey)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                for (var i = 0; i<=data.length; i++){
                    var name = data[i].name;
                    var country = data[i].country;
                    var state = data[i].state;
                    var lat = data[i].lat;
                    var lon = data[i].lon;
                    var optionString = '<button id="optionSelect" data-lat='+lat+' data-lon='+lon+' class="btn btn-outline-primary bg-info fw-bold fs-5 border rounded p-2 h-25 m-2 w-100 " aria-label="option"">'+name+", "+state+", "+country+'</button>';
                    var optionListItem = document.createElement('li');
                    optionListItem.innerHTML = optionString;
                    searchOptionList.appendChild(optionListItem);
                }
            });
    } else {
        alert('Please enter a city')
    };
};

function clearOptions() {
    searchOptionList.innerHTML="";
}

searchOptionList.addEventListener('click', getWeather);

function getWeather(event){
    if (event.target.matches('#optionSelect') ){
        console.log(event.target);
        clearOptions();
        var latSingle = event.target.getAttribute('data-lat');
        var lonSingle = event.target.getAttribute('data-lon');
        addHistory(event.target);
        fetch ('http://api.openweathermap.org/data/2.5/forecast?lat='+latSingle+'&lon='+lonSingle+'&appid='+apiKey+"&units=imperial")
            .then(function(response) {
                return response.json();
            })
            .then (function(data){
                showCurrentWeather(data);
                forecastWeather(data);
            })
    };
};


function showCurrentWeather(data){
    console.log(data);
    var name = data.city.name;
    var temp = data.list[5].main.temp;
    var wind = data.list[5].wind.speed;
    var humidity = data.list[5].main.humidity;
    var weatherDesc = data.list[5].weather[0].description;
    
    var boxHeader = document.createElement('h2');
    boxHeader.textContent = name;
    currentWeather.appendChild(boxHeader);
    
    
};

var storedList = [];
function addHistory(choice) {
    storedList.push(choice);
    
    console.log(storedList);
}

// THESE MAKE NEW BUTTONS FOR HISTORY
//var choiceName = choice.textContent;
//var choiceCity = choiceName.split(",");
//choice.textContent = choiceCity[0]+', '+choiceCity[1];