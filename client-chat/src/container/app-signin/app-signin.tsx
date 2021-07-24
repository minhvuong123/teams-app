
import { Form, Input, Button,  } from 'antd';
import { NavLink } from 'react-router-dom';
import { API_LINK } from 'shared/const';
import axios from 'axios';

import './app-signin.scss';

function AppSignIn({ history }: any) {

  async function onFinish(values: any){
    const registerUrl = `${API_LINK}/users/sign-in`;
    const registerResult = await axios.post(registerUrl, { user: values});

    const { data } = registerResult || {};
    const { token } = data || {};

    if (token) {
      localStorage.setItem('token', token);
      window.sessionStorage.setItem('token', token);
      history.push('/');
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

export default AppSignIn;