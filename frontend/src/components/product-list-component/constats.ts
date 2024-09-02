export const proizvod = {
  title: 'Proizvod',
  dataIndex: 'name',
  key: 'name',
  editable: true,
}

export const proizvodjac = {
  title: 'Proizvodjac',
  dataIndex: 'manufacturer',
  key: 'manufacturer',
  editable: true,
}

export const model = {
  title: 'Model',
  dataIndex: 'model',
  key: 'model',
  editable: true,
}

export const cena = {
  title: 'Cena',
  dataIndex: 'price',
  key: 'price',
  editable: true,
  render: (price: number) => `${price} RSD`,
}

export const kolicina = {
  title: 'Kolicina',
  dataIndex: 'quantity',
  key: 'quantity',
  editable: true,
}

export const SKU = {
  title: 'SKU',
  dataIndex: 'SKU',
  key: 'SKU',
  editable: true,
}
