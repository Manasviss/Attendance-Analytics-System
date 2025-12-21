import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';

const StatCard = ({ title, value, trend, trendValue, icon: Icon, color }) => {
    const isPositive = trend === 'up';

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-24 h-24 bg-${color}-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110`} />

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-lg bg-${color}-100 text-${color}-600`}>
                        <Icon className="w-6 h-6" />
                    </div>
                    {trendValue && (
                        <div className={`flex items-center space-x-1 text-xs font-bold px-2 py-1 rounded-full ${isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                            {isPositive ? <ArrowUpIcon className="w-3 h-3" /> : <ArrowDownIcon className="w-3 h-3" />}
                            <span>{trendValue}</span>
                        </div>
                    )}
                </div>

                <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wide">{title}</h3>
                <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
            </div>
        </div>
    );
};

export default StatCard;
