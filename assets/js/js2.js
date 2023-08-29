const searchInput = document.querySelector('#search-input');
const submitButton = document.querySelector('#submit');

var historyList = document.querySelector('#history-list')
var searchOptionList = document.querySelector('#search-options-list')
var searchOptionContainer = document.querySelector('#search-option-container');
//var forecastCard = document.querySelector('')
var currentWeather = document.querySelector('#current-weather');
submitButton.addEventListener('click', fetchChoices);

const apiKey = "302d05c6f5d859a7057c6224b7b6b172";

function fetchChoices(event) {
    event.preventDefault();
    hideCards();
    searchOptionContainer.style.display = 'block';
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

function hideCards(){
    searchOptionContainer.style.visibility = 'none';
 //   forecastContainer.style.visibility = 'none';
}