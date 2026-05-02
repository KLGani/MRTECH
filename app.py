"""
EduPredict - Unified Backend Entry Point
Supports both Flask-style and FastAPI/Express backends
"""

import subprocess
import sys
import os
import argparse


def run_mongodb_backend():
    """Run the Node.js MongoDB backend (port 5000)"""
    print("🚀 Starting MongoDB Backend (Node.js)...")
    print("📡 API will be available at: http://0.0.0.0:5000")
    print("🔍 Health Check: http://localhost:5000/api/health")
    print("\nPress Ctrl+C to stop the server\n")
    
    try:
        subprocess.run(["node", "backend-mongodb/server.js"], check=True)
    except KeyboardInterrupt:
        print("\n\n✅ Server stopped successfully!")
    except FileNotFoundError:
        print("❌ Node.js not found. Please install Node.js first.")
        sys.exit(1)
    except subprocess.CalledProcessError as e:
        print(f"\n❌ Server failed to start: {e}\n")


def run_ml_backend():
    """Run the Python ML API backend (port 8000)"""
    print("🚀 Starting ML API Backend (FastAPI)...")
    print("📚 API Documentation: http://localhost:8000/docs")
    print("🔍 Health Check: http://localhost:8000/api/health")
    print("\nPress Ctrl+C to stop the server\n")
    
    try:
        subprocess.run([sys.executable, "backend/api_server.py"], check=True)
    except KeyboardInterrupt:
        print("\n\n✅ Server stopped successfully!")
    except subprocess.CalledProcessError as e:
        print(f"\n❌ Server failed to start: {e}\n")


def run_full_setup():
    """Run complete setup: generate data, train model, start API"""
    print("🎓 Running Full EduPredict Setup...")
    try:
        subprocess.run([sys.executable, "backend/run_all.py"], check=True)
    except KeyboardInterrupt:
        print("\n\n✅ Setup stopped!")
    except subprocess.CalledProcessError as e:
        print(f"\n❌ Setup failed: {e}\n")


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='EduPredict Backend Launcher')
    parser.add_argument(
        '--mode', 
        choices=['mongodb', 'ml', 'full'], 
        default='mongodb',
        help='Backend mode to run: mongodb (Node.js, port 5000), ml (FastAPI, port 8000), full (complete setup)'
    )
    
    args = parser.parse_args()
    
    print("\n" + "=" * 60)
    print("🎓 EDUPREDICT - BACKEND LAUNCHER")
    print("=" * 60 + "\n")
    
    if args.mode == 'mongodb':
        run_mongodb_backend()
    elif args.mode == 'ml':
        run_ml_backend()
    elif args.mode == 'full':
        run_full_setup()

