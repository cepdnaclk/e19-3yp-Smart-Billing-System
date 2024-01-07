import requests
from io import BytesIO
from pyzbar.pyzbar import decode, ZBarSymbol
from PIL import Image
import cv2 
import matplotlib.pyplot as plt 
import numpy as np 
import os
from skimage.metrics import structural_similarity

current_script_directory = os.path.dirname(os.path.abspath(__file__))
# image_path = os.path.join(current_script_directory, 'test.jpg')
image_path = "C:/Users/pasin/OneDrive/Documents/GitHub/e19-3yp-Smart-Billing-System/code/Software/POS/pos/src/main/resources/org/group17/pos/python/"
def scan_qr_code_from_url(image_url):
    try:
        # Send a GET request to the provided URL to get the image
        response = requests.get(image_url)
        if response.status_code == 200:
            # Open the image from the response content using PIL
            img = Image.open(BytesIO(response.content))

            with open(image_path + 'test.jpg', 'wb') as file:
                file.write(response.content)
            # print("Image written successfully.")

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

            # # Plot the processed image 
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
            else:
                # No QR code found in the image.
                return -1
        else:
            return -2

    except Exception as e:
        print(f"Error: {e}")

#Works well with images of different dimensions
def orb_sim(img1, img2):
  # SIFT is no longer available in cv2 so using ORB
  orb = cv2.ORB_create()

  # detect keypoints and descriptors
  kp_a, desc_a = orb.detectAndCompute(img1, None)
  kp_b, desc_b = orb.detectAndCompute(img2, None)

  # define the bruteforce matcher object
  bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)
    
  #perform matches. 
  matches = bf.match(desc_a, desc_b)
  #Look for similar regions with distance < 50. Goes from 0 to 100 so pick a number between.
  similar_regions = [i for i in matches if i.distance < 50]  
  if len(matches) == 0:
    return 0
  return len(similar_regions) / len(matches)


#Needs images to be same dimensions
def structural_sim(img1, img2):

  sim, diff = structural_similarity(img1, img2, full=True)
  return sim

# Replace 'YOUR_IMAGE_URL' with the URL of the image you want to scan
image_url = 'http://192.168.137.221/capture'
# eyelid_path = os.path.join(current_script_directory, 'Eye lid')
# iphone_path = os.path.join(current_script_directory, 'Iphone')
# lux_path = os.path.join(current_script_directory, 'Lux')
# watch_path = os.path.join(current_script_directory, 'Watch')

if(scan_qr_code_from_url(image_url) == -1):
    img00 = cv2.imread(image_path + 'test.jpg', 0)
    # img00 = cv2.resize(img00, (320, 240))

    directories = ['3', '4', '5', '6']  # replace with your directories

    most_orb_similar = 0
    most_orb_similar_dir = ''

    most_ssim_similar = 0
    most_ssim_similar_dir = ''

    for dir in directories:
        # print(f"Processing directory: {dir}")
        path = os.path.join(current_script_directory, dir)
        images = os.listdir(path)
        for i in range(len(images)):
            img1 = cv2.imread(os.path.join(path, images[i]), 0)

            orb_similarity = orb_sim(img1, img00)
            # print(f"ORB similarity : {orb_similarity} Dir : {dir}")

            if orb_similarity > most_orb_similar:
                most_orb_similar = orb_similarity
                most_orb_similar_dir = dir

            ssim = structural_sim(img1, img00)
            # print(f"SSIM similarity : {ssim} Dir : {dir}")

            if ssim > most_ssim_similar:
                most_ssim_similar = ssim
                most_ssim_similar_dir = dir

    # print(f"Most ORB similar dir : {most_orb_similar_dir} with similarity : {most_orb_similar}")
    print(most_orb_similar_dir)
    # print(f"Most SSIM similar dir : {most_ssim_similar_dir} with similarity : {most_ssim_similar}")
