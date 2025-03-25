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
    processingDelay: 1500
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

// Main PDF generation function
async function saveAsPDF() {
    const loadingDiv = showMessage('Preparing PDF... Please wait...');
    let retryCount = 0;

    try {
        console.log("Starting PDF generation process...");
        
        // Create print styles
        const printStyles = document.createElement('style');
        printStyles.textContent = `
            @media print {
                body {
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                }
                * {
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                }
                img {
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                }
                @page {
                    margin: 0;
                    size: auto;
                }
            }
        `;
        document.head.appendChild(printStyles);

        // Wait for styles to apply
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Remove loading message
        removeMessage(loadingDiv);
        
        // Open print dialog
        window.print();
        
        // Remove print styles after printing
        document.head.removeChild(printStyles);
        
        console.log("PDF generation completed!");
        showMessage('PDF generation completed! You can now save the PDF.', 'info');
        
    } catch (error) {
        console.error("Error generating PDF:", error);
        removeMessage(loadingDiv);
        showMessage('Error generating PDF. Please try again.', 'error');
        
        // Retry logic
        if (retryCount < CONFIG.maxRetries) {
            retryCount++;
            console.log(`Retrying... Attempt ${retryCount}/${CONFIG.maxRetries}`);
            setTimeout(saveAsPDF, CONFIG.retryDelay);
        }
    }
}

// Add a floating button to trigger PDF generation
function addPDFButton() {
    try {
        console.log("Creating PDF button...");
        
        // Check if button already exists
        const existingButton = document.getElementById('pdf-download-button');
        if (existingButton) {
            console.log("PDF button already exists, removing old one...");
            existingButton.remove();
        }
        
        const button = document.createElement('button');
        button.id = 'pdf-download-button';
        button.innerHTML = 'Save as PDF';
        button.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 12px 24px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            z-index: 9999;
            font-family: Arial, sans-serif;
            font-size: 14px;
            font-weight: bold;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
        `;
        
        button.onmouseover = () => {
            button.style.background = '#45a049';
            button.style.transform = 'scale(1.05)';
            button.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
        };
        
        button.onmouseout = () => {
            button.style.background = '#4CAF50';
            button.style.transform = 'scale(1)';
            button.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        };
        
        button.onclick = saveAsPDF;
        
        document.body.appendChild(button);
        console.log("PDF button added successfully");
        
    } catch (error) {
        console.error("Error adding PDF button:", error);
        showMessage('Error adding PDF button. Please refresh the page.', 'error');
    }
}

// Function to initialize the PDF functionality
function initializePDFDownloader() {
    try {
        console.log("Initializing PDF downloader...");
        
        // Wait for page to be fully loaded
        if (document.readyState === 'loading') {
            console.log("Document still loading, waiting for DOMContentLoaded...");
            document.addEventListener('DOMContentLoaded', () => {
                console.log("DOMContentLoaded event fired, adding PDF button...");
                addPDFButton();
            });
        } else {
            console.log("Document already loaded, adding PDF button...");
            addPDFButton();
        }
    } catch (error) {
        console.error("Error initializing PDF downloader:", error);
        showMessage('Error initializing PDF downloader. Please refresh the page.', 'error');
    }
}

// Start the initialization
initializePDFDownloader();