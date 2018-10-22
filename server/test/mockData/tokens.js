import { generateToken } from '../../helpers/utils';

const adminToken = generateToken({
  userId: '2a606085-5a9d-4481-a7e1-e7e98bea2160',
  isAdmin: true
});

const user1Token = generateToken({
  userId: 'be500475-db64-4294-b099-1c1655010452',
  isAdmin: false
});

const user2Token = generateToken({
  userId: 'd96fd881-2096-46f2-88d8-13c925ebbc87',
  isAdmin: false
});

const invalidToken = 'ehrh uhto  h gohoeh';

export {
  user1Token,
  user2Token,
  adminToken,
  invalidToken
};
