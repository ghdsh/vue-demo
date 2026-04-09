export type WorkOrderStatus = 'pending' | 'in_progress' | 'completed'

export interface WorkOrder {
  id: string
  project: string
  overtime: boolean
  hours: number
  created_at: string
  status: WorkOrderStatus
}
