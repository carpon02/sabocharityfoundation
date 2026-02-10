export const ImpactCard = ({ icon: Icon, title, description, bgColor, iconColor }) => (
  <div className="flex items-start gap-4 p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 group">
    <div className={`flex items-center justify-center w-14 h-14 ${bgColor} rounded-xl ${iconColor} group-hover:scale-110 transition-transform`}>
      <Icon className="w-6 h-6" />
    </div>
    <div className="flex-1">
      <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
    </div>
  </div>
);
