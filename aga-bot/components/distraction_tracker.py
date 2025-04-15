import time
from kivy.clock import Clock

# global constant
DISTRACTION_TIMEOUT = 30  # seconds before triggering refocus
AUTO_EXIT_TIMEOUT = 5 * 60  # 5 minutes in seconds

class DistractionTracker:
    def __init__(self, controller=None):
        self.controller = controller
        self.distraction_start_time = None
        self.refocus_already_triggered = False
        self.in_refocus_mode = False
        self.refocus_started_at = None
        self.auto_exit_check_event = None
        
    def reset(self):
        self.distraction_start_time = None
        self.refocus_already_triggered = False
        self.in_refocus_mode = False
        self.refocus_started_at = None
        
        if self.auto_exit_check_event:
            self.auto_exit_check_event.cancel()
            self.auto_exit_check_event = None
        
    def start_refocus_mode(self):
        self.in_refocus_mode = True
        self.refocus_started_at = time.time()
        
        # Start checking for timeout
        if self.auto_exit_check_event:
            self.auto_exit_check_event.cancel()
            
        self.auto_exit_check_event = Clock.schedule_interval(self.check_refocus_timeout, 1)
        
    def check_refocus_timeout(self, dt=None):
        if not self.in_refocus_mode or self.refocus_started_at is None:
            return
            
        time_in_refocus = time.time() - self.refocus_started_at
        
        if time_in_refocus >= AUTO_EXIT_TIMEOUT:
            # Auto exit to main menu after timeout
            self.auto_exit_to_main_menu()
            
    def auto_exit_to_main_menu(self):
        # First, properly reset our state
        self.reset()
        
        # Make sure we're canceling our timer
        if self.auto_exit_check_event:
            self.auto_exit_check_event.cancel()
            self.auto_exit_check_event = None
        
        if self.controller:
            # Allow a short delay to ensure clean transitions
            Clock.schedule_once(
                lambda dt: self.controller.show_idle_animation(), 
                0.1
            )
        
    def update(self, user_looking, eyes_detected, current_time):
        if eyes_detected > 0:
            if user_looking:
                self.distraction_start_time = None
                self.refocus_already_triggered = False
                return "Focused", False
            else:
                if self.distraction_start_time is None:
                    self.distraction_start_time = current_time
                    
                time_distracted = current_time - self.distraction_start_time
                
                if (time_distracted >= DISTRACTION_TIMEOUT and not self.refocus_already_triggered):
                    self.refocus_already_triggered = True
                    self.start_refocus_mode()
                    return f"Distracted {time_distracted:.1f}s", True
                
                return f"Distracted {time_distracted:.1f}s", False
        else:
            if self.distraction_start_time is None:
                self.distraction_start_time = current_time
                
            time_distracted = current_time - self.distraction_start_time
            
            if (time_distracted >= DISTRACTION_TIMEOUT and not self.refocus_already_triggered):
                self.refocus_already_triggered = True
                self.start_refocus_mode()
                return f"Distracted {time_distracted:.1f}s", True
                
            return f"Distracted {time_distracted:.1f}s", False 