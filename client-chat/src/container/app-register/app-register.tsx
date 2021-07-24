import { Form, Input, Button,  } from 'antd';
import { NavLink } from 'react-router-dom';
import axios from 'axios';

import './app-register.scss';
import { API_LINK } from 'shared/const';

function AppRegister({ history } : any) {
  const [form] = Form.useForm();

  async function onFinish(values: any){
    const registerUrl = `${API_LINK}/users/register`;
    const registerResult = await axios.post(registerUrl, { user: values});

    const { data } = registerResult || {};
    const { user } = data || {};

    if (user) {
      history.push('/sign-in');
    }
  };

  function onFinishFailed(errorInfo: any){};

  return (
    <div className="app-register">
      <div className="login-box">
        <h3 className="login-box-header">Chat App</h3>
        <Form
          form={form}
          layout="vertical"
          initialValues={{ 
            user_email: '',
            user_phone: '',
            user_password: ''
          }}
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
            name="user_phone"
            label="Phone"
            rules={[{ required: true, message: 'Enter your phone!' }]}
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

          <div> <NavLink to="/sign-in">Back to sign in!</NavLink></div>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }} className="form-btn">
            <Button type="primary" htmlType="submit"> Submit </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default AppRegister;