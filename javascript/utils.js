
const log = console.log

const isLetter = (char) => {
    const alpha = 'abcdefghijklmnopqrstuvwxyz'
    
    return alpha.indexOf(char) >= 0
}

const isNumber = (n) => {
    const numbers = '0123456789'
    return numbers.indexOf(n) >= 0
}

const ensure = (condition, message) => {
    if(condition) {
        log(message, 'succeed')
    } else {
        log(message, 'failed')
    }
}

const found = (sub, str) => {
    return str.indexOf(sub) >= 0
}

module.exports = {
    log,
    ensure,
    found,
    isLetter,
    isNumber,
}