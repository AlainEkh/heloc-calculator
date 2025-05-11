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
  const [language, setLanguage] = useState("en");

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
      alert(language === "fr" ? "La date personnalisée ne peut pas dépasser un mois civil complet à partir de la date de décaissement." : "Custom date cannot be after one full calendar month from the disbursement date.");
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

  const t = {
    en: {
      title: "HELOC Interest Calculator",
      description: "A Home Equity Line of Credit (HELOC) allows homeowners to borrow against the equity in their home. Interest is calculated daily on the borrowed amount and typically paid monthly. Use this calculator to estimate the interest accrued over a period.",
      balance: "Balance ($)",
      rate: "Interest Rate (%)",
      disbursement: "Disbursement Date",
      custom: "Custom Date (optional)",
      today: "Today",
      calculate: "Calculate",
      fillFields: "Please fill in all fields to calculate accrued interest.",
      interestCycle: "Interest cycle: Monthly",
      daysAccrued: "Days accrued:",
      interestAccrued: "Interest accrued:",
      estimatedInterest: "Estimated full month interest:",
      clear: "Clear",
      switchLang: "Français"
    },
    fr: {
      title: "Calculateur d'intérêt pour marge de crédit hypothécaire (HELOC)",
      description: "Une marge de crédit hypothécaire (HELOC) permet aux propriétaires d'emprunter sur la valeur nette de leur maison. Les intérêts sont calculés quotidiennement sur le montant emprunté et sont généralement payés mensuellement. Utilisez ce calculateur pour estimer les intérêts courus sur une période donnée.",
      balance: "Solde ($)",
      rate: "Taux d'intérêt (%)",
      disbursement: "Date de décaissement",
      custom: "Date personnalisée (optionnelle)",
      today: "Aujourd'hui",
      calculate: "Calculer",
      fillFields: "Veuillez remplir tous les champs pour calculer les intérêts courus.",
      interestCycle: "Cycle d'intérêt : Mensuel",
      daysAccrued: "Jours accumulés :",
      interestAccrued: "Intérêts courus :",
      estimatedInterest: "Intérêts mensuels estimés :",
      clear: "Réinitialiser",
      switchLang: "English"
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50">
      <div className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow-lg space-y-6 mt-10 mb-10">
        <div className="flex justify-between items-center">
          <img src="https://www.nesto.ca/wp-content/themes/nesto/templates/objects/logo-nesto-en.svg" alt="Nesto Logo" className="h-8" />
          <button
            onClick={() => setLanguage(language === "en" ? "fr" : "en")}
            className="text-sm text-blue-600 underline"
          >
            {t[language].switchLang}
          </button>
        </div>

        <h1 className="text-2xl font-bold text-center">{t[language].title}</h1>

        <p className="text-sm text-gray-600 text-center">
          {t[language].description}
        </p>

        <div className="space-y-4">
          <label className="block">
            {t[language].balance}
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
            {t[language].rate}
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
            {t[language].disbursement}
            <input
              type="date"
              value={disbursementDate}
              onChange={(e) => setDisbursementDate(e.target.value)}
              className="w-full mt-1 p-2 border rounded"
            />
          </label>

          <label className="block">
            {t[language].custom}
            <input
              type="date"
              value={customDate}
              onChange={handleCustomDateChange}
              className="w-full mt-1 p-2 border rounded"
            />
          </label>

          <div className="flex space-x-4">
            <button
              onClick={() => setCustomDate(dayjs().format("YYYY-MM-DD"))}
              className="flex-1 bg-yellow-200 text-black py-2 rounded disabled:opacity-50"
              disabled={isButtonDisabled}
            >
              {t[language].today}
            </button>
            <button
              onClick={handleCalculateClick}
              className="flex-1 bg-blue-200 text-black py-2 rounded disabled:opacity-50"
              disabled={isButtonDisabled}
            >
              {t[language].calculate}
            </button>
          </div>
        </div>

        {!isFormComplete() && (
          <div className="text-sm text-red-500 text-center">
            {t[language].fillFields}
          </div>
        )}

        {calculatedResult && (
          <div className="mt-6 bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
            <p>🗓️ {t[language].interestCycle}</p>
            <p>📅 {t[language].daysAccrued} <strong>{calculatedResult.daysElapsed}</strong></p>
            <p>📈 {t[language].interestAccrued} <strong>${calculatedResult.accrued}</strong></p>
            <p>💰 {t[language].estimatedInterest} <strong>${calculatedResult.full}</strong></p>
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
              {t[language].clear}
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
