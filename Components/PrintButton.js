import { FiPrinter } from "react-icons/fi";

function PrintButton() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <button
      onClick={handlePrint}
      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
      title="Print this article"
    >
      <FiPrinter />
      <span>Print</span>
    </button>
  );
}

export default PrintButton;

