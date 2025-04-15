import json
import time
import os
from datetime import datetime, timedelta

class FocusTimeTracker:
    def __init__(self):
        self.data_file = 'focus_data.json'
        self.current_focus_start = None
        self.current_focus_duration = 0
        self.today_date = self._get_current_date()
        
        # make sure data file exists with proper structure
        self._ensure_data_file_exists()
        
    def _get_current_date(self):
        """return current date in DD/MM format"""
        return datetime.now().strftime("%d/%m")
        
    def _ensure_data_file_exists(self):
        """create data file if it doesn't exist or ensure it has proper structure"""
        if not os.path.exists(self.data_file):
            # create empty data structure
            with open(self.data_file, 'w') as f:
                json.dump({}, f)
        else:
            # validate file contains valid JSON
            try:
                with open(self.data_file, 'r') as f:
                    data = json.load(f)
                if not isinstance(data, dict):
                    # overwrite with empty dict if not properly formatted
                    with open(self.data_file, 'w') as f:
                        json.dump({}, f)
            except (json.JSONDecodeError, IOError):
                # reset file if corrupted
                with open(self.data_file, 'w') as f:
                    json.dump({}, f)
    
    def start_focus_session(self):
        """mark the start of a focus session"""
        self.current_focus_start = time.time()
        self.current_focus_duration = 0
        # update current date in case session spans midnight
        self.today_date = self._get_current_date()
        
    def update_focus_time(self):
        """update focus time during an active session - call periodically"""
        if self.current_focus_start is None:
            return
            
        # calculate current session duration in minutes
        current_time = time.time()
        session_duration = (current_time - self.current_focus_start) / 60
        
        # update current duration
        self.current_focus_duration = session_duration
        
        # save current data to prevent data loss on crash
        self._save_current_data()
        
    def end_focus_session(self):
        """end the current focus session and save data"""
        if self.current_focus_start is None:
            return
            
        # final calculation of session duration in minutes
        end_time = time.time()
        session_duration = (end_time - self.current_focus_start) / 60
        
        # update data and reset tracking
        self.current_focus_duration = session_duration
        self._save_current_data()
        
        # reset tracking
        self.current_focus_start = None
        self.current_focus_duration = 0
        
    def _save_current_data(self):
        """save current focus duration to the data file"""
        try:
            # load existing data
            with open(self.data_file, 'r') as f:
                data = json.load(f)
                
            # get today's date
            today = self.today_date
                
            # add today's focus time
            if today not in data:
                data[today] = []
                
            # if we have a previous session for today, update it
            # otherwise add a new session
            if data[today] and isinstance(data[today][-1], float):
                # replace the last entry with current duration
                data[today][-1] = round(self.current_focus_duration, 1)
            else:
                # add a new entry
                data[today].append(round(self.current_focus_duration, 1))
                
            # save updated data
            with open(self.data_file, 'w') as f:
                json.dump(data, f, indent=2)
                
        except (json.JSONDecodeError, IOError) as e:
            print(f"Error saving focus data: {e}")
            
    def get_today_focus_time(self):
        """get total focus time for today in minutes"""
        try:
            today = self._get_current_date()
            
            with open(self.data_file, 'r') as f:
                data = json.load(f)
                
            if today in data and data[today]:
                # sum all sessions for today
                return sum(data[today])
            return 0
            
        except (json.JSONDecodeError, IOError):
            return 0
            
    def get_yesterday_focus_time(self):
        """get total focus time for yesterday in minutes"""
        try:
            # get yesterday's date
            yesterday = (datetime.now() - timedelta(days=1)).strftime("%d/%m")
            
            with open(self.data_file, 'r') as f:
                data = json.load(f)
                
            if yesterday in data and data[yesterday]:
                # sum all sessions for yesterday
                return sum(data[yesterday])
            return 0
            
        except (json.JSONDecodeError, IOError):
            return 0 