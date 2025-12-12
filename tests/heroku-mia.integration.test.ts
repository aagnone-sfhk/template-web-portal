/**
 * Integration test for Heroku Managed Inference & Agents API
 * 
 * Tests that our API route correctly formats requests to the Heroku API.
 * 
 * Prerequisites:
 * 1. Dev server running: pnpm dev
 * 2. Valid env vars in .env: INFERENCE_URL, INFERENCE_KEY, TARGET_APP_NAME
 * 
 * Note: Some tests may fail with 403 if the API key lacks model access.
 * This is expected - the tests validate request format, not API access.
 * 
 * Run with: pnpm test:integration
 */

import { describe, it, expect, beforeAll } from 'vitest';

const API_BASE_URL = process.env.TEST_API_URL || 'http://localhost:3000';

async function getErrorDetails(response: Response): Promise<string> {
  try {
    const body = await response.json();
    return JSON.stringify(body);
  } catch {
    return await response.text();
  }
}

describe('Heroku MIA API Integration', () => {
  beforeAll(() => {
    if (!process.env.INFERENCE_URL || !process.env.INFERENCE_KEY) {
      console.warn('⚠️  INFERENCE_URL and INFERENCE_KEY should be set for integration tests');
    }
  });

  describe('Request Format Validation', () => {
    /**
     * These tests validate that our API correctly formats requests.
     * We check that we DON'T get 400 (invalid request format).
     * 
     * 403 from Heroku API means credentials issue, not format issue.
     * 500 from our API means internal error, not format issue.
     * 
     * The key validation: runtime_params.target_app_name must be included.
     */

    it('should not return 400 for valid chat request without tools', async () => {
      const response = await fetch(`${API_BASE_URL}/api/heroku-mia`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: 'Say hello' }],
          model: 'claude-4-sonnet',
          reasoning: false,
          tools: []
        })
      });

      // 400 = invalid request format (our bug)
      // 403 = API auth issue (not our bug)
      // 500 = server error (may or may not be our bug)
      expect(response.status).not.toBe(400);
    });

    it('should not return 400 for postgres_get_schema tool', async () => {
      const response = await fetch(`${API_BASE_URL}/api/heroku-mia`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: 'Show me the database schema' }],
          model: 'claude-4-sonnet',
          reasoning: false,
          tools: [{ name: 'postgres_get_schema', type: 'heroku' }]
        })
      });

      // Key test: should NOT get 400 for missing runtime_params
      if (response.status === 400) {
        const errorDetails = await getErrorDetails(response);
        // If we get 400, make sure it's not about runtime_params
        expect(errorDetails).not.toContain('runtime_params');
        expect(errorDetails).not.toContain('target_app_name is required');
      }
      
      expect(response.status).not.toBe(400);
    });

    it('should not return 400 for postgres_run_query tool', async () => {
      const response = await fetch(`${API_BASE_URL}/api/heroku-mia`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: 'List all tables' }],
          model: 'claude-4-sonnet',
          reasoning: false,
          tools: [{ name: 'postgres_run_query', type: 'heroku' }]
        })
      });

      if (response.status === 400) {
        const errorDetails = await getErrorDetails(response);
        expect(errorDetails).not.toContain('runtime_params');
        expect(errorDetails).not.toContain('target_app_name is required');
      }
      
      expect(response.status).not.toBe(400);
    });

    it('should not return 400 for multiple postgres tools', async () => {
      const response = await fetch(`${API_BASE_URL}/api/heroku-mia`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: 'What tables exist?' }],
          model: 'claude-4-sonnet',
          reasoning: false,
          tools: [
            { name: 'postgres_get_schema', type: 'heroku' },
            { name: 'postgres_run_query', type: 'heroku' }
          ]
        })
      });

      expect(response.status).not.toBe(400);
    });

    it('should not return 400 for MCP tools with explicit type', async () => {
      const response = await fetch(`${API_BASE_URL}/api/heroku-mia`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: 'Test' }],
          model: 'claude-4-sonnet',
          reasoning: false,
          tools: [{ name: 'mcp_test_tool', type: 'mcp', description: 'A test MCP tool' }]
        })
      });

      expect(response.status).not.toBe(400);
    });

    it('should handle unknown tool types gracefully (skip them)', async () => {
      const response = await fetch(`${API_BASE_URL}/api/heroku-mia`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: 'Do something' }],
          model: 'claude-4-sonnet',
          reasoning: false,
          tools: [{ name: 'unknown_tool', type: 'unknown' }]
        })
      });

      // Unknown tools should be skipped with a warning, not cause 400
      expect(response.status).not.toBe(400);
    });
  });

  describe('Runtime Params Configuration', () => {
    it('heroku tools should include target_app_name (no 400 error)', async () => {
      const response = await fetch(`${API_BASE_URL}/api/heroku-mia`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: 'Get schema' }],
          model: 'claude-4-sonnet',
          reasoning: false,
          tools: [{ name: 'postgres_get_schema', type: 'heroku' }]
        })
      });

      // This test specifically validates runtime_params.target_app_name is set
      if (response.status === 400) {
        const errorDetails = await getErrorDetails(response);
        console.error('400 Error:', errorDetails);
        
        // These assertions fail with clear message if runtime_params is missing
        expect(errorDetails, 'runtime_params should be included').not.toContain('runtime_params');
        expect(errorDetails, 'target_app_name should be set').not.toContain('target_app_name is required');
      }
      
      // Final check: not a request format error
      expect(response.status).not.toBe(400);
    });
  });
});
