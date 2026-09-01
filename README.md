# 🩻 MedVision AI

### AI-Powered Chest X-Ray Screening

MedVision AI is a deep-learning web application that analyzes chest X-ray images and predicts whether the image is **NORMAL** or shows signs of **PNEUMONIA**.

The project combines a modern React frontend, a FastAPI backend, and an EfficientNet-B0 deep-learning model to create an end-to-end medical imaging demonstration.

> **Disclaimer:** MedVision AI is an educational/project demonstration and is not a medical diagnostic tool. Its predictions should not be used for medical decisions.

---

## ✨ Features

* 🩻 Upload chest X-ray images
* 🤖 AI-based pneumonia classification
* 📊 Prediction confidence score
* ⚡ FastAPI backend for image processing
* 🧠 EfficientNet-B0 deep-learning model
* 🎨 Clean and minimal user interface
* 🔗 React frontend connected to a real prediction API
* 📱 Designed for a simple, user-friendly workflow

---

## 🔬 How It Works

```text
User uploads X-ray
        ↓
React Frontend
        ↓
FastAPI Backend
        ↓
Image Preprocessing
        ↓
EfficientNet-B0
        ↓
NORMAL / PNEUMONIA
        ↓
Confidence Score
        ↓
Result displayed to user
```

---

## 🧠 Machine Learning Model

The project uses **EfficientNet-B0**, a convolutional neural network architecture pretrained on ImageNet and fine-tuned for two-class chest X-ray classification.

### Classes

* `NORMAL`
* `PNEUMONIA`

### Training Configuration

| Parameter         |                         Value |
| ----------------- | ----------------------------: |
| Model             |               EfficientNet-B0 |
| Image Size        |                     224 × 224 |
| Batch Size        |                            16 |
| Epochs            |                             5 |
| Learning Rate     |                        0.0001 |
| Optimizer         |                          Adam |
| Loss Function     |            Cross Entropy Loss |
| Data Augmentation | Random Flip + Random Rotation |

---

## 📊 Model Performance

The model was evaluated on a separate test set containing **624 chest X-ray images**.

### Test Results

| Metric              |     Result |
| ------------------- | ---------: |
| Test Accuracy       | **87.98%** |
| Macro F1-score      | **86.22%** |
| Weighted F1-score   | **87.45%** |
| Pneumonia Precision | **84.46%** |
| Pneumonia Recall    | **98.97%** |
| Pneumonia F1-score  | **91.15%** |
| Normal Precision    | **97.60%** |
| Normal Recall       | **69.66%** |
| Normal F1-score     | **81.30%** |

### Confusion Matrix

```text
                 Predicted
              NORMAL  PNEUMONIA

Actual NORMAL    163      71
Actual PNEUMONIA   4     386
```

The model demonstrates particularly high recall for the **PNEUMONIA** class, while some NORMAL images are incorrectly classified as PNEUMONIA.

---

## 🛠️ Tech Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* Framer Motion
* Lucide React

### Backend

* Python
* FastAPI
* Uvicorn
* PyTorch
* Torchvision

### Machine Learning

* EfficientNet-B0
* Scikit-learn
* Image classification
* Transfer learning

---

## 📁 Project Structure

```text
medvision-ai/
│
├── backend/
│   ├── models/
│   │   └── chest_xray_model.pth
│   │
│   ├── training/
│   │   └── train_model.py
│   │
│   ├── uploads/
│   ├── main.py
│   ├── prediction.py
│   └── evaluate_model.py
│
├── src/
│   ├── components/
│   ├── services/
│   ├── types/
│   ├── App.tsx
│   └── main.tsx
│
├── public/
├── package.json
├── vite.config.ts
└── index.html
```

---

## 🚀 Running Locally

### 1. Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd medvision-ai
```

### 2. Start the backend

```bash
cd backend
```

Create/activate the virtual environment and install the Python dependencies.

Then start FastAPI:

```bash
uvicorn main:app --reload
```

The backend will run at:

```text
http://127.0.0.1:8000
```

### 3. Start the frontend

Open another terminal:

```bash
npm install
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

---

## 🔗 API

### `POST /predict`

Accepts a chest X-ray image using multipart form data.

Example response:

```json
{
  "message": "X-ray analyzed successfully!",
  "filename": "example.jpeg",
  "prediction": "NORMAL",
  "confidence": 93.66
}
```

---

## 🎯 Project Goals

MedVision AI was built to demonstrate how deep learning can be integrated into a real-world web application.

The project focuses on:

* Medical image classification
* Transfer learning
* Model evaluation
* REST API development
* React frontend development
* Frontend-backend integration
* Deploying an ML-powered application

---

## ⚠️ Medical Disclaimer

MedVision AI is intended **only for educational and demonstration purposes**.

It has not been clinically validated and should not be used to diagnose, treat, or rule out pneumonia or any other medical condition. Always consult a qualified healthcare professional for medical interpretation.

---

## 👨‍💻 Author

**Aditya Sanjeev Korti**

Built as a machine-learning and full-stack project exploring the integration of AI with medical image analysis.
