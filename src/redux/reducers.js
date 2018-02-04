/*
包含n个reducer函数（根据老的state和指定的action返回一个新的state）模块
 */

import {combineReducers} from 'redux'
import {getRedirectPath} from '../utils'
import {
    AUTH_SUCCESS,
    ERROR_MSG,
    RECEIVE_USER,
    RESET_USER,
    USER_LIST,
    RESEIVE_CHAT_MSG,
    CHAT_MSG_LIST
} from './action-types'


const initUser = {
    name: '',   //用户名
    type:'',    //类型
    msg:'',     //错误信息
    redirectTo:''   //需要自动跳转的路由path
}

function user(state = initUser,action) {
    switch (action.type){
        case AUTH_SUCCESS:
            const {type, avatar} = action.data
            return {...action.data,redirectTo:  getRedirectPath(type, avatar)}
        case ERROR_MSG:
            return{...state,msg:action.data}
        case RECEIVE_USER:
            return action.data
        case RESET_USER:
            return {...initUser,msg:action.data}
        default :
            return state
    }
}


const initUserList = []
function userList(state = initUserList,action) {
    switch (action.type) {
        case USER_LIST:
            return action.data
        default:
            return state
    }
}

const initChat = {
    chatMsgs:[],
    users:{}
}
function chat(state=initChat,action) {
    switch (action.type){
        case RESEIVE_CHAT_MSG:
            /*return {
                chatMsgs:[...state.chatMsgs,action.data]
                users:state.users
            }*/
            return {...state,chatMsgs:[...state.chatMsgs,action.data]}
        case CHAT_MSG_LIST:
            return action.data
        default:
            return state
    }
}

export default combineReducers({
    user,userList,chat
})