import pool from '@/lib/db';

export interface Filters {
  userId?: number;
  accountId?: string;
  platform?: string;
  dateRange?: string;
}

function applyFilters(query: string, params: any[], filters: Filters, tableAlias: string = 'a') {
  let modifiedQuery = query;
  
  if (filters.userId) {
    modifiedQuery += ` AND ${tableAlias}.user_id = ?`;
    params.push(filters.userId);
  }
  
  if (filters.accountId && filters.accountId !== 'all') {
    if (tableAlias === 'a') { // for ad_accounts
       modifiedQuery += ` AND ${tableAlias}.id = ?`;
    } else { // for stats joining ad_accounts
       modifiedQuery += ` AND a.id = ?`;
    }
    params.push(filters.accountId);
  }
  
  if (filters.platform && filters.platform !== 'Tumu') {
    modifiedQuery += ` AND ${tableAlias === 'a' ? 'a' : 'a'}.platform = ?`;
    params.push(filters.platform);
  }

  if (filters.dateRange) {
    let days = 30;
    if (filters.dateRange === '7d') days = 7;
    if (filters.dateRange === '90d') days = 90;
    
    if (filters.dateRange === 'ytd') {
      modifiedQuery += ` AND stat_date >= DATE_FORMAT(NOW(), '%Y-01-01')`;
    } else {
      modifiedQuery += ` AND stat_date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)`;
      params.push(days);
    }
  }
  
  return modifiedQuery;
}

export async function getAdAccounts(userId?: number) {
  let query = 'SELECT * FROM ad_accounts WHERE 1=1';
  const params = [];
  if (userId) {
    query += ' AND user_id = ?';
    params.push(userId);
  }
  query += ' ORDER BY account_name ASC';
  const [rows] = await pool.execute(query, params);
  return rows;
}

export async function getCampaigns(filters: Filters) {
  const params: any[] = [];
  let query = `
    SELECT 
      c.id, 
      c.name, 
      c.image_url,
      a.platform, 
      c.status, 
      c.budget,
      SUM(IFNULL(s.spend, 0)) as spend,
      SUM(IFNULL(s.impressions, 0)) as impressions,
      SUM(IFNULL(s.clicks, 0)) as clicks,
      SUM(IFNULL(s.add_to_cart, 0)) as add_to_cart,
      SUM(IFNULL(s.conversions, 0)) as conversions,
      SUM(IFNULL(s.revenue, 0)) as revenue
    FROM campaigns c
    JOIN ad_accounts a ON c.ad_account_id = a.id
    LEFT JOIN daily_stats s ON c.id = s.campaign_id
    WHERE 1=1
  `;
  
  query = applyFilters(query, params, filters, 'a');
  
  query += `
    GROUP BY c.id
    ORDER BY c.created_at DESC
  `;
  const [rows]: any = await pool.execute(query, params);

  return rows.map((row: any) => ({
    ...row,
    ctr: row.impressions > 0 ? (row.clicks / row.impressions) * 100 : 0,
    cpc: row.clicks > 0 ? row.spend / row.clicks : 0,
    cpm: row.impressions > 0 ? (row.spend / row.impressions) * 1000 : 0,
    roas: row.spend > 0 ? row.revenue / row.spend : 0
  }));
}

