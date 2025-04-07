from widgets.page_widget import PageWidget
from kivy.uix.image import Image
from kivy.uix.label import Label
from kivy.graphics import Color, Rectangle

class RefocusPageWidget(PageWidget):
    """displays a refocus icon/message"""

    def __init__(self, controller=None, **kwargs):
        super(RefocusPageWidget, self).__init__(
            controller=controller,
            title="",
            font_size=32,
            **kwargs
        )

        # red background
        with self.canvas.before:
            Color(0.5, 0, 0, 1)  # Dark red
            self.bg_rect = Rectangle()
        self.bind(pos=self._update_bg_rect, size=self._update_bg_rect)

        # refocus image
        self.refocus_image = Image(
            source='assets/icons/refocus.png',
            size_hint=(None, None),
            size=(250, 250),
            pos_hint={'center_x': 0.5, 'center_y': 0.60}
        )

        # message label 
        self.message_label = Label(
            text="Refocus",
            font_size=50,
            color=(1, 1, 1, 1),  
            size_hint=(1, 0.2),
            
            pos_hint={'center_x': 0.5, 'center_y': 0.20},
            halign='center',
            valign='middle',
            bold= True
        )
        self.message_label.bind(size=self.message_label.setter('text_size'))

        self.add_widget(self.refocus_image)
        self.add_widget(self.message_label)

    def _update_bg_rect(self, *args):
        self.bg_rect.pos = self.pos
        self.bg_rect.size = self.size
