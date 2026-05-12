# SyncNotes - 跨平台数据同步笔记应用

## 1. Project Overview

**Project Name:** SyncNotes
**Project Type:** Cross-platform mobile and web application with real-time data synchronization
**Core Functionality:** A note-taking application that allows users to create, edit, and manage notes on both Android and Web platforms with real-time data synchronization.

**Target Users:** Users who need to access and manage their notes across multiple devices (Android phones, tablets, and web browsers).

**Technical Stack:**
- **Backend:** Node.js + Express.js
- **Database:** SQLite (lightweight, no external dependencies)
- **Android App:** React Native with Expo
- **Web App:** React with Vite
- **Real-time Sync:** Socket.IO for live data synchronization

---

## 2. Backend API Specification

### Base URL
- Development: `http://localhost:3000/api`

### API Endpoints

#### Notes Management

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|-------------|----------|
| GET | `/notes` | Get all notes | - | `{ notes: Note[] }` |
| GET | `/notes/:id` | Get single note | - | `{ note: Note }` |
| POST | `/notes` | Create new note | `{ title, content }` | `{ note: Note }` |
| PUT | `/notes/:id` | Update note | `{ title?, content? }` | `{ note: Note }` |
| DELETE | `/notes/:id` | Delete note | - | `{ success: true }` |

#### Data Sync

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|-------------|----------|
| GET | `/sync/status` | Get sync status | - | `{ lastSync, noteCount }` |
| POST | `/sync/pull` | Pull changes since timestamp | `{ since: timestamp }` | `{ notes: Note[], deletedIds: string[] }` |
| POST | `/sync/push` | Push local changes | `{ notes: Note[], deletedIds: string[] }` | `{ success: true, conflicts: Note[] }` |

### Data Models

#### Note
```typescript
{
  id: string;           // UUID
  title: string;        // Note title (max 200 chars)
  content: string;      // Note content (max 10000 chars)
  createdAt: string;   // ISO 8601 timestamp
  updatedAt: string;    // ISO 8601 timestamp
  isDeleted: boolean;   // Soft delete flag for sync
  version: number;      // Version for conflict resolution
}
```

### Authentication
- No authentication for demo purposes (local network usage)
- Production would require JWT tokens

### Error Handling
- HTTP 400: Bad Request (validation errors)
- HTTP 404: Not Found
- HTTP 500: Internal Server Error
- All errors return: `{ error: string, details?: any }`

---

## 3. UI/UX Specification

### Visual Design

#### Color Palette
- **Primary:** #6366F1 (Indigo)
- **Primary Dark:** #4F46E5
- **Secondary:** #10B981 (Emerald)
- **Background:** #F9FAFB (Light gray)
- **Surface:** #FFFFFF (White)
- **Text Primary:** #111827 (Gray 900)
- **Text Secondary:** #6B7280 (Gray 500)
- **Danger:** #EF4444 (Red)
- **Border:** #E5E7EB (Gray 200)

#### Typography
- **Font Family:** System default (San Francisco on iOS, Roboto on Android)
- **Heading 1:** 24px, font-weight 700
- **Heading 2:** 20px, font-weight 600
- **Body:** 16px, font-weight 400
- **Caption:** 14px, font-weight 400

#### Spacing System (8pt grid)
- **xs:** 4px
- **sm:** 8px
- **md:** 16px
- **lg:** 24px
- **xl:** 32px

### Platform-Specific Considerations

#### Android
- Material Design 3 principles
- Bottom navigation bar
- FAB (Floating Action Button) for creating notes
- Swipe-to-delete with undo option
- Pull-to-refresh for sync
- Status bar: light content on primary color

#### Web
- Responsive design (mobile-first)
- Max content width: 600px (centered)
- Hover states for interactive elements
- Keyboard shortcuts (Ctrl/Cmd + N for new note)

### Screen Structure

#### Android App Screens

1. **Notes List Screen (Home)**
   - App bar with title "SyncNotes"
   - Sync status indicator (last synced time)
   - List of note cards showing title, preview, and date
   - FAB button for creating new note
   - Pull-to-refresh gesture
   - Empty state when no notes

2. **Note Editor Screen**
   - Back navigation
   - Title input (single line)
   - Content input (multiline, auto-expand)
   - Save button in app bar
   - Delete button in app bar
   - Auto-save indicator

3. **Settings Screen (accessible from menu)**
   - Sync settings
   - App version info

#### Web App Screens

1. **Notes List Page**
   - Header with app name and sync status
   - List layout (same as mobile)
   - Create button
   - Quick actions on hover

2. **Note Editor Page**
   - Modal or dedicated page
   - Full-screen editor
   - Save/Cancel actions

### Navigation Structure
- **Android:** Bottom Tab Navigator (Notes, Settings) with Stack Navigator for editor
- **Web:** Single-page app with modal for editor

### Components

#### NoteCard
- Title (truncated to 1 line)
- Content preview (truncated to 2 lines)
- Updated date
- States: default, pressed (slight scale down), swipe-active

