const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();
const Doctor = require("../models/doctorModel")
const Appointment = require("../models/appointmentModel");
const User = require("../models/userModel");
router.post('/get-doctor-info-by-user-id',
    authMiddleware,
    async (req, res) => {
        try {
            const doctor = await Doctor.findOne({userId: req.body.userId});
            res.status(200).send({
                success: true,
                message: "Doctor info fetched successfully",
                data: doctor
            })

        } catch (e) {
            res.status(500).send({
                message: "Error getting doctor info",
                success: false, e
            });
        }
    })
router.post('/get-doctor-info-by-id',
    authMiddleware,
    async (req, res) => {
        try {
            const doctor = await Doctor.findOne({_id: req.body.doctorId});
            res.status(200).send({
                success: true,
                message: "Doctor info fetched successfully",
                data: doctor
            })

        } catch (e) {
            res.status(500).send({
                message: "Error getting doctor info",
                success: false, e
            });
        }
    })

router.post('/update-doctor-profile',
    authMiddleware,
    async (req, res) => {
        try {
            const doctor = await Doctor.findOneAndUpdate(
                {
                    userId: req.body.userId
                },
                req.body
            )
            res.status(200).send({
                success: true,
                message: "Doctor profile updated successfully",
                data: doctor
            })
        } catch (e) {
            res.status(500).send({
                message: "Error updating doctor info",
                success: false, e
            });
        }
    })
router.get('/get-appointments-by-doctor-id',
    authMiddleware,
    async (req, res) => {
        try {
            const doctor = await Doctor.findOne({userId: req.body.userId})
            const appointments = await Appointment.find({doctorId: doctor._id});
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

router.post('/change-appointment-status',
    authMiddleware,
    async (req, res) => {
        try {
            const {appointmentId, status} = req.body;
            const appointment = await Appointment.findByIdAndUpdate(appointmentId, {
                status,
            });
            const user = await User.findOne({_id: appointment.userId});
            const unseenNotifications = user.unseenNotifications;
            unseenNotifications.push({
                type: "appointment-status-changed",
                message: `Your appointment status has been ${status}`,
                onClickPath: "/appointments"
            });
            await user.save();
            res.status(200).send({
                success: true,
                message: 'Appointment status updated successfully',
            });
        } catch (e) {
            res.status(500)
                .send({
                    message: 'Error in changing appointment status',
                    success: false,
                    e
                });
        }
    })
module.exports = router;
