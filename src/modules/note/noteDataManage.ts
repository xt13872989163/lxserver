
import { type UserDataManage } from '@/user'
import { toMD5 } from '@/utils'
import type { Note, NoteList } from '@/types/note'

export class NoteDataManage {
  private userDataManage: UserDataManage
  private noteList: NoteList = {}
  private noteVersion: number = 0

  constructor(userDataManage: UserDataManage) {
    this.userDataManage = userDataManage
    this.init()
  }

  private async init() {
    const data = await this.userDataManage.getUserData('note')
    if (data) {
      try {
        const parsed = JSON.parse(data)
        this.noteList = parsed.noteList || {}
        this.noteVersion = parsed.noteVersion || 0
      } catch {
        this.noteList = {}
        this.noteVersion = 0
      }
    }
  }

  private save() {
    this.userDataManage.setUserData('note', JSON.stringify({
      noteList: this.noteList,
      noteVersion: this.noteVersion,
    }))
  }

  async getNoteList(): Promise&lt;NoteList&gt; {
    return this.noteList
  }

  async getNote(id: string): Promise&lt;Note | null&gt; {
    return this.noteList[id] || null
  }

  async addNote(note: Note): Promise&lt;string&gt; {
    this.noteList[note.id] = note
    this.noteVersion++
    this.save()
    return note.id
  }

  async updateNote(id: string, note: Partial&lt;Note&gt;): Promise&lt;void&gt; {
    if (!this.noteList[id]) return
    this.noteList[id] = {
      ...this.noteList[id],
      ...note,
      updateTime: Date.now(),
      version: (this.noteList[id].version || 0) + 1,
    }
    this.noteVersion++
    this.save()
  }

  async deleteNote(id: string): Promise&lt;void&gt; {
    if (!this.noteList[id]) return
    delete this.noteList[id]
    this.noteVersion++
    this.save()
  }

  async restore(noteData: { noteList: NoteList, noteVersion: number }): Promise&lt;void&gt; {
    this.noteList = noteData.noteList
    this.noteVersion = noteData.noteVersion
    this.save()
  }

  getNoteVersion(): number {
    return this.noteVersion
  }
}
