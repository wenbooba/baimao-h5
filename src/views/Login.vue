<template>
  <div style="padding: 40px 20px; color: white;">
    <h2 style="text-align: center; color: #fbbf24;">白猫我超你麦</h2>
    <div style="margin-top: 30px;">
      <input v-model="username" placeholder="请输入账号" style="width: 100%; padding: 10px; margin-bottom: 15px; border-radius: 8px; border: none;" />
      <input v-model="password" type="password" placeholder="请输入密码" style="width: 100%; padding: 10px; margin-bottom: 15px; border-radius: 8px; border: none;" />
      <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
        <span style="color: #9ca3af;">{{ isRegister ? '已有账号？' : '还没有账号？' }}</span>
        <span @click="isRegister = !isRegister" style="color: #fbbf24; cursor: pointer;">{{ isRegister ? '去登录' : '立即注册' }}</span>
      </div>
      <button @click="handleSubmit" style="width: 100%; padding: 12px; background: #ef4444; color: white; border: none; border-radius: 20px; font-size: 16px;">
        {{ isRegister ? '注册' : '登录' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { supabase } from '../utils/supabase'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref('')
const password = ref('')
const isRegister = ref(false)

const handleSubmit = async () => {
  if (!username.value || !password.value) return alert('请填写完整')
  const email = `${username.value.trim().toLowerCase()}@baimao.local`
  try {
    if (isRegister.value) {
      const { error } = await supabase.auth.signUp({ email, password: password.value })
      if (error) throw error
      alert('注册成功！')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password: password.value })
      if (error) throw error
    }
    router.push('/lottery')
  } catch (err) { alert(err.message) }
}
</script>
