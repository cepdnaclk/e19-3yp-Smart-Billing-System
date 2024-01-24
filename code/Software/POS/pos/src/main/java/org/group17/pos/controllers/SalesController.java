package org.group17.pos.controllers;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.hivemq.client.mqtt.MqttGlobalPublishFilter;
import javafx.application.Platform;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.fxml.Initializable;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.TableColumn;
import javafx.scene.control.TableView;
import javafx.scene.control.cell.PropertyValueFactory;
import org.group17.pos.models.Model;
import org.group17.pos.models.Test;
import org.group17.pos.services.ApiService;
import org.group17.pos.services.PythonScriptRunner;
import org.json.JSONObject;
import com.hivemq.client.mqtt.mqtt5.Mqtt5Client;

import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.regex.Matcher;
import java.util.regex.Pattern;


import static java.lang.Integer.parseInt;

public class SalesController implements Initializable {
    public Label lblDate;
    public TableView<Test> tblSales;
    public TableColumn<Test, String> colProductID;
    public TableColumn<Test, String> colProductName;
    public TableColumn<Test, String> colCategory;
    public TableColumn<Test, String> colDescription;
    public TableColumn<Test, Double> colUnitPrice;
    public TableColumn<Test, Integer> colQuantity;
    public TableColumn<Test, Double> colAmount;
    public Label lblTotalValue;
    public Button btnPay;
    public Button btnScanItem;
    ObservableList<Test> testList = FXCollections.observableArrayList();
    public double total=0.00;
    public ArrayList<String> idList = new ArrayList<String>();
    public Map<String, Double> idMap = new ConcurrentHashMap<>();




//    ObservableList<Test> testList = FXCollections.observableArrayList(
//            new Test("P1","Apple","Food","Can eat",100.00, 10),
//            new Test("P2","Orange","Food","Can eat",80.50, 2),
//            new Test("P3","Book","Stationary","Can write",250.00, 13),
//            new Test("P4","Soap","Sanitary","Can wash",120.00, 2),
//            new Test("P5","Biscuit","Food","Can eat",75.00, 5),
//            new Test("P6","Pencil","Stationary","Can write",25.50, 10)
//    );

    @Override
    public void initialize(URL url, ResourceBundle resourceBundle){
//        colProductID.setCellValueFactory(new PropertyValueFactory<Test,String>("productID"));
//        colProductName.setCellValueFactory(new PropertyValueFactory<Test,String>("productName"));
//        colCategory.setCellValueFactory(new PropertyValueFactory<Test,String>("category"));
//        colDescription.setCellValueFactory(new PropertyValueFactory<Test,String>("description"));
//        colUnitPrice.setCellValueFactory(new PropertyValueFactory<Test,Double>("unitPrice"));
//        colQuantity.setCellValueFactory(new PropertyValueFactory<Test,Integer>("quantity"));
//        colAmount.setCellValueFactory(new PropertyValueFactory<Test,Double>("amount"));
//
//        tblSales.setItems(testList);
        LocalDate currentDate = LocalDate.now();

        // Print the current date in the default format (yyyy-MM-dd)
        System.out.println("Current Date: " + currentDate);

        // You can also format the date as a string with a specific pattern
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MMM-yyyy");
        String formattedDate = currentDate.format(formatter);
        lblDate.setText(formattedDate);

        AtomicInteger weightPrev = new AtomicInteger();
        AtomicBoolean capture = new AtomicBoolean(true);
        final var asyncClient = Mqtt5Client.builder() // 1
                .identifier("async-subscriber") // 1
                .serverHost("192.168.137.1") // 1
                .serverPort(1883) // 1
                .buildAsync(); // 1

        asyncClient.publishes(MqttGlobalPublishFilter.ALL, publish -> { // 2
            String payload = new String(publish.getPayloadAsBytes(), StandardCharsets.UTF_8);

            try {
                ObjectMapper objectMapper = new ObjectMapper();
                JsonNode jsonNode = objectMapper.readTree(payload);

                // Assuming the payload structure is similar to the provided JSON
                JsonNode dataNode = jsonNode.get("data");
                JsonNode weightMeasureNode = dataNode.get("weight_measure");

                String timestamp = weightMeasureNode.get("timestamp").asText();
                int weight = weightMeasureNode.get("weight").asInt();
                String deviceStatus = dataNode.get("device_status").asText();

                // Now you can use timestamp, weight, and deviceStatus as needed
//                System.out.println("Timestamp: " + timestamp);
//                System.out.println("Weight: " + weight);
//                System.out.println("Device Status: " + deviceStatus);

                if(weight == 0){
                    capture.set(true);
                }

                if(weight >0 && (weight - weightPrev.get()) == 0 && capture.get()){
                    System.out.println("captured");
                    capture.set(false);
                    scanItem();
                }

                weightPrev.set(weight);

            } catch (Exception e) {
                e.printStackTrace();
                // Handle parsing exception
            }
        }); // 2

        asyncClient.connect()
                .thenCompose(connAck -> { // 4
                    System.out.println("Successfully connected!"); // 4.1
                    return asyncClient.subscribeWith().topicFilter("3yp_device_1/main_controller").send(); // 4.2
                }).thenRun(() -> {
                    System.out.println("Successfully subscribed!"); // 5
                }).exceptionally(throwable -> { // 6
                    System.out.println("Something went wrong!"); // 6
                    return null; // 6
                });
        addListeners();
    }

