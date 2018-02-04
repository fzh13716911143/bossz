/*
对话聊天的路由组件
 */

import React, {Component} from 'react'
import {NavBar, List, InputItem,Grid} from 'antd-mobile'
import {connect} from 'react-redux'

import {sendMsg} from '../../redux/actions'


const Item = List.Item

class Chat extends Component {
    state={
        content : '',
        isShow:false
    }
    //处理点击发送消息
    handleSubmit = () => {
        //收集数据
        const from = this.props.user._id

        const to = this.props.match.params.userid
        const content = this.state.content
        //向服务器发送消息
        this.props.sendMsg({from,to,content})
        //清除输入
        this.setState({content:'',isShow:false})
    }

    componentDidMount() {
        // 初始显示列表
        window.scrollTo(0, document.body.scrollHeight)
    }

    //处理点击切换表情显示
    toggleShow = () =>{
        const isShow = !this.state.isShow
        this.setState({isShow})
        if(isShow) {
            // 异步手动派发resize事件,解决表情列表显示的bug
            setTimeout(() => {
                window.dispatchEvent(new Event('resize'))
            }, 0)
        }
    }
    componentWillMount() {
        this.emojis = ['😀', '😂', '😆', '😊', '😍', '🤷', '❤', '😂', '😍', '🔥', '🤔', '😊', '🙄', '😘',
            '😀', '😂', '😆', '😊', '😍', '🤷', '❤', '😂', '😍', '🔥', '🤔', '😊', '🙄', '😘',
            '😀', '😂', '😆', '😊', '😍', '🤷', '❤', '😂', '😍', '🔥', '🤔', '😊', '🙄', '😘']
        this.emojis = this.emojis.map(value => ({text: value}))
        console.log(this.emojis)
    }

    componentDidUpdate () {
        // 更新显示列表
        window.scrollTo(0, document.body.scrollHeight)
    }

    render() {
        // debugger
        const userid = this.props.match.params.userid
        const meId = this.props.user._id
        //取出数据
        const {chatMsgs,users} = this.props.chat
        //得到当前的chat id
        const currChat = [userid,meId].sort().join('_')
        //过滤出需要显示的
        const currMsgs = chatMsgs.filter(msg=>msg.chat_id===currChat)

        if(!users[userid]){
          return null
        }

        //目标的头像对象
        const targetAvatar = users[userid].avatar
        const targetAvatarImg =targetAvatar ? require(`../../assets/imgs/${targetAvatar}.png`):null
        //我的头像对象
        const meAvatar = this.props.user.avatar
        const meAvatarImg = require(`../../assets/imgs/${meAvatar}.png`)
        return (
            <div id='chat-page'>
                <NavBar className='stick-top'>{userid}</NavBar>
                <List style={{marginTop:50,marginBottom:50}}>
                    {
                         currMsgs.map(msg=>{
                             if(msg.from===userid){
                               return(
                                   <Item
                                       key={msg._id}
                                       thumb={targetAvatarImg}
                                   >
                                       {msg.content}
                                   </Item>
                               )
                             }else {
                                 return(
                                     <Item
                                         className='chat-me'
                                         key={msg._id}
                                         extra={<img src={meAvatarImg}/>}
                                     >
                                         {msg.content}
                                     </Item>
                                 )
                             }
                         })
                    }
                </List>

                <div className='am-tab-bar'>
                    <InputItem
                        placeholder="请输入"
                        extra={
                            <div>
                                <span onClick={this.toggleShow}>😎</span>
                                <span onClick={this.handleSubmit}>发送</span>
                            </div>

                        }
                        value={this.state.content}
                        onChange = {val =>{this.setState({content:val})}}
                        onFocus = {()=>{this.setState({isShow:false})}}
                    />
                    {
                        this.state.isShow ? (
                            <Grid
                                data={this.emojis}
                                columnNum={8}
                                carouselMaxRow={4}
                                isCarousel={true}
                                onClick={(item) => {
                                    this.setState({content: this.state.content + item.text})
                                }}
                            />
                        ) : null
                    }
                </div>
            </div>
        )
    }
}
export default connect (
    state => ({user: state.user, chat: state.chat}),
    {sendMsg}
)(Chat)