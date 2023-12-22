import axios from "axios";

const fetchCombinedData =async (req, res) => {
  try {
    const month = req.query.month || "3";
    const searchQuery = req.query.search || "";
    const page=parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;

    const transactionsApiUrl = `${process.env.HOSTED_DOMAIN}/api/v1/transactions?search=${searchQuery}&page=${page}&perPage=${perPage}`;
    const statisticsApiUrl = `${process.env.HOSTED_DOMAIN}/api/v1/statistics?month=${month}`;
    const barChartApiUrl = `${process.env.HOSTED_DOMAIN}/api/v1/charts/barChart?month=${month}`;
    const pieChartApiUrl = `${process.env.HOSTED_DOMAIN}/api/v1/charts/pieChart?month=${month}`;


    const transactionsResponse=await axios.get(transactionsApiUrl);
    const statisticsResponse=await axios.get(statisticsApiUrl);
    const barChartResponse=await axios.get(barChartApiUrl);
    const pieChartResponse=await axios.get(pieChartApiUrl);

    const combinedData = {
        transactions: transactionsResponse.data,
        statistics: statisticsResponse.data,
        barChart: barChartResponse.data,
        pieChart: pieChartResponse.data,
    };
    
    res.json({ success: true, data: combinedData });

  } catch (error) {
    console.log("ERROR: Failed to generate combiend response", error);
    res.status(500).json({ success: false, error: error });
  }
};
export default fetchCombinedData;
