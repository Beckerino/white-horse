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
        />
        <q-btn
          flat dense
          icon="autorenew"
          @click="dialogUpdate = true"
          class="q-ml-md"
          color="warning"
          label="Alterar"
        />
        <q-btn
          flat dense
          icon="remove"
          @click="dialogRemove = true"
          class="q-ml-md"
          color="negative"
          label="Remover"
        />
        <q-btn
          flat round dense
          :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
          @click="props.toggleFullscreen"
          class="q-ml-md"
        />
    </template>
    </q-table>
    <q-dialog v-model="dialogCreate" persistent>
      <q-card>
        <q-toolbar>
          <q-toolbar-title><span class="text-weight-bold">Cadastrar</span> nova conta</q-toolbar-title>
          <q-btn flat dense icon="close" v-close-popup />
        </q-toolbar>
        <q-card-section>
          <q-form class="row">
            <q-input v-model="create.nome" class="fit q-ma-xs" outlined label="Nome"/>
            <div class="row fit">
              <q-input v-model="create.cpfcnpj" class="col q-ma-xs" outlined label="Cpf / Cnpj"/>
              <q-input v-model="create.valor"  class="col q-ma-xs" outlined label="Valor R$" mask="R$ #####"/>
            </div>
            <div class="row fit">
              <div class="col q-ma-xs">
                <q-input outlined v-model="create.datareceber" mask="date" :rules="['date']">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy ref="qDateProxy1" transition-show="scale" transition-hide="scale">
                        <q-date v-model="create.datareceber" @input="() => $refs.qDateProxy1.hide()" />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="col q-ma-xs">
                <q-input outlined v-model="create.datarecebido" mask="date" :rules="['date']">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy ref="qDateProxy2" transition-show="scale" transition-hide="scale">
                        <q-date v-model="create.datarecebido" @input="() => $refs.qDateProxy2.hide()" />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
            </div>
            <div class="row fit">
              <q-select v-model="create.tipoconta" :options="create.tipodecontaopt" class="col q-ma-xs"  outlined label="Tipo de Conta"/>
              <q-select v-model="create.situacao" :options="create.situacaoopt" class="col q-ma-xs" outlined label="Situacao"/>
            </div>
          <div class="row fit q-mt-md">
            <q-btn dense color="negative" class="col q-ma-xs" label="Voltar" v-close-popup />
            <q-btn dense color="primary" class="col q-ma-xs" label="Cadastrar" type="submit"/>
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
  name: 'ContasaPagar',
  data() {
    return {
      create: {
        nome: '',
        cpfcnpj: '',
        tipoconta: '',
        tipodecontaopt: ['pagar','receber'],
        situacaoopt: ['pago','pendente'],
        valor: '',
        datareceber: '',
        datarecebido: '',
        situacao: ''
      },
      update: {
        nome: '',
        cpfcnpj: '',
        tipoconta: '',
        tipodecontaopt: ['pagar','receber'],
        situacaoopt: ['pago','pendente'],
        valor: '',
        datareceber: '',
        datarecebido: '',
        situacao: ''
      },
      columns: [
        { name: 'id', align: 'left', label: 'ID', field: 'id', sortable: true },
        { name: 'cpfcnpj', align:'left', label: 'Cpf/Cnpj', field: 'cpfcnpj', sortable: true },
        { name: 'nome', align: 'left', label: 'Nome', field: 'nome', sortable: true },
        { name: 'tipoconta', align: 'left', label: 'Tipo de Conta', field: 'tipoconta', sortable: true },
        { name: 'valor', align: 'left', label: 'Valor (R$)', field: 'valor', sortable: true },
        { name: 'datareceber', align: 'left', label: 'Data à Receber', field: 'datareceber', sortable: true },
        { name: 'datarecebido', align: 'left', label: 'Data Recebido', field: 'datarecebido', sortable: true },
        { name: 'situacao', align: 'left', label: 'Situação', field: 'situacao', sortable: true },
      ],
      data: [
        {
          name: 'KitKat',
          id: 518,
          cpfcnpj: 26.0,
          nome: 65,
          tipoconta: 7,
          valor: "54,00",
          datareceber: '12%',
          datarecebido: '6%',
          situacao: 'PAGO'
        }
      ],
      dialogCreate: true,
      dialogRead: false,
      dialogUpdate: false,
      dialogRemove: false,
    }
  },
  methods: {
    createConta(){
    },
    readConta(){},
    updateConta(){},
    removeConta(){},
  },
}
</script>

<style scoped>
.q-field--with-bottom {
  padding-bottom: 0;
}
</style>
