<template>
  <div class="h-full w-full md:w-1/2 m-auto pt-12">
    <div class="text-left px-4 md:px-0">
      <h1 class="font-bold pt-8">Create an account,</h1>
    </div>

    <div class="px-4 md:px-0">
      <div v-if="_error">
        <p class="bg-red-500 text-red-200 text-sm p-3 mb-5">
          {{ _error }}
        </p>
      </div>
      <form @submit.prevent="onSubmit">
        <div class="form-group pt-6">
          <label for="fullname" class="block mb-2">Fullname</label>
          <input type="text" id="fullname" v-model="form.fullname" class="border border-gray-500 rounded-lg w-full py-2 px-3"/>
          <span v-if="!$v.form.fullname.required" class="text-red-500 text-sm">Fullname is required</span>
        </div>

        <div class="form-group pt-6">
          <label for="email" class="block mb-2">Email</label>
          <input type="email" id="email" v-model="form.email" class="border border-gray-500 rounded-lg w-full py-2 px-3"/>
          <span v-if="!$v.form.email.required || !$v.form.email.email" class="text-red-500 text-sm">Please enter a valid email address</span>
        </div>

        <div class="form-group pt-6">
          <label for="password" class="block mb-2">Password</label>
          <input type="password" id="password" v-model="form.password" class="border border-gray-500 rounded-lg w-full py-2 px-3"/>
          <span v-if="!$v.form.password.required" class="text-red-500 text-sm">Password is required</span>
        </div>

        <div class="flex justify-center pt-12 pb-24">
          <button type="submit" class="mx-auto text-center p-2 text-white border border-gray-500 rounded-lg w-full md:w-40 bg-my-blue hover:bg-blue-700" :disabled="$v.$invalid">
            <span v-if="isLoading">Loading...</span>
            <span v-else>Create</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useAuth, navigateTo } from '#imports';
import useVuelidate from '@vuelidate/core';
import { required, email } from '@vuelidate/validators';

const url = "https://eventful-moments-api.onrender.com/api/v1/users/signup";

const isLoading = ref(false);
const _error = ref(null);

const form = reactive({
  fullname: "",
  email: "",
  password: "",
});

const rules = {
  fullname: { required },
  email: { required, email },
  password: { required }
};

const $v = useVuelidate(rules, form);

async function onSubmit() {
  $v.value.$touch();
  if ($v.value.$invalid) return;

  if (isLoading.value) return;

  isLoading.value = true;
  try {
    const data = await $fetch(url, {
      method: "post",
      body: form,
    });

    const auth = useAuth();
    auth.value.isAuthenticated = true;
    navigateTo("/");
  } catch (error) {
    _error.value = error.data?.error || "Account registration failed";
  } finally {
    isLoading.value = false;
  }
}
</script>