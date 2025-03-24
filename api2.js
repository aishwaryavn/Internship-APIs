document.addEventListener("DOMContentLoaded", async () => {
    const tableBody = document.getElementById("brewery-table-body");
    const stateFilter = document.getElementById("stateFilter");
    const prevPageBtn = document.getElementById("prevPage");
    const nextPageBtn = document.getElementById("nextPage");
    const pageInfo = document.getElementById("pageInfo");

    const apiUrl = "https://api.openbrewerydb.org/v1/breweries";
    let breweries = [];
    let currentPage = 1;
    const breweriesPerPage = 10;

    // Function to fetch and display breweries
    const fetchBreweries = async (state = "") => {
        tableBody.innerHTML = "<tr><td colspan='5'>Loading...</td></tr>";
        let url = state ? `${apiUrl}?by_state=${state}` : apiUrl;

        try {
            const response = await axios.get(url);
            breweries = response.data;
            currentPage = 1; // Reset to first page on new fetch
            renderTable();
        } catch (error) {
            console.error("Error fetching brewery data:", error);
            tableBody.innerHTML = `<tr><td colspan="5" class="text-danger">Failed to load data. Please try again later.</td></tr>`;
        }
    };

    // Function to render the current page of breweries
    const renderTable = () => {
        tableBody.innerHTML = "";
        const start = (currentPage - 1) * breweriesPerPage;
        const end = start + breweriesPerPage;
        const currentBreweries = breweries.slice(start, end);

        if (currentBreweries.length === 0) {
            tableBody.innerHTML = "<tr><td colspan='5' class='text-warning'>No breweries found.</td></tr>";
        } else {
            currentBreweries.forEach(brewery => {
                const row = `<tr>
                    <td>${brewery.name}</td>
                    <td>${brewery.brewery_type}</td>
                    <td>${brewery.city}</td>
                    <td>${brewery.state || "N/A"}</td>
                    <td>${brewery.country || "N/A"}</td>
                </tr>`;
                tableBody.innerHTML += row;
            });
        }

        // Update pagination controls
        pageInfo.textContent = `Page ${currentPage} of ${Math.ceil(breweries.length / breweriesPerPage)}`;
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = end >= breweries.length;
    };

    // Fetch and populate states in the dropdown
    const fetchStates = async () => {
        try {
            const response = await axios.get(apiUrl);
            const states = [...new Set(response.data.map(brewery => brewery.state))].sort();

            states.forEach(state => {
                if (state) {
                    const option = document.createElement("option");
                    option.value = state.toLowerCase().replace(/\s+/g, "_");
                    option.textContent = state;
                    stateFilter.appendChild(option);
                }
            });
        } catch (error) {
            console.error("Error fetching states:", error);
        }
    };

    // Event listeners for pagination
    prevPageBtn.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            renderTable();
        }
    });

    nextPageBtn.addEventListener("click", () => {
        if (currentPage < Math.ceil(breweries.length / breweriesPerPage)) {
            currentPage++;
            renderTable();
        }
    });

    // Event listener for state filter change
    stateFilter.addEventListener("change", () => {
        fetchBreweries(stateFilter.value);
    });

    // Load all breweries and states initially
    fetchBreweries();
    fetchStates();
});
