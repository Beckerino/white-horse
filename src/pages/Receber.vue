<template>
  <q-page class="row justify-center">
     <div class="q-pa-md">
    <q-table
      title="Contas a Receber"
      class="fit"
      dense
      :data="data"
      :columns="columns"
      row-key="name"
      selection="single"
      :selected.sync="selected"
    >
    <template v-slot:top="props">
        <div class="col-2 q-table__title">Contas a Pagar</div>
        <q-space/>
        <q-btn
          flat dense
          icon="playlist_add"
          @click="dialogCreate = true"
          class="q-ml-md"
          color="positive"
          label="Nova"
        />
        <q-btn
          flat dense
          icon="edit"
          @click="dialogRead = true"
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
          @click="dialogUpdate = true"
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
          @click="dialogRemove = true"
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
            <q-input v-model="alvo.nome" class="fit q-ma-xs" outlined label="Nome"/>
            <div class="row fit">
              <q-input v-model="alvo.cpfcnpj" class="col q-ma-xs" outlined label="Cpf / Cnpj"/>
              <q-input v-model="alvo.valor"  class="col q-ma-xs" outlined label="Valor R$" mask="R$ #####"/>
            </div>
            <div class="row fit">
              <div class="col q-ma-xs">
                <q-input outlined v-model="alvo.data_receber" mask="date" :rules="['date']">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy ref="qDateProxy3" transition-show="scale" transition-hide="scale">
                        <q-date v-model="alvo.data_receber" @input="() => $refs.qDateProxy3.hide()" />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="col q-ma-xs">
                <q-input outlined v-model="alvo.data_recebido" mask="date" :rules="['date']">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy ref="qDateProxy4" transition-show="scale" transition-hide="scale">
                        <q-date v-model="alvo.data_recebido" @input="() => $refs.qDateProxy4.hide()" />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
            </div>
            <div class="row fit">
              <q-select readonly v-model="alvo.tipoconta" class="col q-ma-xs"  outlined label="Tipo de Conta"/>
              <q-select v-model="alvo.situacao" :options="alvo.situacaoopt" class="col q-ma-xs" outlined label="Situacao"/>
            </div>
          <div class="row fit q-mt-md">
            <q-btn dense color="negative" class="col q-ma-xs" label="Voltar" v-close-popup @click="limpacampos"/>
            <q-btn dense color="primary" class="col q-ma-xs" label="Salvar" type="submit"/>
          </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
  </q-page>
</template>

<script>
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
        situacaoopt: ['Pendente', 'Recebido', 'Recebido em atraso'],
      },
      columns: [
        { name: 'id', align: 'left', label: 'ID', field: 'id', sortable: true },
        { name: 'cpfcnpj', align: 'left', label: 'Cpf/Cnpj', field: 'cpfcnpj', sortable: true },
        { name: 'nome', align: 'left', label: 'Nome', field: 'nome', sortable: true },
        { name: 'tipoconta', align: 'left', label: 'Tipo de Conta', field: 'tipoconta', sortable: true },
        { name: 'valor', align: 'left', label: 'Valor (R$)', field: 'valor', sortable: true },
        { name: 'datavencimento', align: 'left', label: 'Data Vencimento', field: 'datavencimento', sortable: true },
        { name: 'datapagamento', align: 'left', label: 'Data do Pagamento', field: 'datapagamento', sortable: true },
        { name: 'situacao', align: 'left', label: 'Situação', field: 'situacao', sortable: true },
      ],
      data: [],
      dialogCreate: false,
      dialogRead: false,
      dialogUpdate: false,
      dialogRemove: false,
    }
  },
  methods: {

    createData (data) {
      let self = this;
      Axios.post("http://localhost:9000/receber", data).then(response => {
        console.log(response)
        self.data = response.data
      })
    },
    getData () {
      let self = this;
      Axios.get("http://localhost:9000/receber").then(response => {
        console.log(response)
        self.data = response.data
      })
    },
    updateData (data) {
      let self = this;
      Axios.put("http://localhost:9000/receber", data).then(response => {
        console.log(response)
      })
    },
    removeData (data) {
      let self = this;
      Axios.delete("http://localhost:9000/receber", data).then(response => {
        console.log(response)
      })
    },
    createConta () {
      this.limpacampos()
    },
    readConta () {
      if (this.selected[0]) {
        let target = { ...this.selected[0] }
        this.alvo = target
      } else {
        this.dialogRead = false
      }
    },
    updateConta () {
      if (this.selected[0]) {
        let target = { ...this.selected[0] }
        this.alvo = target
      } else {
        this.dialogUpdate = false
      }
    },
    removeConta () {
      if (this.selected[0]) {
        let target = { ...this.selected[0] }
        this.alvo = target
      } else {

      }
    },
    limpacampos () {
      this.alvo.situacaoopt = ['Pendente', 'Pago', 'Pago adiantado', 'Pago em atraso']
      this.alvo.nome = ''
      this.alvo.cpfcnpj = ''
      this.alvo.tipoconta = 'Pagar'
      this.alvo.valor = ''
      this.alvo.valorpago = ''
      this.alvo.datapagamento = ''
      this.alvo.datavencimento = ''
      this.alvo.situacao = ''
    }
  },
}
</script>

<style scoped>
.q-field--with-bottom {
  padding-bottom: 0;
}
</style>
