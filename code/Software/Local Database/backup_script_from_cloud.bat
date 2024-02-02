@echo off

set ATLAS_CONNECTION_STRING=mongodb+srv://waakashmuthumal:6BLVXANaBqGnHT9u@cluster0.wczoycw.mongodb.net/?retryWrites=true&w=majority

mongodump --uri="%ATLAS_CONNECTION_STRING%" --out C:\Users\akash\Desktop\mongoLocal\backup