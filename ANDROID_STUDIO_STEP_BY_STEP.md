# 📱 ANDROID STUDIO - COMPLETE STEP-BY-STEP GUIDE

## 🎯 Follow These Steps EXACTLY

This guide will take you from **ZERO to WORKING ANDROID APP** in about 1-2 hours!

---

## ⏱️ TIME REQUIRED

- **Prerequisites Installation:** 30-45 minutes
- **Project Setup:** 15 minutes  
- **Coding:** 30-45 minutes
- **Testing:** 10 minutes

**Total: ~1.5 to 2 hours**

---

## 📋 PART 1: INSTALL PREREQUISITES (45 minutes)

### STEP 1: Install Java JDK (15 minutes)

1. **Go to:** https://www.oracle.com/java/technologies/downloads/
2. **Download JDK 17** (for Windows 64-bit)
3. **Run the installer** (Accept all defaults)
4. **Verify installation:**
   - Open Command Prompt (CMD)
   - Type: `java -version`
   - Should show: `java version "17.0.x"`

✅ **CHECKPOINT:** If you see Java version, you're good!

---

### STEP 2: Install Android Studio (30 minutes)

1. **Go to:** https://developer.android.com/studio
2. **Click** "Download Android Studio"
3. **Run the installer** (.exe file)
4. **Installation Wizard:**
   - Click "Next"
   - Select "Standard" installation
   - Click "Next" → "Next" → "Finish"
5. **Wait for SDK downloads** (15-20 minutes - downloads ~3GB)
6. **Click "Finish"** when done

✅ **CHECKPOINT:** Android Studio should open with "Welcome" screen

---

### STEP 3: Create Virtual Device (10 minutes)

1. **Click** "More Actions" → "Virtual Device Manager"
2. **Click** "Create Device"
3. **Select** "Pixel 5" → Click "Next"
4. **Select** "Tiramisu" (API 33) → Click "Download" if needed
5. **Wait** for download (5 minutes)
6. **Click** "Next" → "Finish"
7. **Click** ▶️ (Play button) to test
8. **Wait** 2-3 minutes for emulator to boot

✅ **CHECKPOINT:** You should see a virtual phone on your screen!

---

## 📂 PART 2: CREATE PROJECT (5 minutes)

### STEP 4: Create New Project

1. **Click** "New Project"
2. **Select** "Empty Activity"
3. **Click** "Next"
4. **Fill in details:**
   ```
   Name: EduPredict
   Package name: com.edupredict.app
   Save location: (default is fine)
   Language: Java
   Minimum SDK: API 24 (Android 7.0)
   ```
5. **Click** "Finish"
6. **Wait** 2-5 minutes for Gradle sync

✅ **CHECKPOINT:** Project opens with `MainActivity.java` visible

---

## 🔧 PART 3: SETUP DEPENDENCIES (10 minutes)

### STEP 5: Update Gradle Files

**A. Open:** `settings.gradle` (in root folder)

**Replace everything with:**
```gradle
pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}

dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
        maven { url 'https://jitpack.io' }
    }
}

rootProject.name = "EduPredict"
include ':app'
```

**Click:** "Sync Now" (top right)

---

**B. Open:** `app/build.gradle` (Module level - the one inside app folder)

**Find the `dependencies` section and REPLACE it with:**

```gradle
dependencies {
    implementation 'androidx.appcompat:appcompat:1.6.1'
    implementation 'com.google.android.material:material:1.11.0'
    implementation 'androidx.constraintlayout:constraintlayout:2.1.4'
    
    // Retrofit for API calls
    implementation 'com.squareup.retrofit2:retrofit:2.9.0'
    implementation 'com.squareup.retrofit2:converter-gson:2.9.0'
    implementation 'com.squareup.okhttp3:logging-interceptor:4.11.0'
    
    // CardView and RecyclerView
    implementation 'androidx.recyclerview:recyclerview:1.3.2'
    implementation 'androidx.cardview:cardview:1.0.0'
}
```

