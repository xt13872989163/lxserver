#!/bin/bash

# SyncNotes Android 快速构建脚本 (用于本地计算机使用
# 在您自己的电脑上运行此脚本

set -e

echo "=========================================="
echo "  SyncNotes Android 快速构建"
echo "=========================================="
echo ""
echo "此脚本将在您的本地计算机上构建APK"
echo ""

# 检查环境
echo "[1/5] 检查环境..."

if ! command -v node &> /dev/null; then
    echo "错误: 需要安装 Node.js 16+"
    exit 1
fi

if ! command -v java &> /dev/null; then
    echo "错误: 需要安装 Java JDK 17+"
    exit 1
fi

NODE_VERSION=$(node --version)
JAVA_VERSION=$(java -version 2>&1 | head -1)
echo "Node.js: $NODE_VERSION"
echo "Java: $JAVA_VERSION"
echo ""

# 设置项目目录
PROJECT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )/android"
cd "$PROJECT_DIR"
echo "[2/5] 进入项目目录: $PROJECT_DIR"

# 安装依赖
echo "[3/5] 安装依赖..."
if [ ! -d "node_modules" ]; then
    npm install
fi

# 预构建 JS bundle
echo "[4/5] 预构建 JS bundle..."
if [ ! -d "dist" ]; then
    npx expo export --platform android
fi

# 构建 APK
echo "[5/5] 构建 APK..."
cd android
./gradlew assembleDebug

# 检查结果
APK_PATH="app/build/outputs/apk/debug/app-debug.apk"
if [ -f "$APK_PATH" ]; then
    echo ""
    echo "=========================================="
    echo "  ✅ 构建成功!"
    echo "=========================================="
    echo ""
    echo "APK 位置: $PROJECT_DIR/android/$APK_PATH"
    cp "$APK_PATH" "$PROJECT_DIR/SyncNotes-debug.apk
    echo "已复制到: $PROJECT_DIR/SyncNotes-debug.apk"
    echo ""
    SIZE=$(du -h "$PROJECT_DIR/SyncNotes-debug.apk" | cut -f1)
    echo "大小: $SIZE"
    echo ""
    echo "现在可以安装到您的 Android 设备上了!"
else
    echo ""
    echo "❌ 构建失败"
    exit 1
fi
