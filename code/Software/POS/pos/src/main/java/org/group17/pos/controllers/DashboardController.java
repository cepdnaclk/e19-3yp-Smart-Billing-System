package org.group17.pos.controllers;

import javafx.fxml.Initializable;
import javafx.scene.layout.BorderPane;
import org.group17.pos.models.Model;

import java.net.URL;
import java.util.ResourceBundle;

public class DashboardController implements Initializable {

    public BorderPane dashboard_parent;

    @Override
    public void initialize(URL url, ResourceBundle resourceBundle) {
        Model.getInstance().getViewFactory().getDashboardSelectedMenuItem().addListener((observableValue, oldVal, newVal)-> {
            switch (newVal) {
                case "Products" -> dashboard_parent.setCenter(Model.getInstance().getViewFactory().getProductsView());
                case "Reports" -> dashboard_parent.setCenter(Model.getInstance().getViewFactory().getReportsView());
                default -> dashboard_parent.setCenter(Model.getInstance().getViewFactory().getSalesView());
            }
        });
    }
}
