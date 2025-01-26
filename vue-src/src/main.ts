import './style.css';
import { createApp } from 'vue';
import { init } from '@neutralinojs/lib';
import App from './App.vue';
import router from './router';

createApp(App).use(router).mount('#app');
init();
