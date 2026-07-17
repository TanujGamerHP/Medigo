import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getRevenueData(interval: 'daily' | 'weekly' | 'monthly') {
    // Fetch memberships and orders to calculate revenue
    const memberships = await this.prisma.membership.findMany({
      where: {
        status: { in: ['Active', 'Expired'] },
      },
      select: {
        price: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    const orders = await this.prisma.order.findMany({
      where: {
        status: 'Paid',
      },
      select: {
        totalAmount: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    // Combine all revenue events
    const allEvents = [
      ...memberships.map((m) => ({ amount: m.price, date: m.createdAt })),
      ...orders.map((o) => ({ amount: o.totalAmount, date: o.createdAt })),
    ].sort((a, b) => a.date.getTime() - b.date.getTime());

    // Aggregate data
    const aggregated: Record<string, number> = {};

    let cumulativeTotal = 0;

    for (const event of allEvents) {
      const date = event.date;
      let key = '';

      if (interval === 'daily') {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      } else if (interval === 'weekly') {
        // Simple week grouping by ISO week
        const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        const dayNum = d.getUTCDay() || 7;
        d.setUTCDate(d.getUTCDate() + 4 - dayNum);
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
        const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1)/7);
        key = `W${weekNo} ${d.getUTCFullYear()}`;
      } else {
        // Monthly
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        key = `${months[date.getMonth()]} ${date.getFullYear()}`;
      }

      cumulativeTotal += event.amount;
      aggregated[key] = cumulativeTotal; // Store the latest cumulative total for this period
    }

    // Format for frontend Recharts area chart
    const chartData = Object.keys(aggregated).map((key) => ({
      label: key,
      value: aggregated[key],
    }));

    // If there is no data, provide an empty state
    if (chartData.length === 0) {
      return [
        { label: 'No Data', value: 0 }
      ];
    }

    return chartData;
  }
}
