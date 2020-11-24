#include <Arduino.h>
#include <WiFi.h>

class IELET2001_G24_PROSJEKT {    
private:
    const char* wifiNetwork;
    const char* wifiPassword;

public:
    int         sensorPins[5]; // Sets the pins that the sensors are connected to
    String      sensorNames[5];

    int         numberOfSensors; // Number of sensors connected. Calculated in the setup function
    int         sensorReadings; // Number of sensor readings. Used to calculate the average sensor value


    int         sensorDelay = 1000; // Default delay (in ms) between each sensor reading. Can be changed from the server using the event "changeSensorDelay"
    uint32_t    sensorTimer = millis(); // variable for keeping track of the time between each sensor reading


    int         averageDelay = 60000; // Default delay (in ms) between each time the average sensor value is calculated and emitted to the server
    uint32_t    averageTimer = millis(); //
    float       sumOfSensorData[sizeof(sensorPins) / sizeof(sensorPins[0])]; // Keeps the sum of sensorvalues since last time the average was


    bool        connectionEstablished = false; // boolean that is true while the client is connected to the server


    IELET2001_G24_PROSJEKT(const char* wifiSSID, const char* wifiPWD) {
        wifiNetwork     = wifiSSID;
        wifiPassword    = wifiPWD;
    };

    void    connectToWiFi();
    
    float   readNTC(int sensorPin);

    void    sendSensorData(void ((aClass)::*fnc)(const char, const char), aClass& a);
    void    sendAverage(void ((aClass)::*fnc)(const char, const char), aClass& a);

    void    changeSensorDelay(const char * newDelay, size_t length);
    void    changeAverageDelay(const char * newAvgDelay, size_t length);

};