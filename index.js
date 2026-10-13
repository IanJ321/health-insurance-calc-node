const express = require("express")
const cors = require("cors")
const app = express()
const port = process.env.PORT || 3000

// Implement Wake Server API
app.get("/wakeAPI", (req, res) => {
    res.json({
        message: "API is active."
    })
})
