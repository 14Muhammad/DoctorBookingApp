const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const Doctor = require('../models/doctorModel');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");
const Appointment = require("../models/appointmentModel");
const moment = require("moment");
router.post('/register', async (req, res) => {
    try {
        const userExists = await User.findOne({email: req.body.email});
        if (userExists) {
            return res.status(400).send({message: 'User already exists', success: false});
        }
        const password = req.body.password;
        const salt = await (bcrypt.genSalt(10));
        const encryptedPassword = await (bcrypt.hash(password, salt));
        req.body.password = encryptedPassword;
        const newUser = new User(req.body);
        await newUser.save();
        res.status(200).send({message: 'User created successfully', success: true});
    } catch (e) {
        res.status(500).send({message: 'Error creating user', success: false, e});
    }
})
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({email: req.body.email});
        if (!user) {
            return res.status(200)
                .send({message: "User does not exist", success: false});
        }
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            return res.status(200)
                .send({message: "Password is incorrect", success: false});
        } else {
            const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "1d"});
            res.status(200)
                .send({message: "Login successful", success: true, data: token});
        }
    } catch (e) {
        console.log(e);
        res.status(500)
            .send({message: "Error logging in", success: false});
    }
})

router.post('/get-user-info-by-id', authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({_id: req.body.userId});
        user.password = undefined;
        if (!user) {
            return res.status(200)
                .send({message: "User does not exist", success: false});
        } else {
            res.status(200).send({
                success: true,
                data: user
            })
        }
    } catch (e) {
        res.status(500).send({
            message: "Error getting user info",
            success: false, e
        });
    }
})
router.post('/apply-doctor', authMiddleware, async (req, res) => {
    try {
        const newDoctor = new Doctor({...req.body, status: "pending"});
        await newDoctor.save();
        const adminUser = await User.findOne({isAdmin: true});
        const unseenNotifications = adminUser.unseenNotifications;
        unseenNotifications.push({
            type: "new-doctor-request",
            message: `${newDoctor.firstName} ${newDoctor.lastName} has applied for a doctor account`,
            data: {
                doctorId: newDoctor._id,
                name: `${newDoctor.firstName} ${newDoctor.lastName}`
            },
            onClickPath: "/admin/doctors-list"
        })
        await User.findByIdAndUpdate(adminUser, {unseenNotifications});
        res.status(200).send({
                success: true,
                message: 'Doctor account applied successfully'
            }
        )
    } catch (e) {
        res.status(500).send({message: 'Error applying doctor account', success: false, e});
    }
})

router.post('/mark-all-notifications-as-seen', authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({_id: req.body.userId});
        const unseenNotifications = user.unseenNotifications;
        const seenNotifications = user.seenNotifications;
        seenNotifications.push(...unseenNotifications);
        user.unseenNotifications = [];
        user.seenNotifications = seenNotifications;
        const updatedUser = await user.save();
        updatedUser.password = undefined;
        res.status(200).send({
            success: true,
            message: 'All notifications marked as seen',
            data: updatedUser,
        })
    } catch (e) {
        res.status(500).send({message: 'Error marking all notifications as seen', success: false, e});
    }
})
router.post('/delete-all-notifications', authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({_id: req.body.userId});
        user.seenNotifications = [];
        user.unseenNotifications = [];
        const updatedUser = await user.save();
        updatedUser.password = undefined;
        res.status(200).send({
            success: true,
            message: 'All notifications are deleted',
            data: updatedUser,
        })
    } catch (e) {
        res.status(500).send({message: 'Error deleting all notifications', success: false, e});
    }
})

router.get('/get-all-approved-doctors',
    authMiddleware,
    async (req, res) => {
        try {
            const doctors = await Doctor.find({status: "approved"});
            res.status(200).send({
                success: true,
                message: 'Doctors fetched successfully',
                data: doctors,
            })
        } catch (e) {
            res.status(500)
                .send({
                    message: 'Error fetching all doctors',
                    success: false,
                    e
                });
        }
    })
router.post('/book-appointment',
    authMiddleware,
    async (req, res) => {
        try {
            req.body.status = "pending";
            req.body.date = moment(req.body.date,'DD-MM-YYYY').toISOString();
            req.body.time = moment(req.body.time,'HH:mm').toISOString();
            const newAppointment = new Appointment(req.body);
            await newAppointment.save();
            //pushing notification to Doctor based on his user ID
            const user = await User.findOne({_id: req.body.doctorInfo.userId});
            user.unseenNotifications.push({
                type: "new-appointment-request",
                message: `A new appointment request has been made by ${req.body.userInfo.name}`,
                onClickPath: '/doctor/appointment'
            });
            await user.save();
            res.status(200).send({
                message: "Appointment booked successfully",
                success: true
            })
        } catch (e) {
            res.status(500).send({
                message: "Error booking appointment",
                success: false, e
            });
        }
    })

router.post('/check-booking-availability',
    authMiddleware,
    async (req, res) => {
        try {
            const date = moment(req.body.date, 'DD-MM-YYYY')
                .toISOString();
            const fromTime = moment(req.body.time, 'HH:mm')
                .subtract(60, 'minutes')
                .toISOString();
            const toTime = moment(req.body.time, 'HH:mm')
                .add(60, 'minutes')
                .toISOString();
            const doctorId = req.body.doctorId;
            const appointments = await Appointment.find({
                doctorId,
                date,
                time: {$gte: fromTime, $lte: toTime},
                // status: "approved"
            })
            if (appointments.length > 0) {
                res.status(200).send({
                    message: "Appointments not available",
                    success: false
                })
            } else {
                res.status(200).send({
                    message: "Appointments available",
                    success: true
                })
            }

        } catch (e) {
            res.status(500).send({
                message: "Error booking appointment",
                success: false, e
            });
        }
    })

router.get('/get-appointments-by-user-id',
    authMiddleware,
    async (req, res) => {
        try {
            const appointments = await Appointment.find({userId: req.body.userId});
            res.status(200).send({
                success: true,
                message: 'Appointments fetched successfully',
                data: appointments,
            })
        } catch (e) {
            res.status(500)
                .send({
                    message: 'Error fetching appointment',
                    success: false,
                    e
                });
        }
    })

module.exports = router;
