document.addEventListener("DOMContentLoaded", async () => {
    const tableBody = document.getElementById("artwork-table-body");
    const artistFilter = document.getElementById("artistFilter");
    const prevPageBtn = document.getElementById("prevPage");
    const nextPageBtn = document.getElementById("nextPage");
    const pageInfo = document.getElementById("pageInfo");

    const apiUrl = "https://api.artic.edu/api/v1/artworks";
    let artworks = [];
    let uniqueArtists = new Set();
    let currentPage = 1;
    const artworksPerPage = 10;

    // Function to fetch artworks and populate artist dropdown
    const fetchArtworks = async () => {
        tableBody.innerHTML = "<tr><td>Loading...</td></tr>";
        let url = `${apiUrl}?limit=100`;

        try {
            const response = await axios.get(url);
            artworks = response.data.data;

            // Extract unique artist names
            artworks.forEach(artwork => {
                if (artwork.artist_display) {
                    uniqueArtists.add(artwork.artist_display);
                }
            });

            populateArtistDropdown();
            renderTable();
        } catch (error) {
            console.error("Error fetching artwork data:", error);
            tableBody.innerHTML = `<tr><td class="text-danger">Failed to load data. Please try again later.</td></tr>`;
        }
    };

    // Function to populate artist dropdown
    const populateArtistDropdown = () => {
        uniqueArtists.forEach(artist => {
            const option = document.createElement("option");
            option.value = artist;
            option.textContent = artist;
            artistFilter.appendChild(option);
        });
    };

    // Function to render the current page of artworks
    const renderTable = () => {
        tableBody.innerHTML = "";
        const start = (currentPage - 1) * artworksPerPage;
        const end = start + artworksPerPage;
        const selectedArtist = artistFilter.value;

        let filteredArtworks = selectedArtist
            ? artworks.filter(artwork => artwork.artist_display === selectedArtist)
            : artworks;

        const currentArtworks = filteredArtworks.slice(start, end);

        if (currentArtworks.length === 0) {
            tableBody.innerHTML = "<tr><td class='text-warning'>No artworks found.</td></tr>";
        } else {
            currentArtworks.forEach(artwork => {
                const row = `<tr>
                    <td>${artwork.title}</td>
                </tr>`;
                tableBody.innerHTML += row;
            });
        }

        // Update pagination controls
        pageInfo.textContent = `Page ${currentPage} of ${Math.ceil(filteredArtworks.length / artworksPerPage)}`;
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = end >= filteredArtworks.length;
    };

    // Event listeners for pagination
    prevPageBtn.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            renderTable();
        }
    });

    nextPageBtn.addEventListener("click", () => {
        if (currentPage < Math.ceil(artworks.length / artworksPerPage)) {
            currentPage++;
            renderTable();
        }
    });

    // Event listener for artist filter change
    artistFilter.addEventListener("change", () => {
        currentPage = 1;
        renderTable();
    });

    // Load artworks initially
    fetchArtworks();
});
