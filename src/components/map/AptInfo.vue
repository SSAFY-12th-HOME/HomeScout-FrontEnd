
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
    <p>{{ apt.address }}</p>
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
					<td>{{ apt.far }}</td>
				</tr>
			</tbody>
			<tbody>
				<tr>
					<th>건폐율(%)</th>
					<td>{{ apt.bcr }}</td>
				</tr>
			</tbody>
			<tbody>
				<tr>
					<th>최고층</th>
					<td>{{ apt.flrCnt }}</td>
				</tr>
			</tbody>
			<tbody>
				<tr>
					<th>세대수</th>
					<td>{{ apt.homeCnt }}</td>
				</tr>
			</tbody>
    </table>
  </div>
</template>

<style scoped>
.apt-info-container {
  font-family: Arial, sans-serif;
  margin: 20px;
}

h2 {
  font-size: 1.5em;
  margin-bottom: 10px;
}

table {
  width: 100%;
  border-collapse: collapse;
  overflow: hidden; /* 테두리 둥근 효과를 유지하기 위한 설정 */
  border: 2px solid black;
  border-radius: 10px; /* 테두리를 둥글게 만듦 */
}

th, td {
  text-align: left;
  padding: 8px;
  border-bottom: 1px solid #ccc;
}

th {
  background-color: #f9f9f9;
}

tr:last-child td {
  border-bottom: none; /* 마지막 행의 하단 테두리 제거 */
}
</style>