export const proizvod = {
  title: 'Proizvod',
  dataIndex: 'name',
  key: 'name',
  align: 'center',
}

export const proizvodjac = {
  title: 'Proizvodjac',
  dataIndex: 'manufacturer',
  key: 'manufacturer',
  align: 'center',
}

export const model = {
  title: 'Model',
  dataIndex: 'model',
  key: 'model',
  align: 'center',
}

export const cena = {
  title: 'Cena',
  dataIndex: 'price',
  key: 'price',
  render: (price: number) => `${price} RSD`,
  align: 'center',
}

export const kolicina = {
  title: 'Kolicina',
  dataIndex: 'quantity',
  key: 'quantity',
  align: 'center',
}

export const SKU = {
  title: 'SKU',
  dataIndex: 'SKU',
  key: 'SKU',
  align: 'center',
}
