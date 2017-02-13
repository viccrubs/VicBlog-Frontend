import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import { UserState, actionCreators, UserRole, LoginInfo, Status } from '../store/User';
import { Link } from 'react-router';
import { Dropdown, Menu, Button, Modal, Form, Input, Icon, Alert, Checkbox } from 'antd';
import md5 from 'md5';
import { errorMessage } from '../Utils';

type LoginModalProps = UserState & typeof actionCreators;
interface LoginModalStates {
    username: string,
    password: string,
    remember: boolean,
}

class LoginModal extends React.Component<LoginModalProps, LoginModalStates>{
    constructor(options) {
        super(options);
        this.state = {
            username: "",
            password: "",
            remember: false
        };
    }
    handleUsernameChange(e) {
        this.setState({
            username: e.target.value
        });
        if (this.props.status == Status.FormUsernameInvalid){
            this.props.setUserStatus(Status.Initial);
        }
    }
    handlePasswordChange(e) {
        this.setState({
            password: e.target.value
        });
        if (this.props.status == Status.FormPasswordInvalid){
            this.props.setUserStatus(Status.Initial);
        }

    }
    handleRememberToggle(e){
        this.setState({
            remember: !e.target.value
        });
    }

    handleLogin() {
        if (!this.state.username){
            this.props.setUserStatus(Status.FormUsernameInvalid);
            return;
        }
        if (!this.state.password){
            this.props.setUserStatus(Status.FormPasswordInvalid);
            return;
        }
        let info = {
            username: this.state.username,
            password: md5(this.state.password).toUpperCase(),
            remember: this.state.remember
        };
        this.props.requestLogin(info);
    }

    render() {
        let alertMessage = "";

        switch(this.props.status){
            case Status.CredentialInvalid:
                alertMessage = "Credentials are invalid. Please check.";
                break;
            case Status.Others:
                alertMessage = errorMessage.Others;
                break;
            case Status.Network:
                alertMessage = errorMessage.Network;
                break;
            default:
                alertMessage = "";
        }

        const alert  = alertMessage ? <Alert message={alertMessage} type="error"/> : [];
        
        const usernameInputProps = this.props.status == Status.FormUsernameInvalid ? {validateStatus: "error", help: "Please input username!"} : {};
        const passwordInputProps = this.props.status == Status.FormPasswordInvalid ? {validateStatus: "error", help: "Please input password!"} :{}; 

        return <Modal title="Log In" visible={this.props.loginModalVisible}
            onCancel={this.props.closeLoginModal}
            footer={[
                <Button key="return" size="large" onClick={()=>this.props.closeLoginModal()}>Close</Button>,
                <Button key="register" size="large"><Link to="/register" onClick={()=>this.props.closeLoginModal()}>Register</Link></Button>,
                <Button key="login" size="large" type="primary" loading={this.props.status == Status.LoggingIn} onClick={()=>this.handleLogin()}>Login</Button>
            ]}>
            {alert}
            <Form>
            <Form.Item {...usernameInputProps}>
            <Input addonBefore={<Icon type="user" />} placeholder="Username" value={this.state.username} onChange={(e) => this.handleUsernameChange(e)} />
            </Form.Item>
            <Form.Item {...passwordInputProps}>
            <Input addonBefore={<Icon type="lock" />} 
            type="password" placeholder="Password" 
            value={this.state.password} 
            onChange={(e) => this.handlePasswordChange(e)} 
            onKeyDown={e=>{
                if ((e as any).keyCode == 13 ){
                    this.handleLogin();
                }
            }}/>
            </Form.Item>
            <Checkbox onChange={(e)=>this.handleRememberToggle(e)}>Remember me!</Checkbox>
            </Form>
        </Modal>
    }
}

export default connect(
    (s: ApplicationState) => s.user,
    actionCreators
)(LoginModal);