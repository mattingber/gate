import * as env from 'env-var';
import './dotenv';

const DATA_SOURCE = [
  'dataSource1',
  'dataSource2',
  'aka',
  'es_name',
  'ads_name',
  'adNN_name',
  'nvSQL_name',
  'lmn_name',
  'mdn_name',
  'mm_name',
  'city_name',
];

const sensitiveDataSource = DATA_SOURCE[0];
const sensitive2DataSource = DATA_SOURCE[1];

const sensitive2HierarchyCondition = {
  method: 'hierarchyCondition',
  field: 'hierarchy',
  value: `root/sensitive2`,
};

const config = {
  web: {
    port: env.get('PORT').required().asPortNumber(),
    isAuth: env.get('IS_AUTH').required().asBool(),
    requiredScopes: ['write', 'read'],
    services: {
      elastic: env.get('ELASTIC_SERVICE').required().asString(),
      read: env.get('READ_SERVICE').required().asString(),
      write: env.get('WRITE_SERVICE').required().asString(),
    },
  },
  entitiesType: {
    role: 'role',
    entity: 'entity',
    digitalIdentity: 'digitalIdentity',
  },
  rules: {
    filters: {
      entity: [
        {
          name: 'hideSensitivePersons',
          field: 'hierarchy',
          values: [`root/sensitive`, `granpa/son`],
        },
        {
          name: 'sourceFilter',
          field: 'source',
          values: [`city_name`],
        },
      ],
      group: [
        {
          name: 'hideSensitivePersons',
          field: 'source',
          values: [`root/sensitive`, `granpa/son`],
        },
      ],
      digitalIdentity: [],
      role: [],
      organizationGroup: [],
    },
    transformers: {
      entity: [
        {
          name: 'removeSensitiveDomainUsers',
          method: 'arrayFilter',
          targetField: 'domainUsers',
          conditions: [
            {
              method: 'simpleValueCondition',
              field: 'dataSource',
              value: `${sensitiveDataSource}`,
            },
          ],
        },
        {
          name: 'removeJob',
          method: 'fieldExclude',
          targetField: 'job',
        },
        {
          name: 'removeSensitive2DomainUsersHierarchy',
          method: 'arrayMapper',
          targetField: 'domainUsers',
          transformer: {
            method: 'fieldExclude',
            targetField: 'hierarchy',
            conditions: [
              {
                method: 'simpleValueCondition',
                field: 'dataSource',
                value: `${sensitive2DataSource}`,
              },
            ],
          },
        },
        {
          name: 'removeSensitive2Hierarchy',
          method: 'fieldExclude',
          targetField: 'hierarchy',
          conditions: [sensitive2HierarchyCondition],
        },
        {
          name: 'removeSensitive2DirectGroup',
          method: 'fieldExclude',
          targetField: 'directGroup',
          conditions: [sensitive2HierarchyCondition],
        },
      ],
      group: [],
      digitalIdentity: [],
      role: [],
      organizationGroup: [],
    },
  },
  scopes: {
    externalScope: ['sourceFilter'],
    // ['removeSensitive2Hierarchy', 'removeSensitive2DirectGroup'],
  },
};

export default config;
