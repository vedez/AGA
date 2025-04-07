from kivy.uix.image import Image
from widgets.base_widget import BaseWidget
from kivy.clock import Clock
import random

class IdleAnimationWidget(BaseWidget):
    """Widget: Displays neutral face, blinking and moods."""

    # mood types (assets)
    MOODS = ['happy', 'bored', 'curious', 'annoyed', 'attitude', 'excited', 'giggly']

    def __init__(self, controller = None, **kwargs):
        super(IdleAnimationWidget, self).__init__(controller=controller, **kwargs)

        self.current_state = 'neutral'  # default
        self.previous_mood = None
        self.is_blinking = False
        self.is_showing_mood = False
        self.pending_blink = False  # priorities mood over blink

        # image setup
        self.idle_image = Image(
            source=self._get_animation_path('neutral'),
            size_hint = (1, 1),
            pos_hint = {'center_x': 0.5, 'center_y': 0.5},
            allow_stretch = True,
            keep_ratio = True,
            anim_delay = -1,  # Neutral is static
            anim_loop = 0
        )
        self.add_widget(self.idle_image)

        # blink and mood time changes
        Clock.schedule_interval(self._trigger_blink, 8)   # blink every 8s
        Clock.schedule_interval(self._trigger_mood, 29)   # mood change every 22s

    # random mood picker
    def _get_random_mood(self):
        moods = [m for m in self.MOODS if m != self.previous_mood]
        return random.choice(moods) if moods else random.choice(self.MOODS)

    def _get_animation_path(self, state_name):
        return f'assets/expressions/{state_name}.gif' # retrieve path of mood

    # trigger mood, no overlaps and return neutral after 3 seconds
    def _trigger_mood(self, dt):
        if self.is_blinking or self.is_showing_mood:
            return

        new_mood = self._get_random_mood()
        self.previous_mood = new_mood
        self.is_showing_mood = True
        self.current_state = 'mood'

        self._update_animation(new_mood)
        Clock.schedule_once(self._return_to_neutral, 3) # length of mood display

    def _trigger_blink(self, dt):
        if self.is_showing_mood:
            self.pending_blink = True  # delay blink until mood is finished
            return
        
        if self.is_blinking:
            return

        self.is_blinking = True
        self.current_state = 'blink'
        self._update_animation('blink')
        Clock.schedule_once(self._return_to_neutral, 0.5)  # quick blink

    def _return_to_neutral(self, dt):
        self.current_state = 'neutral'
        self.is_blinking = False
        self.is_showing_mood = False
        self._update_animation('neutral')

        # if blink was queued during mood, trigger it now
        if self.pending_blink:
            self.pending_blink = False
            Clock.schedule_once(self._trigger_blink, 0.1)

    def _update_animation(self, state_name):
        """Force reload of the animation with delay"""
        path = self._get_animation_path(state_name)

        if state_name == 'blink':
            self.idle_image.anim_delay = 0.05
            self.idle_image.anim_loop = 1

        elif state_name in self.MOODS:
            self.idle_image.anim_delay = 1
            self.idle_image.anim_loop = 1

        else:  # neutral
            self.idle_image.anim_delay = -1
            self.idle_image.anim_loop = 0

        # force reload of GIF
        self.idle_image.source = ''
        self.idle_image.texture = None
        self.idle_image.source = path

    # show clock on touch
    def on_widget_touch(self, touch):
        if self.controller:
            self.controller.show_clock()
            return True
        
        return False
