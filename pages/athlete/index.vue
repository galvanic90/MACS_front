<script setup>
    const { data } = await $fetch('http://localhost:8080/athlete')
    console.log(data)
    
</script>
<template>

</template>
