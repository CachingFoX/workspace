<script setup>
</script>

<template>
  <!-- align-content-center align-items-center -->
  <div class="flex t-container justify-content-center align-items-end align-content-start gap-1 flex-wrap">
    <div class="t-item">A</div>
    <div class="t-item">B</div>
    <div class="t-item">C</div>
    <div class="t-item">D</div>
    <div class="t-item flex-shrink-0">E</div>
    <div class="t-item flex-shrink-0">F</div>
    <div class="t-item">G</div>
    <div class="t-item">H</div>
    <div class="t-item">I</div>
    <div class="t-item">J</div>
  </div>
</template>

<style scoped>
.t-container {
  width: 100%;
  height: 100%;
  background-color: pink;
}
.t-item {
  background-color: cornflowerblue;
  width: 15rem;
  height: 5rem;
}
</style>
