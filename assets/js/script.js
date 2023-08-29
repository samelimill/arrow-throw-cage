const searchInput = document.querySelector('#search-input');
const submitButton = document.querySelector('#submit');
var historyList = document.querySelector('#history-list');

var mainHeader = document.querySelector('#main-header');
var searchOptionList = document.querySelector('#search-options-list');
var searchOptionContainer = document.querySelector('#search-option-container');
var currentWeather = document.querySelector('#current-weather');
submitButton.addEventListener('click', fetchChoices);

const apiKey = "302d05c6f5d859a7057c6224b7b6b172";

var storedList = [];
function fetchChoices(event) {
    event.preventDefault();
    clearOptions();
    hideCards();
    searchOptionContainer.style.visibility = 'block';
    let searchValue = searchInput.value.trim();
    if (searchValue){
        fetch ('http://api.openweathermap.org/geo/1.0/direct?q='+searchValue+'&limit=5&appid='+apiKey)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                mainHeader.textContent = 'Please select from the following:'
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

function hideCards(){
    searchOptionContainer.style.visibility = 'none';
  //  forecastContainer.style.visibility = 'none';
}

function clearOptions() {
    searchOptionList.innerHTML="";

}

searchOptionList.addEventListener('click', getWeather);

function getWeather(event){
    if (event.target.matches('#optionSelect') ){
        clearOptions();
        mainHeader.textContent = event.target.textContent;
        var latSingle = event.target.getAttribute('data-lat');
        var lonSingle = event.target.getAttribute('data-lon');
        addHistory(event.target);
        fetch ('http://api.openweathermap.org/data/2.5/forecast?lat='+latSingle+'&lon='+lonSingle+'&appid='+apiKey+"&units=imperial")
            .then(function(response) {
                return response.json();
            })
            .then (function(data){
                showCurrentWeather(data);
                // forecastWeather(data);
            })
    };
};

function addHistory(choice) {
    var choiceName = choice.textContent;
    var choiceCity = choiceName.split(",");
    var latStorage = choice.getAttribute('data-lat');
    var lonStorage = choice.getAttribute('data-lon');
    var storageString = '<button id="optionSelect" data-lat='+latStorage+' data-lon='+lonStorage+' class="btn btn-outline-primary bg-info fw-bold fs-5 border rounded p-2 h-25 m-2 w-100 " aria-label="option"">'+choiceCity[0]+', '+choiceCity[1]+'</button>';
    storedList.push(storageString);
    localStorage.setItem('history', JSON.stringify(storedList));
}

function showCurrentWeather(data){
    console.log(data);
    var name = data.city.name;
    var temp = data.list[5].main.temp;
    var wind = data.list[5].wind.speed;
    var humidity = data.list[5].main.humidity;
    var weatherDesc = data.list[5].weather[0].description;
};


