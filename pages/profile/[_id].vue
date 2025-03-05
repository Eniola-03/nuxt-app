<template>
  <section>
    <div class="container m-auto py-10 px-6">
      <div class="grid grid-cols-1 md:grid-cols-70/30 w-full gap-6">
        <div>
          <h1 class="font-medium w-full">{{ moment.title }}</h1>
          <span class="text-my-blue font-regular-3 pb-6 md:pb-63">{{ moment.createdAt }}</span>
          <div class="mb-6 w-full">
            <p class="mb-6">{{ moment.details }}</p>
          </div>
        </div>

        <!-- Manage -->
        <div class="p-6 mt-6">
          <NuxtLink
            :to="`/edititem/${moment._id}`"
            class="bg-btn-blue text-white text-center py-2 px-4 rounded-full mt-4"
            >Edit Moment</NuxtLink
          >
          <button @click="deleteMoment"
            class="bg-btn-danger text-white text-center py-2 px-4 rounded-full mt-4"
          >
            Delete Moment
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from '#imports';

definePageMeta({
  layout: 'header',
});

const route = useRoute();
const router = useRouter();
const momentId = ref(route.params.id);
const moment = ref({});

onMounted(async () => {
  try {
    const response = await fetch(`https://eventful-moments-api.onrender.com/api/v1/moment/${momentId.value}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    moment.value = data.data; // Adjusted to match the provided API structure
  } catch (err) {
    console.error(err);
  }
});

const deleteMoment = async () => {
  try {
    const confirm = window.confirm('Are you sure you want to delete this moment?');
    if (confirm) {
      const response = await fetch(`https://eventful-moments-api.onrender.com/api/v1/moment/${momentId.value}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
      router.push('/profile');
    }
  } catch (err) {
    console.error(err);
  }
};
</script>
