// Analytics Manager Module
class AnalyticsManager {
    constructor(dashboard) {
        this.dashboard = dashboard;
        this.analyticsData = {};
        this.charts = {};
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        // Date range selector
        const dateRangeSelect = document.getElementById('dateRangeSelect');
        if (dateRangeSelect) {
            dateRangeSelect.addEventListener('change', () => {
                this.loadAnalytics();
            });
        }
    }

    async loadAnalytics() {
        try {
            const dateRange = document.getElementById('dateRangeSelect') ? .value || '30';

            // Simulate loading analytics data from API
            this.analyticsData = await this.generateAnalyticsData(dateRange);

            this.renderAnalytics();
            this.dashboard.showToast('success', 'Analytics Loaded', 'Analytics data updated successfully');

        } catch (error) {
            console.error('Failed to load analytics:', error);
            this.dashboard.showToast('error', 'Load Error', 'Failed to load analytics data');
        }
    }

    async generateAnalyticsData(dateRange) {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        const days = parseInt(dateRange);
        const data = {
            sales: this.generateSalesData(days),
            products: this.generateProductData(),
            brokers: this.generateBrokerData(),
            discounts: this.generateDiscountData()
        };

        return data;
    }

    generateSalesData(days) {
        const sales = [];
        const today = new Date();

        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);

