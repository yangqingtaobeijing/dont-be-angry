<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  store,
  verifyAdminPassword,
  addMessage,
  updateMessage,
  deleteMessage,
  changeAdminPassword,
} from '../store'
import type { MessageCategory, TaogeMessage } from '../types'

const isAuthenticated = ref(false)
const passwordInput = ref('')
const passwordError = ref(false)

function login(): void {
  if (verifyAdminPassword(passwordInput.value)) {
    isAuthenticated.value = true
    passwordError.value = false
  } else {
    passwordError.value = true
  }
}

// ---- Message management ----
const messages = computed(() => store.messages)
const editingId = ref<string | null>(null)
const editContent = ref('')
const editCategory = ref<MessageCategory>('comfort')
const newContent = ref('')
const newCategory = ref<MessageCategory>('comfort')

const categories: { value: MessageCategory; label: string }[] = [
  { value: 'apology', label: '道歉类' },
  { value: 'comfort', label: '安慰类' },
  { value: 'sweet', label: '甜蜜类' },
  { value: 'promise', label: '承诺类' },
]

function startEdit(msg: TaogeMessage): void {
  editingId.value = msg.id
  editContent.value = msg.content
  editCategory.value = msg.category
}

function saveEdit(): void {
  if (!editingId.value || !editContent.value.trim()) return
  updateMessage(editingId.value, editContent.value.trim(), editCategory.value)
  editingId.value = null
}

function cancelEdit(): void {
  editingId.value = null
}

function removeMessage(id: string): void {
  deleteMessage(id)
}

function addNewMessage(): void {
  if (!newContent.value.trim()) return
  addMessage(newContent.value.trim(), newCategory.value)
  newContent.value = ''
}

// ---- Password change ----
const showPasswordChange = ref(false)
const newPassword = ref('')

function saveNewPassword(): void {
  if (!newPassword.value.trim()) return
  changeAdminPassword(newPassword.value.trim())
  newPassword.value = ''
  showPasswordChange.value = false
}
</script>

<template>
  <div class="admin-page">
    <h1 class="page-title animate-fade-in-up">涛哥管理面板 ⚙️</h1>

    <!-- Login -->
    <div v-if="!isAuthenticated" class="login-area animate-fade-in-up">
      <div class="login-card card">
        <p class="login-hint">请输入管理密码</p>
        <div class="login-form">
          <input
            v-model="passwordInput"
            type="password"
            class="login-input"
            placeholder="密码"
            @keyup.enter="login"
          />
          <button class="btn-primary" @click="login">进入</button>
        </div>
        <p v-if="passwordError" class="login-error">密码不对哦 🙅</p>
      </div>
    </div>

    <!-- Admin Panel -->
    <div v-else class="admin-panel">
      <!-- Add new message -->
      <section class="admin-section animate-fade-in-up">
        <h2 class="section-title">添加新留言 💌</h2>
        <div class="add-form card">
          <div class="form-row">
            <input
              v-model="newContent"
              class="form-input"
              placeholder="写一条留言..."
            />
            <select v-model="newCategory" class="form-select">
              <option v-for="cat in categories" :key="cat.value" :value="cat.value">
                {{ cat.label }}
              </option>
            </select>
            <button class="btn-primary" @click="addNewMessage" :disabled="!newContent.trim()">
              添加
            </button>
          </div>
        </div>
      </section>

      <!-- Message list -->
      <section class="admin-section animate-fade-in-up" style="animation-delay: 0.1s">
        <h2 class="section-title">所有留言（{{ messages.length }} 条）</h2>
        <div class="message-list">
          <div v-for="msg in messages" :key="msg.id" class="message-item card">
            <template v-if="editingId === msg.id">
              <div class="edit-form">
                <input v-model="editContent" class="form-input" />
                <select v-model="editCategory" class="form-select">
                  <option v-for="cat in categories" :key="cat.value" :value="cat.value">
                    {{ cat.label }}
                  </option>
                </select>
                <div class="edit-actions">
                  <button class="btn-primary small" @click="saveEdit">保存</button>
                  <button class="btn-secondary small" @click="cancelEdit">取消</button>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="message-row">
                <div class="message-info">
                  <span class="message-badge" :class="msg.category">
                    {{ categories.find(c => c.value === msg.category)?.label }}
                  </span>
                  <span class="message-text">{{ msg.content }}</span>
                  <span v-if="msg.isDefault" class="default-tag">预设</span>
                </div>
                <div class="message-actions">
                  <button class="action-btn" @click="startEdit(msg)">✏️</button>
                  <button class="action-btn" @click="removeMessage(msg.id)">🗑️</button>
                </div>
              </div>
            </template>
          </div>
        </div>
      </section>

      <!-- Password change -->
      <section class="admin-section animate-fade-in-up" style="animation-delay: 0.2s">
        <button class="btn-secondary" @click="showPasswordChange = !showPasswordChange">
          修改密码 🔐
        </button>
        <div v-if="showPasswordChange" class="password-change card" style="margin-top: 16px;">
          <div class="form-row">
            <input v-model="newPassword" type="password" class="form-input" placeholder="新密码" />
            <button class="btn-primary" @click="saveNewPassword">保存</button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.admin-page {
  max-width: 800px;
  margin: 0 auto;
}
.page-title {
  font-family: var(--font-display);
  font-size: 1.8rem;
  text-align: center;
  margin-bottom: 40px;
}

