package org.group17.pos.controllers;

import javafx.beans.Observable;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.fxml.Initializable;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.TableColumn;
import javafx.scene.control.TableView;
import javafx.scene.control.cell.PropertyValueFactory;
import org.group17.pos.models.Test;
import org.group17.pos.services.PythonScriptRunner;

import java.net.URL;
import java.util.ResourceBundle;

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
        addListeners();
    }

    private void addListeners() {
        btnScanItem.setOnAction(event -> scanItem());
    }

    public void scanItem() {
        // Use PythonRunner class to execute Python scripts from resources
        String scriptName = "main.py";
        String result = PythonScriptRunner.runPythonScript(scriptName);
        System.out.println("Python script output:\n" + result);
    }
}
