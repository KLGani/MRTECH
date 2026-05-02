# 📱 Complete Android Studio App Guide - Student Performance Predictor

## 🎯 What You'll Build

A **native Android app** that connects to your MongoDB backend with:
- ✅ Login & Registration screens
- ✅ Student Dashboard with multi-subject prediction
- ✅ Teacher Dashboard with class analytics
- ✅ File upload (Camera + Gallery)
- ✅ Beautiful Material Design UI
- ✅ Real-time predictions
- ✅ MongoDB integration

---

## 📋 PREREQUISITES (Install These First)

### 1. Install Java Development Kit (JDK)

**Download:** https://www.oracle.com/java/technologies/downloads/

- Download **JDK 17** or **JDK 11**
- Run installer
- Accept defaults
- **Verify installation:**
  ```bash
  java -version
  ```
  Should show: `java version "17.0.x"`

---

### 2. Install Android Studio

**Download:** https://developer.android.com/studio

**Steps:**
1. Go to https://developer.android.com/studio
2. Click **"Download Android Studio"**
3. Run the installer
4. Select **"Standard"** installation
5. Wait for SDK downloads (15-20 minutes)
6. Click **"Finish"**

**What gets installed:**
- Android Studio IDE
- Android SDK
- Android Emulator
- Build tools

---

### 3. Setup Android Emulator (Virtual Phone)

**After Android Studio opens:**

1. Click **"More Actions"** → **"Virtual Device Manager"**
2. Click **"Create Device"**
3. Select **"Pixel 5"** → **Next**
4. Select **"API 33 (Tiramisu)"** → **Next** (Download if needed)
5. Click **"Finish"**
6. Click ▶️ Play button to test emulator
7. Wait 2-3 minutes for first boot

**✅ You should see an Android phone on your screen!**

---

## 🚀 STEP-BY-STEP: CREATE THE APP

### STEP 1: Create New Android Project (5 minutes)

1. **Open Android Studio**
2. Click **"New Project"**
3. Select **"Empty Activity"**
4. Click **"Next"**

**Configure Project:**
```
Name: EduPredict
Package name: com.edupredict.app
Save location: C:\Users\YourName\AndroidStudioProjects\EduPredict
Language: Java
Minimum SDK: API 24 (Android 7.0)
```

5. Click **"Finish"**
6. Wait 2-5 minutes for Gradle sync

**✅ Project created successfully!**

---

### STEP 2: Project Structure Overview

```
EduPredict/
├── app/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/edupredict/app/
│   │   │   │   ├── MainActivity.java          ← Main entry
│   │   │   │   ├── LoginActivity.java         ← We'll create
│   │   │   │   ├── RegisterActivity.java      ← We'll create
│   │   │   │   ├── StudentDashboard.java      ← We'll create
│   │   │   │   ├── TeacherDashboard.java      ← We'll create
│   │   │   │   ├── ApiService.java            ← API calls
│   │   │   │   └── models/                    ← Data models
│   │   │   ├── res/
│   │   │   │   ├── layout/                    ← UI XML files
│   │   │   │   ├── values/                    ← Colors, strings
│   │   │   │   └── drawable/                  ← Images, icons
│   │   │   └── AndroidManifest.xml            ← App config
│   │   └── build.gradle                       ← Dependencies
```

---

### STEP 3: Add Dependencies (3 minutes)

**Open:** `app/build.gradle` (Module level)

**Find the `dependencies` section and add:**

```gradle
dependencies {
    implementation 'androidx.appcompat:appcompat:1.6.1'
    implementation 'com.google.android.material:material:1.11.0'
    implementation 'androidx.constraintlayout:constraintlayout:2.1.4'
    
    // Retrofit for API calls
    implementation 'com.squareup.retrofit2:retrofit:2.9.0'
    implementation 'com.squareup.retrofit2:converter-gson:2.9.0'
    implementation 'com.squareup.okhttp3:logging-interceptor:4.11.0'
    
    // Image loading
    implementation 'com.github.bumptech.glide:glide:4.16.0'
    
    // Charts
    implementation 'com.github.PhilJay:MPAndroidChart:v3.1.0'
    
    // Camera
    implementation 'androidx.camera:camera-camera2:1.3.0'
    implementation 'androidx.camera:camera-lifecycle:1.3.0'
    implementation 'androidx.camera:camera-view:1.3.0'
    
    // RecyclerView
    implementation 'androidx.recyclerview:recyclerview:1.3.2'
    implementation 'androidx.cardview:cardview:1.0.0'
}
```

