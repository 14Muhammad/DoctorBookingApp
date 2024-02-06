import React, {useEffect, useState} from 'react';
import {useDispatch} from "react-redux";
import {hideLoading, showLoading} from "../redux/alertsSlice";
import axios from "axios";
import Layout from "../components/Layout";
import {Table} from "antd";
import moment from "moment";

function Appointments(props) {
    const [appointments, setAppointments] = useState([]);
    const dispatch = useDispatch();
    const getAppointmentsData = async () => {
        try {
            dispatch(showLoading());
            const response = await axios.get(
                '/api/user/get-appointments-by-user-id',
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
    useEffect(() => {
        getAppointmentsData()
    }, [])
    const columns = [
        {
            title: "id",
            dataIndex: "_id"
        },
        {
            title: 'Doctor',
            dataIndex: 'name',
            render: (text, record) => (
                <span className='normal-text'>
                    {record.doctorInfo.firstName} {record.doctorInfo.lastName}
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
        }

    ]
    return (
        <Layout>
            <h1 className="page-title"> Appointments</h1>
            <Table columns={columns} dataSource={appointments}/>
        </Layout>
    );
}

export default Appointments;
