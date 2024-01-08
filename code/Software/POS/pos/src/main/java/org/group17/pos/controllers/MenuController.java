package org.group17.pos.controllers;

import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import org.group17.pos.models.Model;

import java.net.URL;
import java.util.ResourceBundle;

public class MenuController implements Initializable {

    public Button btnSales;
    public Button btnProducts;
    public Button btnReports;
    public Button btnContactUs;

    @Override
    public void initialize(URL url, ResourceBundle resourceBundle) {
        addListeners();
    }

    private void addListeners() {
        btnSales.setOnAction(event -> onSales());
        btnProducts.setOnAction(event -> onProducts());
        btnReports.setOnAction(event -> onReports());
    }

    public void onSales() {
        Model.getInstance().getViewFactory().getDashboardSelectedMenuItem().set("Sales");
    }

    public void onProducts() {
        Model.getInstance().getViewFactory().getDashboardSelectedMenuItem().set("Products");
    }

    public void onReports() {
        Model.getInstance().getViewFactory().getDashboardSelectedMenuItem().set("Reports");
    }
}