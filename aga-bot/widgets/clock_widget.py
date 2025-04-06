from kivy.uix.boxlayout import BoxLayout
from kivy.uix.label import Label
from kivy.clock import Clock
from datetime import datetime

class ClockWidget(BoxLayout):
    """Widget that displays the clock."""

    def __init__(self, **kwargs):
        super(ClockWidget, self).__init__(**kwargs)
        self.orientation = 'vertical'
        self.padding = 20
        self.spacing = 10
        
        # create time display
        self.time_label = Label(
            text=self.get_current_time(),
            font_size=100,
            bold=True,
            size_hint=(1, 0.7),
            halign='center',
            valign='middle'
        )
        self.time_label.bind(size=self.time_label.setter('text_size'))
        
        # create date display
        self.date_label = Label(
            text=self.get_current_date(),
            font_size=36,
            size_hint=(1, 0.3),
            halign='center',
            valign='top'
        )
        self.date_label.bind(size=self.date_label.setter('text_size'))
        
        # add widgets
        self.add_widget(self.time_label)
        self.add_widget(self.date_label)
        
        # schedule updates
        Clock.schedule_interval(self.update_clock, 1)
    
    def get_current_time(self):
        """Get the current time in HH:MM format."""

        return datetime.now().strftime('%H:%M')
    
    def get_current_date(self):
        """Get the current date in the format: Mon, 25th Jun 25."""
        
        now = datetime.now()
        
        # get day suffix (st, nd, rd, th)
        day = now.day
        if 4 <= day <= 20 or 24 <= day <= 30:
            suffix = 'th'
        else:
            suffix = {1: 'st', 2: 'nd', 3: 'rd'}.get(day % 10, 'th')
        
        # format the date
        return now.strftime(f'%a, {day}{suffix} %b %y')
    
    def update_clock(self, dt):
        """Update the clock and date display."""

        self.time_label.text = self.get_current_time()
        self.date_label.text = self.get_current_date() 