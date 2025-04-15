import dlib
import numpy as np
import cv2
import os

# GLOBAL
EAR_THRESHOLD = 0.3

class FaceDetector:
    def __init__(self):
        self.current_dir = os.path.dirname(os.path.abspath(__file__))
        self.model_path = os.path.join(self.current_dir, "models", "shape_predictor_68_face_landmarks.dat")

        # initialise face detector and facial feature predictor
        self.detector = dlib.get_frontal_face_detector()
        self.predictor = dlib.shape_predictor(self.model_path)

        # initialise to track frame counts and positions for detecting 
        # and analysing changes in eye movement, face stability, body stability
        self.eye_frame_count = 0
        self.face_stable_frame_count = 0
        self.body_stable_frame_count = 0
        self.last_face_features = None
        self.last_head_position = None

        # determine stability based on pixel movement and time
        # max and min allowed pixel movement to be considered as 'stable'
        self.stability_tolerance = 5  # max 
        self.stabilility_threshold = 3  # min

    # determine if an eye is open, closed, or blinking
    # based on the distances between key eye landmarks
    def get_eye_aspect_ratio(self, eye_points):
        A = np.linalg.norm(eye_points[1] - eye_points[5])
        B = np.linalg.norm(eye_points[2] - eye_points[4])
        C = np.linalg.norm(eye_points[0] - eye_points[3])
        return (A + B) / (2.0 * C)

    # filters out small, insignificant movements and flags big changes
    def is_stable(self, current, previous, tolerance):
        if current is None or previous is None:
            return False
        return np.linalg.norm(np.array(current) - np.array(previous)) <= tolerance # check if changes in each frame is small enough = stable

    # processes frames to detect user's face and eyes to monitor stability and eye activity
    # this feature detects concentration level of user and using show appropriate bot expression
    def process_frame(self, frame, gray_frame, fps):
        faces = self.detector(gray_frame) # detect faces in the frame

        # variables
        eyes_detected = 0
        face_features = None
        head_position = None
        user_looking = False

        # check if faces are detected
        if len(faces) > 0:
            for face in faces:
                # predict landmarks ((note: Converts the 68 landmarks into a list of (x, y) coordinates))
                landmarks = self.predictor(gray_frame, face)
                landmarks = np.array([[p.x, p.y] for p in landmarks.parts()])

                # left and right eye landmarks
                left_eye = landmarks[36:42]
                right_eye = landmarks[42:48]

                # check both eyes are detected
                if len(left_eye) == 6:
                    eyes_detected += 1
                if len(right_eye) == 6:
                    eyes_detected += 1

                # TESTING --  mark around eye landmarks - visualise what program is detecting
                for point in left_eye:
                    cv2.circle(frame, tuple(point), 2, (0, 255, 0), -1)
                for point in right_eye:
                    cv2.circle(frame, tuple(point), 2, (0, 255, 0), -1)

                # calculate EAR - get_eye_aspect_ratio()
                if eyes_detected == 2:
                    left_ear = self.get_eye_aspect_ratio(left_eye)
                    right_ear = self.get_eye_aspect_ratio(right_eye)
                    avg_ear = (left_ear + right_ear) / 2.0

                    if avg_ear >= EAR_THRESHOLD:
                        user_looking = True
                        self.eye_frame_count = 0
                    else:
                        self.eye_frame_count += 1

                # extract facial features and head position
                face_features = landmarks.flatten() # easier tracking
                head_position = (face.left(), face.top(), face.right(), face.bottom())
        else:
            self.eye_frame_count += 1

        # check stability for face and head/body
        if face_features is not None and self.is_stable(face_features, self.last_face_features, 
                                                        self.stability_tolerance):
            self.face_stable_frame_count += 1
        else:
            self.face_stable_frame_count = 0 # reset if facelandmarks are not stable/detected

        # check if the headpos. is stable compared to the last frame
        if self.is_stable(head_position, self.last_head_position, self.stability_tolerance):
            self.body_stable_frame_count += 1
        else:
            self.body_stable_frame_count = 0

        # update last positions
        self.last_face_features = face_features
        self.last_head_position = head_position

        # calculate stability times
        face_stable = self.face_stable_frame_count / fps
        body_stable = self.body_stable_frame_count / fps

        return user_looking, eyes_detected, face_stable, body_stable

