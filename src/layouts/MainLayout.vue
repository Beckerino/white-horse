<template>
  <q-layout view="hHh LpR lFf">

    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="left = !left" />

        <q-toolbar-title>
            <!-- <img src="~assets/logo-credisis.png" width="150px" height="60px" class="q-my-xs"> -->
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
      left: false,
      usuario: {
      },
      menus : [
        {
          title: "Contas a Pagar ",
          to: "/pagar",
          color: "red"
      },
      {
          title: "Contas a Receber ",
          to: "/receber",
          color: "blue"
      },
      ]
    }
  }
}
</script>
