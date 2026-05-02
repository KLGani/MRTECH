# 📱 All Android App Files - Copy & Paste Ready

This document contains ALL the code files you need to create the Android app. Just copy and paste each section into Android Studio!

---

## 📂 PART 1: ACTIVITIES (Java Files)

### 1. LoginActivity.java

**Location:** `app/src/main/java/com/edupredict/app/LoginActivity.java`

**Right-click** `com/edupredict/app` → New → Activity → Empty Activity → Name: `LoginActivity`

```java
package com.edupredict.app;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.google.gson.Gson;

import java.util.HashMap;
import java.util.Map;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class LoginActivity extends AppCompatActivity {
    
    private EditText emailInput, passwordInput;
    private Button loginButton;
    private TextView registerLink;
    private ProgressBar progressBar;
    private ApiService apiService;
    private SharedPreferences sharedPreferences;
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);
        
        // Initialize views
        emailInput = findViewById(R.id.emailInput);
        passwordInput = findViewById(R.id.passwordInput);
        loginButton = findViewById(R.id.loginButton);
        registerLink = findViewById(R.id.registerLink);
        progressBar = findViewById(R.id.progressBar);
        
        // Initialize API
        apiService = ApiClient.getApiService();
        sharedPreferences = getSharedPreferences("EduPredict", MODE_PRIVATE);
        
        // Check if already logged in
        if (sharedPreferences.contains("userId")) {
            goToDashboard();
            return;
        }
        
        // Login button click
        loginButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                login();
            }
        });
        
        // Register link click
        registerLink.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                startActivity(new Intent(LoginActivity.this, RegisterActivity.class));
            }
        });
    }
    
    private void login() {
        String email = emailInput.getText().toString().trim();
        String password = passwordInput.getText().toString().trim();
        
        if (email.isEmpty() || password.isEmpty()) {
            Toast.makeText(this, "Please fill all fields", Toast.LENGTH_SHORT).show();
            return;
        }
        
        progressBar.setVisibility(View.VISIBLE);
        loginButton.setEnabled(false);
        
        Map<String, String> credentials = new HashMap<>();
        credentials.put("email", email);
        credentials.put("password", password);
        
        apiService.login(credentials).enqueue(new Callback<Map<String, Object>>() {
            @Override
            public void onResponse(Call<Map<String, Object>> call, Response<Map<String, Object>> response) {
                progressBar.setVisibility(View.GONE);
                loginButton.setEnabled(true);
                
                if (response.isSuccessful() && response.body() != null) {
                    Map<String, Object> result = response.body();
                    Map<String, Object> user = (Map<String, Object>) result.get("user");
                    String token = (String) result.get("token");
                    
                    // Save user data
                    SharedPreferences.Editor editor = sharedPreferences.edit();
                    editor.putString("userId", (String) user.get("id"));
                    editor.putString("email", (String) user.get("email"));
                    editor.putString("name", (String) user.get("name"));
                    editor.putString("role", (String) user.get("role"));
                    editor.putString("token", token);
                    editor.apply();
                    
                    Toast.makeText(LoginActivity.this, "Login successful!", Toast.LENGTH_SHORT).show();
                    goToDashboard();
                } else {
                    Toast.makeText(LoginActivity.this, "Invalid credentials", Toast.LENGTH_SHORT).show();
                }
            }
            
            @Override
            public void onFailure(Call<Map<String, Object>> call, Throwable t) {
                progressBar.setVisibility(View.GONE);
                loginButton.setEnabled(true);
                Toast.makeText(LoginActivity.this, "Error: " + t.getMessage(), Toast.LENGTH_LONG).show();
            }
        });
    }
    
    private void goToDashboard() {
        String role = sharedPreferences.getString("role", "student");
        Intent intent;
        
        if (role.equals("teacher")) {
            intent = new Intent(this, TeacherDashboard.class);
        } else {
            intent = new Intent(this, StudentDashboard.class);
        }
        
        startActivity(intent);
        finish();
    }
}
```

---

### 2. RegisterActivity.java

**Location:** `app/src/main/java/com/edupredict/app/RegisterActivity.java`

