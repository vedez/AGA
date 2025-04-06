from kivy.uix.boxlayout import BoxLayout
from kivy.core.window import Window
from kivy.clock import Clock
import time

from widgets.idle_animation_widget import IdleAnimationWidget
from widgets.clock_widget import ClockWidget
from widgets.main_menu_widget import MainMenuWidget

class MainController(BoxLayout):
    """Controller that manages application flow and state."""

    def __init__(self, **kwargs):
        super(MainController, self).__init__(**kwargs)
        self.orientation = 'vertical'
        
        # Initialize attributes
        self.temp_display_timer = None
        self.last_activity_time = time.time()
        
        # create widgets as instances
        self.idle_widget = IdleAnimationWidget()
        self.clock_widget = ClockWidget()
        self.main_menu_widget = MainMenuWidget()
        
        # start with idle animation
        self.current_widget = None
        self.show_idle_animation()
        
        # schedule idle check
        Clock.schedule_interval(self.check_idle_state, 1)
        
        # bind touch events to the window
        # this is to detect user interaction and prevent the app from entering idle state
        Window.bind(on_touch_down=self.on_activity)
    
    def show_idle_animation(self):
        """Switch to the idle animation display."""

        # cancel any pending timers
        self._cancel_temp_display_timer()
        
        if self.current_widget != self.idle_widget:
            self.clear_widgets()
            self.add_widget(self.idle_widget)
            self.current_widget = self.idle_widget
    
    def show_clock(self):
        """Switch to the clock display for 5 seconds."""
        # Cancel any pending timers
        self._cancel_temp_display_timer()
        
        if self.current_widget != self.clock_widget:
            self.clear_widgets()
            self.add_widget(self.clock_widget)
            self.current_widget = self.clock_widget
            
            # Schedule return to idle after 5 seconds
            self.temp_display_timer = Clock.schedule_once(
                lambda dt: self.show_idle_animation(), 5)
    
    def show_main_menu(self):
        """Switch to the main menu display."""
        # Cancel any pending timers
        self._cancel_temp_display_timer()
        
        if self.current_widget != self.main_menu_widget:
            self.clear_widgets()
            self.add_widget(self.main_menu_widget)
            self.current_widget = self.main_menu_widget
            
            # Start tracking time to return to idle
            self.last_activity_time = time.time()
    
    def _cancel_temp_display_timer(self):
        """Cancel any pending temp display timer."""

        if self.temp_display_timer:
            self.temp_display_timer.cancel()
            self.temp_display_timer = None
    
    def on_activity(self, window, touch):
        """Handle user activity events."""

        # update last activity time
        self.last_activity_time = time.time()
        
        # handle different transitions based on current widget
        if self.current_widget == self.idle_widget:
            # if clicking on idle animation, show clock
            self.show_clock()
        elif self.current_widget == self.clock_widget:
            # if clicking on clock, show main menu
            self.show_main_menu()
        elif self.current_widget == self.main_menu_widget:
            # if clicking on main menu, just update the activity time
            # but don't change the widget
            pass
            
        # allow the event to propagate
        return False
    
    def check_idle_state(self, dt):
        """Check if app should return to idle state."""

        idle_timeout = 5  # 5 seconds idle timeout
        current_time = time.time()
        idle_time = current_time - self.last_activity_time # calculate idle time
        
        # only check for main menu, as clock has its own timer
        if (idle_time > idle_timeout and 
            self.current_widget == self.main_menu_widget):
            self.show_idle_animation() 