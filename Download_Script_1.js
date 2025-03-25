/*
Created on Tue Sep 4 12:53:35 2020
@author: Erdos1729
*/

function saveAsPDF() {
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
            }
        `;
        document.head.appendChild(printStyles);

        // Show loading message
        const loadingDiv = document.createElement('div');
        loadingDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 20px;
            border-radius: 10px;
            z-index: 9999;
            font-family: Arial, sans-serif;
        `;
        loadingDiv.innerHTML = 'Preparing PDF... Please wait...';
        document.body.appendChild(loadingDiv);

        // Wait a bit for styles to apply
        setTimeout(() => {
            // Remove loading message
            document.body.removeChild(loadingDiv);
            
            // Open print dialog
            window.print();
            
            // Remove print styles after printing
            document.head.removeChild(printStyles);
            
            console.log("PDF generation completed!");
        }, 1000);
        
    } catch (error) {
        console.error("Error generating PDF:", error);
        
        // Show error message
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 0, 0, 0.8);
            color: white;
            padding: 20px;
            border-radius: 10px;
            z-index: 9999;
            font-family: Arial, sans-serif;
        `;
        errorDiv.innerHTML = 'Error generating PDF. Please try again.';
        document.body.appendChild(errorDiv);
        
        // Remove error message after 3 seconds
        setTimeout(() => {
            document.body.removeChild(errorDiv);
        }, 3000);
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
            padding: 10px 20px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            z-index: 9999;
            font-family: Arial, sans-serif;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
        `;
        
        button.onmouseover = () => {
            button.style.background = '#45a049';
            button.style.transform = 'scale(1.05)';
        };
        
        button.onmouseout = () => {
            button.style.background = '#4CAF50';
            button.style.transform = 'scale(1)';
        };
        
        button.onclick = saveAsPDF;
        
        document.body.appendChild(button);
        console.log("PDF button added successfully");
        
    } catch (error) {
        console.error("Error adding PDF button:", error);
    }
}

// Function to initialize the PDF functionality
function initializePDFDownloader() {
    try {
        console.log("Initializing PDF downloader...");
        
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
    }
}

// Start the initialization
initializePDFDownloader();