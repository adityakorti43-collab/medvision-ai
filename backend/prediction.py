from pathlib import Path

import torch
from torch import nn
from torchvision import models, transforms
from PIL import Image, UnidentifiedImageError


# ==========================================
# SETTINGS
# ==========================================

BASE_DIR = Path(__file__).resolve().parent

MODEL_PATH = BASE_DIR / "models" / "chest_xray_model.pth"

IMAGE_SIZE = 224

CLASS_NAMES = [
    "NORMAL",
    "PNEUMONIA"
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

    transforms.Grayscale(num_output_channels=3),

    transforms.ToTensor(),

    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])


# ==========================================
# MODEL
# ==========================================

model = None


def load_model():

    global model

    if model is not None:
        return model

    print("Loading chest X-ray model...")

    model = models.efficientnet_b0(
        weights=None
    )

    model.classifier[1] = nn.Linear(
        model.classifier[1].in_features,
        2
    )

    checkpoint = torch.load(
        MODEL_PATH,
        map_location=device
    )

    model.load_state_dict(
        checkpoint["model_state_dict"]
    )

    model = model.to(device)

    model.eval()

    print("Chest X-ray model loaded successfully.")

    return model


# ==========================================
# PREDICT
# ==========================================

def predict_xray(image_path: str):

    # --------------------------------------
    # Load model only when prediction
    # is actually requested
    # --------------------------------------

    current_model = load_model()

    # --------------------------------------
    # Validate image file
    # --------------------------------------

    try:

        image = Image.open(image_path)

        image.verify()

    except (UnidentifiedImageError, OSError):

        raise ValueError(
            "Invalid image file. Please upload a valid chest X-ray."
        )

    # Re-open after verify()
    image = Image.open(image_path)

    # --------------------------------------
    # Basic size validation
    # --------------------------------------

    if (
        image.width < MIN_IMAGE_WIDTH
        or image.height < MIN_IMAGE_HEIGHT
    ):

        raise ValueError(
            "Image is too small. Please upload a chest X-ray image."
        )

    # --------------------------------------
    # Preprocess
    # --------------------------------------

    image = transform(image)

    image = image.unsqueeze(0)

    image = image.to(device)

    # --------------------------------------
    # Prediction
    # --------------------------------------

    with torch.no_grad():

        outputs = current_model(image)

        probabilities = torch.softmax(
            outputs,
            dim=1
        )

        confidence, predicted = torch.max(
            probabilities,
            dim=1
        )

    # --------------------------------------
    # Result
    # --------------------------------------

    predicted_class = CLASS_NAMES[
        predicted.item()
    ]

    confidence_percentage = (
        confidence.item() * 100
    )

    return {
        "prediction": predicted_class,
        "confidence": round(
            confidence_percentage,
            2
        )
    }