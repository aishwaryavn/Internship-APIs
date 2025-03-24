const searchArtwork = async () => {
    const artwork = document.getElementById("artwork").value; // Get the search term (artwork title)
    const apiUrl = `https://api.artic.edu/api/v1/artworks/search?q=${artwork}`; // Artworks API URL

    const resp = await axios(apiUrl); // Fetch data from the API
    console.log(resp.data.id); // Log the response to the console to inspect the structure

    // Check if there's any artwork in the response
    if (resp.data.data.length > 0) {
        // Get the artist name of the first artwork in the response
        const artistName = resp.data[0].artist_title || 'Unknown Artist';

        // Display the artist's name in the designated paragraph
        document.getElementById("artist-name").innerText = `Artist: ${artistName}`;
    } else {
        // If no artworks are found, display a message
        document.getElementById("artist-name").innerText = 'No artwork found.';
    }
};
