package org.group17.pos.views;

import javafx.beans.property.SimpleStringProperty;
import javafx.beans.property.StringProperty;
import javafx.fxml.FXMLLoader;
import javafx.scene.Scene;
import javafx.scene.image.Image;
import javafx.scene.layout.AnchorPane;
import javafx.stage.Stage;
import org.group17.pos.Main;
import org.group17.pos.controllers.DashboardController;

public class ViewFactory {
    private final StringProperty dashboardSelectedMenuItem;
    private AnchorPane salesView;
    private AnchorPane productsView;
    private AnchorPane reportsView;

    public ViewFactory(){
        this.dashboardSelectedMenuItem = new SimpleStringProperty("");
    }

    public StringProperty getDashboardSelectedMenuItem() {
        return dashboardSelectedMenuItem;
    }

    public AnchorPane getSalesView(){
        if(salesView == null){
            try{
                salesView = new FXMLLoader(Main.class.getResource("fxml/Sales.fxml")).load();
            }catch (Exception e){
                e.printStackTrace();
            }
        }
        return salesView;
    }

    public AnchorPane getProductsView() {
        if(productsView == null){
            try{
                productsView = new FXMLLoader(Main.class.getResource("fxml/Products.fxml")).load();
            }catch (Exception e){
                e.printStackTrace();
            }
        }
        return productsView;
    }

    public AnchorPane getReportsView() {
        if(reportsView == null){
            try{
                reportsView = new FXMLLoader(Main.class.getResource("fxml/Reports.fxml")).load();
            }catch (Exception e){
                e.printStackTrace();
            }
        }
        return reportsView;
    }

    public void showDashboardWindow(){
        FXMLLoader loader = new FXMLLoader(Main.class.getResource("fxml/Dashboard.fxml"));
        DashboardController dashboardController = new DashboardController();
        loader.setController(dashboardController);
        createStage(loader);
    }

    public void createStage(FXMLLoader loader){
        Scene scene = null;
        try {
            scene = new Scene(loader.load());
        } catch (Exception e) {
            e.printStackTrace();
        }
        Stage stage = new Stage();
        Image icon = new Image("logo_square.png");
        stage.getIcons().add(icon);
        stage.setScene(scene);
        stage.setTitle("Smart Billing System");
        stage.show();
    }

    public void closeStage(Stage stage){
        stage.close();
    }
}
