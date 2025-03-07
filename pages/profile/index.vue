<template>
  <div>
    <div class="flex justify-between p-6">
      <div>
        <h1 class="font-custom font-bold">Welcome {{ fullname }},</h1>
        <p>Here are the items in your eventful moment bucket</p>
      </div>
      <div>
        <NuxtLink to="/additem" class="mx-auto text-center p-2 text-white border border-gray-500 rounded-lg pr-6 pl-6 md:w-40 bg-my-blue hover:bg-blue-700">Add Item</NuxtLink>
      </div>
    </div>
    <div>
      <MomentListings :limit="4" :showButton="true"/>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuth } from '#imports';
import MomentListings from '~/components/MomentListings.vue';

const url = 'https://eventful-moments-api.onrender.com/api/v1/users/me';


const fullname = ref('');
const isLoading = ref(true);
const error = ref(null);

definePageMeta({
  layout: 'header',
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
    fullname.value = data.data[0].fullname;
    const auth = useAuth();
    auth.value.isAuthenticated = true;
  } catch (err) {
    error.value = err.message || "Failed to fetch moments";
  } finally {
    isLoading.value = false;
  }
});
</script>