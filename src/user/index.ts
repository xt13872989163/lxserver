import { UserDataManage } from './data'
import {
  ListManage,
  DislikeManage,
  NoteManage,
} from '@/modules'

export interface UserSpace {
  dataManage: UserDataManage
  listManage: ListManage
  dislikeManage: DislikeManage
  noteManage: NoteManage
  getDecices: () =&gt; Promise&lt;LX.Sync.KeyInfo[]&gt;
  removeDevice: (clientId: string) =&gt; Promise&lt;void&gt;
}
const users = new Map<string, UserSpace>()
const renamingUsers = new Set<string>()

const delayTime = 60 * 60 * 1000 // 延长到 1 小时
const delayReleaseTimeouts = new Map<string, NodeJS.Timeout>()
const clearDelayReleaseTimeout = (userName: string) => {
  if (!delayReleaseTimeouts.has(userName)) return

  clearTimeout(delayReleaseTimeouts.get(userName))
  delayReleaseTimeouts.delete(userName)
}
const seartDelayReleaseTimeout = (userName: string) => {
  clearDelayReleaseTimeout(userName)
  delayReleaseTimeouts.set(userName, setTimeout(() => {
    users.delete(userName)
  }, delayTime))
}

export const getUserSpace = (userName: string) =&gt; {
  if (renamingUsers.has(userName)) {
    throw new Error(`User ${userName} is being renamed, access denied temporarily`)
  }
  clearDelayReleaseTimeout(userName)

  let user = users.get(userName)
  if (!user) {
    console.log('new user data manage:', userName)
    const dataManage = new UserDataManage(userName)
    const listManage = new ListManage(dataManage)
    const dislikeManage = new DislikeManage(dataManage)
    const noteManage = new NoteManage(dataManage)
    users.set(userName, user = {
      dataManage,
      listManage,
      dislikeManage,
      noteManage,
      async getDecices() {
        return this.dataManage.getAllClientKeyInfo()
      },
      async removeDevice(clientId) {
        await listManage.removeDevice(clientId)
        await noteManage.removeDevice(clientId)
        await dataManage.removeClientKeyInfo(clientId)
      },
    })
  }
  return user
}

export const releaseUserSpace = (userName: string, force = false) => {
  if (force) {
    clearDelayReleaseTimeout(userName)
    users.delete(userName)
  } else seartDelayReleaseTimeout(userName)
}

/**
 * 重命名用户空间缓存并加锁
 * @param oldName 旧用户名
 */
export const renameUserSpace = (oldName: string) => {
  clearDelayReleaseTimeout(oldName)
  users.delete(oldName)
  renamingUsers.add(oldName)
}

/**
 * 解除重命名锁定
 * @param oldName 旧用户名
 */
export const finishRenameUserSpace = (oldName: string) => {
  renamingUsers.delete(oldName)
}


export * from './data'
