<template>
  <div>
    <div class="d-flex mb-3">
      <input v-model="q" @input="onSearch" class="form-control me-2" placeholder="Buscar clientes..." />
    </div>

    <table class="table table-striped">
      <thead>
        <tr>
          <th>Cliente</th>
          <th>Tax ID</th>
          <th>Email</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="client in clients.data" :key="client.id">
          <td>{{ client.name }}</td>
          <td>{{ client.tax_id }}</td>
          <td>{{ client.email }}</td>
          <td><button @click="$emit('select', client)" class="btn btn-sm btn-primary">Ver facturas</button></td>
        </tr>
      </tbody>
    </table>

    <nav v-if="clients.last_page">
      <ul class="pagination">
        <li class="page-item" :class="{disabled: clients.current_page === 1}"><a class="page-link" @click.prevent="changePage(clients.current_page - 1)">«</a></li>
        <li class="page-item" v-for="p in pages" :key="p" :class="{active: p === clients.current_page}"><a class="page-link" @click.prevent="changePage(p)">{{ p }}</a></li>
        <li class="page-item" :class="{disabled: clients.current_page === clients.last_page}"><a class="page-link" @click.prevent="changePage(clients.current_page + 1)">»</a></li>
      </ul>
    </nav>
  </div>
</template>

<script>
import { ref, watch, computed } from 'vue'
import api from '../services/api'
import debounce from 'lodash/debounce'

export default {
  emits: ['select'],
  setup() {
    const q = ref('')
    const page = ref(1)
    const clients = ref({ data: [], current_page: 1, last_page: 1 })
    const loading = ref(false)

    const load = async () => {
      loading.value = true
      try {
        const resp = await api.get('/clients', { params: { search: q.value, page: page.value } })
        clients.value = resp.data
      } catch (e) {
        console.error(e)
      } finally {
        loading.value = false
      }
    }

    const debounced = debounce(() => { page.value = 1; load() }, 400)

    const onSearch = () => debounced()

    const changePage = (p) => { if (p < 1 || p > clients.value.last_page) return; page.value = p; load() }

    watch(page, load)

    load()

    const pages = computed(() => {
      const arr = []
      for (let i = 1; i <= clients.value.last_page; i++) arr.push(i)
      return arr
    })

    return { q, clients, onSearch, changePage, pages, loading }
  }
}
</script>