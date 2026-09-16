Required Dependencies
1. Node.js & npm
2. Capacitor CLI 
3. Java Development Kit (JDK) 
4. Android SDK
5. Android Debug Bridge (ADB) 

Dependencies CLI
1. winget install OpenJS.NodeJS.LTS Microsoft.OpenJDK.17 Android.AndroidStudio
2. setx JAVA_HOME "C:\Program Files\Microsoft\jdk-17"
   setx ANDROID_HOME "%LOCALAPPDATA%\Android\Sdk"
3. "%LOCALAPPDATA%\Android\Sdk\cmdline-tools\latest\bin\sdkmanager.bat"            "platform-tools"
4. setx PATH "%PATH%;%LOCALAPPDATA%\Android\Sdk\platform-tools"

To install the Portfolio on your Android device
1. activate developer settings by going to settings -> about phone -> software information -> tap "build number" 7 times
2. go to developer settings and activate usb debugging
3. connect your android device with your PC/Laptop
4. Click allow on the pop up on your phone
5. run the update.bat file and you should be good to go
