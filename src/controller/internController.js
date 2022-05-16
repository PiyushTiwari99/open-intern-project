const internModel = require("../model/internModel")
const collegeModel = require("../model/collegeModel")


const isValid = function (value) {
    if (typeof value == "undefined" || null) return false
    if (typeof value == "string" && value.trim().length === 0) return false
    return true
}


const createIntern = async function (req, res) {
    try {

        if (Object.keys(req.body).length == 0) {
            return res.status(400).send({ status: false, msg: "No data to create intern" })
        }

        const { name, mobile, email, collegeName } = req.body

        if (!isValid(name)) {
            return res.status(400).send({ status: false, msg: ` Name is required ` })
        }

        if (!isValid(mobile)) {
            return res.status(400).send({ status: false, msg: ` mobile is required ` })
        }

        if (!isValid(email)) {
            return res.status(400).send({ status: false, msg: ` email is required ` })
        }

        if (!(/^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/.test(mobile))) {
            return res.status(400).send({ status: false, msg: ` 'Please give a valid mobile number without space' ` })
        }

        if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
            return res.status(400).send({ status: false, msg: ` 'Please give a valid email' ` })
        }

        let duplicateMobile = await internModel.findOne({ mobile: mobile })
        if (duplicateMobile) {
            return res.status(400).send({ status: false, msg: "Mobile number is already present" })
        }

        let duplicateEmail = await internModel.findOne({ email: email })
        if (duplicateEmail) {
            return res.status(400).send({ status: false, msg: "Email is already present" })
        }

        if (!isValid(collegeName)) {
            return res.status(400).send({ status: false, msg: ` collegeName is required ` })
        }

        let validCollege = await collegeModel.findOne({ name: collegeName })
        if (!validCollege) {
            return res.status(404).send({ status: false, msg: "College data not found" });
        }

        if (req.body.isDeleted == true) {
            return res.status(400).send({ status: false, msg: "Intern cannot be deleted while creating" })
        }

        let result = {}
        result.name = name
        result.email = email
        result.mobile = mobile
        result.collegeName = collegeName
        result.collegeId = validCollege._id
        let savedData = await internModel.create(result)
        return res.status(201).send({ status: true, data: savedData })

    } catch (error) {

        return res.status(500).send({ status: false, msg: error.message })
    }
}


module.exports.createIntern = createIntern