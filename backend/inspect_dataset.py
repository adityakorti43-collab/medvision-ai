from pathlib import Path
from PIL import Image


# Dataset location
dataset_path = Path("../dataset/chest_xray")

normal_path = dataset_path / "train" / "NORMAL"
pneumonia_path = dataset_path / "train" / "PNEUMONIA"


# Get image files
normal_images = list(normal_path.glob("*"))
pneumonia_images = list(pneumonia_path.glob("*"))


print("NORMAL images:", len(normal_images))
print("PNEUMONIA images:", len(pneumonia_images))


# Inspect first Normal image
normal_image = Image.open(normal_images[0])

print("\nFirst NORMAL image:")
print("Format:", normal_image.format)
print("Size:", normal_image.size)
print("Mode:", normal_image.mode)


# Inspect first Pneumonia image
pneumonia_image = Image.open(pneumonia_images[0])

print("\nFirst PNEUMONIA image:")
print("Format:", pneumonia_image.format)
print("Size:", pneumonia_image.size)
print("Mode:", pneumonia_image.mode)