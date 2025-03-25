/*
Created on Tue Sep 4 12:53:35 2020
@author: Erdos1729
*/

// Configuration
const CONFIG = {
    documentName: "Document", // Change this to your desired filename
    maxRetries: 3,
    retryDelay: 1000,
    imageQuality: 0.8
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
        
        const elements = document.getElementsByTagName("img");
        let validImages = 0;
        
        // Count valid images
        for (let i = 0; i < elements.length; i++) {
            if (/^blob:/.test(elements[i].src)) {
                validImages++;
            }
        }

        if (validImages === 0) {
            throw new Error("No valid images found on the page!");
        }

        console.log(`Found ${validImages} valid images`);

        // Create PDF
        const pdf = new jsPDF();
        let pageCount = 0;

        // Process each image
        for (let i = 0; i < elements.length; i++) {
            const img = elements[i];
            
            if (!/^blob:/.test(img.src)) {
                console.log("Skipping invalid image source");
                continue;
            }

            try {
                console.log(`Processing image ${pageCount + 1}/${validImages}`);
                
                // Create canvas and draw image
                const canvas = document.createElement('canvas');
                const context = canvas.getContext("2d");
                canvas.width = img.width;
                canvas.height = img.height;
                context.drawImage(img, 0, 0, img.width, img.height);
                
                // Convert to JPEG with specified quality
                const imgData = canvas.toDataURL("image/jpeg", CONFIG.imageQuality);
                
                // Add to PDF
                if (pageCount > 0) {
                    pdf.addPage();
                }
                
                // Calculate dimensions to fit page
                const pageWidth = pdf.internal.pageSize.getWidth();
                const pageHeight = pdf.internal.pageSize.getHeight();
                const imgWidth = img.width;
                const imgHeight = img.height;
                
                // Calculate scaling to fit page while maintaining aspect ratio
                const scale = Math.min(
                    pageWidth / imgWidth,
                    pageHeight / imgHeight
                );
                
                const scaledWidth = imgWidth * scale;
                const scaledHeight = imgHeight * scale;
                
                // Center the image on the page
                const x = (pageWidth - scaledWidth) / 2;
                const y = (pageHeight - scaledHeight) / 2;
                
                pdf.addImage(imgData, 'JPEG', x, y, scaledWidth, scaledHeight);
                pageCount++;
                
            } catch (imgError) {
                console.error(`Error processing image ${i + 1}:`, imgError);
                continue;
            }
        }

        if (pageCount === 0) {
            throw new Error("No images were successfully processed!");
        }

        // Save the PDF
        const filename = CONFIG.documentName + ".pdf";
        pdf.save(filename);
        
        removeMessage(loadingDiv);
        showMessage(`PDF generation completed! Processed ${pageCount} images.`, 'info');
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

// Initialize the PDF generation process
async function initializePDFGeneration() {
    try {
        console.log("Initializing PDF generation...");
        
        // Load jsPDF library
        await loadJSPDF();
        
        // Generate PDF
        await generatePDF();

    } catch (error) {
        console.error("Error initializing PDF generation:", error);
        showMessage('Error initializing PDF generation. Please refresh the page.', 'error');
    }
}

// Start the initialization
initializePDFGeneration();