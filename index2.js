let form = document.getElementById('form');
let message1 = document.getElementById("message1");
let insert_response = document.getElementById('insert_response');
let count = 9;
count++;
let URL = "https://json-server-deploy-5.onrender.com/payment_details";

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Retrieve values within the event listener
    let username = document.getElementById('username').value;
    let email = document.getElementById('email').value;
    let phone = document.getElementById("phone").value;
    let age = document.getElementById('age').value;
    let hasError = false;
    message1.innerHTML = '';

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
    if (hasError) return;
    // Proceed with form submission
    submitForm(username, email, phone,age);
});
function submitForm(username, email, phone,age) {
    let options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id: count,
            username: username,
            email: email,
            phone: phone,
            age: age
        })
        
    };
   
    insertData(URL, options);
}

async function insertData(URL, options) {
    try {
        let response = await fetch(URL, options);
        if (response.ok) {
            console.log("Data inserted successfully", response.status, response.statusText);
            insert_response.innerHTML = `payment completed succesfully!!!`;
            let download = document.getElementById('download_ticket');
            alert("payment completed successfully!!!");
            download.innerHTML = `<a href="./index3.html">Download your e-ticket</a>`
        } else {
            throw new Error(`Failed to insert data: ${response.status} ${response.statusText}`);
        }
        let data = await response.json();
            //adding to local storage
            if (data) {
                localStorage.setItem("payment details", JSON.stringify(data));
            } else {
                console.log("No data received");
            }
    } catch (error) {
        console.error(error.message);
        insert_response.innerHTML = `<i style='color:red'>Error in payment. Please try again later.</i>`;
    }
}
