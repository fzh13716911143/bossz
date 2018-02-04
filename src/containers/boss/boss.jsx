/*
* boss的主路由组件
* */

import React, {Component} from 'react'
import {connect} from 'react-redux'

import UserList from '../../components/user-list/user-list'
import {getUserList} from "../../redux/actions";

class Boss extends Component {

    componentDidMount(){
        this.props.getUserList('genius')
    }


    render (){
        console.log(this.props.userList)
        return <UserList userList={this.props.userList}/>
    }
}

export default connect (
    state => ({userList:state.userList}),
    {getUserList}
)(Boss)