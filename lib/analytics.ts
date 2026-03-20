import { supabase } from './supabase';

export interface AnalyticsEvent {
  event_type: 'page_view' | 'guide_view' | 'feedback_submit' | 'guide_search' | 'feedback_helpful';
  page_path: string;
  guide_id?: string;
  user_agent: string;
  referrer: string;
  timestamp: string;
}

/**
 * Track page views and user interactions
 */
export const trackEvent = async (event: Omit<AnalyticsEvent, 'timestamp' | 'user_agent' | 'referrer'>) => {
  try {
    const eventData = {
      event_type: event.event_type,
      page_path: event.page_path,
      guide_id: event.guide_id || null,
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      referrer: typeof document !== 'undefined' ? document.referrer : 'direct',
      timestamp: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('analytics_events')
      .insert([eventData]);

    if (error) {
      console.error('Analytics tracking failed:', error);
    }
  } catch (err) {
    console.error('Error tracking event:', err);
    // Don't throw - analytics failure shouldn't break the app
  }
};

/**
 * Get page view statistics
 */
export const getPageStats = async (days: number = 7) => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from('analytics_events')
      .select('page_path')
      .eq('event_type', 'page_view')
      .gte('timestamp', startDate.toISOString());

    if (error) throw error;

    // Count views by page
    const stats = data?.reduce((acc: Record<string, number>, event: any) => {
      acc[event.page_path] = (acc[event.page_path] || 0) + 1;
      return acc;
    }, {});

    return stats;
  } catch (error) {
    console.error('Error fetching page stats:', error);
    return {};
  }
};

/**
 * Get guide view statistics
 */
export const getGuideStats = async (days: number = 7) => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from('analytics_events')
      .select('guide_id')
      .eq('event_type', 'guide_view')
      .gte('timestamp', startDate.toISOString())
      .not('guide_id', 'is', null);

    if (error) throw error;

    // Count views by guide
    const stats = data?.reduce((acc: Record<string, number>, event: any) => {
      if (event.guide_id) {
        acc[event.guide_id] = (acc[event.guide_id] || 0) + 1;
      }
      return acc;
    }, {});

    return stats;
  } catch (error) {
    console.error('Error fetching guide stats:', error);
    return {};
  }
};

/**
 * Get total page views
 */
export const getTotalPageViews = async (days: number = 7) => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { count, error } = await supabase
      .from('analytics_events')
      .select('*', { count: 'exact', head: true })
      .eq('event_type', 'page_view')
      .gte('timestamp', startDate.toISOString());

    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error('Error fetching total page views:', error);
    return 0;
  }
};

/**
 * Get feedback submission rate
 */
export const getFeedbackStats = async (days: number = 7) => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { count, error } = await supabase
      .from('analytics_events')
      .select('*', { count: 'exact', head: true })
      .eq('event_type', 'feedback_submit')
      .gte('timestamp', startDate.toISOString());

    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error('Error fetching feedback stats:', error);
    return 0;
  }
};

/**
 * Get guide search queries
 */
export const getSearchQueries = async (days: number = 7, limit: number = 10) => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from('analytics_events')
      .select('page_path')
      .eq('event_type', 'guide_search')
      .gte('timestamp', startDate.toISOString())
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching search queries:', error);
    return [];
  }
};

/**
 * Get traffic by referrer
 */
export const getTrafficByReferrer = async (days: number = 7) => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from('analytics_events')
      .select('referrer')
      .gte('timestamp', startDate.toISOString());

    if (error) throw error;

    const stats = data?.reduce((acc: Record<string, number>, event: any) => {
      const ref = event.referrer || 'direct';
      acc[ref] = (acc[ref] || 0) + 1;
      return acc;
    }, {});

    return stats;
  } catch (error) {
    console.error('Error fetching referrer stats:', error);
    return {};
  }
};

/**
 * Get popular browsers/devices
 */
export const getDeviceStats = async (days: number = 7) => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from('analytics_events')
      .select('user_agent')
      .gte('timestamp', startDate.toISOString());

    if (error) throw error;

    // Simple device detection
    const stats = {
      mobile: 0,
      tablet: 0,
      desktop: 0,
    };

    data?.forEach((event: any) => {
      const ua = event.user_agent.toLowerCase();
      if (/mobile|android|iphone/.test(ua)) {
        stats.mobile++;
      } else if (/ipad|tablet/.test(ua)) {
        stats.tablet++;
      } else {
        stats.desktop++;
      }
    });

    return stats;
  } catch (error) {
    console.error('Error fetching device stats:', error);
    return { mobile: 0, tablet: 0, desktop: 0 };
  }
};

/**
 * Get trending guides (most viewed in last X days)
 */
export const getTrendingGuides = async (days: number = 7, limit: number = 10) => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data: events, error: eventsError } = await supabase
      .from('analytics_events')
      .select('guide_id')
      .eq('event_type', 'guide_view')
      .gte('timestamp', startDate.toISOString())
      .not('guide_id', 'is', null);

    if (eventsError) throw eventsError;

    // Count views
    const guideCounts = events?.reduce((acc: Record<string, number>, event: any) => {
      if (event.guide_id) {
        acc[event.guide_id] = (acc[event.guide_id] || 0) + 1;
      }
      return acc;
    }, {});

    // Sort and get top guides
    const topGuideIds = Object.entries(guideCounts || {})
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, limit)
      .map(([id]) => id);

    // Fetch guide details
    const { data: guides, error: guidesError } = await supabase
      .from('guides')
      .select('id, title, slug')
      .in('id', topGuideIds);

    if (guidesError) throw guidesError;

    // Merge with view counts
    return guides?.map((guide: any) => ({
      ...guide,
      views: guideCounts[guide.id] || 0,
    })) || [];
  } catch (error) {
    console.error('Error fetching trending guides:', error);
    return [];
  }
};
