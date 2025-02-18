import { useState } from "react";
import Button from "./components/ui/Button";
import Card from "./components/ui/Card";
import UploadIcon from "./components/ui/UploadIcon";
import "./index.css";

const API_URL = "https://ai-color-matcher.onrender.com/analyze";

const triggerFileUpload = () => {
  document.getElementById("fileInput").click();
};

export default function ColorMatchApp() {
  const [image, setImage] = useState(null);
  const [suggestedColors, setSuggestedColors] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!image) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", dataURItoBlob(image));
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setSuggestedColors(data.colors);
    } catch (error) {
      console.error("Error analyzing image:", error);
    }
    setLoading(false);
  };

  function dataURItoBlob(dataURI) {
    let byteString = atob(dataURI.split(",")[1]);
    let mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    let ab = new ArrayBuffer(byteString.length);
    let ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }

  return (
    <div className="app-container">
      <div className="header">
        <h1>AI Color Matcher</h1>
        <p>Upload an image, and our AI will suggest the best matching colors for your outfit.</p>
      </div>
      <Card>
        <input id="fileInput" type="file" accept="image/*" onChange={handleImageUpload} hidden />
        <Button onClick={triggerFileUpload}>
          <UploadIcon /> Upload Image
        </Button>
        {image && <img src={image} alt="Uploaded" className="uploaded-image" />}
        {/* <Button onClick={analyzeImage} disabled={!image || loading}>
          {loading ? "Analyzing..." : "Analyze Color Match"}
        </Button> */}
        <Button
          className={`analyze-btn ${image ? "active" : ""}`}
          onClick={analyzeImage}
          disabled={!image || loading}
        >
          {loading ? (
            <span className="analyzing">
              <div className="loader"></div> Analyzing...
            </span>
          ) : (
            "Analyze Color Match"
          )}
        </Button>

      </Card>
      {suggestedColors.length > 0 && (
        <div className="color-results">
          {suggestedColors.map((color, index) => (
            <div key={index} className="color-box" style={{ backgroundColor: color }}>
              <span>{color}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
