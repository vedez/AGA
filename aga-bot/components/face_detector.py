import mediapipe as mp
import cv2

class FaceDetector:
    def __init__(self, model_selection=0, min_confidence=0.5):
        self.detector = mp.solutions.face_detection.FaceDetection(
            model_selection=model_selection,
            min_detection_confidence=min_confidence
        )

    def detect(self, frame_bgr):
        frame_rgb = cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2RGB)
        results = self.detector.process(frame_rgb)
        return results.detections is not None and len(results.detections) > 0
