import React, {useEffect, useState} from 'react';
import Layout from "../../components/Layout";
import {useDispatch} from "react-redux";
import {hideLoading, showLoading} from "../../redux/alertsSlice";
import axios from "axios";
import {Table} from "antd";
import toast from "react-hot-toast";

function DoctorsList(props) {
    const [doctors, setDoctors] = useState([])
    const dispatch = useDispatch();
    const getDoctorsData = async () => {
        try {
            dispatch(showLoading());
            const response = await axios.get(
                '/api/admin/get-all-doctors',
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                })
            dispatch(hideLoading());
            if (response.data.success) {
                setDoctors(response.data.data)
            }
        } catch (e) {
            dispatch(hideLoading());
        }
    }
    const changeDoctorsStatus = async (record, status) => {
        try {
            dispatch(showLoading());
            const response = await axios.post(
                '/api/admin/change-doctor-account-status',
                {
                    doctorId: record._id,
                    userId: record.userId,
                    status: status
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                })
            dispatch(hideLoading());
            if (response.data.success) {
                toast.success(response.data.message);
                getDoctorsData();
            }
        } catch (e) {
            toast.error('Something went wrong');
            dispatch(hideLoading());
        }
    }
    useEffect(() => {
        getDoctorsData()
    }, [])

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            render: (text, record) => (
                <span className='normal-text'>
                    {record.firstName} {record.lastName}
            </span>
            )
        },
        {
            title: 'Phone',
            dataIndex: 'phoneNumber'
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt'
        },
        {
            title: 'Status',
            dataIndex: 'status'
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: (text, record) => (
                <div className='d-flex'>
                    {record.status === "pending" &&
                        <h1 className="anchor"
                            onClick={() => changeDoctorsStatus(record, 'approved')}>
                            Approve
                        </h1>
                    }
                    {record.status === "approved" &&
                        <h1
                            className="anchor"
                            onClick={() => changeDoctorsStatus(record, 'blocked')}>
                            Block
                        </h1>
                    }
                </div>
            )
        },

    ]
    return (
        <Layout>
            <h1 className="page-title"> Doctors List</h1>
            <Table columns={columns} dataSource={doctors}/>
        </Layout>
    );
}

export default DoctorsList;
