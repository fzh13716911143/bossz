/*
用户注册用的路由组件
 */

import React, {Component} from 'react'
import {WingBlank,List,WhiteSpace,InputItem,Radio,Button} from 'antd-mobile'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'

import Logo from '../../components/logo/logo'
import {register} from '../../redux/actions'

const RadioItem = Radio.RadioItem
class Register extends Component {

    state = {
        name:'',//用户名
        pwd:'',//密码
        pwd2:'',//确认密码
        type:'boss' //genius (人才)
    }

    handleChange = (name,val) => {
        //更新状态
        this.setState({
            [name]:val  // [name] 代表属性名是一个变量
        })
    }

    //注册
    register = () =>{
        this.props.register(this.state)
    }
    //跳转到登录路由
    toLogin = ()=>{
        this.props.history.replace('/login')
    }

    render (){
        const {msg, redirectTo} = this.props
        const {type} = this.state

        // 如果redirectTo有值, 需要跳转到指定路由
        if(redirectTo) {
            return <Redirect to={redirectTo}/>
        }

        return (
            <div>
                <Logo/>
                <WingBlank>
                    {msg ? <p className='error-msg'>{msg}</p> : null }
                    <List>
                        <InputItem onChange={val=>this.handleChange('name',val)}>用户名：</InputItem>
                        <WhiteSpace/>
                        <InputItem type='password' onChange={val=>this.handleChange('pwd',val)}>密  码：</InputItem>
                        <WhiteSpace/>
                        <InputItem type='password' onChange={val=>this.handleChange('pwd2',val)}>确认密码：</InputItem>
                        <WhiteSpace/>

                        <RadioItem checked={type==='genius'} onChange={()=>this.handleChange('type','genius')}>牛人</RadioItem>
                        <WhiteSpace/>
                        <RadioItem checked={type==='boss'} onChange={()=>this.handleChange('type','boss')}>BOSS</RadioItem>
                        <WhiteSpace/>
                        <Button type='primary' onClick={this.register}>注册</Button>
                        <WhiteSpace/>
                        <Button onClick ={this.toLogin} >已有账号，直接登录</Button>
                    </List>
                </WingBlank>
            </div>
        )
    }
}
export default connect(
    state => state.user,
    {register}
)(Register)
