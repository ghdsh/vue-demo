<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import { useAuthStore } from '../stores/auth'
import { useThemeStore } from '../stores/theme'

const router = useRouter()
const auth = useAuthStore()
const theme = useThemeStore()

const formRef = ref<FormInstance>()
const form = reactive({ username: '', password: '' })
const error = ref('')
const loading = ref(false)

const rules: FormRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码',   trigger: 'blur' }],
}

async function submit() {
  error.value = ''
  try {
    await formRef.value?.validate()
  } catch {
    return
  }
  loading.value = true
  await new Promise(r => setTimeout(r, 300))
  const ok = auth.login(form.username.trim(), form.password)
  loading.value = false
  if (ok) {
    router.push('/')
  } else {
    error.value = '用户名或密码错误，请重试'
    form.password = ''
  }
}
</script>

<template>
  <div class="page">
    <!-- Theme toggle -->
    <button
      class="btn-theme"
      :title="theme.isDark ? '切换亮色模式' : '切换暗色模式'"
      @click="theme.toggle()"
    >
      <svg v-if="theme.isDark" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="5"/>
        <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
        <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
      </svg>
      <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
      </svg>
    </button>

    <div class="card">
      <div class="card-header">
        <div class="logo-mark">工单</div>
        <h1 class="card-title">工单管理系统</h1>
        <p class="card-sub">请登录以继续</p>
      </div>

      <el-form ref="formRef" :model="form" :rules="rules" @submit.prevent="submit">
        <el-form-item prop="username">
          <el-input
            v-model="form.username"
            :prefix-icon="User"
            placeholder="用户名"
            size="large"
            autocomplete="username"
            @keyup.enter="submit"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            :prefix-icon="Lock"
            type="password"
            placeholder="密码"
            size="large"
            show-password
            autocomplete="current-password"
            @keyup.enter="submit"
          />
        </el-form-item>

        <el-alert
          v-if="error"
          :title="error"
          type="error"
          show-icon
          :closable="false"
          style="margin-bottom: 16px"
        />

        <el-button
          type="primary"
          size="large"
          :loading="loading"
          style="width: 100%"
          @click="submit"
        >
          {{ loading ? '登录中…' : '登录' }}
        </el-button>
      </el-form>

      <!-- Test accounts -->
      <div class="hint">
        <p class="hint-title">测试账号</p>
        <div class="hint-row">
          <el-tag type="primary" size="small" round>admin</el-tag>
          <code>admin</code> / <code>admin123</code>
          <span class="perm">可删除工单</span>
        </div>
        <div class="hint-row">
          <el-tag type="info" size="small" round>user</el-tag>
          <code>user</code> / <code>user123</code>
          <span class="perm">只读</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page {
  position: relative;
  min-height: 100vh;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.btn-theme {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 50%;
  background: transparent;
  color: #f5f5f7;
  transition: background 0.15s ease;

  &:hover { background: rgba(255, 255, 255, 0.12); }
}

.card {
  background: var(--bg-card);
  border-radius: 18px;
  padding: 40px;
  width: 420px;
  max-width: 100%;
  box-shadow: var(--shadow-login);
  transition: background-color 0.25s ease;
}

.card-header {
  text-align: center;
  margin-bottom: 28px;
}

.logo-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  background: var(--accent);
  color: #fff;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 14px;
}

.card-title {
  font-size: 21px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 6px;
}

.card-sub {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
}

// Remove bottom margin from last form-item
:deep(.el-form-item:last-of-type) { margin-bottom: 16px; }

.hint {
  margin-top: 24px;
  padding: 14px 16px;
  background: var(--bg-hint);
  border-radius: 10px;
  transition: background-color 0.25s ease;

  &-title {
    font-size: 11px;
    font-weight: 600;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin: 0 0 10px;
  }

  &-row {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: var(--text-primary);
    margin-bottom: 6px;

    &:last-child { margin-bottom: 0; }

    code {
      background: var(--code-bg);
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 12px;
      transition: background-color 0.25s ease;
    }
  }
}

.perm {
  font-size: 12px;
  color: var(--text-secondary);
  margin-left: auto;
}
</style>
