const searchInput = document.querySelector('#search-input');
const submitButton = document.querySelector('#submit');
var searchOptionList = document.querySelector('#search-options')
const apiKey = "302d05c6f5d859a7057c6224b7b6b172";



submitButton.addEventListener('click', fetchCoords);

function fetchCoords(event) {
    event.preventDefault();
    clearOptions();
    let searchValue = searchInput.value.trim();
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
                var optionString = '<button data-lat='+lat+' data-lon='+lon+'>'+name+", "+state+", "+country+'</button>';
                var option = document.createElement('li');
                option.innerHTML =  optionString;
                searchOptionList.appendChild(option);
            }}
        );
};

function clearOptions() {
    searchOptionList.innerHTML="";
}