            sales.push({
                date: date.toISOString().split('T')[0],
                revenue: Math.floor(Math.random() * 500000) + 100000,
                orders: Math.floor(Math.random() * 20) + 5
            });
        }

        return sales;
    }

    generateProductData() {
        return [{
                name: 'EnduraTurf',
                sales: 45,
                revenue: 2500000,
                percentage: 35
            },
            {
                name: 'FlexTurf',
                sales: 32,
                revenue: 1800000,
                percentage: 25
            },
            {
                name: 'UltraTurf',
                sales: 28,
                revenue: 1600000,
                percentage: 20
            },
            {
                name: 'VelvetGreen',
                sales: 20,
                revenue: 1200000,
                percentage: 15
            },
            {
                name: 'ProfitGrass',
                sales: 15,
                revenue: 800000,
                percentage: 5
            }
        ];
    }

    generateBrokerData() {
        return [{
                name: 'John Doe',
                orders: 45,
                revenue: 2500000,
                commission: 137500
            },
            {
                name: 'Jane Smith',
                orders: 32,
                revenue: 1800000,
                commission: 90000
            },
            {
                name: 'Mike Johnson',
                orders: 28,
                revenue: 1600000,
                commission: 96000
            },
            {
                name: 'Sarah Wilson',
                orders: 25,
                revenue: 1400000,
                commission: 77000
            },
            {
                name: 'David Brown',
                orders: 20,
                revenue: 1100000,
                commission: 55000
            }
        ];
    }

    generateDiscountData() {
        return [{
                name: 'First Time Buyer',
                usage: 45,
                savings: 125000,
                percentage: 40
            },
            {
                name: 'Bulk Order',
                usage: 23,
                savings: 115000,
                percentage: 25
            },
            {
                name: 'Seasonal Sale',
                usage: 12,
                savings: 180000,
                percentage: 20
            },
            {
                name: 'WELCOME10',
                usage: 34,
                savings: 85000,
                percentage: 15
            }
        ];
    }

    renderAnalytics() {
        this.renderSalesChart();
        this.renderProductsChart();
        this.renderBrokersChart();
        this.renderDiscountsChart();
    }

    renderSalesChart() {
        const container = document.getElementById('salesChart');
        if (!container) return;

        const data = this.analyticsData.sales;
        if (!data) return;

        container.innerHTML = this.createSalesChartHTML(data);
    }

    createSalesChartHTML(data) {
        const maxRevenue = Math.max(...data.map(d => d.revenue));
        const maxOrders = Math.max(...data.map(d => d.orders));

        return `
            <div class="chart-wrapper">
                <div class="chart-header">
                    <div class="chart-metrics">
                        <div class="metric">
                            <span class="metric-value">KES ${this.formatNumber(data.reduce((sum, d) => sum + d.revenue, 0))}</span>
                            <span class="metric-label">Total Revenue</span>
                        </div>
                        <div class="metric">
                            <span class="metric-value">${data.reduce((sum, d) => sum + d.orders, 0)}</span>
                            <span class="metric-label">Total Orders</span>
                        </div>
                    </div>
                </div>
                <div class="chart-content">
                    <div class="chart-bars">
                        ${data.map(d => `
                            <div class="chart-bar-group">
                                <div class="bar revenue-bar" style="height: ${(d.revenue / maxRevenue) * 100}%">
                                    <span class="bar-tooltip">KES ${this.formatNumber(d.revenue)}</span>
                                </div>
                                <div class="bar orders-bar" style="height: ${(d.orders / maxOrders) * 100}%">
                                    <span class="bar-tooltip">${d.orders} orders</span>
                                </div>
                                <span class="bar-label">${this.formatDate(d.date)}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="chart-legend">
                    <div class="legend-item">
                        <span class="legend-color revenue"></span>
                        <span>Revenue</span>
                    </div>
                    <div class="legend-item">
                        <span class="legend-color orders"></span>
                        <span>Orders</span>
                    </div>
                </div>
            </div>
        `;
    }

    renderProductsChart() {
        const container = document.getElementById('productsChart');
        if (!container) return;

        const data = this.analyticsData.products;
        if (!data) return;

        container.innerHTML = this.createProductsChartHTML(data);
    }

    createProductsChartHTML(data) {
        return `
            <div class="chart-wrapper">
                <div class="chart-content">
                    <div class="product-list">
                        ${data.map(product => `
                            <div class="product-item">
                                <div class="product-info">
                                    <span class="product-name">${product.name}</span>
                                    <span class="product-sales">${product.sales} sales</span>
                                </div>
                                <div class="product-bar">
                                    <div class="bar-fill" style="width: ${product.percentage}%"></div>
                                </div>
                                <div class="product-revenue">
                                    <span class="revenue-amount">KES ${this.formatNumber(product.revenue)}</span>
                                    <span class="revenue-percentage">${product.percentage}%</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    renderBrokersChart() {
        const container = document.getElementById('brokersChart');
        if (!container) return;

        const data = this.analyticsData.brokers;
        if (!data) return;

        container.innerHTML = this.createBrokersChartHTML(data);
    }

    createBrokersChartHTML(data) {
        const maxRevenue = Math.max(...data.map(d => d.revenue));

        return `
            <div class="chart-wrapper">
                <div class="chart-content">
                    <div class="broker-list">
                        ${data.map(broker => `
                            <div class="broker-item">
                                <div class="broker-info">
                                    <span class="broker-name">${broker.name}</span>
                                    <span class="broker-orders">${broker.orders} orders</span>
                                </div>
                                <div class="broker-performance">
                                    <div class="performance-bar">
                                        <div class="bar-fill" style="width: ${(broker.revenue / maxRevenue) * 100}%"></div>
                                    </div>
                                    <div class="performance-metrics">
                                        <span class="revenue">KES ${this.formatNumber(broker.revenue)}</span>
                                        <span class="commission">KES ${this.formatNumber(broker.commission)}</span>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    renderDiscountsChart() {
        const container = document.getElementById('discountsChart');
        if (!container) return;

        const data = this.analyticsData.discounts;
        if (!data) return;

        container.innerHTML = this.createDiscountsChartHTML(data);
    }

    createDiscountsChartHTML(data) {
        const maxUsage = Math.max(...data.map(d => d.usage));

        return `
            <div class="chart-wrapper">
                <div class="chart-content">
                    <div class="discount-list">
                        ${data.map(discount => `
                            <div class="discount-item">
                                <div class="discount-info">
                                    <span class="discount-name">${discount.name}</span>
                                    <span class="discount-usage">${discount.usage} uses</span>
                                </div>
                                <div class="discount-performance">
                                    <div class="performance-bar">
                                        <div class="bar-fill" style="width: ${(discount.usage / maxUsage) * 100}%"></div>
                                    </div>
                                    <div class="performance-metrics">
                                        <span class="savings">KES ${this.formatNumber(discount.savings)}</span>
                                        <span class="percentage">${discount.percentage}%</span>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    formatNumber(number) {
        if (number >= 1000000) {
            return (number / 1000000).toFixed(1) + 'M';
        } else if (number >= 1000) {
            return (number / 1000).toFixed(1) + 'K';
        }
        return number.toLocaleString();
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-KE', {
            month: 'short',
            day: 'numeric'
        });
    }

    // Export functionality
    exportAnalytics() {
        try {
            const data = {
                sales: this.analyticsData.sales,
                products: this.analyticsData.products,
                brokers: this.analyticsData.brokers,
                discounts: this.analyticsData.discounts,
                exportDate: new Date().toISOString()
            };

            const blob = new Blob([JSON.stringify(data, null, 2)], {
                type: 'application/json'
            });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `analytics_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            this.dashboard.showToast('success', 'Export Successful', 'Analytics data exported successfully');

        } catch (error) {
            console.error('Failed to export analytics:', error);
            this.dashboard.showToast('error', 'Export Error', 'Failed to export analytics data');
        }
    }

    // Generate reports
    generateReport(type) {
        try {
            let reportContent = '';
            let reportTitle = '';

            switch (type) {
                case 'sales':
                    reportContent = this.generateSalesReport();
                    reportTitle = 'Sales Report';
                    break;
                case 'products':
                    reportContent = this.generateProductsReport();
                    reportTitle = 'Products Report';
                    break;
                case 'brokers':
                    reportContent = this.generateBrokersReport();
                    reportTitle = 'Brokers Report';
                    break;
                case 'discounts':
                    reportContent = this.generateDiscountsReport();
                    reportTitle = 'Discounts Report';
                    break;
                default:
                    this.dashboard.showToast('error', 'Report Error', 'Invalid report type');
                    return;
            }

            this.showReportModal(reportTitle, reportContent);

        } catch (error) {
            console.error('Failed to generate report:', error);
            this.dashboard.showToast('error', 'Report Error', 'Failed to generate report');
        }
    }

    generateSalesReport() {
        const data = this.analyticsData.sales;
        if (!data) return 'No sales data available';

        const totalRevenue = data.reduce((sum, d) => sum + d.revenue, 0);
        const totalOrders = data.reduce((sum, d) => sum + d.orders, 0);
        const avgOrderValue = totalRevenue / totalOrders;

        return `
            <div class="report-content">
                <h3>Sales Summary</h3>
                <div class="report-metrics">
                    <div class="metric">
                        <span class="metric-value">KES ${this.formatNumber(totalRevenue)}</span>
                        <span class="metric-label">Total Revenue</span>
                    </div>
                    <div class="metric">
                        <span class="metric-value">${totalOrders}</span>
                        <span class="metric-label">Total Orders</span>
                    </div>
                    <div class="metric">
                        <span class="metric-value">KES ${this.formatNumber(avgOrderValue)}</span>
                        <span class="metric-label">Average Order Value</span>
                    </div>
                </div>
                
                <h4>Daily Breakdown</h4>
                <div class="report-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Revenue</th>
                                <th>Orders</th>
                                <th>Avg Order</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.map(d => `
                                <tr>
                                    <td>${this.formatDate(d.date)}</td>
                                    <td>KES ${this.formatNumber(d.revenue)}</td>
                                    <td>${d.orders}</td>
                                    <td>KES ${this.formatNumber(d.revenue / d.orders)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    generateProductsReport() {
        const data = this.analyticsData.products;
        if (!data) return 'No product data available';

        const totalSales = data.reduce((sum, p) => sum + p.sales, 0);
        const totalRevenue = data.reduce((sum, p) => sum + p.revenue, 0);

        return `
            <div class="report-content">
                <h3>Products Performance</h3>
                <div class="report-metrics">
                    <div class="metric">
                        <span class="metric-value">${totalSales}</span>
                        <span class="metric-label">Total Sales</span>
                    </div>
                    <div class="metric">
                        <span class="metric-value">KES ${this.formatNumber(totalRevenue)}</span>
                        <span class="metric-label">Total Revenue</span>
                    </div>
                </div>
                
                <h4>Product Breakdown</h4>
                <div class="report-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Sales</th>
                                <th>Revenue</th>
                                <th>Percentage</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.map(p => `
                                <tr>
                                    <td>${p.name}</td>
                                    <td>${p.sales}</td>
                                    <td>KES ${this.formatNumber(p.revenue)}</td>
                                    <td>${p.percentage}%</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    generateBrokersReport() {
        const data = this.analyticsData.brokers;
        if (!data) return 'No broker data available';

        const totalOrders = data.reduce((sum, b) => sum + b.orders, 0);
        const totalRevenue = data.reduce((sum, b) => sum + b.revenue, 0);
        const totalCommission = data.reduce((sum, b) => sum + b.commission, 0);

        return `
            <div class="report-content">
                <h3>Brokers Performance</h3>
                <div class="report-metrics">
                    <div class="metric">
                        <span class="metric-value">${totalOrders}</span>
                        <span class="metric-label">Total Orders</span>
                    </div>
                    <div class="metric">
                        <span class="metric-value">KES ${this.formatNumber(totalRevenue)}</span>
                        <span class="metric-label">Total Revenue</span>
                    </div>
                    <div class="metric">
                        <span class="metric-value">KES ${this.formatNumber(totalCommission)}</span>
                        <span class="metric-label">Total Commission</span>
                    </div>
                </div>
                
                <h4>Broker Breakdown</h4>
                <div class="report-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Broker</th>
                                <th>Orders</th>
                                <th>Revenue</th>
                                <th>Commission</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.map(b => `
                                <tr>
                                    <td>${b.name}</td>
                                    <td>${b.orders}</td>
                                    <td>KES ${this.formatNumber(b.revenue)}</td>
                                    <td>KES ${this.formatNumber(b.commission)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    generateDiscountsReport() {
        const data = this.analyticsData.discounts;
        if (!data) return 'No discount data available';

        const totalUsage = data.reduce((sum, d) => sum + d.usage, 0);
        const totalSavings = data.reduce((sum, d) => sum + d.savings, 0);

        return `
            <div class="report-content">
                <h3>Discounts Performance</h3>
                <div class="report-metrics">
                    <div class="metric">
                        <span class="metric-value">${totalUsage}</span>
                        <span class="metric-label">Total Usage</span>
                    </div>
                    <div class="metric">
                        <span class="metric-value">KES ${this.formatNumber(totalSavings)}</span>
                        <span class="metric-label">Total Savings</span>
                    </div>
                </div>
                
                <h4>Discount Breakdown</h4>
                <div class="report-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Discount</th>
                                <th>Usage</th>
                                <th>Savings</th>
                                <th>Percentage</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.map(d => `
                                <tr>
                                    <td>${d.name}</td>
                                    <td>${d.usage}</td>
                                    <td>KES ${this.formatNumber(d.savings)}</td>
                                    <td>${d.percentage}%</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    showReportModal(title, content) {
        const modalHTML = `
            <div class="modal">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close" onclick="this.closest('.modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" onclick="this.closest('.modal').remove()">Close</button>
                    <button class="btn-primary" onclick="window.adminDashboard.managers.analytics.exportReport('${title}')">Export PDF</button>
                </div>
            </div>
        `;

        const modalContainer = document.createElement('div');
        modalContainer.className = 'modal-overlay active';
        modalContainer.innerHTML = modalHTML;
        document.body.appendChild(modalContainer);

        modalContainer.addEventListener('click', (e) => {
            if (e.target === modalContainer) {
                modalContainer.remove();
            }
        });
    }

    exportReport(title) {
        // This would generate and download a PDF report
        this.dashboard.showToast('info', 'Export Report', 'PDF export functionality coming soon');
    }
}

export {
    AnalyticsManager
};