# Protected PDF Files Downloader

A powerful tool to download protected PDF files from Google Drive and other websites with multiple methods to suit different needs.

## Features

* Multiple download methods for different scenarios
* High-quality PDF output
* Automatic page size and orientation adjustment
* Efficient CPU and RAM usage
* Automatic fast scrolling for correct page loading
* Cross-platform support (Windows, Linux)
* Progress tracking and error handling
* User-friendly interface with status messages

## Download Methods

### Method 1: High-Quality PDF Generation (Recommended)
Best for all scenarios, especially documents with many pages.

1. Download this repository and unzip it
2. Open the protected PDF in your browser (Chrome, Firefox, etc.)
3. Open the browser's developer console (F12 or right-click -> Inspect -> Console)
4. Copy the contents of `Download_Script_1.js` and paste into the console
5. Press Enter to run the script
6. Wait for the browser to prompt you to save a `.PDF_DataFile`
7. Save the file and copy it to the `Input` directory in the repository
8. Run the appropriate generator:
   - Windows: Double-click `Generate_PDF/Windows/GeneratePDF.cmd`
   - Linux: Execute `Generate_PDF/Linux/GeneratePDF`
9. Check the `Output` directory for your PDF

### Method 2: Quick PDF Generation
Best for documents with less than 20 pages.

1. Open the protected PDF in your browser
2. Open the browser's developer console
3. Copy the contents of `Download_Script_2.js` and paste into the console
4. Press Enter to run the script
5. Wait for the PDF to download automatically

### Method 3: Fast PDF Generation
Best for quick downloads when quality is not critical.

1. Open the protected PDF in your browser
2. Open the browser's developer console
3. Copy the contents of `Download_Script_3.js` and paste into the console
4. Press Enter to run the script
5. Wait for the PDF to download automatically

## Customization

### Changing the Output Filename
In any of the download scripts, change the `documentName` variable:

```javascript
const CONFIG = {
    documentName: "Your_Custom_Name", // Change this to your desired filename
    // ... other settings ...
};
```

### Quality Settings
* Method 1: Uses browser's print functionality for highest quality
* Method 2: Optimized for documents up to 20 pages
* Method 3: Fastest but lower quality output

## Tips

1. **For Better Quality**:
   - Method 1: Zoom in your browser (200-300%) before running the script
   - Method 2: Zoom in your browser (130-150%) before running the script
   - Method 3: Best for quick previews or when quality isn't critical

2. **File Organization**:
   - Output directory contains individual PDF directories
   - Each PDF directory contains a "Pages" folder with individual page images
   - Method 1 supports bulk PDF generation by placing multiple `.PDF_DataFile` in the Input directory

3. **Troubleshooting**:
   - If a PDF directory already exists, you'll be prompted to delete it
   - Press 'Y' to overwrite or 'N' to skip that specific file
   - Check the console for detailed progress and error messages
   - If you encounter issues, try refreshing the page and running the script again

## Dependencies

* Method 1: Uses [ImageMagick](https://github.com/ImageMagick/ImageMagick/) for PDF generation
* Method 2 & 3: Use [jsPDF](https://github.com/MrRio/jsPDF) for PDF generation

## Author

* **Erdos1729** - [Gmail](mailto:scytherdragon004@gmail.com)
  Feel free to contact for projects or support.

## License

This project is open source and available under the MIT License.