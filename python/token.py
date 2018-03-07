from type import Type
class Token(object):
    def __init__(self, token_type, token_value):
        super(Token, self).__init__()
        # 表驱动法 if
        d = {
            # ':': Type.colon,
            # ',': Type.comma,
            # '{': Type.braceLeft,
            # '}': Type.braceRight,
            '[': Type.bracketLeft,
            ']': Type.bracketRight,
        }
        if token_type == Type.auto:
            self.type = d[token_value]
        else:
            self.type = token_type

        self.value = token_value
    def __repr__(self):
        return '({})'.format(self.value)