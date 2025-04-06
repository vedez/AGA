import os
import random

from kivy.uix.boxlayout import BoxLayout
from kivy.uix.image import Image
from kivy.clock import Clock

class IdleAnimationWidget(BoxLayout):
    """Widget: Displays idle animation with random expression and blinking."""

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

        self.orientation = 'vertical'
        self.padding = 10
        self.spacing = 10

        # idle expressions
        self.expressions = [
            'assets/expressions/happy.gif',
            'assets/expressions/curious.gif',
            'assets/expressions/bored.gif'
        ]
        self.default_expression = random.choice(self.expressions)
        self.current_expression = self.default_expression

        # path
        # self.base_path = os.path.join(os.path.dirname(__file__), 'assets', 'expressions')

        # animation (initial)
        self.idle_image = Image(
            source = 'assets/expressions/menu-animated.gif',

            size_hint = (1, 0.8),
            allow_stretch = True,
            anim_delay = 2.5,
            anim_loop = 0
        )

        self.add_widget(self.idle_image)

        # schedule blink every 45 seconds
        Clock.schedule_interval(self.blink, 45)

    def blink(self, dt):
        # temporarily switch to blink.gif
        self.idle_image.source = os.path.join(self.base_path, 'blink.gif')
        self.idle_image.reload()

        # return to default expression after short delay (e.g., 2.5 seconds)
        Clock.schedule_once(self.return_to_idle, 1)

    def return_to_idle(self, dt):
        self.idle_image.source = os.path.join(self.base_path, 'neutral.gif')
        self.idle_image.reload()
