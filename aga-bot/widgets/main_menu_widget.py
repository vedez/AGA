from kivy.uix.boxlayout import BoxLayout
from kivy.uix.label import Label

class MainMenuWidget(BoxLayout):
    """Widget that displays the main menu."""
    def __init__(self, **kwargs):
        super(MainMenuWidget, self).__init__(**kwargs)
        self.orientation = 'vertical'
        self.padding = 10
        self.spacing = 10
        
        # create main menu display
        self.main_menu_label = Label(
            text='MAIN MENU',
            font_size=48,
            size_hint=(1, 0.8)
        )
        
        self.add_widget(self.main_menu_label) 