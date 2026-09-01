from pathlib import Path

import torch
from torch.utils.data import DataLoader
from torchvision import datasets, transforms, models

from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix
)


# ==========================================
# PATHS
# ==========================================

PROJECT_ROOT = Path(__file__).resolve().parents[1]

DATASET_DIR = PROJECT_ROOT / "dataset" / "chest_xray"
TEST_DIR = DATASET_DIR / "test"

MODEL_PATH = Path(__file__).parent / "models" / "chest_xray_model.pth"


# ==========================================
# SETTINGS
# ==========================================

IMAGE_SIZE = 224
BATCH_SIZE = 16

CLASS_NAMES = [
    "NORMAL",
    "PNEUMONIA"
]


# ==========================================
# DEVICE
# ==========================================

device = torch.device(
    "cuda" if torch.cuda.is_available() else "cpu"
)

print("Device:", device)


# ==========================================
# IMAGE TRANSFORMS
# ==========================================

test_transforms = transforms.Compose([
    transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),
    transforms.Grayscale(num_output_channels=3),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])


# ==========================================
# TEST DATASET
# ==========================================

test_dataset = datasets.ImageFolder(
    TEST_DIR,
    transform=test_transforms
)

test_loader = DataLoader(
    test_dataset,
    batch_size=BATCH_SIZE,
    shuffle=False
)

print("Test images:", len(test_dataset))
print("Classes:", test_dataset.classes)


# ==========================================
# LOAD EFFICIENTNET-B0
# ==========================================

print("\nLoading EfficientNet-B0...")

model = models.efficientnet_b0(weights=None)

model.classifier[1] = torch.nn.Linear(
    model.classifier[1].in_features,
    2
)


# ==========================================
# LOAD TRAINED MODEL
# ==========================================

print("Loading trained model...")

checkpoint = torch.load(
    MODEL_PATH,
    map_location=device
)

# The saved model contains multiple things:
# model_state_dict, classes, image_size
# We only need the model weights here.

model.load_state_dict(
    checkpoint["model_state_dict"]
)

model = model.to(device)

model.eval()

print("Model loaded successfully!")


# ==========================================
# PREDICTION
# ==========================================

all_predictions = []
all_labels = []

print("\nEvaluating test dataset...")
print("=" * 60)


with torch.no_grad():

    for images, labels in test_loader:

        images = images.to(device)
        labels = labels.to(device)

        outputs = model(images)

        predictions = torch.argmax(
            outputs,
            dim=1
        )

        all_predictions.extend(
            predictions.cpu().numpy()
        )

        all_labels.extend(
            labels.cpu().numpy()
        )


# ==========================================
# ACCURACY
# ==========================================

accuracy = accuracy_score(
    all_labels,
    all_predictions
)


print("\nTEST RESULTS")
print("=" * 60)

print(
    f"Test Accuracy: {accuracy * 100:.2f}%"
)


# ==========================================
# CLASSIFICATION REPORT
# ==========================================

print("\nClassification Report:")
print(
    classification_report(
        all_labels,
        all_predictions,
        target_names=CLASS_NAMES,
        digits=4
    )
)


# ==========================================
# CONFUSION MATRIX
# ==========================================

cm = confusion_matrix(
    all_labels,
    all_predictions
)

print("\nConfusion Matrix:")
print(cm)


# ==========================================
# COMPLETE
# ==========================================

print("\nEvaluation complete!")
print("=" * 60)