import time

class ClockManager:
    def __init__(self, duration=10):
        self.active = False
        self.duration = duration
        self.start_time = None

    def trigger(self):
        self.active = True
        self.start_time = time.time()

    def update(self):
        if self.active and (time.time() - self.start_time >= self.duration):
            self.active = False

    def is_active(self):
        return self.active
