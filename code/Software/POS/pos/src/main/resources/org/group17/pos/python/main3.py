import requests

def fetch_and_save_image(image_url, output_path):
    try:
        # Send a GET request to the provided URL to get the image
        response = requests.get(image_url)
        if response.status_code == 200:
            # Save the image to the specified output path
            with open(output_path, 'wb') as file:
                file.write(response.content)
            print(f"Image saved successfully at {output_path}")
        else:
            print("Failed to fetch the image from the URL.")

    except Exception as e:
        print(f"Error: {e}")

# Replace 'YOUR_IMAGE_URL' with the URL of the image you want to fetch
image_url = 'http://192.168.137.137/capture'
# Replace 'output_image.png' with the desired output filename and path
output_path = 'output_image.png'

fetch_and_save_image(image_url, output_path)