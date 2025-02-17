(async () => {
    try {
        const login = document.getElementById("login");

        if (login) {
            login.addEventListener('click', async function (event) {
                event.preventDefault();

                const email = document.getElementById('email')?.value.trim() || "";
                const password = document.getElementById('password')?.value.trim() || "";

                if (!email || !password) {
                    Swal.fire({
                        icon: "warning",
                        title: "Missing Credentials",
                        text: "Please enter both email and password.",
                        confirmButtonColor: "#007bff",
                    });
                    return;
                }

                try {
                    const response = await fetch("https://bluebus-0r8y.onrender.com/login", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email, password }),
                    });

                    const data = await response.json();

                    if (!response.ok) {
                        throw new Error(data.error || "Login failed. Please try again.");
                    }

                    // console.log("✅ Login successful:", data);
                    localStorage.setItem("display", JSON.stringify(true)); // ✅ Store user info

                    Swal.fire({
                        icon: "success",
                        title: "Login successful!",
                        confirmButtonColor: "#007bff",
                    }).then(() => {
                        document.querySelectorAll(".btn-outline-danger").forEach(button => {
                            button.style.display = "block"; // Show "View Seats" button
                        });

                        // Update UI
                        document.getElementById("emailu").innerHTML = `${data.email}`;
                        document.getElementById("logout").innerHTML = `<button id='logout_button'><a href="./index.html" id="back">Logout</a></button>`;

                        setTimeout(() => {
                            let logoutButton = document.getElementById('logout_button');
                            if (logoutButton) {
                                logoutButton.addEventListener("click", function () {
                                    localStorage.removeItem("display");
                                    location.reload();
                                });
                            }
                        }, 100);
                    });

                } catch (error) {
                    console.error("❌ Error during login:", error);
                    Swal.fire({
                        icon: "error",
                        title: "Login Failed",
                        text: error.message,
                        confirmButtonColor: "#007bff",
                    });
                }
            });
        }
    } catch (error) {
        console.error("❌ Error setting up login event listener:", error);
    }
})();


