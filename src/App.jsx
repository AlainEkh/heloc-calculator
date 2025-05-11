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

    if (customDay.isBefore(start)) {
      alert(language === "fr"
        ? "La date personnalisée ne peut pas être antérieure à la date de début."
        : "Custom date cannot be before the start date.");
      setCustomDate("");
    } else if (customDay.isAfter(nextCycleEnd)) {
      alert(language === "fr"
        ? "La date personnalisée ne peut pas dépasser un mois civil complet à partir de la date de début."
        : "Custom date cannot be after one full calendar month from the start date.");
      setCustomDate("");
    } else {
      setCustomDate(inputDate);
    }
  };

  const handleCalculateClick = (dateOverride = null) => {
    const dateToUse = dateOverride || (customDate ? dayjs(customDate) : dayjs());
    const start = dayjs(disbursementDate);
    const nextCycleEnd = start.add(1, "month");

    if (dateToUse.isAfter(nextCycleEnd)) {
      alert(language === "fr" ? "La date sélectionnée ne peut pas dépasser un mois civil complet à partir de la date de début." : "Selected date cannot be after one full calendar month from the start date.");
      return;
    }

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

  const handleTodayClick = () => {
    const today = dayjs();
    setCustomDate(today.format("YYYY-MM-DD"));
    handleCalculateClick(today);
  };

  const isFormComplete = () => balance && rate && disbursementDate;
  const isButtonDisabled = !balance || !rate || !disbursementDate;

  const t = {
    en: {
      title: "HELOC Interest Calculator",
      description: "A Home Equity Line of Credit (HELOC) allows homeowners to borrow against the equity in their home. Interest is calculated daily on the borrowed amount and typically paid monthly. Use this calculator to estimate the interest accrued over a period.",
      balance: "Balance ($)",
      rate: "Interest Rate (%)",
      disbursement: "Start Date",
      custom: "Custom Date",
      today: "Today",
      calculate: "Calculate",
      fillFields: "*Please fill in all fields to calculate accrued interest.*",
      interestCycle: "Interest cycle: Monthly",
      daysAccrued: "Days accrued:",
      interestAccrued: "Interest accrued:",
      estimatedInterest: "Estimated full month interest:",
      subjectChange: "Subject to change",
      clear: "Clear",
      switchLang: "Français",
      todayExplanation: "If you want the custom date to be today, click Today",
      todayAutoCalc: "Clicking 'Today' will set the custom date to today and automatically calculate the interest.",
    },
    fr: {
      title: "Calculateur d'intérêt pour marge de crédit hypothécaire (HELOC)",
      description: "Une marge de crédit hypothécaire (HELOC) permet aux propriétaires d'emprunter sur la valeur nette de leur maison. Les intérêts sont calculés quotidiennement sur le montant emprunté et sont généralement payés mensuellement. Utilisez ce calculateur pour estimer les intérêts courus sur une période donnée.",
      balance: "Solde ($)",
      rate: "Taux d'intérêt (%)",
      disbursement: "Date de début",
      custom: "Date personnalisée",
      today: "Aujourd'hui",
      calculate: "Calculer",
      fillFields: "*Veuillez remplir tous les champs pour calculer les intérêts courus.*",
      interestCycle: "Cycle d'intérêt : Mensuel",
      daysAccrued: "Jours accumulés :",
      interestAccrued: "Intérêts courus :",
      estimatedInterest: "Intérêts mensuels estimés :",
      subjectChange: "Susceptible de changer",
      clear: "Réinitialiser",
      switchLang: "English",
      todayExplanation: "Si vous voulez que la date personnalisée soit aujourd'hui, cliquez Aujourd'hui",
      todayAutoCalc: "En cliquant sur 'Aujourd'hui', la date personnalisée sera définie sur aujourd'hui et le calcul des intérêts sera effectué automatiquement.",
    },
  };


  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50">
      <header className="bg-gray-900 text-center text-sm text-gray-300 py-4 mb-1">
      </header>
      <div className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow-lg space-y-6 mt-10 mb-10">
        <div className="flex justify-between items-center">
          <a href="https://www.nesto.ca/" target="_blank" rel="noopener noreferrer">
            <img
              src="https://www.nesto.ca/wp-content/themes/nesto/templates/objects/logo-nesto-en.svg"
              alt="Nesto Logo"
              className="h-8 cursor-pointer"
            />
          </a>
          <button
            onClick={() => setLanguage(language === "en" ? "fr" : "en")}
            className="bg-orange-300 hover:bg-orange-400 text-black text-sm font-medium py-1 px-3 rounded transition cursor-pointer"
          >
            {t[language].switchLang}
          </button>

        </div>

        <h1 className="text-lg font-bold text-center">{t[language].title}</h1>

        <p className="text-base text-gray-600 text-center">
          {t[language].description}
        </p>

        <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 text-base rounded p-3 mt-2 text-center">
          <p className="font-semibold underline mb-1">
            {language === "fr" ? "Formule :" : "Formula:"}
          </p>
          <p className="mb-2">
            {language === "fr"
              ? "Intérêt = Solde × (Taux / 100) ÷ 365 × Nombre de jours"
              : "Interest = Balance × (Rate / 100) ÷ 365 × Number of days"}
          </p>
          <p className="font-semibold underline mb-1">
            {language === "fr" ? "Exemple :" : "Example:"}
          </p>
          <p>
            {language === "fr"
              ? "$100,000.00 × (6 ÷ 100) ÷ 365 × 10 jours = $164.38 d'intérêts courus"
              : "$100,000.00 × (6 ÷ 100) ÷ 365 × 10 days = $164.38 accrued interest"}
          </p>
        </div>

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
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                if (e.target.value === "" || val >= 0) {
                  setRate(e.target.value);
                }
              }}
              placeholder="e.g. 5.45"
              className="w-full mt-1 p-2 border rounded"
            />
          </label>

          <label className="block">
            {t[language].disbursement}
            <input
              type="date"
              value={disbursementDate}
              onChange={(e) => {
                const selectedDate = dayjs(e.target.value);
                const today = dayjs().startOf("day");

                if (selectedDate.isAfter(today)) {
                  alert(language === "fr"
                    ? "La date de début ne peut pas être ultérieure à aujourd'hui."
                    : "Start date cannot be after today.");
                  setDisbursementDate("");
                } else {
                  setDisbursementDate(e.target.value);
                }
              }}

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

          <div className="text-center text-base text-gray-600 mt-2">
            {t[language].todayAutoCalc}
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handleTodayClick}
              className="flex-1 bg-green-300 hover:bg-green-400 text-black py-2 rounded disabled:opacity-50 cursor-pointer"
              disabled={isButtonDisabled}
            >
              {t[language].today}
            </button>
            <button
              onClick={() => {
                // Delay to ensure latest state is used
                setTimeout(() => {
                  handleCalculateClick();
                }, 0);
              }}
              className="flex-1 bg-blue-300 hover:bg-blue-400 text-black py-2 rounded disabled:opacity-50 cursor-pointer"
              disabled={isButtonDisabled || (customDate === "" && disbursementDate === "")}
            >
              {t[language].calculate}
            </button>
          </div>
        </div>

        {!isFormComplete() && (
          <div className="text-base text-red-500 text-center">
            {t[language].fillFields}
          </div>
        )}

        {calculatedResult && (
          <div className="mt-6 bg-gray-50 p-4 rounded-lg space-y-2 text-base">
            <p>🗓️ {t[language].interestCycle}</p>
            <p>📅 {t[language].daysAccrued} <strong>{calculatedResult.daysElapsed}</strong></p>
            <p>📈 {t[language].interestAccrued} <strong>${calculatedResult.accrued}</strong></p>
            <p>💰 {t[language].estimatedInterest} <strong>${calculatedResult.full}</strong></p>
            <p>⛔ {t[language].subjectChange}</p>
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
              className="w-full bg-red-800 hover:bg-red-900 text-white py-2 rounded mt-4 cursor-pointer"
            >
              {t[language].clear}
            </button>
          </div>
        )}
      </div>

      <footer className="bg-gray-900 text-center text-sm text-gray-300 py-4 mt-10">
        © {new Date().getFullYear()} Created by Alain Ekmekdjian
      </footer>
    </div>
  );
}