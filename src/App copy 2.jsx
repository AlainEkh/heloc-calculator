import { useState } from "react";
import dayjs from "dayjs";
import numeral from "numeral";

export default function HelocCalculator() {
  const [balance, setBalance] = useState("");
  const [rate, setRate] = useState("");
  const [disbursementDate, setDisbursementDate] = useState("");
  const [customDate, setCustomDate] = useState("");
  const [showSummary, setShowSummary] = useState(false);
  const [calculatedResult, setCalculatedResult] = useState(null);

  const formatBalance = (value) => {
    const cleaned = value.replace(/,/g, "");
    const num = parseFloat(cleaned);
    return !isNaN(num) ? numeral(num).format("0,0.00") : value;
  };

  const handleBalanceChange = (e) => {
    const input = e.target.value;
    const cleaned = input.replace(/[^0-9.]/g, "");
    if ((cleaned.match(/\./g) || []).length > 1) return;
    setBalance(cleaned);
  };

  const handleBalanceBlur = () => {
    setBalance(formatBalance(balance));
  };

  const handleCustomDateChange = (e) => {
    const inputDate = e.target.value;
    const customDay = dayjs(inputDate);
    const start = dayjs(disbursementDate);
    const nextCycleEnd = start.add(1, "month");

    if (customDay.isAfter(nextCycleEnd)) {
      alert("Custom date cannot be after one full month from the disbursement date.");
      setCustomDate("");
    } else {
      setCustomDate(inputDate);
    }
  };

  const handleCalculateClick = () => {
    const dateToUse = customDate ? dayjs(customDate) : dayjs();
    const start = dayjs(disbursementDate);
    const dailyRate = parseFloat(rate) / 100 / 365;
    const balanceNum = parseFloat(balance.replace(/,/g, ""));
    const daysElapsed = dateToUse.diff(start, "day");

    const accruedInterest = balanceNum * dailyRate * daysElapsed;
    const fullInterest = balanceNum * dailyRate * 30;

    setCalculatedResult({
      accrued: numeral(accruedInterest).format("0,0.00"),
      full: numeral(fullInterest).format("0,0.00"),
      daysElapsed,
    });

    setShowSummary(true);
  };

  const isFormComplete = () => balance && rate && disbursementDate;
  const isButtonDisabled = !balance || !rate || !disbursementDate;

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50">
      <div className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow-lg space-y-6 mt-10">
        <img src="https://www.nesto.ca/wp-content/themes/nesto/templates/objects/logo-nesto-en.svg" alt="Nesto Logo" className="h-8 mx-auto" />

        <h1 className="text-2xl font-bold text-center">HELOC Interest Calculator</h1>

        <p className="text-sm text-gray-600 text-center">
          A Home Equity Line of Credit (HELOC) allows homeowners to borrow against the equity in their home. Interest is calculated daily on the borrowed amount and typically paid monthly. Use this calculator to estimate the interest accrued over a period.
        </p>

        <div className="space-y-4">
          <label className="block">
            Balance ($)
            <input
              type="text"
              value={balance}
              onChange={handleBalanceChange}
              onBlur={handleBalanceBlur}
              placeholder="e.g. 100,000.00"
              className="w-full mt-1 p-2 border rounded"
            />
          </label>

          <label className="block">
            Interest Rate (%)
            <input
              type="number"
              step="0.01"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder="e.g. 5.45"
              className="w-full mt-1 p-2 border rounded"
            />
          </label>

          <label className="block">
            Disbursement Date
            <input
              type="date"
              value={disbursementDate}
              onChange={(e) => setDisbursementDate(e.target.value)}
              className="w-full mt-1 p-2 border rounded"
            />
          </label>

          <label className="block">
            Custom Date
            <input
              type="date"
              value={customDate}
              onChange={handleCustomDateChange}
              className="w-full mt-1 p-2 border rounded"
            />
          </label>

          <div className="flex space-x-4">
            <button
              onClick={() => setCustomDate("")}
              className="flex-1 bg-yellow-200 text-black py-2 rounded disabled:opacity-50"
              disabled={isButtonDisabled}
            >
              Today
            </button>
            <button
              onClick={handleCalculateClick}
              className="flex-1 bg-blue-200 text-black py-2 rounded disabled:opacity-50"
              disabled={isButtonDisabled || (customDate === "" && disbursementDate === "")}
            >
              Calculate
            </button>
          </div>
        </div>

        {!isFormComplete() && (
          <div className="text-sm text-red-500 text-center">
            Please fill in all fields to calculate accrued interest.
          </div>
        )}

        {calculatedResult && (
          <div className="mt-6 bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
            <p>🗓️ Interest cycle: Monthly</p>
            <p>📅 Days accrued: <strong>{calculatedResult.daysElapsed}</strong></p>
            <p>📈 Interest accrued: <strong>${calculatedResult.accrued}</strong></p>
            <p>💰 Estimated full month interest: <strong>${calculatedResult.full}</strong></p>
          </div>
        )}

        {showSummary && calculatedResult && (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <button
              onClick={() => {
                setBalance("");
                setRate("");
                setDisbursementDate("");
                setCustomDate("");
                setCalculatedResult(null);
                setShowSummary(false);
              }}
              className="w-full bg-red-800 text-white py-2 rounded mt-4"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      <footer className="text-center text-sm text-gray-500 py-4">
        © {new Date().getFullYear()} Created by Alain Ekmekdjian
      </footer>
    </div>
  );
}
