<template>
  <div class="card p-3">
    <h5>Ceder factura {{ invoice.number }}</h5>

    <div class="mb-2">
      <label>Advance rate (%)</label>
      <input v-model.number="advance_rate" type="number" class="form-control" />
    </div>

    <div class="mb-2">
      <label>Fee rate (%)</label>
      <input v-model.number="fee_rate" type="number" class="form-control" />
    </div>

    <div class="mb-2">
      <p>Advance amount: <strong>{{ formatted(advance_amount) }}</strong></p>
      <p>Fee amount: <strong>{{ formatted(fee_amount) }}</strong></p>
      <p>Settlement amount: <strong>{{ formatted(settlement_amount) }}</strong></p>
    </div>

    <div class="d-flex">
      <button @click="submit" :disabled="loading" class="btn btn-primary me-2">Aceptar ceder</button>
      <button @click="$emit('close')" class="btn btn-outline-secondary">Cancelar</button>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import api from '../services/api'

export default {
  props: ['invoice'],
  emits: ['ceded','close'],
  setup(props, { emit }){
    const advance_rate = ref(80)
    const fee_rate = ref(2)
    const loading = ref(false)

    const advance_amount = computed(() => +(props.invoice.gross_amount * (advance_rate.value/100)).toFixed(2))
    const fee_amount = computed(() => +(props.invoice.gross_amount * (fee_rate.value/100)).toFixed(2))
    const settlement_amount = computed(() => +(advance_amount.value - fee_amount.value).toFixed(2))

    const formatted = (v) => new Intl.NumberFormat().format(v)

    const submit = async () => {
      loading.value = true
      try{
        const resp = await api.post('/factoring/cede', {
          invoice_id: props.invoice.id,
          advance_rate: advance_rate.value,
          fee_rate: fee_rate.value,
        })
        emit('ceded', resp.data)
        emit('close')
      }catch(e){
        console.error(e)
        alert('Error al ceder')
      }finally{ loading.value = false }
    }

    return { advance_rate, fee_rate, advance_amount, fee_amount, settlement_amount, submit, loading, formatted }
  }
}
</script>
