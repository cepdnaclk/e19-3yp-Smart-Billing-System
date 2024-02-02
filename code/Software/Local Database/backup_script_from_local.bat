@echo off

set ATLAS_CONNECTION_STRING=mongodb://localhost:27017/test

mongodump --uri="%ATLAS_CONNECTION_STRING%" --out C:\Users\akash\Desktop\mongoLocal\backup