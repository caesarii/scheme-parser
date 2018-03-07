from enum import Enum
class Type(Enum):
    auto = 0            # auto 就是 6 个单字符符号的类型
    # colon = 1
    # comma = 2
    # braceLeft = 3
    # braceRight = 4
    bracketLeft = 5
    bracketRight = 6
    number = 7
    string = 8
    # token = 9

    operator = 10
    bool = 12
    comment = 13
    condition = 14
    id = 15
