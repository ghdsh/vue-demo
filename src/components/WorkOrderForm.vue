<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import type { WorkOrder, WorkOrderStatus } from "../types/workOrder";

const props = defineProps<{
  modelValue: boolean; // controls dialog visibility (v-model)
  workOrder?: WorkOrder;
}>();

const emit = defineEmits<{
  "update:modelValue": [v: boolean];
  save: [data: Omit<WorkOrder, "id">];
}>();

const formRef = ref<FormInstance>();

const form = reactive<Omit<WorkOrder, "id">>({
  project: "",
  overtime: false,
  hours: 0,
  created_at: new Date().toISOString().slice(0, 16).replace("T", " "),
  status: "pending",
});

watch(
  () => props.workOrder,
  (wo) => {
    if (wo) {
      form.project = wo.project;
      form.overtime = wo.overtime;
      form.hours = wo.hours;
      form.created_at = wo.created_at;
      form.status = wo.status;
    } else {
      form.project = "";
      form.overtime = false;
      form.hours = 0;
      form.created_at = new Date().toISOString().slice(0, 16).replace("T", " ");
      form.status = "pending";
    }
  },
  { immediate: true },
);

const statusOptions: { value: WorkOrderStatus; label: string }[] = [
  { value: "pending", label: "待处理" },
  { value: "in_progress", label: "进行中" },
  { value: "completed", label: "已完成" },
];

const rules: FormRules = {
  project: [{ required: true, message: "请输入项目名称", trigger: "blur" }],
  hours: [
    {
      required: true,
      type: "number",
      min: 0,
      message: "请输入有效工时",
      trigger: "change",
    },
  ],
  status: [{ required: true, message: "请选择状态", trigger: "change" }],
};

function close() {
  formRef.value?.resetFields();
  emit("update:modelValue", false);
}

async function submit() {
  try {
    await formRef.value?.validate();
    emit("save", { ...form });
    close();
  } catch {
    // validation failed — el-form shows inline errors
  }
}
</script>

<template>
  <el-dialog
    :model-value="modelValue"
    :title="workOrder ? '编辑工单' : '新建工单'"
    width="480px"
    :close-on-click-modal="false"
    destroy-on-close
    @update:model-value="emit('update:modelValue', $event)"
    @closed="formRef?.resetFields()">
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="88px"
      label-position="left">
      <el-form-item label="项目名称" prop="project">
        <el-input
          v-model="form.project"
          placeholder="Road Project A"
          clearable />
      </el-form-item>

      <el-form-item label="工时 (h)" prop="hours">
        <el-input-number
          v-model="form.hours"
          :min="0"
          :step="0.5"
          :precision="1"
          style="width: 100%"
          controls-position="right" />
      </el-form-item>

      <el-form-item label="状态" prop="status">
        <el-select v-model="form.status" style="width: 100%">
          <el-option
            v-for="opt in statusOptions"
            :key="opt.value"
            :value="opt.value"
            :label="opt.label" />
        </el-select>
      </el-form-item>

      <el-form-item label="创建时间">
        <el-date-picker
          v-model="form.created_at"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm"
          format="YYYY-MM-DD HH:mm"
          placeholder="选择日期时间"
          style="width: 100%" />
      </el-form-item>

      <el-form-item label="是否">
        <el-switch
          v-model="form.overtime"
          active-text="是"
          inactive-text="否" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="submit">保存</el-button>
    </template>
  </el-dialog>
</template>