```java
package com.edupredict.app;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ProgressBar;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import java.util.HashMap;
import java.util.Map;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class RegisterActivity extends AppCompatActivity {
    
    private EditText nameInput, emailInput, passwordInput;
    private RadioGroup roleGroup;
    private Button registerButton;
    private TextView loginLink;
    private ProgressBar progressBar;
    private ApiService apiService;
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_register);
        
        // Initialize views
        nameInput = findViewById(R.id.nameInput);
        emailInput = findViewById(R.id.emailInput);
        passwordInput = findViewById(R.id.passwordInput);
        roleGroup = findViewById(R.id.roleGroup);
        registerButton = findViewById(R.id.registerButton);
        loginLink = findViewById(R.id.loginLink);
        progressBar = findViewById(R.id.progressBar);
        
        // Initialize API
        apiService = ApiClient.getApiService();
        
        // Register button click
        registerButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                register();
            }
        });
        
        // Login link click
        loginLink.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });
    }
    
    private void register() {
        String name = nameInput.getText().toString().trim();
        String email = emailInput.getText().toString().trim();
        String password = passwordInput.getText().toString().trim();
        
        int selectedRoleId = roleGroup.getCheckedRadioButtonId();
        if (selectedRoleId == -1) {
            Toast.makeText(this, "Please select a role", Toast.LENGTH_SHORT).show();
            return;
        }
        
        RadioButton selectedRole = findViewById(selectedRoleId);
        String role = selectedRole.getText().toString().toLowerCase();
        
        if (name.isEmpty() || email.isEmpty() || password.isEmpty()) {
            Toast.makeText(this, "Please fill all fields", Toast.LENGTH_SHORT).show();
            return;
        }
        
        if (password.length() < 6) {
            Toast.makeText(this, "Password must be at least 6 characters", Toast.LENGTH_SHORT).show();
            return;
        }
        
        progressBar.setVisibility(View.VISIBLE);
        registerButton.setEnabled(false);
        
        Map<String, String> user = new HashMap<>();
        user.put("name", name);
        user.put("email", email);
        user.put("password", password);
        user.put("role", role);
        
        apiService.register(user).enqueue(new Callback<Map<String, Object>>() {
            @Override
            public void onResponse(Call<Map<String, Object>> call, Response<Map<String, Object>> response) {
                progressBar.setVisibility(View.GONE);
                registerButton.setEnabled(true);
                
                if (response.isSuccessful() && response.body() != null) {
                    Toast.makeText(RegisterActivity.this, "Registration successful! Please login.", Toast.LENGTH_SHORT).show();
                    finish();
                } else {
                    Toast.makeText(RegisterActivity.this, "Registration failed. Email may already exist.", Toast.LENGTH_SHORT).show();
                }
            }
            
            @Override
            public void onFailure(Call<Map<String, Object>> call, Throwable t) {
                progressBar.setVisibility(View.GONE);
                registerButton.setEnabled(true);
                Toast.makeText(RegisterActivity.this, "Error: " + t.getMessage(), Toast.LENGTH_LONG).show();
            }
        });
    }
}
```

---

### 3. StudentDashboard.java

**Location:** `app/src/main/java/com/edupredict/app/StudentDashboard.java`

