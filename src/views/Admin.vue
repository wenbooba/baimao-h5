<template>
  <div style="padding: 20px; color: white; min-height: 100vh; background: #111827;">
    <h2 style="color: #fbbf24; text-align: center;">管理员后台</h2>
    
    <div v-if="!isAdmin" style="text-align: center; margin-top: 50px;">
      你不是管理员，无法访问此页面。<br/>
      <button @click="$router.push('/lottery')" style="margin-top: 20px; padding: 8px 16px;">返回抽奖</button>
    </div>

    <div v-else>
      <h3 style="margin-top: 20px;">奖品池管理</h3>
      
      <div v-for="prize in prizes" :key="prize.id" style="background: #1f2937; padding: 15px; border-radius: 10px; margin-top: 15px;">
        <p style="font-weight: bold; margin: 0 0 10px 0;">
          {{ prize.name }} ({{ prize.type === 'character' ? '字符' : '实物' }})
        </p>
        
        <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 10px;">
          <label style="width: 60px;">概率:</label>
          <input type="number" step="0.001" v-model="prize.probability" style="flex: 1; padding: 5px; border-radius: 5px; border: none;" />
          <span>(例如 0.002 = 0.2%)</span>
        </div>

        <div v-if="prize.type === 'physical'" style="display: flex; gap: 10px; align-items: center; margin-bottom: 10px;">
          <label style="width: 60px;">库存:</label>
          <input type="number" v-model="prize.stock" style="flex: 1; padding: 5px; border-radius: 5px; border: none;" />
        </div>

        <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 10px;">
          <label style="width: 60px;">启用:</label>
          <input type="checkbox" v-model="prize.is_active" />
        </div>

        <button @click="savePrize(prize)" style="width: 100%; background: #3b82f6; color: white; padding: 8px; border: none; border-radius: 5px;">
          保存修改
        </button>
      </div>

      <h3 style="margin-top: 30px;">兑换申请审核</h3>
      <div v-if="redeems.length === 0" style="color: #9ca3af;">暂无申请</div>
      <div v-for="req in redeems" :key="req.id" style="background: #1f2937; padding: 15px; border-radius: 10px; margin-top: 15px;">
        <p>用户 ID: {{ req.user_id }}</p>
        <p>收货人: {{ req.recipient_name }} ({{ req.phone }})</p>
        <p>地址: {{ req.address }}</p>
        <p>状态: <span style="color: #fbbf24;">{{ req.status }}</span></p>
        
        <div v-if="req.status === 'pending'" style="display: flex; gap: 10px; margin-top: 10px;">
          <button @click="updateRedeem(req.id, 'approved')" style="background: #10b981; border: none; padding: 5px 10px; color: white; border-radius: 5px;">通过</button>
          <button @click="updateRedeem(req.id, 'rejected')" style="background: #ef4444; border: none; padding: 5px 10px; color: white; border-radius: 5px;">拒绝</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../utils/supabase'
import { useRouter } from 'vue-router'

const router = useRouter()
const isAdmin = ref(false)
const prizes = ref([])
const redeems = ref([])

onMounted(async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return router.push('/login')
  
  const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single()
  if (!profile?.is_admin) return
  
  isAdmin.value = true
  await loadData()
})

const loadData = async () => {
  const { data: p } = await supabase.from('prizes').select('*').order('created_at')
  if (p) prizes.value = p
  
  const { data: r } = await supabase.from('redeem_requests').select('*').order('created_at', { ascending: false })
  if (r) redeems.value = r
}

const savePrize = async (prize) => {
  const { error } = await supabase.rpc('admin_update_prize', {
    p_prize_id: prize.id,
    p_probability: prize.probability,
    p_stock: prize.stock,
    p_is_active: prize.is_active
  })
  if (error) alert('保存失败: ' + error.message)
  else alert('保存成功！前台会立刻生效。')
}

const updateRedeem = async (id, status) => {
  const { error } = await supabase.from('redeem_requests').update({ status }).eq('id', id)
  if (error) alert('更新失败: ' + error.message)
  else {
    alert('状态已更新')
    await loadData()
  }
}
</script>
