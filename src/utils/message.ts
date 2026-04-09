import { ElMessage } from 'element-plus'
import type { MessageOptions } from 'element-plus'

type MessageType = 'success' | 'warning' | 'info' | 'error'

function show(type: MessageType, opts: string | MessageOptions) {
  const base: MessageOptions = { offset: 20, grouping: true }
  if (typeof opts === 'string') {
    ElMessage({ ...base, type, message: opts })
  } else {
    ElMessage({ ...base, ...opts, type })
  }
}

export const message = {
  success: (opts: string | MessageOptions) => show('success', opts),
  warning: (opts: string | MessageOptions) => show('warning', opts),
  info:    (opts: string | MessageOptions) => show('info',    opts),
  error:   (opts: string | MessageOptions) => show('error',   opts),
}
