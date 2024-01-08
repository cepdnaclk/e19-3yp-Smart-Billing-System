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

def scan_qr_code_from_url(image_url):
    try:
        # Send a GET request to the provided URL to get the image
        response = requests.get(image_url)
        if response.status_code == 200:
            # Open the image from the response content using PIL
            img = Image.open(BytesIO(response.content))

            with open("C:/Users/pasin/OneDrive/Documents/GitHub/e19-3yp-Smart-Billing-System/code/Software/POS/pos/src/main/resources/org/group17/pos/python/test.jpg", 'wb') as file:
                file.write(response.content)

            image = np.array(img)

            # Convert the image to grayscale
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

            # Apply median filter to the grayscale image (Not Working!)
            # dst = cv2.fastNlMeansDenoising(gray, None, 11, 6, 7, 21)

            # Apply adaptive thresholding
            # thresh = cv2.adaptiveThreshold(gray,255,cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY,11,2)

            # control Contrast by 1.5 
            alpha = 1.7
            # control brightness by 50 
            beta = -80  
            image = cv2.convertScaleAbs(gray, alpha=alpha, beta=beta) 

            # Remove noise using a Gaussian filter 
            blur_image = cv2.GaussianBlur(image, (7, 7), 0)

            # Create the sharpening kernel 
            kernel = np.array([[0, -1, 0], [-1, 5, -1], [0, -1, 0]]) 

            # Sharpen the image 
            sharpened_image = cv2.filter2D(blur_image, -1, kernel)

            # # Dilate the image
            kernel = np.ones((5,5),np.uint8)
            dilation = cv2.dilate(sharpened_image,kernel,iterations = 1)

            # Convert the processed image back to RGB for displaying
            rgb_image = cv2.cvtColor(dilation, cv2.COLOR_BGR2RGB)

            # Plot the original image 
            # plt.subplot(1, 2, 1) 
            # plt.title("Original") 
            # plt.imshow(img)

            # Plot the processed image 
            # plt.subplot(1, 2, 2) 
            # plt.title("Processed") 
            # plt.imshow(rgb_image, cmap='gray')
            # plt.show()

            # Decode QR codes from the image
            decoded_objects = decode(img)
            if decoded_objects:
                # print("QR code(s) detected:")
                for obj in decoded_objects:
                    print(obj.data.decode('utf-8'))
                return 0
            else:
                # No QR code found in the image.
                return -1
        else:
            return -2

    except Exception as e:
        print(f"Error: {e}")

# Replace 'YOUR_IMAGE_URL' with the URL of the image you want to scan
image_url = 'http://192.168.137.165/capture'

if(scan_qr_code_from_url(image_url) == -1):

    os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

    model = load_model("C:/Users/pasin/OneDrive/Documents/GitHub/e19-3yp-Smart-Billing-System/code/Software/POS/pos/src/main/resources/org/group17/pos/python/keras_model.h5", compile=False)

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