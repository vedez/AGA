from kivy.uix.boxlayout import BoxLayout
from kivy.core.window import Window
from kivy.clock import Clock
import time

from widgets.idle_animation_widget import IdleAnimationWidget
from widgets.clock_widget import ClockWidget
from widgets.main_menu_widget import MainMenuWidget
from widgets.focus_page_widget import FocusPageWidget
from widgets.data_page_widget import DataPageWidget

class MainController(BoxLayout):
    """Controller that manages application flow and state."""
    
    # idle timeout in seconds
    IDLE_TIMEOUT = 5
    # clock display timeout in seconds
    CLOCK_TIMEOUT = 5

    def __init__(self, **kwargs):
        super(MainController, self).__init__(**kwargs)
        self.orientation = 'vertical'
        
        # initialize attributes
        self.temp_display_timer = None
        self.last_activity_time = time.time()
        self.current_widget = None
        
        # create widget instances
        self._create_widgets()
        
        # start with idle animation
        self.show_idle_animation()
        
        # schedule idle check
        Clock.schedule_interval(self.check_idle_state, 1)
        
        # bind touch events to the window
        Window.bind(on_touch_down=self.on_activity)
    
    def _create_widgets(self):
        """Create all widget instances."""

        self.idle_widget = IdleAnimationWidget(controller=self)
        self.clock_widget = ClockWidget(controller=self)
        self.main_menu_widget = MainMenuWidget(controller=self)
        self.focus_page_widget = FocusPageWidget(controller=self)
        self.data_page_widget = DataPageWidget(controller=self)
    
    def _switch_to_widget(self, widget, timeout=None, timeout_callback=None):
        """Generic method to switch to a widget with optional timeout.
        
        Args:
            widget: The widget to switch to
            timeout: Optional timeout in seconds
            timeout_callback: Function to call when timeout occurs
        """
        # cancel any pending timers
        self._cancel_temp_display_timer()
        
        if self.current_widget != widget:
            self.clear_widgets()
            self.add_widget(widget)
            self.current_widget = widget
            
            # set timeout if specified
            if timeout and timeout_callback:
                self.temp_display_timer = Clock.schedule_once(
                    lambda dt: timeout_callback(), timeout)
            
            # update activity time
            self.last_activity_time = time.time()
    
    def show_idle_animation(self):
        """Switch to the idle animation display."""

        self._switch_to_widget(self.idle_widget)
    
    def show_clock(self):
        """Switch to the clock display for 5 seconds."""

        self._switch_to_widget(
            self.clock_widget, 
            timeout=self.CLOCK_TIMEOUT, 
            timeout_callback=self.show_idle_animation
        )
    
    def show_main_menu(self):
        """Switch to the main menu display."""

        self._switch_to_widget(self.main_menu_widget)
    
    def show_focus_page(self):
        """Switch to the focus page."""

        self._switch_to_widget(self.focus_page_widget)
    
    def show_data_page(self):
        """Switch to the data page."""

        self._switch_to_widget(self.data_page_widget)
    
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
            return True
        
        # for other screens, let the screen handle the touch
        return False
    
    def check_idle_state(self, dt):
        """Check if app should return to idle state."""

        current_time = time.time()
        idle_time = current_time - self.last_activity_time
        
        # return to idle from any screen except clock (which has its own timer)
        # and idle (which is already idle)
        should_return_to_idle = (
            idle_time > self.IDLE_TIMEOUT and 
            self.current_widget != self.idle_widget and
            self.current_widget != self.clock_widget
        )
        
        if should_return_to_idle:
            self.show_idle_animation() 