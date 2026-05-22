document.getElementById('studentForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Page reload rokne ke liye

    const submitBtn = document.getElementById('submitBtn');
    const responseMessage = document.getElementById('responseMessage');

    // Form data collect karna
    const studentData = {
        name: document.getElementById('name').value,
        rollno: document.getElementById('rollno').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        fatherName: document.getElementById('fatherName').value,
        motherName: document.getElementById('motherName').value,
        address: document.getElementById('address').value
    };

    // Button animation loading state
    submitBtn.disabled = true;
    submitBtn.innerText = "Saving Details...";

    try {
        // Backend server ko data bhejna (Running on port 3000)
        const response = await fetch('http://localhost:3000/api/save-student', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(studentData)
        });

        const result = await response.json();

        if (response.ok) {
            responseMessage.className = "success";
            responseMessage.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${result.message}`;
            document.getElementById('studentForm').reset(); // Form clear karna
        } else {
            responseMessage.className = "error";
            responseMessage.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> Server Error: ${result.message}`;
        }
    } catch (error) {
        responseMessage.className = "error";
        responseMessage.innerHTML = `<i class="fa-solid fa-wifi"></i> Unable to connect to the backend server.`;
    }

    // UI reset parameters
    responseMessage.style.display = "block";
    submitBtn.disabled = false;
    submitBtn.innerHTML = `Save Student Profile <i class="fa-solid fa-paper-plane"></i>`;
});