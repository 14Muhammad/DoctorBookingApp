import React from 'react';
import {Button, Form} from "antd";
import {Link} from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

function Register(props) {
    const onFinish = async (values) => {
        try {
            console.log('Received values of the form', values);
            const response = await axios('/api/user/register', values);
            if (response.data.success) {
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message);
            }
        } catch (e) {
            toast.error('Something went wrong');
            console.log(e);
        }
    }
    return (
        <div className='authentication'>
            <div className='authentication-form card p-3'>
                <h1 className='card-title'>Nice To Meet You </h1>
                <Form layout='vertical' onFinish={onFinish}>
                    <Form.Item label='Name' name='name' initialValue={''}>
                        <input placeholder='Name' value=''/>
                    </Form.Item>
                    <Form.Item label='Email' name='email' initialValue={''}>
                        <input placeholder='Email'/>
                    </Form.Item>
                    <Form.Item label='Password' name='password' initialValue={''}>
                        <input placeholder='Password' type='password'/>
                    </Form.Item>
                    <Button className='primary-button my-2' htmlType='submit'>REGISTER</Button>
                    <Link to='/login' className='anchor'>CLICK HERE TO LOGIN</Link>
                </Form>
            </div>
        </div>
    );
}

export default Register;
