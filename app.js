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
          row.innerHTML = `<td>${record.state || "N/A"}</td>
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
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      tableBody.innerHTML =
        "<tr><td colspan='10'>Error fetching data. Please try again later.</td></tr>";
    });
}

// Call fetchData function when the page loads
window.onload = () => {
  fetchData();
  setupSearchFilters();
};

// Function to set up search filters
function setupSearchFilters() {
  const districtInput = document.getElementById("district-search");
  const cropInput = document.getElementById("crop-search");

  districtInput.addEventListener("keyup", filterTable);
  cropInput.addEventListener("keyup", filterTable);
}

// Function to filter table rows
function filterTable() {
  const districtInput = document
    .getElementById("district-search")
    .value.toLowerCase();
  const cropInput = document.getElementById("crop-search").value.toLowerCase();
  const tableBody = document.getElementById("table-body");
  const rows = tableBody.getElementsByTagName("tr");

  for (let i = 0; i < rows.length; i++) {
    const districtCell = rows[i].cells[1]; // Assuming district is in the second column
    const cropCell = rows[i].cells[3]; // Assuming crop is in the fourth column
    if (districtCell && cropCell) {
      const districtText = districtCell.textContent.toLowerCase();
      const cropText = cropCell.textContent.toLowerCase();
      const districtMatch = districtText.includes(districtInput);
      const cropMatch = cropText.includes(cropInput);

      // Show or hide the row based on the input values
      if (districtMatch && cropMatch) {
        rows[i].style.display = "";
      } else {
        rows[i].style.display = "none";
      }
    }
  }
}
