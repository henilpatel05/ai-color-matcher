
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors 
import CORSMiddleware
import uvicorn
import os
import numpy as np
import cv2
import io
from sklearn.cluster import KMeans
from typing import List


app = FastAPI()

# Allow frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to your frontend URL for security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def extract_dominant_colors(image_bytes: bytes, num_colors: int = 3) -> List[str]:
    # Convert image bytes to NumPy array
    image = np.frombuffer(image_bytes, np.uint8)
    image = cv2.imdecode(image, cv2.IMREAD_COLOR)
    
    # Convert image to RGB and reshape
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    image = image.reshape((-1, 3))
    
    # Use K-Means clustering to find dominant colors
    kmeans = KMeans(n_clusters=num_colors, n_init=10)
    kmeans.fit(image)
    colors = kmeans.cluster_centers_.astype(int)
    
    # Convert colors to HEX format
    hex_colors = ['#{:02x}{:02x}{:02x}'.format(*color) for color in colors]
    return hex_colors

@app.post("/analyze")
async def analyze_image(file: UploadFile = File(...)):
    image_bytes = await file.read()
    dominant_colors = extract_dominant_colors(image_bytes)
    return {"colors": dominant_colors}

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
