#!/bin/bash

# Urban Home Services - Provider App Migration Script
# This script creates a new React Native 0.70.10 project and migrates existing code

echo "🚀 Starting Provider App migration..."

# Create new project
cd /home/rahul/Documents/urban/apps || exit
rm -rf ProviderApp
npx react-native init ProviderApp --version 0.70.10 --skip-install
cd ProviderApp || exit

# Install dependencies
echo "📦 Installing dependencies..."
npm install react@18.1.0 react-native@0.70.10 --legacy-peer-deps
npm install @urban/api-client --save
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs --legacy-peer-deps
npm install react-native-gesture-handler react-native-reanimated react-native-screens react-native-safe-area-context --legacy-peer-deps
npm install @react-native-async-storage/async-storage i18next react-i18next --legacy-peer-deps
npm install @reduxjs/toolkit react-redux --legacy-peer-deps

# Copy source files
echo "📂 Copying source files..."
rm -rf src
cp -r ../ProviderAppNew/src ./src
cp -r ../ProviderAppNew/.env* ./
cp ../ProviderAppNew/package.json ./

# Update package.json
echo "📝 Updating package.json..."
node -e "
  const pkg = require('./package.json');
  pkg.name = 'ProviderApp';
  pkg.version = '0.0.1';
  pkg.private = true;
  pkg.scripts = {
    'android': 'react-native run-android',
    'ios': 'react-native run-ios',
    'start': 'react-native start',
    'test': 'jest',
    'lint': 'eslint . --ext .js,.jsx,.ts,.tsx'
  };
  fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 2));
"

# Update Android configuration
echo "🤖 Updating Android configuration..."
cat > android/build.gradle << 'EOL'
// Top-level build file where you can add configuration options common to all sub-projects/modules.

buildscript {
    ext {
        buildToolsVersion = "31.0.0"
        minSdkVersion = 21
        compileSdkVersion = 31
        targetSdkVersion = 31

        if (System.properties['os.arch'] == "aarch64") {
            // For M1 Users we need to use the NDK 24 which added support for aarch64
            ndkVersion = "24.0.8215888"
        } else {
            // Otherwise we default to the side-by-side NDK version from AGP.
            ndkVersion = "21.4.7075529"
        }
    }
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath("com.android.tools.build:gradle:7.2.1")
        classpath("com.facebook.react:react-native-gradle-plugin")
        classpath("de.undercouch:gradle-download-task:5.0.1")
    }
}

allprojects {
    repositories {
        maven {
            // All of React Native (JS, Obj-C sources, Android binaries) is installed from npm
            url("$rootDir/../node_modules/react-native/android")
        }
        maven {
            // Android JSC is installed from npm
            url("$rootDir/../node_modules/jsc-android/dist")
        }
        mavenCentral {
            // We don't want to fetch react-native from Maven Central as there are
            // older versions over there.
            content {
                excludeGroup "com.facebook.react"
            }
        }
        google()
        maven { url 'https://www.jitpack.io' }
    }
}
EOL

# Update settings.gradle
cat > android/settings.gradle << 'EOL'
rootProject.name = 'ProviderApp'
apply from: file("../node_modules/@react-native-community/cli-platform-android/native_modules.gradle"); applyNativeModulesSettingsGradle(settings)
include ':app'
EOL

# Update MainApplication.java
echo "📝 Updating MainApplication.java..."
cat > android/app/src/main/java/com/providerapp/MainApplication.java << 'EOL'
package com.providerapp;

import android.app.Application;
import android.content.Context;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;
import java.lang.reflect.InvocationTargetException;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost =
      new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
          @SuppressWarnings("UnnecessaryLocalVariable")
          List<ReactPackage> packages = new PackageList(this).getPackages();
          // Packages that cannot be autolinked yet can be added manually here, for example:
          // packages.add(new MyReactNativePackage());
          return packages;
        }

        @Override
        protected String getJSMainModuleName() {
          return "index";
        }
      };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
  }

  /**
   * Loads Flipper in React Native templates. Call this in the onCreate method with something like
   * initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
   *
   * @param context
   * @param reactInstanceManager
   */
  private static void initializeFlipper(
      Context context, ReactInstanceManager reactInstanceManager) {
    if (BuildConfig.DEBUG) {
      try {
        /*
         We use reflection here to pick up the class that initializes Flipper,
        since Flipper library is not available in release mode
        */
        Class<?> aClass = Class.forName("com.providerapp.ReactNativeFlipper");
        aClass
            .getMethod("initializeFlipper", Context.class, ReactInstanceManager.class)
            .invoke(null, context, reactInstanceManager);
      } catch (ClassNotFoundException e) {
        e.printStackTrace();
      } catch (NoSuchMethodException e) {
        e.printStackTrace();
      } catch (IllegalAccessException e) {
        e.printStackTrace();
      } catch (InvocationTargetException e) {
        e.printStackTrace();
      }
    }
  }
}
EOL

# Update MainActivity.java
cat > android/app/src/main/java/com/providerapp/MainActivity.java << 'EOL'
package com.providerapp;

import com.facebook.react.ReactActivity;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "ProviderApp";
  }
}
EOL

# Install remaining dependencies
echo "📦 Installing remaining dependencies..."
npm install --legacy-peer-deps

# Clean and rebuild
echo "🧹 Cleaning project..."
cd android && ./gradlew clean && cd ..

echo "✅ Provider App migration completed successfully!"
echo "📱 To run the app:"
echo "  cd /home/rahul/Documents/urban/apps/ProviderApp"
echo "  npx react-native run-android"