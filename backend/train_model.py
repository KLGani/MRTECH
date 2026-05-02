"""
Train and evaluate multiple ML models for student performance prediction
Select the best model based on performance metrics
"""

import pandas as pd
import numpy as np
import pickle
import json
from datetime import datetime

# ML libraries
from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.linear_model import LinearRegression, Ridge, Lasso
from sklearn.tree import DecisionTreeRegressor
from sklearn.svm import SVR
from sklearn.neural_network import MLPRegressor
import xgboost as xgb
import lightgbm as lgb

import warnings
warnings.filterwarnings('ignore')


class StudentPerformanceModel:
    """Complete ML pipeline for student performance prediction"""
    
    def __init__(self):
        self.scaler = StandardScaler()
        self.model = None
        self.feature_importance = None
        self.metrics = {}
        self.best_model_name = None
        
    def load_data(self, filepath = 'student_performance_dataset.csv'):
        """Load and prepare the dataset"""
        print("📂 Loading dataset...")
        df = pd.read_csv(filepath)
        
        # Features for prediction (all input parameters from the app)
        self.feature_columns = [
            'attendance',
            'assignment_score',
            'quiz_score',
            'midterm_score',
            'previous_result',
            'study_hours_per_day',
            'extracurricular_activities'
        ]
        
        # Target variable
        self.target_column = 'final_score'
        
        # Extract features and target
        X = df[self.feature_columns]
        y = df[self.target_column]
        
        print(f"✅ Loaded {len(df)} records")
        print(f"📊 Features: {len(self.feature_columns)}")
        
        return X, y, df
    
    def prepare_data(self, X, y, test_size=0.2):
        """Split and scale the data"""
        print(f"\n🔄 Splitting data: {int((1-test_size)*100)}% train, {int(test_size*100)}% test")
        
        # Split the data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=test_size, random_state=42
        )
        
        # Scale features
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        return X_train_scaled, X_test_scaled, y_train, y_test, X_train, X_test
    
    def train_all_models(self, X_train, y_train):
        """Train multiple models and compare performance"""
        print("\n🤖 Training multiple ML models...\n")
        
        models = {
            'Linear Regression': LinearRegression(),
            'Ridge Regression': Ridge(alpha=1.0),
            'Lasso Regression': Lasso(alpha=1.0),
            'Decision Tree': DecisionTreeRegressor(random_state=42, max_depth=10),
            'Random Forest': RandomForestRegressor(n_estimators=100, random_state=42, max_depth=10),
            'Gradient Boosting': GradientBoostingRegressor(n_estimators=100, random_state=42, max_depth=5),
            'XGBoost': xgb.XGBRegressor(n_estimators=100, random_state=42, max_depth=5, learning_rate=0.1),
            'LightGBM': lgb.LGBMRegressor(n_estimators=100, random_state=42, max_depth=5, learning_rate=0.1, verbose=-1),
            'Support Vector': SVR(kernel='rbf', C=100, gamma='scale'),
            'Neural Network': MLPRegressor(hidden_layer_sizes=(100, 50), max_iter=500, random_state=42)
        }
        
        results = {}
        
        for name, model in models.items():
            print(f"   Training {name}...")
            
            # Cross-validation
            cv_scores = cross_val_score(model, X_train, y_train, cv=5, 
                                       scoring='r2', n_jobs=-1)
            
            # Train on full training set
            model.fit(X_train, y_train)
            
            results[name] = {
                'model': model,
                'cv_mean': cv_scores.mean(),
                'cv_std': cv_scores.std()
            }
            
            print(f"      ✓ CV R² Score: {cv_scores.mean():.4f} (±{cv_scores.std():.4f})")
        
        return results
    
    def evaluate_models(self, results, X_test, y_test):
        """Evaluate all models on test set"""
        print("\n📊 Evaluating models on test set...\n")
        
        evaluation_results = {}
        
        for name, data in results.items():
            model = data['model']
            y_pred = model.predict(X_test)
            
            # Calculate metrics
            mse = mean_squared_error(y_test, y_pred)
            rmse = np.sqrt(mse)
            mae = mean_absolute_error(y_test, y_pred)
            r2 = r2_score(y_test, y_pred)
            
            # Calculate MAPE (Mean Absolute Percentage Error)
            mape = np.mean(np.abs((y_test - y_pred) / y_test)) * 100
            
            evaluation_results[name] = {
                'R² Score': r2,
                'RMSE': rmse,
                'MAE': mae,
                'MAPE': mape,
                'CV R² Mean': data['cv_mean'],
                'CV R² Std': data['cv_std'],
                'model': model
            }
            
            print(f"   {name}:")
            print(f"      R² Score: {r2:.4f}")
            print(f"      RMSE: {rmse:.4f}")
            print(f"      MAE: {mae:.4f}")
            print(f"      MAPE: {mape:.2f}%\n")
        
        return evaluation_results
    
    def select_best_model(self, evaluation_results):
        """Select best model based on R² score"""
        print("🏆 Selecting best model...\n")
        
        # Sort by R² score
        sorted_models = sorted(evaluation_results.items(), 
                             key=lambda x: x[1]['R² Score'], reverse=True)
        
        self.best_model_name = sorted_models[0][0]
        best_metrics = sorted_models[0][1]
        self.model = best_metrics['model']
        
        print(f"   🥇 Best Model: {self.best_model_name}")
        print(f"      R² Score: {best_metrics['R² Score']:.4f}")
        print(f"      RMSE: {best_metrics['RMSE']:.4f}")
        print(f"      MAE: {best_metrics['MAE']:.4f}")
        print(f"      MAPE: {best_metrics['MAPE']:.2f}%")
        
        # Store metrics
        self.metrics = {
            'model_name': self.best_model_name,
            'r2_score': float(best_metrics['R² Score']),
            'rmse': float(best_metrics['RMSE']),
            'mae': float(best_metrics['MAE']),
            'mape': float(best_metrics['MAPE']),
            'cv_r2_mean': float(best_metrics['CV R² Mean']),
            'cv_r2_std': float(best_metrics['CV R² Std'])
        }
        
        # Display top 3 models
        print("\n   📊 Top 3 Models:")
        for i, (name, metrics) in enumerate(sorted_models[:3], 1):
            print(f"      {i}. {name}: R²={metrics['R² Score']:.4f}, RMSE={metrics['RMSE']:.4f}")
        
        return self.model, self.metrics
    
    def get_feature_importance(self, X_train_original):
        """Extract feature importance from the best model"""
        print("\n📈 Analyzing feature importance...\n")
        
        if hasattr(self.model, 'feature_importances_'):
            importances = self.model.feature_importances_
        elif hasattr(self.model, 'coef_'):
            importances = np.abs(self.model.coef_)
        else:
            print("   ⚠️  Feature importance not available for this model")
            return None
        
        # Create feature importance dictionary
        feature_importance = dict(zip(self.feature_columns, importances))
        
        # Sort by importance
        sorted_features = sorted(feature_importance.items(), 
                               key=lambda x: x[1], reverse=True)
        
        print("   Feature Importance Ranking:")
        for i, (feature, importance) in enumerate(sorted_features, 1):
            print(f"      {i}. {feature}: {importance:.4f}")
        
        self.feature_importance = dict(sorted_features)
        return self.feature_importance
    
    def save_model(self):
        """Save the trained model and scaler"""
        print("\n💾 Saving model artifacts...\n")
        
        # Save model
        with open('model.pkl', 'wb') as f:
            pickle.dump(self.model, f)
        print("   ✓ Model saved: backend/model.pkl")
        
        # Save scaler
        with open('scaler.pkl', 'wb') as f:
            pickle.dump(self.scaler, f)
        print("   ✓ Scaler saved: backend/scaler.pkl")
        
        # Save feature columns
        with open('feature_columns.pkl', 'wb') as f:
            pickle.dump(self.feature_columns, f)
        print("   ✓ Feature columns saved: backend/feature_columns.pkl")
        
        # Save metrics and feature importance
        model_info = {
            'model_name': self.best_model_name,
            'metrics': self.metrics,
            'feature_importance': self.feature_importance,
            'feature_columns': self.feature_columns,
            'trained_date': datetime.now().isoformat()
        }
        
        with open('model_info.json', 'w') as f:
            json.dump(model_info, f, indent=2)
        print("   ✓ Model info saved: backend/model_info.json")
    
    def test_prediction(self, X_test_original, y_test):
        """Test prediction with sample data"""
        print("\n🧪 Testing predictions with sample data...\n")
        
        # Get 3 random samples
        sample_indices = np.random.choice(len(X_test_original), 3, replace=False)
        
        for i, idx in enumerate(sample_indices, 1):
            sample = X_test_original.iloc[idx:idx+1]
            actual = y_test.iloc[idx]
            
            # Scale and predict
            sample_scaled = self.scaler.transform(sample)
            predicted = self.model.predict(sample_scaled)[0]
            
            print(f"   Sample {i}:")
            print(f"      Input: Attendance={sample['attendance'].values[0]:.1f}%, "
                  f"Assignment={sample['assignment_score'].values[0]:.1f}, "
                  f"Quiz={sample['quiz_score'].values[0]:.1f}")
            print(f"      Predicted Score: {predicted:.2f}")
            print(f"      Actual Score: {actual:.2f}")
            print(f"      Error: {abs(predicted - actual):.2f}\n")


