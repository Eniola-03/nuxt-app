<template>
  <div class="container py-6 px-6 md:px-12 w-1/2 md:w-120">
    <form @submit.prevent="handleSubmit">
      <div class="mb-4">
        <label for="date" class="mb-2">Date in the future</label>
        <input class="border rounded w-full py-2 px-3" type="text" id="date" v-model="form.futureDate" placeholder="dd/mm/yyyy" />
        <span v-if="!$v.form.futureDate.required" class="text-red-500 text-sm">Date is required</span>
      </div>
      <div class="mb-4">
        <label for="title" class="mb-2">Title</label>
        <input class="border rounded-lg w-full py-2 px-3" type="text" id="title" v-model="form.title" />
        <span v-if="!$v.form.title.required" class="text-red-500 text-sm">Title is required</span>
      </div>
      <div class="mb-4">
        <label for="details">Details</label>
        <textarea class="border rounded-lg w-full py-2 px-3" id="details" v-model="form.details" rows="10"></textarea>
        <span v-if="!$v.form.details.required" class="text-red-500 text-sm">Details are required</span>
      </div>
      <div class="mb-4">
        <button type="submit" class="mx-auto text-center p-2 text-white border border-gray-500 rounded-lg w-full md:w-40 bg-my-blue hover:bg-blue-700" :disabled="$v.$invalid">
          <span v-if="isLoading">Loading...</span>
          <span v-else>Save</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useAuth, navigateTo } from '#imports';
import { useToast } from 'vue-toastification';
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { format, parse } from 'date-fns';

definePageMeta({
  layout: 'header',
});

const url = "https://eventful-moments-api.onrender.com/api/v1/moment";
const isLoading = ref(false);
const _error = ref(null);
const toast = useToast();

const form = reactive({
  title: "",
  details: "",
  futureDate: "",
});

const rules = {
  title: { required },
  details: { required },
  futureDate: { required }
};

const $v = useVuelidate(rules, form);

async function handleSubmit() {
  $v.value.$touch();
  if ($v.value.$invalid) return;

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
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ ...form, futureDate: formattedDate }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    toast.success('Moment added successfully');
    navigateTo(`/moments/${data.data._id}`);

    const auth = useAuth();
    auth.value.isAuthenticated = true;
  } catch (error) {
    _error.value = error.message || "Failed to add item";
  } finally {
    isLoading.value = false;
  }
}
</script>