import users from './users';
import foods from './foods';

const orders = [
  {
    id: 1,
    foodId: foods[0].id,
    customerId: users[0].id,
    quantity: 11,
    deliveryAddress: '234 Allen Rd, Lagos',
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
    status: 'accepted',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];
export default orders;
