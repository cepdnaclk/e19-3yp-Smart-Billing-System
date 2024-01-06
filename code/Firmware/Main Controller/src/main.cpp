#include <Arduino.h>
#include "HX711.h"
#include <TFT_eSPI.h> // Graphics and font library for ST7735 driver chip
#include <SPI.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <WiFiClientSecure.h>

// const char* ssid = "Akash’s iPhone";
// const char* password = "aaaaaaaa";
// const char* mqttServer = "t305b0a9.ala.asia-southeast1.emqxsl.com";
// const int   mqttPort = 8883;
// const char* mqttUser = "e19453";
// const char* mqttPassword = "r2aphc3NSk3K9SP";
// const char* mqttTopic = "3yp_device_1/main_module";

// Public client
const char* ssid = "Akash’s iPhone";
const char* password = "aaaaaaaa";
const char* mqttServer = "broker.emqx.io";
const int   mqttPort = 1883;
const char* mqttUser = "emqx-test";
const char* mqttPassword = "emqx-test";
const char* mqttTopic = "3yp_device_1/main_controller";

WiFiClient espClient;
PubSubClient client(espClient);

TFT_eSPI tft = TFT_eSPI();  // Invoke library, pins defined in User_Setup.h
HX711 scale;

const int LOADCELL_DOUT_PIN = 14;
const int LOADCELL_SCK_PIN = 13;

const float knownWeight = 5000;

// const char* ca_cert = 
// "-----BEGIN CERTIFICATE-----\n"
// "MIIDrzCCApegAwIBAgIQCDvgVpBCRrGhdWrJWZHHSjANBgkqhkiG9w0BAQUFADBh\n"
// "MQswCQYDVQQGEwJVUzEVMBMGA1UEChMMRGlnaUNlcnQgSW5jMRkwFwYDVQQLExB3\n"
// "d3cuZGlnaWNlcnQuY29tMSAwHgYDVQQDExdEaWdpQ2VydCBHbG9iYWwgUm9vdCBD\n"
// "QTAeFw0wNjExMTAwMDAwMDBaFw0zMTExMTAwMDAwMDBaMGExCzAJBgNVBAYTAlVT\n"
// "MRUwEwYDVQQKEwxEaWdpQ2VydCBJbmMxGTAXBgNVBAsTEHd3dy5kaWdpY2VydC5j\n"
// "b20xIDAeBgNVBAMTF0RpZ2lDZXJ0IEdsb2JhbCBSb290IENBMIIBIjANBgkqhkiG\n"
// "9w0BAQEFAAOCAQ8AMIIBCgKCAQEA4jvhEXLeqKTTo1eqUKKPC3eQyaKl7hLOllsB\n"
// "CSDMAZOnTjC3U/dDxGkAV53ijSLdhwZAAIEJzs4bg7/fzTtxRuLWZscFs3YnFo97\n"
// "nh6Vfe63SKMI2tavegw5BmV/Sl0fvBf4q77uKNd0f3p4mVmFaG5cIzJLv07A6Fpt\n"
// "43C/dxC//AH2hdmoRBBYMql1GNXRor5H4idq9Joz+EkIYIvUX7Q6hL+hqkpMfT7P\n"
// "T19sdl6gSzeRntwi5m3OFBqOasv+zbMUZBfHWymeMr/y7vrTC0LUq7dBMtoM1O/4\n"
// "gdW7jVg/tRvoSSiicNoxBN33shbyTApOB6jtSj1etX+jkMOvJwIDAQABo2MwYTAO\n"
// "BgNVHQ8BAf8EBAMCAYYwDwYDVR0TAQH/BAUwAwEB/zAdBgNVHQ4EFgQUA95QNVbR\n"
// "TLtm8KPiGxvDl7I90VUwHwYDVR0jBBgwFoAUA95QNVbRTLtm8KPiGxvDl7I90VUw\n"
// "DQYJKoZIhvcNAQEFBQADggEBAMucN6pIExIK+t1EnE9SsPTfrgT1eXkIoyQY/Esr\n"
// "hMAtudXH/vTBH1jLuG2cenTnmCmrEbXjcKChzUyImZOMkXDiqw8cvpOp/2PV5Adg\n"
// "06O/nVsJ8dWO41P0jmP6P6fbtGbfYmbW0W5BjfIttep3Sp+dWOIrWcBAI+0tKIJF\n"
// "PnlUkiaY4IBIqDfv8NZ5YBberOgOzW6sRBc4L0na4UU+Krk2U886UAb3LujEV0ls\n"
// "YSEY1QSteDwsOoBrp+uvFRTp2InBuThs4pFsiv9kuXclVzDAGySj4dzp30d8tbQk\n"
// "CAUw7C29C79Fv1C5qfPrmAESrciIxpg0X40KPMbp1ZWVbd4=\n"
// "-----END CERTIFICATE-----";

