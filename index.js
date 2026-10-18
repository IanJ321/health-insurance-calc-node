/*
    ChatGPT was used to setup the BMI and Risk Calculation APIS
    This usage was mainly for math-based unit conversions and collecting data for family history
    The output has been modified to make variable names more unique for easier reference
*/

const express = require("express")
const cors = require("cors")
const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(express.static(__dirname + "/static"))
app.use(cors({ origin: "*" }))

// Implement Wake Server API
app.get("/wakeAPI", (req, res) => {
    res.json({
        message: "Health Insurance Calculator API is active."
    })
})

// Blood Pressure Categories API
app.post("/bpCategoriesAPI", (req, res) => {
    const { category } = req.body
    const categories = {
        normal: {
            name: "Normal",
            range: "Systolic < 120 and diastolic < 80 mm Hg"
        },
        elevated: {
            name: "Elevated",
            range: "Systolic 120-129 and diastolic < 80 mm Hg"
        },
        stage1: {
            name: "Hypertension Stage 1",
            range: "Systolic 130-139 or diastolic 80-89 mm Hg"
        },
        stage2: {
            name: "Hypertension Stage 2",
            range: "Systolic > 139 or diastolic > 89 mm Hg"
        },
        crisis: {
            name: "Hypertensive Crisis",
            range: "Systolic > 180 and/or diastolic > 120 mm Hg"
        }
    }
    res.json(categories[category])
})

// BMI API
app.post("/bmiAPI", (req, res) => {
    const { feet, inches, pounds } = req.body

    // Measurement conversion
    const totalInches = feet * 12 + inches
    const cmHeight = totalInches * 2.54
    const meterHeight = cmHeight / 100
    const kgWeight = pounds * .454

    // Calculate BMI, return values to HTML
    const bmi = kgWeight / (meterHeight * meterHeight)
    res.json({
        cmHeight: Number(cmHeight.toFixed(2)),
        kgWeight: Number(kgWeight.toFixed(2)),
        bmi: Number(bmi.toFixed(2))
    })
})

// Risk Calculation API
app.post("/riskCalculationAPI", (req, res) => {
    const {
        age, bmi, bloodPressure, familyHistory
    } = req.body

    // Track points between sections
    let totalPoints = 0
    const points = {}

    // Ask for age
    if (age < 30) {
        points.age = 0
    } else if (age < 45) {
        points.age = 10
    } else if (age < 60) {
        points.age = 20
    } else {
        points.age = 30
    }
    totalPoints += points.age

    if (bmi < 25) {
        points.bmi = 0
    } else if (bmi < 30) {
        points.bmi = 30
    } else {
        points.bmi = 75
    }
    totalPoints += points.bmi

    const bpPoints = {
        normal: 0,
        elevated: 15,
        stage1: 30,
        stage2: 75,
        crisis: 100
    }
    points.bloodPressure = bpPoints[bloodPressure]
    totalPoints += points.bloodPressure

    // Check family history
    const historyPoints = {
        diabetes: 10,
        cancer: 10,
        alzheimers: 10
    }
    points.familyHistory = {}
    familyHistory.forEach(disease => {
        if (historyPoints[disease] !== undefined) {
            points.familyHistory[disease] =
                historyPoints[disease]
            totalPoints += historyPoints[disease]
        }
    });

    res.json({
        totalPoints,
        points
    })
})

// Custom 404 page
app.use((req, res) => {
    res.type("text/plain")
    res.status(404)
    res.send("404 - Not Found")
})

// Custom 500 page
app.use((err, req, res, next) => {
    console.error(err.message)
    res.type("text/plain")
    res.status(500)
    res.send("500 - Server Error")
})

app.listen(port, () => console.log(
    `Express started at \"http://localhost:${port}"\n` +
    `press Ctrl-C to terminate.`
))
