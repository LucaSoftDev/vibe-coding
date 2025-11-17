<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title> Quasar App </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header>Páginas</q-item-label>

        <q-item
          v-for="link in navLinks"
          :key="link.to"
          clickable
          v-ripple
          :to="link.to"
        >
          <q-item-section avatar>
            <q-icon :name="link.icon" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ link.title }}</q-item-label>
            <q-item-label caption>{{ link.caption }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const navLinks = [
  { title: 'Início', caption: 'Página inicial', icon: 'home', to: '/' },
  { title: 'Form Builder', caption: 'Layout avançado', icon: 'view_quilt', to: '/form-builder' },
  { title: 'Workshops', caption: 'Cadastro de workshop', icon: 'event', to: '/workshop' },
  { title: 'Produtos', caption: 'Cadastro de produtos', icon: 'inventory_2', to: '/products' },
  { title: 'Clientes', caption: 'Cadastro de clientes', icon: 'event', to: '/customer' },
];

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>
