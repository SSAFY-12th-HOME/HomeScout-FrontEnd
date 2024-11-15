<script setup>
import 'fullpage.js/dist/fullpage.min.css'
import AppHeader from '@/components/common/HomeHeader.vue'
import AppBody from '@/components/home/AppBody.vue'
import SecondSection from '@/components/home/SecondSection.vue'
import AOS from 'aos'

import { onMounted } from 'vue'
import HomeHeader from '@/components/common/HomeHeader.vue'

onMounted(() => {
  AOS.init({
    duration: 800,
    once: false,
    offset: 120,
  })
})

const options = {
  menu: '#menu',
  anchors: ['firstPage', 'secondPage', 'thirdPage', 'fourthPage'],
  // sectionsColor: ['#67b66d', '#ff5f45', '#0798ec', '#fec401'],
  navigation: true,
  navigationPosition: 'right',
  navigationTooltips: ['First', 'Second', 'Third', 'Fourth'],
  showActiveTooltip: true,
  slidesNavigation: true,
  slidesNavPosition: 'bottom',
  onLeave: (origin, destination, direction) => {
    const currentSection = origin.item
    const animations = currentSection.querySelectorAll('[data-aos]')
    animations.forEach(element => {
      element.classList.remove('aos-animate')
    })
  },
  afterLoad: (origin, destination, direction) => {
    setTimeout(() => {
      AOS.refresh()
      const currentSection = destination.item
      const animations = currentSection.querySelectorAll('[data-aos]')
      animations.forEach(element => {
        element.classList.add('aos-animate')
      })
    }, 300)
  },
}
</script>

<template>
  <full-page ref="fullpage" :options="options" id="fullpage">
    <!-- First section -->
    <div class="section">
      <HomeHeader />
      <AppBody />
    </div>

    <!-- Second section -->
    <div class="section">
      <SecondSection />
    </div>

    <!-- Third section with slides -->
    <div class="section">
      <div class="slide">
        <h1>Section 3 - Slide 1</h1>
      </div>
      <div class="slide">
        <h1>Section 3 - Slide 2</h1>
      </div>
      <div class="slide">
        <h1>Section 3 - Slide 3</h1>
      </div>
    </div>

    <!-- Fourth section -->
    <div class="section">
      <h1>Section 4</h1>
      <p>This is the last section</p>
    </div>
  </full-page>
</template>

<style scoped>
/* Add some basic styling */
.section {
  text-align: center;
  font-family: Arial, sans-serif;
  background-color: #66b56b;
}

h1 {
  font-size: 4em;
  color: white;
  margin: 0;
  padding: 0;
}

p {
  color: white;
  font-size: 1.5em;
  margin-top: 20px;
}

/* Optional: Add some animations */
.fp-section.active {
  animation: fadeIn 1s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