document.addEventListener("DOMContentLoaded", function () {
    localStorage.clear();
    let today = new Date().toISOString().split('T')[0];
    document.getElementById("date").value = today;
  });

  function toggleAnswer(element) {
    let answer = element.querySelector('.faq-answer');
    answer.style.display = (answer.style.display === 'none' || answer.style.display === '') ? 'block' : 'none';
}
// Bus booking operations
let search = document.getElementById('search');
let bus_ticket = document.getElementById('bus_ticket');
search.addEventListener('click', async (event) => {
    event.preventDefault();
    bus_ticket.innerHTML = '';

    let from = document.getElementById('from').value.trim();
    let to = document.getElementById('to').value.trim();
    let date = document.getElementById('date').value;
    console.log("input values ",from,to)
    if (from === "" || to === "" || date === "") {
        Swal.fire({
            icon: "warning",
            title: "Missing Details!",
            text: "Please fill in the 'From', 'To', and 'Date' fields before searching.",
            confirmButtonColor: "#007bff",
        });
        return; // Stop further execution
    }
    
    else{
        async function fetchData(url) {
            try {
                let response = await fetch(url);
                let data = await response.json();
                // console.log("Data from backend:", data);
        
                // if (data) {
                //     localStorage.setItem("locations_data", JSON.stringify(data));
                // } else {
                //     console.log("No data received");
                // }
        
                let from = document.getElementById('from').value.trim();
                let to = document.getElementById('to').value.trim();
                let date = document.getElementById('date').value;
        
                let filteredResults = data.filter(element =>
                    element['from'].toLowerCase().trim() === from.toLowerCase().trim() &&
                    element['to'].toLowerCase().trim() === to.toLowerCase().trim()
                );
        
                if (filteredResults.length === 0) {
                    bus_ticket.innerHTML = `
                        <div class="no-bus">
                            <p>No buses found for the selected route from '${from}' to '${to}'. Please try another route.</p>
                        </div>
                    `;
                    return;
                }
        
                filteredResults.forEach(element => {
                    let totalSeats = 20; // Total seats per bus
                    let occupiedSeatsCount = Math.floor(Math.random() * 6) + 5; // Randomly occupy 5-10 seats
                    let availableSeatsCount = totalSeats - occupiedSeatsCount; // Calculate available seats dynamically
                
                    let bus_seats = document.createElement('div');
                    bus_seats.style.display = "none";
                    bus_seats.className = "seat-layout";
                
                    let div = document.createElement('div');
                    div.className = "options";
                
                    let travels = document.createElement('p');
                    travels.style.width = "100px";
                    let time = document.createElement('p');
                    let duration = document.createElement('p');
                    let time1 = document.createElement('p');
                    let rating = document.createElement('p');
                    rating.id = 'rating';
                    rating.style.backgroundColor = "lightgreen";
                    let price = document.createElement('p');
                    let seats = document.createElement('p'); // ✅ Display available seats dynamically
                
                    let view_seats = document.createElement('button');
                    view_seats.className = "btn btn-outline-danger";
                    view_seats.innerHTML = `View Seats`;
                    view_seats.style.padding = "0";
                    view_seats.style.width = "80px";
                    view_seats.style.height = "30px";
                
                    travels.innerHTML = `${element['travels']}`;
                    time.innerHTML = `${element['time']}  `;
                    duration.innerHTML = `${element['duration']}`;
                    time1.innerHTML = `${element['time1']}  ${date} `;
                    rating.innerHTML = `⭐${element['rating']}`;
                    price.innerHTML = `INR ${element['price']}`;
                    seats.innerHTML = `${availableSeatsCount} seats available`; // ✅ Update available seats dynamically
                
                    div.append(travels, time, duration, time1, rating, price, seats, view_seats);
                    bus_ticket.append(div, bus_seats);
                
                    let seatLayoutCreated = false;
                    view_seats.addEventListener("click", (event) => {
                        event.preventDefault();
                
                        // ✅ Check the login status dynamically when clicking "View Seats"
                        let loggedInUser = JSON.parse(localStorage.getItem("display"));
                
                        if (!loggedInUser) {
                            Swal.fire({
                                icon: "warning",
                                title: "Login Required!",
                                text: "You need to log in to view and book seats.",
                                confirmButtonColor: "#007bff",
                            });
                            return;
                        }
                
                        bus_seats.style.display = bus_seats.style.display === "none" ? "grid" : "none";
                
                        if (!seatLayoutCreated) {
                            createSeatLayout(bus_seats, element['price'], from, to, date, element['time'], element['duration'], totalSeats, occupiedSeatsCount, seats,element['travels']);
                            seatLayoutCreated = true;
                        }
                    });
                });
                
        
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        
        
    
        fetchData('https://bluebus-0r8y.onrender.com/location');
    }
   
});
function createSeatLayout(container, price, from, to, date, time, duration, totalSeats = 20, occupiedSeatsCount, seatsElement,travels) {
    let layoutWrapper = document.createElement('div');
    layoutWrapper.className = 'layout_seats';
    layoutWrapper.style.display = "flex";
    layoutWrapper.style.alignItems = "flex-start";
    layoutWrapper.style.gap = "20px";

    let seatContainer = document.createElement('div');
    seatContainer.style.display = "grid";
    seatContainer.style.gridTemplateColumns = "repeat(5, 10vw)";
    seatContainer.style.gap = "10px";
    seatContainer.style.padding = "10px";

    let display_pricing = document.createElement('div');
    display_pricing.id = 'bus_pricing';
    display_pricing.style.width = "250px";
    display_pricing.style.padding = "10px";
    display_pricing.style.border = "1px solid #ccc";
    display_pricing.style.borderRadius = "5px";
    display_pricing.style.backgroundColor = "#f9f9f9";
    display_pricing.innerHTML = `Click on an available seat to proceed with your transaction.`;

    let availableSeatsCount = totalSeats - occupiedSeatsCount;
    seatsElement.innerHTML = `${availableSeatsCount} seats available`; // ✅ Update initially

    let occupiedSeats = new Set();
    while (occupiedSeats.size < occupiedSeatsCount) {
        occupiedSeats.add(Math.floor(Math.random() * totalSeats)); // Unique random occupied seats
    }

    let fragment = document.createDocumentFragment();
    let total = 0;
    let selectedSeats = [];
    const seatPrice = Number(price);

    for (let i = 0; i < totalSeats; i++) {
        let seat = document.createElement('div');
        const isOccupied = occupiedSeats.has(i);

        seat.className = isOccupied ? 'seat occupied' : 'seat available';
        seat.style.width = '40px';
        seat.style.height = '40px';
        seat.style.backgroundColor = isOccupied ? 'red' : 'white';
        seat.style.border = '1px solid #ccc';
        seat.style.borderRadius = '5px';
        seat.style.cursor = isOccupied ? 'not-allowed' : 'pointer';
        seat.innerHTML = `<span class="material-symbols-outlined" style='font-size:30px'>airline_seat_recline_extra</span>`;
        seat.dataset.seatId = `S${i + 1}`; // Assigning seat ID

        if (!isOccupied) {
            seat.addEventListener("click", () => {
                seat.classList.toggle("selected");

                if (seat.classList.contains("selected")) {
                    total += seatPrice;
                    selectedSeats.push(seat.dataset.seatId);
                    availableSeatsCount--; // ✅ Reduce available seats
                } else {
                    total -= seatPrice;
                    selectedSeats = selectedSeats.filter(id => id !== seat.dataset.seatId);
                    availableSeatsCount++; // ✅ Increase available seats
                }

                seat.style.backgroundColor = seat.classList.contains("selected") ? "lightgreen" : "white";

                display_pricing.innerHTML = total > 0 
                    ? `<p><strong>Total Price:</strong> ₹${total}</p>
                       <p><strong>Selected Seats:</strong> ${selectedSeats.length > 0 ? selectedSeats.join(", ") : "None"}</p>
                       <button id='pay_button' class='btn btn-outline-info'>
                          <a href='index2.html' style="text-decoration: none">Click here to pay</a>
                       </button>`
                    : `Click on a seat to see the pricing.`;

                seatsElement.innerHTML = `${availableSeatsCount} seats available`; // ✅ Update dynamically

                // Store selected booking data in localStorage
                localStorage.setItem("bookingData", JSON.stringify({
                    from,
                    to,
                    time,
                    duration,
                    date,
                    total_price: total,
                    seats_selected: selectedSeats,
                    travels
                }));
            });
        }

        fragment.appendChild(seat);

        // Add a gap after 10 seats to mimic bus layout
        if (i === 9) {
            let gapDiv = document.createElement('div');
            gapDiv.style.gridColumn = "span 5"; // Spans across the row
            gapDiv.style.height = "20px"; // Adds a vertical gap
            fragment.appendChild(gapDiv);
        }
    }

    seatContainer.appendChild(fragment);
    layoutWrapper.appendChild(seatContainer);
    layoutWrapper.appendChild(display_pricing);
    container.appendChild(layoutWrapper);
}


