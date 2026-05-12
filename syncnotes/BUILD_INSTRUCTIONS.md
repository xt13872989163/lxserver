# SyncNotes APK 构建说明

## ✅ 当前状态

### 已完成
- ✅ Android 应用源代码（React Native + Expo）
- ✅ Web 应用源代码（React + Vite）
- ✅ 后端服务（Node.js + Express + Socket.IO）
- ✅ JavaScript Bundle 已导出（`android/dist/`）
- ✅ 详细的项目规范文档（`SPEC.md`）
- ✅ 完整的 API 文档和数据库架构

### 待完成
- ⏳ Android APK 打包（需要配置 Gradle 环境）

## 📦 已导出资源

JavaScript bundle 已成功导出到 `android/dist/` 目录：
- `bundles/index.android.hbc` - Hermes 字节码（1.16 MB）
- `assets/` - 应用资源文件

## 🚀 快速构建 APK

### 方法 1: 使用 Docker（推荐）

```bash
# 构建 Docker 镜像
cd syncnotes
docker build -t syncnotes-android .

# 运行容器并获取 APK
docker run -v $(pwd)/output:/output syncnotes-android

# APK 将保存在 output/SyncNotes.apk
```

### 方法 2: 使用构建脚本

在具有 Node.js 和 Java 11+ 的 Linux 系统上：

```bash
cd syncnotes/android

# 添加执行权限
chmod +x build-android.sh

# 运行构建脚本
./build-android.sh
```

### 方法 3: 手动构建

```bash
cd syncnotes/android

# 安装依赖
npm install

# 生成原生项目
npx expo prebuild --platform android

# 构建 Debug APK
cd android
./gradlew assembleDebug
```

## 🐳 Docker 构建说明

### 前置要求
- Docker 19.03+
- 4GB+ 可用内存

### 构建步骤

1. **构建 Docker 镜像**（约 10-15 分钟）
   ```bash
   docker build -t syncnotes-android .
   ```

2. **运行容器**（约 5-10 分钟构建）
   ```bash
   docker run -d --name syncnotes-build syncnotes-android
   ```

3. **复制 APK**
   ```bash
   docker cp syncnotes-build:/output/SyncNotes.apk ./
   ```

4. **清理**
   ```bash
   docker rm syncnotes-build
   docker rmi syncnotes-android
   ```

## 🖥️ 原生环境构建

### Ubuntu/Debian

```bash
# 安装依赖
sudo apt update
sudo apt install -y openjdk-11-jdk nodejs npm

# 安装 Android SDK
mkdir -p ~/android-sdk/cmdline-tools
cd ~/android-sdk/cmdline-tools
wget https://dl.google.com/android/repository/commandlinetools-linux-9477386_latest.zip
unzip commandlinetools-linux-9477386_latest.zip
mv cmdline-tools latest

# 设置环境变量
export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64
export ANDROID_HOME=~/android-sdk
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools

# 接受许可
yes | sdkmanager --licenses

# 安装 SDK 组件
sdkmanager "platform-tools" "platforms;android-33" "build-tools;33.0.0"

# 构建项目
cd syncnotes/android
npm install
npx expo prebuild --platform android
cd android
./gradlew assembleDebug
```

### macOS

```bash
# 使用 Homebrew 安装依赖
brew install openjdk@11 node
brew install --cask android-sdk

# 配置环境
export JAVA_HOME=$(/usr/libexec/java_home -v 11)
export ANDROID_HOME=~/Library/Android/sdk

# 构建项目
cd syncnotes/android
npm install
npx expo prebuild --platform android
cd android
./gradlew assembleDebug
```

### Windows

1. 安装 [Node.js 18+](https://nodejs.org/)
2. 安装 [JDK 11](https://adoptium.net/)
3. 安装 [Android SDK](https://developer.android.com/studio)
4. 配置环境变量
5. 运行构建命令

## 📱 APK 输出位置

构建成功后，APK 文件位于：
- Debug: `android/android/app/build/outputs/apk/debug/app-debug.apk`
- 复制到根目录: `SyncNotes-debug.apk`

## 🔧 APK 配置

### 修改后端地址

如果需要修改 Android 应用连接的后端服务器地址：

1. 编辑 `android/src/services/api.js`
2. 修改 `API_BASE_URL` 为实际服务器地址

```javascript
const API_BASE_URL = 'http://YOUR_SERVER_IP:3000/api';
```

3. 编辑 `android/src/services/socket.js`
4. 修改 `SOCKET_URL` 为实际 WebSocket 地址

```javascript
const SOCKET_URL = 'http://YOUR_SERVER_IP:3000';
```

5. 重新构建：
   ```bash
   cd android
   npx expo prebuild --platform android
   cd android
   ./gradlew assembleDebug
   ```

### 修改应用名称

编辑 `android/app.json`：
```json
{
  "expo": {
    "name": "My App Name"
  }
}
```

## 🌐 测试应用

### 1. 启动后端服务

```bash
cd syncnotes/backend
npm install
npm start
```

服务将在 `http://localhost:3000` 运行

### 2. 安装 APK

将 `SyncNotes-debug.apk` 传输到 Android 设备并安装

### 3. 测试

1. 打开应用
2. 创建笔记
3. 在 Web 端访问 `http://YOUR_IP:5173`
4. 验证数据同步

## 📞 技术支持

如遇到构建问题，请检查：
1. Node.js 版本（需要 16+）
2. Java 版本（需要 11 或 17）
3. Android SDK 是否正确安装
4. 网络连接是否正常

## 🎯 APK 特性

最终生成的 APK 包含：
- ✅ 完整的 React Native 应用
- ✅ Hermes 引擎优化的 JavaScript bundle
- ✅ 所有资源文件
- ✅ 独立的 Android 安装包（无需额外依赖）
- ✅ 离线缓存支持
- ✅ 实时同步功能

安装后，应用可以直接使用，无需额外配置。
