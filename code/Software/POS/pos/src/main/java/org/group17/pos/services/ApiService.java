package org.group17.pos.services;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URL;

public class ApiService {
    public static JsonElement sendGetRequest(String url) {
        try {
            URL apiUrl = new URI(url).toURL();
            HttpURLConnection connection = (HttpURLConnection) apiUrl.openConnection();
            connection.setRequestMethod("GET");

            int responseCode = connection.getResponseCode();
            System.out.println("Response Code: " + responseCode);

            // Read the response from the server
            BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
            StringBuilder response = new StringBuilder();
            String line;

            while ((line = reader.readLine()) != null) {
                response.append(line);
            }
            reader.close();

            connection.disconnect();

            // Parse JSON using Gson
            Gson gson = new Gson();
            return gson.fromJson(response.toString(), JsonElement.class);

        } catch (Exception e) {
            e.printStackTrace();
        }

        return null;
    }
}



