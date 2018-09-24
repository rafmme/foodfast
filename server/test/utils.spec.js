import chai, { expect } from 'chai';
import {
  generateQueryText,
  generateValuesTemplate,
  getObjectKeysAndValues,
  getSQLClause
} from '../helpers/dbUtils/dbQueryUtil';
import {
  convertToCamelCase,
  convertToUnderscore,
  changeObjectKeysToCamelCase,
} from '../helpers/utils';

chai.should();

describe('Util functions Test', () => {
  describe('ConvertToCamelcase function', () => {
    it('it should convert a string from under_score to camelCase', (done) => {
      expect(convertToCamelCase('created_at')).to.equals('createdAt');
      expect(convertToCamelCase('user_last_name')).to.equals('userLastName');
      expect(convertToCamelCase('created')).to.equals('created');
      expect(convertToCamelCase('updatedAt')).to.equals('updatedAt');
      expect(convertToCamelCase('User_Keys')).to.equals('userKeys');
      done();
    });
  });

  describe('ConvertToUnderscore function', () => {
    it('it should convert a string from camelCase to under_score', (done) => {
      expect(convertToUnderscore('createdAt')).to.equals('created_at');
      expect(convertToUnderscore('userLastName')).to.equals('user_last_name');
      expect(convertToUnderscore('created')).to.equals('created');
      expect(convertToUnderscore('updatedAt')).to.equals('updated_at');
      expect(convertToUnderscore('userKeys')).to.equals('user_keys');
      expect(convertToUnderscore('HomeIsHome')).to.equals('home_is_home');
      done();
    });
  });

  describe('ChangeObjectKeysToCamelCase function', () => {
    it('it should convert all keys in an object from under_score to camelCase', (done) => {
      const newObj = changeObjectKeysToCamelCase({
        name: 'Timileyin Farayola',
        user_id: 22,
        phone_number: '08123456789',
        codeName: 'Rafmme',
      });
      expect(Object.keys(newObj)[0]).to.equal('name');
      expect(Object.keys(newObj)[1]).to.equal('userId');
      expect(Object.keys(newObj)[2]).to.equal('phoneNumber');
      expect(Object.keys(newObj)[3]).to.equal('codeName');
      done();
    });
  });
});

describe('DB Query Utils Test', () => {
  const objOfKeysAndValues = getObjectKeysAndValues({
    id: 1,
    title: 'Semovita',
    description: 'meal for you',
    price: 4000,
    imageUrl: 'www.rrjr.ggk'
  });
  const valueTemplate = generateValuesTemplate(objOfKeysAndValues.values);
  const valueTemplateArray = valueTemplate.split(',');
  it('it should successfully extract the Object keys and values', (done) => {
    objOfKeysAndValues.should.have.keys('columns', 'values');
    expect(typeof objOfKeysAndValues.columns).to.be.an('string');
    expect(objOfKeysAndValues.values.length !== undefined).to.equal(true);
    expect(objOfKeysAndValues.columns.includes('image_url')).to.equal(true);
    done();
  });
  it('it should successfully generate placeholder for all fields', (done) => {
    expect(valueTemplate.length !== undefined).to.be.equal(true);
    expect(valueTemplateArray.length).to.be.equal(5);
    expect(valueTemplateArray[0] === '$1').to.equal(true);
    expect(valueTemplateArray[1] === '$2').to.equal(true);
    expect(valueTemplateArray[2] === '$3').to.equal(true);
    expect(valueTemplateArray[3] === '$4').to.equal(true);
    expect(valueTemplateArray[4] === '$5').to.equal(true);
    done();
  });
  it('it should extract the SQL query clause from the object', (done) => {
    const obj1 = {
      $OR: {}
    };
    const obj2 = {
      $AND: {}
    };
    const obj3 = {
      where: {}
    };
    expect(getSQLClause(obj3) === 'where').to.equal(true);
    expect(getSQLClause(obj2) === '$AND').to.equal(true);
    expect(getSQLClause(obj1) === '$OR').to.equal(true);
    expect(getSQLClause({ hello: {} }) === undefined).to.equal(true);
    done();
  });
  it('it should generate query statement with clause', (done) => {
    const query1 = generateQueryText(objOfKeysAndValues.columns, '$OR');
    const query2 = generateQueryText(objOfKeysAndValues.columns, '$AND');
    const query3 = generateQueryText('email', 'where');
    expect(query1).to.be.equal('id = $1 OR title = $2 OR description = $3 OR price = $4 OR image_url = $5');
    expect(query2).to.be.equal('id = $1 AND title = $2 AND description = $3 AND price = $4 AND image_url = $5');
    expect(query3).to.be.equal('email = $1');
    done();
  });
});
