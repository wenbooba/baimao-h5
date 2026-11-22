<template>
  <div style="padding: 20px; color: white; min-height: 100vh; background: #111827;">
    <h2 style="color: #fbbf24; text-align: center;">填写收货信息</h2>
    <div style="margin-top: 20px;">
      <input v-model="form.name" placeholder="收货人姓名" style="width: 100%; padding: 10px; margin-bottom: 10px; border-radius: 5px; border: none;" />
      <input v-model="form.phone" placeholder="手机号码" style="width: 100%; padding: 10px; margin-bottom: 10px; border-radius: 5px; border: none;" />
      <textarea v-model="form.address" placeholder="详细收货地址" rows="3" style="width: 100%; padding: 10px; margin-bottom: 10px; border-radius: 5px; border: none;"></textarea>
      <button @click="submit" :disabled="loading" style="width: 100%; background: #ef4444; color: white; padding: 12px; border: none; border-radius: 20px; font-size: 16px;">
        {{ loading ? '提交中...' : '确认提交兑换' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { supabase } from '../utils/supabase'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const form = ref({ name: '', phone: '', address: '' })

const submit = async () => {
  if (!form.value.name || !form.value.phone || !form.value.address) return alert('请填写完整信息')
  loading.value = true
  try {
    const { error } = await supabase.from('redeem_requests').insert({
      lottery_record_id: route.params.id,
      recipient_name: form.value.name,
      phone: form.value.phone,
      address: form.value.address,
      user_id: (await supabase.auth.getUser()).data.user.id
    })
    if (error) throw error
    alert('兑换申请已提交，等待管理员审核发货！')
    router.push('/profile')
  } catch (err) { alert('提交失败：' + err.message) } finally { loading.value = false }
}
</script>
