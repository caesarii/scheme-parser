
// 枚举类型
class Type {
    constructor() {
        // auto 是单字符符号的类型
        this.auto = 'auto' // 0
        // this.colon = 'colon' // 1
        // this.comma = 'comma' // 2
        // this.braceLeft = 'braceLeft' // 3
        // this.braceRight = 'barceRight' //4
        this.bracketLeft = 'bracketLeft' //5
        this.bracketRight = 'bracketRight' //6
        this.number = 'number' //7
        this.string = 'string' //8
        // this.token = 'token' //9
        
        this.operator = 'operator'
        this.bool = 'bool'
        this.comment = 'comment'
        this.condition = 'condition'
        this.id = 'identity'
    }
}

module.exports = new Type()
