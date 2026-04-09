<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useThemeStore } from '../stores/theme'
import WorkOrderList from '../components/WorkOrderList.vue'
import { message } from '../utils/message'

const router = useRouter()
const auth = useAuthStore()
const theme = useThemeStore()

function handleLogout() {
  const name = auth.currentUser?.username
  auth.logout()
  message.success(`再见，${name}！`)
  router.push('/login')
}
</script>

<template>
  <!-- Nav — always dark -->
  <header class="nav">
    <div class="nav-inner">
      <span class="nav-title">工单管理系统</span>
      <div class="nav-right">
        <!-- Theme toggle -->
        <button
          class="btn-theme"
          :title="theme.isDark ? '切换亮色模式' : '切换暗色模式'"
          @click="theme.toggle()"
        >
          <!-- Sun: shown in dark mode -->
          <svg v-if="theme.isDark" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1"     x2="12" y2="3"/>
            <line x1="12" y1="21"    x2="12" y2="23"/>
            <line x1="4.22" y1="4.22"   x2="5.64"  y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1"  y1="12" x2="3"  y2="12"/>
            <line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22"  y1="19.78" x2="5.64"  y2="18.36"/>
            <line x1="18.36" y1="5.64"  x2="19.78" y2="4.22"/>
          </svg>
          <!-- Moon: shown in light mode -->
          <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        </button>

        <span class="role-badge" :class="auth.role === 'admin' ? 'badge-admin' : 'badge-user'">
          {{ auth.role }}
        </span>
        <span class="nav-username">{{ auth.currentUser?.username }}</span>
        <button class="btn-logout" @click="handleLogout">退出</button>
      </div>
    </div>
  </header>

  <!-- Main content -->
  <section class="content-section">
    <div class="container">
      <WorkOrderList />
    </div>
  </section>
</template>

<style lang="scss" scoped>
// ── Nav (always dark, independent of theme) ────────────────────────────────
.nav {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(0, 0, 0, 0.82);
  backdrop-filter: saturate(180%) blur(20px);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  height: 48px;
  display: flex;
  align-items: center;

  &-inner {
    max-width: 980px;
    margin: 0 auto;
    padding: 0 22px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &-title {
    font-size: 17px;
    font-weight: 600;
    color: #f5f5f7;
    letter-spacing: -0.374px;
  }

  &-right {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  &-username {
    font-size: 13px;
    color: #ebebf0;
    letter-spacing: -0.08px;
  }
}

.btn-theme {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 50%;
  background: transparent;
  color: #f5f5f7;
  transition: background 0.15s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.14);
  }
}

.role-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 980px;
  font-size: 11px;
  font-weight: 700;

  &.badge-admin {
    background: rgba(0, 113, 227, 0.28);
    color: #69b5ff;
  }

  &.badge-user {
    background: rgba(255, 255, 255, 0.12);
    color: #ebebf0;
  }
}

.btn-logout {
  padding: 4px 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 980px;
  background: transparent;
  color: #f5f5f7;
  font-size: 12px;
  font-family: inherit;
  transition: background 0.15s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.12);
  }
}

// ── Content section (responds to theme) ────────────────────────────────────
.container {
  max-width: 1280px;
  margin: 0 auto;
}

.content-section {
  margin-top: 28px;
  background: var(--bg-page);
  padding: 24px 22px 40px;
  transition: background-color 0.25s ease;
}
</style>
