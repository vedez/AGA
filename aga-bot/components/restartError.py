import cv2
import numpy as np
import os
from components.system_control import restart_system  

# store icon coordinates for click detection
icon_coords = None

def error_screen(script_dir):
    global icon_coords

    canvas = np.full((480, 800, 3), (30, 30, 30), dtype=np.uint8) # blank canvas

    # path to assets
    icon_path = os.path.join(script_dir, "assets", "icons", "restart.png")

    # load assets
    icon = cv2.imread(icon_path, cv2.IMREAD_UNCHANGED)

    if icon is not None:
        icon = cv2.resize(icon, (200, 200)) # icon size

        # center icon
        x = (canvas.shape[1] - icon.shape[1]) // 2
        y = 90  # y position

        # store coordinates for click detection
        icon_coords = (x, y, x + 200, y + 200)

        # if icon has an alpha channel (transparency)
        if icon.shape[2] == 4:
            alpha = icon[:, :, 3] / 255.0  # normalise alpha to 0-1

            for c in range(3):  # blend each RGB channel with canvas
                canvas[y:y+200, x:x+200, c] = (
                    alpha * icon[:, :, c] +
                    (1 - alpha) * canvas[y:y+200, x:x+200, c]
                )
        else:
            # paste icon directly
            canvas[y:y+200, x:x+200] = icon

    # error message
    text = "Unable to retrieve data. Please restart."
    font = cv2.FONT_HERSHEY_SIMPLEX
    scale = 1
    color = (255, 255, 255)  # white text
    thickness = 2

    # position to center the text
    text_size, _ = cv2.getTextSize(text, font, scale, thickness)
    tx = (canvas.shape[1] - text_size[0]) // 2
    ty = y + 200 + 50 

    # draw text on the canvas
    cv2.putText(canvas, text, (tx, ty), font, scale, color, thickness)
    return canvas

# display window to show error screen and handle mouse input
def show_error_screen():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    screen = error_screen(script_dir)

    window_name = "Error"
    cv2.namedWindow(window_name, cv2.WINDOW_NORMAL)
    cv2.setWindowProperty(window_name, cv2.WND_PROP_FULLSCREEN, cv2.WINDOW_FULLSCREEN)

    # connect click callback
    cv2.setMouseCallback(window_name, on_mouse_click)

    while True:
        cv2.imshow(window_name, screen)

        # exit
        if cv2.waitKey(10) & 0xFF == 27:
            break

    cv2.destroyAllWindows()


# mouse event callback
def on_mouse_click(event, x, y, flags, param):
    if event == cv2.EVENT_LBUTTONDOWN:
        print(f"Clicked at: ({x}, {y})")  # <-- Add this
        if icon_coords:
            x1, y1, x2, y2 = icon_coords
            if x1 <= x <= x2 and y1 <= y <= y2:
                print("🖱️ Restart icon clicked!")
                restart_system()


