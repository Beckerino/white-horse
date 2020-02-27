<template>
  <q-page class="row justify-center">
     <div class="q-pa-md">
    <q-table
      title="Contas a Receber"
      class="fit"
      dense
      :data="data"
      :columns="columns"
      row-key="id"
      selection="single"
      :selected.sync="selected"
      :loading="loading"
    >
    <template v-slot:loading>
        <q-inner-loading showing color="primary" />
      </template>
    <template v-slot:top="props">
        <div class="col-4 q-table__title">Contas a Pagar</div>
        <q-space/>
        <q-btn
          flat dense
          icon="playlist_add"
          @click="createConta"
          class="q-ml-md"
          color="positive"
          label="Nova"
        />
        <q-btn
          flat dense
          icon="edit"
          @click="readConta"
          class="q-ml-md"
          color="info"
          label="Visualizar"
        >
        <q-popup-proxy v-if="!selected[0]">
        <q-banner>
          <template v-slot:avatar>
            <q-icon name="error_outline" color="warning" />
          </template>
          Por favor selecione uma conta para visualizar!
        </q-banner>
      </q-popup-proxy>
      </q-btn>
        <q-btn
          flat dense
          icon="autorenew"
          @click="updateConta"
          class="q-ml-md"
          color="warning"
          label="Alterar"
        >
        <q-popup-proxy v-if="!selected[0]">
        <q-banner>
          <template v-slot:avatar>
            <q-icon name="error_outline" color="warning" />
          </template>
          Por favor selecione uma conta para editar!
        </q-banner>
      </q-popup-proxy>
      </q-btn>
        <q-btn
          flat dense
          icon="remove"
          @click="removeConta"
          class="q-ml-md"
          color="negative"
          label="Remover"
        >
        <q-popup-proxy v-if="!selected[0]">
        <q-banner>
          <template v-slot:avatar>
            <q-icon name="error_outline" color="warning" />
          </template>
          Por favor selecione uma conta antes para remover!
        </q-banner>
      </q-popup-proxy>
      </q-btn>
        <q-btn
          flat round dense
          :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
          @click="props.toggleFullscreen"
          class="q-ml-md"
        >
        <q-popup-proxy v-if="!selected[0]">
        <q-banner>
          <template v-slot:avatar>
            <q-icon name="error_outline" color="warning" />
          </template>
          Por favor selecione uma conta antes de visualizar
        </q-banner>
      </q-popup-proxy>
      </q-btn>
    </template>
    </q-table>
    <q-dialog v-model="dialog.show" persistent @before-hide="limpacampos">
      <q-card>
        <q-toolbar>
          <q-toolbar-title><span class="text-weight-bold">{{dialog.main}}</span> {{dialog.adjacent}}</q-toolbar-title>
          <q-btn flat dense icon="close" v-close-popup />
        </q-toolbar>
        <q-card-section>
          <q-form class="row" @submit="enviarForm">
            <q-input :readonly="dialog.readonly" v-model="alvo.nome" class="fit q-ma-xs" outlined label="Nome"/>
            <div class="row fit">
              <q-input :readonly="dialog.readonly" v-model="alvo.valor" class="col q-ma-xs" outlined label="Valor R$" mask="#####"/>
              <q-input :readonly="dialog.readonly" v-model="alvo.valor_pago"  class="col q-ma-xs" outlined label="Valor Pago R$" mask="#####"/>
            </div>
            <div class="row fit">
              <div class="col q-ma-xs">
                <q-input :readonly="dialog.readonly" outlined v-model="alvo.data_venc" label="Data Vencimento" placeholder="2020/02/18" mask="date" :rules="['date']">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy ref="qDateProxy1" transition-show="scale" transition-hide="scale">
                        <q-date v-model="alvo.data_venc" @input="() => $refs.qDateProxy1.hide()" />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="col q-ma-xs">
                <q-input :readonly="dialog.readonly" outlined v-model="alvo.data_pagamento" label="Data Recebido" placeholder="2020/02/18" mask="date" :rules="['date']">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy ref="qDateProxy2" transition-show="scale" transition-hide="scale">
                        <q-date v-model="alvo.data_pagamento" @input="() => $refs.qDateProxy2.hide()" />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
            </div>
            <div class="row fit">
              <q-select readonly v-model="alvo.tipo_conta" class="col q-ma-xs"   outlined label="Tipo de Conta"/>
              <q-select :readonly="dialog.readonly" v-model="alvo.situacao" :options="alvo.situacaoopt" class="col q-ma-xs" outlined label="Situacao"/>
            </div>
          <div class="row fit q-mt-md"  v-if="dialog.tipo != 'read'">
            <q-btn dense color="negative" class="col q-ma-xs" label="Voltar" v-close-popup />
            <q-btn dense color="primary" class="col q-ma-xs" :label="dialog.main" type="submit"/>
          </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
  </q-page>
