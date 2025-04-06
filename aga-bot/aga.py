import cv2
import os
import time

from components.face_detector import FaceDetector
from components.asset_loader import load_assets
from components.clock_manager import ClockManager
from components.restartError import show_error_screen  # ✅ corrected import

class AGA:
    def __init__(self):
        # initialise cam
        self.cap = cv2.VideoCapture(0)
        self.window_name = "AGA"
        
        # manages clock (timestamps)
        self.clock_manager = ClockManager()
        
        # get the script directory path
        self.script_dir = os.path.dirname(os.path.abspath(__file__))
        
        # load image assets
        self.assets = load_assets(self.script_dir)

        # ✅ check if any critical assets failed to load
        if self.assets["neutral"] is None or self.assets["distracted"] is None:
            show_error_screen()  # ✅ corrected here
            exit()  # stop the app after showing the error screen
        
        # initialise face detection model
        self.face_detector = FaceDetector()

        # create fullscreen window
        cv2.namedWindow(self.window_name, cv2.WINDOW_NORMAL)
        cv2.setWindowProperty(self.window_name, cv2.WND_PROP_FULLSCREEN, cv2.WINDOW_FULLSCREEN)
        
        # set up mouse click callback
        cv2.setMouseCallback(self.window_name, self.on_click)

    def on_click(self, event, x, y, flags, param):
        # left mouse button clicked && clock not already running -> trigger the timer
        if event == cv2.EVENT_LBUTTONDOWN and not self.clock_manager.is_active():
            self.clock_manager.trigger()

    def run(self):
        # loop to capture and process webcam frames
        while self.cap.isOpened():
            success, frame = self.cap.read()
            if not success:
                continue

            # flip image horizontally (mirror view)
            frame = cv2.flip(frame, 1)
            h, w = frame.shape[:2]

            # if timer is active - show clock image
            if self.clock_manager.is_active():
                self.clock_manager.update()
                img = cv2.resize(self.assets["clock"], (w, h))
                cv2.imshow(self.window_name, img)

                # 'ESC' key to exit
                if cv2.waitKey(10) & 0xFF == 27:
                    break
                continue

            # face detection mode
            detected = self.face_detector.detect(frame)

            # choose image based on face detection
            screen = self.assets["neutral"] if detected else self.assets["distracted"]

            # resize image to window size and display
            img = cv2.resize(screen, (w, h))
            cv2.imshow(self.window_name, img)

            # exit on ESC
            if cv2.waitKey(10) & 0xFF == 27:
                break

        # release webcam and close all OpenCV windows
        self.cap.release()
        cv2.destroyAllWindows()
