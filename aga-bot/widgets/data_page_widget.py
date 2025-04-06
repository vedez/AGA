from widgets.page_widget import PageWidget

class DataPageWidget(PageWidget):
    """Widget that displays the data page."""
    
    def __init__(self, controller=None, **kwargs):
        super(DataPageWidget, self).__init__(
            controller=controller,
            title="Data Page",
            content="Data Page\n\nPlaceholder for future data visualization",
            font_size=32,
            **kwargs
        ) 