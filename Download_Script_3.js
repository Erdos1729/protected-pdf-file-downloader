//
Created on Tue Sep 4 12: 53: 35 2020

@author: Erdos1729
//

let jspdf = document.createElement("script");

jspdf.onload = function () {

    let pdf = new jsPDF();
    let elements = document.getElementsByTagName("img");
    for (let i in elements) {
        let img = elements[i];
        console.log("add img ", img);
        if (!/^blob:/.test(img.src)) {
            console.log("invalid src");
            continue;
        }
        let can = document.createElement('canvas');
        let con = can.getContext("2d");
        can.width = img.width;
        can.height = img.height;
        con.drawImage(img, 0, 0, img.width, img.height);
        let imgData = can.toDataURL("image/jpeg", 1.0);
        pdf.addImage(imgData, 'JPEG', 0, 0);
        pdf.addPage();
    }

    pdf.save("download.pdf");
};

jspdf.src = '<a class="vglnk" href="https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.5.3/jspdf.debug.js" rel="nofollow"><span>https</span><span>://</span><span>cdnjs</span><span>.</span><span>cloudflare</span><span>.</span><span>com</span><span>/</span><span>ajax</span><span>/</span><span>libs</span><span>/</span><span>jspdf</span><span>/</span><span>1</span><span>.</span><span>5</span><span>.</span><span>3</span><span>/</span><span>jspdf</span><span>.</span><span>debug</span><span>.</span><span>js</span></a>';
document.body.appendChild(jspdf);