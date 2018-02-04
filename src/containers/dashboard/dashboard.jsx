import React, {Component} from 'react'
import {Route,Switch} from 'react-router-dom'
import cookies from 'browser-cookies'
import {connect} from 'react-redux'
import {NavBar} from 'antd-mobile'


import BossInfo from '../boss-info/boss-info'
import Boss from '../boss/boss'
import GeniusInfo from '../genius-info/genius-info'
import Genius from '../genius/genius'
import Msg from '../msg/msg'
import User from '../user/user'
import NotFound from '../../components/not-found/not-found'
import NavFooter from '../../components/nav-footer/nav-footer'
import {getUserInfo,receiveMsg,getChatMsgList} from '../../redux/actions'
import {getRedirectPath} from '../../utils/index'
import Chat from '../chat/chat';

class Dashboard extends Component {

    navList = [
        {
            path: '/boss', // 路由路径
            component: Boss,
            title: '牛人列表',
            icon: 'boss',
            text: '牛人',
            hide:false
        },
        {
            path: '/genius', // 路由路径
            component: Genius,
            title: 'BOSS列表',
            icon: 'job',
            text: 'BOSS',
            hide:false
        },
        {
            path: '/msg', // 路由路径
            component: Msg,
            title: '消息列表',
            icon: 'msg',
            text: '消息',
        },
        {
            path: '/me', // 路由路径
            component: User,
            title: '个人中心',
            icon: 'user',
            text: '我',
        }
    ]

    componentDidMount () {
        // 取出cookie中的userid
        const userid = cookies.get('userid')
        const {user} = this.props
        // userid有值, 而user中没有数据, 才去请求获取userinfo
        if(userid && !user._id) {
            this.props.getUserInfo()
        }
        //绑定接收服务发送的信息的监听
        this.props.receiveMsg()
        //获取当前用户所有的相关聊天列表
        this.props.getChatMsgList()
    }
    render () {
        // debugger
        // 检查用户是否登陆, 如果没有, 跳转到login
        const userid = cookies.get('userid')
        const {user, location} = this.props
        if(!userid && !user.type) {
            this.props.history.replace('/login')
            return null
        }
        if(user.type) { // 已经登陆
            if(location.pathname==='/') {

                //计算需要重定向的路由路径
                const path = getRedirectPath(user.type,user.avatar)
                //跳转
                this.props.history.replace(path)

                return null
            }

            if(user.type === 'boss'){
              //隐藏第二个
                this.navList[1].hide=true
            }else {
                this.navList[0].hide=true
            }

        } else {// redux 中user为空，但cookie中有userid
            return null //不做任何显示
        }

        //计算出当前的nav对象
        const currentNav = this.navList.find(nav=>nav.path===location.pathname)

        return (
            <div>
                {currentNav ?  <NavBar>{currentNav.title}</NavBar> : null}

                <Switch>
                    <Route path='/bossInfo' component={BossInfo}/>
                    <Route path='/geniusInfo' component={GeniusInfo}/>
                    <Route path='/chat/:userid' component={Chat}/>

                    {
                        this.navList.map((nav,index)=>(
                            <Route key={index} path ={ nav.path} component={ nav.component}/>
                        ))
                    }
                    <Route component={NotFound}/>
                </Switch>
                {currentNav ? <NavFooter navList={this.navList}/> : null}
            </div>
        )
    }
}

export default connect(
    state=>({user:state.user}),
{getUserInfo,receiveMsg,getChatMsgList}
)(Dashboard)