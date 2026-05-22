const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors()); // Frontend to Backend communication cross-origin block hatane ke liye
app.use(express.json()); // JSON parsing ke liye
app.use(express.static(__dirname)); // Static files serve karne ke liye

// API route to handle data saving
app.post('/api/save-student', (req, res) => {
    const { name, rollno, email, phone, fatherName, motherName, address } = req.body;

    // Validation Check
    if (!name || !rollno || !email || !phone || !fatherName || !motherName || !address) {
        return res.status(400).json({ message: "All fields are required!" });
    }

    // data text structure formatting
    const studentRecord = `
==================================================
TIMESTAMP     : ${new Date().toLocaleString()}
ROLL NUMBER   : ${rollno}
NAME          : ${name}
EMAIL         : ${email}
PHONE         : ${phone}
FATHER'S NAME : ${fatherName}
MOTHER'S NAME : ${motherName}
ADDRESS       : ${address}
==================================================\n`;

    // File me data append karne ka setup
    const filePath = path.join(__dirname, 'students.txt');
    
    fs.appendFile(filePath, studentRecord, (err) => {
        if (err) {
            console.error("Failed to write to file", err);
            return res.status(500).json({ message: "Internal Server Error. Could not save data." });
        }
        
        console.log(`Record saved successfully for Roll No: ${rollno}`);
        return res.status(200).json({ message: "Student data saved successfully into text logs!" });
    });
});

// Server initiation
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});