```java
package com.edupredict.app;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.cardview.widget.CardView;

import com.edupredict.app.models.Prediction;
import com.edupredict.app.models.Subject;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class StudentDashboard extends AppCompatActivity {
    
    private TextView welcomeText, resultText, gradeText, failingSubjectsText;
    private EditText mathInput, scienceInput, englishInput, hindiInput, attendanceInput;
    private Button predictButton;
    private ProgressBar progressBar;
    private CardView resultCard;
    private LinearLayout subjectsContainer;
    
    private ApiService apiService;
    private SharedPreferences sharedPreferences;
    private String userId, userName;
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_student_dashboard);
        
        // Initialize
        apiService = ApiClient.getApiService();
        sharedPreferences = getSharedPreferences("EduPredict", MODE_PRIVATE);
        userId = sharedPreferences.getString("userId", "");
        userName = sharedPreferences.getString("name", "Student");
        
        // Initialize views
        welcomeText = findViewById(R.id.welcomeText);
        mathInput = findViewById(R.id.mathInput);
        scienceInput = findViewById(R.id.scienceInput);
        englishInput = findViewById(R.id.englishInput);
        hindiInput = findViewById(R.id.hindiInput);
        attendanceInput = findViewById(R.id.attendanceInput);
        predictButton = findViewById(R.id.predictButton);
        progressBar = findViewById(R.id.progressBar);
        resultCard = findViewById(R.id.resultCard);
        resultText = findViewById(R.id.resultText);
        gradeText = findViewById(R.id.gradeText);
        failingSubjectsText = findViewById(R.id.failingSubjectsText);
        subjectsContainer = findViewById(R.id.subjectsContainer);
        
        welcomeText.setText("Welcome, " + userName + "!");
        
        predictButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                makePrediction();
            }
        });
    }
    
    private void makePrediction() {
        try {
            double mathScore = Double.parseDouble(mathInput.getText().toString());
            double scienceScore = Double.parseDouble(scienceInput.getText().toString());
            double englishScore = Double.parseDouble(englishInput.getText().toString());
            double hindiScore = Double.parseDouble(hindiInput.getText().toString());
            double attendance = Double.parseDouble(attendanceInput.getText().toString());
            
            // Validation
            if (mathScore < 0 || mathScore > 100 || scienceScore < 0 || scienceScore > 100 ||
                englishScore < 0 || englishScore > 100 || hindiScore < 0 || hindiScore > 100) {
                Toast.makeText(this, "Scores must be between 0 and 100", Toast.LENGTH_SHORT).show();
                return;
            }
            
            if (attendance < 0 || attendance > 100) {
                Toast.makeText(this, "Attendance must be between 0 and 100", Toast.LENGTH_SHORT).show();
                return;
            }
            
            progressBar.setVisibility(View.VISIBLE);
            predictButton.setEnabled(false);
            
            // Create prediction
            Prediction prediction = new Prediction();
            prediction.setUserId(userId);
            prediction.setStudentName(userName);
            prediction.setAttendance(attendance);
            
            // Add subjects
            List<Subject> subjects = new ArrayList<>();
            subjects.add(new Subject("Mathematics", mathScore));
            subjects.add(new Subject("Science", scienceScore));
            subjects.add(new Subject("English", englishScore));
            subjects.add(new Subject("Hindi", hindiScore));
            prediction.setSubjects(subjects);
            
            // Calculate overall prediction
            double avgScore = (mathScore + scienceScore + englishScore + hindiScore) / 4.0;
            prediction.setPredictedScore(avgScore);
            prediction.setPredictedGrade(getGrade(avgScore));
            
            // Find failing subjects
            List<String> failing = new ArrayList<>();
            for (Subject subject : subjects) {
                if (subject.getStatus().equals("failing")) {
                    failing.add(subject.getName());
                }
            }
            prediction.setFailingSubjects(failing);
            
            // Generate recommendations
            List<String> recommendations = generateRecommendations(subjects, attendance);
            prediction.setRecommendations(recommendations);
            
            // Save to backend
            savePrediction(prediction);
            
        } catch (NumberFormatException e) {
            Toast.makeText(this, "Please enter valid numbers", Toast.LENGTH_SHORT).show();
        }
    }
    
    private void savePrediction(Prediction prediction) {
        apiService.createPrediction(prediction).enqueue(new Callback<Map<String, Object>>() {
            @Override
            public void onResponse(Call<Map<String, Object>> call, Response<Map<String, Object>> response) {
                progressBar.setVisibility(View.GONE);
                predictButton.setEnabled(true);
                
                if (response.isSuccessful()) {
                    displayResults(prediction);
                    Toast.makeText(StudentDashboard.this, "Prediction saved!", Toast.LENGTH_SHORT).show();
                } else {
                    displayResults(prediction);
                    Toast.makeText(StudentDashboard.this, "Shown locally (backend error)", Toast.LENGTH_SHORT).show();
                }
            }
            
            @Override
            public void onFailure(Call<Map<String, Object>> call, Throwable t) {
                progressBar.setVisibility(View.GONE);
                predictButton.setEnabled(true);
                displayResults(prediction);
                Toast.makeText(StudentDashboard.this, "Shown locally: " + t.getMessage(), Toast.LENGTH_LONG).show();
            }
        });
    }
    
    private void displayResults(Prediction prediction) {
        resultCard.setVisibility(View.VISIBLE);
        
        resultText.setText(String.format("Predicted Score: %.1f%%", prediction.getPredictedScore()));
        gradeText.setText("Grade: " + prediction.getPredictedGrade());
        
        // Show failing subjects
        if (!prediction.getFailingSubjects().isEmpty()) {
            failingSubjectsText.setVisibility(View.VISIBLE);
            StringBuilder failing = new StringBuilder("⚠️ FAILING SUBJECTS:\n");
            for (String subject : prediction.getFailingSubjects()) {
                failing.append("• ").append(subject).append("\n");
            }
            failingSubjectsText.setText(failing.toString());
        } else {
            failingSubjectsText.setVisibility(View.GONE);
        }
        
        // Display subjects
        subjectsContainer.removeAllViews();
        for (Subject subject : prediction.getSubjects()) {
            addSubjectCard(subject);
        }
    }
    
    private void addSubjectCard(Subject subject) {
        TextView subjectView = new TextView(this);
        subjectView.setPadding(20, 20, 20, 20);
        
        String status = subject.getStatus().equals("failing") ? "❌ FAILING" : 
                       subject.getStatus().equals("at-risk") ? "⚠️ AT RISK" : "✅ PASSING";
        
        subjectView.setText(String.format("%s: %.1f%% - Grade %s %s",
                subject.getName(), subject.getPercentage(), subject.getGrade(), status));
        
        int color = subject.getStatus().equals("failing") ? 0xFFFF5252 :
                   subject.getStatus().equals("at-risk") ? 0xFFFFAB40 : 0xFF66BB6A;
        subjectView.setTextColor(color);
        
        subjectsContainer.addView(subjectView);
    }
    
    private String getGrade(double score) {
        if (score >= 90) return "A+";
        if (score >= 80) return "A";
        if (score >= 70) return "B";
        if (score >= 60) return "C";
        if (score >= 50) return "D";
        if (score >= 40) return "E";
        return "F";
    }
    
    private List<String> generateRecommendations(List<Subject> subjects, double attendance) {
        List<String> recommendations = new ArrayList<>();
        
        for (Subject subject : subjects) {
            if (subject.getStatus().equals("failing")) {
                recommendations.add("Focus on " + subject.getName() + " - attend extra classes");
            }
        }
        
        if (attendance < 75) {
            recommendations.add("Improve attendance to at least 75%");
        }
        
        return recommendations;
    }
    
    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        menu.add("Logout");
        return true;
    }
    
    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        if (item.getTitle().equals("Logout")) {
            sharedPreferences.edit().clear().apply();
            startActivity(new Intent(this, LoginActivity.class));
            finish();
            return true;
        }
        return super.onOptionsItemSelected(item);
    }
}
```

