<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { Search, Plus } from "@element-plus/icons-vue";
import type { WorkOrder, WorkOrderStatus } from "../types/workOrder";
import { useWorkOrders, STATUS_LABELS } from "../composables/useWorkOrders";
import { useAuthStore } from "../stores/auth";
import { message } from "../utils/message";
import WorkOrderForm from "./WorkOrderForm.vue";
import WorkOrderChart from "./WorkOrderChart.vue";

const authStore = useAuthStore();
const { workOrders, add, update, remove } = useWorkOrders();

// ── Filtering ────────────────────────────────────────────────────────────────
const search = ref("");
const activeStatus = ref<WorkOrderStatus | "all">("all");

const statusTabs = [
  { value: "all" as const, label: "全部" },
  { value: "pending" as const, label: "待处理" },
  { value: "in_progress" as const, label: "进行中" },
  { value: "completed" as const, label: "已完成" },
];

// filtered is passed to BOTH the table and the chart
const filtered = computed(() => {
  let list = workOrders.value;
  if (activeStatus.value !== "all") {
    list = list.filter((w: WorkOrder) => w.status === activeStatus.value);
  }
  const q = search.value.trim().toLowerCase();
  if (q)
    list = list.filter(
      (w: WorkOrder) => w.project.toLowerCase().includes(q) || w.id.includes(q),
    );
  return list;
});

// ── Pagination ────────────────────────────────────────────────────────────────
const currentPage = ref(1);
const pageSize = ref(10);

watch([search, activeStatus], () => {
  currentPage.value = 1;
});

const paginated = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filtered.value.slice(start, start + pageSize.value);
});

// ── CRUD ─────────────────────────────────────────────────────────────────────
const showForm = ref(false);
const editTarget = ref<WorkOrder | undefined>(undefined);

function openCreate() {
  editTarget.value = undefined;
  showForm.value = true;
}

function openEdit(row: WorkOrder) {
  editTarget.value = { ...row };
  showForm.value = true;
}

function onSave(data: Omit<WorkOrder, "id">) {
  if (editTarget.value) {
    update({ ...data, id: editTarget.value.id });
    message.success("工单已更新");
  } else {
    add(data);
    message.success("工单已创建");
  }
}

function onDelete(id: string) {
  remove(id);
  message.success("工单已删除");
}

// ── Status tag type ───────────────────────────────────────────────────────────
type TagType = "primary" | "success" | "warning" | "danger" | "info";

const STATUS_TAG: Record<WorkOrderStatus, TagType> = {
  pending: "warning",
  in_progress: "primary",
  completed: "success",
};

// Fixed table body scroll height (px). Keeps layout stable regardless of row count.
const tableMaxHeight = 480;
</script>

