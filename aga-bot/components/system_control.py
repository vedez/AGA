import os
import sys
import platform
import subprocess

def restart_system():
    print("🔁 Restarting AGA program...")

    python = sys.executable  # path to current Python interpreter
    script = os.path.abspath(__file__)  # path to this script (won't work if called from module)

    # If you're running from a main script (like main.py), restart that
    main_script = os.path.join(os.path.dirname(script), "..", "main.py")  # Adjust if needed

    # Restart the script in a new process
    subprocess.Popen([python, main_script])

    # Exit the current process
    sys.exit()
