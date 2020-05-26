exports.up = function (knex) {
  return knex.schema
    .createTable("Seasons", (table) => {
      table.increments("id");
      table.integer("SeasonID").unique().notNullable().unsigned()
      table.string("SeasonName", 128).notNullable();
      table.date("StartDate").notNullable();
      table.date("EndDate").nullable()
    })
    .createTable("Customers", (table) => {
      table.increments("CustomerID")
      table.string("CustomerName").notNullable();
    })
    .createTable("CustomerSummaries", (table) => {
      table.increments("id");
      table
        .integer("CustomerID")
        .unsigned()
        .notNullable()
        .references("CustomerID")
        .inTable("Customers")
        .onDelete("Cascade")
        .onUpdate("Cascade");
      table
        .integer("SeasonID")
        .unsigned()
        .notNullable()
        .references("SeasonID")
        .inTable("Seasons")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      table.decimal("TotalRepaid").notNullable();
      table.decimal("TotalCredit").notNullable();
    })
    .createTable("Repayments", (table) => {
      table.increments("RepaymentsID")
      table
        .integer("CustomerID")
        .unsigned()
        .notNullable()
        .references("CustomerID")
        .inTable("Customers")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      table
        .integer("SeasonID")
        .nullable()
      table.date("Date").notNullable();
      table.decimal("Amount").notNullable();
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("Repayments")
    .dropTableIfExists("CustomerSummaries")
    .dropTableIfExists("Customers")
    .dropTableIfExists("Seasons");
};
