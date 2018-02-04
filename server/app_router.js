/*
定义后台处理请求的路由的模块
1. 引入express
2. 得到路由器
3. 注册n个路由
4. 向外暴露路由器
5. 通过 app使用上路由器
 */

//1. 引入express
const express = require('express')
const md5 = require('blueimp-md5')
const models = require('./models')
const UserModel = models.getModel('user')
const ChatModel = models.getModel('chat')
// 2. 得到路由器
const router = express.Router()
const _filter = {'pwd':0,'__v':0}
/*3. 注册n个路由*/
router.post('/register',function (req,res) {
    // 1. 获取请求参数
    const {name,pwd,type} = req.body
    // 2. 处理数据(与数据库交互)
    // 2.1. 根据name查询是否已经存在
    UserModel.findOne({name},function (err,user) {
        // 3.1. 如果已经存在, 返回一个错误的提示
        if(user){
          return res.send({code:1,msg:'用户名已存在!'})//code: 数据的标识 1: 错误 0: 正确
        }
        // 2.2. 如果不存在, 保存到数据库
        const userModel = new UserModel({name,pwd:md5(pwd),type})
        userModel.save(function (err,user) {
            res.cookie('userid', user._id)
            res.send({code:0,data:user})
        })
    })
})
//用户登录的路由
router.post('/login',function (req,res) {
    // 1.获取请求参数
        const {name,pwd} = req.body
    // 2. 处理数据(与数据库交互)
    // 2.1. 根据name和pwd 查询对应的user
    UserModel.findOne({name,pwd:md5(pwd)},_filter,function (err,user) {
        // 3.1. 如果已经存在, 返回一个错误的提示
        if(user){
          res.cookie('userid',user._id)
          res.json({code:0,data:user})
        }else {
            // 3.2. 不存在, 返回错误信息
            res.json({code:1,msg:'用户名或密码错误'})
        }
    })

})

//更新用户信息的路由
router.post('/update',function (req,res) {
    //检查用户是否登录，如果没有，返回错误，提示信息
    const userid = req.cookies.userid  //取出请求中cookie包含的userid
    if(!userid){
      return res.send({code:1,msg:'请先登录'})
    }
    //更新对应的user
    UserModel.findByIdAndUpdate({_id:userid},req.body,function (err,user) {
        if(!user){
            //清除浏览器保存的userid cookie
            res.clearCookie('userid')
            res.send({code:1,msg:'请先登录'})
        }else {
            const {_id,name,type} = user
            //...不能在node中使用,需要使用assign手动合并对象
            user = Object.assign({},req.body,{_id,name,type})
            res.send({code:0,data:user})
        }
    })
})

// 根据cookie中的userid, 查询对应的user
router.get('/userinfo', function (req, res) {
    // 取出userid
    const userid = req.cookies.userid
    // 查询
    UserModel.findOne({_id: userid}, _filter, function (err, user) {
        // 如果没有, 返回错误提示
        if(!user) {
            // 清除浏览器保存的userid的cookie
            res.clearCookie('userid')

            res.send({code: 1, msg: '请先登陆'})
        } else {
            // 如果有, 返回user
            res.send({code: 0, data: user})
        }
    })
})

//查看用户列表
router.get('/list',function (req,res) {
    const {type} = req.query
    UserModel.find({type},function (err,users) {
        console.log(users)
        return res.json({code:0,data:users})
    })
})

/*
获取所有交流信息列表
 */
router.get('/getmsgs', function(req, res) {
    //当前登录用户的id
    const userid = req.cookies.userid

    UserModel.find({}, function (err, userdocs) {
        // const users = {}
        // userdocs.forEach(user => {
        //     users[user._id] = {name: user.name, avatar: user.avatar}
        // })

        //根据user数组生成一个  多个user对象
        const users = userdocs.reduce((users,user) =>{
            users[user._id]=user
            return users
        },{})

        ChatModel.find(
            {'$or':[{from:userid}, {to: userid}]},
            function(err, chatMsgs) {
                return res.json({code: 0, data:{chatMsgs, users}})
            }
        )
    })
})


// 4. 向外暴露路由器
module.exports = router