const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();
const Doctor = require("../models/doctorModel")
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
module.exports = router;
