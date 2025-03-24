document.addEventListener("DOMContentLoaded", async () => {
    const tableBody = document.getElementById("park-table-body");
    const feesFilter = document.getElementById("feesFilter");
    const prevPageBtn = document.getElementById("prevPage");
    const nextPageBtn = document.getElementById("nextPage");
    const pageInfo = document.getElementById("pageInfo");

    const apiKey = "dFnL9eme9zffw44xAWBBmH3zTEM96wlNLkCcihIm"; // Your API Key
    const apiUrl = "https://developer.nps.gov/api/v1/parks";
    let parks = [];
    let currentPage = 1;
    const parksPerPage = 10;

    // Function to fetch and display parks
    const fetchParks = async (filterFees = "") => {
        tableBody.innerHTML = "<tr><td colspan='3'>Loading...</td></tr>";
        let url = `${apiUrl}?api_key=${apiKey}`;

        try {
            const response = await axios.get(url);
            let allParks = response.data.data;

            // Apply Fees & Passes filtering
            if (filterFees === "free") {
                parks = allParks.filter(park => park.entranceFees.length === 0);
            } else if (filterFees === "paid") {
                parks = allParks.filter(park => park.entranceFees.length > 0);
            } else {
                parks = allParks;
            }

            currentPage = 1; // Reset to first page
            renderTable();
        } catch (error) {
            console.error("Error fetching park data:", error);
            tableBody.innerHTML = `<tr><td colspan="3" class="text-danger">Failed to load data. Please try again later.</td></tr>`;
        }
    };

    // Function to render the current page of parks
    const renderTable = () => {
        tableBody.innerHTML = "";
        const start = (currentPage - 1) * parksPerPage;
        const end = start + parksPerPage;
        const currentParks = parks.slice(start, end);

        if (currentParks.length === 0) {
            tableBody.innerHTML = "<tr><td colspan='3' class='text-warning'>No parks found.</td></tr>";
        } else {
            currentParks.forEach(park => {
                const thingsToDo = park.activities.map(activity => activity.name).join(", ") || "N/A";
                const fees = park.entranceFees.length > 0
                    ? `$${park.entranceFees[0].cost} - ${park.entranceFees[0].description}`
                    : "Free Entry";

                const row = `<tr>
                    <td>${park.fullName}</td>
                    <td>${thingsToDo}</td>
                    <td>${fees}</td>
                </tr>`;
                tableBody.innerHTML += row;
            });
        }

        // Update pagination controls
        pageInfo.textContent = `Page ${currentPage} of ${Math.ceil(parks.length / parksPerPage)}`;
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = end >= parks.length;
    };

    // Event listeners for pagination
    prevPageBtn.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            renderTable();
        }
    });

    nextPageBtn.addEventListener("click", () => {
        if (currentPage < Math.ceil(parks.length / parksPerPage)) {
            currentPage++;
            renderTable();
        }
    });

    // Event listener for fees filter change
    feesFilter.addEventListener("change", () => {
        fetchParks(feesFilter.value);
    });

    // Load parks initially
    fetchParks();
});
