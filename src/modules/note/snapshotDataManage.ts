
import { type UserDataManage } from '@/user'
import { toMD5 } from '@/utils'
import type { Note, NoteList, NoteSnapshot } from '@/types/note'

export class NoteSnapshotDataManage {
  private userDataManage: UserDataManage

  constructor(userDataManage: UserDataManage) {
    this.userDataManage = userDataManage
  }

  async getSnapshotInfo(): Promise&lt;{
    latest?: string
    list: string[]
    time: number
    devices: { [clientId: string]: string }
  }&gt; {
    const data = await this.userDataManage.getUserData('note_snapshot_info')
    if (!data) {
      return {
        list: [],
        time: 0,
        devices: {},
      }
    }
    try {
      return JSON.parse(data)
    } catch {
      return {
        list: [],
        time: 0,
        devices: {},
      }
    }
  }

  async saveSnapshotInfo(info: any): Promise&lt;void&gt; {
    this.userDataManage.setUserData('note_snapshot_info', JSON.stringify(info))
  }

  async saveSnapshot(name: string, data: string): Promise&lt;void&gt; {
    this.userDataManage.setUserData(`note_snapshot_${name}`, data)
  }

  async getSnapshot(name: string): Promise&lt;{ noteList: NoteList, noteVersion: number } | null&gt; {
    const data = await this.userDataManage.getUserData(`note_snapshot_${name}`)
    if (!data) return null
    try {
      return JSON.parse(data)
    } catch {
      return null
    }
  }

  async removeSnapshot(name: string): Promise&lt;void&gt; {
    this.userDataManage.removeUserData(`note_snapshot_${name}`)
    const info = await this.getSnapshotInfo()
    const idx = info.list.indexOf(name)
    if (idx !== -1) info.list.splice(idx, 1)
    this.saveSnapshotInfo(info)
  }

  async getDeviceCurrentSnapshotKey(clientId: string): Promise&lt;string | null&gt; {
    const info = await this.getSnapshotInfo()
    return info.devices[clientId] || null
  }

  async updateDeviceSnapshotKey(clientId: string, key: string): Promise&lt;void&gt; {
    const info = await this.getSnapshotInfo()
    info.devices[clientId] = key
    this.saveSnapshotInfo(info)
  }

  async removeSnapshotInfo(clientId: string): Promise&lt;void&gt; {
    const info = await this.getSnapshotInfo()
    delete info.devices[clientId]
    this.saveSnapshotInfo(info)
  }

  async clearClients(): Promise&lt;void&gt; {
    const info = await this.getSnapshotInfo()
    info.devices = {}
    this.saveSnapshotInfo(info)
  }

  async setLatest(name: string): Promise&lt;void&gt; {
    const info = await this.getSnapshotInfo()
    info.latest = name
    this.saveSnapshotInfo(info)
  }

  async getSnapshotListWithMeta(): Promise&lt;{ snapshotKey: string, createTime: number }[]&gt; {
    const info = await this.getSnapshotInfo()
    return Promise.all(info.list.map(async (key) =&gt; {
      const snapshot = await this.getSnapshot(key)
      return {
        snapshotKey: key,
        createTime: 0,
      }
    }))
  }
}
