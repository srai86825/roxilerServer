import Transaction from "../models/transaction.js";

export const fetchStatistics = async (req, res) => {
  const selectedMonth = await req.query.month;

  try {
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
        $regex: `^\\d{4}-${selectedMonth < 10 ? "0" + selectedMonth : selectedMonth}-\\d{2}`,
      };
    } else {
      // If no month parameter is provided, match all months
      dateOfSaleMatch = {
        $regex: `^\\d{4}-\\d{2}-\\d{2}`,
      };
    }


    const totalSaleAmount = await Transaction.aggregate([
      {
        $match: {
          dateOfSale: dateOfSaleMatch,
          sold: true,
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$price" },
        },
      },
    ]);

    const totalSoldItems = await Transaction.countDocuments({
      dateOfSale: dateOfSaleMatch,
      sold: true,
    });

    const totalNotSoldItems = await Transaction.countDocuments({
      dateOfSale: dateOfSaleMatch,
      sold: false, // Consider only items that are not sold
    });

    // Send the response
    res.json({
      success: true,
      data: {
        totalSaleAmount: totalSaleAmount[0]?.totalAmount.toFixed(2) || 0,
        totalSoldItems,
        totalNotSoldItems,
      },
    });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching statistics" });
  }
};
