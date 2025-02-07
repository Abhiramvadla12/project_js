let details = JSON.parse(localStorage.getItem("payment details"));
console.log(details);
let username = document.getElementById('e-1');
let email = document.getElementById('e-2');
let phone = document.getElementById('e-3');
let age = document.getElementById('e-4');
username.innerHTML = `<span>User name: </span> ${details?.user['username']}`;
email.innerHTML = `<span>Email: </span> ${details?.user['email']}`;
phone.innerHTML = `<span>Phone: </span> ${details?.user['phone']}`;
age.innerHTML = `<span>Age: </span> ${details?.user['age']}`;
document.addEventListener("DOMContentLoaded", () => {
    const bookingData = JSON.parse(localStorage.getItem("bookingData"));
    
    if (bookingData) {
        document.getElementById("from_display").innerHTML = `<span>From:</span>     ${bookingData.from}`;
        document.getElementById("to_display").innerHTML = `<span>To:</span>         ${bookingData.to}`;
        document.getElementById("date_display").innerHTML = `<span>Date: </span>    ${bookingData.date}`;
        document.getElementById("time_display").innerHTML = `<span>Time: </span>    ${bookingData.time}`;
        document.getElementById("duration_display").innerHTML = `<span> Duration: </span>   ${bookingData.duration}`;
        document.getElementById("total_price_display").innerHTML = `<span>Total Price </span>: $  ${bookingData.total_price}`;
    } else {
        console.log("No booking data found.");
    }
});

