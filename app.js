// Function to fetch data from the backend and display it
function fetchData(page = 0) {
  const tableBody = document.getElementById("table-body");

  // Clear existing rows before appending new data
  tableBody.innerHTML = "";

  // Display a loading message
  tableBody.innerHTML = "<tr><td colspan='10'>Loading...</td></tr>";

  fetch(`http://localhost:3000/api/data?page=${page}`) // URL of your backend API with pagination
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
          row.innerHTML = `
            <td>${record.state || "N/A"}</td>
            <td>${record.district || "N/A"}</td>
            <td>${record.market || "N/A"}</td>
            <td>${record.commodity || "N/A"}</td>
            <td>${record.variety || "N/A"}</td>
            <td>${record.grade || "N/A"}</td>
            <td>${record.arrival_date || "N/A"}</td>
            <td>${record.min_price || "N/A"}</td>
            <td>${record.max_price || "N/A"}</td>
            <td>${record.modal_price || "N/A"}</td>
          `;

          // Append the new row to the table body
          tableBody.appendChild(row);
        });
      } else {
        const row = document.createElement("tr");
        row.innerHTML = "<td colspan='10'>No data available</td>";
        tableBody.appendChild(row);
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      tableBody.innerHTML =
        "<tr><td colspan='10'>Error fetching data. Please try again later.</td></tr>";
    });
}

// Call fetchData function when the page loads
window.onload = () => fetchData();

document.addEventListener("DOMContentLoaded", function () {
  const tableBody = document.getElementById("table-body");

  // Duplicate rows for continuous scroll
  const rows = Array.from(tableBody.querySelectorAll("tr"));
  rows.forEach((row) => {
    tableBody.appendChild(row.cloneNode(true));
  });

  // Function to restart the animation if needed
  function resetAnimation() {
    tableBody.style.animation = "none"; // Disable animation
    tableBody.offsetHeight; // Trigger reflow
    tableBody.style.animation = null; // Re-enable animation
  }

  // Listen for the animation to complete and restart it
  tableBody.addEventListener("animationiteration", resetAnimation);
});