// Public

// const char* ca_cert = 
// "-----BEGIN CERTIFICATE-----\n"
// "MIIDjjCCAnagAwIBAgIQAzrx5qcRqaC7KGSxHQn65TANBgkqhkiG9w0BAQsFADBh\n"
// "MQswCQYDVQQGEwJVUzEVMBMGA1UEChMMRGlnaUNlcnQgSW5jMRkwFwYDVQQDExB3\n"
// "d3cuZGlnaWNlcnQuY29tMSAwHgYDVQQDExdEaWdpQ2VydCBHbG9iYWwgUm9vdCBH\n"
// "MjAeFw0xMzA4MDExMjAwMDBaFw0zODAxMTUxMjAwMDBaMGExCzAJBgNVBAYTAlVT\n"
// "MRUwEwYDVQQKEwxEaWdpQ2VydCBJbmMxGTAXBgNVBAsTEHd3dy5kaWdpY2VydC5j\n"
// "b20xIDAeBgNVBAMTF0RpZ2lDZXJ0IEdsb2JhbCBSb290IEcyMIIBIjANBgkqhkiG\n"
// "9w0BAQEFAAOCAQ8AMIIBCgKCAQEAuzfNNNx7a8myaJCtSnX/RrohCgiN9RlUyfuI\n"
// "2/Ou8jqJkTx65qsGGmvPrC3oXgkkRLpimn7Wo6h+4FR1IAWsULecYxpsMNzaHxmx\n"
// "1x7e/dfgy5SDN67sH0NO3Xss0r0upS/kqbitOtSZpLYl6ZtrAGCSYP9PIUkY92eQ\n"
// "q2EGnI/yuum06ZIya7XzV+hdG82MHauVBJVJ8zUtluNJbd134/tJS7SsVQepj5Wz\n"
// "tCO7TG1F8PapspUwtP1MVYwnSlcUfIKdzXOS0xZKBgyMUNGPHgm+F6HmIcr9g+UQ\n"
// "vIOlCsRnKPZzFBQ9RnbDhxSJITRNrw9FDKZJobq7nMWxM4MphQIDAQABo0IwQDAP\n"
// "BgNVHRMBAf8EBTADAQH/MA4GA1UdDwEB/wQEAwIBhjAdBgNVHQ4EFgQUTiJUIBiV\n"
// "5uNu5g/6+rkS7QYXjzkwDQYJKoZIhvcNAQELBQADggEBAGBnKJRvDkhj6zHd6mcY\n"
// "1Yl9PMWLSn/pvtsrF9+wX3N3KjITOYFnQoQj8kVnNeyIv/iPsGEMNKSuIEyExtv4\n"
// "NeF22d+mQrvHRAiGfzZ0JFrabA0UWTW98kndth/Jsw1HKj2ZL7tcu7XUIOGZX1NG\n"
// "Fdtom/DzMNU+MeKNhJ7jitralj41E6Vf8PlwUHBHQRFXGU7Aj64GxJUTFy8bJZ91\n"
// "8rGOmaFvE7FBcf6IKshPECBV1/MUReXgRPTqh5Uykw7+U0b6LJ3/iyK5S9kJRaTe\n"
// "pLiaWN0bfVKfjllDiIGknibVb63dDcY3fe0Dkhvld1927jyNxF1WW6LZZm6zNTfl\n"
// "MrY=\n"
// "-----END CERTIFICATE-----";

