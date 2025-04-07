from widgets.page_widget import PageWidget

class FocusPageWidget(PageWidget):
    """displays the focus page"""
    
    def __init__(self, controller=None, **kwargs):
        super(FocusPageWidget, self).__init__(
            controller = controller,
            title = "Focus Mode",
            font_size = 48,
            **kwargs
        ) 