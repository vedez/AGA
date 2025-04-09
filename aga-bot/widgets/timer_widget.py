from kivy.uix.label import Label
from kivy.clock import Clock
from widgets.base_widget import BaseWidget

class TimerWidget(BaseWidget):
    """Count-up timer (HH:MM:SS), starts when explicitly triggered."""

    def __init__(self, controller=None, **kwargs):
        super(TimerWidget, self).__init__(controller=controller, **kwargs)
        self.elapsed_seconds = 0
        self._event = None  # the scheduled update event

        self.timer_label = Label(
            text=self.format_time(self.elapsed_seconds),
            font_size=70,
            bold=True,
            size_hint=(1, 1),
            pos_hint={'center_x': 0.5, 'center_y': 0.5},
            halign='center',
            valign='middle'
        )
        self.timer_label.bind(size=self.timer_label.setter('text_size'))
        self.add_widget(self.timer_label)

    def format_time(self, seconds):
        hours = seconds // 3600
        minutes = (seconds % 3600) // 60
        secs = seconds % 60
        return f"{hours:02}:{minutes:02}:{secs:02}"

    def start(self):
        if not self._event:
            self._event = Clock.schedule_interval(self.update, 1)

    def stop(self):
        if self._event:
            self._event.cancel()
            self._event = None

    def is_running(self):
        """check if the timer is currently running"""
        return self._event is not None

    def reset(self):
        self.stop()
        self.elapsed_seconds = 0
        self.timer_label.text = self.format_time(0)

    def update(self, dt):
        self.elapsed_seconds += 1
        self.timer_label.text = self.format_time(self.elapsed_seconds)
