// Iteraion no.: 1

// This fetch is without morphdom, and replaces the full html of the page with the new one, then attaches event listeners
// sometimes the page shivers

// Set this to true or false to control the usage of SPA navigation
const useSPANavigation = true;

if (useSPANavigation) {

    // Generic function to handle SPA navigation using fetch and status code is 304
    function setupSPANavigation() {
        // Select all links with the 'spa-navigate' class
        const links = document.querySelectorAll('a.spa-navigate');

        // Add click event listener to each link
        links.forEach(link => {
            link.addEventListener('click', function(event) {
                event.preventDefault(); // Prevent the default link behavior

                const url = this.getAttribute('href'); // Get the URL from the href attribute

                // Fetch the new content
                fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok ' + response.statusText);
                    }
                    return response.text(); // Parse the response as text
                })
                .then(html => {
                    // Replace the current body content with the new HTML
                    document.body.innerHTML = html;

                    // Push the new URL into the browser's history
                    history.pushState(null, '', url);

                    // Re-initialize SPA navigation for the new content
                    setupSPANavigation(); 

                    // Optionally, log the new URL
                    console.log(`Navigated to: ${url}`);
                })
                .catch(error => {
                    console.error('There has been a problem with your fetch operation:', error);
                });
            });
        });
    }

    // Handle back/forward navigation
    window.addEventListener('popstate', function(event) {
        // When the user presses back or forward, fetch the content for the current URL
        fetch(location.href)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.text();
            })
            .then(html => {
                // Replace the current body content with the fetched HTML
                document.body.innerHTML = html;

                // Re-initialize SPA navigation for the new content
                setupSPANavigation();
            })
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
            });
    });

    // Call the function to set up SPA navigation
    document.addEventListener('DOMContentLoaded', function() {
        setupSPANavigation();
    });

}
