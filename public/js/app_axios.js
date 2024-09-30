// Generic function to handle SPA navigation using axios (xhr) and status code is 200 due to headers no cache
function setupSPANavigation() {
    // Select all links with the 'spa-navigate' class
    const links = document.querySelectorAll('a.spa-navigate');

    // Add click event listener to each link
    links.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent the default link behavior

            const url = this.getAttribute('href'); // Get the URL from the href attribute

            // Fetch the new content using Axios (will give 200 instead of 304)
                axios.get(url, {
                    headers: {
                        'Cache-Control': 'no-cache',
                        'Pragma': 'no-cache',
                        'Expires': '0'
                    }
                })
                .then(response => {
                    // Replace the current body content with the new HTML
                    document.body.innerHTML = response.data;

                    // Push the new URL into the browser's history
                    history.pushState(null, '', url);

                    // Re-initialize SPA navigation for the new content
                    setupSPANavigation();

                    // Optionally, log the new URL
                    console.log(`Navigated to: ${url}`);
                })
                .catch(error => {
                    console.error('There has been a problem with your axios operation:', error);
                });
        });
    });
}

// Handle back/forward navigation
window.addEventListener('popstate', function(event) {
    // When the user presses back or forward, fetch the content for the current URL
    axios.get(location.href)
        .then(response => {
            // Replace the current body content with the fetched HTML
            document.body.innerHTML = response.data;

            // Re-initialize SPA navigation for the new content
            setupSPANavigation();
        })
        .catch(error => {
            console.error('There has been a problem with your axios operation:', error);
        });
});

// Call the function to set up SPA navigation
document.addEventListener('DOMContentLoaded', function() {
    setupSPANavigation();
});
