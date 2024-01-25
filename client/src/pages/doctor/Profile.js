import React from 'react';
import Layout from "../../components/Layout";
import DoctorForm from "../../components/DoctorForm";
import {hideLoading, showLoading} from "../../redux/alertsSlice";
import axios from "axios";
import toast from "react-hot-toast";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";

function Profile(props) {
    const {user} = useSelector(state => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const onFinish = async (values) => {
        console.log('Success:', values);
        try {
            dispatch(showLoading());
            console.log('Received values of the form', values);
            const response = await axios.post("/api/user/apply-doctor",
                {
                    ...values,
                    userId: user._id
                }, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
            dispatch(hideLoading());
            if (response.data.success) {
                toast.success(response.data.message);
                navigate("/");
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            dispatch(hideLoading());
            toast.error('Something went wrong');
        }
    }
    return (
        <Layout>
            <h1 className='page-title'> Doctor Profile </h1>
            <hr/>
            <DoctorForm onFinish={onFinish}/>
        </Layout>
    );
}

export default Profile;
