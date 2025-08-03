import { pool } from './database.js';

export class DatabaseSchema {
  static async checkConnection() {
    try {
      await pool.execute('SELECT 1');
      console.log('Database connection successful');
      return true;
    } catch (error) {
      console.error('Database connection failed:', error);
      return false;
    }
  }

  static async initializeTables() {
    try {
      console.log('Checking and creating database tables...');
      
      await this.createQueryAnalyticsTable();
      await this.createDeviceAnalyticsTable();
      await this.createModelPerformanceTable();
      
      console.log('Database tables initialized successfully');
    } catch (error) {
      console.error('Failed to initialize database tables:', error);
      throw error;
    }
  }

  // Replace the createIndexSafely method with this corrected version
  static async createIndexSafely(indexName, tableName, columns) {
    try {
      // Check if index exists - using the correct database name
      const [rows] = await pool.execute(`
        SELECT COUNT(*) as index_count 
        FROM information_schema.statistics 
        WHERE table_schema = DATABASE()
        AND table_name = ? 
        AND index_name = ?
      `, [tableName, indexName]);
      
      if (rows[0].index_count === 0) {
        // Index doesn't exist, create it
        await pool.execute(`CREATE INDEX ${indexName} ON ${tableName}(${columns})`);
        console.log(`✅ Created index: ${indexName}`);
      } else {
        console.log(`ℹ️ Index already exists: ${indexName}`);
      }
    } catch (error) {
      // Only log as warning if it's not a "duplicate key" error
      if (error.message.includes('Duplicate key name')) {
        console.log(`ℹ️ Index already exists: ${indexName}`);
      } else {
        console.warn(`Failed to create index ${indexName}:`, error.message);
      }
    }
  }


  static async createQueryAnalyticsTable() {
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS query_analytics (
        id VARCHAR(36) PRIMARY KEY,
        query_text TEXT NOT NULL,
        query_length INT NOT NULL,
        query_tokens INT,
        llm_input_tokens INT,
        llm_output_tokens INT,
        api_call_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        response_received_timestamp TIMESTAMP,
        query_output JSON,
        total_llm_time_ms INT,
        model_used VARCHAR(100),
        model_provider VARCHAR(50),
        api_key_name VARCHAR(50),
        fallback_method VARCHAR(20),
        success BOOLEAN DEFAULT TRUE,
        error_message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    await pool.execute(createTableSQL);
    
    // Create indexes using the safe method
    await this.createIndexSafely('idx_created_at', 'query_analytics', 'created_at');
    await this.createIndexSafely('idx_provider', 'query_analytics', 'model_provider');
    await this.createIndexSafely('idx_success', 'query_analytics', 'success');
  }

  static async createDeviceAnalyticsTable() {
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS device_analytics (
        id VARCHAR(36) PRIMARY KEY,
        query_id VARCHAR(36),
        user_agent TEXT,
        ip_address VARCHAR(45),
        device_type VARCHAR(20),
        browser VARCHAR(50),
        operating_system VARCHAR(50),
        screen_width INT,
        screen_height INT,
        timezone VARCHAR(50),
        language VARCHAR(10),
        referrer TEXT,
        session_id VARCHAR(36),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    await pool.execute(createTableSQL);
    
    // Add foreign key constraint if it doesn't exist
    try {
      await pool.execute(`
        ALTER TABLE device_analytics 
        ADD CONSTRAINT fk_device_query 
        FOREIGN KEY (query_id) REFERENCES query_analytics(id)
        ON DELETE CASCADE
      `);
    } catch (error) {
      if (!error.message.includes('Duplicate foreign key constraint')) {
        console.warn('Foreign key constraint warning:', error.message);
      }
    }
    
    // Create indexes using the safe method
    await this.createIndexSafely('idx_device_type', 'device_analytics', 'device_type');
    await this.createIndexSafely('idx_device_created_at', 'device_analytics', 'created_at');
    await this.createIndexSafely('idx_query_id', 'device_analytics', 'query_id');
  }

  static async createModelPerformanceTable() {
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS model_performance (
        id VARCHAR(36) PRIMARY KEY,
        model_provider VARCHAR(50),
        model_name VARCHAR(100),
        api_key_name VARCHAR(50),
        success_count INT DEFAULT 0,
        failure_count INT DEFAULT 0,
        avg_response_time_ms DECIMAL(10,2),
        avg_input_tokens DECIMAL(10,2),
        avg_output_tokens DECIMAL(10,2),
        last_success_at TIMESTAMP NULL,
        last_failure_at TIMESTAMP NULL,
        daily_quota_used INT DEFAULT 0,
        quota_reset_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;
    
    await pool.execute(createTableSQL);
    
    // Add unique constraint
    try {
      await pool.execute(`
        ALTER TABLE model_performance 
        ADD CONSTRAINT unique_model_key 
        UNIQUE (model_provider, model_name, api_key_name)
      `);
    } catch (error) {
      if (!error.message.includes('Duplicate key name')) {
        console.warn('Unique constraint warning:', error.message);
      }
    }
    
    // Create indexes using the safe method
    await this.createIndexSafely('idx_model_provider', 'model_performance', 'model_provider');
    await this.createIndexSafely('idx_model_updated_at', 'model_performance', 'updated_at');
  }
}
