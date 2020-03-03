const prevBtn = document.getElementById("prevBtn"),
  nextBtn = document.getElementById("nextBtn"),
  lists = document.querySelectorAll(".stepTitle"),
  modal = document.querySelector(".modal"),
  modalCloseBtn = document.querySelector(".modal-content__close");

const numberOfSteps = 4;
let currentStep = 1;
let time;
let copy;
let dataSched;
let modalIsOpen = false;

const buttonTitles = ["SCHEDULE", "CONFIRM", "CUSTOMER", "PAYMENT"];

function show(elem) {
  elem.classList.remove("hidden");
}

function hide(elem) {
  elem.classList.add("hidden");
}

function disable(elem) {
  elem.disabled = true;
  elem.classList.add("disable");
}

function enable(elem) {
  elem.disabled = false;
  elem.classList.remove("disable");
}

///////////// STEPS /////////////////

function checkRadio(radio) {
  const courts = document.getElementsByName(radio);
  for (let i = 0; i < courts.length; i++) {
    if (courts[i].checked) {
      return true;
    }
  }
}

function validate(inputTxt, formType) {
  const phone = /^((?:\+62|62)|0)[2-9]{1}[0-9]+$/;
  const name = /^[A-Za-z]+$/;
  const mail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  switch (formType) {
    case "number":
      if (inputTxt.value.match(phone)) {
        inputTxt.style.borderColor = "#13234d";
        document.getElementsByClassName("errorMsg")[0].textContent = "";
        return true;
      } else {
        inputTxt.style.borderColor = "red";
        document.getElementsByClassName("errorMsg")[0].textContent =
          "Invalid Number";
        return false;
      }
    case "name": {
      if (inputTxt.value.match(name)) {
        inputTxt.style.borderColor = "#13234d";
        document.getElementsByClassName("errorMsg")[1].textContent = "";
        return true;
      } else {
        inputTxt.style.borderColor = "red";
        document.getElementsByClassName("errorMsg")[1].textContent =
          "Invalid Name";
        return false;
      }
    }
    case "email": {
      if (inputTxt.value.match(mail)) {
        inputTxt.style.borderColor = "#13234d";
        document.getElementsByClassName("errorMsg")[2].textContent = "";
        return true;
      } else {
        inputTxt.style.borderColor = "red";
        document.getElementsByClassName("errorMsg")[2].textContent =
          "Invalid Email";
        return false;
      }
    }

    default:
      break;
  }
}

function validateForm() {
  if (
    validate(document.querySelector("#phoneNumber"), "number") &&
    validate(document.querySelector("#email"), "email") &&
    validate(document.querySelector("#name"), "name")
  ) {
    return true;
  }
}

function goToStep() {
  if (currentStep === 5) {
    alert("Go to payment");
    location.reload();
  } else if (currentStep === 1) {
    disable(prevBtn);
  } else {
    enable(prevBtn);
  }

  const allForms = document.querySelectorAll(".steps");
  let currentForm = document.querySelector(`.step${currentStep}`);

  const img = document.createElement("img");
  img.src = "./assets/img/rightArrow.png";

  for (let i = 0; i < currentStep; i++) {
    lists[i].classList.add("underline");
    lists[i].classList.add("blur");
    nextBtn.textContent = `${buttonTitles[i]} `;
    nextBtn.appendChild(img);
  }

  for (let i = lists.length - 1; i >= currentStep; i--) {
    lists[i].classList.remove("underline");
    lists[i].classList.remove("blur");
  }

  //   hide all hidden forms
  for (let i = 0; i < allForms.length; i++) {
    hide(allForms[i]);
  }

  //   shows the current form
  show(currentForm);
}

function getCourtInfo(data) {
  const courts = document.getElementsByName("court");
  let courtName;
  for (let i = 0; i < courts.length; i++) {
    if (courts[i].checked) {
      copy.forEach(el => {
        if (courts[i].id == el.id) {
          courtName = el.name;
          displayHours(data, el.id);
        }
      });
    }
  }
  document.querySelector("#courtName").textContent = courtName;
}

function findHour(data, hr) {
  // local hours
  const hour = hr.split("-");
  const startHr = hour[0];

  // fetch hours
  const dataStart = data;

  if (startHr == dataStart) {
    return true;
  } else {
    return false;
  }
}

function indexFind(dataArr, hr, courtId) {
  const result = dataArr.filter(data => {
    return data.sport_field_schedule.sport_field == courtId;
  });

  const index = result.findIndex(el => {
    return findHour(el.sport_field_schedule.start_hour_string, hr);
  });
  return index + 1;
}

function displayHours(dataHours, courtId) {
  let output = "";

  hours.forEach(el => {
    output += `
      <input type="checkbox" name="radio" id="${el.id}" />
      <label for="${el.id}" class="${
      indexFind(dataHours, el.hour, courtId) ? "disable" : ""
    }">
        <span>${el.hour}</span>
      </label>
  
      `;
  });
  document.querySelector(".hours").innerHTML = output;
}