    private void addListeners() {
        btnScanItem.setOnAction(event -> scanItem());
        btnPay.setOnAction(event -> pay());
    }

    public void scanItem() {
        // Use PythonRunner class to execute Python scripts from resources
        String scriptName = "client.py";
        String result = PythonScriptRunner.runPythonScript(scriptName);
        System.out.println("Python script output:\n" + result);
        assert result != null;
        result = result.replace("\n", "").replace("\r", "");
        System.out.println("Python script output:\n" + result);
        if(result.length() > 1){
        Pattern pattern = Pattern.compile("b\\s*(.+)");

        // Create a matcher
        Matcher matcher = pattern.matcher(result);

        // Find the matching substring
        String match = null;
        if (matcher.find()) {
            // Extract the matched portion (group 1)
            match = matcher.group(1);
            match = match.replace("'", "");
            int matched = parseInt(match);
            // Print the result
            System.out.println("Extracted string after 'step': " + matched);
        } else {
            System.out.println("No match found.");
        }

        result = match;}
        assert result != null;
//        result = result.replace("\n", "").replace("\r", "");

        // Encode the result before appending it to the URL
        String encodedResult = URLEncoder.encode(result, StandardCharsets.UTF_8);
        System.out.println("Encoded Python script output:\n" + encodedResult);

        String url = "http://192.168.137.1:5555/product/productid/" + encodedResult;
        JsonElement jsonResponse = ApiService.sendGetRequest(url);

        JsonObject jsonObject = null;
        if (jsonResponse != null) {
            System.out.println("Response: " + jsonResponse.getAsJsonArray().get(0));
            jsonObject = (JsonObject) jsonResponse.getAsJsonArray().get(0);
            System.out.println(jsonObject);
            System.out.println(jsonObject.get("_id"));
            idList.add(String.valueOf(jsonObject.get("_id")));
            idMap.put(String.valueOf(jsonObject.get("_id")), Double.parseDouble(String.valueOf(jsonObject.get("price"))));
        } else {
            System.out.println("Failed to retrieve JSON response.");
        }
        assert jsonObject != null;

        String productID = String.valueOf(jsonObject.get("productID"));
        productID = productID.replace("\"", "");
        String productName = String.valueOf(jsonObject.get("productName"));
        productName = productName.replace("\"", "");
        String category = "Category " + productID;
        String description = "Description " + productName;
        double unitPrice = Double.parseDouble(String.valueOf(jsonObject.get("price")));
//        int quantity = Integer.parseInt(String.valueOf(jsonObject.get("quantityInStock")));
        int quantity = 1;

        testList.add(new Test(productID, productName, category, description, unitPrice, quantity));

        colProductID.setCellValueFactory(new PropertyValueFactory<>("productID"));
        colProductName.setCellValueFactory(new PropertyValueFactory<>("productName"));
        colCategory.setCellValueFactory(new PropertyValueFactory<>("category"));
        colDescription.setCellValueFactory(new PropertyValueFactory<>("description"));
        colUnitPrice.setCellValueFactory(new PropertyValueFactory<>("unitPrice"));
        colQuantity.setCellValueFactory(new PropertyValueFactory<>("quantity"));
        colAmount.setCellValueFactory(new PropertyValueFactory<>("amount"));

        tblSales.setItems(testList);
        total = total + (unitPrice * quantity);
        Platform.runLater(() -> {
            lblTotalValue.setText(String.format("%.2f", total) + " LKR");
        });

    }

    public void pay() {
        String url = "http://192.168.137.1:5555/bill/";
        String encodedTotal = URLEncoder.encode(String.valueOf(total), StandardCharsets.UTF_8);
        String input = "{\"totalAmount\":\"" + encodedTotal + "\"}";
        ApiService sender = new ApiService();
        JSONObject response = sender.sendPostRequest(url, input);
//        System.out.println(response);
        System.out.println(response.get("_id"));
        String billID = (String) response.get("_id");
        String encodedBillID = URLEncoder.encode(billID, StandardCharsets.UTF_8);
        System.out.println(idList);
        System.out.println(idMap);

        for (Map.Entry<String, Double> entry : idMap.entrySet()) {
            String productID = entry.getKey();
            String encodedProductID = URLEncoder.encode(productID, StandardCharsets.UTF_8);
            Double unitPrice = entry.getValue();
            String encodedUnitPrice = URLEncoder.encode(String.valueOf(unitPrice), StandardCharsets.UTF_8);
            int quantity = 0;
            for (String element : idList) {
                if (element != null && element.equals(productID)) {
                    quantity++;
                }
            }
            String encodedQuantity = URLEncoder.encode(String.valueOf(quantity), StandardCharsets.UTF_8);
            System.out.println("Key: " + productID + ", Value: " + unitPrice + ", Quantity: " + quantity);
            String url2 = "http://192.168.137.1:5555/itempurchased/";
            String input2 = "{\"billID\":\"" + encodedBillID + "\",\"productID\":\"" + encodedProductID + "\", \"quantity\":\"" + encodedQuantity + "\", \"unitPrice\":\"" + encodedUnitPrice + "\"}";
            ApiService sender2 = new ApiService();
            JSONObject response2 = sender2.sendPostRequest(url2, input2);
            System.out.println("Invoice " + response2.get("_id"));
            Model.getInstance().getViewFactory().getDashboardSelectedMenuItem().set("Sales");
        }
    }
}
