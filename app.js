// Function to fetch data from the backend and display it
function fetchData(page = 0) {
    const tableBody = document.getElementById("table-body");

    // Clear existing rows before appending new data
    tableBody.innerHTML = "";

    // Display a loading message
    tableBody.innerHTML = "<tr><td colspan='10'>Loading...</td></tr>";

    // Update the fetch URL to your Render URL
    fetch(`https://livemarketprice.onrender.com/api/data?page=${page}`) // URL of your backend API with pagination
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then((data) => {
            console.log(data); // Log data to check its structure

            // Clear loading message
            tableBody.innerHTML = "";

            // Check if data and records are available
            if (data && data.records && data.records.length > 0) {
                data.records.forEach((record) => {
                    // Create a new row for each record
                    const row = document.createElement("tr");

                    // Add each data cell to the row
                    row.innerHTML =
                        `<td>${record.state || "N/A"}</td>
                         <td>${record.district || "N/A"}</td>
                         <td>${record.market || "N/A"}</td>
                         <td>${record.commodity || "N/A"}</td>
                         <td>${record.variety || "N/A"}</td>
                         <td>${record.grade || "N/A"}</td>
                         <td>${record.arrival_date || "N/A"}</td>
                         <td>${record.min_price || "N/A"}</td>
                         <td>${record.max_price || "N/A"}</td>
                         <td>${record.modal_price || "N/A"}</td>`;

                    // Append the new row to the table body
                    tableBody.appendChild(row);
                });
            } else {
                const row = document.createElement("tr");
                row.innerHTML = "<td colspan='10'>No data available</td>";
                tableBody.appendChild(row);
            }

            // Start auto scrolling after the data is loaded
            startAutoScroll();
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
            tableBody.innerHTML =
                "<tr><td colspan='10'>Error fetching data. Please try again later.</td></tr>";
        });
}

// Automatic scrolling function
let autoScrollInterval; // To store the interval for automatic scrolling

function startAutoScroll() {
    const tbody = document.getElementById("table-body");

    // Clear any existing interval before starting a new one
    clearInterval(autoScrollInterval);

    autoScrollInterval = setInterval(() => {
        tbody.scrollTop += 1; // Scroll down by 1 pixel

        // Reset scroll position if reached bottom
        if (tbody.scrollTop >= tbody.scrollHeight - tbody.clientHeight) {
            tbody.scrollTop = 0; // Reset to top
        }
    }, 100); // Call autoScroll every 100ms
}

// Call fetchData function when the page loads
window.onload = () => {
    fetchData();
};

// Search functionality
document.getElementById('search-district').addEventListener('input', filterTable);
document.getElementById('search-crop').addEventListener('input', filterTable);

function filterTable() {
    const districtSearch = document.getElementById('search-district').value.toLowerCase();
    const cropSearch = document.getElementById('search-crop').value.toLowerCase();
    const rows = document.querySelectorAll('#table-body tr');

    rows.forEach(row => {
        const district = row.cells[1].textContent.toLowerCase();
        const commodity = row.cells[3].textContent.toLowerCase();

        // Show row if it matches search criteria, otherwise hide it
        if (district.includes(districtSearch) && commodity.includes(cropSearch)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}
