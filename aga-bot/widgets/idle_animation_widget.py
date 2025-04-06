from kivy.uix.image import Image
from widgets.base_widget import BaseWidget

class IdleAnimationWidget(BaseWidget):
    """Widget that displays the idle animation."""
    
    def __init__(self, controller=None, **kwargs):
        super(IdleAnimationWidget, self).__init__(controller=controller, **kwargs)
        
        # create idle animation (GIF)
        self.idle_image = Image(
            source='assets/expressions/menu-animated.gif',
            size_hint=(1, 1),
            pos_hint={'center_x': 0.5, 'center_y': 0.5},
            allow_stretch=True,
            keep_ratio=True,
            anim_delay=2.5,
            anim_loop=0
        )
        
        self.add_widget(self.idle_image)
    
    def on_widget_touch(self, touch):
        """Handle touch events to navigate to clock."""
        
        if self.controller:
            self.controller.show_clock()
            return True
        return False 