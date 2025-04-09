import cv2
import dlib
import numpy as np
import time
import sys

print("Starting face tracking with dlib (optimized for Raspberry Pi)...")
total_start_time = time.time()

# Initialize variables before both stages
camera_index = 0  # Default camera
width, height = 640, 480  # Camera resolution
cap = None  # Camera object

# Get camera index from command line if provided
if len(sys.argv) > 1:
    camera_index = int(sys.argv[1])
    print(f"Using camera index: {camera_index}")

# STAGE 1: Initialize the camera first
print("Stage 1: Opening camera...")
camera_start = time.time()

# Initialize the webcam
cap = cv2.VideoCapture(camera_index)
cap.set(cv2.CAP_PROP_FRAME_WIDTH, width)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, height)

# Check if camera opened successfully
if not cap.isOpened():
    print("Error: Could not open webcam. Try a different camera index.")
    sys.exit(1)

# Warm up the camera by reading a few frames
print("Warming up camera...")
for _ in range(5):
    ret, _ = cap.read()
    time.sleep(0.1)

camera_end = time.time()
print(f"Camera initialized in {camera_end - camera_start:.2f} seconds")

# Ask user to continue to next stage
input("Camera ready. Press Enter to load dlib face detector...")

# STAGE 2: Load dlib after camera is ready
print("Stage 2: Loading dlib face detector...")
dlib_start = time.time()

# Initialize dlib's face detector
detector = dlib.get_frontal_face_detector()

# Path to shape predictor file - you need to download this file
# You can download it using:
# wget http://dlib.net/files/shape_predictor_68_face_landmarks.dat.bz2
# bzip2 -d shape_predictor_68_face_landmarks.dat.bz2
predictor_path = "shape_predictor_68_face_landmarks.dat"

try:
    predictor = dlib.shape_predictor(predictor_path)
    print(f"Loaded shape predictor from {predictor_path}")
except Exception as e:
    print(f"Error loading shape predictor: {e}")
    print(f"Please download the shape predictor file to {predictor_path}")
    print("You can download it using:")
    print("wget http://dlib.net/files/shape_predictor_68_face_landmarks.dat.bz2")
    print("bzip2 -d shape_predictor_68_face_landmarks.dat.bz2")
    sys.exit(1)

dlib_end = time.time()
print(f"dlib loaded in {dlib_end - dlib_start:.2f} seconds")

# Tracking variables for attention detection
fps = 0
frame_count = 0
start_time = time.time()
attention_history = []
history_length = 10
attention_threshold = 0.6

# Define eye indices in the 68-point model
LEFT_EYE_INDICES = list(range(36, 42))
RIGHT_EYE_INDICES = list(range(42, 48))

def calculate_eye_aspect_ratio(eye_landmarks):
    """Calculate eye aspect ratio to detect eye openness"""
    # Compute the euclidean distances between the vertical eye landmarks
    A = np.linalg.norm(eye_landmarks[1] - eye_landmarks[5])
    B = np.linalg.norm(eye_landmarks[2] - eye_landmarks[4])
    
    # Compute the euclidean distance between the horizontal eye landmarks
    C = np.linalg.norm(eye_landmarks[0] - eye_landmarks[3])
    
    # Eye Aspect Ratio
    ear = (A + B) / (2.0 * C)
    return ear

def get_eye_centers(eye_landmarks):
    """Calculate the center of an eye based on landmarks"""
    eye_center = np.mean(eye_landmarks, axis=0)
    return eye_center

def get_pupil_position(eye_landmarks):
    """Estimate pupil position based on eye landmarks and darkness"""
    # This is a simplified approach - actual pupil tracking would require more complex image processing
    # Here we just use the center of the eye as an approximation
    return np.mean(eye_landmarks, axis=0)

