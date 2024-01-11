import React from 'react';
import {Button, Form, Input} from "antd";
import {Link} from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

function Register(props) {
    const onFinish = async (values) => {
        try {
            console.log('Received values of the form', values);
            const response = await axios.post("/api/user/register", values);
            if (response.data.success) {
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error('Server responded with an error status:', error.response.status);
                console.error('Error response data:', error.response.data);
            } else if (error.request) {
                // The request was made but no response was received
                console.error('No response received from the server');
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error('Error setting up the request:', error.message);
            }
            toast.error('Something went wrong');
            console.log(error);
        }

    }
    return (
        <div className='authentication'>
            <div className='authentication-form card p-3'>
                <h1 className='card-title'>Nice To Meet You </h1>
                <Form layout='vertical' onFinish={onFinish}>
                    <Form.Item label='Name' name='name'>
                        <Input placeholder='Name' value=''/>
                    </Form.Item>
                    <Form.Item label='Email' name='email'>
                        <Input placeholder='Email'/>
                    </Form.Item>
                    <Form.Item label='Password' name='password'>
                        <Input placeholder='Password' type='password'/>
                    </Form.Item>
                    <Button className='primary-button my-2' htmlType='submit'>REGISTER</Button>
                    <Link to='/login' className='anchor'>CLICK HERE TO LOGIN</Link>
                </Form>
            </div>
        </div>
    );
}

export default Register;
