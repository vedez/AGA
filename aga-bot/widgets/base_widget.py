from kivy.uix.boxlayout import BoxLayout
from kivy.uix.floatlayout import FloatLayout

class BaseWidget(FloatLayout):
    """Base class for all application widgets.
    
    This class provides common functionality and a consistent interface
    for all widgets in the application.
    """
    
    def __init__(self, controller=None, **kwargs):
        super(BaseWidget, self).__init__(**kwargs)
        self.controller = controller
        self.padding = 20
        
    def on_touch_down(self, touch):
        """Handle touch events with controller navigation if provided."""

        if self.collide_point(*touch.pos) and hasattr(self, 'on_widget_touch'):
            return self.on_widget_touch(touch)
        return super(BaseWidget, self).on_touch_down(touch)
        
    def update(self, dt=None):
        """Update the widget state. Override in subclasses as needed."""
        
        pass 