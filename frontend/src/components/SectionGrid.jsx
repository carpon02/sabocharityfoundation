

const SectionGrid = ({ items}) => {
  return (
    <div className="py-10 px-2">
     
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition"
          >
            {/* Icon */}
           <div className="flex gap-2 items-center justify-center">
             <div
              className={`w-12 h-12 flex items-center justify-center rounded-full mb-4 ${item.bgColor}`}
               >
               <item.icon size={20} />
               </div>
               {/* Title */}
               <h3 className="text-lg font-bold text-gray-800 mb-2">
               {item.title}
               </h3>
            </div>
               {/* Description */}
               <p className="text-sm text-gray-600">{item.description}</p>
            </div>
        ))}
      </div>
    </div>
  );
};

export default SectionGrid;