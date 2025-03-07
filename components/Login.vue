<template>
  <div class="h-full w-full md:w-1/2 m-auto pt-12 text-black">
    <div class="text-left px-4 md:px-0">
      <h1 class="pt-8 font-custom font-bold">Welcome back,</h1>
      <p class="font-regular pt-2 text-xl">Hi, my name is Eventful Moments, I am a bucket… no, not the <br/>bucket of water but I store awesome moments you will like to <br/>have in coming years.</p>
    </div>
    <div class="px-4 md:px-0">
      <div v-if="error">
        <p class="bg-red-500 text-red-200 text-sm p-3 mb-5">
          {{ error }}
        </p>
      </div>
      <form @submit.prevent="login">
        <div class="form-group pt-6">
          <label for="email" class="block mb-2">Email</label>
          <input type="email" id="email" v-model="form.email" class="border border-gray-500 rounded-lg w-full py-2 px-3" />
        </div>
        <div class="form-group pt-6">
          <label for="password" class="block mb-2">Password</label>
          <input type="password" id="password" v-model="form.password" class="border border-gray-500 rounded-lg w-full py-2 px-3" />
        </div>
        <div class="flex justify-center pt-12 pb-24">
          <button type="submit" class="mx-auto text-center p-2 text-white border border-gray-500 rounded-lg w-full md:w-40 bg-my-blue hover:bg-blue-700">
            <span v-if="isLoading">Loading...</span>
            <span v-else>Login</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';

const form = reactive({
  email: 'emeka.akpan@uatdrive.com',
  password: 'password'
});
const error = ref(null);
const isLoading = ref(false);
const router = useRouter();

const login = async () => {
  if (isLoading.value) return;

  isLoading.value = true;
  try {
    const response = await fetch('https://eventful-moments-api.onrender.com/api/v1/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: form.email, password: form.password })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }


    const data = await response.json();
    localStorage.setItem('token', data.token); // Store the token in localStorage
    router.push('/profile'); // Redirect to the profile page
  } catch (err) {
    error.value = err.message || 'Failed to login';
  } finally {
    isLoading.value = false;
  }
};
</script>