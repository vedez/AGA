from widgets.page_widget import PageWidget
from kivy.uix.label import Label
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.image import Image
from components.focus_time_tracker import FocusTimeTracker
from kivy.graphics import Color, Line

class DataPageWidget(PageWidget):
    """widget that displays the data page with focus time statistics."""
    
    def __init__(self, controller=None, **kwargs):
        super(DataPageWidget, self).__init__(
            controller=controller,
            title="",
            font_size=36,
            **kwargs
        )
        
        self.focus_tracker = FocusTimeTracker()
        self._setup_ui()
        
    def _setup_ui(self):
        """set up the UI elements for the data page."""
        # main container for all elements
        main_layout = BoxLayout(
            orientation='vertical',
            spacing=0,
            padding=[0, 0, 0, 0],
            size_hint=(1, 1)
        )
        
        # clock icon (at 1/6 from top)
        clock_container = BoxLayout(
            orientation='vertical',
            size_hint=(1, 1/6),
            pos_hint={'center_x': 0.5, 'top': 1}
        )
        time_icon = Image(
            source='assets/icons/time_marker.png',
            size_hint=(None, None),
            size=(50, 50),
            pos_hint={'center_x': 0.5, 'center_y': 0.5}
        )
        clock_container.add_widget(time_icon)
        main_layout.add_widget(clock_container)
        
        # "focus stats" title (at 2/6 from top)
        title_container = BoxLayout(
            orientation='vertical',
            size_hint=(1, 1/6)
        )
        title_label = Label(
            text="Focus Stats",
            font_size=32,
            color=(1, 1, 1, 1)
        )
        title_container.add_widget(title_label)
        main_layout.add_widget(title_container)
        
        spacer_small = BoxLayout(
            size_hint=(1, 1/12)
        )
        main_layout.add_widget(spacer_small)
        
        # today's stats
        today_container = BoxLayout(
            orientation='vertical',
            size_hint=(1, 1/12)
        )
        today_layout = BoxLayout(
            orientation='horizontal',
            size_hint=(0.9, 1),
            pos_hint={'center_x': 0.5}
        )
        today_label = Label(
            text="Today:",
            font_size=28,
            halign='left',
            valign='middle',
            text_size=(None, None),
            size_hint=(0.5, 1),
            color=(1, 1, 1, 1)
        )
        self.today_time = Label(
            text="0 minutes",
            font_size=28,
            halign='right',
            valign='middle',
            text_size=(None, None),
            size_hint=(0.5, 1),
            color=(1, 1, 1, 1)
        )
        today_layout.add_widget(today_label)
        today_layout.add_widget(self.today_time)
        today_container.add_widget(today_layout)
        main_layout.add_widget(today_container)
        
        # small space
        spacer_tiny = BoxLayout(
            size_hint=(1, 1/24)
        )
        main_layout.add_widget(spacer_tiny)
        
        # separator
        separator = BoxLayout(
            size_hint=(0.8, 1/96),
            pos_hint={'center_x': 0.5}
        )
        with separator.canvas:
            Color(1, 1, 1, 0.2)
            self.separator_line = Line(points=[0, 0, 100, 0], width=1)
        
        # update the line when the layout changes
        def update_separator_line(instance, value):
            self.separator_line.points = [0, 0, instance.width, 0]
        
        separator.bind(width=update_separator_line)
        main_layout.add_widget(separator)
        
        # small space
        spacer_tiny2 = BoxLayout(
            size_hint=(1, 1/24)
        )
        main_layout.add_widget(spacer_tiny2)
        
        # yesterday's stats
        yesterday_container = BoxLayout(
            orientation='vertical',
            size_hint=(1, 1/12)
        )
        yesterday_layout = BoxLayout(
            orientation='horizontal',
            size_hint=(0.9, 1),
            pos_hint={'center_x': 0.5}
        )
        yesterday_label = Label(
            text="Yesterday:",
            font_size=28,
            halign='left',
            valign='middle',
            text_size=(None, None),
            size_hint=(0.5, 1),
            color=(1, 1, 1, 1)
        )
        self.yesterday_time = Label(
            text="0 minutes",
            font_size=28,
            halign='right',
            valign='middle',
            text_size=(None, None),
            size_hint=(0.5, 1),
            color=(1, 1, 1, 1)
        )
        yesterday_layout.add_widget(yesterday_label)
        yesterday_layout.add_widget(self.yesterday_time)
        yesterday_container.add_widget(yesterday_layout)
        main_layout.add_widget(yesterday_container)
        
        # add all the remaining space in a single container
        remaining_space = BoxLayout(
            size_hint=(1, 3/12)
        )
        main_layout.add_widget(remaining_space)
        
        # add the main layout to the widget
        self.add_widget(main_layout)
        
        # home button icon - add directly to the widget with absolute positioning
        home_icon = Image(
            source='assets/icons/home.png',
            size_hint=(None, None),
            size=(40, 40),
            pos_hint={'x': 0.05, 'y': 0.05},  # lower position than before, but still higher than original
            allow_stretch=True,
            keep_ratio=True
        )
        
        self.add_widget(home_icon)
    
    def update_stats(self):
        """update the displayed statistics."""
        # get focus time data
        today_minutes = self.focus_tracker.get_today_focus_time()
        yesterday_minutes = self.focus_tracker.get_yesterday_focus_time()
        
        # format display strings
        if today_minutes < 60:
            today_text = f"{int(today_minutes)} minutes"
        else:
            hours = int(today_minutes // 60)
            minutes = int(today_minutes % 60)
            today_text = f"{hours}h {minutes}m"
            
        if yesterday_minutes < 60:
            yesterday_text = f"{int(yesterday_minutes)} minutes"
        else:
            hours = int(yesterday_minutes // 60)
            minutes = int(yesterday_minutes % 60)
            yesterday_text = f"{hours}h {minutes}m"
        
        # update labels
        self.today_time.text = today_text
        self.yesterday_time.text = yesterday_text
    
    def on_enter(self):
        """called when the widget is shown."""
        self.update_stats()
        
    def on_touch_down(self, touch):
        """handle touch events."""
        # check if the home button was clicked
        for child in self.children:
            if isinstance(child, Image) and child.source == 'assets/icons/home.png':
                if child.collide_point(*touch.pos):
                    if self.controller:
                        self.controller.show_main_menu()
                    return True
        
        return super(DataPageWidget, self).on_touch_down(touch) 