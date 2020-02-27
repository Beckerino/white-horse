<template>
  <q-page class="flex flex-center">
     <div class="q-pa-md">
    <q-table
      title="Treats"
      dense
      :data="data"
      :columns="columns"
      row-key="name"
    />
  </div>
  </q-page>
</template>

<script>
export default {
  name: 'ContasaPagar',
  data() {
    return {
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
          valor: 54,
          datareceber: '12%',
          datarecebido: '6%',
          situacao: 'PAGO'
        }
      ]
    }
  }
}
</script>
