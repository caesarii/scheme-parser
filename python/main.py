
from token_list import tokens
from apply import apply
from utils import ensure
def checkTokens():
    code1 = '[+ 1 21]'
    ts1 = tokens(code1)
    print('tokens test 1', ts1)

    code2 = '[* 2 3 4]'
    ts2 = tokens(code2)
    print('tokens test 2', ts2)

    code3 = '[log "hello"]'
    ts3 = tokens(code3)
    print('tokens test 3', ts3)

    code4 = '[+ 1 [- 2 3]]'
    ts4 = tokens(code4)
    print('tokens test 4', ts4)

    code5 = '[if [> 2 1] 3 4]'
    ts5 = tokens(code5)
    print('tokens test 4', ts5)

    code6 = '''
        [if yes
            [log "成功"]
            [log "没成功"]
        ]
    '''
    ts6 = tokens(code6)
    print('tokens test 6', ts6)

    code7 = '''
        [if yes
            [log "成功"] ;abcde
            [log "没成功"]
        ]
    '''
    ts7 = tokens(code7)
    print('tokens test 6', ts7)
def checkApply():
    code1 = '[+ 1 2]'
    ts1 = tokens(code1)
    result1 = apply(ts1)
    ensure(result1 == 3, 'apply test 1')

    code2 = '[* 2 3 4]'
    ts2 = tokens(code2)
    result2 = apply(ts2)
    ensure(result2 == 24, 'apply test 2')

    code3 = '[log "hello"]'
    ts3 = tokens(code3)
    result3 = apply(ts3)
    ensure(result3 == None, 'apply test 3')


    code4 = '[+ 1 [- 2 3]]'
    ts4 = tokens(code4)
    result4 = apply(ts4)
    ensure(result4 == 0, 'apply test 4')

    code5 = '[if [> 2 1] 3 4]'
    ts5 = tokens(code5)
    result5 = apply(ts5)
    print('result 5', result5)
    ensure(result5 == 3, 'apply test 5')



    code6 = '''
            [if yes
                [log "成功"]
                [log "没成功"]
            ]
        '''
    ts6 = tokens(code6)
    result6 = apply(ts6)
    ensure(result6 == None, 'apply test 6')



def main():

    checkTokens()
    # checkApply()

if __name__ == '__main__':
    main()