**Click:** "Sync Now"

**Wait:** 2-3 minutes

✅ **CHECKPOINT:** "BUILD SUCCESSFUL" message in bottom panel

---

### STEP 6: Add Permissions

**Open:** `app/src/main/AndroidManifest.xml`

**Add these lines BEFORE the `<application>` tag:**

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```

**Your AndroidManifest.xml should look like:**
```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        ...rest of the code...
    </application>
</manifest>
```

✅ **CHECKPOINT:** No red errors in the file

---

## 💻 PART 4: ADD ALL CODE FILES (30 minutes)

Now we'll create all the Java files and layouts. **Open the file `ANDROID_APP_ALL_FILES.md`** that I created - it has all the code!

### STEP 7: Create Models Package

1. **Right-click** `com/edupredict/app` (in Project view)
2. **Select** New → Package
3. **Name:** `models`
4. **Click** OK

Now create these 3 files in the `models` folder:

#### A. User.java
1. **Right-click** `models` → New → Java Class
2. **Name:** `User`
3. **Copy-paste** the code from `ANDROID_APP_ALL_FILES.md` (search for "User Model")

#### B. Subject.java
1. **Right-click** `models` → New → Java Class
2. **Name:** `Subject`
3. **Copy-paste** the code from `ANDROID_APP_ALL_FILES.md` (search for "Subject Model")

#### C. Prediction.java
1. **Right-click** `models` → New → Java Class
2. **Name:** `Prediction`
3. **Copy-paste** the code from `ANDROID_APP_ALL_FILES.md` (search for "Prediction Model")

✅ **CHECKPOINT:** You should have 3 files in `models` folder

---

### STEP 8: Create API Files

Create these files in `com/edupredict/app`:

#### A. ApiConfig.java
1. **Right-click** `com/edupredict/app` → New → Java Class
2. **Name:** `ApiConfig`
3. **Copy-paste** code from `ANDROID_APP_COMPLETE_GUIDE.md` (Step 5)
4. **⚠️ IMPORTANT:** Change the IP address to YOUR computer's IP!

**How to find your IP:**
- Windows: CMD → type `ipconfig` → look for IPv4 Address
- Example: `192.168.1.100`

#### B. ApiService.java
1. **Right-click** `com/edupredict/app` → New → Java Class
2. **Name:** `ApiService`
3. Change to **Interface** (replace `class` with `interface`)
4. **Copy-paste** code from `ANDROID_APP_COMPLETE_GUIDE.md` (Step 7)

#### C. ApiClient.java
1. **Right-click** `com/edupredict/app` → New → Java Class
2. **Name:** `ApiClient`
3. **Copy-paste** code from `ANDROID_APP_COMPLETE_GUIDE.md` (Step 8)

✅ **CHECKPOINT:** You should have 3 API files

---

### STEP 9: Create Activities

Create these Activity files:

#### A. LoginActivity
1. **Right-click** `com/edupredict/app` → New → Activity → Empty Activity
2. **Name:** `LoginActivity`
3. **Click** Finish
4. **Replace** the code with code from `ANDROID_APP_ALL_FILES.md`
5. **Also create** the layout: `activity_login.xml`
   - Right-click `res/layout` → New → Layout Resource File
   - Name: `activity_login`
   - Copy-paste XML from `ANDROID_APP_ALL_FILES.md`

#### B. RegisterActivity
1. **Right-click** `com/edupredict/app` → New → Activity → Empty Activity
2. **Name:** `RegisterActivity`
3. **Replace** code and create layout from `ANDROID_APP_ALL_FILES.md`

#### C. StudentDashboard
1. **Right-click** `com/edupredict/app` → New → Activity → Empty Activity
2. **Name:** `StudentDashboard`
3. **Replace** code and create layout from `ANDROID_APP_ALL_FILES.md`

#### D. TeacherDashboard
1. **Right-click** `com/edupredict/app` → New → Activity → Empty Activity
2. **Name:** `TeacherDashboard`
3. **Replace** code and create layout from `ANDROID_APP_ALL_FILES.md`

✅ **CHECKPOINT:** You should have 4 Activities + 4 Layouts

---

### STEP 10: Update AndroidManifest.xml

**Open:** `app/src/main/AndroidManifest.xml`

**Make sure all activities are declared and set LoginActivity as launcher:**

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        android:allowBackup="true"
        android:dataExtractionRules="@xml/data_extraction_rules"
        android:fullBackupContent="@xml/backup_rules"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.EduPredict"
        android:usesCleartextTraffic="true"
        tools:targetApi="31">
        
        <!-- Login Activity - Main Launcher -->
        <activity
            android:name=".LoginActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
        
        <!-- Other Activities -->
        <activity android:name=".RegisterActivity" />
        <activity android:name=".StudentDashboard" />
        <activity android:name=".TeacherDashboard" />
        <activity android:name=".MainActivity" />
    </application>

</manifest>
```

