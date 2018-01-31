/*
操作数据库数据的模型模块
 */

//引入mongoose
const mongoose = require('mongoose')
//连接指定的数据库
mongoose.connect('mongodb://localhost:27017/bossz')
//获取连接
const conn = mongoose.connection
// 绑定连接完成的监听, 提示连接成功
conn.on('connected', function () {
    console.log('连接数据库成功!')
})

// 定义schema(针对users集合)
const userSchema = mongoose.Schema({
    // 用户名
    'name': {type: String, 'require': true},
    // 密码
    'pwd': {type: String, 'require': true},
    // 类型
    'type': {'type': String, 'require': true},
    // 头像
    'avatar': {'type': String},
    // 个人简介或者职位简介
    'desc': {'type': String},
    // 职位名
    'title': {'type': String},
    // 如果你是boss 还有两个字段
    // 公司名称
    'company': {'type': String},
    // 工资
    'money': {'type': String}
    })
UserModel = mongoose.model('user',userSchema)

//向外暴露
module.exports = {
    getModel(name){
       return mongoose.model(name)
    }
}