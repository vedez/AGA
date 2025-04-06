import cv2
import mediapipe as mp
import os
import time
import numpy as np

# initialise mp for face detection
mp_face_detection = mp.solutions.face_detection

# camera setup
cap = cv2.VideoCapture(0)

# ASSET IMAGES
script_dir = os.path.dirname(os.path.abspath(__file__))
# bot expressions
neutral_path = os.path.join(script_dir, "assets", "neutral.png")

# negative bot expression
distracted_path = os.path.join(script_dir, "assets", "distracted.png")

# clock faces
clock_path = os.path.join(script_dir, "assets", "cock.png")

neutral_face = cv2.imread(neutral_path, cv2.IMREAD_UNCHANGED)
distracted_face = cv2.imread(distracted_path, cv2.IMREAD_UNCHANGED)
clock_face = cv2.imread(clock_path, cv2.IMREAD_UNCHANGED)

# fallback clock if image not found
if clock_face is None:
    # Create blank background
    clock_face = np.full((480, 800, 3), (30, 30, 30), dtype=np.uint8)

    # Load the PNG icon directly
    icon_path = os.path.join(script_dir, "assets", "icons", "no-clock.png")
    icon = cv2.imread(icon_path, cv2.IMREAD_UNCHANGED)

    if icon is not None:
        # Resize icon
        icon_h, icon_w = 120, 120
        icon = cv2.resize(icon, (icon_w, icon_h), interpolation=cv2.INTER_AREA)

        # Position it centered near the top
        icon_x = (clock_face.shape[1] - icon_w) // 2
        icon_y = 80

        # Blend with transparency if present
        if icon.shape[2] == 4:
            alpha = icon[:, :, 3] / 255.0
            for c in range(3):
                clock_face[icon_y:icon_y+icon_h, icon_x:icon_x+icon_w, c] = (
                    alpha * icon[:, :, c] +
                    (1 - alpha) * clock_face[icon_y:icon_y+icon_h, icon_x:icon_x+icon_w, c]
                )
        else:
            clock_face[icon_y:icon_y+icon_h, icon_x:icon_x+icon_w] = icon

    # Text setup
    error_text = "Unable to retrieve data. Please restart."
    font = cv2.FONT_HERSHEY_SIMPLEX
    font_scale = 0.7
    thickness = 2
    color = (255, 255, 255)

    # Center text below the icon
    text_size, _ = cv2.getTextSize(error_text, font, font_scale, thickness)
    text_w, text_h = text_size
    text_x = (clock_face.shape[1] - text_w) // 2
    text_y = icon_y + icon_h + 50

    cv2.putText(clock_face, error_text, (text_x, text_y), font, font_scale, color, thickness)



# validate image loading
for name, img in [("Neutral", neutral_face), ("Distracted", distracted_face)]:
    if img is None:
        print(f"❌ Failed to load {name} image.")
    else:
        print(f"✅ {name} image loaded: {img.shape}")

# state tracking
clock_mode = False
clock_start_time = None

# click handler
def on_mouse_click(event, x, y, flags, param):
    global clock_mode, clock_start_time
    if event == cv2.EVENT_LBUTTONDOWN and not clock_mode:
        clock_mode = True
        clock_start_time = time.time()
        print("Clock mode activated")

# create fullscreen window and assign mouse click
window_name = "AGA Display"
cv2.namedWindow(window_name, cv2.WINDOW_NORMAL)
cv2.setWindowProperty(window_name, cv2.WND_PROP_FULLSCREEN, cv2.WINDOW_FULLSCREEN)
cv2.setMouseCallback(window_name, on_mouse_click)

# detection loop
with mp_face_detection.FaceDetection(model_selection=0, min_detection_confidence=0.5) as face_detection:
    while cap.isOpened():
        success, frame = cap.read()
        if not success:
            continue

        frame = cv2.flip(frame, 1)
        h, w = frame.shape[:2]

        # ⏱️ Clock mode
        if clock_mode:
            if time.time() - clock_start_time >= 10:
                clock_mode = False
                print("⏱Clock mode ended")
            else:
                resized = cv2.resize(clock_face, (w, h)) # clock face
                cv2.imshow(window_name, resized)
                key = cv2.waitKey(10) & 0xFF
                if key == 27:  # ESC
                    break
                continue

        # 🤖 AGA Mode - Face detection
        image_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        image_rgb.flags.writeable = False
        results = face_detection.process(image_rgb)

        face_detected = results.detections is not None and len(results.detections) > 0
        if face_detected:
            bot_screen = neutral_face
            print("✅ Face Detected - Showing Neutral")
        else:
            bot_screen = distracted_face
            print("❌ No Face - Showing Distracted")

        resized = cv2.resize(bot_screen, (w, h)) # apply screen
        cv2.imshow(window_name, resized)

        key = cv2.waitKey(10) & 0xFF
        if key == 27:  # ESC key
            print("👋 Exit requested via ESC")
            break

cap.release()
cv2.destroyAllWindows()
