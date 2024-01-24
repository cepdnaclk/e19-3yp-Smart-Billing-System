import imageio
import time

video_device = 0

while True:
    try:
        # Create a reader object for the video device
        reader = imageio.get_reader('<video%d>' % video_device, 'ffmpeg')

        while True:
            # Read the next frame from the video device
            frame = reader.get_next_data()

            # Save the frame to a file
            imageio.imsave('./frame.jpg', frame)

            time.sleep(0.5)

        # If the code reaches this point, it means that it was executed without errors
        # So we break the loop
        break

    except Exception as e:
        print(f"Error occurred: {e}")

        # Close the reader
        reader.close()

        # Wait for a while before restarting
        time.sleep(1)