---

### 4. TeacherDashboard.java

**Location:** `app/src/main/java/com/edupredict/app/TeacherDashboard.java`

```java
package com.edupredict.app;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

public class TeacherDashboard extends AppCompatActivity {
    
    private TextView welcomeText, infoText;
    private SharedPreferences sharedPreferences;
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_teacher_dashboard);
        
        sharedPreferences = getSharedPreferences("EduPredict", MODE_PRIVATE);
        String userName = sharedPreferences.getString("name", "Teacher");
        
        welcomeText = findViewById(R.id.welcomeText);
        infoText = findViewById(R.id.infoText);
        
        welcomeText.setText("Welcome, " + userName + "!");
        infoText.setText("Teacher Dashboard\n\n" +
                "You can:\n" +
                "• View student predictions\n" +
                "• Upload class data\n" +
                "• Monitor performance\n" +
                "• Generate reports\n\n" +
                "Full features coming soon!");
    }
    
    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        menu.add("Logout");
        return true;
    }
    
    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        if (item.getTitle().equals("Logout")) {
            sharedPreferences.edit().clear().apply();
            startActivity(new Intent(this, LoginActivity.class));
            finish();
            return true;
        }
        return super.onOptionsItemSelected(item);
    }
}
```

---

## 📂 PART 2: LAYOUTS (XML Files)

