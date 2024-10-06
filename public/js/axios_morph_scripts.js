// Iteraion no.: 7
// This also re-initializes scripts on the fetched page

import morphdom from 'https://cdn.skypack.dev/morphdom';

// const morphdom = require('https://cdn.skypack.dev/morphdom');

function handleNavigation(event) {
    const link = event.target.closest('a.spa-navigate');
    if (!link) return;

    event.preventDefault();
    const url = link.getAttribute('href');
    fetchURL(url, true);
}

function fetchURL(url, updateHistory = false) {
    axios
        .get(url, {
            headers: {
                'Accept': 'text/html',
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache',
                'Expires': '0',
                'Content-Type': 'application/json',
            },
        })
        .then((response) => {
            const doc = parseHTML(response.data);
            // const extractedScripts = extractAndRemoveScripts(doc);
            updatePageContent(doc);
            // reExecuteScripts(extractedScripts);  // Re-run any extracted scripts
            if (updateHistory) {
                updatePushState(url);
            }
        })
        .catch(handleError);
}

function parseHTML(htmlString) {
    const parser = new DOMParser();
    return parser.parseFromString(htmlString, 'text/html');
}

// This function extracts all <script> tags from the fetched HTML 
// before the DOM is updated, and removes them to avoid interference with morphdom
// function extractAndRemoveScripts(doc) {
//     const scripts = Array.from(doc.querySelectorAll('script'));

//     scripts.forEach((script, index) => {
//         // Skip the script with the specified src, must exclude otherwise you will get errors or import cannot be used outside module
//         if (script.src.includes('http://localhost:5000/js/axios_morph_scripts.js')) {
//             return;
//         }
//         script.remove(); // Remove the script tag from the document
//     });

//     return scripts;
// }

function updatePageContent(newDoc) {
    morphdom(document.documentElement, newDoc.documentElement, {
        childrenOnly: true, // Only replace the inner content of <html>
    });
}

//  After the DOM update, the scripts that were extracted are reinserted into the document 
// and re-executed. If the script tag has a src, it's treated as an external script; 
// otherwise, it's treated as an inline script.
// function reExecuteScripts(scripts) {
//     scripts.forEach(script => {
//         const newScript = document.createElement('script');
//         if (script.src) {
//             // If it's an external script, re-append it with the src attribute
//             newScript.src = script.src;
//         } else {
//             // If it's an inline script, set the text content
//             newScript.textContent = script.textContent;
//         }
//         document.body.appendChild(newScript); // Add to the document to execute
//     });
// }

function updatePushState(url) {
    history.pushState(null, '', url);
}

function handleError(error) {
    console.error('Error during navigation:', error);
}

function handlePopState() {
    fetchURL(location.href);
}

// Attach event listener to the document for handling clicks
document.addEventListener('click', handleNavigation);

// Handle browser back/forward button navigation
window.addEventListener('popstate', handlePopState);
