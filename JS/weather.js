// const inputDiv = document.querySelector("#inputDiv");
const searchInput = document.querySelector("#searchInput");
const searchBtn = document.querySelector("#searchBtn");
const notFound = document.querySelectorAll(".notFound");
const temperature = document.querySelector(".temperature");
const minTemp = document.querySelectorAll(".minTemp");
const maxTemp = document.querySelectorAll(".maxTemp");
const forecastImg = document.querySelectorAll(".forecastImg");
const forecastStatus = document.querySelectorAll(".forecastStatus");
const humidity = document.querySelector(".humidity");
const wind = document.querySelector(".wind");
const windDirection = document.querySelector(".windDirection");
const cityHide = document.querySelector(".cityHide");
const dayEl = document.querySelector(".dayEl");
const dayNa = document.querySelectorAll(".dayNa");
const forecastInfoImg = document.querySelectorAll(".forecastInfo img");
const foreDetails = document.querySelectorAll(".foreDetails");
const apiKey = "ffa60865fe61c6effcce5d9941f9bf2b";

searchBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  getLocation();
  // updatedDate();
  let city = searchInput.value;
  if (city.length == 0) {
    cityHide.textContent = city;
    for (let i = 0; i < foreDetails.length; i++) {
      foreDetails[i].classList.add("d-none");
      foreDetails[i].classList.remove("d-flex");
    }
    for (let i = 0; i < notFound.length; i++) {
      notFound[i].classList.remove("d-none");
      notFound[i].classList.add("d-block");
    }
    return;
  } else {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
    );
    let data = await response.json();
    if (data.cod == "404") {
      cityHide.textContent = city;
      for (let i = 0; i < notFound.length; i++) {
        notFound[i].classList.remove("d-none");
        notFound[i].classList.add("d-block");
        notFound[i].style.cssText = `padding: 15px !important`;
      }
      for (let i = 0; i < foreDetails.length; i++) {
        foreDetails[i].classList.add("d-none");
        foreDetails[i].classList.remove("d-block");
      }
      return;
    } else {
      for (let i = 0; i < forecastInfoImg.length; i++) {
        forecastInfoImg[i].classList.remove("d-none");
        forecastInfoImg[i].classList.add("d-flex");
      }
      for (let i = 0; i < notFound.length; i++) {
        notFound[i].classList.add("d-none");
        notFound[i].classList.remove("d-block");
      }

      if (cityHide.textContent == city) {
        return;
      } else {
        cityHide.textContent = city;
        const weatherCondition = data.weather[0].main;
        for (let i = 0; i < forecastImg.length; i++) {
          switch (weatherCondition) {
            case "Clear":
            case "Partly cloudy":
            case "Patchy rain nearby":
            case "Overcast":
            case "Cloudy":
            case "Light rain shower":
            case "Sunny":
            case "Light drizzle":
            case "Mist":
            case "Heavy rain":
            case "Broken clouds":
              forecastImg[
                i
              ].src = `http://openweathermap.org/img/w/${data.weather[0].icon}.png`;
              break;
            default:
              forecastImg[i].src = "images/113.png";
          }
        }
        temperature.textContent = `${data.main.temp}°C`;
        for (let i = 0; i < minTemp.length; i++) {
          minTemp[i].textContent = `${data.main.temp_min} °C`;
        }
        for (let i = 0; i < maxTemp.length; i++) {
          maxTemp[i].textContent = `${data.main.temp_max} °C`;
        }
        humidity.textContent = `${data.main.humidity}%`;
        wind.textContent = `${parseInt(data.wind.speed * 3.6)} km/h`;
        windDirection.textContent = `${data.wind.deg} °`;
        for (let i = 0; i < forecastStatus.length; i++) {
          forecastStatus[i].textContent = data.weather[0].description;
        }
      }
      const lat = data.coord.lat;
      const lon = data.coord.lon;
      displayForeCast(lat, lon);
    }
  }
});

