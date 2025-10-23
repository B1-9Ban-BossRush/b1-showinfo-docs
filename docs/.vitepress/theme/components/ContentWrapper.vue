<script lang="ts" setup>
import { onMounted, ref } from 'vue';

const wrapperRef = ref<HTMLDivElement>();

onMounted(() => {
    wrapperRef.value?.style.setProperty('--enter-step', '30ms');
});

const classes = { 'slide-enter-content': true };
</script>


<template>
    <div ref="wrapperRef" class="vm-content-wrapper" :class="classes">
        <slot />
    </div>
</template>
