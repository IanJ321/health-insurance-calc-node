const express = require("express")
const cors = require("cors")
const app = express()
const port = process.env.PORT || 3000

app.use(express.static(__dirname + "/static"))
app.use(cors({ origin: "*" }))

// Implement Wake Server API
app.get("/wakeAPI", (req, res) => {
    res.json({
        message: "Health Insurance Calculator API is active."
    })
})

// Blood Pressure Categories API


// BMI API


// Risk Category API


// Custom 404 page.
app.use((req, res) => {
  res.type("text/plain")
  res.status(404)
  res.send("404 - Not Found")
})

// Custom 500 page.
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
