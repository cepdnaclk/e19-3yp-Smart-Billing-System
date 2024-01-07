import os
import keras
from keras.models import load_model
import cv2
import numpy as np
import tensorflow as tf
import time
import requests
import os

global counter
image_path = "C:/Users/pasin/OneDrive/Documents/GitHub/e19-3yp-Smart-Billing-System/code/Software/POS/pos/src/main/resources/org/group17/pos/python/"

def scan_qr_code_from_url(image_url):
    try:
        # Send a GET request to the provided URL to get the image
        response = requests.get(image_url)
        if response.status_code == 200:

            with open("C:/Users/pasin/OneDrive/Documents/GitHub/e19-3yp-Smart-Billing-System/code/Software/POS/pos/src/main/resources/org/group17/pos/python/test.jpg", 'wb') as file:
                file.write(response.content)

        else:
            print(-2)

    except Exception as e:
        print(f"Error: {e}")

# Replace 'YOUR_IMAGE_URL' with the URL of the image you want to scan
image_url = 'http://192.168.137.221/capture'
scan_qr_code_from_url(image_url)

os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

model = load_model("C:/Users/pasin/OneDrive/Documents/GitHub/e19-3yp-Smart-Billing-System/code/Software/POS/pos/src/main/resources/org/group17/pos/python/keras_Model.h5", compile=False)

# Load the labels
class_names = open("C:/Users/pasin/OneDrive/Documents/GitHub/e19-3yp-Smart-Billing-System/code/Software/POS/pos/src/main/resources/org/group17/pos/python/labels.txt", "r").readlines()

input_directory = "C:/Users/pasin/OneDrive/Documents/GitHub/e19-3yp-Smart-Billing-System/code/Software/POS/pos/src/main/resources/org/group17/pos/python/"

image_files = [f for f in os.listdir(input_directory) if f.endswith(('.jpg', '.jpeg', '.png'))]

for image_file in image_files:
    # print(image_files)
    image_path = os.path.join(input_directory, image_file)

        # Read the image from the file
    image = cv2.imread(image_path)

        # Resize the image
    image = cv2.resize(image, (224, 224), interpolation=cv2.INTER_AREA)

        # Show the image in a window
    # cv2.imshow("Image from Directory", image)
        
        # Make the image a numpy array and reshape it to the model's input shape
    image = np.asarray(image, dtype=np.float32).reshape(1, 224, 224, 3)

        # Normalize the image array
    image = (image / 127.5) - 1

        # Predict the model
    prediction = model.predict(image)
    index = np.argmax(prediction)
    class_name = class_names[index].strip()
    confidence_score = prediction[0][index]
        # print(confidence_score)

    print(class_name[2:])
      
    image_files = [f for f in os.listdir(input_directory) if f.endswith(('.jpg', '.jpeg', '.png'))]
        
    keyboard_input = cv2.waitKey(1)
 
    if keyboard_input == 27:
        break        

cv2.destroyAllWindows()