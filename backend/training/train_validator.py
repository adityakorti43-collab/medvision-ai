import torch
import torch.nn as nn
from torchvision import models, transforms
from torchvision.datasets import ImageFolder
from torch.utils.data import DataLoader, random_split
from pathlib import Path


# ==========================================
# PATHS
# ==========================================

BASE_DIR = Path(__file__).resolve().parents[2]

DATA_DIR = (
    BASE_DIR
    / "dataset"
    / "chest_xray"
    / "validator"
)

MODEL_DIR = (
    BASE_DIR
    / "backend"
    / "models"
)

MODEL_DIR.mkdir(
    parents=True,
    exist_ok=True
)


# ==========================================
# SETTINGS
# ==========================================

IMAGE_SIZE = 224
BATCH_SIZE = 16
EPOCHS = 5

DEVICE = (
    "cuda"
    if torch.cuda.is_available()
    else "cpu"
)


print("Device:", DEVICE)
print("Dataset:", DATA_DIR)


# ==========================================
# TRANSFORMS
# ==========================================

transform = transforms.Compose([
    transforms.Resize(
        (IMAGE_SIZE, IMAGE_SIZE)
    ),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])


# ==========================================
# DATASET
# ==========================================

dataset = ImageFolder(
    DATA_DIR,
    transform=transform
)

print(
    "Classes:",
    dataset.classes
)

print(
    "Total images:",
    len(dataset)
)


# ==========================================
# TRAIN / VALIDATION SPLIT
# ==========================================

train_size = int(
    0.8 * len(dataset)
)

val_size = (
    len(dataset) - train_size
)

train_dataset, val_dataset = random_split(
    dataset,
    [train_size, val_size],
    generator=torch.Generator().manual_seed(42)
)


train_loader = DataLoader(
    train_dataset,
    batch_size=BATCH_SIZE,
    shuffle=True
)

val_loader = DataLoader(
    val_dataset,
    batch_size=BATCH_SIZE,
    shuffle=False
)


# ==========================================
# MODEL
# ==========================================

print("Loading EfficientNet...")

model = models.efficientnet_b0(
    weights="DEFAULT"
)

model.classifier[1] = nn.Linear(
    model.classifier[1].in_features,
    2
)

model = model.to(DEVICE)


# ==========================================
# LOSS + OPTIMIZER
# ==========================================

criterion = nn.CrossEntropyLoss()

optimizer = torch.optim.Adam(
    model.parameters(),
    lr=0.0001
)


# ==========================================
# TRAINING
# ==========================================

for epoch in range(EPOCHS):

    model.train()

    running_loss = 0

    correct = 0
    total = 0

    for images, labels in train_loader:

        images = images.to(DEVICE)
        labels = labels.to(DEVICE)

        optimizer.zero_grad()

        outputs = model(images)

        loss = criterion(
            outputs,
            labels
        )

        loss.backward()

        optimizer.step()

        running_loss += loss.item()

        _, predicted = torch.max(
            outputs,
            1
        )

        total += labels.size(0)

        correct += (
            predicted == labels
        ).sum().item()

    train_accuracy = (
        correct / total
    ) * 100


    # ======================================
    # VALIDATION
    # ======================================

    model.eval()

    val_correct = 0
    val_total = 0

    with torch.no_grad():

        for images, labels in val_loader:

            images = images.to(DEVICE)
            labels = labels.to(DEVICE)

            outputs = model(images)

            _, predicted = torch.max(
                outputs,
                1
            )

            val_total += labels.size(0)

            val_correct += (
                predicted == labels
            ).sum().item()


    val_accuracy = (
        val_correct / val_total
    ) * 100


    print(
        f"Epoch {epoch + 1}/{EPOCHS} "
        f"| Loss: {running_loss / len(train_loader):.4f} "
        f"| Train Acc: {train_accuracy:.2f}% "
        f"| Val Acc: {val_accuracy:.2f}%"
    )


# ==========================================
# SAVE MODEL
# ==========================================

MODEL_PATH = (
    MODEL_DIR
    / "xray_validator.pth"
)

torch.save(
    {
        "model_state_dict":
            model.state_dict(),

        "classes":
            dataset.classes
    },
    MODEL_PATH
)


print()
print("===================================")
print("VALIDATOR TRAINING COMPLETE")
print("===================================")
print(
    "Saved:",
    MODEL_PATH
)