void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    tft.println("Attempting MQTT connection...");
    Serial.println("Attempting MQTT connection...");
    // Create a random client ID
    String clientId = "ESP32Client";
    // Attempt to connect
    if (client.connect(clientId.c_str())) {
      tft.println("connected");
      Serial.println("connected");
    } else {
      tft.print("failed, rc=");
      Serial.print("failed, rc=");
      tft.println(client.state());
      Serial.println(client.state());
      delay(5000);
    }
    tft.setCursor(0,0,2);
    tft.fillScreen(TFT_BLACK);
  }
}

void setup() {
  // Initialize tft screen
  tft.init();
  tft.setRotation(1);
  Serial.begin(115200);

  // Initialize load cell
  scale.begin(LOADCELL_DOUT_PIN, LOADCELL_SCK_PIN);
  scale.set_scale();
  scale.tare();
  scale.set_scale(0.424);

  tft.setCursor(0,0,2);
  tft.fillScreen(TFT_BLACK);

  delay(10);
  tft.setCursor(0,0,2);
  tft.fillScreen(TFT_BLACK);
  tft.println("Connecting to WiFi");
  Serial.println("Connecting to WiFi...");
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    tft.print(".");
    Serial.print(".");
  }
  tft.println("");
  tft.println("WiFi connected");
  delay(500);
  tft.setCursor(0,0,2);
  tft.fillScreen(TFT_BLACK);
  Serial.println("");
  Serial.println("WiFi connected");

  // Mqtt setup
  client.setServer(mqttServer, mqttPort);
  // espClient.setCACert(ca_cert); // Set CA certificate
}

void loop() {
  if (!client.connected()) {
    client.connect("MyESP32Client");
    // reconnect();
    tft.setCursor(0,0,2);
    tft.fillScreen(TFT_BLACK);
    tft.println("mqtt reconnecting");
    Serial.println("mqtt reconnecting");
    delay(500);
  }

  // Read from Load Cell
  long loadValue;
  if (scale.is_ready()) {
    loadValue = scale.get_units();

    // Create a JSON object
    StaticJsonDocument<200> doc; // Adjust the capacity as per your JSON object size

    // Populate the JSON object with data
    JsonObject data = doc.createNestedObject("data");
    JsonObject weightMeasure = data.createNestedObject("weight_measure");
    weightMeasure["timestamp"] = "2024-01-04T12:00:00Z";
    weightMeasure["weight"] = loadValue;
    data["device_status"] = "online";

    // Serialize the JSON object to a string
    String jsonStr;
    serializeJson(doc, jsonStr);
    
    // Convert the String to char array
    char charBuf[jsonStr.length() + 1];
    jsonStr.toCharArray(charBuf, sizeof(charBuf));

    // Publish the JSON payload to the MQTT topic
    client.publish(mqttTopic, charBuf);
    tft.setCursor(0,0,2);
    tft.fillScreen(TFT_BLACK);
    tft.print("Topic : ");
    Serial.print("Topic : ");
    tft.println(mqttTopic);
    Serial.println(mqttTopic);
    delay(500);
  }
  else{
      loadValue = -1;
  }

  tft.setCursor(0,0,2);
  tft.fillScreen(TFT_BLACK);
  tft.print("Value : ");
  Serial.print("Value : ");
  tft.print(loadValue);
  Serial.print(loadValue);
  delay(2000);
}