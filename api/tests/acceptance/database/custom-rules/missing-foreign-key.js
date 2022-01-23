const rule = {
  name: 'missing-foreign-key',
  docs: {
    description: '***Id columns should leverage a foreign key to ensure consistency',
    url: '...',
  },
  process({ schemaObject, report }) {
    const columnValidator = ({ column, tableName }) => {
      const referenceSuffix = 'Id';

      if (column.name.endsWith(referenceSuffix) && column.reference === undefined) {
        report({
          rule: this.name,
          identifier: `${schemaObject.name}.${tableName}`,
          message:
            `The column ${tableName}.${column.name} ends by "Id", but is not associated with a foreign key.\n` +
            `Foreign keys ensure data consistency, have low overhead, and are hard to create after data has been inserted.\n`,
          suggestedMigration:
            `Check all values in ${tableName}.${column.name} have a match in target table.\n` +
            `Then add the foreignKey: ALTER TABLE "${tableName}" ADD CONSTRAINT fk_<TARGET_TABLE>_<TARGET_COLUM>_foreign (${column.name}) REFERENCES <TARGET_TABLE> (id);\n`,
        });
      }
    };

    schemaObject.tables.forEach((table) => {
      table.columns.forEach((column) => {
        columnValidator({ column, tableName: table.name });
      });
    });
  },
};

module.exports = rule;
