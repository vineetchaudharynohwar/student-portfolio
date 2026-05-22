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
// Browser par saara data dekhne ke liye naya route
app.get('/view-data', (req, res) => {
    const filePath = path.join(__dirname, 'students.txt');
    
    // Check karo ki file exist karti hai ya nahi
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('<h1>Arey bhai, abhi tak koi data save nahi hua hai!</h1>');
        }
        
        // Data ko browser par acche se dikhane ke liye HTML format
        res.send(`
            <html>
            <head>
                <title>Submitted Student Data</title>
                <style>
                    body { font-family: sans-serif; background: #090d16; color: #fff; padding: 40px; }
                    h2 { color: #6366f1; border-bottom: 2px solid #222; padding-bottom: 10px; }
                    pre { background: #111827; padding: 20px; border-radius: 10px; border: 1px solid #222; font-size: 16px; line-height: 1.6; color: #34d399; }
                </style>
            </head>
            <body>
                <h2>📊 Live Student Submissions Registry</h2>
                <pre>${data}</pre>
                <br>
                <button onclick="location.reload()" style="padding: 10px 20px; background: #6366f1; color: white; border: none; border-radius: 5px; cursor: pointer;">Refresh Data</button>
            </body>
            </html>
        `);
    });
});
// Server initiation
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});