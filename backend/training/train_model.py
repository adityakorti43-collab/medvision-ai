from pathlib import Path

import torch
from torch import nn
from torch.utils.data import DataLoader, random_split
from torchvision import datasets, transforms, models


# =========================================================
# 1. SETTINGS
# =========================================================

PROJECT_ROOT = Path(__file__).resolve().parents[2]

DATASET_PATH = PROJECT_ROOT / "dataset" / "chest_xray"
MODEL_PATH = PROJECT_ROOT / "backend" / "models" / "chest_xray_model.pth"

IMAGE_SIZE = 224
BATCH_SIZE = 16
EPOCHS = 5
LEARNING_RATE = 0.0001


# =========================================================
# 2. DEVICE
# =========================================================

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

print("=" * 60)
print("MedVision AI - Chest X-Ray Training")
print("=" * 60)
print("Device:", device)
print("Dataset:", DATASET_PATH)
print("Model:", MODEL_PATH)


# =========================================================
# 3. IMAGE PREPROCESSING
# =========================================================

train_transforms = transforms.Compose([
    transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),

    # X-rays are grayscale.
    # Convert them to 3 channels for EfficientNet.
    transforms.Grayscale(num_output_channels=3),

    # Data augmentation
    transforms.RandomHorizontalFlip(),
    transforms.RandomRotation(10),

    transforms.ToTensor(),

    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])


val_test_transforms = transforms.Compose([
    transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),

    transforms.Grayscale(num_output_channels=3),

    transforms.ToTensor(),

    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])


# =========================================================
# 4. LOAD TRAINING DATA
# =========================================================

full_dataset = datasets.ImageFolder(
    DATASET_PATH / "train",
    transform=train_transforms
)

print("\nClasses:", full_dataset.classes)
print("Total training images:", len(full_dataset))


# =========================================================
# 5. TRAIN / VALIDATION SPLIT
# =========================================================

train_size = int(0.8 * len(full_dataset))
val_size = len(full_dataset) - train_size

train_dataset, val_dataset = random_split(
    full_dataset,
    [train_size, val_size],
    generator=torch.Generator().manual_seed(42)
)

print("Training images:", len(train_dataset))
print("Validation images:", len(val_dataset))


# =========================================================
# 6. HANDLE CLASS IMBALANCE
# =========================================================

train_targets = [
    full_dataset.targets[i]
    for i in train_dataset.indices
]

class_counts = torch.bincount(
    torch.tensor(train_targets)
)

class_weights = 1.0 / class_counts.float()

sample_weights = torch.tensor(
    [class_weights[label] for label in train_targets],
    dtype=torch.float
)

sampler = torch.utils.data.WeightedRandomSampler(
    weights=sample_weights,
    num_samples=len(sample_weights),
    replacement=True
)

print("\nClass counts:", class_counts.tolist())


# =========================================================
# 7. CREATE DATALOADERS
# =========================================================

train_loader = DataLoader(
    train_dataset,
    batch_size=BATCH_SIZE,
    sampler=sampler,
    num_workers=0
)

val_loader = DataLoader(
    val_dataset,
    batch_size=BATCH_SIZE,
    shuffle=False,
    num_workers=0
)

print("Training batches:", len(train_loader))
print("Validation batches:", len(val_loader))


# =========================================================
# 8. LOAD PRETRAINED EFFICIENTNET
# =========================================================

print("\nLoading EfficientNet-B0...")

weights = models.EfficientNet_B0_Weights.DEFAULT

model = models.efficientnet_b0(
    weights=weights
)


# Replace the final classification layer.
# 0 = NORMAL
# 1 = PNEUMONIA

model.classifier[1] = nn.Linear(
    model.classifier[1].in_features,
    2
)

model = model.to(device)

print("EfficientNet-B0 loaded!")


# =========================================================
# 9. LOSS FUNCTION + OPTIMIZER
# =========================================================

criterion = nn.CrossEntropyLoss()

optimizer = torch.optim.Adam(
    model.parameters(),
    lr=LEARNING_RATE
)


# =========================================================
# 10. TRAINING
# =========================================================

best_val_accuracy = 0.0

print("\nStarting training...")
print("=" * 60)


for epoch in range(EPOCHS):

    # -----------------------------------------------------
    # TRAIN
    # -----------------------------------------------------

    model.train()

    running_loss = 0.0
    correct = 0
    total = 0

    for images, labels in train_loader:

        images = images.to(device)
        labels = labels.to(device)

        optimizer.zero_grad()

        outputs = model(images)

        loss = criterion(outputs, labels)

        loss.backward()

        optimizer.step()

        running_loss += loss.item()

        _, predicted = torch.max(outputs, 1)

        total += labels.size(0)

        correct += (predicted == labels).sum().item()

    train_loss = running_loss / len(train_loader)
    train_accuracy = 100 * correct / total


    # -----------------------------------------------------
    # VALIDATION
    # -----------------------------------------------------

    model.eval()

    val_correct = 0
    val_total = 0
    val_loss_total = 0.0

    with torch.no_grad():

        for images, labels in val_loader:

            images = images.to(device)
            labels = labels.to(device)

            outputs = model(images)

            loss = criterion(outputs, labels)

            val_loss_total += loss.item()

            _, predicted = torch.max(outputs, 1)

            val_total += labels.size(0)

            val_correct += (
                predicted == labels
            ).sum().item()

    val_loss = val_loss_total / len(val_loader)

    val_accuracy = 100 * val_correct / val_total


    # -----------------------------------------------------
    # PRINT RESULTS
    # -----------------------------------------------------

    print(
        f"Epoch [{epoch + 1}/{EPOCHS}] "
        f"| Train Loss: {train_loss:.4f} "
        f"| Train Acc: {train_accuracy:.2f}% "
        f"| Val Loss: {val_loss:.4f} "
        f"| Val Acc: {val_accuracy:.2f}%"
    )


    # -----------------------------------------------------
    # SAVE BEST MODEL
    # -----------------------------------------------------

    if val_accuracy > best_val_accuracy:

        best_val_accuracy = val_accuracy

        MODEL_PATH.parent.mkdir(
            parents=True,
            exist_ok=True
        )

        torch.save(
            {
                "model_state_dict": model.state_dict(),
                "classes": full_dataset.classes,
                "image_size": IMAGE_SIZE
            },
            MODEL_PATH
        )

        print("  ✓ Best model saved!")


# =========================================================
# 11. TRAINING COMPLETE
# =========================================================

print("\n" + "=" * 60)
print("Training complete!")
print("Best validation accuracy:", f"{best_val_accuracy:.2f}%")
print("Model saved at:", MODEL_PATH)
print("=" * 60)