def ensure(condition, message):
    if condition == False:
        print(message, 'failed')
    else:
        print(message, 'succeed')

def isLetter(char):
    return char in 'abcdefghijklmnopqrstuvwxyz'

def isNum(n):
    return n in '0123456789'