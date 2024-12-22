function hi(){
    window.alert("For guest login enter the default values in login page");
}
hi()
(async () => {
    
   
    try {
        const response = await fetch("https://json-server-deploy-5.onrender.com/detail");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Fetched data:", data);

        if (data) {
            localStorage.setItem("data", JSON.stringify(data));
        } else {
            console.log("No data received");
        }

        const login = document.getElementById("login");

        if (login) {
            login.addEventListener('click', function (event) {
                event.preventDefault();

                const username = document.getElementById('username')?.value || "";
                const email = document.getElementById('email')?.value || "";
                const password = document.getElementById('password')?.value || "";

                const storedData = JSON.parse(localStorage.getItem("data"));
                let userFound = false;

                if (storedData) {
                    storedData.forEach(element => {
                        if (username === element['username'] && email === element['email'] && password === element['password']) {
                            userFound = true;

                            let peru = document.getElementById("peru");
                            let emailu = document.getElementById('emailu');
                            let logout = document.getElementById('logout');
                            logout.innerHTML = `<button id='logout_button'><a href="./index.html" id="back">Logout</a></button>`
                            if (peru && emailu) {
                                peru.innerHTML = `${element['username']}`;
                                emailu.innerHTML = `${element['email']}`;
                                console.log("Updated peru and emailu successfully");
                            } else {
                                console.error("Elements 'peru' or 'emailu' not found in the DOM");
                            }
                        }
                    });

                    const display = document.getElementById('display');
                    if (display) {
                        display.innerHTML = userFound 
                            ? `<b>Login successful!</b>` 
                            : `<i style='color:red'>Data not found or credentials are incorrect</i>`;
                        if(userFound){
                            alert("logged in successfully!!!")
                        }
                    }
                } else {
                    const display = document.getElementById('display');
                    if (display) display.innerHTML = `<i>No data found in local storage</i>`;
                }
            });
        }
    } catch (error) {
        console.error("Error fetching or storing data:", error);
    }
})();

