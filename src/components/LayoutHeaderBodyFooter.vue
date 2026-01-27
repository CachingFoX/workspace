<script setup>
</script>

<template>
  <div class="container">
    <div v-if="$slots.header" class="header">
      <slot name="header"></slot>
    </div>
    <div class="body">
      <slot name="body"></slot>
    </div>
    <div v-if="$slots.footer" class="footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;

  overflow: hidden;
}

.header {
}

.body {
  flex: 1 1 0;
  overflow: auto;
}

.footer {
}
</style>

