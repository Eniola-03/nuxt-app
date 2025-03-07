<template>
  <div class="p-6">
    <div v-if="isLoading">Loading data...</div>
    <div v-else-if="error" class="text-red-500 mx-auto text-center">Error loading results: {{ error }}</div>
    <div v-else>
      <div class="flex">
        <div class="bg-light mb-6 md:mb-0 mr-0 md:mr-10 p-6">
          <p class="font-bold">{{ moment.title }}</p>
          <small class="font-regular">{{ truncatedDescription(moment.details) }}</small>
          <div class="flex justify-between pt-2">
            <button @click="toggleFullDescription" class="text-my-blue font-regular">{{ showFullDescription ? 'less' : 'View details' }}</button>
            <div class="flex font-regular">
              <span class="mr-2 text-my-grey">{{ moment.createdAt }}</span>
              <span>{{ moment.futureDate }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  moment: {
    type: Object,
    required: true
  }
});

const isLoading = ref(false);
const error = ref(null);
const showFullDescription = ref(false);
const router = useRouter();

const toggleFullDescription = () => {
  showFullDescription.value = !showFullDescription.value;
  if (showFullDescription.value) {
    router.push(`/profile/${props.moment._id}`);
  }
};

const truncatedDescription = (description) => {
  if (!showFullDescription.value) {
    return description.substring(0, 300) + '...';
  }
  return description;
};
</script>