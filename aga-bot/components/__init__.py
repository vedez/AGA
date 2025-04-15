# import components
from components.expression_manager import ExpressionManager
from components.distraction_tracker import DistractionTracker
from components.break_manager import BreakManager
from components.ui_state_manager import UIStateManager
from components.focus_time_tracker import FocusTimeTracker

# export constants used in the components
from components.break_manager import (
    FIRST_BREAK_TIME, 
    SECOND_BREAK_TIME, 
    THIRD_BREAK_TIME,
    FIRST_BREAK_DURATION,
    SECOND_BREAK_DURATION,
    THIRD_BREAK_DURATION
)
from components.distraction_tracker import DISTRACTION_TIMEOUT
from components.ui_state_manager import TIMER_DISPLAY_DURATION

# additional constants
CONSECUTIVE_FRAMES = 30
EXPRESSION_CHANGE_INTERVAL = 10  # seconds between expression changes
AUTO_RETURN_FROM_REFOCUS = True  # automatically return from refocus when user looks back 