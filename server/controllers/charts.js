import Transaction from "../models/transaction.js";

export const fetchBarChart = async (req, res) => {
  try {
    const selectedMonth = req.query.month;
    let dateOfSaleMatch;

    //checking if month is valid
    if (selectedMonth && !/^(0?[1-9]|1[0-2])$/.test(selectedMonth)) {
      return res.status(400).json({
        success: false,
        message: "Invalid month parameter",
      });
    }

    if (selectedMonth) {
      dateOfSaleMatch = {
        $regex: `^\\d{4}-${
          selectedMonth < 10 ? "0" + selectedMonth : selectedMonth
        }-\\d{2}`,
      };
    } else {
      // If no month parameter is provided, match all months
      dateOfSaleMatch = {
        $regex: `^\\d{4}-\\d{2}-\\d{2}`,
      };
    }
    const priceRanges = [
      { min: 0, max: 100 },
      { min: 101, max: 200 },
      { min: 201, max: 300 },
      { min: 301, max: 400 },
      { min: 401, max: 500 },
      { min: 501, max: 600 },
      { min: 601, max: 700 },
      { min: 701, max: 800 },
      { min: 801, max: 900 },
      { min: 901, max: Number.MAX_SAFE_INTEGER }, // Assuming no maximum limit for the last range
    ];

    const priceRangeAggregation = priceRanges.map((range) => ({
      $sum: {
        $cond: [
          {
            $and: [
              { $gte: ["$price", range.min] },
              { $lt: ["$price", range.max] },
            ],
          },
          1,
          0,
        ],
      },
    }));

    const barChartData = await Transaction.aggregate([
      {
        $match: {
          dateOfSale: dateOfSaleMatch,
        },
      },
      {
        $group: {
          _id: null,
          ...Object.fromEntries(
            priceRanges.map((range, index) => [
              `range${index}`,
              priceRangeAggregation[index],
            ])
          ),
        },
      },
      {
        $project: {
          _id: 0,
          priceRanges: priceRanges.map((range, index) => ({
            range: `${range.min}-${
              range.max == Number.MAX_SAFE_INTEGER ? " above" : range.max
            }`,
            count: `$range${index}`,
          })),
        },
      },
    ]);

    // Send the response
    res.json({ success: true, data: barChartData[0]?.priceRanges || [] });
  } catch (error) {
    console.log("ERROR preparing response", error);
    res.status(500).send({ success: false, error: error });
  }
};

export const fetchPieChart = async (req, res) => {
  try {
    const selectedMonth = req.query.month;
    let dateOfSaleMatch;

    //checking if month is valid
    if (selectedMonth && !/^(0?[1-9]|1[0-2])$/.test(selectedMonth)) {
      return res.status(400).json({
        success: false,
        message: "Invalid month parameter",
      });
    }

    if (selectedMonth) {
      dateOfSaleMatch = {
        $regex: `^\\d{4}-${
          selectedMonth < 10 ? "0" + selectedMonth : selectedMonth
        }-\\d{2}`,
      };
    } else {
      // If no month parameter is provided, match all months
      dateOfSaleMatch = {
        $regex: `^\\d{4}-\\d{2}-\\d{2}`,
      };
    }

    const pieChartData = await Transaction.aggregate([
      {
        $match: {
          dateOfSale: dateOfSaleMatch,
        },
      },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          count: 1,
        },
      },
    ]);

    // Send the response
    res.json({ success: true, data: pieChartData || [] });
  } catch (error) {
    console.error("Error fetching pie chart data:", error);
    res.status(500).json({ success: false, error: error });
  }
};