<template>
  <div class="list-card">
    <!-- Toolbar -->
    <div class="toolbar">
      <el-radio-group v-model="activeStatus" size="default">
        <el-radio-button
          v-for="tab in statusTabs"
          :key="tab.value"
          :value="tab.value">
          {{ tab.label }}
        </el-radio-button>
      </el-radio-group>

      <div class="toolbar-right">
        <el-input
          v-model="search"
          :prefix-icon="Search"
          placeholder="搜索项目 / ID"
          clearable
          style="width: 220px" />
        <el-button
          type="primary"
          :icon="Plus"
          @click="openCreate"
          :disabled="authStore.role !== 'admin'">
          新建工单
        </el-button>
      </div>
    </div>

    <!-- Body: table left, chart right -->
    <div class="body-wrap">
      <div class="table-col">
        <el-table
          :data="paginated"
          stripe
          style="width: 100%"
          :max-height="tableMaxHeight"
          :empty-text="
            search || activeStatus !== 'all' ? '没有匹配的工单' : '暂无工单数据'
          ">
          <el-table-column prop="id" label="ID" width="70">
            <template #default="{ row }">
              <span class="id-cell">{{ row.id }}</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="project"
            label="项目名称"
            min-width="110"
            show-overflow-tooltip />

          <el-table-column
            prop="hours"
            label="工时 (h)"
            width="110"
            sortable
            align="center" />

          <el-table-column label="加班" width="80" align="center">
            <template #default="{ row }">
              <el-tag
                :type="row.overtime ? 'danger' : 'info'"
                size="small"
                round
                effect="light">
                {{ row.overtime ? "Yes" : "No" }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column label="状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag
                :type="STATUS_TAG[row.status as WorkOrderStatus]"
                size="small"
                round
                effect="light">
                {{ STATUS_LABELS[row.status as WorkOrderStatus] }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column
            prop="created_at"
            label="创建时间"
            width="145"
            sortable>
            <template #default="{ row }">
              <span class="date-cell">{{ row.created_at }}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="操作"
            width="150"
            fixed="right"
            align="center">
            <template #default="{ row }">
              <el-button
                text
                type="primary"
                size="small"
                @click="openEdit(row)"
                :disabled="authStore.role !== 'admin'"
                >编辑</el-button
              >
              <el-popconfirm
                v-if="authStore.role === 'admin'"
                title="确认删除该工单？"
                confirm-button-text="删除"
                cancel-button-text="取消"
                confirm-button-type="danger"
                width="180"
                @confirm="onDelete(row.id)">
                <template #reference>
                  <el-button text type="danger" size="small">删除</el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- Chart receives the same filtered list as the table -->
      <div class="chart-col">
        <WorkOrderChart :workOrders="filtered" />
      </div>
    </div>

    <!-- Pagination -->
    <div class="pagination-wrap">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="filtered.length"
        :page-sizes="[5, 10, 15]"
        layout="total, sizes, prev, pager, next"
        background />
    </div>
  </div>

  <WorkOrderForm v-model="showForm" :workOrder="editTarget" @save="onSave" />
</template>

<style lang="scss" scoped>
.list-card {
  background: var(--bg-card);
  border-radius: 12px;
  box-shadow: var(--shadow-card);
  overflow: hidden;
  position: relative;
  transition:
    background-color 0.25s ease,
    box-shadow 0.25s ease;
}

// ── Toolbar ──────────────────────────────────────────────────────────────────
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  border-bottom: 1px solid var(--border-light);
  flex-wrap: wrap;
  gap: 10px;
  transition: border-color 0.25s ease;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

// ── Body (table left, chart right) ───────────────────────────────────────────
.body-wrap {
  display: flex;
  align-items: stretch;
}

.table-col {
  flex: 1 1 0;
  min-width: 0;
  overflow: hidden;

  :deep(.el-table) {
    --el-table-bg-color: var(--bg-card);
    --el-table-tr-bg-color: var(--bg-card);
    --el-table-header-bg-color: var(--bg-card-hover);
    --el-table-row-hover-bg-color: var(--bg-card-hover);
    --el-table-border-color: var(--border-light);
    --el-table-text-color: var(--text-primary);
    --el-table-header-text-color: var(--text-secondary);

    .el-table__inner-wrapper::before {
      background: var(--border-light);
    }
  }
}

.chart-col {
  flex: 0 0 450px;
  width: 450px;
  border-left: 1px solid var(--border-light);
  transition: border-color 0.25s ease;

  // chart-card fills the column; chart-body fills chart-card
  :deep(.chart-card) {
    height: 100%;
    border-radius: 0;
    box-shadow: none;
    display: flex;
    flex-direction: column;
    padding: 12px 12px 8px;
  }

  :deep(.chart-body) {
    flex: 1 1 0;
    min-height: 0;
    height: 0; // flex child — actual height comes from flex
  }
}

// ── Pagination ────────────────────────────────────────────────────────────────
.pagination-wrap {
  display: flex;
  justify-content: flex-end;
  padding: 10px 16px;
  border-top: 1px solid var(--border-light);
  transition: border-color 0.25s ease;
}

// ── Cell helpers ─────────────────────────────────────────────────────────────
.id-cell {
  font-family: "SF Mono", "Menlo", monospace;
  font-size: 12px;
  color: var(--text-secondary);
}

.date-cell {
  font-size: 13px;
  color: var(--text-secondary);
}

:deep(.el-radio-button__inner) {
  transition: all 0.15s ease;
}
</style>
