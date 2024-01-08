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
    }
}