def main():
    """Main training pipeline"""
    
    print("=" * 60)
    print("🎓 STUDENT PERFORMANCE PREDICTION - ML MODEL TRAINING")
    print("=" * 60)
    
    # Initialize model
    spm = StudentPerformanceModel()
    
    # Load data
    X, y, df = spm.load_data()
    
    # Prepare data
    X_train, X_test, y_train, y_test, X_train_orig, X_test_orig = spm.prepare_data(X, y)
    
    # Train all models
    results = spm.train_all_models(X_train, y_train)
    
    # Evaluate models
    evaluation_results = spm.evaluate_models(results, X_test, y_test)
    
    # Select best model
    best_model, metrics = spm.select_best_model(evaluation_results)
    
    # Get feature importance
    spm.get_feature_importance(X_train_orig)
    
    # Save model
    spm.save_model()
    
    # Test predictions
    spm.test_prediction(X_test_orig, y_test)
    
    print("\n" + "=" * 60)
    print("✅ MODEL TRAINING COMPLETE!")
    print("=" * 60)
    print(f"\n🎯 Best Model: {spm.best_model_name}")
    print(f"📊 Accuracy (R²): {metrics['r2_score']:.2%}")
    print(f"📉 Error (RMSE): {metrics['rmse']:.2f} points")
    print("\n💡 Next steps:")
    print("   1. Run: python backend/api_server.py")
    print("   2. Integrate with frontend")
    print("   3. Test predictions!")
    
    return spm


if __name__ == "__main__":
    model = main()
