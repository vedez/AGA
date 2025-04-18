import cv2
import random
from widgets.page_widget import PageWidget
from widgets.timer_widget import TimerWidget
from kivy.uix.label import Label
from kivy.uix.image import Image
from kivy.clock import Clock
from kivy.graphics.texture import Texture
from kivy.animation import Animation
from kivy.properties import NumericProperty
from datetime import datetime, timedelta
from controllers.video_capture import VideoCapture
from controllers.face_detector import FaceDetector
import os
import time
from kivy.graphics import Color, Line, Ellipse
from kivy.uix.widget import Widget
from kivy.uix.boxlayout import BoxLayout

# import component classes
from components.expression_manager import ExpressionManager
from components.distraction_tracker import DistractionTracker
from components.break_manager import BreakManager
from components.ui_state_manager import UIStateManager
from components.focus_time_tracker import FocusTimeTracker

# import constants from components
from components import (
    CONSECUTIVE_FRAMES,
    EXPRESSION_CHANGE_INTERVAL,
    TIMER_DISPLAY_DURATION,
    DISTRACTION_TIMEOUT,
    AUTO_RETURN_FROM_REFOCUS,
    FIRST_BREAK_TIME,
    SECOND_BREAK_TIME,
    THIRD_BREAK_TIME,
    FIRST_BREAK_DURATION,
    SECOND_BREAK_DURATION,
    THIRD_BREAK_DURATION
)

# global
AUTO_RETURN_FROM_REFOCUS = True  # automatically return from refocus when user looks back

