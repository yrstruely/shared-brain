<template>
  <div class="welcome-message">
    <h1>{{ message }}</h1>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { fetchWelcomeMessage } from '../services/welcome.api'

const message = ref('Loading...')

onMounted(async () => {
  try {
    const data = await fetchWelcomeMessage()
    message.value = data.message
  } catch (error) {
    message.value = 'Hello, World!'
  }
})
</script>

<style scoped>
.welcome-message {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  font-family: Arial, sans-serif;
}

h1 {
  font-size: 3rem;
  color: #333;
}
</style>
