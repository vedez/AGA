from widgets.page_widget import PageWidget
from kivy.uix.image import Image
from kivy.uix.label import Label
from kivy.graphics import Color, Rectangle
from kivy.clock import Clock
import time

class RefocusPageWidget(PageWidget):
    """displays a refocus icon/message"""

    def __init__(self, controller=None, **kwargs):
        super(RefocusPageWidget, self).__init__(
            controller=controller,
            title="",
            font_size=32,
            **kwargs
        )

        # red background
        with self.canvas.before:
            Color(0.5, 0, 0, 1)  # Dark red
            self.bg_rect = Rectangle()
        self.bind(pos=self._update_bg_rect, size=self._update_bg_rect)

        # refocus image
        self.refocus_image = Image(
            source='assets/icons/refocus.png',
            size_hint=(None, None),
            size=(200, 200),
            pos_hint={'center_x': 0.5, 'center_y': 0.60}
        )

        # message label 
        self.message_label = Label(
            text="Refocus",
            font_size=50,
            color=(1, 1, 1, 1),  
            size_hint=(1, 0.2),
            
            pos_hint={'center_x': 0.5, 'center_y': 0.20},
            halign='center',
            valign='middle',
            bold= True
        )
        self.message_label.bind(size=self.message_label.setter('text_size'))

        self.add_widget(self.refocus_image)
        self.add_widget(self.message_label)
        
        # auto-exit related properties
        self.auto_exit_timeout = 5 * 60  # 5 minutes in seconds
        self.auto_exit_timer = None
        self.enter_time = None

    def _update_bg_rect(self, *args):
        self.bg_rect.pos = self.pos
        self.bg_rect.size = self.size
        
    def on_enter(self):
        """called when the refocus page is shown"""
        self.enter_time = time.time()
        self.start_auto_exit_timer()
        
    def on_exit(self):
        """called when leaving the refocus page"""
        self.stop_auto_exit_timer()
        self.enter_time = None
        
    def start_auto_exit_timer(self):
        """start timer to automatically exit after timeout period"""
        self.stop_auto_exit_timer()  # clear any existing timer
        self.auto_exit_timer = Clock.schedule_interval(self.check_auto_exit, 1)
        
    def stop_auto_exit_timer(self):
        """stop the auto-exit timer"""
        if self.auto_exit_timer:
            self.auto_exit_timer.cancel()
            self.auto_exit_timer = None
            
    def check_auto_exit(self, dt=None):
        """check if we should automatically exit due to timeout"""
        if not self.enter_time:
            return
            
        time_on_refocus = time.time() - self.enter_time
        
        if time_on_refocus >= self.auto_exit_timeout:
            # auto exit to main menu after timeout
            self.stop_auto_exit_timer()
            if self.controller:
                self.controller.show_main_menu()
