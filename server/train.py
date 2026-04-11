import os
import re
import json
import time
import pandas as pd
from pathlib import Path
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression, SGDClassifier
from sklearn.naive_bayes import MultinomialNB
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import LinearSVC
from sklearn.calibration import CalibratedClassifierCV
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix, classification_report
import joblib

# Paths
BASE_DIR = Path(__file__).resolve().parent
DATA_PATH = BASE_DIR / "data" / "news.csv"
MODEL_DIR = BASE_DIR / "model"
MODEL_DIR.mkdir(exist_ok=True)

def clean_text(text: str) -> str:
    """Preprocess text by lowercasing, removing URLs, special characters, and extra whitespace."""
    if not isinstance(text, str):
        return ""
    cleaned = text.lower().strip()
    cleaned = re.sub(r"https?://\S+|www\.\S+", " ", cleaned)
    cleaned = re.sub(r"[^a-z0-9\s]", " ", cleaned)
    cleaned = re.sub(r"\s+", " ", cleaned)
    return cleaned

def print_separator(title=""):
    print(f"\n{'='*75}")
    if title:
        print(f"{title.center(75)}")
        print(f"{'='*75}")

def main():
    print_separator("FAKE NEWS DETECTION TRAINING")
    
    if not DATA_PATH.exists():
        print(f"Error: Dataset not found at {DATA_PATH}")
        print("Please place news.csv in the data directory and run again.")
        return

    print("Loading data...")
    df = pd.read_csv(DATA_PATH)
    print(f"Loaded {len(df)} rows.")

    # Check for required columns
    required_cols = {"text", "label"}
    if not required_cols.issubset(set(df.columns)):
        print(f"Error: Dataset must contain columns {required_cols}")
        print(f"Found columns: {list(df.columns)}")
        return

    # Drop any NaNs
    df = df.dropna(subset=['text', 'label'])
    
    print("Pre-processing text...")
    df['clean_text'] = df['text'].apply(clean_text)
    
    X = df['clean_text']
    y = df['label']

    print("Vectorizing data...")
    vectorizer = TfidfVectorizer(stop_words='english', max_df=0.7)
    X_vec = vectorizer.fit_transform(X)

    print("Splitting data...")
    X_train, X_test, y_train, y_test = train_test_split(
        X_vec, y, test_size=0.2, stratify=y, random_state=42
    )

    models = {
        "Logistic Regression": LogisticRegression(max_iter=1000, random_state=42),
        "Multinomial Naive Bayes": MultinomialNB(),
        "SGDClassifier": SGDClassifier(loss='hinge', max_iter=1000, random_state=42),
        "Random Forest": RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1),
        "Linear SVC (Calibrated)": CalibratedClassifierCV(LinearSVC(random_state=42, dual="auto")),
    }

    results = {}
    best_model_name = None
    best_f1 = -1.0
    best_model = None

    print_separator("TRAINING AND EVALUATING MODELS")

    for name, model in models.items():
        print(f"Training [{name}]...")
        start_time = time.time()
        
        model.fit(X_train, y_train)
        
        train_time = time.time() - start_time
        start_time = time.time()
        
        y_pred = model.predict(X_test)
        predict_time = time.time() - start_time

        acc = accuracy_score(y_test, y_pred)
        prec = precision_score(y_test, y_pred, average='weighted', zero_division=0)
        rec = recall_score(y_test, y_pred, average='weighted', zero_division=0)
        f1 = f1_score(y_test, y_pred, average='weighted', zero_division=0)

        cm = confusion_matrix(y_test, y_pred).tolist()
        cr = classification_report(y_test, y_pred, output_dict=True)

        results[name] = {
            "metrics": {
                "accuracy": acc,
                "precision": prec,
                "recall": rec,
                "f1_score": f1
            },
            "confusion_matrix": cm,
            "classification_report": cr,
            "training_time_sec": train_time,
            "prediction_time_sec": predict_time
        }

        print(f"  Accuracy: {acc:.4f} | F1 (weighted): {f1:.4f}")

        if f1 > best_f1:
            best_f1 = f1
            best_model_name = name
            best_model = model

    print_separator("COMPARISON TABLE")
    print(f"{'Model':<30} | {'Accuracy':<10} | {'Precision':<10} | {'Recall':<10} | {'F1 Score':<10}")
    print("-" * 80)
    for name, res in results.items():
        m = res["metrics"]
        print(f"{name:<30} | {m['accuracy']:<10.4f} | {m['precision']:<10.4f} | {m['recall']:<10.4f} | {m['f1_score']:<10.4f}")

    print_separator("SAVING BEST MODEL")
    print(f"Best Model: {best_model_name} (F1 Score: {best_f1:.4f})")

    model_path = MODEL_DIR / "model.joblib"
    vectorizer_path = MODEL_DIR / "vectorizer.joblib"
    report_path = MODEL_DIR / "training_report.json"

    # Save Best Model and Vectorizer
    joblib.dump(best_model, model_path)
    joblib.dump(vectorizer, vectorizer_path)

    # Save full report
    report = {
        "best_model_name": best_model_name,
        "best_f1_score": best_f1,
        "models_evaluated": list(models.keys()),
        "detailed_results": results
    }

    with open(report_path, "w", encoding="utf-8") as f:
        json.dump(report, f, indent=4)

    print(f"Saved best model to {model_path}")
    print(f"Saved vectorizer to {vectorizer_path}")
    print(f"Saved training report to {report_path}")
    
    print("\nTraining completed successfully!")

if __name__ == "__main__":
    main()
