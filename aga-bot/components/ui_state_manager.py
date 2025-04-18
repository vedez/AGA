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
        
        # hide break prompt elements if they were visible
        self.parent.break_prompt_overlay.opacity = 0
        self.parent.break_prompt_message.opacity = 0
        self.parent.break_prompt_duration.opacity = 0
        self.parent.break_icon.opacity = 0
        self.parent.work_icon.opacity = 0
        self.parent.time_marker_icon.opacity = 0
        self.parent.break_prompt_duration_icon.opacity = 0
        
        # show break elements
        self.parent.break_overlay.text = break_text
        self.parent.break_overlay.opacity = 1
        self.parent.break_time_label.opacity = 1
        
        self.parent.pause_icon.source = 'assets/icons/pause.png'
        
    def update_break_timer(self, timer_text):
        self.parent.break_time_label.text = timer_text
    
    def show_break_prompt(self, duration_text, message, break_minutes, forced=False):
        self.parent.timer.stop()
        
        # hide ALL other UI elements
        self.parent.expression_image.opacity = 0
        self.parent.timer.opacity = 0
        self.parent.current_time_label.opacity = 0
        self.parent.pause_icon.opacity = 0
        self.parent.exit_icon.opacity = 0
        self.parent.break_overlay.opacity = 0
        self.parent.break_time_label.opacity = 0
        
        # use consistent white color for all text
        self.parent.break_prompt_overlay.color = (1, 1, 1, 0.9)  
        self.parent.break_prompt_message.color = (1, 1, 1, 0.9)  
        
        break_minutes_display = break_minutes // 60 # convert break_minutes to minutes for display
        
        # break prompt content
        self.parent.break_prompt_overlay.text = duration_text
        self.parent.break_prompt_message.text = message
        
        # time marker next to duration text
        self.parent.time_marker_icon.opacity = 1
        
        # break icon based on duration
        if break_minutes_display == 5:
            self.parent.break_prompt_duration_icon.source = 'assets/icons/five.png'
        elif break_minutes_display == 10:
            self.parent.break_prompt_duration_icon.source = 'assets/icons/ten.png'
        elif break_minutes_display == 15:
            self.parent.break_prompt_duration_icon.source = 'assets/icons/fifteen.png'
            
        # show break duration icon
        self.parent.break_prompt_duration_icon.opacity = 1
        
        # hide the text label for break duration
        self.parent.break_prompt_duration.opacity = 0
        
        # position work icon at the same position as exit icon
        self.parent.work_icon.pos_hint = {'right': 0.995, 'center_y': 0.15}
        
        # show break prompt UI with full opacity
        self.parent.break_prompt_overlay.opacity = 1
        self.parent.break_prompt_message.opacity = 1
        
        # update and show the icons
        self.parent.break_icon.source = 'assets/icons/break.png'
        self.parent.break_icon.opacity = 1
        
        if not forced:
            self.parent.work_icon.source = 'assets/icons/work.png'
            self.parent.work_icon.opacity = 1
        else:
            self.parent.work_icon.opacity = 0
            
        # make sure the break prompt stays visible
        Clock.schedule_once(lambda dt: self._ensure_break_prompt_visible(), 0.5)
        
    def hide_break_prompt(self):
        # hide break prompt elements
        self.parent.break_prompt_overlay.opacity = 0
        self.parent.break_prompt_message.opacity = 0
        self.parent.break_prompt_duration.opacity = 0
        self.parent.break_prompt_duration_icon.opacity = 0
        self.parent.time_marker_icon.opacity = 0
        self.parent.break_icon.opacity = 0
        self.parent.work_icon.opacity = 0
        
        # back to timer view
        self.parent.timer.start()
        self.timer_visible = True
        self.toggle_timer_visibility()
        
    def show_break_over(self):
        # break over text
        self.parent.break_overlay.text = "BREAK OVER"
        
        # work icon on left
        self.parent.break_icon.source = 'assets/icons/work.png'
        self.parent.break_icon.opacity = 1
        
        # exit icon on right
        self.parent.work_icon.source = 'assets/icons/exit.png'
        self.parent.work_icon.pos_hint = {'right': 0.995, 'center_y': 0.15}
        self.parent.work_icon.opacity = 1
        
        # check still in break mode (important for auto-exit check)
        if hasattr(self.parent, 'break_manager'):
            self.parent.break_manager.in_break_mode = True
        
    def end_break(self):
        # hide all break-related elements
        self.parent.break_overlay.opacity = 0
        self.parent.break_time_label.opacity = 0
        self.parent.break_icon.opacity = 0
        self.parent.work_icon.opacity = 0
        
        # resume normal timer function
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
            self.parent._update_animation('neutral')
            
    def _ensure_break_prompt_visible(self):
        # ensure the break prompt is visible
        self.parent.break_prompt_overlay.opacity = 1
        self.parent.break_prompt_message.opacity = 1
        self.parent.break_prompt_duration_icon.opacity = 1
        self.parent.time_marker_icon.opacity = 1 