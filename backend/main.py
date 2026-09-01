from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from pathlib import Path

from prediction import predict_xray
from xray_validator import validate_image

import shutil


# ==========================================
# APP
# ==========================================

app = FastAPI(
    title="MedVision AI"
)


# ==========================================
# CORS
# ==========================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==========================================
# UPLOAD DIRECTORY
# ==========================================

UPLOAD_DIR = (
    Path(__file__).parent
    / "uploads"
)

UPLOAD_DIR.mkdir(
    parents=True,
    exist_ok=True
)


# ==========================================
# HOME
# ==========================================

@app.get("/")
def home():

    return {
        "message":
            "MedVision AI Backend is running!"
    }


# ==========================================
# PREDICT
# ==========================================

@app.post("/predict")
async def predict(
    file: UploadFile = File(...)
):

    # --------------------------------------
    # Check filename
    # --------------------------------------

    if not file.filename:

        raise HTTPException(
            status_code=400,
            detail="No file uploaded"
        )


    # --------------------------------------
    # Check extension
    # --------------------------------------

    allowed_extensions = {
        ".jpg",
        ".jpeg",
        ".png"
    }

    extension = Path(
        file.filename
    ).suffix.lower()


    if extension not in allowed_extensions:

        raise HTTPException(
            status_code=400,
            detail=(
                "Only JPG, JPEG and PNG "
                "images are allowed"
            )
        )


    # --------------------------------------
    # Save upload
    # --------------------------------------

    file_path = (
        UPLOAD_DIR
        / f"uploaded_xray{extension}"
    )


    with file_path.open("wb") as buffer:

        shutil.copyfileobj(
            file.file,
            buffer
        )


    # --------------------------------------
    # Basic image validation
    # --------------------------------------

    validation = validate_image(
        str(file_path)
    )


    if not validation["valid"]:

        raise HTTPException(
            status_code=400,
            detail=validation["message"]
        )


    # --------------------------------------
    # Existing AI prediction
    # --------------------------------------

    result = predict_xray(
        str(file_path)
    )


    # --------------------------------------
    # Response
    # --------------------------------------

    return {

        "message":
            "X-ray analyzed successfully!",

        "filename":
            file.filename,

        "prediction":
            result["prediction"],

        "confidence":
            result["confidence"]
    }
