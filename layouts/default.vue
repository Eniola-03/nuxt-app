<template>
    <div>
      <nav class="flex justify-between items-center p-4 bg-green-100 text-white">
        <h2 class="font-custom">Eventful Moments.</h2>
        <div class="pr-6">
            <NuxtLink to="/" class="pr-6">Login</NuxtLink>
            <NuxtLink to="/register">Register</NuxtLink>
        </div>
      </nav>
      <slot />
      <Footer />
    </div>
</template>

<script>
 import Footer from '~/components/Footer.vue'

 export default {
     components: {
         Footer
     },
 }
</script>