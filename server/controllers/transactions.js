import Transaction from "../models/transaction.js";

export const fetchTransactions = async (req, res) => {
  //pagination params
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 10;
  const selectedMonth = req.query.month;
  const searchQuery = req.query.search || "";
  

  try {
    if (selectedMonth && !/^(0?[1-9]|1[0-2])$/.test(selectedMonth)) {
      return res.status(400).json({
        success: false,
        message: "Invalid month parameter",
      });
    }

    //case insensitive search filter for title and description. price(Number to String)
    const searchFilter = {
      $or: [
        { title: { $regex: searchQuery, $options: "i" } },
        { description: { $regex: searchQuery, $options: "i" } },
        {
          price: {
            $eq:
              isNaN(searchQuery) || searchQuery == ""
                ? 0
                : parseFloat(searchQuery),
          },
        },
      ],
    };
    if (selectedMonth) {
      searchFilter.dateOfSale = {
        $regex: `^\\d{4}-${selectedMonth < 10 ? "0" + selectedMonth : selectedMonth}-\\d{2}`
      };
    }
    const totalTransactions = await Transaction.countDocuments(searchFilter);

    const transactions = await Transaction.find(searchFilter)
      .skip((page - 1) * perPage)
      .limit(perPage);
    res.status(200).json({
      success: true,
      data: { total: totalTransactions, transactions },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error });
  }
};
