import cv2

class VideoCapture:
	def __init__(self):
		#self.cap = cv2.VideoCapture(0, cv2.CAP_V4L2)
		self.cap = cv2.VideoCapture(0)

		#self.cap.set(cv2.CAP_PROP_FOURCC, cv2.VideoWriter_fourcc('M','J','P','G'))
		self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
		self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

	def read_frame(self):
		ret, frame = self.cap.read()

		if not ret:
			return None

		gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

		return frame, gray

	def release(self):
		self.cap.release()
