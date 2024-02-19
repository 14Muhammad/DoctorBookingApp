import React, {useEffect, useState} from 'react';
import Layout from "../components/Layout";
import {Navigate, useNavigate, useParams} from "react-router-dom";
import {hideLoading, showLoading} from "../redux/alertsSlice";
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import moment from "moment";
import {Button, Col, DatePicker, Row, TimePicker} from "antd";
import toast from "react-hot-toast";

function BookAppointment(props) {
    const [isAvailable, setIsAvailable] = useState(false);
    const navigate = useNavigate();
    const [date, setDate] = useState();
    const [time, setTime] = useState();
    const {user} = useSelector((state) => state.user);
    const [doctor, setDoctor] = useState(null);
    const params = useParams()
    const dispatch = useDispatch();
    const getDoctorData = async () => {
        try {
            dispatch(showLoading());
            const response = await axios.post(
                '/api/doctor/get-doctor-info-by-id',
                {
                    doctorId: params.doctorId,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            dispatch(hideLoading());
            if (response.data.success) {
                setDoctor(response.data.data);
            }
        } catch (e) {
            dispatch(hideLoading());
        }
    }
    const bookNow = async () => {
        setIsAvailable(false);
        try {
            dispatch(showLoading());
            const response = await axios.post(
                '/api/user/book-appointment',
                {
                    doctorId: params.doctorId,
                    userId: user._id,
                    doctorInfo: doctor,
                    userInfo: user,
                    date: date,
                    time: time,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            dispatch(hideLoading());
            if (response.data.success) {
                toast.success(response.data.message);
                navigate('/appointments')
            }
        } catch (e) {
            toast.error("Error booking appointment")
            dispatch(hideLoading());
        }
    }
    const checkAvailablity = async () => {
        try {
            dispatch(showLoading());
            const response = await axios.post(
                '/api/user/check-booking-availability',
                {
                    doctorId: params.doctorId,
                    date: date,
                    time: time,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            dispatch(hideLoading());
            if (response.data.success) {
                toast.success(response.data.message);
                setIsAvailable(true);
            } else {
                toast.error(response.data.message);
            }
        } catch (e) {
            toast.error("Error booking appointment")
            dispatch(hideLoading());
        }
    }
    useEffect(
        () => {
            getDoctorData();
        },
        [])

    return (
        <Layout>
            {doctor && (
                <div>
                    <h1 className="page-title">
                        {doctor.firstName} {doctor.lastName}
                    </h1>
                    <hr/>
                    <Row gutter={20} className='mt-3' align='middle'>
                        <Col span={12} sm={24} xs={24} lg={8}>
                            <img width='100%' height='280'
                                 src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR14mZr1uOANt8Zskj4DZ6qCOK8XyPH88dFuw&usqp=CAU'/>
                        </Col>
                        <Col span={12} sm={24} xs={24} lg={8}>
                            <h1 className="normal-text">
                                <b>Timings : </b> {doctor.timings[0]} - {doctor.timings[1]}
                            </h1>
                            <p>
                                <b>Phone Number : </b>{doctor.phoneNumber}
                            </p>
                            <p>
                                <b>Address : </b>{doctor.address}
                            </p>
                            <p>
                                <b>Fee per visit : </b>{doctor.feePerConsultation}
                            </p>
                            <p>
                                <b>Website : </b>{doctor.website}
                            </p>
                            <div className="d-flex flex-column pt-2 mt-2">
                                <DatePicker format='DD-MM-YYYY'
                                            onChange={
                                                (value) => {
                                                    setIsAvailable(false);
                                                    setDate(moment(new Date(value)).format("DD-MM-YYYY"));
                                                }
                                            }/>
                                <TimePicker format='HH:mm' className='mt-3'
                                            onChange={
                                                (value) => {
                                                    setIsAvailable(false);
                                                    setTime(moment(new Date(value)).format("HH:mm"));
                                                }
                                            }/>
                                {!isAvailable && <Button onClick={checkAvailablity}
                                                         className='primary-button mt-3 full-width-button'>
                                    Check Availability</Button>}
                                {isAvailable && <Button onClick={bookNow}
                                                        className='primary-button mt-3 full-width-button'>
                                    Book Now</Button>}
                            </div>
                        </Col>
                    </Row>

                </div>
            )}

        </Layout>
    );
}

export default BookAppointment;
