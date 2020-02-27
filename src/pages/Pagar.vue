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
              <q-input :readonly="dialog.readonly" v-model="alvo.valor" class="col q-ma-xs" outlined label="Valor R$" mask="R$ #####"/>
              <q-input :readonly="dialog.readonly" v-model="alvo.valorpago"  class="col q-ma-xs" outlined label="Valor Pago R$" mask="R$ #####"/>
            </div>
            <div class="row fit">
              <div class="col q-ma-xs">
                <q-input :readonly="dialog.readonly" outlined v-model="alvo.datavencimento" label="Data Vencimento" placeholder="2020/02/18" mask="date" :rules="['date']">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy ref="qDateProxy1" transition-show="scale" transition-hide="scale">
                        <q-date v-model="alvo.datavencimento" @input="() => $refs.qDateProxy1.hide()" />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="col q-ma-xs">
                <q-input :readonly="dialog.readonly" outlined v-model="alvo.datapagamento" label="Data Recebido" placeholder="2020/02/18" mask="date" :rules="['date']">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy ref="qDateProxy2" transition-show="scale" transition-hide="scale">
                        <q-date v-model="alvo.datapagamento" @input="() => $refs.qDateProxy2.hide()" />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
            </div>
            <div class="row fit">
              <q-select readonly v-model="alvo.tipoconta" class="col q-ma-xs"   outlined label="Tipo de Conta"/>
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
export default {
  name: 'ContasaPagar', computed: {
    date () {
      return new Date().toString();
    }
  },
  data () {
    return {
      selected: [],
      alvo: {
        tipoconta: 'Pagar',
        situacaoopt: ['Pendente', 'Pago', 'Pago adiantado', 'Pago em atraso']
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
      data: [
        {
          id: 518,
          cpfcnpj: '904.151.832-00',
          nome: 'Diego Correia de Brito',
          tipoconta: 'Pagar',
          valor: '54,00',
          valorpago: '54,00',
          datavencimento: '2020/02/15',
          datapagamento: '2020/02/15',
          situacao: 'Pago'
        },
        {
          id: 517,
          cpfcnpj: '904.151.832-00',
          nome: 'Diego Correia de Brito',
          tipoconta: 'Pagar',
          valor: '54,00',
          valorpago: '54,00',
          datavencimento: '2020/02/15',
          datapagamento: '2020/02/15',
          situacao: 'Pago'
        },
        {
          id: 519,
          cpfcnpj: '904.151.832-00',
          nome: 'Diego Correia de Brito',
          tipoconta: 'Pagar',
          valor: '54,00',
          valorpago: '54,00',
          datavencimento: '2020/02/15',
          datapagamento: '2020/02/15',
          situacao: 'Pago'
        },
        {
          id: 516,
          cpfcnpj: '904.151.832-00',
          nome: 'Diego Correia de Brito',
          tipoconta: 'Pagar',
          valor: '54,00',
          valorpago: '54,00',
          datavencimento: '2020/02/15',
          datapagamento: '2020/02/15',
          situacao: 'Pago'
        },
        {
          id: 518,
          cpfcnpj: '904.151.832-00',
          nome: 'Diego Correia de Brito',
          tipoconta: 'Pagar',
          valor: '54,00',
          valorpago: '54,00',
          datavencimento: '2020/02/15',
          datapagamento: '2020/02/15',
          situacao: 'Pago'
        },
      ],
      dialog: {
        main: '',
        adjacent: '',
        tipo: '',
        readonly: false,
        show: false
      }
    }
  },
  methods: {
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
        this.alvo.tipoconta ='Pagar',
        this.alvo.situacaoopt = ['Pendente', 'Pago', 'Pago adiantado', 'Pago em atraso']
      }
    },
    removeConta () {
      if (this.selected[0]) {
        let target = { ...this.selected[0] }
        this.alvo = target
      }
    },
    limpacampos () {
      this.alvo.tipoconta = 'Pagar'
      this.alvo.nome = ''
      this.alvo.cpfcnpj = ''
      this.alvo.valor = ''
      this.alvo.valorpago = ''
      this.alvo.datapagamento = ''
      this.alvo.datavencimento = ''
      this.alvo.situacao = ''
    },
    enviarForm () { }
  },
}
</script>

<style scoped>
.q-field--with-bottom {
  padding-bottom: 0;
}
</style>
