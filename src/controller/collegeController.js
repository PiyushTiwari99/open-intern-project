const collegeModel = require("../model/collegeModel")
const internModel = require("../model/internModel")


const isValid = function (value) {
    if (typeof value == "undefined" || null) return false
    if (typeof value == "string" && value.trim().length === 0) return false
    return true
}


const createCollege = async function (req, res) {
    try {

        if (Object.keys(req.body).length == 0) {
            return res.status(400).send({ status: false, msg: "No data to create college" })
        }
        const { name, fullName, logoLink } = req.body

        if (!isValid(name)) {
            return res.status(400).send({ status: false, msg: ` Name is required ` })
        }

        if (!isValid(fullName)) {
            return res.status(400).send({ status: false, msg: ` fullName is required ` })
        }

        if (!isValid(logoLink)) {
            return res.status(400).send({ status: false, msg: `Link is required ` })
        }

        if (!(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi.test(logoLink))) {
            return res.status(400).send({ status: false, msg: ` 'Please give a valid link' ` })
        }

        let duplicateName = await collegeModel.findOne({ name: name, isDeleted: false })
        if (duplicateName) {
            return res.status(400).send({ status: false, msg: "College name is already present" })
        }

        let savedData = await collegeModel.create(req.body)
        return res.status(201).send({ status: true, data: savedData })

    } catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
}


const getCollege = async function (req, res) {

    try {
        if (Object.keys(req.query).length == 0) {
            return res.status(400).send({ status: false, msg: "Please select a college" })
        }

        if (Object.keys(req.query) != "collegeName") {
            return res.status(400).send({ status: false, msg: "Please provide a college Name" })
        }

        let filterDetails = req.query;
        filterDetails.isDeleted = false;
        let details = await collegeModel.findOne({ name: filterDetails.collegeName })

        if (!details) {
            return res.status(404).send({ status: false, msg: "No college found" })
        }

        let collegeDetails = {}
        collegeDetails.name = details.name
        collegeDetails.fullName = details.fullName
        collegeDetails.logoLink = details.logoLink
        collegeDetails.interests = "No interns found"

        let college_id = details._id
        let internDetails = await internModel.find({ collegeId: college_id, isDeleted: false }).select({ name: 1, mobile: 1, email: 1 })
        if (internDetails.length == 0) {
            return res.status(200).send({ status: true, data: collegeDetails });
        }
        collegeDetails.interests = internDetails
        return res.status(200).send({ status: true, data: collegeDetails });

    } catch (error) {

        return res.status(500).send({ status: false, msg: error.message })
    }
}


module.exports = { createCollege, getCollege }