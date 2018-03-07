
const {log, ensure, found, isLetter, isNumber} = require('./utils')
const Type = require('./Type')
const Token = require('./Token')

// 查找字符串结尾的函数
// 返回字符串和字符串结尾 " 的索引
// index 是字符串开始的 " 的索引
const stringEnd = (code, index) => {
    let s = ''
    let i = index + 1
    while(i < code.length) {
        const c = code[i]
        if(c === '"') {
            // 找到字符串结尾
            return [s, i]
        } else if(c === '\\') {
            // 处理转义字符
            const next = code[i + 1]
            if(next === '"') {
                s += '"'
                i += 2
            } else if(next === '\t') {
                s += '\t'
                i += 2
            } else if(next === '\n') {
                s += '\n'
                i += 2
            } else if(next === '\\') {
                s += '\\'
                i += 2
            } else {
                // 非法转义字符
                log('非法转义字符')
            }
        } else {
            // 普通字符
            s += c
            i += 1
        }
    }
    log('程序出错，没有反引号')
}

const commentEnd = (code, index) => {
    let s = ''
    let i = index + 1
    while(i < code.length) {
        let c = code[i]
        if(c === '\n') {
            return [s, i]
        } else {
            s += c
        }
        i += 1
    }
}

// 查找数字结尾的函数
// 返回数字和最后一个数字的索引
// index 是第一个数字的索引
const numberEnd = (code, index) => {
    // 第二个数字
    let offset = index + 1
    while(isNumber(code[offset])) {
        offset += 1
    }
    return [code.slice(index, offset), offset - 1]
}

// 查找关键词结尾的函数， 参数和返回值与上面相同
const keywordEnd = (code, index) => {
    // 第一个字符
    let k = code[index]
    // 第二个字符
    let i = index + 1
    while(i < code.length) {
        const c = code[i]
        if(isLetter(c)) {
            k += c
        } else {
            return [k, i]
        }
        i += 1
    }
}

const tokens = (code) => {
    const length = code.length
    const tokens = []
    // 回车 换行 制表符 空格
    const spaces = '\r\n\t '
    const symbols = '[]'
    // 关键字 true, false, null
    const keywords = {
        'if': Type.condition,
        'yes': Type.bool,
        'no': Type.bool,
        'log': Type.id,
    }
    const operator = '+-*/%=!<>'
    
    let i = 0
    while(i < length) {
        const c = code[i]
        // i 指向下一个字符
        // i += 1
        // log('c', c)
        if(found(c, spaces)) {
            // 跳过空白符
            
        } else if(found(c, symbols)) {
            // 单字符符号
            const  t = new Token(Type.auto, c)
            tokens.push(t)
        } else if(c === '"') {
            // 字符串
            // i 指向字符串
            const [s, offset] = stringEnd(code, i)
            i = offset
            const t = new Token(Type.string, s)
            tokens.push(t)
        } else if(isNumber(c)) {
            // 处理数字
            // const end = 0
            const [n, offset] = numberEnd(code, i)
            i = offset
            const t = new Token(Type.number, n)
            tokens.push(t)
        } else if(found(c, operator)) {
            const t = new Token(Type.operator, c)
            tokens.push(t)
        } else if(c === ';') {
            const [z, offset] = commentEnd(code,i)
            i = offset
            const t = new Token(Type.comment, z)
            tokens.push(t)
        } else if(isLetter(c)) {
            const [key, offset] = keywordEnd(code, i)
            i = offset
            const type = keywords[key]
            const t = new Token(type, key)
            tokens.push(t)
        } else {
            //
            // log('Error: 非预期的字符') // c.charCodeAt(0)
        }
        // i 指向下一个字符
        i = i + 1
    }
    
    return tokens
}

module.exports = tokens

if(require.main === module) {
    
    const code1 = '[+ 1 21]'
    const ts1 = tokens(code1)
    log('tokens test 1', ts1)

    const code2 = '[* 2 3 4]'
    const ts2 = tokens(code2)
    log('tokens test 2', ts2)

    const code3 = '[log "hello"]'
    const ts3 = tokens(code3)
    log('tokens test 3', ts3)

    const code4 = '[+ 1 [- 2 3]]'
    const ts4 = tokens(code4)
    log('tokens test 4', ts4)

    const code5 = '[if [> 2 1] 3 4]'
    const ts5 = tokens(code5)
    log('tokens test 5', ts5)

    const code6 = `
    [if yes
            [log "成功"]
            [log "没成功"]
    ]
    `
    
    const ts6 = tokens(code6)
    log('tokens test 6', ts6)

    const code7 =`
        [if yes
            [log "成功"] ;abcde
            [log "没成功"]
        ]
    `
    const ts7 = tokens(code7)
    log('tokens test 7', ts7)
}