class FocusPageWidget(PageWidget):
    # bonus animations
    BONUS_ANIMATIONS = ['bonus_wink', 'bonus_hum', 'bonus_love']
    # mood types (assets)
    MOODS = ['happy', 'bored', 'curious', 'annoyed', 'attitude', 'excited', 'giggly']
    
    def __init__(self, controller=None, **kwargs):
        super(FocusPageWidget, self).__init__(
            controller=controller,
            title="",
            font_size=32,
            **kwargs
        )

        self.expression_manager = ExpressionManager()
        self.video_capture = VideoCapture()
        self.face_detector = FaceDetector()
        self.update_event = None
        self.is_looking = False
        self.is_paused = False
        
        # double tap detection
        self.last_touch_time = 0
        self.double_tap_threshold = 0.3  # seconds between taps to count as double tap
        self.playing_bonus_animation = False
        self._pending_tap_event = None
        self._last_touch_pos = (0, 0)
        
        # animation state variables
        self.current_state = 'neutral'  # default
        self.previous_mood = None
        self.is_blinking = False
        self.is_showing_mood = False
        self.pending_blink = False  # priorities mood over blink
        
        # create UI elements
        self._setup_ui_elements()
        
        # setup component managers
        self.ui_manager = UIStateManager(self)
        self.distraction_tracker = DistractionTracker(controller)
        self.break_manager = BreakManager(self.ui_manager)
        self.focus_time_tracker = FocusTimeTracker()
        
        # initialize state
        self.timer_toggle_event = None
        self.current_time_update_event = None
        self.focus_time_save_event = None
        
        # set initial expression
        self._update_animation('neutral')
        
        # setup animation timers
        Clock.schedule_interval(self._trigger_blink, 8)   # blink every 8s
        Clock.schedule_interval(self._trigger_mood, 29)   # mood change every 29s
        
        Clock.schedule_interval(self.monitor_camera, 1.0 / 30.0)
        self.current_time_update_event = Clock.schedule_interval(self.update_current_time, 1)
        self.update_current_time()

    def _setup_ui_elements(self):
        self.expression_image = Image(
            size_hint=(1, 1),
            pos_hint={'center_x': 0.5, 'center_y': 0.5},
            allow_stretch=True,
            anim_delay=-1,  # Start with static neutral expression
            anim_loop=0
        )
        self.add_widget(self.expression_image)
        
        self.timer = TimerWidget(controller=self.controller)
        self.timer.size_hint = (1, 0.3)
        self.timer.pos_hint = {'center_x': 0.5, 'center_y': 0.5}
        self.timer.opacity = 0
        self.add_widget(self.timer)
        
        self.current_time_label = Label(
            text="",
            font_size=36,
            color=(1, 1, 1, 0.8),
            size_hint=(1, 0.1),
            pos_hint={'center_x': 0.5, 'center_y': 0.30},
            opacity=0
        )
        self.add_widget(self.current_time_label)
        
        self.pause_icon = Image(
            source='assets/icons/pause.png',
            size_hint=(0.15, 0.15),
            pos_hint={'left': 0.01, 'center_y': 0.10},  
            allow_stretch=True,
            keep_ratio=True,
            opacity=0
        )
        self.add_widget(self.pause_icon)
        
        self.exit_icon = Image(
            source='assets/icons/exit.png',
            size_hint=(0.15, 0.15),
            pos_hint={'right': 0.995, 'center_y': 0.10},
            allow_stretch=True,
            keep_ratio=True,
            opacity=0
        )
        self.add_widget(self.exit_icon)
        
        # regular break UI
        self.break_overlay = Label(
            text="",
            font_size=40,
            color=(1, 1, 1, 0.9),
            size_hint=(1, 1),
            pos_hint={'center_x': 0.5, 'center_y': 0.6},
            opacity=0
        )
        self.add_widget(self.break_overlay)
        
        self.break_time_label = Label(
            text="",
            font_size=70,
            color=(1, 1, 1, 0.9),
            size_hint=(1, 0.2),
            pos_hint={'center_x': 0.5, 'center_y': 0.4},
            opacity=0
        )
        self.add_widget(self.break_time_label)
        
        # break prompt UI
        self.break_prompt_overlay = Label(
            text="",
            font_size=40,
            color=(1, 0.8, 0.2, 1),
            size_hint=(1, 0.3),
            pos_hint={'center_x': 0.5, 'center_y': 0.8},
            opacity=0,
            bold=True
        )
        self.add_widget(self.break_prompt_overlay)
        
        # time marker icon next to duration text
        self.time_marker_icon = Image(
            source='assets/icons/time_marker.png',
            size_hint=(0.1, 0.1),
            pos_hint={'center_x': 0.7, 'center_y': 0.8},
            opacity=0,
            allow_stretch=True,
            keep_ratio=True
        )
        self.add_widget(self.time_marker_icon)
        
        self.break_prompt_message = Label(
            text="",
            font_size=30,
            color=(1, 1, 1, 1),
            size_hint=(1, 0.3),
            pos_hint={'center_x': 0.5, 'center_y': 0.6},
            opacity=0,
            bold=True
        )
        self.add_widget(self.break_prompt_message)
        
        # break duration label (hidden, kept for compatibility)
        self.break_prompt_duration = Label(
            text="",
            font_size=50,
            color=(1, 1, 1, 0.9),
            size_hint=(1, 0.3),
            pos_hint={'center_x': 0.5, 'center_y': 0.4},
            opacity=0,
            bold=True
        )
        self.add_widget(self.break_prompt_duration)
        
        # break duration icon (five.png, ten.png, fifteen.png)
        self.break_prompt_duration_icon = Image(
            source='assets/icons/five.png',
            size_hint=(0.3, 0.3),
            pos_hint={'center_x': 0.5, 'center_y': 0.4},
            opacity=0,
            allow_stretch=True,
            keep_ratio=True
        )
        self.add_widget(self.break_prompt_duration_icon)
        
        # icons for break prompt and break over
        self.break_icon = Image(
            source='assets/icons/break.png',
            size_hint=(0.2, 0.2),
            pos_hint={'left': 0.1, 'center_y': 0.15},
            allow_stretch=True,
            keep_ratio=True,
            opacity=0
        )
        self.add_widget(self.break_icon)
        
        self.work_icon = Image(
            source='assets/icons/work.png',
            size_hint=(0.2, 0.2),
            pos_hint={'right': 0.995, 'center_y': 0.15},
            allow_stretch=True,
            keep_ratio=True,
            opacity=0
        )
        self.add_widget(self.work_icon)

    def update_current_time(self, dt=None):
        current_time = datetime.now().strftime("%H:%M")
        self.current_time_label.text = current_time
            
    def monitor_camera(self, dt):
        if self.is_paused or self.break_manager.in_break_mode or self.break_manager.in_break_prompt:
            return
            
        frame_data = self.video_capture.read_frame()
        
        if frame_data is not None:
            frame, gray_frame = frame_data
            
            user_looking, eyes_detected, face_stable, body_stable = self.face_detector.process_frame(frame, gray_frame, fps = 30)
            
            current_time = time.time()
            
            if self.controller and self.controller.current_widget == self.controller.focus_page_widget:
                status_text, should_refocus = self.distraction_tracker.update(user_looking, eyes_detected, current_time)
                
                # only trigger refocus if not in a break
                if should_refocus and self.controller and not (self.break_manager.in_break_mode or self.break_manager.in_break_prompt):
                    self.controller.show_refocus_page()
            
            if self.distraction_tracker.in_refocus_mode and AUTO_RETURN_FROM_REFOCUS and user_looking and eyes_detected >= 1:
                if self.controller and self.controller.current_widget == self.controller.refocus_page_widget:
                    self.distraction_tracker.reset()
                    self.controller.show_focus_page(reset_timer=False)

    def update(self, dt):
        if self.is_paused or self.break_manager.in_break_mode or self.break_manager.in_break_prompt:
            return
            
        frame_data = self.video_capture.read_frame()
        
        if frame_data is not None:
            frame, gray_frame = frame_data
            current_time = datetime.now().timestamp()
            user_looking, eyes_detected, face_stable, body_stable = self.face_detector.process_frame(frame, gray_frame, fps = 30)
            
            _, should_refocus = self.distraction_tracker.update(user_looking, eyes_detected, current_time)
            
            if should_refocus and self.controller and not (self.break_manager.in_break_mode or self.break_manager.in_break_prompt):
                self.controller.show_refocus_page()

    def on_stop(self):
        if self.update_event:
            self.update_event.cancel()
        if self.timer_toggle_event:
            self.timer_toggle_event.cancel()
        if self.focus_time_save_event:
            self.focus_time_save_event.cancel()
            self.focus_time_tracker.end_focus_session()
        self.video_capture.release()

    def on_widget_touch(self, touch):
        # handle double-tap first
        current_time = Clock.get_time()
        time_diff = current_time - self.last_touch_time
        
        if time_diff < self.double_tap_threshold:
            # this is a double tap - cancel any pending single tap action
            if hasattr(self, '_pending_tap_event') and self._pending_tap_event:
                self._pending_tap_event.cancel()
                self._pending_tap_event = None
                
            # play bonus animation
            self._play_bonus_animation()
            self.last_touch_time = 0  # reset time to prevent triple tap detection
            return True
            
        # record this touch time for potential double tap
        self.last_touch_time = current_time
        
        # store touch position for delayed handling
        self._last_touch_pos = touch.pos
        
        # schedule single tap action with delay to allow for double tap detection
        if hasattr(self, '_pending_tap_event') and self._pending_tap_event:
            self._pending_tap_event.cancel()
            
        # schedule the single tap action with a delay matching the double tap threshold
        self._pending_tap_event = Clock.schedule_once(
            lambda dt: self._handle_single_tap(self._last_touch_pos), 
            self.double_tap_threshold
        )
        
        return True
        
    def _handle_single_tap(self, pos):
        # only execute this if not canceled by a double tap
        # handle regular touch behaviors
        
        # create a touch-like object with the stored position
        class TouchLike:
            def __init__(self, pos):
                self.pos = pos
                
        touch = TouchLike(pos)
        
        # handle break over screen
        if self.break_manager.in_break_mode and self.break_icon.opacity > 0:
            # left icon (work) - go back to work
            if self.break_icon.collide_point(*touch.pos):
                self.break_manager.end_break()
                # resume focus time tracking
                self.focus_time_tracker.start_focus_session()
                return True
                
            # right icon (exit) - end focus session
            if self.work_icon.collide_point(*touch.pos) and self.work_icon.opacity > 0:
                if self.controller:
                    # end focus time tracking first
                    self.focus_time_tracker.end_focus_session()
                    self.controller.show_main_menu()
                return True
                
            return True
            
        # handle break prompt screen
        if self.break_manager.in_break_prompt:
            # left icon (break) - start break
            if self.break_icon.collide_point(*touch.pos):
                # pause focus time tracking during break
                self.focus_time_tracker.end_focus_session()
                self.break_manager.start_break()
                return True
                
            # right icon (work) - skip break (if allowed)
            if self.work_icon.collide_point(*touch.pos) and self.work_icon.opacity > 0:
                self.break_manager.skip_break()
                return True
                
            return True
            
        # regular pause icon
        if self.pause_icon.opacity > 0 and self.pause_icon.collide_point(*touch.pos):
            focus_duration = time.time() - self.break_manager.focus_start_time
            
            break_num = self.break_manager.should_take_break(focus_duration)
            if break_num > 0:
                self.break_manager.show_break_prompt(break_num)
                return True
                
            if self.timer.is_running():
                self.timer.stop()
                self.is_paused = True
                self.expression_image.opacity = 0
                self.timer.opacity = 1
                self.current_time_label.opacity = 1
                self.pause_icon.opacity = 1
                self.exit_icon.opacity = 1
                self.pause_icon.source = 'assets/icons/play.png'
                # pause focus time tracking
                self.focus_time_tracker.end_focus_session()
            else:
                self.timer.start()
                self.is_paused = False
                self._update_animation('neutral')
                self.pause_icon.source = 'assets/icons/pause.png'
                self.ui_manager.timer_visible = True
                self.ui_manager.toggle_timer_visibility()
                # resume focus time tracking
                self.focus_time_tracker.start_focus_session()
            return True
        
        # regular exit icon
        if self.exit_icon.opacity > 0 and self.exit_icon.collide_point(*touch.pos):
            if self.controller:
                # end focus time tracking
                self.focus_time_tracker.end_focus_session()
                self.controller.show_main_menu()
            return True
            
        # left side of screen
        if touch.pos[0] < self.width / 2:
            if self.pause_icon.opacity == 0:
                self.ui_manager.timer_visible = False
                self.ui_manager.toggle_timer_visibility()
                return True
                
            focus_duration = time.time() - self.break_manager.focus_start_time
            
            break_num = self.break_manager.should_take_break(focus_duration)
            if break_num > 0:
                self.break_manager.show_break_prompt(break_num)
                return True
                
            if self.timer.is_running():
                self.timer.stop()
                self.is_paused = True
                self.expression_image.opacity = 0
                self.timer.opacity = 1
                self.current_time_label.opacity = 1
                self.pause_icon.opacity = 1
                self.exit_icon.opacity = 1
                self.pause_icon.source = 'assets/icons/play.png'
            else:
                self.timer.start()
                self.is_paused = False
                self._update_animation('neutral')
                self.pause_icon.source = 'assets/icons/pause.png'
                self.ui_manager.timer_visible = True
                self.ui_manager.toggle_timer_visibility()
        else:
            # right side of screen
            if self.exit_icon.opacity == 0:
                self.ui_manager.timer_visible = False
                self.ui_manager.toggle_timer_visibility()
                return True
                
            if self.controller:
                # end focus time tracking when exiting to main menu
                self.focus_time_tracker.end_focus_session()
                self.controller.show_main_menu()
        
        # clear the pending event reference
        self._pending_tap_event = None
        
        return True

    def start_toggle_timer(self):
        if not self.timer_toggle_event:
            self.timer_toggle_event = Clock.schedule_interval(
                lambda dt: self.ui_manager.toggle_timer_visibility(), 
                EXPRESSION_CHANGE_INTERVAL
            )
        
        if not self.break_manager.break_check_event:
            self.break_manager.break_check_event = Clock.schedule_interval(
                lambda dt: self._update_pause_icon(), 
                5  # check more frequently (every 5 seconds)
            )
            
    def _update_pause_icon(self):
        icon = self.break_manager.check_break_status(is_paused=self.is_paused)
        if icon:
            # if the icon has changed to break icon, show the break prompt
            if icon == 'assets/icons/break.png' and self.pause_icon.source != icon:
                focus_duration = time.time() - self.break_manager.focus_start_time
                break_num = self.break_manager.should_take_break(focus_duration)
                if break_num > 0:
                    self.break_manager.show_break_prompt(break_num)
            self.pause_icon.source = icon

    def on_enter_focus(self):
        if not self.update_event:
            self.update_event = Clock.schedule_interval(self.update, 1.0 / 30.0)
        
        self.timer.reset()
        self.timer.start()
        
        self.start_toggle_timer()
        
        self.ui_manager.timer_visible = True
        self.ui_manager.toggle_timer_visibility()
        
        self.distraction_tracker.reset()
        self.is_paused = False
        
        # RESET animation state
        self.current_state = 'neutral'
        self.is_blinking = False
        self.is_showing_mood = False
        self.pending_blink = False
        self.playing_bonus_animation = False
        self._update_animation('neutral')
        
        self.break_manager.reset()
        
        self.break_overlay.opacity = 0
        self.break_time_label.opacity = 0
        
        self.pause_icon.source = 'assets/icons/pause.png'
        
        # start focus time tracking
        self.focus_time_tracker.start_focus_session()
        
        # schedule periodic saves every 30 seconds to prevent data loss on crash
        self.focus_time_save_event = Clock.schedule_interval(
            lambda dt: self.focus_time_tracker.update_focus_time(), 
            30  # save every 30 seconds
        )

    def on_exit_focus(self):
        self.timer.stop()
        
        # end focus time tracking
        if self.focus_time_save_event:
            self.focus_time_save_event.cancel()
            self.focus_time_save_event = None
            
        # save final focus time
        self.focus_time_tracker.end_focus_session()
        
        if self.update_event:
            self.update_event.cancel()
            self.update_event = None
            
        if self.timer_toggle_event:
            self.timer_toggle_event.cancel()
            self.timer_toggle_event = None
            
        if self.break_manager.break_check_event:
            self.break_manager.break_check_event.cancel()
            self.break_manager.break_check_event = None
            
        if self.break_manager.break_countdown_event:
            self.break_manager.break_countdown_event.cancel()
            self.break_manager.break_countdown_event = None
            
        if self.break_manager.auto_exit_check_event:
            self.break_manager.auto_exit_check_event.cancel()
            self.break_manager.auto_exit_check_event = None
            
        if self.break_manager.prompt_auto_exit_check_event:
            self.break_manager.prompt_auto_exit_check_event.cancel()
            self.break_manager.prompt_auto_exit_check_event = None
            
        if self.current_time_update_event:
            self.current_time_update_event.cancel()
            self.current_time_update_event = None
            
        # make sure auto-exit timers in the distraction tracker are also canceled
        if self.distraction_tracker.auto_exit_check_event:
            self.distraction_tracker.auto_exit_check_event.cancel()
            self.distraction_tracker.auto_exit_check_event = None
            
        # reset all state
        self.distraction_tracker.reset()
        self.is_paused = False
        self.break_manager.in_break_mode = False
        self.break_manager.in_break_prompt = False
        
        # Reset animation state
        self.current_state = 'neutral'
        self.is_blinking = False
        self.is_showing_mood = False
        self.pending_blink = False
        self.playing_bonus_animation = False
        
        # make sure all UI elements are hidden
        self.expression_image.opacity = 0
        self.timer.opacity = 0
        self.current_time_label.opacity = 0
        self.pause_icon.opacity = 0
        self.exit_icon.opacity = 0
        self.break_overlay.opacity = 0
        self.break_time_label.opacity = 0
        self.break_prompt_overlay.opacity = 0
        self.break_prompt_message.opacity = 0
        self.break_prompt_duration.opacity = 0
        self.break_prompt_duration_icon.opacity = 0
        self.time_marker_icon.opacity = 0
        self.break_icon.opacity = 0
        self.work_icon.opacity = 0
            
    # random bonus animation picker
    def _get_random_bonus(self):
        return random.choice(self.BONUS_ANIMATIONS)
        
    # random mood picker
    def _get_random_mood(self):
        moods = [m for m in self.MOODS if m != self.previous_mood]
        return random.choice(moods) if moods else random.choice(self.MOODS)
    
    def _get_animation_path(self, state_name):
        return f'assets/expressions/{state_name}.gif'
        
    # trigger mood, no overlaps and return neutral after 3 seconds
    def _trigger_mood(self, dt):
        if self.is_paused or self.break_manager.in_break_mode or self.break_manager.in_break_prompt:
            return
            
        if self.is_blinking or self.is_showing_mood or self.playing_bonus_animation:
            return

        new_mood = self._get_random_mood()
        self.previous_mood = new_mood
        self.is_showing_mood = True
        self.current_state = 'mood'

        self._update_animation(new_mood)
        Clock.schedule_once(self._return_to_neutral, 3) # length of mood display

    def _trigger_blink(self, dt):
        if self.is_paused or self.break_manager.in_break_mode or self.break_manager.in_break_prompt:
            return
            
        if self.is_showing_mood or self.playing_bonus_animation:
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
            self.expression_image.anim_delay = 0.05
            self.expression_image.anim_loop = 1

        elif state_name in self.MOODS:
            self.expression_image.anim_delay = 1
            self.expression_image.anim_loop = 1
            
        elif state_name in self.BONUS_ANIMATIONS:
            self.expression_image.anim_delay = 1
            self.expression_image.anim_loop = 1

        else:  # neutral
            self.expression_image.anim_delay = -1
            self.expression_image.anim_loop = 0

        # force reload of GIF
        self.expression_image.source = ''
        self.expression_image.texture = None
        self.expression_image.source = path
            
    # replace the existing _play_bonus_animation method
    def _play_bonus_animation(self):
        if self.is_paused or self.break_manager.in_break_mode or self.break_manager.in_break_prompt:
            return
            
        if self.is_blinking or self.is_showing_mood or self.playing_bonus_animation:
            return
        
        bonus_animation = self._get_random_bonus()
        self.playing_bonus_animation = True
        self.current_state = 'bonus'
        
        self._update_animation(bonus_animation)
        # give bonus animations longer display time (5 seconds)
        Clock.schedule_once(self._return_from_bonus_animation, 5)
    
    # modify _return_from_bonus_animation to use _return_to_neutral logic
    def _return_from_bonus_animation(self, dt):
        self.playing_bonus_animation = False
        self._return_to_neutral(dt)
        
        # restore timer visibility state based on ui_manager state
        if self.ui_manager.timer_visible:
            self.expression_image.opacity = 0
            self.timer.opacity = 1
            self.current_time_label.opacity = 1
            self.pause_icon.opacity = 1
            self.exit_icon.opacity = 1
        else:
            self.expression_image.opacity = 1
            self.timer.opacity = 0
            self.current_time_label.opacity = 0
            self.pause_icon.opacity = 0
            self.exit_icon.opacity = 0
            