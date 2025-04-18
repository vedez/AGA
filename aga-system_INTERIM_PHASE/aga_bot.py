# Main - AGA Bot
# 
# Project Name: AGA Bot 
#
# Description:
# The Advanced Guidance Assistance (AGA) bot is a tool designed specifically to 
# support individuals with ADHD in managing their daily tasks and routines.
#
# This system implements the features offered by AGA through its physical product.
# Key features include Focus Mode, which assists individuals with ADHD in maintaining
# focus on their tasks and improving productivity.
# 
# More at: https://github.com/vedez/aga_documentation
#
# Author: Lovely Fernandez (zedev)
# Date: 25th November, 2024
#

import pygame
import sys
import cv2
import time

from classes.bot_expression import BotExpression
from classes.face_detector import FaceDetector
from classes.video_capture import VideoCapture

# GLOBAL
CONSECUTIVE_FRAMES = 30

class MainApp:
    def __init__(self):
        # initialise instances
        self.bot_expression = BotExpression()
        self.face_detector = FaceDetector("model/shape_predictor_68_face_landmarks.dat")
        self.video_capture = VideoCapture()
        self.clock = pygame.time.Clock()
        self.start_time = time.time()

    def bot(self):
        while True:
            # close program when user exits (will add a stop button*)
            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    self.cleanup()

            # processes video frams to analyse user facial activity/data
            frame_data = self.video_capture.read_frame() # reads video frame 
            if frame_data is None:
                continue 

            frame, gray_frame = frame_data
            user_looking, eyes_detected, face_stable, body_stable = self.face_detector.process_frame(frame, gray_frame, fps = 100)

            # determine if user is stable or if distracted (alert [ ! ])
            is_both_stable = (
                face_stable >= self.face_detector.stabilility_threshold and body_stable >= self.face_detector.stabilility_threshold
            )
            is_body_stable = body_stable >= self.face_detector.stabilility_threshold
            is_eye_distracted = eyes_detected < 2 or self.face_detector.eye_frame_count >= CONSECUTIVE_FRAMES

            # display bot expression based on stability and user states
            if is_both_stable or is_body_stable or is_eye_distracted:
                self.bot_expression.expression = "alert"
                self.start_time = time.time()
                
            elif user_looking and eyes_detected == 2:
                self.focused_expression()

            # DEMO Purposes
            self.bot_expression.draw_expression() # creates AGA bot 
            cv2.imshow("Facial Detection", frame) # video using camera

            if cv2.waitKey(1) & 0xFF == ord(' '):
                break

            self.clock.tick(100) # Limit to 100 FPS

        self.cleanup() 

    def focused_expression(self):
        # different expressions of AGA at different time stamps
        states = [
            (5, "happy", 3),   # at 5 seconds => show "happy" for 3 seconds
            (13, "attitude", 3),  # at 13 seconds => show "attitude" for 3 seconds
            (18, "break", 5),  # at 18 seconds => show "break" for 5 seconds
        ]

        # calculate total duration of the cycle
        total_cycle_time = states[-1][0] + states[-1][2]

        # time since the start of the program
        elapsed_time = time.time() - self.start_time

        # reset loop after cycle time
        if elapsed_time >= total_cycle_time:
            self.start_time = time.time()
            self.bot_expression.expression = "neutral"
            return

        # determine current expression
        for trigger_time, state, duration in states:
            if trigger_time <= elapsed_time < trigger_time + duration:
                self.bot_expression.expression = state
                return

        # default face: neutral
        self.bot_expression.expression = "neutral"



    def cleanup(self):
        self.video_capture.release() # release capture object
        cv2.destroyAllWindows() # close OpenCV windows
        pygame.quit() # uninitialise pygame modules
        sys.exit() # exit


if __name__ == "__main__":
    app = MainApp()
    app.bot()
