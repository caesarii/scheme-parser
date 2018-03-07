from utils import ensure
from token import Token
from type import Type

def findNextToken(ts, token, start = 0):
    i = 0
    for t in ts:
        # print('find', t, token, i)
        if t.type == token.type and i > start:
            return i
        i += 1
def expr(opt, num1, num2):
    # print('expr', opt, num1, num2)

    num1 = int(num1)
    num2 = int(num2)
    if opt == '+':
        return num1 + num2
    elif opt == '-':
        return num1 - num2
    elif opt == '*':
        return num1 * num2
    elif opt == '/':
        return num1 / num2
    elif opt == '%':
        return num1 % num2
    elif opt == '<':
        return 'yes' if num1 < num2 else 'no'
    elif opt == '>':
        return 'yes' if num1 > num2 else 'no'
    elif opt == '=':
        return 'yes' if num1 == num2 else 'no'
    elif opt == '!':
        return 'yes' if num1 != num2 else 'no'
    else:
        print('不支持的运算符')

def operate(ts, i):
    length = len(ts)
    offset = i + 1
    num1 = ts[offset].value
    while offset + 1 < length:
        token2 = ts[offset + 1]
        operator = ts[i].value
        if token2.type == Type.number:
            num1 = expr(operator, num1, token2.value)
        elif token2.type == Type.bracketLeft:
            nested, off = operate(ts, i + 3)
            offset += off
            # print('嵌套', nested, num1)
            num1 = expr(operator, num1, nested)
        else:
            break
        offset += 1

    result = num1

    return (result, offset)

def apply(ts):
    length = len(ts)
    result = 0
    i = 0
    while i < length:
        # token
        t = ts[i]
        type = t.type
        value = t.value

        if type == Type.bracketLeft:
            # [
            pass
            i += 1
        elif type == Type.bracketRight:
            # ]
            return result
        elif type == Type.operator:
            # 运算表达式
            result, offset = operate(ts, i)

            i += offset - 1
            return result
        elif type == Type.id:

            if value == 'log':
                print(ts[i + 1].value)
                return None
            i += 2
        elif type == Type.condition:
            i += 1
            next = ts[i]

            if next.type == Type.bool:

                truth = ts[i + 1]
                truthEnd = 0
                falsyEnd = 0
                if truth.type == Type.bracketLeft:
                    truthEnd = findNextToken(ts, Token(Type.auto, "]"))
                falsy = ts[truthEnd + 1]
                if falsy.type == Type.bracketLeft:
                    falsyEnd = findNextToken(ts, Token(Type.auto, "]"), truthEnd)

                if next.value == 'yes':
                    result = apply(ts[i + 1: truthEnd + 1])
                elif next.value == 'no':
                    result = apply(ts[truthEnd + 1 : falsyEnd])


            elif next.type == Type.bracketLeft:

                bool, offset = operate(ts, i + 1)
                i += offset
                truth = ts[i].value
                falsy = ts[i + 1].value
                if bool:
                    result = truth
                else:
                    result = falsy
            return result

        else:
            print('其他')
            i += 1


