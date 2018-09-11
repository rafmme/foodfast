import users from './users';
import foods from './foods';

const orders = [
  {
    id: 1,
    foodId: foods[0].id,
    customerId: users[0].id,
    quantity: 11,
    deliveryAddress: '234 Allen Rd, Lagos',
    phoneNumber: '0812345678',
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 2,
    foodId: foods[0].id,
    customerId: users[1].id,
    quantity: 20,
    deliveryAddress: 'Jibowu, Yaba, Lagos',
    phoneNumber: '0812345478',
    status: 'canceled',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 3,
    foodId: foods[2].id,
    customerId: users[0].id,
    quantity: 1,
    deliveryAddress: 'Wuse II, Abuja',
    phoneNumber: '0812344578',
    status: 'completed',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 4,
    foodId: foods[1].id,
    customerId: users[1].id,
    quantity: 10,
    deliveryAddress: 'Garki, Abuja',
    phoneNumber: '0812349078',
    status: 'accepted',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];
export default orders;
