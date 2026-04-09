import { ref } from 'vue'
import type { WorkOrder, WorkOrderStatus } from '../types/workOrder'

const mockData: WorkOrder[] = [
  { id: '001', project: 'Road Project A', overtime: true,  hours: 3.5,  created_at: '2024-04-10 10:30', status: 'completed' },
  { id: '002', project: 'Bridge Repair B', overtime: false, hours: 6.0,  created_at: '2024-04-11 09:00', status: 'in_progress' },
  { id: '003', project: 'Tunnel Inspection C', overtime: true,  hours: 8.0,  created_at: '2024-04-12 08:00', status: 'pending' },
  { id: '004', project: 'Road Project A', overtime: false, hours: 4.5,  created_at: '2024-04-13 14:00', status: 'completed' },
  { id: '005', project: 'Dam Maintenance D', overtime: true,  hours: 10.0, created_at: '2024-04-14 07:30', status: 'in_progress' },
  { id: '006', project: 'Highway E',        overtime: false, hours: 5.0,  created_at: '2024-04-15 11:00', status: 'pending' },
  { id: '007', project: 'Bridge Repair B',  overtime: false, hours: 3.0,  created_at: '2024-04-16 13:00', status: 'completed' },
  { id: '008', project: 'Tunnel Inspection C', overtime: true, hours: 7.5, created_at: '2024-04-17 08:30', status: 'in_progress' },
  { id: '009', project: 'Road Project A',   overtime: false, hours: 2.0,  created_at: '2024-04-18 09:30', status: 'pending' },
  { id: '010', project: 'Highway E',        overtime: true,  hours: 9.0,  created_at: '2024-04-19 10:00', status: 'completed' },
  { id: '011', project: 'Dam Maintenance D', overtime: false, hours: 6.5, created_at: '2024-04-20 08:00', status: 'pending' },
  { id: '012', project: 'Pipe Laying F',    overtime: true,  hours: 11.0, created_at: '2024-04-21 07:00', status: 'in_progress' },
  { id: '013', project: 'Pipe Laying F',    overtime: false, hours: 4.0,  created_at: '2024-04-22 12:00', status: 'completed' },
  { id: '014', project: 'Bridge Repair B',  overtime: true,  hours: 8.5,  created_at: '2024-04-23 09:00', status: 'pending' },
  { id: '015', project: 'Highway E',        overtime: false, hours: 5.5,  created_at: '2024-04-24 10:30', status: 'in_progress' },
  { id: '016', project: 'Road Project A',   overtime: false, hours: 3.0,  created_at: '2024-04-25 14:30', status: 'completed' },
  { id: '017', project: 'Tunnel Inspection C', overtime: true, hours: 9.5, created_at: '2024-04-26 08:00', status: 'pending' },
  { id: '018', project: 'Dam Maintenance D', overtime: false, hours: 7.0, created_at: '2024-04-27 09:00', status: 'in_progress' },
  { id: '019', project: 'Pipe Laying F',    overtime: true,  hours: 12.0, created_at: '2024-04-28 07:30', status: 'completed' },
  { id: '020', project: 'Highway E',        overtime: false, hours: 6.0,  created_at: '2024-04-29 11:00', status: 'pending' },
]

const workOrders = ref<WorkOrder[]>([...mockData])

let nextId = mockData.length + 1

function genId(): string {
  return String(nextId++).padStart(3, '0')
}

function add(data: Omit<WorkOrder, 'id'>): void {
  workOrders.value.unshift({ ...data, id: genId() })
}

function update(updated: WorkOrder): void {
  const idx = workOrders.value.findIndex((w: WorkOrder) => w.id === updated.id)
  if (idx !== -1) workOrders.value[idx] = updated
}

function remove(id: string): void {
  workOrders.value = workOrders.value.filter((w: WorkOrder) => w.id !== id)
}

export function useWorkOrders() {
  return { workOrders, add, update, remove }
}

export const STATUS_LABELS: Record<WorkOrderStatus, string> = {
  pending: '待处理',
  in_progress: '进行中',
  completed: '已完成',
}