**Note:** `android:usesCleartextTraffic="true"` is important for HTTP connections!

✅ **CHECKPOINT:** No red errors in manifest

---

## 🚀 PART 5: RUN THE APP (10 minutes)

### STEP 11: Start Backend Server

**Before running the app, make sure backend is running:**

1. **Open CMD/Terminal**
2. **Navigate to backend:**
   ```bash
   cd backend-mongodb
   ```
3. **Start server:**
   ```bash
   npm run dev
   ```
4. **You should see:**
   ```
   ✅ MongoDB Connected Successfully!
   🚀 Server is running on port 5000
   ```

**⚠️ KEEP THIS TERMINAL OPEN!**

---

### STEP 12: Run Android App

1. **In Android Studio**, click ▶️ "Run" button (top toolbar)
2. **Select** your emulator (Pixel 5)
3. **Wait** 2-3 minutes for app to build and install
4. **App should open** on the emulator!

✅ **CHECKPOINT:** You should see the Login screen! 🎉

---

## 🧪 PART 6: TEST THE APP (5 minutes)

### STEP 13: Test Registration

1. **Click** "Don't have an account? Register"
2. **Fill in:**
   - Name: `Test Student`
   - Email: `test@test.com`
   - Password: `test123`
   - Select: `Student`
3. **Click** "Register"
4. **You should see:** "Registration successful!"

---

### STEP 14: Test Login

1. **Login with:**
   - Email: `test@test.com`
   - Password: `test123`
2. **Click** "Login"
3. **You should see:** Student Dashboard!

---

### STEP 15: Test Prediction

1. **Enter scores:**
   - Mathematics: `85`
   - Science: `38`
   - English: `92`
   - Hindi: `76`
   - Attendance: `85`
2. **Click** "Get Prediction"
3. **You should see:**
   - Predicted Score
   - Grade
   - Failing subjects (Science in RED)
   - Subject-wise results

🎉 **CONGRATULATIONS! YOUR APP IS WORKING!**

---

## 📲 PART 7: INSTALL ON YOUR REAL PHONE (10 minutes)

### OPTION A: Using USB Cable

1. **Enable Developer Options** on your phone:
   - Go to Settings → About Phone
   - Tap "Build Number" 7 times
   - Go back → Developer Options
   - Enable "USB Debugging"

2. **Connect phone** to computer via USB

3. **In Android Studio:**
   - Click Run ▶️
   - Select your phone from device list
   - App installs on your phone!

---

### OPTION B: Build APK and Transfer

1. **In Android Studio:**
   - Build → Build Bundle(s) / APK(s) → Build APK(s)
   - Wait 2-3 minutes
   - Click "locate" in notification

2. **Transfer APK:**
   - Find: `app-debug.apk`
   - Transfer to phone via USB/Email/WhatsApp
   - Install on phone

---

