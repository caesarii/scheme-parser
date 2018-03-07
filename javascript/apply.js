const tokens = require('./tokenList')
const {log, ensure, found, isLetter, isNumber} = require('./utils')
const Type = require('./Type')
const Token = require('./Token')

const findNextToken = (ts, token, start = 0) => {
    let i = 0
    for(let t of ts) {
        if(t.type === token.type && i > start) {
            return i
        }
        i += 1
    }
}

const expr = (opt, num1, num2) => {
    num1 = parseInt(num1)
    num2 = parseInt(num2)
    
    if(opt === '+') {
        return num1 + num2
    } else if(opt === '-') {
        return num1 - num2
    } else if(opt === '*') {
        return num1 * num2
    } else if(opt === '/') {
        return num1 / num2
    } else if(opt === '%') {
        return num1 % num2
    } else if(opt === '<') {
        return num1 < num2 ? 'yes' : 'no'
    } else if(opt === '>') {
        return num1 > num2 ? 'yes' : 'no'
    } else if(opt === '=') {
        return num1 === num2 ? 'yes' : 'no'
    } else if(opt === '!') {
        return num1 !== num2 ? 'yes' : 'no'
    } else {
        log('不支持的运算符')
    }
}

const operate = (ts, i) => {
    const length = ts.length
    let offset = i + 1
    let num1 = ts[offset].value
    while(offset + 1  < length) {
        const token2 = ts[offset + 1]
        const operator = ts[i].value
        if(token2.type === Type.number) {
            num1 = expr(operator, num1, token2.value)
        } else if(token2.type === Type.bracketLeft) {
            const [nested, off] = operate(ts, i + 3)
            offset += off
            num1 = expr(operator, num1, nested)
        } else {
            break
        }
        offset += 1
    }
    result = num1
    return [result, offset]
}

const apply = ts => {
    const length = ts.length
    let result = 0
    let i = 0
    while(i < length) {
        const t = ts[i]
        const type = t.type
        const value = t.value
        
        if(type === Type.bracketLeft) {
            i += 1
        } else if(type === Type.bracketRight) {
            return result
        } else if(type === Type.operator) {
            const [result, offset] = operate(ts, i)
            i = i + offset - 1
            return result
        } else if(type === Type.id) {
            if(value === 'log') {
                log(ts[i + 1].value)
                return null
            }
            i += 2
        } else if(type === Type.condition) {
            i += 1
            const next = ts[i]
            if(next.type === Type.bool) {
                const truth = ts[i + 1]
                let truthEnd = 0
                let falsyEnd = 0
                if(truth.type === Type.bracketLeft) {
                    truthEnd = findNextToken(ts, new Token(Type.auto, ']'))
                }
                const falsy = ts[truthEnd + 1]
                if(falsy.type === Type.bracketLeft) {
                    falsyEnd = findNextToken(ts, new Token(Type.auto, ']'))
                }
                if(next.value === 'yes') {
                    result = apply(ts.slice(i + 1, truthEnd + 1))
                } else if(next.value === 'no') {
                    result = apply(ts.slice(truthEnd + 1, falsyEnd))
                }
            } else if(next.type === Type.bracketLeft) {
                const [bool, offset] = operate(ts, i + 1)
                i += offset
                truth = ts[i].value
                falsy = ts[i + 1].value
                if (bool) {
                    result = truth
                } else {
                    result = falsy
                }
            }
            return result
        } else {
            log('other')
            i += 1
        }
    }
}

if(require.main === module) {
    const code1 = '[+ 1 2]'
    const ts1 = tokens(code1)
    const result1 = apply(ts1)
    ensure(result1 === 3, 'apply test 1')

    const code2 = '[* 2 3 4]'
    const ts2 = tokens(code2)
    const result2 = apply(ts2)
    ensure(result2 === 24, 'apply test 2')

    const code3 = '[log "hello"]'
    const ts3 = tokens(code3)
    const result3 = apply(ts3)
    ensure(result3 === null, 'apply test 3')


    const code4 = '[+ 1 [- 2 3]]'
    const ts4 = tokens(code4)
    const result4 = apply(ts4)
    ensure(result4 === 0, 'apply test 4')

    const code5 = '[if [> 2 1] 3 4]'
    const ts5 = tokens(code5)
    const result5 = apply(ts5)
    log('result 5', result5)
    ensure(result5 === 3, 'apply test 5')



    const code6 = `
            [if yes
                [log "成功"]
                [log "没成功"]
            ]
        `
    const ts6 = tokens(code6)
    const result6 = apply(ts6)
    ensure(result6 === null, 'apply test 6')
}