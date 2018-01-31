/*
用户登录用的路由组件
 */

import React, {Component} from 'react'
import {WingBlank,List,WhiteSpace,InputItem,Button} from 'antd-mobile'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'

import Logo from '../../components/logo/logo'
import {login} from '../../redux/actions'

class Login extends Component {

    state = {
        name:'',//用户名
        pwd:'',//密码
    }

    handleChange = (name,val) => {
        //更新状态
        this.setState({
            [name]:val  // [name] 代表属性名是一个变量
        })
    }

    //注册
    login = () =>{
        this.props.login(this.state)
    }
    //跳转到登录路由
    toRegister = ()=>{
        this.props.history.replace('/register')
    }

    render (){
        const {redirectTo, msg} = this.props


        if (redirectTo) {
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

                        <Button type='primary' onClick={this.login}>登录</Button>
                        <WhiteSpace/>
                        <Button onClick ={this.toRegister} >还没有账号</Button>
                    </List>
                </WingBlank>
            </div>
        )
    }
}

export default connect(
    state => state.user,
    {login}
)(Login)