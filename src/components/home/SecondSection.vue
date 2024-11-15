<template>
  <div class="container">
    <div class="content-wrapper">
      <!-- Left text content -->
      <div class="text-content" data-aos="fade-right" data-aos-duration="1000">
        <h1>지도 보기</h1>
        <div class="text-block">
          <p>나의 보금자리 선택,</p>
          <p>명확한 시각적 정보로</p>
          <p>더욱 쉽고 똑똑하게</p>
        </div>
        <button class="map-button">지도보러 가기</button>
      </div>

      <!-- Right map images -->
      <div class="map-content" data-aos="fade-left" data-aos-duration="1000">
        <div class="map-top">
          <!-- <img src="path-to-your-map-image1" alt="Map view 1" /> -->
          이미지1
        </div>
        <div class="map-bottom">
          <!-- <img src="path-to-your-map-image2" alt="Map view 2" /> -->
          이미지2
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Your script code here
</script>

<style scoped>
.container {
  background-color: #66b56b;
  padding: 40px;
  display: flex;
  align-items: center;
}

.content-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  gap: 40px;
}

.text-content {
  flex: 1;
  color: white;
}

.text-content h1 {
  font-size: 2rem;
  margin-bottom: 2rem;
}

.text-block {
  margin-bottom: 2rem;
}

.text-block p {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.map-button {
  background-color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 25px;
  font-size: 1rem;
  cursor: pointer;
}

.map-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.map-top,
.map-bottom {
  background: white;
  border-radius: 12px;
  padding: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.map-top img,
.map-bottom img {
  width: 100%;
  height: auto;
  border-radius: 8px;
}
</style>
