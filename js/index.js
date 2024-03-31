// code.js

/* формула є комбінацією практичного визначення тиску, методом підриву тротилу,
* який провів Броде(1955р) і чисельного метода Вонґа(1995р)
 
*змінні: 
*Rd - відстань масштабування;
*distance - відстань(м);
*mass - еквівалентна маса тротилу(кг)
*/ 
function Peak_pressure(distance, mass) {
    const Rd = distance / (mass ** (1/3));
      
    if ( Rd >= 0.05 && Rd < 0.3) { 
        return (1.379/Rd) + (0.543/(Rd ** 2)) - (0.035/(Rd ** 3)) + (0.006/(Rd ** 4));
        
     } else if (Rd >= 0.3 && Rd <= 0.5) {
        return (0.607/Rd) - (0.032/(Rd ** 2)) + (0.209/(Rd ** 3));
         
     } else if (Rd > 0.5) {
        return (0.082/Rd) + (0.26/(Rd ** 2)) + (0.69/(Rd ** 3));
        
     } else {
        return null;
     } 
   }
   
/* конвертер маси */   
function convertMass(kgmass) {
    if (kgmass < 1) {
        return (kgmass * 1000).toFixed(1) + " г";
    } else if (kgmass < 1000) {
        return kgmass.toFixed(2) + " кг";
    } else if (kgmass < 1000000) {
        return (kgmass / 1000).toFixed(3) + " т";
    } else if (kgmass < 1000000000) {
        return (kgmass / 1000000).toFixed(3) + " кт";
    } else {
        return (kgmass / 1000000000).toFixed(3) + " Мт";
    }
}
 
const options = document.querySelector('.options');
/* const selectedText = document.querySelector('.select-expl'); */
const equivalentValueElement = document.querySelector('.equivalent-value');
const massIcon = document.querySelector(".icon-mass")
const explIcon = document.querySelector(".icon-expl")
const distIcon = document.querySelector(".icon-dist")
let equivalentValue = 1; //за замовчуванням = тротил
var searchLine = document.querySelector(".select-expl");

searchLine.onclick = function () {
    let list = this.nextElementSibling;    
    if (list.style.maxHeight) {
        this.classList.remove("open");
        explIcon.style.backgroundColor = "var(--expl-color)";
        massIcon.style.backgroundColor = "var(--mass-color)";
        distIcon.style.backgroundColor = "var(--dist-color)"; 
        changeImage("icon-expl", "img/init_charge.png", "img/explosion_white.png");
        changeImage("icon-mass", "img/booster_charge1.png", "img/mass_white.png");
        changeImage("icon-dist", "img/main_charge.png", "img/distance_white.png");                     
        list.style.maxHeight = null;
        list.style.boxShadow = null;    
        list.style.opacity = null;
        document.querySelector(".dimming-options").classList.remove("dim-active");
        document.querySelector("body").classList.remove("dim-overflow");                      
    } else {
        triggerVibration(45)         
        this.classList.add("open")
        list.style.maxHeight = "75vh";
        list.style.opacity = "1";           
        explIcon.style.backgroundColor = "#fff";
        massIcon.style.backgroundColor = "#fff";
        distIcon.style.backgroundColor = "#fff"; 
        changeImage("icon-expl", "img/explosion_white.png", "img/init_charge.png");
        changeImage("icon-mass", "img/mass_white.png", "img/booster_charge1.png");
        changeImage("icon-dist", "img/distance_white.png", "img/main_charge.png");                
        document.querySelector(".dimming-options").classList.add("dim-active");
        document.querySelector("body").classList.add("dim-overflow");
        options.addEventListener('click', (event) => {
            const clickedOption = event.target;    
                if (clickedOption.classList.contains('option')) {
                    this.classList.remove("open");
                    const selectedOptionText = clickedOption.textContent;
                    searchLine.textContent = `${selectedOptionText}`;
                    equivalentValue = clickedOption.getAttribute('data-value');
                    equivalentValueElement.textContent = `${equivalentValue}`;      
                    explIcon.style.backgroundColor = "var(--expl-color)";
                    massIcon.style.backgroundColor = "var(--mass-color)";
                    distIcon.style.backgroundColor = "var(--dist-color)";          
                    changeImage("icon-expl", "img/init_charge.png", "img/explosion_white.png");
                    changeImage("icon-mass", "img/booster_charge1.png", "img/mass_white.png");
                    changeImage("icon-dist", "img/main_charge.png", "img/distance_white.png");                             
                    list.style.maxHeight = null;
                    list.style.boxShadow = null;    
                    list.style.opacity = null;
                    document.querySelector(".dimming-options").classList.remove("dim-active");
                    document.querySelector("body").classList.remove("dim-overflow");
                 }                       
         });                           
    }
};  
                   
//масса
var massInput = document.getElementById('massInput');
var TNTresContainer = document.getElementById('TNTres');
var TNTres = null;
let userInput = null;

function updateTNTres() {
    var equivalent = equivalentValue
    if (userInput) {
        document.querySelector(".label-mass").classList.add("active");
        TNTres = userInput * equivalent;
        TNTresContainer.textContent = `тротиловий еквівалент: ${convertMass(TNTres)}`; } 
        
    else {
        const TNTres = null;
        TNTresContainer.textContent = ""; 
      }
    }
