export interface ResearchStats {
  cacheMode: string;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  backendCacheHits: number;
  backendCacheMisses: number;
  backendCacheWrites: number;
  externalApiCalls: number;
  externalApiSuccesses: number;
  externalApiFailures: number;
}

class ResearchService {
  private stats = {
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    backendCacheHits: 0,
    backendCacheMisses: 0,
    backendCacheWrites: 0,
    externalApiCalls: 0,
    externalApiSuccesses: 0,
    externalApiFailures: 0,
  };

  increment(metric: keyof typeof this.stats, value = 1): void {
    if (process.env.RESEARCH_MODE === 'true') {
      if (typeof this.stats[metric] === 'number') {
        this.stats[metric] += value;
      }
    }
  }

  getStats(): ResearchStats {
    const rawMode = (process.env.CACHE_MODE || 'DUAL').toUpperCase();
    const cacheMode = rawMode === 'NONE' ? 'NO_CACHE' : rawMode;

    return {
      cacheMode,
      totalRequests: this.stats.totalRequests,
      successfulRequests: this.stats.successfulRequests,
      failedRequests: this.stats.failedRequests,
      backendCacheHits: this.stats.backendCacheHits,
      backendCacheMisses: this.stats.backendCacheMisses,
      backendCacheWrites: this.stats.backendCacheWrites,
      externalApiCalls: this.stats.externalApiCalls,
      externalApiSuccesses: this.stats.externalApiSuccesses,
      externalApiFailures: this.stats.externalApiFailures,
    };
  }

  resetStats(): void {
    this.stats = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      backendCacheHits: 0,
      backendCacheMisses: 0,
      backendCacheWrites: 0,
      externalApiCalls: 0,
      externalApiSuccesses: 0,
      externalApiFailures: 0,
    };
  }
}

export const researchMetrics = new ResearchService();
