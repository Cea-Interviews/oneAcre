exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("Repayments")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("Repayments").insert([
        {
          CustomerID: 1,
          SeasonID: 180,
          Date: "3/3/2016",
          Amount: 500,
        },
        {
          CustomerID: 2,
          SeasonID: 180,
          Date: "3/4/2016",
          Amount: 100,
        },
        {
          CustomerID: 3,
          SeasonID: 0,
          Date: "3/5/2016",
          Amount: 300,
        },
        {
          CustomerID: 4,
          SeasonID: 180,
          Date: "3/6/2016",
          Amount: 500,
        },
        {
          CustomerID: 5,
          SeasonID: 180,
          Date: "3/7/2016",
          Amount: 500,
        },
        {
          CustomerID: 7,
          SeasonID: 180,
          Date: "3/8/2016",
          Amount: 200,
        },
        {
          CustomerID: 8,
          SeasonID: 180,
          Date: "3/9/2016",
          Amount: 500,
        },
        {
          CustomerID: 9,
          SeasonID: 180,
          Date: "3/10/2016",
          Amount: 100,
        },
        {
          CustomerID: 10,
          SeasonID: 180,
          Date: "3/11/2016",
          Amount: 500,
        },
        {
          CustomerID: 11,
          SeasonID: 0,
          Date: "3/12/2016",
          Amount: 330,
        },
        {
          CustomerID: 12,
          SeasonID: 180,
          Date: "3/13/2016",
          Amount: 500,
        },
      ]);
    });
};
