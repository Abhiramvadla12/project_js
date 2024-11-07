let form = document.getElementById('form');
let message1 = document.getElementById("message1");
let message3 = document.getElementById("message3");
let message4 = document.getElementById("message4");
let insert_response = document.getElementById('insert_response');
let count = 9;
count++;
let URL = "http://localhost:3000/detail";

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Retrieve values within the event listener
    let username = document.getElementById('username').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let confirm_password = document.getElementById('confirm_password').value;
    let phone = document.getElementById("phone").value;
    
    let hasError = false;
    message1.innerHTML = '';
    message3.innerHTML = '';
    message4.innerHTML = '';

    // Username validation
    if (username.length === 0) {
        message1.innerHTML = `<i style='color:red'>Username should not be empty</i>`;
        hasError = true;
    } else if (username.length < 5) {
        message1.innerHTML = `<i style='color:red'>Username should be greater than 5 characters</i>`;
        hasError = true;
    } else if (/\d/.test(username)) {
        message1.innerHTML = `<i style='color:red'>Digits are not allowed in username</i>`;
        hasError = true;
    }

    // Password validation
    let passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*!]).{8,}/;
    if (!passwordPattern.test(password)) {
        message3.innerHTML = `<i style='color:red'>Password should be at least 8 characters long, with one capital letter, one special symbol, and one number</i>`;
        hasError = true;
    }

    // Confirm password match validation
    if (password !== confirm_password) {
        message4.innerHTML = `<i style='color:red'>Passwords do not match</i>`;
        hasError = true;
    }

    if (hasError) return;

    // Check if user already exists
    let userFound = false;
    try {
        const response = await fetch(URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        localStorage.setItem("data", JSON.stringify(data));

        const storedData = JSON.parse(localStorage.getItem("data"));
        if (storedData) {
            storedData.forEach(element => {
                if (username === element['username'] && email === element['email'] && password === element['password']) {
                    userFound = true;
                }
            });
        }
    } catch (error) {
        console.error("Error fetching or storing data:", error);
    }

    // Prevent form submission if user already exists
    if (userFound) {
        insert_response.innerHTML = `<i style='color:red'>User already exists. Please use different credentials.</i>`;
        return;
    }

    // Proceed with form submission
    submitForm(username, email, password, phone);
});

function submitForm(username, email, password, phone) {
    let options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id: count,
            username: username,
            email: email,
            password: password,
            phone: phone
        })
    };

    insertData(URL, options);
}

async function insertData(URL, options) {
    try {
        let response = await fetch(URL, options);
        if (response.ok) {
            console.log("Data inserted successfully", response.status, response.statusText);
            insert_response.innerHTML = `Account created successfully`;
            alert("Account created successfully");
        } else {
            throw new Error(`Failed to insert data: ${response.status} ${response.statusText}`);
        }
    } catch (error) {
        console.error(error.message);
        insert_response.innerHTML = `<i style='color:red'>Error creating account. Please try again later.</i>`;
    }
}