#### NoteEditor
- Title input
- Content textarea
- States: editing, saving, saved

#### SyncIndicator
- Shows sync status
- States: synced, syncing (spinner), error

#### FAB (Android)
- Circular button
- Plus icon
- Shadow elevation

---

## 4. Functionality Specification

### Core Features

#### P0 - Essential (Must Have)
1. **Create Note** - Create new note with title and content
2. **View Notes** - List all notes sorted by updated date
3. **Edit Note** - Modify existing note title and content
4. **Delete Note** - Remove note with confirmation
5. **Real-time Sync** - Automatic sync between Android and Web via Socket.IO
6. **Offline Support** - Cache notes locally for offline viewing
7. **Pull-to-Refresh** - Manual sync trigger on Android

#### P1 - Important
1. **Note Search** - Filter notes by title/content
2. **Sync Status** - Visual indicator of sync state
3. **Conflict Resolution** - Handle sync conflicts (last-write-wins)

### User Interactions and Flows

#### Create Note Flow
1. User taps FAB/Create button
2. Editor opens with empty fields
3. User enters title and content
4. User taps Save or auto-save triggers
5. Note syncs to server and other devices
6. User returns to list (auto-save)

#### Edit Note Flow
1. User taps on note in list
2. Editor opens with existing data
3. User modifies content
4. Changes auto-save
5. Note syncs to server

#### Delete Note Flow
1. User swipes note or taps delete in editor
2. Confirmation dialog appears
3. User confirms deletion
4. Note removed locally and synced
5. Undo snackbar appears for 5 seconds

#### Sync Flow
1. On app start, pull latest changes
2. On changes, push to server
3. Server broadcasts to all connected clients
4. Clients update local cache
5. Visual feedback shows sync status

### Data Handling

#### Local Storage (Android)
- Use AsyncStorage for caching notes
- Store last sync timestamp
- Queue offline changes for sync

#### State Management
- React Context for global state
- Local state for component-specific UI

#### API Communication
- REST API for CRUD operations
- Socket.IO for real-time updates
- Exponential backoff for retry logic

### Edge Cases

1. **No Network:** Show cached notes, queue changes, indicate offline status
2. **Sync Conflict:** Use last-write-wins with version check
3. **Large Content:** Truncate preview, lazy load full content
4. **Rapid Edits:** Debounce auto-save (500ms)
5. **App Backgrounded:** Save immediately before background

---

## 5. Technical Specification

### Backend Dependencies
```json
{
  "express": "^4.18.2",
  "socket.io": "^4.7.2",
  "better-sqlite3": "^9.2.2",
  "cors": "^2.8.5",
  "uuid": "^9.0.1"
}
```

### Android Dependencies
```json
{
  "expo": "~49.0.0",
  "@react-navigation/native": "^6.1.9",
  "@react-navigation/bottom-tabs": "^6.5.11",
  "@react-navigation/native-stack": "^6.9.17",
  "react-native-screens": "~3.29.0",
  "react-native-safe-area-context": "4.7.4",
  "socket.io-client": "^4.7.2",
  "@react-native-async-storage/async-storage": "1.21.0",
  "expo-status-bar": "~1.6.0",
  "react-native-gesture-handler": "~2.14.0",
  "expo Constants": "~11.3.0"
}
```

### Web Dependencies
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.20.0",
  "socket.io-client": "^4.7.2",
  "axios": "^1.6.2",
  "vite": "^5.0.0"
}
```

### Project Structure

```
/workspace/syncnotes/
├── backend/
│   ├── src/
│   │   ├── index.js          # Server entry point
│   │   ├── routes/
│   │   │   └── notes.js      # Notes API routes
│   │   ├── db/
│   │   │   └── database.js   # SQLite setup
│   │   └── socket/
│   │       └── handler.js    # Socket.IO handlers
│   └── package.json
├── android/                  # Expo/React Native app
│   ├── App.jsx
│   ├── src/
│   │   ├── screens/
│   │   │   ├── NotesListScreen.jsx
│   │   │   ├── NoteEditorScreen.jsx
│   │   │   └── SettingsScreen.jsx
│   │   ├── components/
│   │   │   ├── NoteCard.jsx
│   │   │   ├── SyncIndicator.jsx
│   │   │   └── FAB.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── socket.js
│   │   ├── context/
│   │   │   └── NotesContext.jsx
│   │   └── utils/
│   │       └── storage.js
│   ├── app.json
│   └── package.json
├── web/                      # React web app
│   ├── src/
│   │   ├── App.jsx
│   │   ├── pages/
│   │   │   ├── NotesPage.jsx
│   │   │   └── NoteEditorModal.jsx
│   │   ├── components/
│   │   │   ├── NoteCard.jsx
│   │   │   └── SyncIndicator.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── socket.js
│   │   └── context/
│   │       └── NotesContext.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── SPEC.md
```

### Asset Requirements
- App icon (1024x1024 for Android)
- No external fonts (use system defaults)
- No external images (use system icons or simple shapes)
