package org.group17.pos;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import javafx.application.Application;
import javafx.stage.Stage;
import org.group17.pos.models.Model;
import org.group17.pos.services.ApiService;

import java.io.IOException;

public class Main extends Application {
    @Override
    public void start(Stage stage) throws Exception {
        Model.getInstance().getViewFactory().showDashboardWindow();


        String url = "https://smart-billing-system-50913e9a24e6.herokuapp.com/product/productid/0";
        JsonElement jsonResponse = ApiService.sendGetRequest(url);

        // Access data from the JSON response
        if (jsonResponse != null) {
            System.out.println("Response: " + jsonResponse.getAsJsonArray().get(0));
            JsonObject jsonObject = (JsonObject) jsonResponse.getAsJsonArray().get(0);
            System.out.println(jsonObject);
            System.out.println(jsonObject.get("productName"));
            // Process the JSON data as needed
        } else {
            System.out.println("Failed to retrieve JSON response.");
        }

    }
}