**At the TOP of the same file, add:**
```gradle
android {
    ...
    buildFeatures {
        viewBinding true
    }
}
```

**Also add at the VERY TOP of the file (before plugins):**
```gradle
allprojects {
    repositories {
        google()
        mavenCentral()
        maven { url 'https://jitpack.io' }
    }
}
```

**Click:** "Sync Now" (top right corner)

**Wait:** 2-3 minutes for sync

---

### STEP 4: Add Permissions (1 minute)

**Open:** `app/src/main/AndroidManifest.xml`

**Add these permissions BEFORE `<application>` tag:**

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

<uses-feature android:name="android.hardware.camera" android:required="false" />
```

---

### STEP 5: Create API Configuration (2 minutes)

**Right-click:** `java/com/edupredict/app`  
**Select:** New → Java Class  
**Name:** `ApiConfig`

**Paste this code:**

```java
package com.edupredict.app;

public class ApiConfig {
    // CHANGE THIS TO YOUR COMPUTER'S IP ADDRESS!
    // To find IP: Open CMD and type: ipconfig
    // Look for IPv4 Address (e.g., 192.168.1.100)
    
    public static final String BASE_URL = "http://192.168.1.100:5000/api/";
    
    // If using MongoDB Atlas cloud:
    // public static final String BASE_URL = "https://your-backend.herokuapp.com/api/";
}
```

**⚠️ IMPORTANT:** Replace `192.168.1.100` with YOUR computer's IP address!

**How to find your IP:**
- Windows: Open CMD → type `ipconfig` → look for IPv4 Address
- Mac: Open Terminal → type `ifconfig` → look for inet address

---

### STEP 6: Create Data Models (5 minutes)

**Create package:** Right-click `com/edupredict/app` → New → Package → Name: `models`

#### **A. User Model**

**Right-click:** `models` → New → Java Class → Name: `User`

```java
package com.edupredict.app.models;

public class User {
    private String id;
    private String email;
    private String name;
    private String role; // "student" or "teacher"
    private String token;
    
    public User() {}
    
    public User(String email, String name, String role) {
        this.email = email;
        this.name = name;
        this.role = role;
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
}
```

#### **B. Subject Model**

**Right-click:** `models` → New → Java Class → Name: `Subject`

```java
package com.edupredict.app.models;

public class Subject {
    private String name;
    private double score;
    private double percentage;
    private String grade;
    private String status; // "passing", "failing", "at-risk"
    
    public Subject() {}
    
    public Subject(String name, double score) {
        this.name = name;
        this.score = score;
        calculateDetails();
    }
    
    private void calculateDetails() {
        this.percentage = this.score;
        
        // Calculate grade
        if (percentage >= 90) grade = "A+";
        else if (percentage >= 80) grade = "A";
        else if (percentage >= 70) grade = "B";
        else if (percentage >= 60) grade = "C";
        else if (percentage >= 50) grade = "D";
        else if (percentage >= 40) grade = "E";
        else grade = "F";
        
        // Calculate status
        if (percentage < 40) status = "failing";
        else if (percentage < 50) status = "at-risk";
        else status = "passing";
    }
    
    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public double getScore() { return score; }
    public void setScore(double score) { 
        this.score = score;
        calculateDetails();
    }
    
