// Configuration flags
const useNProgress = false; // Set to true to use NProgress, false to disable
const useTimer = true; // Set to true to enable timing logs, false to disable
const contentElement = document.querySelector('.content');


// Before adding new event listeners, remove old ones
const removeEventListeners = () => {
    removeEventListeners();  // Clean up before adding new ones
    document.querySelectorAll('a.spa-navigate').forEach(link => {
        link.removeEventListener('click', handleNavigation);
    });
};


// Generic function to handle SPA navigation using axios
function setupSPANavigation() {
    // Select all links with the 'spa-navigate' class
    const links = document.querySelectorAll('a.spa-navigate');

    // Add click event listener to each link
    links.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent the default link behavior

            const url = this.getAttribute('href'); // Get the URL from the href attribute
            
            // Clear the console before logging new messages
            if (useTimer) {
                console.clear();
            }

            // Start timing if useTimer is true
            let startTime;
            if (useTimer) {
                startTime = performance.now();
            }

            // Start NProgress if useNProgress is true
            if (useNProgress) {
                NProgress.start();
            }

            // Fetch the new content using Axios
            // axios.get(url, {
            //     headers: {
            //         'Cache-Control': 'no-cache',
            //         'Pragma': 'no-cache',
            //         'Expires': '0'
            //     }
            // })
            // Fetch JSON data instead of the full HTML
            axios.get(url, {
                headers: {
                    'Accept': 'application/json' // Indicate you're expecting JSON
                }
            })
            .then(response => {
                // Calculate the time taken to fetch the response if useTimer is true
                if (useTimer) {
                    const fetchTime = performance.now() - startTime;
                    console.log(`Fetched ${url} in ${fetchTime.toFixed(2)} milliseconds`);
                }

                // Start timing for DOM update if useTimer is true
                let domUpdateStartTime;
                if (useTimer) {
                    domUpdateStartTime = performance.now();
                }

                // Replace the current body content with the new HTML
                // document.body.innerHTML = response.data;

                // Create a temporary element to parse the response HTML
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = response.data;

                // Select the content you want to inject (assuming your content area has a class of 'content')
                const newContent = tempDiv.querySelector('.content').innerHTML;

                // Replace the existing content with the new HTML
                contentElement.innerHTML = newContent;

                // Calculate the time taken to update the DOM if useTimer is true
                if (useTimer) {
                    const domUpdateTime = performance.now() - domUpdateStartTime;
                    console.log(`Updated DOM in ${domUpdateTime.toFixed(2)} milliseconds`);
                }

                // Push the new URL into the browser's history
                history.pushState(null, '', url);

                // Re-initialize SPA navigation for the new content
                // setupSPANavigation();

                // Optionally, log the new URL
                console.log(`Navigated to: ${url}`);
            })
            .catch(error => {
                console.error('There has been a problem with your axios operation:', error);
            })
            .finally(() => {
                // Complete NProgress after the request is finished (whether successful or not) if useNProgress is true
                if (useNProgress) {
                    NProgress.done();
                }
            });
        });
    });
}



// Handle back/forward navigation
window.addEventListener('popstate', function(event) {
    // Clear the console before logging new messages if useTimer is true
    if (useTimer) {
        console.clear();
    }

    // Start timing for fetching the current URL if useTimer is true
    let startTime;
    if (useTimer) {
        startTime = performance.now();
    }

    // Start NProgress if useNProgress is true
    if (useNProgress) {
        NProgress.start();
    }

    // When the user presses back or forward, fetch the content for the current URL
    axios.get(location.href)
        .then(response => {
            // Calculate the time taken to fetch the response if useTimer is true
            if (useTimer) {
                const fetchTime = performance.now() - startTime;
                console.log(`Fetched ${location.href} in ${fetchTime.toFixed(2)} milliseconds`);
            }

            // Start timing for DOM update if useTimer is true
            let domUpdateStartTime;
            if (useTimer) {
                domUpdateStartTime = performance.now();
            }

            // Replace the current body content with the fetched HTML
            document.body.innerHTML = response.data;

            // Calculate the time taken to update the DOM if useTimer is true
            if (useTimer) {
                const domUpdateTime = performance.now() - domUpdateStartTime;
                console.log(`Updated DOM in ${domUpdateTime.toFixed(2)} milliseconds`);
            }

            // Re-initialize SPA navigation for the new content
            // setupSPANavigation();
        })
        .catch(error => {
            console.error('There has been a problem with your axios operation:', error);
        })
        .finally(() => {
            // Complete NProgress after the request is finished (whether successful or not) if useNProgress is true
            if (useNProgress) {
                NProgress.done();
            }
        });
});

// Call the function to set up SPA navigation
document.addEventListener('DOMContentLoaded', function() {
    setupSPANavigation();
});
