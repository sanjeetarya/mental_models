import { pool, initializeDatabase } from './database';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

export class AnalyticsLogger {
  static async ensureInitialized() {
    try {
      await initializeDatabase();
    } catch (error) {
      console.warn('Analytics database not available:', error.message);
      return false;
    }
    return true;
  }

  static hashIP(ip) {
    if (!ip || ip === 'unknown') return 'unknown';
    return crypto.createHash('sha256').update(ip + (process.env.IP_SALT || 'default')).digest('hex').substring(0, 12);
  }

  static parseUserAgent(userAgent) {
    const ua = userAgent.toLowerCase();
    
    let browser = 'unknown';
    if (ua.includes('chrome')) browser = 'Chrome';
    else if (ua.includes('firefox')) browser = 'Firefox';
    else if (ua.includes('safari')) browser = 'Safari';
    else if (ua.includes('edge')) browser = 'Edge';
    
    let os = 'unknown';
    if (ua.includes('windows')) os = 'Windows';
    else if (ua.includes('mac')) os = 'macOS';
    else if (ua.includes('linux')) os = 'Linux';
    else if (ua.includes('android')) os = 'Android';
    else if (ua.includes('ios')) os = 'iOS';
    
    return { browser, os };
  }

  static async logQuery(queryData) {
    const queryId = uuidv4();
    
    // Check if database is available
    const dbAvailable = await this.ensureInitialized();
    if (!dbAvailable) {
      console.log('Skipping analytics logging - database not available');
      return queryId;
    }
    
    try {
      await pool.execute(`
        INSERT INTO query_analytics (
          id, query_text, query_length, query_tokens, llm_input_tokens, 
          llm_output_tokens, api_call_timestamp, response_received_timestamp,
          query_output, total_llm_time_ms, model_used, model_provider,
          api_key_name, fallback_method, success, error_message
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        queryId, 
        queryData.query_text, 
        queryData.query_length,
        queryData.query_tokens || null, 
        queryData.llm_input_tokens || null,
        queryData.llm_output_tokens || null, 
        queryData.api_call_timestamp,
        queryData.response_received_timestamp || new Date(),
        JSON.stringify(queryData.query_output),
        queryData.total_llm_time_ms || null, 
        queryData.model_used || null,
        queryData.model_provider || null, 
        queryData.api_key_name || null,
        queryData.fallback_method, 
        queryData.success, 
        queryData.error_message || null
      ]);
      
      return queryId;
    } catch (error) {
      console.error('Failed to log query analytics:', error);
      return queryId; // Return ID even if logging fails
    }
  }

  static async logDeviceData(queryId, deviceData, serverData) {
    const dbAvailable = await this.ensureInitialized();
    if (!dbAvailable) return;
    
    try {
      const { browser, os } = this.parseUserAgent(deviceData.userAgent || '');
      
      await pool.execute(`
        INSERT INTO device_analytics (
          id, query_id, user_agent, ip_address, device_type,
          browser, operating_system, screen_width, screen_height,
          timezone, language, referrer, session_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        uuidv4(), 
        queryId, 
        deviceData.userAgent || 'unknown',
        this.hashIP(serverData.ipAddress),
        deviceData.deviceType || 'unknown', 
        browser,
        os, 
        deviceData.screenWidth || null,
        deviceData.screenHeight || null, 
        deviceData.timezone || null, 
        deviceData.language || null,
        deviceData.referrer || null, 
        deviceData.sessionId || null
      ]);
    } catch (error) {
      console.error('Failed to log device analytics:', error);
    }
  }

  static async updateModelPerformance(provider, model, keyName, success, responseTime, inputTokens, outputTokens) {
    const dbAvailable = await this.ensureInitialized();
    if (!dbAvailable) return;
    
    try {
      await pool.execute(`
        INSERT INTO model_performance (
          id, model_provider, model_name, api_key_name, success_count, 
          failure_count, avg_response_time_ms, avg_input_tokens, avg_output_tokens,
          last_success_at, last_failure_at, daily_quota_used
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          success_count = success_count + ?,
          failure_count = failure_count + ?,
          avg_response_time_ms = (avg_response_time_ms + ?) / 2,
          avg_input_tokens = (avg_input_tokens + COALESCE(?, 0)) / 2,
          avg_output_tokens = (avg_output_tokens + COALESCE(?, 0)) / 2,
          last_success_at = IF(? = 1, NOW(), last_success_at),
          last_failure_at = IF(? = 0, NOW(), last_failure_at),
          daily_quota_used = daily_quota_used + COALESCE(?, 0),
          updated_at = NOW()
      `, [
        uuidv4(), provider, model, keyName, 
        success ? 1 : 0, success ? 0 : 1, 
        responseTime || 0, inputTokens || 0, outputTokens || 0,
        success ? new Date() : null, success ? null : new Date(),
        inputTokens || 0,
        // ON DUPLICATE KEY UPDATE values
        success ? 1 : 0, success ? 0 : 1, responseTime || 0,
        inputTokens, outputTokens, success ? 1 : 0, success ? 1 : 0, inputTokens
      ]);
    } catch (error) {
      console.error('Failed to update model performance:', error);
    }
  }
}
