/*
后台启动服务器的入口模块
1. 引入express
2. 生成应用对象(执行express函数)
3. 注册根路由(使用app的use())
4. 启动服务器(使用app监听指定端口)
 */

//1. 引入express
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
//引用应用的路由器
const appRouter =require('./app_router')
const models = require('./models')
const ChatModel = models.getModel('chat')
//2. 生成应用对象(执行express函数)
const app = express()

// 得到服务器对象
const server = require('http').Server(app)
// 得到IO对象
const io = require('socket.io')(server)


io.on('connection', function(socket) {
    console.log('服务器端：soketio connected')
    // 绑定sendMsg监听, 接收客户端发送的消息
    socket.on('sendMessage', function({from,to,content}) {
        console.log('服务器接收到浏览器的消息', {from,to,content})
        // 将消息保存到数据库
        const create_time = Date.now() //当前时间值
        const chat_id = [from, to].sort().join('_')
        const chatModel=new ChatModel({from,to,content,create_time,chat_id})
        chatModel.save(function (err,chatMsg) {
            //保存完成后，分发消息
            io.emit('receiveMessage',chatMsg)
        })

    })
})

//3. 注册根路由(使用app的use())
// app.use('/',function (req,res) {
//     res.send('hello kugou!')
// })

app.use(cookieParser()) // 解析cookie数据
app.use(bodyParser.json()) // 解析请求体(ajax请求: json数据格式)

app.use(bodyParser.urlencoded({ extended: false })) // 解析请求体(表单数据)

//注册路由器
app.use('/api',appRouter)
// 4. 启动服务器(使用app监听指定端口)
server.listen(4000, () => {
    console.log('服务器启动成功 port: 4000')
})