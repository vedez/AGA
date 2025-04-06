from kivy.uix.boxlayout import BoxLayout
from kivy.uix.image import Image

class IdleAnimationWidget(BoxLayout):
    """Widget that displays the idle animation."""
    def __init__(self, **kwargs):
        super(IdleAnimationWidget, self).__init__(**kwargs)
        self.orientation = 'vertical'
        self.padding = 10
        self.spacing = 10
        
        # create idle animation (GIF)
        self.idle_image = Image(
            source='assets/expressions/happy.gif',
            size_hint=(1, 0.8),
            allow_stretch=True,
            anim_delay=2.5,  # controls animation speed
            anim_loop=0       # 0 is an infinite loop
        )
        
        self.add_widget(self.idle_image) 