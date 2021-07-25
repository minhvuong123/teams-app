
import { Form, Input, Button,  } from 'antd';
import { NavLink } from 'react-router-dom';
import { API_LINK } from 'shared/const';
import axios from 'axios';
import { connect } from 'react-redux';

import jwt from 'jsonwebtoken';

import './app-signin.scss';
import { setUser } from 'shared/redux/actions';

function AppSignIn({ history, setUser }: any) {

  async function onFinish(values: any){
    const registerUrl = `${API_LINK}/users/sign-in`;
    const registerResult = await axios.post(registerUrl, { user: values});

    const { data } = registerResult || {};
    const { token } = data || {};

    if (token) {
      window.sessionStorage.setItem('token', token);
      jwt.verify(token as string, 'kiwi', async function (err, decoded: any) {
        if (!err) {
          setUser(decoded);
          history.push('/');
        }
      });
    }
  };

  const onFinishFailed = (errorInfo: any) => {

  };

  return (
    <div className="app-signin">
      <div className="login-box">
        <h3 className="login-box-header">Chat App</h3>
        <Form
          name="basic"
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            name="user_email"
            label="Email"
            rules={[{ required: true, message: 'Enter your email!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="user_password"
            label="Password"
            rules={[{ required: true, message: 'Enter your password!' }]}
          >
            <Input.Password />
          </Form.Item>

          <div>No account? <NavLink to="/register">Create one!</NavLink></div>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }} className="form-btn">
            <Button type="primary" htmlType="submit"> Submit </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    setUser: (user: any) => dispatch(setUser(user))
  }
}

export default connect(null, mapDispatchToProps)(AppSignIn);