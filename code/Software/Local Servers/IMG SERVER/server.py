import socket
import os
import os
from keras.models import load_model
import cv2
import numpy as np
import tensorflow as tf
import time
import requests
import os
from io import BytesIO
from pyzbar.pyzbar import decode, ZBarSymbol
from PIL import Image

global counter

# Create a socket object
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

# Define the port on which you want to connect
# server_addr = (socket.gethostname(), 2019)
server_addr = ('192.168.137.1', 2019)

# Bind to the port
s.bind(server_addr)

# Allow up to 5 queued connections
s.listen(5)
print("server started and listening on port 2019")

while True:
    # Establish connection with client
    client, address = s.accept()
    print(f"Connection from {address} has been established!")

    start_time = time.time()

    # Receive the image file
    with open('received_image.jpg', 'wb') as f:

        print('file opened')
        while True:
            # print('receiving data...')
            data = client.recv(1024)
            if not data:
                break
            # Write data to a file
            f.write(data)

    print('Successfully received the file')
    f.close()
    print('connection closed')

    end_time = time.time()
    print("Time taken server: ", end_time - start_time)

    os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

    model = load_model("keras_model.h5", compile=False)

    # Load the labels
    class_names = open("labels.txt", "r").readlines()

    input_directory = "."  

    #image_files = [f for f in os.listdir(input_directory) if f.endswith(('.jpg', '.jpeg', '.png'))]

    start_time = time.time()
    
    # print(image_files)
    image_path = os.path.join(input_directory,"received_image.jpg")

    # Read the image from the file
    image = cv2.imread(image_path)

    # Resize the image
    image = cv2.resize(image, (224, 224), interpolation=cv2.INTER_AREA)

        
    # Make the image a numpy array and reshape it to the model's input shape
    image = np.asarray(image, dtype=np.float32).reshape(1, 224, 224, 3)

    # Normalize the image array
    image = (image / 127.5) - 1

    # Predict the model
    prediction = model.predict(image)
    index = np.argmax(prediction)
    class_name = class_names[index].strip()
    confidence_score = prediction[0][index]
    print(confidence_score)
    
    end_time = time.time()
    print("Time taken: ", end_time - start_time)
    print(confidence_score)

    if(confidence_score > 0.9):
        print(class_name[2:])
    else:
        print(-1)
    
    # Send a response to the client
    response = class_name[2:]
    client.sendall(response.encode('utf-8'))