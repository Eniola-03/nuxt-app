<template>
  <div class="container py-6 px-6 md:px-12 w-1/2 md:w-120">
    <form @submit.prevent="onSubmit">
      <div class="mb-4">
        <label for="date" class="mb-2">Date in the future</label>
        <input class="border rounded w-full py-2 px-3" type="text" id="date" v-model="form.futureDate" placeholder="dd/mm/yyyy" />
      </div>
      <div class="mb-4">
        <label for="title" class="mb-2">Title</label>
        <input class="border rounded-lg w-full py-2 px-3" type="text" id="title" v-model="form.title" />
      </div>
      <div class="mb-4">
        <label for="details">Details</label>
        <textarea class="border rounded-lg w-full py-2 px-3" id="details" v-model="form.details" rows="10"></textarea>
      </div>
      <div class="mb-4">
        <button type="submit" class="mx-auto text-center p-2 text-white border border-gray-500 rounded-lg w-full md:w-40 bg-my-blue hover:bg-blue-700" >
          <span v-if="isLoading">Loading...</span>
          <span v-else>Save</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useAuth, navigateTo, useRoute, useRouter } from '#imports';
import { format, parse } from 'date-fns';

definePageMeta({
  layout: 'header',
});

const route = useRoute();
const router = useRouter();
const momentId = route.params._id;
const url = `https://eventful-moments-api.onrender.com/api/v1/moment/${momentId}`;

const isLoading = ref(false);
const error = ref(null);

const form = reactive({
  title: "",
  details: "",
  futureDate: "",
});



async function onSubmit() {

  if (isLoading.value) return;

  isLoading.value = true;
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authorization token is missing');
    }

    // Convert the date to the desired format before sending it to the API
    const formattedDate = format(parse(form.futureDate, 'dd/MM/yyyy', new Date()), 'dd/MM/yyyy');
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ ...form, futureDate: formattedDate })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    router.push(`/moments/${response.data._id}`);

    const auth = useAuth();
    auth.value.isAuthenticated = true;
  } catch (err) {
    error.value = err.message || "Failed to update item";
  } finally {
    isLoading.value = false;
  }
}

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
    const moment = data.data;
    form.title = moment.title;
    form.details = moment.details;
    form.futureDate = format(parse(moment.futureDate, 'yyyy-MM-dd', new Date()), 'dd/MM/yyyy');
    const auth = useAuth();
    auth.value.isAuthenticated = true;
  } catch (err) {
    error.value = err.message || "Failed to fetch moment details";
  } finally {
    isLoading.value = false;
  }
});
</script>