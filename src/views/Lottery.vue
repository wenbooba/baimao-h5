<template>
  <div style="padding: 20px; color: white; text-align: center;">
    <h3 style="margin-top: 20px;">剩余次数：<span style="color: #fbbf24;">{{ chances }}</span></h3>
    <div style="margin: 50px 0;">
      <img src="https://api.iconify.design/noto:cat-face.svg" style="width: 150px; height: 150px;" alt="猫" />
    </div>
    <button @click="handleDraw" :disabled="loading || chances <= 0" style="width: 200px; padding: 15px; background: #ef4444; color: white; border: none; border-radius: 30px; font-size: 18px;">
      {{ loading ? '抽奖中...' : '立即抽奖' }}
    </button>
    <div v-if="showResult" style="margin-top: 30px; background: #1f2937; padding: 20px; border-radius: 10px;">
      <p v-if="result.type === 'character'">恭喜获得字符：<span style="font-size: 24px; color: #fbbf24;">{{ result.character }}</span></p>
      <p v-else-if="result.type === 'physical'">恭喜抽中实物：<span style="color: #fbbf24;">{{ result.prize_name }}</span></p>
      <p v-else>谢谢参与，下次一定中！</p>
    </div>
    <button @click="$router.push('/profile')" style="margin-top: 20px; background: #4b5563; color: white; border: none; padding: 8px 16px; border-radius: 20px;">
      个人中心
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../utils/supabase'

const chances = ref(0)
const loading = ref(false)
const showResult = ref(false)
const result = ref({})

const loadData = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  const { data } = await supabase.from('profiles').select('lottery_chances').eq('id', user.id).single()
  if (data) chances.value = data.lottery_chances
}

const handleDraw = async () => {
  loading.value = true
  showResult.value = false
  try {
    const { data, error } = await supabase.rpc('draw_lottery')
    if (error) throw error
    result.value = data
    showResult.value = true
    await loadData()
  } catch (err) { alert(err.message) } finally { loading.value = false }
}
onMounted(() => { loadData() })
</script>