/* Login */
.login-area {
  display: flex;
  justify-content: center;
}
.login-card {
  padding: 40px;
  text-align: center;
  max-width: 400px;
  width: 100%;
}
.login-hint {
  color: var(--text-secondary);
  margin-bottom: 24px;
}
.login-form {
  display: flex;
  gap: 12px;
  justify-content: center;
}
.login-input {
  padding: 12px 20px;
  border: 2px solid var(--sidebar-border);
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--text-primary);
  font-size: 1rem;
  outline: none;
  width: 200px;
}
.login-input:focus { border-color: var(--accent-peach); }
.login-error {
  color: var(--accent-coral);
  margin-top: 16px;
  font-size: 0.9rem;
}

/* Admin sections */
.admin-section {
  margin-bottom: 40px;
}
.section-title {
  font-family: var(--font-display);
  font-size: 1.2rem;
  margin-bottom: 16px;
}

.add-form, .password-change {
  padding: 24px;
}
.form-row {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}
.form-input {
  flex: 1;
  min-width: 200px;
  padding: 10px 16px;
  border: 2px solid var(--sidebar-border);
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--text-primary);
  font-size: 0.95rem;
  outline: none;
}
.form-input:focus { border-color: var(--accent-peach); }
.form-select {
  padding: 10px 16px;
  border: 2px solid var(--sidebar-border);
  border-radius: var(--radius-sm);
  background: var(--bg-card);
  color: var(--text-primary);
  font-size: 0.95rem;
  outline: none;
}

.message-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.message-item {
  padding: 16px 20px;
}
.message-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.message-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
}
.message-badge {
  padding: 3px 10px;
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 600;
  flex-shrink: 0;
}
.message-badge.apology { background: #ffe4e4; color: #cc4444; }
.message-badge.comfort { background: #e4f5ef; color: #2a8c6e; }
.message-badge.sweet { background: #fce4f3; color: #b44d8c; }
.message-badge.promise { background: #fff5d6; color: #b88c1a; }

.message-text {
  font-size: 0.95rem;
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.default-tag {
  padding: 2px 8px;
  background: var(--sidebar-border);
  border-radius: var(--radius-full);
  font-size: 0.7rem;
  color: var(--text-muted);
  flex-shrink: 0;
}
.message-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}
.action-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.15s ease;
}
.action-btn:hover {
  background: var(--sidebar-border);
}

.edit-form {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}
.edit-actions {
  display: flex;
  gap: 8px;
}
.btn-primary.small, .btn-secondary.small {
  padding: 8px 20px;
  font-size: 0.85rem;
}
</style>
