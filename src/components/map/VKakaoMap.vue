<script setup>
import { ref, watch } from 'vue';
import { KakaoMap, KakaoMapMarker } from 'vue3-kakao-maps';

const markerList = ref([]);
const map = ref();
const clusterer = ref();

const props = defineProps({
	aptList: {
		type: Array,
		default: () => [],
	}
});

const emit = defineEmits(["markerClickEvent"])

watch(
	() => props.aptList,
	(newList) => {
		markerList.value = newList.map((apt) => {
			let marker = {aptId: apt.aptId, lat: apt.latitude, lng: apt.longitude};
			return marker;
		});
		panTo(markerList.value[0].lat, markerList.value[0].lng)
	},
)

const onLoadKakaoMap = (mapRef) => {
	map.value = mapRef;
	// console.log(map.value);
	// window.kakao.maps.event.addListener(marker.value, 'click', function() {
	// 	console.log('makrer 클릭!');
	// });
}

const onLoadKakaoMapMarkerCluster = (clustererRef) => {
	clusterer.value = clustererRef;
}

const onClickKakaoMapMarker = (marker) => {
	emit("markerClickEvent", marker.aptId);
	panTo(marker.lat, marker.lng)
}

const panTo = (lat, lng) => {
  if (map.value) {
    // 지도 중심을 부드럽게 이동시킵니다
    // 만약 이동할 거리가 지도 화면보다 크면 부드러운 효과 없이 이동합니다
    map.value.panTo(new window.kakao.maps.LatLng(lat, lng));
  }
};
</script>

<template>
	<KakaoMap 
		:lat="37.563652488" 
		:lng="126.977532624" 
		width="100%" 
		height="100vh" 
		level="6"
		@onLoadKakaoMap="onLoadKakaoMap"
		@onLoadKakaoMapMarkerCluster="onLoadKakaoMapMarkerCluster"
	>
		<!-- :markerCluster="{ markers: markerList }" -->
		<KakaoMapMarker 
			v-for="marker in markerList" 
			:key="marker.aptId" 
			:lat="marker.lat" 
			:lng="marker.lng"
			:clickable="true"
			@onClickKakaoMapMarker="onClickKakaoMapMarker(marker)"
		 />
	</KakaoMap>
	
</template>

<style scoped>

</style>