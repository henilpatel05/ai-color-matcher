import { useState } from "react";
import Button from "./components/ui/Button";
import Card from "./components/ui/Card";
import UploadIcon from "./components/ui/UploadIcon";

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
      console.log("API Response:", data); // 🟢 Debugging Log
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
  <div className="flex flex-col items-center p-6 space-y-4">
    <Card>
      {/* File input should be visible via button click */}
      <input id="fileInput" type="file" accept="image/*" onChange={handleImageUpload} hidden />

      {/* Button triggers file input */}
      <Button onClick={triggerFileUpload}>
        <UploadIcon /> <span>Upload Image</span>
      </Button>

      {image && <img src={image} alt="Uploaded" className="mt-4 w-full rounded-lg" />}

      {/* Analyze Button */}
      <Button onClick={analyzeImage} disabled={!image || loading}>
        {loading ? "Analyzing..." : "Analyze Color Match"}
      </Button>
    </Card>

    {suggestedColors && suggestedColors.length > 0 && (
  <div className="mt-4 grid grid-cols-3 gap-2">
   {suggestedColors.length > 0 && (
      <div className="mt-4 grid grid-cols-3 gap-2">
        {suggestedColors.map((color, index) => (
          <div key={index} className="h-16 w-16 rounded-lg" style={{ backgroundColor: color }} />/>
        ))}
      </div>
    )}
  </div>
);
}
