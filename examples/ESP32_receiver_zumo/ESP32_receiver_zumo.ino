#include <Arduino.h>
#include <WiFi.h>
#include <SocketIoClient.h>

const char *ssid = "esp32wifi";
const char *password = "gruppe24";

// Time check variables
uint32_t timeCheck = 0;

struct dataPackage
{
    uint8_t LR_value = 0;
    uint8_t UD_value = 0;
};
dataPackage data;

/// Socket.IO Settings ///
char host[] = "192.168.43.101"; // Socket.IO Server Address
int port = 3000; // Socket.IO Port Address
char path[] = "/socket.io/?transport=websocket"; // Socket.IO Base Path
bool useSSL = false; // Use SSL Authentication

SocketIoClient webSocket;
WiFiClient client;

void socket_Connected(const char *payload, size_t length);
void socket_Disonnected(const char *payload, size_t length);
void socketDirectControlKeys(const char *payload, size_t length);

void setup()
{

    //initialize Serial Monitor
    Serial.begin(115200);
    Serial2.begin(115200, SERIAL_8N1, -1, 17);

    // WIFI setup
    WiFi.mode(WIFI_STA);
    WiFi.begin(ssid, password);
    while (WiFi.waitForConnectResult() != WL_CONNECTED)
    {
        Serial.println("Connection Failed! Rebooting...");
        delay(5000);
        ESP.restart();
    }

    webSocket.begin(host, port, path);

    // Websockets
    webSocket.on("connect", socket_Connected);
    webSocket.on("disconnect", socket_Disonnected);
    webSocket.on("zumoControlToESP", socketDirectControlKeys);

    
    // Time checks setup
    timeCheck = millis();
}

void loop()
{
webSocket.loop();
}

void socket_Connected(const char *payload, size_t length)
{
    Serial.println("Socket.IO Connected!");
}

void socket_Disonnected(const char *payload, size_t length)
{
    Serial.println("Socket.IO Disconnected!");
}

void socketDirectControlKeys(const char *payload, size_t length)
{
	Serial.println(payload);
    Serial.print("got message: ");
    
    if (data.LR_value != *(payload)-48)
        data.LR_value = *(payload)-48;
    Serial.println(data.LR_value);
    Serial2.write((uint8_t *)&data, sizeof(dataPackage));
}
