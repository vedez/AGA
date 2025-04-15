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
        self.expression_image.source = self.expression_manager.get_random_expression()
        
        Clock.schedule_interval(self.monitor_camera, 1.0 / 30.0)
        self.current_time_update_event = Clock.schedule_interval(self.update_current_time, 1)
        self.update_current_time()

    def _setup_ui_elements(self):
        self.expression_image = Image(
            size_hint=(1, 1),
            pos_hint={'center_x': 0.5, 'center_y': 0.5},
            allow_stretch=True,
            anim_delay=1
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
        
        # Regular break UI
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
        
        # Break prompt UI
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
        
        # Time marker icon next to duration text
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
        
        # Break duration label (hidden, kept for compatibility)
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
        
        # Break duration icon (five.png, ten.png, fifteen.png)
        self.break_prompt_duration_icon = Image(
            source='assets/icons/five.png',
            size_hint=(0.3, 0.3),
            pos_hint={'center_x': 0.5, 'center_y': 0.4},
            opacity=0,
            allow_stretch=True,
            keep_ratio=True
        )
        self.add_widget(self.break_prompt_duration_icon)
        
        # Icons for break prompt and break over
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
                
                # Only trigger refocus if not in a break
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
        # Handle break over screen
        if self.break_manager.in_break_mode and self.break_icon.opacity > 0:
            # Left icon (work) - go back to work
            if self.break_icon.collide_point(*touch.pos):
                self.break_manager.end_break()
                # Resume focus time tracking
                self.focus_time_tracker.start_focus_session()
                return True
                
            # Right icon (exit) - end focus session
            if self.work_icon.collide_point(*touch.pos) and self.work_icon.opacity > 0:
                if self.controller:
                    # End focus time tracking first
                    self.focus_time_tracker.end_focus_session()
                    self.controller.show_main_menu()
                return True
                
            return True
            
        # Handle break prompt screen
        if self.break_manager.in_break_prompt:
            # Left icon (break) - start break
            if self.break_icon.collide_point(*touch.pos):
                # Pause focus time tracking during break
                self.focus_time_tracker.end_focus_session()
                self.break_manager.start_break()
                return True
                
            # Right icon (work) - skip break (if allowed)
            if self.work_icon.collide_point(*touch.pos) and self.work_icon.opacity > 0:
                self.break_manager.skip_break()
                return True
                
            return True
            
        # Regular pause icon
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
                # Pause focus time tracking
                self.focus_time_tracker.end_focus_session()
            else:
                self.timer.start()
                self.is_paused = False
                self.expression_image.source = self.expression_manager.get_random_expression()
                self.pause_icon.source = 'assets/icons/pause.png'
                self.ui_manager.timer_visible = True
                self.ui_manager.toggle_timer_visibility()
                # Resume focus time tracking
                self.focus_time_tracker.start_focus_session()
            return True
        
        # Regular exit icon
        if self.exit_icon.opacity > 0 and self.exit_icon.collide_point(*touch.pos):
            if self.controller:
                # End focus time tracking
                self.focus_time_tracker.end_focus_session()
                self.controller.show_main_menu()
            return True
            
        # Left side of screen
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
                self.expression_image.source = self.expression_manager.get_random_expression()
                self.pause_icon.source = 'assets/icons/pause.png'
                self.ui_manager.timer_visible = True
                self.ui_manager.toggle_timer_visibility()
        else:
            # Right side of screen
            if self.exit_icon.opacity == 0:
                self.ui_manager.timer_visible = False
                self.ui_manager.toggle_timer_visibility()
                return True
                
            if self.controller:
                # End focus time tracking when exiting to main menu
                self.focus_time_tracker.end_focus_session()
                self.controller.show_main_menu()
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
                5  # Check more frequently (every 5 seconds)
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
        
        self.break_manager.reset()
        
        self.break_overlay.opacity = 0
        self.break_time_label.opacity = 0
        
        self.pause_icon.source = 'assets/icons/pause.png'
        
        # Start focus time tracking
        self.focus_time_tracker.start_focus_session()
        
        # Schedule periodic saves every 30 seconds to prevent data loss on crash
        self.focus_time_save_event = Clock.schedule_interval(
            lambda dt: self.focus_time_tracker.update_focus_time(), 
            30  # Save every 30 seconds
        )

    def on_exit_focus(self):
        self.timer.stop()
        
        # End focus time tracking
        if self.focus_time_save_event:
            self.focus_time_save_event.cancel()
            self.focus_time_save_event = None
            
        # Save final focus time
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
            
        # Make sure auto-exit timers in the distraction tracker are also canceled
        if self.distraction_tracker.auto_exit_check_event:
            self.distraction_tracker.auto_exit_check_event.cancel()
            self.distraction_tracker.auto_exit_check_event = None
            
        # Reset all state
        self.distraction_tracker.reset()
        self.is_paused = False
        self.break_manager.in_break_mode = False
        self.break_manager.in_break_prompt = False
        
        # Make sure all UI elements are hidden
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
            