    public double getPercentage() { return percentage; }
    public String getGrade() { return grade; }
    public String getStatus() { return status; }
}
```

#### **C. Prediction Model**

**Right-click:** `models` → New → Java Class → Name: `Prediction`

```java
package com.edupredict.app.models;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class Prediction {
    private String id;
    private String userId;
    private String studentName;
    private List<Subject> subjects;
    private double attendance;
    private double predictedScore;
    private String predictedGrade;
    private List<String> failingSubjects;
    private List<String> recommendations;
    private Date timestamp;
    
    public Prediction() {
        subjects = new ArrayList<>();
        failingSubjects = new ArrayList<>();
        recommendations = new ArrayList<>();
        timestamp = new Date();
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    
    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }
    
    public List<Subject> getSubjects() { return subjects; }
    public void setSubjects(List<Subject> subjects) { this.subjects = subjects; }
    
    public double getAttendance() { return attendance; }
    public void setAttendance(double attendance) { this.attendance = attendance; }
    
    public double getPredictedScore() { return predictedScore; }
    public void setPredictedScore(double predictedScore) { this.predictedScore = predictedScore; }
    
    public String getPredictedGrade() { return predictedGrade; }
    public void setPredictedGrade(String predictedGrade) { this.predictedGrade = predictedGrade; }
    
    public List<String> getFailingSubjects() { return failingSubjects; }
    public void setFailingSubjects(List<String> failingSubjects) { this.failingSubjects = failingSubjects; }
    
    public List<String> getRecommendations() { return recommendations; }
    public void setRecommendations(List<String> recommendations) { this.recommendations = recommendations; }
    
    public Date getTimestamp() { return timestamp; }
    public void setTimestamp(Date timestamp) { this.timestamp = timestamp; }
}
```

---

### STEP 7: Create API Service (5 minutes)

**Right-click:** `com/edupredict/app` → New → Java Class → Name: `ApiService`

```java
package com.edupredict.app;

import com.edupredict.app.models.Prediction;
import com.edupredict.app.models.User;

import java.util.List;
import java.util.Map;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.Path;

public interface ApiService {
    
    @POST("auth/register")
    Call<Map<String, Object>> register(@Body Map<String, String> user);
    
    @POST("auth/login")
    Call<Map<String, Object>> login(@Body Map<String, String> credentials);
    
    @POST("prediction/create")
    Call<Map<String, Object>> createPrediction(@Body Prediction prediction);
    
    @GET("prediction/user/{userId}")
    Call<List<Prediction>> getUserPredictions(@Path("userId") String userId);
}
```

---

### STEP 8: Create API Client (3 minutes)

**Right-click:** `com/edupredict/app` → New → Java Class → Name: `ApiClient`

```java
package com.edupredict.app;

import okhttp3.OkHttpClient;
import okhttp3.logging.HttpLoggingInterceptor;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class ApiClient {
    private static Retrofit retrofit = null;
    
    public static Retrofit getClient() {
        if (retrofit == null) {
            HttpLoggingInterceptor logging = new HttpLoggingInterceptor();
            logging.setLevel(HttpLoggingInterceptor.Level.BODY);
            
            OkHttpClient client = new OkHttpClient.Builder()
                    .addInterceptor(logging)
                    .build();
            
            retrofit = new Retrofit.Builder()
                    .baseUrl(ApiConfig.BASE_URL)
                    .addConverterFactory(GsonConverterFactory.create())
                    .client(client)
                    .build();
        }
        return retrofit;
    }
    
    public static ApiService getApiService() {
        return getClient().create(ApiService.class);
    }
}
```

---

## ✅ CHECKPOINT 1: Backend Setup

**Before continuing, make sure your backend is running:**

1. Open terminal/command prompt
2. Navigate to backend folder:
   ```bash
   cd backend-mongodb
   npm run dev
   ```
3. You should see:
   ```
   ✅ MongoDB Connected Successfully!
   🚀 Server is running on port 5000
   ```

**Keep this terminal open!**

---

I'll create the next part with all the Activity files and UI layouts. This is getting long, so I'll create separate guide files for better organization.

Would you like me to continue with:
- Login Screen creation
- Registration Screen
- Student Dashboard
- Teacher Dashboard
- UI Layouts

Or would you prefer I create ALL the files now in one go?

