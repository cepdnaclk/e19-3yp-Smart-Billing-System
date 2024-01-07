import requests
from io import BytesIO
from pyzbar.pyzbar import decode, ZBarSymbol
from PIL import Image
import cv2 
import matplotlib.pyplot as plt 
import numpy as np 

def scan_qr_code_from_url(image_url):
    try:
        # Send a GET request to the provided URL to get the image
        response = requests.get(image_url)
        if response.status_code == 200:
            # Open the image from the response content using PIL
            img = Image.open(BytesIO(response.content))

            # Convert PIL Image to OpenCV format (numpy array)
            image = np.array(img)
            
            #Plot the original image 
            plt.subplot(1, 2, 1) 
            plt.title("Original") 
            plt.imshow(img)

            # control Contrast by 1.5 
            alpha = 1.0
            # control brightness by 50 
            beta = 20  
            image = cv2.convertScaleAbs(image, alpha=alpha, beta=beta) 

            # Create the sharpening kernel 
            kernel = np.array([[0, -1, 0], [-1, 5, -1], [0, -1, 0]]) 
            
            # Sharpen the image 
            sharpened_image = cv2.filter2D(image, -1, kernel)

            # Remove noise using a Gaussian filter 
            blur_image = cv2.GaussianBlur(sharpened_image, (7, 7), 0) 

            #Plot the sharpened image 
            plt.subplot(1, 2, 2) 
            plt.title("Sharpening") 
            plt.imshow(blur_image) 
            plt.show()

            # Decode QR codes from the image
            decoded_objects = decode(blur_image, symbols=[ZBarSymbol.CODE93])
            if decoded_objects:
                print("QR code(s) detected:")
                for obj in decoded_objects:
                    print(obj.data.decode('utf-8'))
            else:
                # No QR code found in the image.
                print(-1)
        else:
            print(-2)

    except Exception as e:
        print(f"Error: {e}")

# Replace 'YOUR_IMAGE_URL' with the URL of the image you want to scan
image_url = 'http://192.168.137.225/capture'
scan_qr_code_from_url(image_url)
