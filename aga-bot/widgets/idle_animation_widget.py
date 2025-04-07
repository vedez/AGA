from kivy.uix.image import Image
from widgets.base_widget import BaseWidget
from kivy.clock import Clock
import random

class IdleAnimationWidget(BaseWidget):
    """Widget that displays the idle animation with different moods."""
    
    # animation states
    MOODS = ['happy', 'bored', 'curious']
    
    def __init__(self, controller=None, **kwargs):
        super(IdleAnimationWidget, self).__init__(controller=controller, **kwargs)
        
        # track state
        self.current_mood = self._get_random_mood()
        self.previous_mood = None  # Track previous mood to avoid repeating
        self.history_moods = []    # Keep a history of recent moods
        self.is_blinking = False
        
        # create idle animation (GIF)
        self.idle_image = Image(
            source=self._get_animation_path(self.current_mood),
            size_hint=(1, 1),
            pos_hint={'center_x': 0.5, 'center_y': 0.5},
            allow_stretch=True,
            keep_ratio=True,
            anim_delay=2.5,
            anim_loop=0
        )
        
        # Add first mood to history
        self.history_moods.append(self.current_mood)
        
        self.add_widget(self.idle_image)
        
        # schedule animation changes
        Clock.schedule_interval(self._check_blink, 30)
        Clock.schedule_interval(self._change_mood, 120)
    
    def _get_random_mood(self):
        """Get a random mood different from the current and previous ones."""
        
        # First-time case
        if not self.history_moods:
            return random.choice(self.MOODS)
        
        # Get moods to avoid (current and previous)
        moods_to_avoid = self.history_moods[-2:] if len(self.history_moods) >= 2 else self.history_moods
        
        # Filter available moods
        available_moods = [mood for mood in self.MOODS if mood not in moods_to_avoid]
        
        # If we somehow have no options (could happen with just 2 moods total)
        if not available_moods and len(self.MOODS) > 0:
            # At least avoid repeating the current mood
            available_moods = [mood for mood in self.MOODS if mood != self.current_mood]
            
        # If still nothing available, just choose any mood
        if not available_moods:
            return random.choice(self.MOODS)
            
        return random.choice(available_moods)
    
    def _get_animation_path(self, mood):
        """Get the file path for the specified mood."""
        return f'assets/expressions/{mood}.gif'
    
    def _change_mood(self, dt):
        """Change to a different random mood."""
        if not self.is_blinking:
            # Get new mood avoiding current and previous
            new_mood = self._get_random_mood()
            
            # Update mood tracking
            self.previous_mood = self.current_mood
            self.current_mood = new_mood
            
            # Add to history (keep only last 3)
            self.history_moods.append(new_mood)
            if len(self.history_moods) > 3:
                self.history_moods.pop(0)
            
            # Update animation
            self.idle_image.source = self._get_animation_path(self.current_mood)
    
    def _check_blink(self, dt):
        """Temporarily switch to blinking animation."""
        if not self.is_blinking:
            # save current mood and switch to blink
            self.blink_previous_mood = self.current_mood  # Separate from history tracking
            self.is_blinking = True
            self.idle_image.source = 'assets/expressions/blink.gif'
            
            # schedule return to previous mood after 3 seconds
            Clock.schedule_once(self._stop_blinking, 3)
    
    def _stop_blinking(self, dt):
        """Return to previous mood after blinking."""
        self.is_blinking = False
        if hasattr(self, 'blink_previous_mood') and self.blink_previous_mood:
            self.current_mood = self.blink_previous_mood
            self.idle_image.source = self._get_animation_path(self.current_mood)
        
    def on_widget_touch(self, touch):
        """Handle touch events to navigate to clock."""
        if self.controller:
            self.controller.show_clock()
            return True
        return False 