function getHourSched() {
  fetch("./public/data.json")
    .then(res => res.json())
    .then(res => {
      getCourtInfo(res.results); // == array of 3
    });
}

function getSchedule() {
  const sched = dateFormat(time, "mmmm dS, yyyy");
  document.querySelector("#courtDate").textContent = sched;
}

// steps validation

modalCloseBtn.addEventListener("click", function() {
  if (modalIsOpen) {
    modal.style.display = "none";
    modalIsOpen = false;
    document.querySelector("body").style.overflowY = "scroll";
    window.scrollTo(0, 0);
  }
});

function openModal(msg) {
  if (!modalIsOpen) {
    modal.style.display = "flex";
    modalIsOpen = true;
    document.querySelector("body").style.overflowY = "hidden";
    document.querySelector(".modal-content__text").textContent = msg;
    window.scrollTo(0, 0);
  }
}

function goNext() {
  if (currentStep === 1) {
    if (checkRadio("court")) {
      currentStep += 1;
      getHourSched();
      goToStep();
    } else {
      openModal("Please Choose Court");
    }
  } else if (currentStep === 2) {
    if (checkRadio("radio") && time) {
      currentStep += 1;
      goToStep();
    } else {
      openModal("Please Choose time and date");
    }
  } else if (currentStep === 3) {
    if (validateForm()) {
      currentStep += 1;
      startTimer();
      goToStep();
      getSchedule();
    } else {
      openModal("Please Complete Form");
    }
  } else if (currentStep === 4) {
    alert("Thanks");
    location.reload();
  }
}

function replaceAt(string, index, replace) {
  return string.substring(0, index) + replace + string.substring(index + 1);
}

function goPrev() {
  currentStep -= 1;
  goToStep();
}

nextBtn.onclick = goNext;
prevBtn.onclick = goPrev;

const hours = [
  { hour: "08:00-09:00", id: "thirdHour" },
  { hour: "09:00-10:00", id: "fourHour" },
  { hour: "10:00-11:00", id: "fifHour" },
  { hour: "11:00-12:00", id: "sixHour" },
  { hour: "12:00-13:00", id: "sevHour" },
  { hour: "13:00-14:00", id: "eightHour" },
  { hour: "14:00-15:00", id: "nineHour" },
  { hour: "15:00-16:00", id: "tenHour" },
  { hour: "17:00-18:00", id: "elevHour" },
  { hour: "19:00-20:00", id: "twelHour" },
  { hour: "21:00-22:00", id: "thirHour" },
  { hour: "22:00-23:00", id: "fourtHour" },
  { hour: "23:00-00:00", id: "sixtHour" }
];

/////////////// CALENDAR /////////////////
let myCalendar = new VanillaCalendar({
  selector: "#myCalendar",
  pastDates: false,
  onSelect: (date, elem) => {
    time = date.date;
  }
});

/////////////// BOOKING STEP 1 /////////////////
const courts = document.querySelectorAll(".card-flex");

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function getLastNumber(words) {
  var n = words.split(" ");
  return n[n.length - 1];
}

function displayCourts(el) {
  let output = "";
  el.forEach(e => {
    output += `
    <input type="radio" name="court" id="${e.id}">
    <label for="${e.id}">
    <div class="card ">
    <div class="img-container">
      <img
        src="${e.image}"
        alt="${e.name}"
      />
    </div>
    <div class="card-body">
      <p class="card-price"><span>IDR ${
        e.prices[0] ? e.prices[0].amount : ""
      }.000</span>/hour</p>
      <div class="card-line"></div>
      <p class="card-name">${capitalizeFirstLetter(e.sport_field_type)}</p>
      <p class="card-court-number">Court ${getLastNumber(e.name)}</p>
    </div>
    </div>
    </label>
    `;
  });
  return output;
}

function courtType(courts) {
  return `
  
  <div class="court-type-container">
    <h2 class="court-title">${capitalizeFirstLetter(
      courts[0].sport_field_type
    )}</h2>
    <hr class="divider" />
    <div class="card-flex">
      ${displayCourts(courts)}
    </div>
  </div>

  `;
}

//////////////// TIMER //////////

let timer = 7200;
var min = 0;
var sec = 0;
const startTimer = () => {
  hr = parseInt(timer / 3600);
  min = parseInt(timer / 120);
  sec = parseInt(timer % 60);

  document.getElementById("countDown").innerHTML = `
    
  0${hr.toString()} : ${min.toString()} :  ${sec.toString()}
    
    `;

  timer--;
  setTimeout(function() {
    startTimer();
  }, 1000);
};

fetch("http://boxsportscenter.com/api/sport_fields/")
  .then(res => res.json())
  .then(res => {
    const y = groupBy(res.results, x => {
      return x.sport_field_type;
    });

    copy = [...res.results];

    y.forEach(entry => {
      document.querySelector(".courts").innerHTML += `
        ${courtType(entry)}
      `;
    });
  });

function groupBy(list, keyGetter) {
  const map = new Map();
  list.forEach(item => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return map;
}
