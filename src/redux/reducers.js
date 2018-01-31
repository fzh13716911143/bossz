/*
包含n个reducer函数（根据老的state和指定的action返回一个新的state）模块
 */

import {combineReducers} from 'redux'
import {AUTH_SUCCESS,ERROR_MSG,RECEIVE_USER,RESET_USER} from './action-types'

import {getRedirectPath} from '../utils'

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

export default combineReducers({
    user
})