export async function getDashboardStats(filters: Filters) {
  const params: any[] = [];
  let query = `
    SELECT 
      SUM(spend) as totalSpend,
      SUM(impressions) as totalImpressions,
      SUM(clicks) as totalClicks,
      SUM(add_to_cart) as totalAddToCart,
      SUM(conversions) as totalConversions,
      SUM(revenue) as totalRevenue
    FROM daily_stats s
    JOIN ad_accounts a ON s.ad_account_id = a.id
    WHERE 1=1
  `;
  
  query = applyFilters(query, params, filters, 'a');
  
  const [rows]: any = await pool.execute(query, params);
  
  const stats = rows[0];
  const spend = Number(stats.totalSpend || 0);
  const clicks = Number(stats.totalClicks || 0);
  const revenue = Number(stats.totalRevenue || 0);
  const conversions = Number(stats.totalConversions || 0);
  const impressions = Number(stats.totalImpressions || 0);
  const addToCart = Number(stats.totalAddToCart || 0);

  return [
    { title: "Toplam Harcama", rawValue: spend, isCurrency: true, trend: "up", percentage: "+0%", chartData: [] },
    { title: "Toplam Tiklama", rawValue: clicks, isCurrency: false, trend: "up", percentage: "+0%", chartData: [] },
    { title: "Sepete Ekleme", rawValue: addToCart, isCurrency: false, trend: "up", percentage: "+0%", chartData: [] },
    { title: "Donusumler", rawValue: conversions, isCurrency: false, trend: "up", percentage: "+0%", chartData: [] },
    { title: "Gelir", rawValue: revenue, isCurrency: true, trend: "up", percentage: "+0%", chartData: [] },
    { title: "ROAS", rawValue: spend > 0 ? revenue / spend : 0, isCurrency: false, trend: "up", percentage: "+0%", chartData: [] },
  ];
}

export async function getDailyTrend(filters: Filters) {
  const params: any[] = [];
  let query = `
    SELECT 
      stat_date as date, 
      SUM(CASE WHEN a.platform = 'Google' THEN s.spend ELSE 0 END) as google,
      SUM(CASE WHEN a.platform = 'Meta' THEN s.spend ELSE 0 END) as meta,
      SUM(CASE WHEN a.platform = 'TikTok' THEN s.spend ELSE 0 END) as tiktok
    FROM daily_stats s
    JOIN ad_accounts a ON s.ad_account_id = a.id
    WHERE 1=1
  `;
  
  query = applyFilters(query, params, filters, 'a');
  
  query += `
    GROUP BY stat_date
    ORDER BY stat_date ASC
  `;
  const [rows]: any = await pool.execute(query, params);
  return rows;
}

export async function getPlatformComparison(filters: Filters) {
  const params: any[] = [];
  let query = `
    SELECT a.platform as name, SUM(s.spend) as value
    FROM daily_stats s
    JOIN ad_accounts a ON s.ad_account_id = a.id
    WHERE 1=1
  `;
  
  query = applyFilters(query, params, filters, 'a');
  
  query += ' GROUP BY a.platform';
  const [rows] = await pool.execute(query, params);
  return rows;
}

export async function getHourlyStats(filters: Filters) {
  const params: any[] = [];
  let query = `
    SELECT hour, SUM(clicks) as clicks, SUM(conversions) as conversions
    FROM hourly_stats h
    JOIN ad_accounts a ON h.ad_account_id = a.id
    WHERE 1=1
  `;
  
  query = applyFilters(query, params, filters, 'a');
  
  query += ' GROUP BY hour ORDER BY hour ASC';
  const [rows] = await pool.execute(query, params);
  return rows;
}

export async function getDeviceStats(filters: Filters) {
  const params: any[] = [];
  let query = `
    SELECT device_type as name, SUM(clicks) as value
    FROM device_stats d
    JOIN ad_accounts a ON d.ad_account_id = a.id
    WHERE 1=1
  `;
  
  query = applyFilters(query, params, filters, 'a');
  
  query += ' GROUP BY device_type';
  const [rows] = await pool.execute(query, params);
  return rows;
}

export async function getGeoStats(filters: Filters) {
  const params: any[] = [];
  let query = `
    SELECT country, SUM(spend) as spend, SUM(conversions) as conversions
    FROM geo_stats g
    JOIN ad_accounts a ON g.ad_account_id = a.id
    WHERE 1=1
  `;
  
  query = applyFilters(query, params, filters, 'a');
  
  query += ' GROUP BY country ORDER BY spend DESC';
  const [rows] = await pool.execute(query, params);
  return rows;
}

export async function getDemographicStats(filters: Filters) {
  const params: any[] = [];
  let query = `
    SELECT age_range, gender, AVG(percentage) as percentage
    FROM demographic_stats d
    JOIN ad_accounts a ON d.ad_account_id = a.id
    WHERE 1=1
  `;
  
  query = applyFilters(query, params, filters, 'a');
  
  query += ' GROUP BY age_range, gender ORDER BY age_range ASC';
  const [rows] = await pool.execute(query, params);
  return rows;
}
