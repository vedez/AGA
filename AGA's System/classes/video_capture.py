import cv2

class VideoCapture:
    def __init__(self, source=0):
        # initialise
        self.cap = cv2.VideoCapture(source)

    # read frame from video capture
    def read_frame(self):
        ret, frame = self.cap.read()

        if not ret:
            return None # if no frames read
        
        # convert frame to grayscale
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        
        # return frame and grayscale frame
        return frame, gray

    # close and release resources
    def release(self):
        self.cap.release()