// Bus booking operations
let search = document.getElementById('search');
let bus_ticket = document.getElementById('bus_ticket');
search.addEventListener('click', async (event) => {
    event.preventDefault();
    bus_ticket.innerHTML = '';

    let from = document.getElementById('from').value.trim();
    let to = document.getElementById('to').value.trim();
    let date = document.getElementById('date').value;

    if (from === "" || to === "" || date === "") {
        alert("please fill the details first from or to or date before searching ");
    }

    async function fetchData(url) {
        try {
            let response = await fetch(url);
            let data = await response.json();

            if (data) {
                localStorage.setItem("locations_data", JSON.stringify(data));
            } else {
                console.log("No data received");
            }

            let filteredResults = data.filter(element => 
                element['from'] === from && element['to'] === to
            );
            if (filteredResults.length === 0) {
                // Display a message if no results are found
                bus_ticket.innerHTML = `<div style='border:2px solid red;' class='no_bus'><p style="color: red;">No buses found for the selected route from '${from}' to '${to}'. Please try another route.</p></div>`;
                return; // Exit if there are no matching results
            }
            filteredResults.forEach(element => {
                let bus_seats = document.createElement('div');
                bus_seats.style.display = "none";
                bus_seats.className = "seat-layout";
            
                let div = document.createElement('div');
                div.className = "options";
            
                let travels = document.createElement('h2');
                let time = document.createElement('p');
                let duration = document.createElement('p');
                let time1 = document.createElement('p');
                let rating = document.createElement('p');
                rating.id = 'rating';
                let price = document.createElement('p');
                let seats = document.createElement('p');
            
                let view_seats = document.createElement('button');
                view_seats.className = "btn btn-outline-danger";
                view_seats.innerHTML = `view seats`;
                view_seats.style.padding = "0";
                view_seats.style.width = "80px";
                view_seats.style.height = "30px";
            
                travels.innerHTML = `${element['travels']}`;
                time.innerHTML = `${element['time']} <br><br> ${element['from']}`;
                duration.innerHTML = `${element['duration']}`;
                time1.innerHTML = `${element['time1']} <br> ${date} <br> ${element['to']}`;
                rating.innerHTML = `⭐${element['rating']}`;
                price.innerHTML = `${element['price']}`;
                seats.innerHTML = `20 seats available`;
            
                div.append(travels, time, duration, time1, rating, price, seats, view_seats);
                bus_ticket.append(div, bus_seats);

                let seatLayoutCreated = false;
                view_seats.addEventListener("click", (event) => {
                    event.preventDefault();
                    bus_seats.style.display = bus_seats.style.display === "none" ? "grid" : "none"; 

                    if (!seatLayoutCreated) {
                        createSeatLayout(bus_seats, element['price'], from, to, date, element['time'], element['duration']);
                        seatLayoutCreated = true;
                    }
                });
            });
           

        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    fetchData('https://json-server-deploy-5.onrender.com/location');
});

function createSeatLayout(container, price, from, to, date, time, duration) {
    let layoutWrapper = document.createElement('div');
    layoutWrapper.className = 'layout_seats'
    layoutWrapper.style.display = "flex";
    layoutWrapper.style.alignItems = "flex-start";
    layoutWrapper.style.gap = "20px";

    let seatContainer = document.createElement('div');
    seatContainer.style.display = "grid";
    seatContainer.style.gridTemplateColumns = "repeat(5, 10vw)";
    seatContainer.style.gap = "2vw";
    seatContainer.style.padding = "10px";

    let display_pricing = document.createElement('div');
    display_pricing.id = 'bus_pricing';
    display_pricing.style.width = "200px";
    display_pricing.style.padding = "10px";
    display_pricing.style.border = "1px solid #ccc";
    display_pricing.style.borderRadius = "5px";
    display_pricing.style.backgroundColor = "#f9f9f9";
    display_pricing.innerHTML = `Click on an Available seat to proceed with your transaction.`;

    let fragment = document.createDocumentFragment();
    let total = 0;
    const seatPrice = Number(price);

    for (let i = 0; i < 20; i++) {
        let seat = document.createElement('div');
        const isOccupied = Math.random() < 0.3;

        seat.className = isOccupied ? 'seat occupied' : 'seat available';
        seat.style.width = '40px';
        seat.style.height = '40px';
        seat.style.backgroundColor = isOccupied ? 'red' : 'white';
        seat.style.border = '1px solid #ccc';
        seat.style.borderRadius = '5px';
        seat.style.cursor = isOccupied ? 'not-allowed' : 'pointer';
        seat.innerHTML = `<span class="material-symbols-outlined" style='font-size:30px'>airline_seat_recline_extra</span>`;

        seat.addEventListener("click", () => {
            if (seat.classList.contains("occupied")) return;

            if (seat.classList.contains("available")) {
                seat.classList.toggle("selected");

                if (seat.classList.contains("selected")) {
                    total += seatPrice;
                } else {
                    total -= seatPrice;
                }

                seat.style.backgroundColor = seat.classList.contains("selected") ? "lightgreen" : "white";
                display_pricing.innerHTML = total > 0 
                    ? `Total Price: $${total}
                        <button id='pay_button' class='btn btn-outline-info'><a href='index2.html'>click here to pay</a></button>`
                    : `Click on a seat to see the pricing.`;
            }

            // Store selected information in localStorage
            localStorage.setItem("bookingData", JSON.stringify({
                from,
                to,
                time,
                duration,
                date,
                total_price: total
            }));
        });

        fragment.appendChild(seat);
    }

    seatContainer.appendChild(fragment);
    layoutWrapper.appendChild(seatContainer);
    layoutWrapper.appendChild(display_pricing);
    container.appendChild(layoutWrapper);
}
