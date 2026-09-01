from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
from prediction import predict_xray
import shutil


app = FastAPI(title="MedVision AI")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


UPLOAD_DIR = Path(__file__).parent / "uploads"

UPLOAD_DIR.mkdir(
    parents=True,
    exist_ok=True
)


@app.get("/")
def home():
    return {
        "message": "MedVision AI Backend is running!"
    }


@app.post("/predict")
async def predict(file: UploadFile = File(...)):

    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="No file uploaded"
        )

    allowed_extensions = {
        ".jpg",
        ".jpeg",
        ".png"
    }

    extension = Path(file.filename).suffix.lower()

    if extension not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail="Only JPG, JPEG and PNG images are allowed"
        )

    file_path = UPLOAD_DIR / f"uploaded_xray{extension}"

    with file_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    result = predict_xray(str(file_path))

    return {
        "message": "X-ray analyzed successfully!",
        "filename": file.filename,
        "prediction": result["prediction"],
        "confidence": result["confidence"]
    }