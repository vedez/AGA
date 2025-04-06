import cv2
import os
from components.restartError import error_screen

def load_assets(script_dir):
    expressions_path = os.path.join(script_dir, "assets", "expressions")
    assets = {
        "neutral": cv2.imread(os.path.join(expressions_path, "neutral.png"), cv2.IMREAD_UNCHANGED),
        "distracted": cv2.imread(os.path.join(expressions_path, "distracted.png"), cv2.IMREAD_UNCHANGED),
        "clock": cv2.imread(os.path.join(expressions_path, "clock.png"), cv2.IMREAD_UNCHANGED)
    }

    if assets["clock"] is None:
        assets["clock"] = error_screen(script_dir)

    for name, img in assets.items():
        if img is None:
            print(f"❌ Failed to load {name} image.")
        else:
            print(f"✅ {name} image loaded: {img.shape}")

    return assets

