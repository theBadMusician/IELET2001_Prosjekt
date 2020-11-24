#include "IELET2001_G24_PROSJEKT.h"

void IELET2001_G24_PROSJEKT::connectToWiFi() {
    WiFi.mode(WIFI_STA);
    WiFi.begin(wifiNetwork, wifiPassword);

    while(WiFi.status() != WL_CONNECTED) {
        // keeps the program waiting until a WiFi connection is established
        if (Serial) Serial.print(".");
        delay(500);
    }

    if (Serial) {
        Serial.println("\n Your IP Address: ");
        Serial.println((WiFi.localIP()));
    }
    delay(500);
}

float IELET2001_G24_PROSJEKT::readNTC(int sensorPin) {
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

void IELET2001_G24_PROSJEKT::sendSensorData(void ((aClass)::*fnc)(const char, const char), aClass& a) {
    // Sends the sensor reading from the ESP32 to the server.
    char sensorData[10]; // char array for storing the sensor reading
    float convertedValue;

    for(int i=0; i<numberOfSensors; i++){
        convertedValue = readNTC(sensorPins[i]);
        itoa(convertedValue, sensorData, 10); // converts the sensor reading to a char array and puts it in sensorData
        void (a.*fnc)("Data-from-mcu", sensorData);
        sumOfSensorData[i] += convertedValue; 
        delay(10);
    }
    sensorReadings += 1;
}

void IELET2001_G24_PROSJEKT::sendAverage(void ((aClass)::*fnc)(const char, const char), aClass& a) {
    char averageChar[10];

    for(int i; i < numberOfSensors; i++){
        int avgsum = round(sumOfSensorData[i]);
        int average = avgsum/sensorReadings;
        itoa(average, averageChar, 10);
        void (a.*fnc)("average", averageChar);
        sumOfSensorData[i] = 0;
    }
    sensorReadings = 0; // Resets the count
}

void IELET2001_G24_PROSJEKT::changeSensorDelay(const char * newDelay, size_t length) {
    // Sets a new delay between each sensor reading. Takes a delay from the server in seconds and converts it to milliseconds.
    String newDelayString(newDelay); // converts the char array from the server into a string
    int newDelayInt = newDelayString.toInt(); // converts the string to an int
    sensorDelay = newDelayInt*1000;
}
void IELET2001_G24_PROSJEKT::changeAverageDelay(const char * newAvgDelay, size_t length) {
    String newAvgDelayString(newAvgDelay); // converts the char array from the server into a string
    int newAvgDelayInt = newAvgDelayString.toInt(); // converts the string to an int
    averageDelay = newAvgDelayInt*1000;
}