<template>
  <div class="container py-4">
    <div class="row">
      <div class="col-md-5">
        <client-table @select="selectClient" />
      </div>
      <div class="col-md-7" v-if="selectedClient">
        <invoice-list :client="selectedClient" :invoices="invoices" @open-cede="openCede" @mark-paid="markPaid" />

        <div v-if="showCede" class="mt-3">
          <cede-form :invoice="activeInvoice" @ceded="onCeded" @close="closeCede" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import ClientTable from './components/ClientTable.vue'
import InvoiceList from './components/InvoiceList.vue'
import CedeForm from './components/CedeForm.vue'
import api from './services/api'

export default {
  components: { ClientTable, InvoiceList, CedeForm },
  setup(){
    const selectedClient = ref(null)
    const invoices = ref([])
    const showCede = ref(false)
    const activeInvoice = ref(null)

    const selectClient = async (client) => {
      selectedClient.value = client
      const resp = await api.get(`/clients/${client.id}/invoices`)
      invoices.value = resp.data
    }

    const openCede = (inv) => { activeInvoice.value = inv; showCede.value = true }
    const closeCede = () => { showCede.value = false; activeInvoice.value = null }

    const onCeded = (data) => {
      // actualizar UI en tiempo real
      const idx = invoices.value.findIndex(i => i.id === data.invoice.id)
      if (idx !== -1) invoices.value[idx] = data.invoice
      else invoices.value.push(data.invoice)
    }

    const markPaid = async (inv) => {
      try{
        const resp = await api.post('/factoring/mark-paid', { invoice_id: inv.id })
        const idx = invoices.value.findIndex(i => i.id === inv.id)
        if (idx !== -1) invoices.value[idx] = resp.data.invoice
      }catch(e){ console.error(e); alert('Error al marcar pagada') }
    }

    return { selectedClient, invoices, selectClient, openCede, showCede, activeInvoice, onCeded, closeCede, markPaid }
  }
}
</script>