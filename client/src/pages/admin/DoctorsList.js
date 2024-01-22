import React, {useEffect, useState} from 'react';
import Layout from "../../components/Layout";
import {useDispatch} from "react-redux";
import {hideLoading, showLoading} from "../../redux/alertsSlice";
import axios from "axios";
import {Table} from "antd";

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
                    {record.status === "pending" && <h1 className="anchor">Approve</h1>}
                    {record.status === "approved" && <h1 className="anchor">Block</h1>}
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