const days = [
  "Sunday",
  "Monday",
  "Teusday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const day = new Date();
const dayName = days[day.getDay()];
dayEl.textContent = dayName;

let month = day.toLocaleString("default", { month: "long" });
let date = day.getDate();
// let year = day.getFullYear();
console.log();

for (let i = 0; i < dayNa.length; i++) {
  dayNa[i].textContent = dayName;
}
dayEl.textContent = date + " " + month;

async function displayForeCast(lat, long) {
  const ForeCast_API = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${apiKey}`;
  const data = await fetch(ForeCast_API);
  const result = await data.json();
  const listContentEl = document.querySelector(".list-content"); // assume this is the element where you want to display the forecast
  listContentEl.innerHTML = ""; // clear the list

  const uniqeForeCastDays = [];
  const daysForecast = result.list.filter((forecast) => {
    const forecastDate = new Date(forecast.dt_txt).getDate();
    if (!uniqeForeCastDays.includes(forecastDate)) {
      return uniqeForeCastDays.push(forecastDate);
    }
  });

  daysForecast.forEach((content, indx) => {
    if (indx < 3) {
      listContentEl.insertAdjacentHTML("beforeend", forecast(content));
    }
  });
}

function forecast(frContent) {
  const day = new Date(frContent.dt_txt);
  const dayName = days[day.getDay()];
  const splitDay = dayName.split("", 3);
  const joinDay = splitDay.join("");
  dayEl.textContent = dayName;
  for (let i = 0; i < dayNa.length; i++) {
    dayNa[i].textContent = dayName;
  }
  dayEl.textContent = date + " " + month;
  return `
          <div class="list-content text-white">
            <div class="forecastDiv mb-5 " id="forecastDiv">
                <div class="container w-75">
                    <div class="row gx-0 w-100">
                        <div class="col-lg-4 col-md-12 contentFore-bg foreCast mx-auto">
                            <div class="foreCastItem">
                                <div class="divHeader d-flex justify-content-center align-items-center px-2 pt-1">
                                    <p>${joinDay}</p>
                                </div>
                                <div class="foreContent ">
                                    <div class="foreDetails p-5">
                                        <img src="https://openweathermap.org/img/wn/${
                                          frContent.weather[0].icon
                                        }@2x.png" class="forecastImg w-25 sunIcon mx-auto d-flex justify-content-center align-items-center">
                                        <h3 class="maxTemp text-white text-center fw-bold">${Math.round(
                                          frContent.main.temp_max - 275.15
                                        )}°C</h3>
                                        <p class="minTemp text-center fw-bold">${Math.round(
                                          frContent.main.temp_min - 275.15
                                        )}°C</p>
                                        <p class="forecastStatus text-capitalize maincolor text-center mb-2">${
                                          frContent.weather[0].description
                                        }</p>
                                    </div>
                                </div>
                                <div class="notFound">
                                    <div
                                        class="box mx-auto text-center d-flex justify-content-center align-items-center flex-column">
                                        <img src="images/hand-drawn-no-data-illustration_23-2150584283.jpg"
                                            class="errorImg rounded w-50" id="errorImg" alt="">
                                        <p class="error pt-2 fs-4" id="error">Oops! Location not found!</p>
                                        </img>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
         
  
  
`;
}

const x = document.getElementById("demo");

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function showPosition(position) {
  x.innerHTML =
    "Latitude: " +
    position.coords.latitude +
    "<br>Longitude: " +
    position.coords.longitude;
}

function showError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      x.innerHTML = "User denied the request for Geolocation.";
      break;
    case error.POSITION_UNAVAILABLE:
      x.innerHTML = "Location information is unavailable.";
      break;
    case error.TIMEOUT:
      x.innerHTML = "The request to get user location timed out.";
      break;
    case error.UNKNOWN_ERROR:
      x.innerHTML = "An unknown error occurred.";
      break;
  }
}

/*<span class="day_temp">${Math.round(
    frContent.main.temp_max - 275.15
  )}°C</span>
  <span class="day_temp">${Math.round(
    frContent.main.temp_min - 275.15
  )}°C</span>*/
//<img src="https://openweathermap.org/img/wn/${
// frContent.weather[0].icon
//  }@2x.png" />

// async function displayForeCast(lat, long) {
//   const ForeCast_API = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${API}`;
//   const data = await fetch(ForeCast_API);
//   const result = await data.json();
//   // filter the forecast
//   const uniqeForeCastDays = [];
//   const daysForecast = result.list.filter((forecast) => {
//     const forecastDate = new Date(forecast.dt_txt).getDate();
//     if (!uniqeForeCastDays.includes(forecastDate)) {
//       return uniqeForeCastDays.push(forecastDate);
//     }
//   });
//   console.log(daysForecast);

//   daysForecast.forEach((content, indx) => {
//     if (indx <= 3) {
//       listContentEl.insertAdjacentHTML("afterbegin", forecast(content));
//     }
//   });
// }

// // forecast html element data
// function forecast(frContent) {
//   const day = new Date(frContent.dt_txt);
//   const dayName = days[day.getDay()];
//   const splitDay = dayName.split("", 3);
//   const joinDay = splitDay.join("");

//   // console.log(dayName);

//   return `<li>
//   <img src="https://openweathermap.org/img/wn/${
//     frContent.weather[0].icon
//   }@2x.png" />
//   <span>${joinDay}</span>
//   <span class="day_temp">${Math.round(frContent.main.temp - 275.15)}°C</span>
// </li>`;
// }

// async function updatedDate() {
//   // Get 3-day forecast
//   const response = await fetch(
//     `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`
//   );
//   const data = await response.json();

//   // Update 3-day forecast
//   const foreContents = document.querySelectorAll(".foreContents");

//   for (let i = 0; i < 2; i++) {
//     const date = new Date(data.list[i * 8].dt * 1000);
//     const forecastItem = document.querySelectorAll(".foreDetails");
//     for (let i = 0; i < forecastItem.length; i++) {
//       forecastItem[i].innerHTML = `
//           <h5>${date.toLocaleDateString()}</h5>
//           <img src="http://openweathermap.org/img/w/${
//             data.list[i * 8].weather[0].icon
//           }.png" alt="Weather Icon">
//           <p>Min: ${data.list[i * 8].main.temp_min}°C</p>
//           <p>Max: ${data.list[i * 8].main.temp_max}°C</p>

//           <p>Description: ${data.list[i * 8].weather[0].description}</p>
//         `;
//       foreContents.appendChild(forecastItem);
//     }
//   }
// }
// searchBtn.addEventListener("click", async () => {
//   let city = searchInput.value;
//   if ((city.length = 0)) {
//     cityHide.textContent = city;
//     notFound.classList.remove("d-none");

//     // console.log("Hi!");
//     return;
//   } else {
//     const response = await fetch(
//       `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
//     );
//     let data = await response.json();
//     if (data.cod == "404") {
//       cityHide.textContent = city;
//       notFound.classList.remove("d-none");
//       return;
//     } else {
//       notFound.classList.add("d-none");

//       if ((cityHide.textContent = city)) {
//         return;
//       } else {
//         cityHide.textContent = city;
//         const weatherCondition = data.weather[0].main;
//         switch (weatherCondition) {
//           case "Clear":
//           case "Partly cloudy":
//           case "Patchy rain nearby":
//           case "Overcast":
//           case "Cloudy":
//           case "Light rain shower":
//           case "Sunny":
//           case "Light drizzle":
//           case "Mist":
//           case "Heavy rain":
//             forecastImg.src = `http://openweathermap.org/img/w/${data.weather[0].icon}.png`;
//             break;
//           default:
//             forecastImg.src = "images/113.png";
//         }
//         temperature.textContent = `${data.main.temp}°C`;
//         minTemp.textContent = `${data.main.temp_min}°C`;
//         maxTemp.textContent = `${data.main.temp_max}°C`;
//         humidity.textContent = `${data.main.humidity}%`;
//         wind.textContent = `${data.wind.speed}km/h`;
//         windDirection.textContent = `${data.wind.deg}°`;
//         forecastStatus.textContent = data.weather[0].description;
//       }
//     }
//   }
// });
