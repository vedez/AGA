from kivy.uix.label import Label
from widgets.base_widget import BaseWidget

class PageWidget(BaseWidget):
    """Base class for simple content pages with a title/text."""
    
    def __init__(self, controller=None, title="Page", content="", font_size=48, **kwargs):
        super(PageWidget, self).__init__(controller=controller, **kwargs)
        
        # create page content
        self.content_label = Label(
            text=content or title,
            font_size=font_size,
            size_hint=(1, 1),
            halign='center',
            valign='middle'
        )
        self.content_label.bind(size=self.content_label.setter('text_size'))
        
        self.add_widget(self.content_label)
    
    def set_content(self, content):
        """Update the page content."""
        
        self.content_label.text = content 