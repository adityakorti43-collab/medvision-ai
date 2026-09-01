from pathlib import Path

import torch
from torch import nn
from torchvision import models, transforms
from PIL import Image, UnidentifiedImageError


# ==========================================
# SETTINGS
# ==========================================

BASE_DIR = Path(__file__).resolve().parent

MODEL_PATH = BASE_DIR / "models" / "xray_validator.pth"

IMAGE_SIZE = 224

CLASS_NAMES = [
    "NON_XRAY",
    "XRAY"
]

MIN_IMAGE_WIDTH = 100
MIN_IMAGE_HEIGHT = 100


# ==========================================
# DEVICE
# ==========================================

device = torch.device(
    "cuda" if torch.cuda.is_available() else "cpu"
)


# ==========================================
# IMAGE PREPROCESSING
# ==========================================

transform = transforms.Compose([
    transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),

    transforms.ToTensor(),

    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])


# ==========================================
# LOAD VALIDATOR MODEL
# ==========================================

model = models.efficientnet_b0(
    weights=None
)

model.classifier[1] = nn.Linear(
    model.classifier[1].in_features,
    2
)


# ==========================================
# LOAD TRAINED WEIGHTS
# ==========================================

checkpoint = torch.load(
    MODEL_PATH,
    map_location=device
)

model.load_state_dict(
    checkpoint["model_state_dict"]
)

model = model.to(device)

model.eval()


# ==========================================
# VALIDATE IMAGE
# ==========================================

def validate_image(image_path: str):

    # --------------------------------------
    # Check file exists
    # --------------------------------------

    path = Path(image_path)

    if not path.exists():
        return {
            "valid": False,
            "message": "Image file was not found."
        }


    # --------------------------------------
    # Open image
    # --------------------------------------

    try:
        image = Image.open(image_path)

        image.verify()

    except (UnidentifiedImageError, OSError):

        return {
            "valid": False,
            "message": "The uploaded file is not a valid image."
        }


    # Re-open after verify()
    image = Image.open(image_path)


    # --------------------------------------
    # Basic size validation
    # --------------------------------------

    if (
        image.width < MIN_IMAGE_WIDTH
        or image.height < MIN_IMAGE_HEIGHT
    ):

        return {
            "valid": False,
            "message": "The uploaded image is too small."
        }


    # --------------------------------------
    # Prepare image
    # --------------------------------------

    image = image.convert("RGB")

    image = transform(image)

    image = image.unsqueeze(0)

    image = image.to(device)


    # --------------------------------------
    # AI validation
    # --------------------------------------

    with torch.no_grad():

        outputs = model(image)

        probabilities = torch.softmax(
            outputs,
            dim=1
        )

        confidence, predicted = torch.max(
            probabilities,
            dim=1
        )


    # --------------------------------------
    # Get result
    # --------------------------------------

    predicted_class = CLASS_NAMES[
        predicted.item()
    ]

    confidence_percentage = (
        confidence.item() * 100
    )


    # --------------------------------------
    # NON-XRAY
    # --------------------------------------

    if predicted_class == "NON_XRAY":

        return {
            "valid": False,
            "message": "This doesn't appear to be a chest X-ray. Please upload a chest X-ray image.",
            "confidence": round(
                confidence_percentage,
                2
            )
        }


    # --------------------------------------
    # XRAY
    # --------------------------------------

    return {
        "valid": True,
        "message": "Chest X-ray detected.",
        "confidence": round(
            confidence_percentage,
            2
        )
    }