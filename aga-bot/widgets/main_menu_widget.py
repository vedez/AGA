from kivy.uix.gridlayout import GridLayout
from widgets.base_widget import BaseWidget
from widgets.menu_button import MenuButton

class MainMenuWidget(BaseWidget):
    """displays the main menu grid"""
    
    def __init__(self, controller=None, **kwargs):
        super(MainMenuWidget, self).__init__(controller=controller, **kwargs)
        
        # create grid layout for the menu
        self.grid = GridLayout(cols=2, padding=20, spacing=20)
        self.add_widget(self.grid)
        
        # create menu buttons with callback functions
        self.focus_button = MenuButton(
            icon_source='assets/icons/focus.png',
            text='Focus Mode',
            on_press=self._on_focus_press
        )
        
        self.home_button = MenuButton(
            icon_source='assets/icons/home.png', 
            text='Home',
            on_press=self._on_home_press
        )
        
        self.data_button = MenuButton(
            icon_source='assets/icons/data.png',
            text='Activity',
            on_press=self._on_data_press
        )
        
        self.wip_button = MenuButton(
            icon_source='assets/icons/empty.png',
            text='',
            disabled=True
        )
        
        # add buttons to grid
        self.grid.add_widget(self.focus_button)
        self.grid.add_widget(self.home_button)
        self.grid.add_widget(self.data_button)
        self.grid.add_widget(self.wip_button)
    
    # handle button press for each
    def _on_focus_press(self):
        if self.controller:
            self.controller.show_focus_page()
    
    def _on_home_press(self):
        if self.controller:
            self.controller.show_clock()
    
    def _on_data_press(self):
        if self.controller:
            self.controller.show_data_page() 