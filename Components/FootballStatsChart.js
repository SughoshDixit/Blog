import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const FootballStatsChart = ({ title = "Player Performance Metrics" }) => {
  const data = {
    labels: ['Goals', 'Assists', 'Passing Accuracy', 'Successful Dribbles', 'Interceptions', 'Aerial Duels'],
    datasets: [
      {
        label: 'Current Season',
        data: [85, 70, 92, 88, 45, 60],
        backgroundColor: 'rgba(199, 70, 52, 0.2)',
        borderColor: 'rgba(199, 70, 52, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(199, 70, 52, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(199, 70, 52, 1)',
      },
      {
        label: 'League Average',
        data: [60, 50, 75, 65, 55, 50],
        backgroundColor: 'rgba(110, 107, 104, 0.2)',
        borderColor: 'rgba(110, 107, 104, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(110, 107, 104, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(110, 107, 104, 1)',
      },
    ],
  };

  const options = {
    scales: {
      r: {
        angleLines: {
          color: 'rgba(110, 107, 104, 0.2)',
        },
        grid: {
          color: 'rgba(110, 107, 104, 0.2)',
        },
        pointLabels: {
          color: 'currentColor',
          font: {
            size: 12,
            weight: '600'
          }
        },
        ticks: {
          display: false,
          max: 100,
          min: 0,
          stepSize: 20
        }
      }
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: 'currentColor',
          usePointStyle: true,
          padding: 20,
          font: {
            size: 14
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(22, 21, 19, 0.9)',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 12,
        borderColor: 'rgba(199, 70, 52, 0.3)',
        borderWidth: 1,
      }
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="w-full h-full min-h-[400px] p-6 bg-white dark:bg-[#161513] rounded-3xl border border-[#E0DDD9] dark:border-[#3D3A36] shadow-sm">
      <h3 className="text-xl font-bold mb-6 text-center text-[#161513] dark:text-[#F5F4F2]" style={{ fontFamily: "Charter, Georgia, serif" }}>
        {title}
      </h3>
      <div className="h-[350px]">
        <Radar data={data} options={options} />
      </div>
      <p className="mt-6 text-xs text-center text-[#6E6B68] dark:text-[#B8B4B0]">
        Interactive Data Visualization Example — Powered by Chart.js
      </p>
    </div>
  );
};

export default FootballStatsChart;
