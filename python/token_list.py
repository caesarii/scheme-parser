from utils import ensure
from token import Token
from type import Type
from utils import isLetter, isNum


'''
处理子类型的函数遵循两点
1. index 应该指向当前类型的标记符号, 比如字符串的第一个 "
2. 返回的 i 应该是当前类型结束后的第一个字符, 比如 字符串结束" 后面
'''
def string_end(code, index):
    # index 对应 "
    s = ''
    i = index + 1
    while i < len(code):
        c = code[i]
        if c == '"':
            # 找到字符串结尾
            i += 1
            return (s, i)
        elif c == '\\':
            next = code[i + 1]
            i += 2
            if next == '"':
                s += '"'
            elif next == "\t":
                s += '\t'
            elif next == '\n':
                s += '\n'
            elif next == '\\':
                s += '\\'
            else:
                # 非法转义符
                print('非法转义符')
        elif isLetter(c):
            # 普通字符
            s += c
            i += 1
        else:
            pass

    # 程序出错, 没有反引号
    print('程序出错, 没有反引号')

def commentEnd(code, offset):
    comment = ''

    while offset < len(code):
        char = code[offset]
        if char == '\n':
            return (comment, offset)
        else:
            comment += char
        offset += 1

def numberEnd(code, index):
    i = index
    while i < len(code):
        c = code[i]

        if not isNum(c):
            return (code[index: i], i)
        else:
            i += 1

def keywordEnd(code, index):
    i = index
    keyword = ''
    while i < len(code):
        c = code[i]
        if not isLetter(c):
            return (keyword, i)
        else:
            i += 1
            keyword += c

def tokens(code):
    length = len(code)
    tokens = []
    spaces = '\n\t\r\s'
    operator = '+-*/%=!<>'

    # 当前下标
    i = 0
    while i < length:
        c = code[i]
        i += 1
        if c in spaces:
            # 空白符号跳过 space tab return
            continue
        elif c in '[]':
            # []
            t = Token(Type.auto, c)
            tokens.append(t)
        elif c == '"':
            # 字符串
            s, i = string_end(code, i - 1)
            t = Token(Type.string, s)
            tokens.append(t)
        elif isNum(c):
            # 处理数字, 现在不支持小数 负数
            d, i = numberEnd(code, i - 1)
            t = Token(Type.number, d)
            tokens.append(t)
        elif c in operator:
            t = Token(Type.operator, c)
            tokens.append(t)
        elif c == ';':
            comment, i = commentEnd(code, i - 1)
            t = Token(Type.comment, comment)
            tokens.append(t)
        elif isLetter(c):
            # keyword and id : if yes no  log
            sub, i = keywordEnd(code, i - 1)
            keywords = {
                'if': Type.condition,
                'yes': Type.bool,
                'no': Type.bool,
                'log': Type.id
            }
            type = keywords[sub]
            t = Token(type, sub)
            tokens.append(t)
            pass
        else:
            # 出错了
            pass

    return tokens
