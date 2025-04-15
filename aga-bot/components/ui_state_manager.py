from kivy.clock import Clock
from kivy.properties import NumericProperty

# timer display settings
TIMER_DISPLAY_DURATION = 2  # seconds to show timer

class UIStateManager:
    def __init__(self, parent_widget):
        self.parent = parent_widget
        self.timer_visible = False
        
    def update_break_start(self, break_text):
        self.parent.timer.stop()
        
        self.parent.expression_image.opacity = 0
        self.parent.timer.opacity = 0
        self.parent.current_time_label.opacity = 0
        self.parent.pause_icon.opacity = 0
        self.parent.exit_icon.opacity = 0
        
        # Hide break prompt elements if they were visible
        self.parent.break_prompt_overlay.opacity = 0
        self.parent.break_prompt_message.opacity = 0
        self.parent.break_prompt_duration.opacity = 0
        self.parent.break_icon.opacity = 0
        self.parent.work_icon.opacity = 0
        self.parent.time_marker_icon.opacity = 0
        self.parent.break_prompt_duration_icon.opacity = 0
        
        # Show break elements
        self.parent.break_overlay.text = break_text
        self.parent.break_overlay.opacity = 1
        self.parent.break_time_label.opacity = 1
        
        self.parent.pause_icon.source = 'assets/icons/pause.png'
        
    def update_break_timer(self, timer_text):
        self.parent.break_time_label.text = timer_text
    
    def show_break_prompt(self, duration_text, message, break_minutes, forced=False):
        self.parent.timer.stop()
        
        # Hide ALL other UI elements
        self.parent.expression_image.opacity = 0
        self.parent.timer.opacity = 0
        self.parent.current_time_label.opacity = 0
        self.parent.pause_icon.opacity = 0
        self.parent.exit_icon.opacity = 0
        self.parent.break_overlay.opacity = 0
        self.parent.break_time_label.opacity = 0
        
        # Use consistent white color for all text
        self.parent.break_prompt_overlay.color = (1, 1, 1, 0.9)  # White with slight transparency
        self.parent.break_prompt_message.color = (1, 1, 1, 0.9)  # White with slight transparency
        
        # Convert break_minutes to minutes for display
        break_minutes_display = break_minutes // 60
        
        # Set break prompt content
        self.parent.break_prompt_overlay.text = duration_text
        self.parent.break_prompt_message.text = message
        
        # set image for time marker next to duration text
        self.parent.time_marker_icon.opacity = 1
        
        # Set the break icon based on duration
        if break_minutes_display == 5:
            self.parent.break_prompt_duration_icon.source = 'assets/icons/five.png'
        elif break_minutes_display == 10:
            self.parent.break_prompt_duration_icon.source = 'assets/icons/ten.png'
        elif break_minutes_display == 15:
            self.parent.break_prompt_duration_icon.source = 'assets/icons/fifteen.png'
            
        # Show break duration icon
        self.parent.break_prompt_duration_icon.opacity = 1
        
        # Hide the text label for break duration
        self.parent.break_prompt_duration.opacity = 0
        
        # Position work icon at the same position as exit icon
        self.parent.work_icon.pos_hint = {'right': 0.995, 'center_y': 0.15}
        
        # Show break prompt UI with full opacity
        self.parent.break_prompt_overlay.opacity = 1
        self.parent.break_prompt_message.opacity = 1
        
        # Update and show the icons
        self.parent.break_icon.source = 'assets/icons/break.png'
        self.parent.break_icon.opacity = 1
        
        if not forced:
            self.parent.work_icon.source = 'assets/icons/work.png'
            self.parent.work_icon.opacity = 1
        else:
            self.parent.work_icon.opacity = 0
            
        # Make sure the break prompt stays visible
        Clock.schedule_once(lambda dt: self._ensure_break_prompt_visible(), 0.5)
        
    def hide_break_prompt(self):
        # Hide break prompt elements
        self.parent.break_prompt_overlay.opacity = 0
        self.parent.break_prompt_message.opacity = 0
        self.parent.break_prompt_duration.opacity = 0
        self.parent.break_prompt_duration_icon.opacity = 0
        self.parent.time_marker_icon.opacity = 0
        self.parent.break_icon.opacity = 0
        self.parent.work_icon.opacity = 0
        
        # Go back to timer view
        self.parent.timer.start()
        self.timer_visible = True
        self.toggle_timer_visibility()
        
    def show_break_over(self):
        # Set break over text
        self.parent.break_overlay.text = "BREAK OVER"
        
        # Show work icon on left
        self.parent.break_icon.source = 'assets/icons/work.png'
        self.parent.break_icon.opacity = 1
        
        # Show exit icon on right (positioned exactly like the regular exit icon)
        self.parent.work_icon.source = 'assets/icons/exit.png'
        self.parent.work_icon.pos_hint = {'right': 0.995, 'center_y': 0.15}
        self.parent.work_icon.opacity = 1
        
        # Make sure we're still in break mode (important for auto-exit check)
        if hasattr(self.parent, 'break_manager'):
            self.parent.break_manager.in_break_mode = True
        
    def end_break(self):
        # Hide all break-related elements
        self.parent.break_overlay.opacity = 0
        self.parent.break_time_label.opacity = 0
        self.parent.break_icon.opacity = 0
        self.parent.work_icon.opacity = 0
        
        # Resume normal timer function
        self.parent.timer.start()
        self.timer_visible = False
        self.toggle_timer_visibility()
        
    def toggle_timer_visibility(self, dt=None):
        if self.parent.break_manager.in_break_mode or self.parent.break_manager.in_break_prompt:
            return
            
        self.timer_visible = not self.timer_visible
        
        if self.parent.is_paused:
            self.parent.expression_image.opacity = 0
            self.parent.timer.opacity = 1
            self.parent.current_time_label.opacity = 1
            self.parent.pause_icon.opacity = 1
            self.parent.exit_icon.opacity = 1
            return
            
        if self.timer_visible:
            self.parent.expression_image.opacity = 0
            self.parent.timer.opacity = 1
            self.parent.current_time_label.opacity = 1
            self.parent.pause_icon.opacity = 1
            self.parent.exit_icon.opacity = 1
            Clock.schedule_once(self.toggle_timer_visibility, TIMER_DISPLAY_DURATION)
        else:
            self.parent.expression_image.opacity = 1
            self.parent.timer.opacity = 0
            self.parent.current_time_label.opacity = 0
            self.parent.pause_icon.opacity = 0
            self.parent.exit_icon.opacity = 0
            self.parent.expression_image.source = self.parent.expression_manager.get_random_expression() 

    def _ensure_break_prompt_visible(self):
        # Ensure the break prompt is visible
        self.parent.break_prompt_overlay.opacity = 1
        self.parent.break_prompt_message.opacity = 1
        self.parent.break_prompt_duration_icon.opacity = 1
        self.parent.time_marker_icon.opacity = 1 