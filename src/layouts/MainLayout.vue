<template>
  <q-layout view="lHh LpR lFf">

    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="left = !left" />

        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo/svg/quasar-logo.svg">
          </q-avatar>
          Title
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="left" side="left" bordered>
      <p class="text-h6">Menus</p>
      <div v-for="(item, index) in menus" :key="index" class="row q-py-xs">
        <q-btn class="col self-center" :color="item.color" :to="item.to" flat >{{item.title}}</q-btn>
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer elevated class="bg-grey-8 text-white text-center">
      Todos os direitos reservados &copy; {{date}}
    </q-footer>

  </q-layout>
</template>

<script>
export default {
  computed: {
    date () {
      return new Date().getFullYear();
    }
  },
  data () {
    return {
      left: true,
      usuario: {
      },
      menus : [
        {
          title: "Eae men kk ",
          to: "/toroute",
          color: "red"
      },
      {
          title: "Eae men kk ",
          to: "/toroute",
          color: "blue"
      },
      {
          title: "Eae men kk ",
          to: "/toroute",
          color: "green"
      },
      ]
    }
  }
}
</script>
