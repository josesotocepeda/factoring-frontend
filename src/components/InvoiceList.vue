<template>
  <div>
    <h5>Facturas de {{ client.name }}</h5>
    <table class="table">
      <thead>
        <tr><th>#</th><th>Emisión</th><th>Venc.</th><th>Monto</th><th>Estado</th><th>Acciones</th></tr>
      </thead>
      <tbody>
        <tr v-for="inv in invoices" :key="inv.id">
          <td>{{ inv.number }}</td>
          <td>{{ inv.issue_date }}</td>
          <td>{{ inv.due_date }}</td>
          <td>{{ inv.gross_amount }}</td>
          <td>{{ inv.status }}</td>
          <td>
            <button v-if="inv.status === 'pending'" @click="$emit('open-cede', inv)" class="btn btn-sm btn-success me-1">Ceder</button>
            <button v-if="inv.status !== 'paid'" @click="$emit('mark-paid', inv)" class="btn btn-sm btn-secondary">Marcar pagada</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: ['client','invoices']
}
</script>
