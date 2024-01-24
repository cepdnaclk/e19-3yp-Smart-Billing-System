import socket
import os
import time

# Start the timer
start_time = time.time()

# Create a socket object
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

# Define the port on which you want to connect
# server_addr = (socket.gethostname(), 2019)
server_addr = ("192.168.137.1", 2019)

# Connect to the server
s.connect(server_addr)

# Path to the image you want to send
image_path = "C:/Users/pasin/OneDrive/Documents/GitHub/e19-3yp-Smart-Billing-System/code/Software/POS/pos/src/main/resources/org/group17/pos/python/frame.jpg"

# Open the file in binary mode
with open(image_path, 'rb') as f:
    # Read the file and send it
    while True:
        bytes_read = f.read(1024)
        if not bytes_read:
            # File transmitting is done
            break
        s.sendall(bytes_read)

# Notify the server that the sending is done
s.shutdown(socket.SHUT_WR)

# Receive the response from the server
data = s.recv(1024)
# print('Received', repr(data))
print(data)

# Close the connection
s.close()

# End the timer
end_time = time.time()

# Calculate and print the time taken
time_taken = end_time - start_time
# print(f"Time taken to receive the image: {time_taken} seconds")