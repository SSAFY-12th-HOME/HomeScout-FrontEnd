<script setup>
import { ref, watch } from 'vue';

const dealHistory = ref({});

const props = defineProps({
	dealHistoryProps: {
		type: Array
	}
})

watch(
	() => props.dealHistoryProps,
	(newDealHistory) => {
		dealHistory.value = newDealHistory;
	}
)
</script>

<template>
  <div class="real-transaction">
    <h2>실거래가</h2>
    <table class="rounded-table">
      <thead>
        <tr>
          <th>계약일</th>
          <th>면적</th>
          <th>가격</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(deal, index) in dealHistory" :key="index">
          <td>{{ deal.dealDate }}</td>
          <td>{{ deal.area }}</td>
          <td>{{ deal.price }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.real-transaction {
  font-family: Arial, sans-serif;
  margin: 20px;
}

h2 {
  font-size: 1.5em;
  margin-bottom: 10px;
}

.rounded-table {
  width: 100%;
  border-collapse: collapse;
  overflow: hidden;
  border: 1px solid #ccc;
  border-radius: 10px; /* 테두리를 둥글게 */
}

.rounded-table th, .rounded-table td {
  text-align: left;
  padding: 10px;
  border-bottom: 1px solid #ccc;
}

.rounded-table th {
  background-color: #f9f9f9;
  font-weight: bold;
}

.rounded-table tr:last-child td {
  border-bottom: none; /* 마지막 행의 하단 테두리 제거 */
}
</style>
