from kivy.uix.label import Label
from widgets.base_widget import BaseWidget

class PageWidget(BaseWidget):
    """simple content pages with title/text - ui template"""
    
    def __init__(self, controller=None, title="Page", content="", font_size=48, **kwargs):
        super(PageWidget, self).__init__(controller=controller, **kwargs)
        
        # create label to display page content or title
        self.content_label = Label(
            text=content or title,
            font_size=font_size,
            size_hint=(1, 1),
            
            halign='center',
            valign='middle'
        )
        
        # adjust text layout to match label size
        self.content_label.bind(size=self.content_label.setter('text_size'))
        
        # add label to widget layout
        self.add_widget(self.content_label)
    
    def set_content(self, content):
        """update page content"""
        
        # change text shown on label
        self.content_label.text = content 