def calculate_gaze_direction(left_eye_landmarks, right_eye_landmarks):
    """Estimate gaze direction based on eye landmarks"""
    # Get eye centers
    left_eye_center = get_eye_centers(left_eye_landmarks)
    right_eye_center = get_eye_centers(right_eye_landmarks)
    
    # Get estimated pupil positions
    left_pupil = get_pupil_position(left_eye_landmarks)
    right_pupil = get_pupil_position(right_eye_landmarks)
    
    # Calculate deviation of pupils from center
    left_deviation_x = (left_pupil[0] - left_eye_center[0]) / (left_eye_landmarks[3][0] - left_eye_landmarks[0][0])
    right_deviation_x = (right_pupil[0] - right_eye_center[0]) / (right_eye_landmarks[3][0] - right_eye_landmarks[0][0])
    
    # Average horizontal deviation
    avg_deviation_x = (left_deviation_x + right_deviation_x) / 2.0
    
    return avg_deviation_x

def is_looking_at_screen(landmarks, face_rect, distance_factor=1.0):
    """Determine if user is looking at the screen based on eye and face features"""
    # Extract eye landmarks
    left_eye_landmarks = np.array([(landmarks.part(i).x, landmarks.part(i).y) for i in LEFT_EYE_INDICES])
    right_eye_landmarks = np.array([(landmarks.part(i).x, landmarks.part(i).y) for i in RIGHT_EYE_INDICES])
    
    # Calculate eye aspect ratios (measure of how open the eyes are)
    left_ear = calculate_eye_aspect_ratio(left_eye_landmarks)
    right_ear = calculate_eye_aspect_ratio(right_eye_landmarks)
    avg_ear = (left_ear + right_ear) / 2.0
    
    # Estimate gaze direction
    gaze_direction = calculate_gaze_direction(left_eye_landmarks, right_eye_landmarks)
    
    # Calculate face orientation
    # Simplified approach - using the symmetry of facial landmarks
    jaw_left = np.array([landmarks.part(3).x, landmarks.part(3).y])
    jaw_right = np.array([landmarks.part(13).x, landmarks.part(13).y])
    face_center_x = (jaw_left[0] + jaw_right[0]) / 2
    face_center_deviation = face_center_x - (face_rect.left() + face_rect.width()/2)
    face_orientation = face_center_deviation / face_rect.width()
    
    # Apply distance compensation
    eye_open_threshold = 0.2 * distance_factor
    gaze_threshold = 0.15 * distance_factor
    face_orientation_threshold = 0.1 * distance_factor
    
    # Determine if looking at screen based on multiple factors
    eyes_open = avg_ear > eye_open_threshold
    gaze_centered = abs(gaze_direction) < gaze_threshold
    face_centered = abs(face_orientation) < face_orientation_threshold
    
    # For debugging
    global debug_values
    debug_values = {
        'left_ear': left_ear,
        'right_ear': right_ear,
        'avg_ear': avg_ear,
        'gaze_direction': gaze_direction,
        'face_orientation': face_orientation,
        'eyes_open': eyes_open,
        'gaze_centered': gaze_centered,
        'face_centered': face_centered
    }
    
    # Need to pass the majority of checks
    return (eyes_open and (gaze_centered or face_centered))

# For debugging values
debug_values = {}

print("Ready! Press 'q' to quit.")

# Create window and bring to front
cv2.namedWindow('Dlib Face Tracking', cv2.WINDOW_NORMAL)
cv2.setWindowProperty('Dlib Face Tracking', cv2.WND_PROP_TOPMOST, 1)

