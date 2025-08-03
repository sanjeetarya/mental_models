import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { providerManager } from '@/lib/provider-manager';
import { initializeApp } from '@/lib/startup';
import { AnalyticsLogger } from '@/lib/analytics-logger';
import { estimateTokens } from '@/lib/token-counter';

// Initialize on first API call
let appInitialized = false;

export async function POST(request) {
  // Initialize app on first request
  if (!appInitialized) {
    try {
      await initializeApp();
      appInitialized = true;
    } catch (error) {
      console.warn('App initialization warning:', error.message);
      // Continue without analytics
    }
  }

  try {
    const { challenge, deviceData } = await request.json();

    if (!challenge) {
      return NextResponse.json(
        { message: 'Challenge is required' }, 
        { status: 400 }
      );
    }

    // Collect server-side data
    const headersList = await headers();
    const serverData = {
      ipAddress: headersList.get('x-forwarded-for') || 
                headersList.get('x-real-ip') || 
                'unknown',
      userAgent: headersList.get('user-agent') || 'unknown'
    };


    const { result, provider, method, keyUsed, queryId } = await providerManager.attemptMatch(
      challenge, 
      deviceData || {}, 
      serverData
    );

    return NextResponse.json({ 
      matches: result,
      provider,
      method,
      keyUsed,
      queryId,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Matching error:', error);
    
    // Log failed query
    try {
      const queryData = {
        query_text: challenge || 'unknown',
        query_length: challenge?.length || 0,
        query_tokens: estimateTokens(challenge || ''),
        api_call_timestamp: new Date(),
        response_received_timestamp: new Date(),
        query_output: {},
        total_llm_time_ms: 0,
        fallback_method: 'error',
        success: false,
        error_message: error.message
      };
      
      await AnalyticsLogger.logQuery(queryData);
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }
    
    return NextResponse.json(
      { message: 'Matching failed', error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Method not allowed' },
    { status: 405 }
  );
}
