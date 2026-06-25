export class AdReport {
  impressions: number = 0;
  clicks: number = 0;
  spend: number = 0;
  conversions: number = 0;
  revenue: number = 0;

  get ctr(): number {
    return this.impressions > 0 ? this.clicks / this.impressions : 0;
  }

  get cpc(): number {
    return this.clicks > 0 ? this.spend / this.clicks : 0;
  }

  get cpa(): number {
    return this.conversions > 0 ? this.spend / this.conversions : 0;
  }

  get roas(): number {
    return this.spend > 0 ? this.revenue / this.spend : 0;
  }
}