### 1. activity_login.xml

**Location:** `app/src/main/res/layout/activity_login.xml`

**Right-click** `res/layout` → New → Layout Resource File → Name: `activity_login`

```xml
<?xml version="1.0" encoding="utf-8"?>
<ScrollView xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="@android:color/white">

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="vertical"
        android:padding="24dp">

        <!-- Logo/Header -->
        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_gravity="center"
            android:layout_marginTop="40dp"
            android:layout_marginBottom="8dp"
            android:text="🎓"
            android:textSize="60sp" />

        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_gravity="center"
            android:layout_marginBottom="40dp"
            android:text="EduPredict"
            android:textColor="#1976D2"
            android:textSize="28sp"
            android:textStyle="bold" />

        <!-- Email Input -->
        <com.google.android.material.textfield.TextInputLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginBottom="16dp"
            android:hint="Email"
            app:boxStrokeColor="#1976D2">

            <com.google.android.material.textfield.TextInputEditText
                android:id="@+id/emailInput"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:inputType="textEmailAddress" />
        </com.google.android.material.textfield.TextInputLayout>

        <!-- Password Input -->
        <com.google.android.material.textfield.TextInputLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginBottom="24dp"
            android:hint="Password"
            app:boxStrokeColor="#1976D2"
            app:passwordToggleEnabled="true">

            <com.google.android.material.textfield.TextInputEditText
                android:id="@+id/passwordInput"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:inputType="textPassword" />
        </com.google.android.material.textfield.TextInputLayout>

        <!-- Login Button -->
        <Button
            android:id="@+id/loginButton"
            android:layout_width="match_parent"
            android:layout_height="56dp"
            android:layout_marginBottom="16dp"
            android:backgroundTint="#1976D2"
            android:text="Login"
            android:textColor="@android:color/white"
            android:textSize="16sp" />

        <!-- Progress Bar -->
        <ProgressBar
            android:id="@+id/progressBar"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_gravity="center"
            android:layout_marginBottom="16dp"
            android:visibility="gone" />

        <!-- Register Link -->
        <TextView
            android:id="@+id/registerLink"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_gravity="center"
            android:text="Don't have an account? Register"
            android:textColor="#1976D2"
            android:textSize="14sp" />

    </LinearLayout>
</ScrollView>
```

---

### 2. activity_register.xml

**Location:** `app/src/main/res/layout/activity_register.xml`

