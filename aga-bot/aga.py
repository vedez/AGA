from kivy.app import App
from kivy.core.window import Window
from controllers.main_controller import MainController

class AGA(App):
    def build(self):
        # set window to fullscreen
        # Window.fullscreen = 'auto'

        # set window size (running on laptop for now, not on rasp pi)
        Window.size = (480, 320)
        
        # create and return the main controller
        return MainController()