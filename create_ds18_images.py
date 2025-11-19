from datetime import date, timedelta
from dateutil.relativedelta import relativedelta
import matplotlib
matplotlib.use('Agg')  # Use non-interactive backend
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import Rectangle
import calendar
import numpy as np
import os

# Create directory if it doesn't exist
os.makedirs('public/DS-18', exist_ok=True)

# --- Recurrence Enumeration Functions ---
def enumerate_weekly(start_date, end_date, weekday=0):
    current = start_date
    days_ahead = (weekday - current.weekday()) % 7
    current += timedelta(days=days_ahead)
    dates = []
    while current <= end_date:
        dates.append(current)
        current += timedelta(days=7)
    return dates

# --- Plotting Functions ---
def plot_recurrence_calendar(year, month, recurrence_dates, title=""):
    fig, ax = plt.subplots(figsize=(10, 6))
    cal = calendar.monthcalendar(year, month)
    month_name = calendar.month_name[month]
    weeks = len(cal)
    
    ax.set_xlim(0, 7)
    ax.set_ylim(0, weeks)
    ax.set_aspect('equal')
    
    days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    for i, day in enumerate(days):
        ax.text(i + 0.5, weeks + 0.3, day, ha='center', va='center', fontweight='bold', fontsize=10)
        
    for week_idx, week in enumerate(cal):
        for day_idx, day in enumerate(week):
            if day == 0:
                continue
            
            current_date = date(year, month, day)
            is_recurrence = current_date in recurrence_dates
            
            y_pos = weeks - week_idx - 1
            color = 'lightgreen' if is_recurrence else 'lightgray'
            edgecolor = 'green' if is_recurrence else 'gray'
            linewidth = 2 if is_recurrence else 1
            
            rect = Rectangle((day_idx, y_pos), 1, 1, facecolor=color, edgecolor=edgecolor, linewidth=linewidth)
            ax.add_patch(rect)
            
            fontweight = 'bold' if is_recurrence else 'normal'
            ax.text(day_idx + 0.5, y_pos + 0.5, str(day), ha='center', va='center', fontsize=12, fontweight=fontweight)
    
    ax.set_title(f'{month_name} {year}\n{title}', fontsize=14, fontweight='bold')
    ax.axis('off')
    
    recurrence_patch = mpatches.Patch(color='lightgreen', label='Recurrence Date')
    ax.legend(handles=[recurrence_patch], loc='upper right')
    
    plt.tight_layout()
    fig.savefig('public/DS-18/recurrence_calendar.png')
    plt.close(fig)
    print("Created: recurrence_calendar.png")

def plot_seasonality_stripes(monthly_data, year, title="Monthly Seasonality"):
    fig, ax = plt.subplots(figsize=(12, 3))
    months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    
    data_normalized = (monthly_data - np.min(monthly_data)) / (np.max(monthly_data) - np.min(monthly_data))
    colors = plt.cm.RdYlGn(data_normalized)
    
    for i in range(12):
        rect = Rectangle((i, 0), 1, 1, facecolor=colors[i])
        ax.add_patch(rect)
        ax.text(i + 0.5, -0.3, months[i], ha='center', va='top', fontsize=10)
        ax.text(i + 0.5, 0.5, f'{monthly_data[i]:.0f}', ha='center', va='center', fontsize=12, fontweight='bold', color='white' if data_normalized[i] < 0.5 else 'black')
        
    ax.set_xlim(0, 12)
    ax.set_ylim(-0.5, 1)
    ax.set_aspect('auto')
    ax.axis('off')
    ax.set_title(f'{title} - {year}', fontsize=14, fontweight='bold', pad=20)
    
    sm = plt.cm.ScalarMappable(cmap=plt.cm.RdYlGn, norm=plt.Normalize(vmin=np.min(monthly_data), vmax=np.max(monthly_data)))
    sm.set_array([])
    cbar = plt.colorbar(sm, ax=ax, orientation='horizontal', pad=0.1, aspect=30)
    cbar.set_label('Sales Volume', fontsize=10)
    
    plt.tight_layout()
    fig.savefig('public/DS-18/seasonality_stripes.png')
    plt.close(fig)
    print("Created: seasonality_stripes.png")

def plot_stationarity_comparison():
    np.random.seed(42)
    t = np.arange(0, 365)
    stationary = np.random.normal(100, 10, 365)
    trend = 0.2 * t
    seasonality = 20 * np.sin(2 * np.pi * t / 365)
    noise = np.random.normal(0, 5, 365)
    non_stationary = 100 + trend + seasonality + noise
    
    fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 8))
    
    ax1.plot(t, stationary, color='blue', linewidth=1, alpha=0.7)
    ax1.axhline(100, color='red', linestyle='--', linewidth=2, label='Mean = 100')
    ax1.fill_between(t, 90, 110, alpha=0.2, color='gray', label='±1 SD')
    ax1.set_title('Stationary Time Series', fontsize=14, fontweight='bold')
    ax1.set_ylabel('Value')
    ax1.set_xlabel('Days')
    ax1.legend()
    ax1.grid(alpha=0.3)
    ax1.set_ylim(60, 140)
    
    ax2.plot(t, non_stationary, color='green', linewidth=1, alpha=0.7)
    ax2.plot(t, 100 + trend, color='red', linestyle='--', linewidth=2, label='Trend')
    ax2.plot(t, 100 + trend + seasonality, color='orange', linestyle=':', linewidth=2, alpha=0.7, label='Trend + Seasonality')
    ax2.set_title('Non-Stationary Time Series (Trend + Seasonality)', fontsize=14, fontweight='bold')
    ax2.set_ylabel('Value')
    ax2.set_xlabel('Days')
    ax2.legend()
    ax2.grid(alpha=0.3)
    ax2.set_ylim(60, 200)
    
    plt.tight_layout()
    fig.savefig('public/DS-18/stationarity_comparison.png')
    plt.close(fig)
    print("Created: stationarity_comparison.png")

# --- Generate Images ---
# 1. Recurrence Calendar
mondays_march = enumerate_weekly(date(2024, 3, 1), date(2024, 3, 31), weekday=0)
plot_recurrence_calendar(2024, 3, mondays_march, title="Weekly Recurrence (Mondays)")

# 2. Seasonality Stripes
retail_sales = np.array([450, 420, 480, 500, 520, 550, 580, 560, 530, 600, 650, 900])
plot_seasonality_stripes(retail_sales, 2024, "Retail Sales Seasonality")

# 3. Stationarity Comparison
plot_stationarity_comparison()

print("\nAll images for DS-18 created successfully!")
