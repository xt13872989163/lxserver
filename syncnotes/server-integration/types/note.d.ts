
export interface Note {
  id: string
  title: string
  content: string
  createTime: number
  updateTime: number
  version: number
}

export interface NoteList {
  [noteId: string]: Note
}

export interface NoteSnapshot {
  noteList: NoteList
  noteVersion: number
  snapshotKey: string
  createTime: number
}

declare global {
  namespace LX {
    namespace Sync {
      interface SyncData {
        noteList?: NoteList
        noteVersion?: number
      }
      interface Action {
        note?: {
          action: string
          data: Note | Note[]
        }
      }
      interface ModuleReadys {
        note?: boolean
      }
    }
  }
}

export { }