</template>

<script>
import Axios from 'axios';
export default {
  name: 'ContasaPagar', computed: {
    date () {
      return new Date().toString();
    }
  },
  created () {
    this.getData();
  },
  data () {
    return {
      selected: [],
      alvo: {
        tipoconta: 'Pagar',
        situacao: '',
        data_pagamento: '',
        data_venc: '',
        situacaoopt: ['Pendente', 'Pago', 'Pago adiantado', 'Pago em atraso']
      },
      columns: [
        { name: 'id', align: 'left', label: 'ID', field: 'id', sortable: true },
        { name: 'cpfcnpj', align: 'left', label: 'Cpf/Cnpj', field: 'cpfcnpj', sortable: true },
        { name: 'nome', align: 'left', label: 'Nome', field: 'nome', sortable: true },
        { name: 'tipoconta', align: 'left', label: 'Tipo de Conta', field: 'tipo_conta', sortable: true },
        { name: 'valor', align: 'left', label: 'Valor (R$)', field: 'valor', sortable: true },
        { name: 'datavencimento', align: 'left', label: 'Data Vencimento', field: 'data_venc', sortable: true },
        { name: 'datapagamento', align: 'left', label: 'Data do Pagamento', field: 'data_pagamento', sortable: true },
        { name: 'situacao', align: 'left', label: 'Situação', field: 'situacao', sortable: true },
      ],
      data: [],
      dialog: {
        main: '',
        adjacent: '',
        tipo: '',
        readonly: false,
        show: false
      },
      loading: false,
    }
  },
  methods: {
    createData (data) {
      let self = this;
      Axios.post("http://localhost:9000/pagar", data).then(response => {
        console.log(response)
        self.data = response.data
      })
    },
    getData () {
      let self = this;
      Axios.get("http://localhost:9000/pagar").then(response => {
        console.log(response)
        self.data = response.data
      })
    },
    updateData (data) {
      let self = this;
      Axios.put("http://localhost:9000/pagar", data).then(response => {
        console.log(response)
      })
    },
    removeData (data) {
      let self = this;
      Axios.delete("http://localhost:9000/pagar", data).then(response => {
        console.log(response)
      })
    },
    createConta () {
      this.limpacampos();
      this.dialog.main = 'Cadastrar';
      this.dialog.adjacent = ' uma nova conta';
      this.dialog.tipo = 'create';
      this.dialog.readonly = false;
      this.dialog.show = true;
    },
    readConta () {
      if (this.selected[0]) {
        this.dialog.show = true;
        this.dialog.main = 'Visualizar';
        this.dialog.adjacent = ' conta';
        this.dialog.tipo = 'read';
        this.dialog.readonly = true;
        let target = { ...this.selected[0] }
        this.alvo = target;
      }
    },
    updateConta () {
      if (this.selected[0]) {
        this.dialog.show = true;
        this.dialog.main = 'Atualizar';
        this.dialog.adjacent = ' uma conta';
        this.dialog.tipo = 'update';
        this.dialog.readonly = false;
        this.dialog.show = true;
        let target = { ...this.selected[0] }
        this.alvo = target
        this.alvo.tipoconta = 'Pagar',
          this.alvo.situacaoopt = ['Pendente', 'Pago', 'Pago adiantado', 'Pago em atraso']
      }
    },
    removeConta () {
      if (this.selected[0]) {
        let target = { ...this.selected[0] }
        this.removeData(target)
        this.getData()

      }
    },
    limpacampos () {
      this.alvo.tipo_conta = 'Pagar'
      this.alvo.nome = ''
      this.alvo.valor = ''
      this.alvo.tipo_conta = 'Pagar'
      this.alvo.valor_pago = ''
      this.alvo.data_pagamento = '2020-12-12'
      this.alvo.data_venc = '2020-12-12'
      this.alvo.situacao = ''
    },
    enviarForm () {
      let data = { ...this.alvo }
      data.valor = parseInt(this.alvo.valor)
      data.valor_pago = parseInt(this.alvo.valor_pago)
      data.tipo_conta = 1
      data.situacao = this.alvo.situacaoopt.indexOf(data.situacao)
      switch (this.dialog.tipo) {
        case 'create':
          this.createData(data)
          this.getData()
          break;
        case 'update':
          this.updateData(data)
          this.getData()
          break;
      }
    },
  }
}
</script>

<style scoped>
.q-field--with-bottom {
  padding-bottom: 0;
}
</style>
