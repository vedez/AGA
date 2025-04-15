import time
from kivy.clock import Clock

# break times
FIRST_BREAK_TIME = 30 * 60  # 30 minutes in seconds
SECOND_BREAK_TIME = 60 * 60  # 1 hour in seconds
THIRD_BREAK_TIME = 90 * 60  # 1.5 hours in seconds
FIRST_BREAK_DURATION = 5 * 60  # 5 minutes in seconds
SECOND_BREAK_DURATION = 10 * 60  # 10 minutes in seconds
THIRD_BREAK_DURATION = 15 * 60  # 15 minutes in seconds

# auto exit timeout
AUTO_EXIT_TIMEOUT = 5 * 60  # 5 minutes in seconds

class BreakManager:
    def __init__(self, ui_updater=None):
        self.ui_updater = ui_updater
        self.in_break_mode = False
        self.in_break_prompt = False
        self.break_started_at = None
        self.break_duration = 0
        self.focus_start_time = time.time()
        self.breaks_taken = []
        self.break_check_event = None
        self.break_countdown_event = None
        self.current_break_number = 0
        self.break_icon_shown = False
        self.break_over_shown_at = None
        self.auto_exit_check_event = None
        self.break_prompt_shown_at = None
        self.prompt_auto_exit_check_event = None
        
    def reset(self):
        self.in_break_mode = False
        self.in_break_prompt = False
        self.break_started_at = None
        self.focus_start_time = time.time()
        self.breaks_taken = []
        self.current_break_number = 0
        self.break_icon_shown = False
        self.break_over_shown_at = None
        self.break_prompt_shown_at = None
        
        if self.break_countdown_event:
            self.break_countdown_event.cancel()
            self.break_countdown_event = None
            
        if self.auto_exit_check_event:
            self.auto_exit_check_event.cancel()
            self.auto_exit_check_event = None
            
        if self.prompt_auto_exit_check_event:
            self.prompt_auto_exit_check_event.cancel()
            self.prompt_auto_exit_check_event = None
            
    def check_break_status(self, dt=None, is_paused=False):
        if is_paused or self.in_break_mode or self.in_break_prompt:
            return None
            
        focus_duration = time.time() - self.focus_start_time
        
        # If third break is due and they skipped previous breaks, force it
        if focus_duration >= THIRD_BREAK_TIME and 3 not in self.breaks_taken and (1 not in self.breaks_taken or 2 not in self.breaks_taken):
            if not self.break_icon_shown:
                self.break_icon_shown = True
                # Force the break prompt directly
                self.show_break_prompt(3, forced=True)
            return 'assets/icons/break.png'
            
        if focus_duration >= FIRST_BREAK_TIME and 1 not in self.breaks_taken:
            return 'assets/icons/break.png'
        elif focus_duration >= SECOND_BREAK_TIME and 2 not in self.breaks_taken:
            return 'assets/icons/break.png'
        elif focus_duration >= THIRD_BREAK_TIME and 3 not in self.breaks_taken:
            return 'assets/icons/break.png'
        else:
            return 'assets/icons/pause.png'
    
    def should_take_break(self, focus_duration):
        if focus_duration >= FIRST_BREAK_TIME and 1 not in self.breaks_taken:
            return 1
        elif focus_duration >= SECOND_BREAK_TIME and 2 not in self.breaks_taken:
            return 2
        elif focus_duration >= THIRD_BREAK_TIME and 3 not in self.breaks_taken:
            return 3
        return 0
    
    def get_focus_duration_text(self):
        focus_duration = time.time() - self.focus_start_time  # in seconds
        minutes = int(focus_duration // 60)
        
        if minutes < 60:
            return f"{minutes} Min"
        else:
            hours = focus_duration / 3600  # convert total seconds to float hours
            return f"{hours:.1f} Hr" # eg. 1.5 hr

                
    def show_break_prompt(self, break_number, forced=False):
        self.in_break_prompt = True
        self.current_break_number = break_number
        self.break_prompt_shown_at = time.time()
        
        # Cancel any existing prompt timeout
        if self.prompt_auto_exit_check_event:
            self.prompt_auto_exit_check_event.cancel()
            
        # Start checking for timeout
        self.prompt_auto_exit_check_event = Clock.schedule_interval(self.check_prompt_auto_exit_timeout, 1)
        
        focus_duration_text = self.get_focus_duration_text()
        
        if break_number == 1:
            break_duration_minutes = FIRST_BREAK_DURATION
        elif break_number == 2:
            break_duration_minutes = SECOND_BREAK_DURATION
        else:
            break_duration_minutes = THIRD_BREAK_DURATION
            
        if forced:
            message = "Break required!"
        else:
            message = "Good job!"
            
        if self.ui_updater:
            # Make sure to call the UI updater to show the break prompt
            self.ui_updater.show_break_prompt(
                focus_duration_text, 
                message, 
                break_duration_minutes, 
                forced
            )
            
        return 'assets/icons/break.png'
        
    def check_prompt_auto_exit_timeout(self, dt=None):
        if not self.in_break_prompt or self.break_prompt_shown_at is None:
            return
            
        time_on_prompt = time.time() - self.break_prompt_shown_at
        
        if time_on_prompt >= AUTO_EXIT_TIMEOUT:
            # Auto exit to idle screen after timeout
            self.auto_exit_to_main_menu()
        
    def start_break(self, break_number=None, forced=False):
        self.in_break_mode = True
        self.in_break_prompt = False
        self.break_prompt_shown_at = None
        
        # Cancel prompt timeout
        if self.prompt_auto_exit_check_event:
            self.prompt_auto_exit_check_event.cancel()
            self.prompt_auto_exit_check_event = None
        
        if break_number is None:
            break_number = self.current_break_number
            
        self.break_started_at = time.time()
        self.breaks_taken.append(break_number)
        
        if break_number == 1:
            self.break_duration = FIRST_BREAK_DURATION
            break_text = "5 Minute Break"
        elif break_number == 2:
            self.break_duration = SECOND_BREAK_DURATION
            break_text = "10 Minute Break"
        else:
            self.break_duration = THIRD_BREAK_DURATION
            break_text = "15 Minute Break"
            
        if forced:
            break_text = f"Forced {break_text}"
            
        if self.break_countdown_event:
            self.break_countdown_event.cancel()
            
        self.break_countdown_event = Clock.schedule_interval(self.update_break_timer, 1)
        self.update_break_timer()
        
        if self.ui_updater:
            self.ui_updater.update_break_start(break_text)
            
        return 'assets/icons/pause.png'
    
    def skip_break(self):
        # Only allow skipping if it's not the third break or if they've taken previous breaks
        if self.current_break_number < 3 or (1 in self.breaks_taken and 2 in self.breaks_taken):
            self.in_break_prompt = False
            self.break_icon_shown = False
            self.break_prompt_shown_at = None
            
            # Cancel prompt timeout
            if self.prompt_auto_exit_check_event:
                self.prompt_auto_exit_check_event.cancel()
                self.prompt_auto_exit_check_event = None
                
            if self.ui_updater:
                self.ui_updater.hide_break_prompt()
        else:
            # They must take the third break if they skipped previous ones
            self.start_break(forced=True)
            
    def update_break_timer(self, dt=None):
        if not self.in_break_mode:
            return
            
        time_elapsed = time.time() - self.break_started_at
        time_remaining = max(0, self.break_duration - time_elapsed)
        
        minutes = int(time_remaining // 60)
        seconds = int(time_remaining % 60)
        timer_text = f"{minutes:02d}:{seconds:02d}"
        
        if self.ui_updater:
            self.ui_updater.update_break_timer(timer_text)
        
        if time_remaining <= 0:
            # Cancel this event first to prevent multiple calls
            if self.break_countdown_event:
                self.break_countdown_event.cancel()
                self.break_countdown_event = None
                
            # Only show break over if we haven't already
            if self.break_over_shown_at is None:
                self.show_break_over()
            
    def show_break_over(self):
        # Check if we're already in break over state to prevent recursion
        if self.break_over_shown_at is not None:
            return
            
        self.break_over_shown_at = time.time()
        
        if self.auto_exit_check_event:
            self.auto_exit_check_event.cancel()
            
        self.auto_exit_check_event = Clock.schedule_interval(self.check_auto_exit_timeout, 1)
        
        if self.ui_updater:
            self.ui_updater.show_break_over()
            
    def check_auto_exit_timeout(self, dt=None):
        if not self.in_break_mode or self.break_over_shown_at is None:
            return
            
        time_on_break_over = time.time() - self.break_over_shown_at
        
        if time_on_break_over >= AUTO_EXIT_TIMEOUT:
            # Auto exit to main menu after timeout
            self.auto_exit_to_main_menu()
            
    def auto_exit_to_main_menu(self):
        # First, properly end the break to clean up UI elements
        self.end_break()
        
        # Then cancel any remaining timers
        if self.auto_exit_check_event:
            self.auto_exit_check_event.cancel()
            self.auto_exit_check_event = None
            
        if self.prompt_auto_exit_check_event:
            self.prompt_auto_exit_check_event.cancel()
            self.prompt_auto_exit_check_event = None
            
        # Access controller through ui_updater's parent (FocusPageWidget)
        if self.ui_updater and hasattr(self.ui_updater.parent, 'controller'):
            # Allow a short delay to ensure UI elements are cleaned up
            Clock.schedule_once(
                lambda dt: self.ui_updater.parent.controller.show_idle_animation(), 
                0.1
            )
            
    def finalize_break(self):
        self.in_break_mode = False
        self.break_icon_shown = False
        self.break_over_shown_at = None
        self.break_prompt_shown_at = None
        
        if self.break_countdown_event:
            self.break_countdown_event.cancel()
            self.break_countdown_event = None
            
        if self.auto_exit_check_event:
            self.auto_exit_check_event.cancel()
            self.auto_exit_check_event = None
            
        if self.prompt_auto_exit_check_event:
            self.prompt_auto_exit_check_event.cancel()
            self.prompt_auto_exit_check_event = None
            
        self.focus_start_time = time.time()
        
    def end_break(self):
        self.finalize_break()
        
        if self.ui_updater:
            self.ui_updater.end_break()

    def force_break_prompt_for_testing(self):
        """Debug function to force a break prompt to appear immediately"""
        self.show_break_prompt(1, forced=False)

    def force_break_over_for_testing(self):
        """Debug function to force a break over screen to appear immediately"""
        print("Forcing break over screen for testing")
        self.in_break_mode = True
        self.break_started_at = time.time() - 999  # Set as if break started a long time ago
        self.break_duration = 5  # Short break duration
        self.show_break_over() 