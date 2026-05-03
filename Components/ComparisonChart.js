import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ComparisonChart = ({ 
  title = "Football vs Cricket Comparison",
  labels = ['Physicality', 'Global Reach', 'Accessibility', 'Action Density', 'Athleticism'],
  footballData = [95, 98, 90, 85, 92],
  cricketData = [40, 25, 45, 30, 35],
  footballLabel = "Football (The Beautiful Game)",
  cricketLabel = "Cricket (The Lazy Game)"
}) => {
  const data = {
    labels,
    datasets: [
      {
        label: footballLabel,
        data: footballData,
        backgroundColor: 'rgba(199, 70, 52, 0.7)',
        borderColor: 'rgba(199, 70, 52, 1)',
        borderWidth: 1,
        borderRadius: 8,
      },
      {
        label: cricketLabel,
        data: cricketData,
        backgroundColor: 'rgba(110, 107, 104, 0.4)',
        borderColor: 'rgba(110, 107, 104, 1)',
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    indexAxis: 'y',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: 'currentColor',
          font: {
            size: 12,
            weight: '500'
          }
        }
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(22, 21, 19, 0.9)',
        padding: 12,
        borderRadius: 8,
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: 'currentColor',
          font: {
            size: 11
          }
        },
        max: 100,
        min: 0,
      },
      y: {
        grid: {
          color: 'rgba(110, 107, 104, 0.1)',
        },
        ticks: {
          color: 'currentColor',
          font: {
            size: 12,
            weight: '600'
          }
        }
      }
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="my-10 p-6 bg-white dark:bg-[#161513] rounded-3xl border border-[#E0DDD9] dark:border-[#3D3A36] shadow-sm">
      <h3 className="text-xl font-bold mb-6 text-center text-[#161513] dark:text-[#F5F4F2]" style={{ fontFamily: "Charter, Georgia, serif" }}>
        {title}
      </h3>
      <div className="h-[400px]">
        <Bar data={data} options={options} />
      </div>
      <p className="mt-6 text-xs text-center text-[#6E6B68] dark:text-[#B8B4B0] italic">
        Data-driven analysis of sporting dynamics. Higher values indicate greater intensity/reach.
      </p>
    </div>
  );
};

export default ComparisonChart;
