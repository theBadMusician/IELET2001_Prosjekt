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

var keyleft = document.getElementById("left"); //Here the variable kalled "keyW" is equal to the element in the HTML file with ID "w"
var keyup = document.getElementById("up");
var keyright = document.getElementById("right");
var keydown = document.getElementById("down");
 
document.onkeypress = function(event) { //This checks constantly if, while on the webpage, the user presses down a button
keyDown(event); //If a user does press down a button the "event" variable fetches which button it is and passes it to the function "keyDown" as an argument
};

document.onkeyup = function(event) { //This checks constantly if, while on the webpage, the user lets go of a button (it goes up and not down)
    keyUp(event); //If a user does let go of the button the "event" variable fetches which button it is and passes it to the function "keyUp" as an argument
};
function myFunction(event) {
    var x = event.which || event.keyCode;
    document.getElementsByClassName("button").innerHTML = + x; 

var btnPressed = false; //Variable to track if the user is currently pressing down a button

function keypress(event) { //This function performs certain actions when a user presses down certain buttons

    var key = event.key; //Gets the key on the keyboard to check if something should be done
    
    

    if(!btnPressed) { //If any other button is not allready pressed, continue

        //Drive forwards
        if (keyup == true || key == "38") { //Check if the key "up" is pressed, here we have to check of the small and capital letter because they are not the same
            changeDriveState(1); //Change the boolean which decides if the car drives forwards or backwards (this sends it to the server which tells the car)
            btnPressed = true; //Set button pressed to true so that no other button can be pressed
            console.log("hhhhh");
        }

        //Drive left
        if (key == "LEFT" || key == "37") { //Same logic as earlier
            changeTurnState(1); //Change the boolean which decides if the car drives left or right (this sends it to the server which tells the car)
            btnPressed = true;
        }

        //Drive backwards
        if (key == "BACK" || key == "40") {
            changeDriveState(0);
            btnPressed = true;
        }

        //Drive right
        if (key == "RIGHT" || key == "39") {
            changeTurnState(0);
            btnPressed = true;
        }

        //Stop the car
        if (key == " ") {
            console.log("Space pressed, emergency stop"); //Console.log can be used for debugging, much like serial.print in Arduino
            changeStopState(0); //Changes the boolean that tells the engine to come to a complete stop (this sends it to the server which tells the car)
            btnPressed = true;

        }
    }

}

function keyUp(event) { //Same logic as earlier, just that in this case we check if the button is let go (go upwards)

    var key = event.key;

    //Forward
    if(key == "w" || key == "38") {
    }

    //Left
    if(key == "" || key == "37") {
        
    }

    //Backward
    if(key == "" || key == "40") {
        
    }

    //Right
    if(key == "" || key == "39") { //All of these specific key functions only alter the webpage element
        
    }

    btnPressed = false;
    console.log("Key let go, stopping car");
    changeStopState(0); //In all of the cases above, when the keys are let go, the car should stop. Therefore we just call the stop function at the end.

}
}
