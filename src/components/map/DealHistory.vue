<script setup>
import { ref, watch } from 'vue';

const dealHistory = ref({});

const props = defineProps({
  dealHistoryProps: {
    type: Array
  }
});

watch(
  () => props.dealHistoryProps,
  (newDealHistory) => {
    dealHistory.value = newDealHistory;
  }
);
</script>

<template>
  <div class="real-transaction">
    <h2 class="title">실거래가</h2>
    <div class="table-container">
      <table class="rounded-table">
        <thead>
          <tr>
            <th>계약일</th>
            <th>면적</th>
            <th>가격</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(deal, index) in dealHistory" :key="index" 
              class="row-hover">
            <td>{{ deal.dealDate }}</td>
            <td>{{ deal.area }}</td>
            <td>{{ deal.price }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.real-transaction {
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif;
  margin: 0px 7px;

  background-color: #ffffff;
  border-radius: 16px;
  padding: 20px;
}

.title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 1rem;
}

.table-container {
  overflow-x: auto;
  border-radius: 12px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
}

.rounded-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background-color: #ffffff;
}

.rounded-table th {
  background-color: #f9fafb;
  color: #374151;
  font-weight: 600;
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
  white-space: nowrap;
}

.rounded-table td {
  padding: 12px;
  color: #4b5563;
  border-bottom: 1px solid #e5e7eb;
}

.rounded-table tr:last-child td {
  border-bottom: none;
}

.row-hover:hover {
  background-color: #f9fafb;
  transition: all 0.2s ease;
}

@media (max-width: 640px) {
  .real-transaction {
    padding: 16px;
  }
  
  .rounded-table th,
  .rounded-table td {
    padding: 12px;
  }
  
  .title {
    font-size: 1.25rem;
    margin-bottom: 1rem;
  }
}
</style>