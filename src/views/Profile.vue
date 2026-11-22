<template>
  <div style="padding: 20px; color: white; min-height: 100vh; background: #111827;">
    <h2 style="color: #fbbf24; text-align: center;">个人中心</h2>
    <div style="background: #1f2937; padding: 15px; border-radius: 10px; margin-top: 20px;">
      <p>账号：{{ username }}</p>
      <p>剩余抽奖次数：{{ chances }}</p>
      <button @click="$router.push('/lottery')" style="margin-top: 10px; background: #ef4444; border: none; color: white; padding: 8px 16px; border-radius: 5px;">去抽奖</button>
    </div>
    <h3 style="margin-top: 30px; font-size: 16px;">我的中奖记录</h3>
    <div v-if="records.length === 0" style="color: #9ca3af; margin-top: 10px;">暂无记录</div>
    <div v-for="item in records" :key="item.id" style="background: #1f2937; padding: 10px; border-radius: 8px; margin-top: 10px; display: flex; justify-content: space-between; align-items: center;">
      <div>
        <p style="margin: 0;">{{ item.prizes?.name || '谢谢参与' }}</p>
        <p style="font-size: 12px; color: #9ca3af; margin: 5px 0 0 0;">{{ new Date(item.created_at).toLocaleString() }}</p>
      </div>
      <button v-if="item.result_type === 'physical'" @click="$router.push('/redeem/' + item.id)" style="background: #fbbf24; color: black; border: none; padding: 5px 10px; border-radius: 5px;">去兑换</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../utils/supabase'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref('')
const chances = ref(0)
const records = ref([])

onMounted(async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return router.push('/login')
  const { data: profile } = await supabase.from('profiles').select('username, lottery_chances').eq('id', user.id).single()
  if (profile) { username.value = profile.username; chances.value = profile.lottery_chances }
  const { data: recordData } = await supabase.from('lottery_records').select('*, prizes(name)').eq('user_id', user.id).order('created_at', { ascending: false })
  if (recordData) records.value = recordData
})
</script>
