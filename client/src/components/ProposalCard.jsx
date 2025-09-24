export default function ProposalCard({ title, status, domain, budget }) {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md border-l-4 border-blue-600">
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="text-gray-700">Domain: {domain}</p>
      <p className="text-gray-700">Budget: ₹{budget}</p>
      <p
        className={`font-semibold mt-2 ${
          status === "Approved"
            ? "text-green-600"
            : status === "Rejected"
            ? "text-red-600"
            : "text-yellow-600"
        }`}
      >
        Status: {status}
      </p>
    </div>
  );
}
