import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload } from "lucide-react";

const API_URL = "https://ai-color-matcher.onrender.com/analyze";

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
    <div className="flex flex-col items-center p-6 space-y-4">
      <Card className="w-full max-w-md p-4 text-center">
        <CardContent className="flex flex-col items-center">
          <label className="cursor-pointer flex flex-col items-center">
            <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
            <Button variant="outline" className="flex items-center space-x-2">
              <Upload /> <span>Upload Image</span>
            </Button>
          </label>
          {image && <img src={image} alt="Uploaded" className="mt-4 w-full rounded-lg" />}
          <Button className="mt-4 w-full bg-blue-500 text-white" onClick={analyzeImage} disabled={!image || loading}>
            {loading ? "Analyzing..." : "Analyze Color Match"}
          </Button>
        </CardContent>
      </Card>
      {suggestedColors.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-2">
          {suggestedColors.map((color, index) => (
            <div key={index} className="h-16 w-16 rounded-lg" style={{ backgroundColor: color }} />
          ))}
        </div>
      )}
    </div>
  );
}
