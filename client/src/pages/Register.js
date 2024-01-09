import React from 'react';
import {Button, Form} from "antd";

function Register(props) {
    return (
        <div className='authentication'>
            <div className='authentication-form card p-3'>
                <h1 className='card-title'>Nice To Meet You </h1>
                <Form layout='vertical'>
                    <Form.Item label='Name' name='name'>
                        <input placeholder='Name'/>
                    </Form.Item>
                <Form.Item label='Email' name='email'>
                        <input placeholder='Email'/>
                    </Form.Item>
                <Form.Item label='Password' name='password'>
                        <input placeholder='password'/>
                    </Form.Item>
                    <Button className='primary-button mt-3'>REGISTER</Button>
                </Form>
            </div>
        </div>
    );
}

export default Register;