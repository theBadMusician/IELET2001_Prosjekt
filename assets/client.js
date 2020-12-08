const socket = io.connect('/');
var dataContainer = document.getElementById("sensor_data") //Lager en variabel for å kunne vise frem verdier fra sensor.
var avg_dataContainer = document.getElementById("sensor_data_avg") //Lager en variabel for å kunne vise frem avg-verdier fra sensor.

//Temp-value:
socket.on("temp-sensor", data => {
  console.log("Temperatur: " + data)
  var temp_data = data;
  dataContainer.innerText = "Received data:"+ temp_data;
  dataArr1.push(data); //This pushes data to the array that stores all the chart data
  if(dataArr1.length >= 11) {
    dataArr1.shift();
  }
  myLineChart.update(); //This updates the chart
})

//Average temp-value:
socket.on("temp-sensor-avg", data => {
  console.log("Average Temp: " + data)
  var temp_data = data;
  avg_dataContainer.innerText = "Gjennomsnitt:"+ temp_data;
  /*dataArr2.push(data); //Pusher data inn i arrayet vårt, bare ta vekk kommenteringen.
  if(dataArr1.length >= 11) { //if-setning som sier hvis det blir flere punkter så skal shift funksjonen kjøre.
    dataArr1.shift(); //Sletter første punktet slik at vi får en kontinuerlig oppdatert graf.
  }
  myLineChart.update(); //Updaterer grafen.*/
})
const xhttp = new XMLHttpRequest();
var keyleft = document.getElementById("left"); //Here the variable kalled "keyW" is equal to the element in the HTML file with ID "w"
var keyup = document.getElementById("up");
var keyright = document.getElementById("right");
var keydown = document.getElementById("down");

var isLeftPressed = 0;
var isRightPressed = 0;
var isUpPressed = 0;
var isDownPressed = 0;
var elsePressed = 0;

function emitControlMouse() {
    socket.emit('zumoDirectControl', {
        UP: isUpPressed,
        DOWN: isDownPressed,
        RIGHT: isRightPressed,
        LEFT: isLeftPressed
    });
    console.log("UP: ", isUpPressed, "   DOWN: ", isDownPressed, "  LEFT: ", isLeftPressed, "  RIGHT: ", isRightPressed);
}

$(document).keydown(function(e) {
    if (e.which == 37) {
        isLeftPressed = 1;
    } else if (e.which == 38) {
        isUpPressed = 1;
    } else if (e.which == 39) {
        isRightPressed = 1;
    } else if (e.which == 40) {
        isDownPressed = 1;
    } else if (e.which == 66) {
        toggleBtn.className = "w3-button w3-grey w3-border w3-border-black w3-large";
    } else {
        elsePressed = 1;
    }
    if (!elsePressed) {
        socket.emit('zumoDirectControl', {
            UP: isUpPressed,
            DOWN: isDownPressed,
            RIGHT: isRightPressed,
            LEFT: isLeftPressed
        });
        console.log("UP: ", isUpPressed, "   DOWN: ", isDownPressed, "  LEFT: ", isLeftPressed, "  RIGHT: ", isRightPressed);
    }
});

$(document).keyup(function(e) {
    if (e.which == 37) {
        isLeftPressed = 0;
    } else if (e.which == 38) {
        isUpPressed = 0;
    } else if (e.which == 39) {
        isRightPressed = 0;
    } else if (e.which == 40) {
        isDownPressed = 0;
    }

    if (!elsePressed) {
        socket.emit('zumoDirectControl', {
            UP: isUpPressed,
            DOWN: isDownPressed,
            RIGHT: isRightPressed,
            LEFT: isLeftPressed
        });
        console.log("UP: ", isUpPressed, "   DOWN: ", isDownPressed, "  LEFT: ", isLeftPressed, "  RIGHT: ", isRightPressed);
    } else {
        elsePressed = 0;
    }
});

$(keyleft).mousedown(function() {
    isLeftPressed = 1;
    emitControlMouse();
});

$(keyleft).mouseup(function() {
    isLeftPressed = 0;
    emitControlMouse();
});

$(keyright).mousedown(function() {
    isRightPressed = 1;
    emitControlMouse();
});

$(keyright).mouseup(function() {
    isRightPressed = 0;
    emitControlMouse();
});

$(keyup).mousedown(function() {
    isUpPressed = 1;
    emitControlMouse();
});

$(keyup).mouseup(function() {
    isUpPressed = 0;
    emitControlMouse();
});

$(keydown).mousedown(function() {
    isDownPressed = 1;
    emitControlMouse();
});

$(keydown).mouseup(function() {
    isDownPressed = 0;
    emitControlMouse();
});


