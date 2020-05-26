exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("Customers")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("Customers").insert([
        { CustomerID: 1, CustomerName: "Fred Barasa" },
        {
          CustomerID: 2,
          CustomerName: "Imelda Kundu",
        },
        {
          CustomerID: 3,
          CustomerName: "Leah Kundu",
        },
        {
          CustomerID: 4,
          CustomerName: "Beatrice Wafula Machuma",
        },
        {
          CustomerID: 5,
          CustomerName: "John Juma Shitoshe",
        },
        {
          CustomerID: 7,
          CustomerName: "Donald Masika",
        },
        {
          CustomerID: 8,
          CustomerName: "Bilasio Masinde",
        },
        {
          CustomerID: 9,
          CustomerName: "Peter Masinde",
        },
        {
          CustomerID: 10,
          CustomerName: "Francis S. Misiko",
        },
        {
          CustomerID: 11,
          CustomerName: "Peter Wechuli Nakitare",
        },
        {
          CustomerID: 12,
          CustomerName: "Mwanaisha Nekesa",
        },
        {
          CustomerID: 13,
          CustomerName: "John Nyongesa",
        },
      ]);
    });
};
