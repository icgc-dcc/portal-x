export const schemaArr = [
  {
    displayName: 'Name',
    accessor: 'name',
  },
  {
    displayName: 'Email',
    accessor: 'email',
  },
  {
    displayName: 'Status',
    accessor: 'status',
  },
  {
    displayName: 'CreatedAt',
    accessor: 'createdAt',
  },
  {
    displayName: 'UpdatedAt',
    accessor: 'updatedAt',
  },
];

export const schemaObj = schemaArr.reduce((acc, curr) => {
  acc[curr.accessor] = curr;
  return acc;
}, {});
