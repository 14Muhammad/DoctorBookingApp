const express = require("express");
const router = express.Router();
const User = require('../models/userModel');
const Doctor = require('../models/doctorModel');
const authMiddleware = require("../middlewares/authMiddleware");

router.get('/get-all-doctors',
    authMiddleware,
    async (req, res) => {
        try {
            const doctors = await Doctor.find({});
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

router.get('/get-all-users',
    authMiddleware,
    async (req, res) => {
        try {
            const users = await User.find({});
            res.status(200).send({
                success: true,
                message: 'Users fetched successfully',
                data: users,
            })
        } catch (e) {
            res.status(500)
                .send({
                    message: 'Error fetching all users',
                    success: false,
                    e
                });
        }
    })

router.post('/change-doctor-account-status',
    authMiddleware,
    async (req, res) => {
        try {
            const {doctorId, status, userId} = req.body;
            const doctor = await Doctor.findByIdAndUpdate(doctorId, {
                status,
            });
            const user = await User.findOne({_id:doctor.userId});
            const unseenNotifications = user.unseenNotifications;
            unseenNotifications.push({
                type: "new-doctor-request-changed",
                message: `Your doctor account has been ${status}`,
                onClickPath: "/notifications"
            });
            user.isDoctor = status === "approved"? true: false;
            await user.save();
            res.status(200).send({
                success: true,
                message: 'Doctor status updated successfully',
                data: doctor,
            });
        } catch (e) {
            res.status(500)
                .send({
                    message: 'Error in updating doctor status',
                    success: false,
                    e
                });
        }
    })

module.exports = router;
