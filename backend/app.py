from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

import shutil
import os

from predict import predict

app = FastAPI(
    title="Crop Anomaly Detection API",
    version="1.0.0",
    description="YOLO-powered crop pest and disease detection API"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_FOLDER = "uploads"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs("results", exist_ok=True)

# Serve annotated images
app.mount(
    "/results",
    StaticFiles(directory="results"),
    name="results"
)


@app.get("/")
def home():
    return {
        "status": "Running",
        "project": "Crop Anomaly Detection Platform",
        "version": "1.0.0"
    }


@app.post("/predict")
async def detect(file: UploadFile = File(...)):

    filepath = os.path.join(
        UPLOAD_FOLDER,
        file.filename
    )

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    detections, result_path = predict(filepath)

    return {
        "success": True,
        "total_detections": len(detections),
        "detections": detections,
        "annotated_image": f"http://127.0.0.1:8000/{result_path}"
    }