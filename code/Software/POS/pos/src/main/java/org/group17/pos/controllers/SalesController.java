package org.group17.pos.controllers;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
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

import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

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
        addListeners();
    }

    private void addListeners() {
        btnScanItem.setOnAction(event -> scanItem());
        btnPay.setOnAction(event -> pay());
    }

    public void scanItem() {
        // Use PythonRunner class to execute Python scripts from resources
        String scriptName = "main.py";
        String result = PythonScriptRunner.runPythonScript(scriptName);
        System.out.println("Python script output:\n" + result);
        assert result != null;
        result = result.replace("\n", "").replace("\r", "");
        System.out.println("Python script output:\n" + result);
        Pattern pattern = Pattern.compile("step\\s*(.+)");

        // Create a matcher
        Matcher matcher = pattern.matcher(result);

        // Find the matching substring
        String match = null;
        if (matcher.find()) {
            // Extract the matched portion (group 1)
            match = matcher.group(1);

            // Print the result
            System.out.println("Extracted string after 'step': " + match);
        } else {
            System.out.println("No match found.");
        }

        result = match;
        assert result != null;
//        result = result.replace("\n", "").replace("\r", "");

        // Encode the result before appending it to the URL
        String encodedResult = URLEncoder.encode(result, StandardCharsets.UTF_8);
        System.out.println("Encoded Python script output:\n" + encodedResult);

        String url = "https://smart-billing-system-50913e9a24e6.herokuapp.com/product/productid/" + encodedResult;
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
        String category = "Food";
        String description = "Can eat";
        double unitPrice = Double.parseDouble(String.valueOf(jsonObject.get("price")));
        int quantity = Integer.parseInt(String.valueOf(jsonObject.get("quantityInStock")));

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
        lblTotalValue.setText(String.format("%.2f", total) + " LKR");
    }

    public void pay() {
        String url = "https://smart-billing-system-50913e9a24e6.herokuapp.com/bill/";
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
            String url2 = "https://smart-billing-system-50913e9a24e6.herokuapp.com/itempurchased/";
            String input2 = "{\"billID\":\"" + encodedBillID + "\",\"productID\":\"" + encodedProductID + "\", \"quantity\":\"" + encodedQuantity + "\", \"unitPrice\":\"" + encodedUnitPrice + "\"}";
            ApiService sender2 = new ApiService();
            JSONObject response2 = sender2.sendPostRequest(url2, input2);
            System.out.println("Invoice " + response2.get("_id"));
            Model.getInstance().getViewFactory().getDashboardSelectedMenuItem().set("Sales");
        }
    }
}
