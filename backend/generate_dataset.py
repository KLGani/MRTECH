"""
Generate comprehensive student performance dataset
with all parameters from the EduPredict application
"""

import pandas as pd
import numpy as np
import random
from datetime import datetime, timedelta

# Set random seed for reproducibility
np.random.seed(42)
random.seed(42)

# Dataset size
NUM_STUDENTS = 1000

# Parameters based on EduPredict application
def generate_student_data():
    """Generate realistic student performance data"""
    
    data = []
    
    for i in range(NUM_STUDENTS):
        # Basic student info
        student_id = f"STU{str(i+1).zfill(4)}"
        student_name = f"Student_{i+1}"
        email = f"student{i+1}@school.edu"
        
        # Class and section
        classes = ['9A', '9B', '10A', '10B', '11A', '11B', '12A', '12B']
        class_section = random.choice(classes)
        
        # Input features (independent variables)
        attendance = round(random.uniform(40, 100), 2)  # 40-100%
        assignment_score = round(random.uniform(30, 100), 2)  # 30-100
        quiz_score = round(random.uniform(30, 100), 2)  # 30-100
        midterm_score = round(random.uniform(30, 100), 2)  # 30-100
        previous_result = round(random.uniform(35, 95), 2)  # 35-95
        study_hours = round(random.uniform(0, 8), 1)  # 0-8 hours/day
        extracurricular = random.randint(0, 5)  # 0-5 activities
        
        # Realistic correlation patterns
        # Better attendance -> better scores
        attendance_factor = (attendance - 40) / 60  # Normalize to 0-1
        
        # Study hours impact
        study_factor = study_hours / 8  # Normalize to 0-1
        
        # Calculate final score with realistic correlations
        base_score = (
            0.20 * assignment_score +
            0.15 * quiz_score +
            0.25 * midterm_score +
            0.25 * previous_result +
            0.10 * (attendance_factor * 100) +
            0.05 * (study_factor * 100)
        )
        
        # Add some randomness (±5 points)
        noise = random.uniform(-5, 5)
        final_score = max(0, min(100, base_score + noise))
        
        # Add impact of extracurricular (small positive impact)
        if extracurricular >= 3:
            final_score = min(100, final_score + random.uniform(1, 3))
        elif extracurricular == 0:
            final_score = max(0, final_score - random.uniform(0, 2))
        
        final_score = round(final_score, 2)
        
        # Determine grade based on score
        if final_score >= 90:
            grade = 'A+'
        elif final_score >= 80:
            grade = 'A'
        elif final_score >= 70:
            grade = 'B'
        elif final_score >= 60:
            grade = 'C'
        elif final_score >= 50:
            grade = 'D'
        else:
            grade = 'F'
        
        # Determine risk level
        if final_score >= 70:
            risk_level = 'Low'
        elif final_score >= 50:
            risk_level = 'Medium'
        else:
            risk_level = 'High'
        
        # Timestamp (random date in last 6 months)
        days_ago = random.randint(0, 180)
        timestamp = (datetime.now() - timedelta(days=days_ago)).isoformat()
        
        data.append({
            'student_id': student_id,
            'student_name': student_name,
            'email': email,
            'class': class_section,
            'attendance': attendance,
            'assignment_score': assignment_score,
            'quiz_score': quiz_score,
            'midterm_score': midterm_score,
            'previous_result': previous_result,
            'study_hours_per_day': study_hours,
            'extracurricular_activities': extracurricular,
            'final_score': final_score,
            'grade': grade,
            'risk_level': risk_level,
            'timestamp': timestamp
        })
    
    return pd.DataFrame(data)


def add_edge_cases(df):
    """Add some edge cases for better model robustness"""
    
    edge_cases = []
    
    # Case 1: High attendance but low scores (struggling student)
    edge_cases.append({
        'student_id': 'STU9001',
        'student_name': 'Struggling_Student',
        'email': 'struggle@school.edu',
        'class': '10A',
        'attendance': 95.0,
        'assignment_score': 45.0,
        'quiz_score': 42.0,
        'midterm_score': 48.0,
        'previous_result': 50.0,
        'study_hours_per_day': 6.0,
        'extracurricular_activities': 1,
        'final_score': 48.5,
        'grade': 'D',
        'risk_level': 'High',
        'timestamp': datetime.now().isoformat()
    })
    
    # Case 2: Low attendance but high scores (gifted student)
    edge_cases.append({
        'student_id': 'STU9002',
        'student_name': 'Gifted_Student',
        'email': 'gifted@school.edu',
        'class': '11A',
        'attendance': 65.0,
        'assignment_score': 92.0,
        'quiz_score': 95.0,
        'midterm_score': 90.0,
        'previous_result': 88.0,
        'study_hours_per_day': 3.0,
        'extracurricular_activities': 4,
        'final_score': 89.0,
        'grade': 'A',
        'risk_level': 'Low',
        'timestamp': datetime.now().isoformat()
    })
    
    # Case 3: Perfect student
    edge_cases.append({
        'student_id': 'STU9003',
        'student_name': 'Perfect_Student',
        'email': 'perfect@school.edu',
        'class': '12A',
        'attendance': 100.0,
        'assignment_score': 98.0,
        'quiz_score': 97.0,
        'midterm_score': 99.0,
        'previous_result': 95.0,
        'study_hours_per_day': 7.0,
        'extracurricular_activities': 3,
        'final_score': 97.5,
        'grade': 'A+',
        'risk_level': 'Low',
        'timestamp': datetime.now().isoformat()
    })
    
    # Case 4: At-risk student
    edge_cases.append({
        'student_id': 'STU9004',
        'student_name': 'AtRisk_Student',
        'email': 'atrisk@school.edu',
        'class': '9B',
        'attendance': 45.0,
        'assignment_score': 35.0,
        'quiz_score': 38.0,
        'midterm_score': 40.0,
        'previous_result': 42.0,
        'study_hours_per_day': 1.0,
        'extracurricular_activities': 0,
        'final_score': 38.5,
        'grade': 'F',
        'risk_level': 'High',
        'timestamp': datetime.now().isoformat()
    })
    
    edge_df = pd.DataFrame(edge_cases)
    return pd.concat([df, edge_df], ignore_index=True)


def main():
    """Generate and save the dataset"""
    
    print("🎓 Generating Student Performance Dataset...")
    print(f"📊 Total students: {NUM_STUDENTS + 4} (including edge cases)")
    
    # Generate main dataset
    df = generate_student_data()
    
    # Add edge cases
    df = add_edge_cases(df)
    
    # Display statistics
    print("\n📈 Dataset Statistics:")
    print(f"   - Total records: {len(df)}")
    print(f"   - Attendance range: {df['attendance'].min():.2f}% - {df['attendance'].max():.2f}%")
    print(f"   - Final score range: {df['final_score'].min():.2f} - {df['final_score'].max():.2f}")
    print(f"   - Average final score: {df['final_score'].mean():.2f}")
    print(f"\n   Grade Distribution:")
    print(df['grade'].value_counts().sort_index())
    print(f"\n   Risk Level Distribution:")
    print(df['risk_level'].value_counts())
    
    # Save to CSV
    df.to_csv('student_performance_dataset.csv', index=False)
    print("\n✅ Dataset saved to: backend/student_performance_dataset.csv")
    
    # Display sample records
    print("\n📋 Sample Records:")
    print(df.head(3).to_string())
    
    return df


if __name__ == "__main__":
    df = main()
