@echo off

set ATLAS_CONNECTION_STRING=mongodb://localhost:27017/test

mongorestore --uri="%ATLAS_CONNECTION_STRING%" C:\Users\akash\Desktop\mongoLocal\backup\test