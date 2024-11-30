import pygame

# GLOBAL
#
# Application
WIDTH, HEIGHT = 400, 400
BACKGROUND_COLOUR = (30, 30, 30)
# AGA's colour
EYE_COLOUR = (30, 30, 30)
SURFACE_COLOUR = (151, 231, 251)
BORDER_COLOUR = (121, 201, 221)
# background colours for non-faces
ALERT_COLOUR = (255, 0, 0)   # alert
BREAK_COLOUR = (89, 174, 195) # break

class BotExpression:
    def __init__(self):
        pygame.init()
        pygame.display.set_caption("AGA - Advanced Guidance Assistance")
        self.screen = pygame.display.set_mode((WIDTH, HEIGHT))
        self.expression = "neutral"


    def bot_shape(self, colour, rect, corner_radius):
        x, y, w, h = rect
        pygame.draw.rect(self.screen, colour, (x + corner_radius, y, w - 2 * corner_radius, h))  # top-bot
        pygame.draw.rect(self.screen, colour, (x, y + corner_radius, w, h - 2 * corner_radius))  # left-right
        
        pygame.draw.circle(self.screen, colour, (x + corner_radius, y + corner_radius), corner_radius)  # top(left)
        pygame.draw.circle(self.screen, colour, (x + w - corner_radius, y + corner_radius), corner_radius)  # top(right)
        pygame.draw.circle(self.screen, colour, (x + corner_radius, y + h - corner_radius), corner_radius)  # bottom(left)
        pygame.draw.circle(self.screen, colour, (x + w - corner_radius, y + h - corner_radius), corner_radius)  # bottom(right)

    def draw_expression(self):
        self.screen.fill(BACKGROUND_COLOUR)

        # change bot colour based on expression
        if self.expression == "alert":
            head_colour = ALERT_COLOUR
        elif self.expression == "break":
            head_colour = BREAK_COLOUR
        else:
            head_colour = SURFACE_COLOUR

        # border around AGA's screen
        border_thickness = 10
        self.bot_shape(BORDER_COLOUR, (100 - border_thickness, 100 - border_thickness, 200 + 2 * border_thickness, 200 + 2 * border_thickness), 30 + border_thickness)
        # create AGA's shape
        self.bot_shape(head_colour, (100, 100, 200, 200), 30)

        # add face features to create expressions
        if self.expression == "happy": # Idea: (0 + _ = D)
            # left eye
            pygame.draw.ellipse(self.screen, EYE_COLOUR, (140, 160, 37, 47))  # half oval
            pygame.draw.rect(self.screen, BACKGROUND_COLOUR, (140, 182, 37, 28))  # flat bottom
            
            # right eye 
            pygame.draw.ellipse(self.screen, EYE_COLOUR, (228, 158, 35, 45))  # half oval
            pygame.draw.rect(self.screen, BACKGROUND_COLOUR, (228, 180, 35, 28))  # flat bottom
        
        elif self.expression == "neutral":
            # oval eyes [ 0  0 ]
            pygame.draw.ellipse(self.screen, EYE_COLOUR, (140, 160, 37, 47)) 
            pygame.draw.ellipse(self.screen, EYE_COLOUR, (228, 158, 35, 45)) 

        elif self.expression == "alert":
            # No face but [ ! ] to alert user*
            # find center position
            center_x, center_y = 200, 200

            # draw exclamation mark for alert
            bar_width, bar_height = 20, 60
            bar_x = center_x - bar_width // 2
            bar_y = center_y - bar_height
            pygame.draw.rect(
                self.screen,
                (255, 255, 255),
                (bar_x, bar_y, bar_width, bar_height),
                border_radius = 10
            )

            dot_radius = 10
            dot_x, dot_y = center_x, center_y + 25
            pygame.draw.circle(
                self.screen,
                (255, 255, 255),
                (dot_x, dot_y),
                dot_radius
            )

        elif self.expression == "attitude":
            # line eyes [ -  - ]
            pygame.draw.line(self.screen, EYE_COLOUR, (130, 180), (185, 180), 15)  
            pygame.draw.line(self.screen, EYE_COLOUR, (215, 180), (270, 180), 15)  

        elif self.expression == "break":
            # No face but [ Break? ] to alert user*
            # create font object, add text in white and center the text
            font = pygame.font.SysFont(None, 60)  # font object
            text = font.render("Break?", True, (255, 255, 255))  
            text_rect = text.get_rect(center=(WIDTH // 2, HEIGHT // 2))  

            self.screen.blit(text, text_rect) 

        pygame.display.flip() # update entire screen for different expressions
