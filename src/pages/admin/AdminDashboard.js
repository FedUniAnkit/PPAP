import React, { useState, useEffect } from 'react';
import analyticsService from '../../services/analyticsService';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { toast } from 'react-toastify';
import './AdminDashboard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [salesData, setSalesData] = useState(null);
  const [productData, setProductData] = useState(null);
  const [salesPeriod, setSalesPeriod] = useState('monthly');
  const [productPeriod, setProductPeriod] = useState('month');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      try {
        const salesRes = await analyticsService.getSalesAnalytics(salesPeriod);
        const productRes = await analyticsService.getProductAnalytics(10, productPeriod);
        
        if (salesRes.success) {
          setSalesData(formatSalesData(salesRes.data));
        } else {
          toast.error('Failed to load sales data.');
        }

        if (productRes.success) {
          setProductData(formatProductData(productRes.data));
        } else {
          toast.error('Failed to load product data.');
        }

      } catch (error) {
        toast.error('An error occurred while fetching dashboard data.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllData();
  }, [salesPeriod, productPeriod]);

  const formatSalesData = (data) => {
    const labels = data.map(d => new Date(d.period).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }));
    const sales = data.map(d => d.totalSales);
    const orders = data.map(d => d.orderCount);

    return {
      labels,
      datasets: [
        {
          label: 'Total Sales ($)',
          data: sales,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          yAxisID: 'y',
        },
        {
          label: 'Number of Orders',
          data: orders,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          yAxisID: 'y1',
        },
      ],
    };
  };

  const formatProductData = (data) => {
    const labels = data.map(p => p.productName);
    const quantities = data.map(p => p.totalQuantity);

    return {
      labels,
      datasets: [
        {
          label: 'Units Sold',
          data: quantities,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
        },
      ],
    };
  };

  const salesOptions = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      title: {
        display: true,
        text: 'Sales Performance',
      },
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Sales ($)'
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Orders'
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  const productOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Top Selling Products',
      },
    },
  };

  if (isLoading) {
    return <p>Loading dashboard...</p>;
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header" style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:16,flexWrap:'wrap'}}>
        <h2 style={{margin:0}}>Analytics Dashboard</h2>
        <a href="/admin/users" className="nav-button" style={{padding:'10px 14px',background:'#1e88e5',color:'#fff',borderRadius:6,textDecoration:'none'}}>
          Manage Users
        </a>
      </div>
      <div className="dashboard-grid">
        <div className="chart-container sales-chart">
          <div className="chart-header">
            <h3>Sales Analytics</h3>
            <select value={salesPeriod} onChange={(e) => setSalesPeriod(e.target.value)} className="period-select">
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          {salesData ? <Line options={salesOptions} data={salesData} /> : <p>No sales data available.</p>}
        </div>
        <div className="chart-container product-chart">
           <div className="chart-header">
            <h3>Top Products</h3>
             <select value={productPeriod} onChange={(e) => setProductPeriod(e.target.value)} className="period-select">
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>
          {productData ? <Bar options={productOptions} data={productData} /> : <p>No product data available.</p>}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
