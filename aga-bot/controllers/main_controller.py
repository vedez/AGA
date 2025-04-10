from kivy.uix.boxlayout import BoxLayout
from kivy.core.window import Window
from kivy.clock import Clock
import time

from widgets.idle_animation_widget import IdleAnimationWidget
from widgets.clock_widget import ClockWidget
from widgets.main_menu_widget import MainMenuWidget
from widgets.focus_page_widget import FocusPageWidget
from widgets.data_page_widget import DataPageWidget
from widgets.refocus_animation_widget import RefocusPageWidget

class MainController(BoxLayout):
    """manages application flow and state"""
    
    IDLE_TIMEOUT = 5 # idle timeout in seconds
    CLOCK_TIMEOUT = 5 # clock display timeout in seconds    
    REFOCUS_EXIT_TIMEOUT = 300  # refocus exit timeout in seconds (5 minutes)
    REFOCUS_TRIGGER_TIMEOUT = 30  # short timeout for testing

    def __init__(self, **kwargs):
        super(MainController, self).__init__(**kwargs)
        self.orientation = 'vertical'
        
        # initialise attributes
        self.temp_display_timer = None
        self.last_activity_time = time.time()
        self.focus_entry_time = None
        self.current_widget = None
        self.refocus_start_time = None  # track refocus period
        self.refocus_trigger_count = 0  # log how many times refocus was triggered
        
        # create widget instances
        self._create_widgets()
        
        # start with idle animation
        self.show_idle_animation()
        Clock.schedule_interval(self.check_idle_state, 1) # schedule idle check
        
        # bind touch events to the window
        Window.bind(on_touch_down=self.on_activity)
    
    def _create_widgets(self):
        self.idle_widget = IdleAnimationWidget(controller=self)
        self.clock_widget = ClockWidget(controller=self)
        self.main_menu_widget = MainMenuWidget(controller=self)
        self.focus_page_widget = FocusPageWidget(controller=self)
        self.data_page_widget = DataPageWidget(controller=self)
        self.refocus_page_widget = RefocusPageWidget(controller=self)
    
    def _switch_to_widget(self, widget, timeout=None, timeout_callback=None):
        """method to switch to a widget with optional timeout.
        
        args:
            widget: The widget to switch to
            timeout: Optional timeout in seconds
            timeout_callback: Function to call when timeout occurs
        """
        # cancel any pending timers
        self._cancel_temp_display_timer()
        # switching
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
            self.refocus_start_time = None  # reset refocus tracking on screen change

            # track when focus page was entered
            if widget == self.focus_page_widget:
                self.focus_entry_time = time.time()
            else:
                self.focus_entry_time = None
    
    # switching widgets
    def show_idle_animation(self): # widget back to neutral 
        self._switch_to_widget(self.idle_widget) 
    
    def show_clock(self):
        self._switch_to_widget(
            self.clock_widget, 
            timeout=self.CLOCK_TIMEOUT, 
            timeout_callback=self.show_idle_animation
        )
    
    def show_main_menu(self): 
        self._switch_to_widget(self.main_menu_widget)
    
    def show_focus_page(self, reset_timer=True):
        self._switch_to_widget(self.focus_page_widget)
        if reset_timer:
            self.focus_page_widget.on_enter_focus()
        else:
            self.focus_page_widget.timer.start()  # resume without reset

    
    def show_data_page(self):
        self._switch_to_widget(self.data_page_widget)
    
    def _cancel_temp_display_timer(self):
        if self.temp_display_timer:
            self.temp_display_timer.cancel()
            self.temp_display_timer = None
    
    # user activity
    def on_activity(self, window, touch):
        # update last activity time
        self.last_activity_time = time.time()
        self.refocus_start_time = None  # reset if user interacts

        # if in focus mode, reset the refocus countdown
        if self.current_widget == self.focus_page_widget:
            self.focus_entry_time = time.time()

        # handle different transitions based on current widget
        if self.current_widget == self.idle_widget:
            # if clicking on idle animation, show clock
            self.show_clock()
            return True

        # if on the refocus page, return to focus page
        if self.current_widget == self.refocus_page_widget:
            self.show_focus_page(reset_timer=False)  # don't reset on return
            return True

        # other screens, let the screen handle the touch
        return False

    def check_idle_state(self, dt):
        """should return to idle state.."""
        current_time = time.time()
        idle_time = current_time - self.last_activity_time

        # trigger refocus animation if on focus page and enough time has passed since entering
        if self.current_widget == self.focus_page_widget:
            if self.focus_entry_time and current_time - self.focus_entry_time > self.REFOCUS_TRIGGER_TIMEOUT:
                self.show_refocus_page()
                self.refocus_trigger_count += 1  # log it
                return  # exit early so idle check below doesn't run

        # if currently on refocus page, track time there
        if self.current_widget == self.refocus_page_widget:
            if self.refocus_start_time is None:
                self.refocus_start_time = current_time
            elif current_time - self.refocus_start_time > self.REFOCUS_EXIT_TIMEOUT:
                self.refocus_start_time = None
                self.show_idle_animation()
                return
        else:
            self.refocus_start_time = None

        # return to idle from any screen EXCEPT focus, refocus, clock, and idle
        should_return_to_idle = (
            idle_time > self.IDLE_TIMEOUT and 
            self.current_widget not in [
                self.idle_widget,
                self.clock_widget,
                self.focus_page_widget,
                self.refocus_page_widget
            ]
        )

        if should_return_to_idle:
            self.show_idle_animation()


    def show_refocus_page(self):
        if hasattr(self.focus_page_widget, "on_exit_focus"):
            self.focus_page_widget.on_exit_focus()
        self._switch_to_widget(
            self.refocus_page_widget,
            timeout=self.REFOCUS_EXIT_TIMEOUT,
            timeout_callback=self.show_idle_animation
        )
