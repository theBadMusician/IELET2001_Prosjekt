#include <analogWrite.h> 
#include <Arduino.h>
#include <WiFi.h>
#include <SocketIoClient.h>


SocketIoClient socket; // Creating an instance of the socketIoClient class called socket


// set the WiFi SSID and password here:
const char wifiNetwork[] = "";
const char wifiPassword[] = "";


// set the IP address and port here:
const char serverIP[] = "";
const int serverPort = 80; 


const int sensorPins = 34; // Sets the pin that the sensor is connected to
int sensorReadings; // Number of sensor readings. Used to calculate the average sensor value


int sensorDelay = 1000; // Default delay (in ms) between each sensor reading.
unsigned long sensorTimer; // variable for keeping track of the time between each sensor reading


int averageDelay = 60000; // Default delay (in ms) between each time the average sensor value is calculated and emitted to the server
unsigned long averageTimer; //
float sumOfSensorData; // Keeps the sum of sensorvalues since last time the average was


bool connectionEstablished = false; // boolean that is true while the client is connected to the server


// -------------------------------------------------------------------------------------------------------------------------------------- 


void socketConnected(const char * payload, size_t length){
    connectionEstablished = true;
}


void socketDisconnected(const char * payload, size_t length){
    connectionEstablished = false;
}


float readNTC(int sensorPin){
    // reads the input from a NTC 10k Thermistor in series with a pull down 10k resistor, and converts the value to degrees celcius. 
    // B = Material constant of the thermistor
    // T0 = Temperature value in Kelvin for the thermistor when the resistance is 10k
    // resistor = resistor value in Ohm
    float B = 3950, T0 = 298, resistor = 10000;
    
    float voltageResistor = analogRead(sensorPin) * (3.3/4095); // finds the voltage level over the resistor
    float voltageNTC = 3.3 - voltageResistor; // finds the voltage level over the thermistor
    float NTC = (voltageNTC/voltageResistor) *10000; // finds the current resistance in the thermistor
    float Temp = 1/(1/T0 + 1/B*(log(NTC/10000))); // converts the resistance to degrees Kelvin
    Temp -= 273; // converts the temperature to degrees Celcius
    return Temp;
}



void sendSensorData(){
    // Sends the sensor reading from the ESP32 to the server.
    char sensorData[10]; // char array for storing the sensor reading
    float sensorValue = readNTC(sensorPin);
    sumOfSensorData += sensorValue; 
    sensorReadings += 1;
    itoa(sensorValue, sensorData, 10); // converts the sensor reading to a char array and puts it in sensorData
    
    socket.emit("Data-from-mcu",sensorData);
}


void sendAverage(){
    char averageChar[10];

    for(int i; i < numberOfSensors; i++){
      int avgsum = round(sumOfSensorData[i]);
      int average = avgsum/sensorReadings;
      itoa(average, averageChar, 10);
      socket.emit("average", averageChar);
      sumOfSensorData[i] = 0;
    }
    sensorReadings = 0; // Resets the count
}


void connectToWifi(){
    // Connects the ESP32 to WiFi. Uses the global variables for network SSID and password, wifiNetwork and wifiPassword
    WiFi.mode(WIFI_STA);
    WiFi.begin(wifiNetwork, wifiPassword);

    while(WiFi.status() != WL_CONNECTED) {
        // keeps the program waiting until a WiFi connection is established
        Serial.print(".");
        delay(500);
    }
    Serial.println(WiFi.localIP());
    delay(500);
}


void setup() {
  // put your setup code here, to run once:
    Serial.begin(115200);
    
    connectToWifi(); // Establishes a WiFI connection
    
    socket.begin(serverIP, serverPort); // Opens a connection to the server

    // SocketIO events:
    socket.on("connect", socketConnected); // connection event fires when the connection between the client and the server is established
    socket.on("disconnect", socketDisconnected); // disconnect event fires when the connection between the client and the server is down


    sendSensorData(); // The sensordata is read and sent to the server before the loop starts
    sensorTimer = millis(); // Resets the timer before the loop starts  
    averageTimer = millis();
}


void loop() {
    socket.loop(); // keeps the socket.IO connection open
    
    if((millis() - sensorTimer > sensorDelay) && connectionEstablished == true) {
      // The sensordata is read and sent to the server with a time interval decided by the sensorDelay variable
      // If the client has no connection with the server, no data is collected and queued up
      sendSensorData();
      sensorTimer = millis(); // resets the timer
    }
   
    if((millis() - averageTimer > averageDelay) && connectionEstablished == true){
      sendAverage();
      averageTimer = millis();
    }
}
