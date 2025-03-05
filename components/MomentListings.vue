<template>
  <div>
    <div v-if="isLoading">Loading data...</div>
    <div v-else-if="error">Error loading results: {{ error }}</div>
    <div v-else class="grid grid-col-1 md:grid-cols-2">
      <MomentListing v-for="moment in moments.slice(0, limit || moments.length)" :key="moment._id" :moment="moment" />
    </div>
    <section v-if="showButton" class="m-auto max-w-lg my-10 px-6">
      <NuxtLink
        to="/moments"
        class="block bg-my-blue hover:bg-blue-700 text-white text-center py-4 px-6 rounded-xl"
      >Load more</NuxtLink>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuth } from '#imports';
import MomentListing from '~/components/MomentListing.vue';

const url = 'https://eventful-moments-api.onrender.com/api/v1/users/me';

const moments = ref([]);
const isLoading = ref(true);
const error = ref(null);


const props = defineProps({
  limit: Number,
  showButton: {
    type: Boolean,
    default: false,
  }
});

onMounted(async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authorization token is missing');
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    moments.value = data.data[0].moments;
    const auth = useAuth();
    auth.value.isAuthenticated = true;
  } catch (err) {
    error.value = err.message || "Failed to fetch moments";
  } finally {
    isLoading.value = false;
  }
});
</script>
