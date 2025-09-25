export default function ReviewStatus({ reviewer, comment, status, rating, date, expertise, avatar }) {
  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case 'accepted':
      case 'approved':
        return {
          color: 'from-green-500 to-emerald-600',
          bgColor: 'bg-green-50',
          textColor: 'text-green-700',
          borderColor: 'border-green-200',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )
        };
      case 'rejected':
        return {
          color: 'from-red-500 to-red-600',
          bgColor: 'bg-red-50',
          textColor: 'text-red-700',
          borderColor: 'border-red-200',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )
        };
      case 'needs_revision':
      case 'revision_requested':
        return {
          color: 'from-yellow-500 to-orange-500',
          bgColor: 'bg-yellow-50',
          textColor: 'text-yellow-700',
          borderColor: 'border-yellow-200',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          )
        };
      default:
        return {
          color: 'from-purple-500 to-indigo-600',
          bgColor: 'bg-purple-50',
          textColor: 'text-purple-700',
          borderColor: 'border-purple-200',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )
        };
    }
  };

  const statusConfig = getStatusConfig(status);

  const renderStars = (rating) => {
    if (!rating) return null;
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${star <= rating ? 'text-yellow-400' : 'text-slate-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className={`group relative bg-white rounded-2xl shadow-lg border ${statusConfig.borderColor} overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 animate-fade-in-up`}>
      {/* Status Header Bar */}
      <div className={`h-2 bg-gradient-to-r ${statusConfig.color}`}></div>
      
      {/* Main Content */}
      <div className="p-6">
        {/* Reviewer Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="relative">
              {avatar ? (
                <img 
                  src={avatar} 
                  alt={reviewer} 
                  className="w-12 h-12 rounded-full border-2 border-slate-200 shadow-lg"
                />
              ) : (
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${statusConfig.color} flex items-center justify-center shadow-lg`}>
                  <span className="text-white font-bold text-lg">
                    {reviewer?.charAt(0)?.toUpperCase() || 'R'}
                  </span>
                </div>
              )}
              {/* Online Indicator */}
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            
            {/* Reviewer Info */}
            <div>
              <h4 className="font-bold text-slate-900 text-lg group-hover:text-purple-600 transition-colors duration-300">
                {reviewer || 'Anonymous Reviewer'}
              </h4>
              {expertise && (
                <p className="text-sm text-slate-600 bg-slate-100 px-3 py-1 rounded-full inline-block">
                  {expertise}
                </p>
              )}
              {date && (
                <p className="text-xs text-slate-500 mt-1">
                  Reviewed on {new Date(date).toLocaleDateString('en-IN', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </p>
              )}
            </div>
          </div>

          {/* Status Badge */}
          <div className={`px-4 py-2 rounded-xl ${statusConfig.bgColor} ${statusConfig.textColor} flex items-center gap-2 font-semibold transition-all duration-300 group-hover:scale-105`}>
            {statusConfig.icon}
            {status || 'Under Review'}
          </div>
        </div>

        {/* Rating */}
        {rating && (
          <div className="flex items-center gap-3 mb-4 p-3 bg-slate-50 rounded-xl">
            <span className="text-sm font-medium text-slate-700">Rating:</span>
            {renderStars(rating)}
            <span className="text-sm font-bold text-slate-800">{rating}/5</span>
          </div>
        )}

        {/* Comment */}
        <div className="relative">
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-4 rounded-xl border border-slate-200">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-slate-700 leading-relaxed text-sm">
                  {comment || 'No detailed feedback provided yet. The reviewer will share their insights soon.'}
                </p>
              </div>
            </div>
          </div>
          
          {/* Quote decoration */}
          <div className="absolute -top-2 -left-2 w-6 h-6 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-200">
          <button className="group flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-all duration-300 hover:scale-105">
            <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Reply
          </button>
          <button className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            View Details
          </button>
        </div>
      </div>

      {/* Hover Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
    </div>
  );
}