massInput.addEventListener('input', function() {
    var inputText = massInput.value;
    var parsedNumber = parseFloat(inputText);  
    if (!isNaN(parsedNumber) && parsedNumber > 0) {
        userInput = parsedNumber; 
    } else {
        userInput = null;
    }  
    updateTNTres();
});

//дистанція 
var Distance = document.getElementById('Distance');
var PressureContainer = document.getElementById('Pressure');
let distInput = null;
var pressure = null;

function updatePressure() { 
    if (distInput && TNTres) {
        document.querySelector(".label-pressure").classList.add("active");
        pressure = (Peak_pressure(distInput, TNTres) * 1000).toFixed(2);
        highlightIntervals(pressure);
        PressureContainer.textContent = `тиск: ${pressure} кПа =  ${(pressure * 0.0101972).toFixed(2)} ат`; }         
    else {        
        PressureContainer.textContent = "";        
    }
};
      
Distance.addEventListener('input', function() {
    var inputTx = Distance.value;
    var parsedDist = parseFloat(inputTx);
  
    if (!isNaN(parsedDist) && parsedDist > 0) {
        distInput = parsedDist; } 
        else {
        distInput = null;
        }  
    updatePressure();
    });

 
setInterval(function() { 
  updatePressure(); updateTNTres();
}, 500);

//підказка
function changeImage(imageId, loadImg, newAddress) {
    var imageElement = document.getElementById(imageId); 
    imageElement.style.opacity = 0;
    imageElement.src = loadImg
    setTimeout(function() {
      imageElement.src = newAddress;
      imageElement.style.opacity = 1; 
    }, 200); 
  }
  
//ховер  маса
document.querySelector("#massInput").addEventListener("focus", function() {  
    triggerVibration(45)    
    document.querySelector("#massInput").style.border = "2px solid var(--mass-color)"; 
  
    });
document.querySelector("#massInput").addEventListener("blur", function() {
    if (!userInput){
       
        document.querySelector("#massInput").style.border = "1px solid var(--border-color)";
        document.querySelector(".label-mass").classList.remove("active");
        }    
    });
    
//ховер тиск
document.querySelector("#Distance").addEventListener("focus", function() {  
    triggerVibration(45)
    
    document.querySelector("#Distance").style.border = "2px solid var(--dist-color)"; 
    });
document.querySelector("#Distance").addEventListener("blur", function() {
    if (!distInput){
        
        document.querySelector("#Distance").style.border = "1px solid var(--border-color)"; 
        document.querySelector(".label-pressure").classList.remove("active");
        }    
    });
    
//пошук 
var label = document.querySelectorAll(".option");
var searchInput = document.getElementById("search");

function search() {
  let searchVal = searchInput.value.trim().toUpperCase();
  label.forEach((item) => {
    let optionText = item.textContent.trim().toUpperCase();
    if (optionText.indexOf(searchVal) === -1) {
      item.style.display = "none";
    } else {
      item.style.display = "flex";
    }
  });
}
searchInput.addEventListener("keyup", search);

//вібро
function triggerVibration(duration) {
  if (navigator.vibrate) {
    navigator.vibrate(duration);
  } else if (typeof window.navigator.msVibrate === "function") {
    //  IE (MS Edge) 
    window.navigator.msVibrate(duration);
  } else {
    // 
    const start = Date.now();
    const interval = setInterval(function() {
      if (Date.now() - start >= duration) {
        clearInterval(interval);
      }
      
    }, 12); 
  }
}
 
/* меню */
document.getElementById("expand").addEventListener("click", function() {
  document.getElementById("sideMenu").classList.add("menu-open");
  document.querySelector(".dimming-menu").classList.add("dim-active");
  document.querySelector("body").classList.add("dim-overflow");      
});
document.getElementById("close").addEventListener("click", function() {
  document.getElementById("sideMenu").classList.remove("menu-open");
  document.querySelector(".dimming-menu").classList.remove("dim-active");
  document.querySelector("body").classList.remove("dim-overflow");      
});

//хедер
document.addEventListener("DOMContentLoaded", function() {
  var header = document.querySelector("header");
  var wasOpened = false;
  window.onscroll = function() {
    if (window.scrollY > 10 && !wasOpened) {
      header.classList.add("moved");
    }
    else if (window.scrollY <= 10 && !wasOpened){
      header.classList.remove("moved");
      /* wasOpened = true;   */    
    }
  };
});
   
/* підсвітка значень таблиці*/
function highlightIntervals(pressure) {
  const tableRows = document.querySelectorAll(".tbl-content table tbody tr");

  tableRows.forEach((row) => {
    const cells = row.querySelectorAll("td");
    const n = cells.length;
   
    for (let i = 1; i < n; i++) {
      const cell = cells[i];
      const interval = cell.textContent.trim();
      const min = parseInterval(interval);

      cell.classList.remove("highlight");

      if (i < n - 1) {
        const closestCell = cells[i+1];
        const closestInterval = closestCell.textContent.trim();
        const closestMin = parseInterval(closestInterval);
        
        if (pressure >= min && pressure < closestMin) {
           cell.classList.add("highlight");
           }
       } else if (i == n-1 && pressure >= min){
           cell.classList.add("highlight");
           }
      }
  });
}
function parseInterval(interval) {
  let min = null;
  let max = null;

  if (interval.includes("-")) {
    [min, max] = interval.split("-").map(parseFloat);
  } else {
    min = parseFloat(interval);
    max = null;
  }
  return min;
     }
 