```xml
<?xml version="1.0" encoding="utf-8"?>
<ScrollView xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="@android:color/white">

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="vertical"
        android:padding="24dp">

        <!-- Header -->
        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_gravity="center"
            android:layout_marginTop="40dp"
            android:layout_marginBottom="8dp"
            android:text="📝"
            android:textSize="60sp" />

        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_gravity="center"
            android:layout_marginBottom="40dp"
            android:text="Create Account"
            android:textColor="#1976D2"
            android:textSize="28sp"
            android:textStyle="bold" />

        <!-- Name Input -->
        <com.google.android.material.textfield.TextInputLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginBottom="16dp"
            android:hint="Full Name"
            app:boxStrokeColor="#1976D2">

            <com.google.android.material.textfield.TextInputEditText
                android:id="@+id/nameInput"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:inputType="textPersonName" />
        </com.google.android.material.textfield.TextInputLayout>

        <!-- Email Input -->
        <com.google.android.material.textfield.TextInputLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginBottom="16dp"
            android:hint="Email"
            app:boxStrokeColor="#1976D2">

            <com.google.android.material.textfield.TextInputEditText
                android:id="@+id/emailInput"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:inputType="textEmailAddress" />
        </com.google.android.material.textfield.TextInputLayout>

        <!-- Password Input -->
        <com.google.android.material.textfield.TextInputLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginBottom="24dp"
            android:hint="Password (min 6 characters)"
            app:boxStrokeColor="#1976D2"
            app:passwordToggleEnabled="true">

            <com.google.android.material.textfield.TextInputEditText
                android:id="@+id/passwordInput"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:inputType="textPassword" />
        </com.google.android.material.textfield.TextInputLayout>

        <!-- Role Selection -->
        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginBottom="8dp"
            android:text="I am a:"
            android:textColor="#000000"
            android:textSize="16sp"
            android:textStyle="bold" />

        <RadioGroup
            android:id="@+id/roleGroup"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginBottom="24dp"
            android:orientation="horizontal">

            <RadioButton
                android:id="@+id/studentRadio"
                android:layout_width="0dp"
                android:layout_height="wrap_content"
                android:layout_weight="1"
                android:checked="true"
                android:text="Student"
                android:textSize="16sp" />

            <RadioButton
                android:id="@+id/teacherRadio"
                android:layout_width="0dp"
                android:layout_height="wrap_content"
                android:layout_weight="1"
                android:text="Teacher"
                android:textSize="16sp" />
        </RadioGroup>

        <!-- Register Button -->
        <Button
            android:id="@+id/registerButton"
            android:layout_width="match_parent"
            android:layout_height="56dp"
            android:layout_marginBottom="16dp"
            android:backgroundTint="#1976D2"
            android:text="Register"
            android:textColor="@android:color/white"
            android:textSize="16sp" />

        <!-- Progress Bar -->
        <ProgressBar
            android:id="@+id/progressBar"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_gravity="center"
            android:layout_marginBottom="16dp"
            android:visibility="gone" />

        <!-- Login Link -->
        <TextView
            android:id="@+id/loginLink"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_gravity="center"
            android:text="Already have an account? Login"
            android:textColor="#1976D2"
            android:textSize="14sp" />

    </LinearLayout>
</ScrollView>
```

---

### 3. activity_student_dashboard.xml

**Location:** `app/src/main/res/layout/activity_student_dashboard.xml`

