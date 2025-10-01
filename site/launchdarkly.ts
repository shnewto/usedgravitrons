// LaunchDarkly configuration and feature flag management
import LaunchDarkly from 'launchdarkly-node-server-sdk';
import type { LDClient } from 'launchdarkly-node-server-sdk';
import type { ZineIssue } from './types.ts';

// LaunchDarkly configuration
const LD_SDK_KEY = Deno.env.get('LAUNCHDARKLY_SDK_KEY') || '';
const LD_USER_KEY = Deno.env.get('LAUNCHDARKLY_USER_KEY') || 'anonymous-user';

let ldClient: LDClient | null = null;

// Initialize LaunchDarkly client
export async function initializeLaunchDarkly(): Promise<LDClient> {
  if (ldClient) {
    return ldClient;
  }

  try {
    ldClient = LaunchDarkly.init(LD_SDK_KEY);
    await ldClient.waitForInitialization();
    console.log('LaunchDarkly initialized successfully');
    
    return ldClient;
  } catch (error) {
    console.error('Failed to initialize LaunchDarkly:', error);
    throw error;
  }
}

// Feature flag functions
export async function isIssueEnabled(issueId: number): Promise<boolean> {
  const client = await initializeLaunchDarkly();
  const flagKey = `issue-${issueId.toString().padStart(2, '0')}`;
  const context = {
    kind: 'user',
    key: LD_USER_KEY
  };
  return client.variation(flagKey, context, false);
}

export async function isSearchEnabled(): Promise<boolean> {
  const client = await initializeLaunchDarkly();
  const context = {
    kind: 'user',
    key: LD_USER_KEY
  };
  return client.variation('search-enabled', context, true);
}

export async function isAdvancedFeaturesEnabled(): Promise<boolean> {
  const client = await initializeLaunchDarkly();
  const context = {
    kind: 'user',
    key: LD_USER_KEY
  };
  return client.variation('advanced-features', context, false);
}

// Get all enabled issues
export async function getEnabledIssues(issues: ZineIssue[]): Promise<ZineIssue[]> {
  const enabledIssues: ZineIssue[] = [];
  
  for (const issue of issues) {
    const isEnabled = await isIssueEnabled(issue.id);
    if (isEnabled) {
      enabledIssues.push(issue);
    }
  }
  
  return enabledIssues;
}
