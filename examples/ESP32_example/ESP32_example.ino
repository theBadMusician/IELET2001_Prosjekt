#include <IELET2001_G24_PROSJEKT.h>
#include <SocketIoClient.h>

SocketIoClient socket;
IELET2001_G24_PROSJEKT test("BadMusicianAP", "IB2A6CNFWFHWLT");

void setup() {
	Serial.begin(115200);

	test.sensorPins[0] = {34};
	test.sensorNames[0] = {"temp"};
	
	test.connectToWiFi();
	test.numberOfSensors = sizeof(test.sensorPins) / sizeof(test.sensorPins[0]);


	socket.begin("ubrukeligrobot.no", 80); // Opens a connection to the server

    // SocketIO events:
    socket.on("connect", socketConnected); // connection event fires when the connection between the client and the server is established
    socket.on("disconnect", socketDisconnected); // disconnect event fires when the connection between the client and the server is down
    socket.on("changeSensorDelay", test.changeSensorDelay);
    socket.on("changeAverageDelay", test.changeAverageDelay);
	
}

void loop() {
    socket.loop(); // keeps the socket.IO connection open
    
    if((millis() - test.sensorTimer > test.sensorDelay) && test.connectionEstablished == true) {
      // The sensordata is read and sent to the server with a time interval decided by the sensorDelay variable
      // If the client has no connection with the server, no data is collected and queued up
      test.sendSensorData(&SocketIoClient::emit, socket);
      test.sensorTimer = millis(); // resets the timer
    }

    
    if((millis() - test.averageTimer > test.averageDelay) && test.connectionEstablished == true){
      test.sendAverage(&SocketIoClient::emit, socket);
      test.averageTimer = millis();
    }
}

void socketConnected(const char * payload, size_t length){test.connectionEstablished = true;}
void socketDisconnected(const char * payload, size_t length){test.connectionEstablished = false;}
