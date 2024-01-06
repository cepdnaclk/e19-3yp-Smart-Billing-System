package org.group17.pos.services;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class PythonScriptRunner {
    public static String runPythonScript(String scriptName, String... args) {
        try {
            // Get the path to the Python script from resources
            String scriptPath = PythonScriptRunner.class.getResource("/org/group17/pos/python/").getPath().substring(1)
                    + scriptName;

            String[] command = { "python", scriptPath };

            ProcessBuilder processBuilder = new ProcessBuilder(command);
            Process process = processBuilder.start();

            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            StringBuilder output = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line).append("\n");
            }

            int exitCode = process.waitFor();
            if (exitCode != 0) {
                System.err.println("Python script exited with error code: " + exitCode);
            }

            return output.toString();

        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
            return null;
        }
    }
}
