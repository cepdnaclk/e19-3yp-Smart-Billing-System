package org.group17.pos.views;

import javafx.fxml.FXMLLoader;
import javafx.scene.Scene;
import javafx.scene.image.Image;
import javafx.scene.layout.AnchorPane;
import javafx.stage.Stage;
import org.group17.pos.Main;
import org.group17.pos.controllers.DashboardController;

public class ViewFactory {
    private AnchorPane salesView;

    public ViewFactory(){}

    public AnchorPane getSalesView(){
        if(salesView == null){
            try{
                salesView = new FXMLLoader(getClass().getResource("/fxml/Sales.fxml")).load();
            }catch (Exception e){
                e.printStackTrace();
            }
        }
        return salesView;
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
}