```xml
<?xml version="1.0" encoding="utf-8"?>
<ScrollView xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="#F5F5F5">

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="vertical"
        android:padding="16dp">

        <!-- Header -->
        <TextView
            android:id="@+id/welcomeText"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginBottom="24dp"
            android:text="Welcome, Student!"
            android:textColor="#1976D2"
            android:textSize="24sp"
            android:textStyle="bold" />

        <!-- Input Card -->
        <androidx.cardview.widget.CardView
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginBottom="16dp"
            app:cardCornerRadius="8dp"
            app:cardElevation="4dp">

            <LinearLayout
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:orientation="vertical"
                android:padding="16dp">

                <TextView
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:layout_marginBottom="16dp"
                    android:text="Enter Your Scores"
                    android:textColor="#000000"
                    android:textSize="18sp"
                    android:textStyle="bold" />

                <!-- Mathematics -->
                <com.google.android.material.textfield.TextInputLayout
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:layout_marginBottom="12dp"
                    android:hint="Mathematics Score (0-100)"
                    app:boxStrokeColor="#1976D2">

                    <com.google.android.material.textfield.TextInputEditText
                        android:id="@+id/mathInput"
                        android:layout_width="match_parent"
                        android:layout_height="wrap_content"
                        android:inputType="numberDecimal" />
                </com.google.android.material.textfield.TextInputLayout>

                <!-- Science -->
                <com.google.android.material.textfield.TextInputLayout
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:layout_marginBottom="12dp"
                    android:hint="Science Score (0-100)"
                    app:boxStrokeColor="#1976D2">

                    <com.google.android.material.textfield.TextInputEditText
                        android:id="@+id/scienceInput"
                        android:layout_width="match_parent"
                        android:layout_height="wrap_content"
                        android:inputType="numberDecimal" />
                </com.google.android.material.textfield.TextInputLayout>

                <!-- English -->
                <com.google.android.material.textfield.TextInputLayout
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:layout_marginBottom="12dp"
                    android:hint="English Score (0-100)"
                    app:boxStrokeColor="#1976D2">

                    <com.google.android.material.textfield.TextInputEditText
                        android:id="@+id/englishInput"
                        android:layout_width="match_parent"
                        android:layout_height="wrap_content"
                        android:inputType="numberDecimal" />
                </com.google.android.material.textfield.TextInputLayout>

                <!-- Hindi -->
                <com.google.android.material.textfield.TextInputLayout
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:layout_marginBottom="12dp"
                    android:hint="Hindi Score (0-100)"
                    app:boxStrokeColor="#1976D2">

                    <com.google.android.material.textfield.TextInputEditText
                        android:id="@+id/hindiInput"
                        android:layout_width="match_parent"
                        android:layout_height="wrap_content"
                        android:inputType="numberDecimal" />
                </com.google.android.material.textfield.TextInputLayout>

                <!-- Attendance -->
                <com.google.android.material.textfield.TextInputLayout
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:layout_marginBottom="16dp"
                    android:hint="Attendance % (0-100)"
                    app:boxStrokeColor="#1976D2">

                    <com.google.android.material.textfield.TextInputEditText
                        android:id="@+id/attendanceInput"
                        android:layout_width="match_parent"
                        android:layout_height="wrap_content"
                        android:inputType="numberDecimal" />
                </com.google.android.material.textfield.TextInputLayout>

                <!-- Predict Button -->
                <Button
                    android:id="@+id/predictButton"
                    android:layout_width="match_parent"
                    android:layout_height="56dp"
                    android:backgroundTint="#1976D2"
                    android:text="Get Prediction"
                    android:textColor="@android:color/white" />

                <!-- Progress Bar -->
                <ProgressBar
                    android:id="@+id/progressBar"
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:layout_gravity="center"
                    android:layout_marginTop="8dp"
                    android:visibility="gone" />

            </LinearLayout>
        </androidx.cardview.widget.CardView>

        <!-- Results Card -->
        <androidx.cardview.widget.CardView
            android:id="@+id/resultCard"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:visibility="gone"
            app:cardCornerRadius="8dp"
            app:cardElevation="4dp">

            <LinearLayout
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:orientation="vertical"
                android:padding="16dp">

                <TextView
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:layout_marginBottom="16dp"
                    android:text="📊 Prediction Results"
                    android:textColor="#000000"
                    android:textSize="18sp"
                    android:textStyle="bold" />

                <TextView
                    android:id="@+id/resultText"
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:layout_marginBottom="8dp"
                    android:text="Predicted Score: 75%"
                    android:textColor="#1976D2"
                    android:textSize="20sp"
                    android:textStyle="bold" />

                <TextView
                    android:id="@+id/gradeText"
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:layout_marginBottom="16dp"
                    android:text="Grade: B"
                    android:textSize="16sp" />

                <TextView
                    android:id="@+id/failingSubjectsText"
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:layout_marginBottom="16dp"
                    android:text="Failing Subjects"
                    android:textColor="#FF5252"
                    android:textSize="14sp"
                    android:visibility="gone" />

                <LinearLayout
                    android:id="@+id/subjectsContainer"
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:orientation="vertical" />

            </LinearLayout>
        </androidx.cardview.widget.CardView>

    </LinearLayout>
</ScrollView>
```

---

### 4. activity_teacher_dashboard.xml

**Location:** `app/src/main/res/layout/activity_teacher_dashboard.xml`

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="#F5F5F5"
    android:orientation="vertical"
    android:padding="16dp">

    <TextView
        android:id="@+id/welcomeText"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginBottom="24dp"
        android:text="Welcome, Teacher!"
        android:textColor="#1976D2"
        android:textSize="24sp"
        android:textStyle="bold" />

    <androidx.cardview.widget.CardView
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_marginBottom="16dp"
        android:elevation="4dp">

        <TextView
            android:id="@+id/infoText"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:padding="20dp"
            android:text="Teacher Dashboard"
            android:textSize="16sp" />
    </androidx.cardview.widget.CardView>

</LinearLayout>
```

---

## ✅ THAT'S ALL THE CODE!

Now I'll create a step-by-step execution guide...

