
import { type UserDataManage } from '@/user'
import { NoteDataManage } from './noteDataManage'
import { NoteSnapshotDataManage } from './snapshotDataManage'
import { toMD5 } from '@/utils'

export class NoteManage {
  snapshotDataManage: NoteSnapshotDataManage
  noteDataManage: NoteDataManage

  constructor(userDataManage: UserDataManage) {
    this.snapshotDataManage = new NoteSnapshotDataManage(userDataManage)
    this.noteDataManage = new NoteDataManage(userDataManage)
  }

  createSnapshot = async () =&gt; {
    const noteData = {
      noteList: await this.noteDataManage.getNoteList(),
      noteVersion: this.noteDataManage.getNoteVersion(),
    }
    const data = JSON.stringify(noteData)
    const md5 = toMD5(data)
    const snapshotInfo = await this.snapshotDataManage.getSnapshotInfo()
    if (snapshotInfo.latest == md5) return md5
    if (snapshotInfo.list.includes(md5)) {
      snapshotInfo.list.splice(snapshotInfo.list.indexOf(md5), 1)
    } else await this.snapshotDataManage.saveSnapshot(md5, data)
    if (snapshotInfo.latest) snapshotInfo.list.unshift(snapshotInfo.latest)
    snapshotInfo.latest = md5
    snapshotInfo.time = Date.now()
    this.snapshotDataManage.saveSnapshotInfo(snapshotInfo)
    return md5
  }

  getCurrentNoteInfoKey = async () =&gt; {
    const snapshotInfo = await this.snapshotDataManage.getSnapshotInfo()
    if (snapshotInfo.latest) return snapshotInfo.latest
    return this.createSnapshot()
  }

  getDeviceCurrentSnapshotKey = async (clientId: string) =&gt; {
    return this.snapshotDataManage.getDeviceCurrentSnapshotKey(clientId)
  }

  updateDeviceSnapshotKey = async (clientId: string, key: string) =&gt; {
    await this.snapshotDataManage.updateDeviceSnapshotKey(clientId, key)
  }

  removeDevice = async (clientId: string) =&gt; {
    this.snapshotDataManage.removeSnapshotInfo(clientId)
  }

  getNoteList = async () =&gt; {
    return await this.noteDataManage.getNoteList()
  }

  getNote = async (id: string) =&gt; {
    return await this.noteDataManage.getNote(id)
  }

  addNote = async (note: any) =&gt; {
    return await this.noteDataManage.addNote(note)
  }

  updateNote = async (id: string, note: any) =&gt; {
    await this.noteDataManage.updateNote(id, note)
  }

  deleteNote = async (id: string) =&gt; {
    await this.noteDataManage.deleteNote(id)
  }

  getNoteVersion = () =&gt; {
    return this.noteDataManage.getNoteVersion()
  }

  getSnapshotList = async () =&gt; {
    return this.snapshotDataManage.getSnapshotListWithMeta()
  }

  getSnapshot = async (name: string) =&gt; {
    return this.snapshotDataManage.getSnapshot(name)
  }

  restoreSnapshot = async (name: string) =&gt; {
    const noteData = await this.snapshotDataManage.getSnapshot(name)
    if (!noteData) throw new Error('Snapshot not found')
    await this.noteDataManage.restore(noteData)

    this.snapshotDataManage.clearClients()
    this.snapshotDataManage.setLatest(name)
  }

  removeSnapshot = async (name: string) =&gt; {
    await this.snapshotDataManage.removeSnapshot(name)
  }
}