# Main loop
while cap.isOpened():
    # Read frame from camera
    success, image = cap.read()
    if not success:
        print("Failed to capture image from webcam.")
        break
    
    # Flip horizontally for mirror effect
    image = cv2.flip(image, 1)
    
    # Convert to grayscale for face detection
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    # Resize for faster processing
    scaling_factor = 0.5
    small_gray = cv2.resize(gray, (0, 0), fx=scaling_factor, fy=scaling_factor)
    
    # Detect faces (on smaller image for speed)
    faces = detector(small_gray)
    
    # Calculate FPS
    frame_count += 1
    elapsed_time = time.time() - start_time
    if elapsed_time >= 1.0:
        fps = frame_count / elapsed_time
        frame_count = 0
        start_time = time.time()
    
    # Draw FPS info
    cv2.putText(image, f"FPS: {fps:.1f}", (10, 30), 
                cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
    
    # Analyze face detection results
    looking_at_screen = False
    
    if len(faces) > 0:
        # Get the first (largest) face
        face_rect = faces[0]
        
        # Convert face coordinates back to original scale
        scaled_face = dlib.rectangle(
            left=int(face_rect.left() / scaling_factor),
            top=int(face_rect.top() / scaling_factor),
            right=int(face_rect.right() / scaling_factor),
            bottom=int(face_rect.bottom() / scaling_factor)
        )
        
        # Draw rectangle around face
        cv2.rectangle(image, 
                     (scaled_face.left(), scaled_face.top()), 
                     (scaled_face.right(), scaled_face.bottom()),
                     (0, 255, 0), 2)
        
        # Get facial landmarks (on original image)
        landmarks = predictor(gray, scaled_face)
        
        # Draw facial landmarks
        for n in range(68):
            x = landmarks.part(n).x
            y = landmarks.part(n).y
            cv2.circle(image, (x, y), 2, (0, 0, 255), -1)
        
        # Draw eye regions more prominently
        for i in LEFT_EYE_INDICES:
            pt = (landmarks.part(i).x, landmarks.part(i).y)
            cv2.circle(image, pt, 2, (0, 255, 255), -1)
        
        for i in RIGHT_EYE_INDICES:
            pt = (landmarks.part(i).x, landmarks.part(i).y)
            cv2.circle(image, pt, 2, (0, 255, 255), -1)
        
        # Calculate distance factor (for distance compensation)
        face_width = scaled_face.width() / image.shape[1]  # Relative to image width
        distance_factor = max(0.5, min(1.5, 0.25 / max(0.1, face_width)))
        
        # Check if looking at screen
        looking_at_screen = is_looking_at_screen(landmarks, scaled_face, distance_factor)
        
        # Update attention history
        attention_history.append(1 if looking_at_screen else 0)
        if len(attention_history) > history_length:
            attention_history.pop(0)
            
        # Show distance estimation
        cv2.putText(image, f"Distance: {distance_factor:.1f}", (10, 150), 
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 0), 2)
        
        # Show debug values
        if debug_values:
            ear_text = f"EAR: {debug_values['avg_ear']:.2f}"
            gaze_text = f"Gaze: {debug_values['gaze_direction']:.2f}"
            orient_text = f"Orient: {debug_values['face_orientation']:.2f}"
            
            cv2.putText(image, ear_text, (10, 180), 
                        cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 0), 1)
            cv2.putText(image, gaze_text, (10, 210), 
                        cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 0), 1)
            cv2.putText(image, orient_text, (10, 240), 
                        cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 0), 1)
    else:
        # No face detected
        attention_history.append(0)
        if len(attention_history) > history_length:
            attention_history.pop(0)
    
    # Calculate attention score
    attention_score = sum(attention_history) / len(attention_history) if attention_history else 0
    is_attentive = attention_score >= attention_threshold
    
    # Draw attention status
    attention_label = f"Attention: {attention_score:.2f}"
    cv2.putText(image, attention_label, (10, 60), 
                cv2.FONT_HERSHEY_SIMPLEX, 0.7, 
                (0, 255, 0) if is_attentive else (0, 0, 255), 2)
    
    # Draw looking status
    if len(faces) > 0:
        status_text = "Looking at screen" if looking_at_screen else "Not looking at screen"
        cv2.putText(image, status_text, (10, 90), 
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, 
                    (0, 255, 0) if looking_at_screen else (0, 0, 255), 2)
    else:
        cv2.putText(image, "No face detected", (10, 90), 
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
    
    # Display the image
    cv2.imshow('Dlib Face Tracking', image)
    
    # Exit on 'q' press
    if cv2.waitKey(5) & 0xFF == ord('q'):
        break

# Clean up
cap.release()
cv2.destroyAllWindows()
