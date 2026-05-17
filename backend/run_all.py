"""
Complete setup script to generate data, train model, and start API server
"""

import subprocess
import sys
import os


def check_dependencies():
    """Check if required Python packages are installed"""
    print("🔍 Checking Python dependencies...")
    
    try:
        import pandas
        import numpy
        import sklearn
        import xgboost
        import lightgbm
        import fastapi
        import uvicorn
        print("✅ All dependencies installed!\n")
        return True
    except ImportError as e:
        print(f"❌ Missing dependency: {e}")
        print("\n📦 Please install dependencies:")
        print("   pip install -r backend/requirements.txt\n")
        return False


def generate_dataset():
    """Generate student performance dataset"""
    print("=" * 60)
    print("STEP 1: GENERATING DATASET")
    print("=" * 60)
    
    try:
        subprocess.run([sys.executable, "backend/generate_dataset.py"], check=True)
        print("\n✅ Dataset generated successfully!\n")
        return True
    except subprocess.CalledProcessError as e:
        print(f"\n❌ Dataset generation failed: {e}\n")
        return False


def train_model():
    """Train machine learning model"""
    print("=" * 60)
    print("STEP 2: TRAINING ML MODEL")
    print("=" * 60)
    
    try:
        subprocess.run([sys.executable, "backend/train_model.py"], check=True)
        print("\n✅ Model trained successfully!\n")
        return True
    except subprocess.CalledProcessError as e:
        print(f"\n❌ Model training failed: {e}\n")
        return False


def start_api_server():
    """Start FastAPI server"""
    print("=" * 60)
    print("STEP 3: STARTING API SERVER")
    print("=" * 60)
    print("\n🚀 Starting EduPredict API Server...")
    print("📚 API Documentation: http://localhost:8000/docs")
    print("🔍 Health Check: http://localhost:8000/api/health")
    print("\nPress Ctrl+C to stop the server\n")
    
    try:
        subprocess.run([sys.executable, "backend/api_server.py"], check=True)
    except KeyboardInterrupt:
        print("\n\n✅ Server stopped successfully!")
    except subprocess.CalledProcessError as e:
        print(f"\n❌ Server failed to start: {e}\n")


def main():
    """Main execution flow"""
    print("\n" + "=" * 60)
    print("🎓 EDUPREDICT - COMPLETE SETUP")
    print("=" * 60 + "\n")
    
    # Check dependencies
    if not check_dependencies():
        sys.exit(1)
    
    # Generate dataset
    if not generate_dataset():
        sys.exit(1)
    
    # Train model
    if not train_model():
        sys.exit(1)
    
    # Start API server
    start_api_server()


if __name__ == "__main__":
    main()
