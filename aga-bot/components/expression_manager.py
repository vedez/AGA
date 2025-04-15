import os
import random

class ExpressionManager:
    def __init__(self):
        self.expressions = self._get_available_expressions()
        
    def _get_available_expressions(self):
        expressions_dir = 'assets/expressions'
        expressions = []
        for file in os.listdir(expressions_dir):
            if file.endswith('.gif') and not file.startswith('bonus_') and not (file.startswith('bored') or file.startswith('neutral')):
                expressions.append(os.path.join(expressions_dir, file))
        return expressions
        
    def get_random_expression(self):
        if self.expressions:
            return random.choice(self.expressions)
        return None 