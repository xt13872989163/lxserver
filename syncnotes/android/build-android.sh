#!/bin/bash

# SyncNotes Android 构建脚本
# 使用方法: ./build-android.sh

set -e

echo "================================"
echo "  SyncNotes Android 构建脚本"
echo "================================"

# 检查环境
echo "检查环境..."

if ! command -v node &> /dev/null; then
    echo "错误: 需要安装 Node.js"
    exit 1
fi

if ! command -v java &> /dev/null; then
    echo "错误: 需要安装 Java JDK"
    exit 1
fi

NODE_VERSION=$(node --version)
JAVA_VERSION=$(java -version 2>&1 | head -1)
echo "Node.js: $NODE_VERSION"
echo "Java: $JAVA_VERSION"

# 设置 JAVA_HOME
if [ -z "$JAVA_HOME" ]; then
    if [ -d "/usr/lib/jvm/java-11-openjdk-amd64" ]; then
        export JAVA_HOME="/usr/lib/jvm/java-11-openjdk-amd64"
    elif [ -d "/usr/lib/jvm/java-17-openjdk-amd64" ]; then
        export JAVA_HOME="/usr/lib/jvm/java-17-openjdk-amd64"
    fi
    echo "设置 JAVA_HOME=$JAVA_HOME"
fi

# 进入 Android 目录
cd "$(dirname "$0")/android"

# 步骤 1: 安装依赖
echo ""
echo "步骤 1: 安装 npm 依赖..."
npm install

# 步骤 2: 生成原生项目
echo ""
echo "步骤 2: 生成 Android 原生项目..."
npx expo prebuild --platform android --clean

# 步骤 3: 构建 APK
echo ""
echo "步骤 3: 构建 Debug APK..."
cd android

# 使用阿里云镜像
export GRADLE_MIRROR="https://mirrors.aliyun.com/macports/distfiles/gradle/"

./gradlew assembleDebug --no-daemon

# 检查 APK 是否生成
if [ -f "app/build/outputs/apk/debug/app-debug.apk" ]; then
    echo ""
    echo "✅ 构建成功！"
    echo "APK 文件位置: app/build/outputs/apk/debug/app-debug.apk"
    
    # 复制到根目录
    cp app/build/outputs/apk/debug/app-debug.apk ../
    echo "已复制到: ../SyncNotes-debug.apk"
    
    # 显示文件大小
    SIZE=$(du -h ../SyncNotes-debug.apk | cut -f1)
    echo "APK 大小: $SIZE"
else
    echo ""
    echo "❌ 构建失败: 未找到 APK 文件"
    exit 1
fi

echo ""
echo "================================"
echo "  构建完成！"
echo "================================"
