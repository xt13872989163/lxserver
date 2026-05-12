# SyncNotes Android 构建 Docker 配置

FROM node:18-bullseye

# 安装 Java 和 Android SDK
RUN apt-get update && apt-get install -y \
    openjdk-11-jdk \
    wget \
    unzip \
    git \
    curl \
    && rm -rf /var/lib/apt/lists/*

# 设置 JAVA_HOME
ENV JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64
ENV PATH=$PATH:$JAVA_HOME/bin

# 安装 Android SDK
RUN mkdir -p /opt/android-sdk/cmdline-tools \
    && cd /opt/android-sdk/cmdline-tools \
    && wget -q https://dl.google.com/android/repository/commandlinetools-linux-9477386_latest.zip -O cmdline-tools.zip \
    && unzip -q cmdline-tools.zip \
    && mv cmdline-tools latest \
    && rm cmdline-tools.zip

ENV ANDROID_HOME=/opt/android-sdk
ENV PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools

# 接受 Android SDK 许可
RUN yes | $ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager --licenses || true

# 安装 Android SDK 组件
RUN $ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager \
    "platform-tools" \
    "platforms;android-33" \
    "build-tools;33.0.0" \
    "ndk;23.1.7779620"

# 设置工作目录
WORKDIR /app

# 复制项目文件
COPY . /app

# 安装 Node.js 依赖
RUN npm install

# 构建 Android 项目
RUN npx expo prebuild --platform android

# 构建 APK
WORKDIR /app/android
RUN ./gradlew assembleDebug --no-daemon

# 复制 APK 到输出目录
RUN mkdir -p /output
RUN cp app/build/outputs/apk/debug/app-debug.apk /output/SyncNotes.apk

WORKDIR /output
CMD ["ls", "-lh"]
