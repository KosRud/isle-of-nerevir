import { createRouter, createMemoryHistory } from 'vue-router';

const routes = [
	{ path: '/', component: () => import('./routes/Home.vue') },
	{
		path: '/create',
		component: () => import('./routes/CreateCharacter.vue'),
	},
];

const router = createRouter({
	history: createMemoryHistory(),
	routes,
});

export { router as default };
