<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
	<h1>Hello App!</h1>
	<p><strong>Current route path:</strong> {{ $route.fullPath }}</p>
	<nav>
		<RouterLink to="/">Go to Home</RouterLink>
		<RouterLink to="/create">Create character</RouterLink>
	</nav>
	<main>
		<RouterView />
	</main>
</template>
