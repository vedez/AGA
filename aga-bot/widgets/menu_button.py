from kivy.uix.boxlayout import BoxLayout
from kivy.uix.image import Image
from kivy.uix.label import Label

class MenuButton(BoxLayout):
    """main menu with an icon and label."""
    
    def __init__(self, icon_source, text, on_press=None, disabled=False, **kwargs):
        super(MenuButton, self).__init__(**kwargs)
        self.orientation = 'vertical'

        self.padding = 10
        self.spacing = 5
        self.disabled = disabled
        self.on_press = on_press
        
        # create icon
        self.icon = Image(
            source = icon_source,
            size_hint=(1, 0.7)
        )
        
        # create label
        self.label = Label(
            text = text,
            size_hint=(1, 0.3),
            font_size = 18
        )
        
        # add widgets
        self.add_widget(self.icon)
        self.add_widget(self.label)
        
        # apply greyed out style if disabled
        if disabled:
            self.opacity = 0.5
    
    def on_touch_down(self, touch):
        """touch events for the button"""
        
        if self.disabled:
            return False
        
        if self.collide_point(*touch.pos):
            if self.on_press:
                self.on_press()
            return True
        
        return super(MenuButton, self).on_touch_down(touch) 