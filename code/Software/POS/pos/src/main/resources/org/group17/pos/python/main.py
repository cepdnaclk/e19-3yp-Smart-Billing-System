from pyzbar.pyzbar import decode
from PIL import Image


def scan_qr_code(image_path):
    try:
        # Open the image file
        with Image.open(image_path) as img:
            # Decode QR codes from the image
            decoded_objects = decode(img)
            if decoded_objects:
                for obj in decoded_objects:
                    print(obj.data.decode('utf-8'))
            else:
                print(-1)
    except Exception as e:
        print(f"Error: {e}")


# Replace 'path_to_your_image.png' with the actual path to your image file
image_file_path = 'C:/Users/pasin/OneDrive/Documents/GitHub/e19-3yp-Smart-Billing-System/code/Software/POS/pos/src/main/resources/org/group17/pos/python/bar.png'
scan_qr_code(image_file_path)
