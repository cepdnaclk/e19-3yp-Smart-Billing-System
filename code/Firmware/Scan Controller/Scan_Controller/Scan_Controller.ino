#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include "esp_camera.h"
#include "esp_http_server.h"

#define CAMERA_MODEL_AI_THINKER // Has PSRAM

#define PWDN_GPIO_NUM     32
#define RESET_GPIO_NUM    -1
#define XCLK_GPIO_NUM      0
#define SIOD_GPIO_NUM     26
#define SIOC_GPIO_NUM     27

#define Y9_GPIO_NUM       35
#define Y8_GPIO_NUM       34
#define Y7_GPIO_NUM       39
#define Y6_GPIO_NUM       36
#define Y5_GPIO_NUM       21
#define Y4_GPIO_NUM       19
#define Y3_GPIO_NUM       18
#define Y2_GPIO_NUM        5
#define VSYNC_GPIO_NUM    25
#define HREF_GPIO_NUM     23
#define PCLK_GPIO_NUM     22


// Define the credentials of your local network
const char* ssid = "Dialog 4G";
const char* password = "3HB2DL4BNT8";
const char* mqttServer = "broker.emqx.io";
const int   mqttPort = 1883;
const char* mqttUser = "emqx-test";
const char* mqttPassword = "emqx-test";
const char* mqttTopic = "3yp_device_1/scan_controller";

// Function to start the HTTP server and handle requests
WiFiClient espClient;
httpd_handle_t start_webserver();
PubSubClient client(espClient);

// Initialize the camera
void init_camera();

camera_config_t config;

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }

  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
  
  init_camera();

  // Start the HTTP server
  start_webserver();

  // Mqtt Server
  client.setServer(mqttServer, mqttPort);
}

void loop() {
  delay(1000);

  if (!client.connected()) {
    client.connect("ESP32_SCAN_Client");
    // reconnect(); // commented due to not working in public broker
    Serial.println("mqtt reconnecting");
  }

  // Create a JSON object
  StaticJsonDocument<200> doc; // Adjust the capacity as per your JSON object size

  // Populate the JSON object with data
  JsonObject data = doc.createNestedObject("data");
  JsonObject weightMeasure = data.createNestedObject("scan_measure");
  weightMeasure["timestamp"] = "2024-01-04T12:00:00Z";
  data["device_status"] = "online";

  // Serialize the JSON object to a string
  String jsonStr;
  serializeJson(doc, jsonStr);
  
  // Convert the String to char array
  char charBuf[jsonStr.length() + 1];
  jsonStr.toCharArray(charBuf, sizeof(charBuf));

  // Publish the JSON payload to the MQTT topic
  client.publish(mqttTopic, charBuf);
  Serial.println(mqttTopic);

}

void init_camera() {
  // Camera configuration
  config.ledc_channel = LEDC_CHANNEL_0;
  config.ledc_timer = LEDC_TIMER_0;
  config.pin_d0 = Y2_GPIO_NUM;
  config.pin_d1 = Y3_GPIO_NUM;
  config.pin_d2 = Y4_GPIO_NUM;
  config.pin_d3 = Y5_GPIO_NUM;
  config.pin_d4 = Y6_GPIO_NUM;
  config.pin_d5 = Y7_GPIO_NUM;
  config.pin_d6 = Y8_GPIO_NUM;
  config.pin_d7 = Y9_GPIO_NUM;
  config.pin_xclk = XCLK_GPIO_NUM;
  config.pin_pclk = PCLK_GPIO_NUM;
  config.pin_vsync = VSYNC_GPIO_NUM;
  config.pin_href = HREF_GPIO_NUM;
  config.pin_sccb_sda = SIOD_GPIO_NUM;
  config.pin_sccb_scl = SIOC_GPIO_NUM;
  config.pin_pwdn = PWDN_GPIO_NUM;
  config.pin_reset = RESET_GPIO_NUM;
  config.xclk_freq_hz = 20000000;
  config.frame_size = FRAMESIZE_UXGA;
  config.pixel_format = PIXFORMAT_JPEG; // for streaming
  // config.pixel_format = PIXFORMAT_GRAYSCALE; // for face detection/recognition
  config.grab_mode = CAMERA_GRAB_LATEST;
  config.fb_location = CAMERA_FB_IN_PSRAM;
  config.jpeg_quality = 10;
  config.fb_count = 1;

  esp_err_t err = esp_camera_init(&config);
  if (err != ESP_OK) {
    Serial.println("Camera Init Failed");
    return;
  }

  // Enable flash
  pinMode(4, OUTPUT);
  digitalWrite(4, LOW); // Turn off flash initially
}

httpd_handle_t start_webserver() {
  httpd_config_t config = HTTPD_DEFAULT_CONFIG();

  httpd_handle_t server;
  if (httpd_start(&server, &config) == ESP_OK) {
    // Serve the captured image upon receiving a request
    httpd_uri_t capture_uri = {
        .uri       = "/capture",
        .method    = HTTP_GET,
        .handler   = capture_handler,
        .user_ctx  = NULL
    };
    httpd_register_uri_handler(server, &capture_uri);
  }
  return server;
}

esp_err_t capture_handler(httpd_req_t *req) {
  camera_fb_t *fb = NULL;
  esp_err_t res = ESP_OK;

  // Turn on flash
  digitalWrite(4, HIGH);

  // Capture an image
  fb = esp_camera_fb_get();
  if (!fb) {
    Serial.println("Camera capture failed");
    httpd_resp_send_500(req);
    return ESP_FAIL;
  }

  // Clean the buffer
  esp_camera_fb_return(fb);

  // Turn off flash after capturing the image
  digitalWrite(4, LOW);

  // Capture another image
  fb = esp_camera_fb_get();
  if (!fb) {
    Serial.println("Camera capture failed");
    httpd_resp_send_500(req);
    return ESP_FAIL;
  }


  // Prepare HTTP response headers
  httpd_resp_set_type(req, "image/jpeg");
  httpd_resp_set_hdr(req, "Content-Disposition", "inline; filename=captured.jpg");

  // Send the image data in the response
  res = httpd_resp_send(req, (const char *)fb->buf, fb->len);

  // Clean up the frame buffer regardless of the result of httpd_resp_send
  esp_camera_fb_return(fb);

  // If httpd_resp_send failed, return its error code
  if (res != ESP_OK) {
    return res;
  }

  return ESP_OK;
}
