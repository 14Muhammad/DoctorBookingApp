import React, {useEffect, useState} from 'react';
import {useDispatch} from "react-redux";
import {hideLoading, showLoading} from "../../redux/alertsSlice";
import axios from "axios";
import Layout from "../../components/Layout";
import {Table} from "antd";
import moment from "moment";
import toast from "react-hot-toast";

function DoctorAppointments(props) {
    const [appointments, setAppointments] = useState([]);
    const dispatch = useDispatch();
    const getAppointmentsData = async () => {
        try {
            dispatch(showLoading());
            const response = await axios.get(
                '/api/doctor/get-appointments-by-doctor-id',
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                })
            dispatch(hideLoading());
            if (response.data.success) {
                setAppointments(response.data.data)
            }
        } catch (e) {
            dispatch(hideLoading());
        }
    }
    const changeAppointmentStatus = async (record, status) => {
        try {
            dispatch(showLoading());
            const response = await axios.post(
                '/api/doctor/change-appointment-status',
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
                getAppointmentsData();
            }
        } catch (e) {
            toast.error('Something went wrong');
            dispatch(hideLoading());
        }
    }
    useEffect(() => {
        getAppointmentsData()
    }, [])
    const columns = [
        {
            title: "id",
            dataIndex: "_id"
        },
        {
            title: 'Patient',
            dataIndex: 'name',
            render: (text, record) => (
                <span className='normal-text'>
                    {record.userInfo.name}
            </span>
            )
        },
        {
            title: 'Phone',
            dataIndex: 'phoneNumber',
            render: (text, record) => (
                <span className='normal-text'>
                    {record.doctorInfo.phoneNumber}
            </span>
            )
        },
        {
            title: 'Date & Time',
            dataIndex: 'createdAt',
            render: (text, record) => (
                <span className='normal-text'>
                    {moment(record.date).format("DD-MM-YYYY")} {moment(record.time).format("HH:mm")}

            </span>
            )
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
                    {record.status === "pending" && (
                        <div>
                            <h1 className="anchor"
                                onClick={() => changeAppointmentStatus(record, 'approved')}>
                                Approve
                            </h1>
                            <h1
                                className="anchor"
                                onClick={() => changeAppointmentStatus(record, 'rejected')}>
                                Reject
                            </h1>
                        </div>
                    )
                    }

                </div>
            )
        },

    ]
    return (
        <Layout>
            <h1 className="page-title"> Appointments</h1>
            <Table columns={columns} dataSource={appointments}/>
        </Layout>
    );
}

export default DoctorAppointments;
