/*包含所有ajax请求方法的模块*/

import ajax from './ajax'

// 请求登陆
export const reqRegister = (user) => ajax('/api/register', user, 'POST')
// 请求注册
export const reqLogin = (user) => ajax('/api/login', user, 'POST')
//更新用户信息
export const reqUpdateUser = (user) => ajax('/api/update',user,'POST')
// 获取用户信息
export const reqUserInfo = () => ajax('/api/userinfo')
//请求获取用户列表
export const reqUserList = (type) => ajax('/api/list',{type})
//获取当前用户的所有聊天记录
export const reqChatMsgList = () => ajax('/api/getmsgs')
