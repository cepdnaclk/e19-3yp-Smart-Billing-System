package org.group17.pos.services;

import com.google.gson.Gson;
import org.json.JSONObject;
import com.google.gson.JsonElement;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URL;
import java.io.DataOutputStream;

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

    public JSONObject sendPostRequest(String url, String input) {
        try {
            // Specify the URL to which you want to send the POST request
            URI uri = new URI(url);
            URL apiURL = uri.toURL();

            // Create connection object
            HttpURLConnection connection = (HttpURLConnection) apiURL.openConnection();

            // Set the request method to POST
            connection.setRequestMethod("POST");

            // Enable input and output streams
            connection.setDoOutput(true);
            connection.setDoInput(true);

            // Set the content type
            connection.setRequestProperty("Content-Type", "application/json");

            // Get the output stream of the connection
            try (DataOutputStream out = new DataOutputStream(connection.getOutputStream())) {
                // Write the JSON data to the output stream
                out.writeBytes(input);
                out.flush();
            }

            // Get the response code
            int responseCode = connection.getResponseCode();
            System.out.println("Response Code: " + responseCode);

            // Read the response from the input stream
            try (BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()))) {
                String inputLine;
                StringBuilder response = new StringBuilder();

                while ((inputLine = in.readLine()) != null) {
                    response.append(inputLine);
                }

                // Close the connection
                connection.disconnect();

                // Return the response
//                System.out.println("Response: " + response.toString());
                return new JSONObject(response.toString());
            }

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}