## 🎯 PROJECT STRUCTURE SUMMARY

```
EduPredict/
├── app/
│   ├── src/main/
│   │   ├── java/com/edupredict/app/
│   │   │   ├── models/
│   │   │   │   ├── User.java           ✅
│   │   │   │   ├── Subject.java        ✅
│   │   │   │   └── Prediction.java     ✅
│   │   │   ├── ApiConfig.java          ✅
│   │   │   ├── ApiService.java         ✅
│   │   │   ├── ApiClient.java          ✅
│   │   │   ├── LoginActivity.java      ✅
│   │   │   ├── RegisterActivity.java   ✅
│   │   │   ├── StudentDashboard.java   ✅
│   │   │   └── TeacherDashboard.java   ✅
│   │   ├── res/layout/
│   │   │   ├── activity_login.xml              ✅
│   │   │   ├── activity_register.xml           ✅
│   │   │   ├── activity_student_dashboard.xml  ✅
│   │   │   └── activity_teacher_dashboard.xml  ✅
│   │   └── AndroidManifest.xml         ✅
│   └── build.gradle                    ✅
```

**Total Files Created: 18 files**

---

## ⚠️ COMMON ISSUES & SOLUTIONS

### Issue 1: "Unable to connect to backend"
**Solution:**
- Make sure backend is running (`npm run dev`)
- Check IP address in `ApiConfig.java` is correct
- Both phone/emulator and computer must be on same WiFi

### Issue 2: "Gradle sync failed"
**Solution:**
- File → Invalidate Caches → Restart
- Wait and try again

### Issue 3: "Emulator not starting"
**Solution:**
- Close emulator
- Virtual Device Manager → Delete device
- Create new device
- Try again

### Issue 4: "App crashes on launch"
**Solution:**
- Check Logcat (bottom panel) for errors
- Make sure all files are created correctly
- Rebuild: Build → Clean Project → Rebuild Project

---

## ✅ FINAL CHECKLIST

Before saying you're done, verify:

- [ ] Java JDK installed
- [ ] Android Studio installed
- [ ] Virtual device created
- [ ] Project created
- [ ] Dependencies added
- [ ] Permissions added
- [ ] All 18 files created
- [ ] Backend server running
- [ ] App runs on emulator
- [ ] Registration works
- [ ] Login works
- [ ] Prediction works
- [ ] Results show failing subjects

---

## 🎓 WHAT YOU'VE BUILT

✅ **Native Android App** with Java  
✅ **Login & Registration** with MongoDB  
✅ **Student Dashboard** with predictions  
✅ **Teacher Dashboard**  
✅ **REST API Integration** with Retrofit  
✅ **Multi-subject Analysis**  
✅ **Failing Subject Detection**  
✅ **Material Design UI**  
✅ **Production-ready architecture**  

---

## 📚 NEXT STEPS

Want to add more features?

1. **Camera for marksheet upload**
2. **Charts/graphs** for visualization
3. **History screen** to see past predictions
4. **Teacher features** to view all students
5. **Push notifications** for low scores
6. **Dark mode**

---

## 💼 FOR YOUR INTERVIEW

**Talk Points:**
1. "Built native Android app with Java and Android Studio"
2. "Integrated REST API using Retrofit for backend communication"
3. "Implemented MongoDB authentication with JWT tokens"
4. "Material Design UI with CardView and RecyclerView"
5. "Multi-subject performance prediction with failing detection"
6. "SharedPreferences for local session management"
7. "Proper error handling and user feedback"
8. "Production-ready architecture with separation of concerns"

---

## 🎉 CONGRATULATIONS!

You now have:
- ✅ Working web app
- ✅ Working mobile app
- ✅ MongoDB backend
- ✅ Complete full-stack system

**This is an impressive portfolio project that demonstrates:**
- Full-stack development
- Mobile app development
- API integration
- Database management
- Modern architecture

**You're ready to impress HR! 🚀📱**

