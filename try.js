const pdfMake = require("./build/pdfmake");
const pdfFonts = require("./build/vfs_fonts");
const fs = require("fs");
const path = require("path");
const poppler = require("pdf-poppler");

pdfMake.vfs = pdfFonts; // Use built-in fonts

// Convert an image to Base64
function getBase64Image(path) {
    const image = fs.readFileSync(path); // Read image file
    return `data:image/png;base64,${image.toString("base64")}`;
}
  
// Path to your image file (replace with your actual image path)
const imagePath = "image.png";

const docDefinition = {
  pageSize: { width: 300, height: "auto" }, // Set PDF width to ~400px (300pt)
  pageMargins: [20, 20, 20, 20], // Add some margins

  content: [
    { text: "What is Lorem Ipsum?", style: "header" },
    {
      text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      alignment: "justify",
    },

    { text: "Why do we use it?", style: "header", margin: [0, 10, 0, 0] },
    {
      text: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
      alignment: "justify",
    },

    { text: "Where does it come from?", style: "header", margin: [0, 10, 0, 0] },
    {
      text: "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of 'de Finibus Bonorum et Malorum' (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, 'Lorem ipsum dolor sit amet..', comes from a line in section 1.10.32.",
      alignment: "justify",
    },

    { 
        image: getBase64Image(imagePath), // Add image
        width: 260, // Adjust to fit within PDF width
        alignment: "center",
        margin: [0, 0, 0, 10] // Add some spacing below image
      },

    {
      text: "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from 'de Finibus Bonorum et Malorum' by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.",
      alignment: "justify",
    },
  ],

  styles: {
    header: { fontSize: 14, bold: true },
  },
};

// Generate the PDF into a temp file first
const pdfFile = "JustifiedText.pdf";
pdfMake.createPdf(docDefinition).getBuffer((buffer) => {
  fs.writeFileSync(pdfFile, buffer);
  console.log("✅ PDF Created:", pdfFile);

  // Convert PDF to PNG
  convertPdfToPng(pdfFile);
});

// Convert PDF to PNG
function convertPdfToPng(pdfFilePath) {
  let options = {
    format: "png",
    out_dir: path.dirname(pdfFilePath),
    out_prefix: "output",
    page: 1, // Convert only first page
  };

  poppler.convert(pdfFilePath, options)
    .then(() => console.log("✅ PNG Image Created"))
    .catch(err => console.error("❌ Error converting PDF to PNG:", err));
}
