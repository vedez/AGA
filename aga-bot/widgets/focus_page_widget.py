from widgets.page_widget import PageWidget
from widgets.timer_widget import TimerWidget
from kivy.uix.label import Label
from kivy.clock import Clock
from datetime import datetime

class FocusPageWidget(PageWidget):
    def __init__(self, controller=None, **kwargs):
        super(FocusPageWidget, self).__init__(
            controller=controller,
            title="",
            font_size=32,
            **kwargs
        )

        # timer label (current time)
        self.time_label = Label(
            text=self.get_current_time(),
            font_size=70,
            bold=True,
            size_hint=(1, 0.2),
            pos_hint={'center_x': 0.5, 'center_y': 0.35},
            halign='center',
            valign='middle'
        )
        self.time_label.bind(size=self.time_label.setter('text_size'))

        # timer widget (count-up)
        self.timer = TimerWidget(controller=controller)
        self.timer.size_hint = (1, 0.2)
        self.timer.pos_hint = {'center_x': 0.5, 'center_y': 0.6}

        self.add_widget(self.timer)
        self.add_widget(self.time_label)
        
        Clock.schedule_interval(self.update, 1)

    def get_current_time(self):
        return datetime.now().strftime('%H:%M')

    def update(self, dt):
        self.time_label.text = self.get_current_time()

    def on_widget_touch(self, touch):
        # ackwnledges the touch so it resets idle timer
        # this is if face is detected or not
        return True

    def on_enter_focus(self):
        self.timer.reset()
        self.timer.start()

    def on_exit_focus(self):
        self.timer.stop()
