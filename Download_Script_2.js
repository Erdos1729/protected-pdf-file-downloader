/*
Created on Tue Sep 4 12:53:35 2020
@author: Erdos1729
*/

// Configuration
const CONFIG = {
    documentName: "Document", // Change this to your desired filename
    maxRetries: 3,
    retryDelay: 1000,
    scrollDelay: 500,
    processingDelay: 1500,
    maxPages: 20,
    scaleFactor: 1.335
};

// Utility functions
function showMessage(message, type = 'info') {
    const div = document.createElement('div');
    div.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: ${type === 'error' ? 'rgba(255, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.8)'};
        color: white;
        padding: 20px;
        border-radius: 10px;
        z-index: 9999;
        font-family: Arial, sans-serif;
        text-align: center;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    `;
    div.innerHTML = message;
    document.body.appendChild(div);
    return div;
}

function removeMessage(div) {
    if (div && div.parentNode) {
        div.parentNode.removeChild(div);
    }
}

// Load jsPDF library
function loadJSPDF() {
    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.5.3/jspdf.debug.js';
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
    });
}

// Main PDF generation function
async function generatePDF() {
    const loadingDiv = showMessage('Preparing PDF... Please wait...');
    let retryCount = 0;

    try {
        console.log("Starting PDF generation process...");
        
        const imgTags = document.getElementsByTagName("img");
        const checkURLString = "blob:https://drive.google.com/";
        let validImgTagCounter = 0;
        let doc = null;

        // Count valid images
        for (let i = 0; i < imgTags.length; i++) {
            if (imgTags[i].src.substring(0, checkURLString.length) === checkURLString) {
                validImgTagCounter++;
            }
        }

        if (validImgTagCounter === 0) {
            throw new Error("No valid images found on the page!");
        }

        if (validImgTagCounter > CONFIG.maxPages) {
            throw new Error(`This document has more than ${CONFIG.maxPages} pages. Please use Download Script 1 instead.`);
        }

        // Process each valid image
        for (let i = 0; i < imgTags.length; i++) {
            if (imgTags[i].src.substring(0, checkURLString.length) === checkURLString) {
                const img = imgTags[i];
                console.log(`Processing image ${i + 1}/${validImgTagCounter}`);

                // Create canvas and draw image
                const canvas = document.createElement('canvas');
                const context = canvas.getContext("2d");
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;
                context.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);
                const imgDataURL = canvas.toDataURL();

                // Determine orientation and dimensions
                const orientation = img.naturalWidth > img.naturalHeight ? "l" : "p";
                const pageWidth = img.naturalWidth * CONFIG.scaleFactor;
                const pageHeight = img.naturalHeight * CONFIG.scaleFactor;

                // Create or add to PDF
                if (!doc) {
                    doc = new jsPDF({
                        orientation: orientation,
                        unit: "px",
                        format: [pageWidth, pageHeight],
                    });
                } else {
                    doc.addPage([pageWidth, pageHeight], orientation);
                }

                doc.addImage(imgDataURL, "PNG", 0, 0, img.naturalWidth, img.naturalHeight);
            }
        }

        // Save the PDF
        const filename = CONFIG.documentName + ".pdf";
        doc.save(filename);
        
        removeMessage(loadingDiv);
        showMessage('PDF generation completed!', 'info');
        console.log("PDF generation completed!");

    } catch (error) {
        console.error("Error generating PDF:", error);
        removeMessage(loadingDiv);
        showMessage(error.message || 'Error generating PDF. Please try again.', 'error');
        
        // Retry logic
        if (retryCount < CONFIG.maxRetries) {
            retryCount++;
            console.log(`Retrying... Attempt ${retryCount}/${CONFIG.maxRetries}`);
            setTimeout(generatePDF, CONFIG.retryDelay);
        }
    }
}

// Scroll handling function
async function handleScroll(chosenElement) {
    const scrollDistance = Math.round(chosenElement.clientHeight / 2);
    let remainingHeightToScroll = chosenElement.scrollHeight;
    let scrollToLocation = 0;
    let loopCounter = 0;

    while (remainingHeightToScroll >= chosenElement.clientHeight) {
        loopCounter++;
        console.log(`Scroll iteration ${loopCounter}`);

        await new Promise(resolve => setTimeout(resolve, CONFIG.scrollDelay));
        
        scrollToLocation += scrollDistance;
        chosenElement.scrollTo(0, scrollToLocation);
        remainingHeightToScroll -= scrollDistance;
    }

    // Final scroll to top
    chosenElement.scrollTo(0, 0);
    
    // Wait for content to settle
    await new Promise(resolve => setTimeout(resolve, CONFIG.processingDelay));
    
    // Generate PDF
    generatePDF();
}

// Initialize the PDF generation process
async function initializePDFGeneration() {
    try {
        console.log("Initializing PDF generation...");
        
        // Load jsPDF library
        await loadJSPDF();
        
        // Find scrollable element
        const allElements = document.querySelectorAll("*");
        let chosenElement = null;
        let heightOfScrollableElement = 0;

        for (let i = 0; i < allElements.length; i++) {
            if (allElements[i].scrollHeight >= allElements[i].clientHeight) {
                if (heightOfScrollableElement < allElements[i].scrollHeight) {
                    heightOfScrollableElement = allElements[i].scrollHeight;
                    chosenElement = allElements[i];
                }
            }
        }

        if (chosenElement && chosenElement.scrollHeight > chosenElement.clientHeight) {
            console.log("Found scrollable element, starting scroll process...");
            await handleScroll(chosenElement);
        } else {
            console.log("No scroll needed, generating PDF directly...");
            await generatePDF();
        }

    } catch (error) {
        console.error("Error initializing PDF generation:", error);
        showMessage('Error initializing PDF generation. Please refresh the page.', 'error');
    }
}

// Start the initialization
initializePDFGeneration();
