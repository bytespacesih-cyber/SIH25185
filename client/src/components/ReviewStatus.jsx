export default function ReviewStatus({ reviewer, comment, status }) {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md border-l-4 border-purple-600">
      <p className="font-semibold">{reviewer}</p>
      <p className="text-gray-700">{comment}</p>
      <p
        className={`mt-2 font-semibold ${
          status === "Accepted"
            ? "text-green-600"
            : status === "Rejected"
            ? "text-red-600"
            : "text-yellow-600"
        }`}
      >
        {status}
      </p>
    </div>
  );
}
