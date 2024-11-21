<script setup>
import { ref, watch } from 'vue';

const apt = ref({});

const props = defineProps({
	aptInfo: {
		type: Object
	}
})

watch(
	() => props.aptInfo,
	(newApt) => {
		apt.value = newApt;
		console.log(apt.value);
	}
)
</script>

<template>
  <div class="apt-info-container">
    <h2>{{ apt.aptNm }}</h2>
    <p class="address">{{ apt.address }}</p>
    <table>
			<tbody>
				<tr>
					<th>세대 수</th>
					<td>{{ apt.homeCnt }}</td>
				</tr>
			</tbody>
			<tbody>
				<tr>
					<th>준공연도</th>
					<td>{{ apt.buildYear }}년 ({{ 2025 - apt.buildYear }}년차)</td>
				</tr>
			</tbody>
			<tbody>
				<tr>
					<th>용적률(%)</th>
					<td>{{ apt.far }}%</td>
				</tr>
			</tbody>
			<tbody>
				<tr>
					<th>건폐율(%)</th>
					<td>{{ apt.bcr }}%</td>
				</tr>
			</tbody>
			<tbody>
				<tr>
					<th>최고층</th>
					<td>{{ apt.flrCnt }}층</td>
				</tr>
			</tbody>
			<tbody>
				<tr>
					<th>세대수</th>
					<td>{{ apt.homeCnt }}세대</td>
				</tr>
			</tbody>
    </table>
  </div>
</template>

<style scoped>
.apt-info-container {
  font-family: 'Pretendard', sans-serif;
  max-width: 600px;
  margin: 0px 7px;
	margin-top: 7px;
  padding: 20px;
  background: #ffffff;
  border-radius: 12px;
}

h2 {
  font-size: 1.8em;
  color: #333;
  margin-bottom: 8px;
  font-weight: 600;
}

.address {
  color: #666;
  margin-bottom: 20px;
  font-size: 0.95em;
}

table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

th, td {
  padding: 12px 12px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

th {
  background-color: #f8f9fa;
  color: #495057;
  font-weight: 600;
  width: 35%;
}

td {
  color: #333;
}

tr:last-child th,
tr:last-child td {
  border-bottom: none;
}

tr:hover {
  background-color: #f8f9fa;
  transition: background-color 0.2s ease;
}

tbody:not(:last-child) tr:last-child th,
tbody:not(:last-child) tr:last-child td {
  border-bottom: 1px solid #e0e0e0;
}
</style>