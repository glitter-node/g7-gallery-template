import fs from 'fs';
import path from 'path';
import { describe, expect, it } from 'vitest';

type LayoutJson = {
  data_sources?: Array<{
    id?: string;
    type?: string;
    endpoint?: string;
  }>;
};

type EndpointUsage = {
  filePath: string;
  dataSourceId: string;
  endpoint: string;
  normalizedEndpoint: string;
};

const projectRoot = path.resolve(__dirname, '../../../..');
const layoutsRoot = path.resolve(projectRoot, 'templates/glitter-gallery/layouts');

const allowedNormalizedEndpoints = new Set([
  '/api/modules/sirsoft-board/boards/posts/recent',
]);

function listJsonFiles(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      return listJsonFiles(fullPath);
    }

    if (entry.isFile() && entry.name.endsWith('.json')) {
      return [fullPath];
    }

    return [];
  });
}

function normalizeEndpoint(endpoint: string): string {
  return endpoint.split('?')[0] ?? endpoint;
}

function collectApiEndpoints(): EndpointUsage[] {
  const files = listJsonFiles(layoutsRoot);
  const endpoints: EndpointUsage[] = [];

  for (const filePath of files) {
    const json = JSON.parse(fs.readFileSync(filePath, 'utf8')) as LayoutJson;

    for (const dataSource of json.data_sources ?? []) {
      if (dataSource.type !== 'api' || !dataSource.endpoint) {
        continue;
      }

      endpoints.push({
        filePath,
        dataSourceId: dataSource.id ?? '(unknown)',
        endpoint: dataSource.endpoint,
        normalizedEndpoint: normalizeEndpoint(dataSource.endpoint),
      });
    }
  }

  return endpoints;
}

function loadRouteSources(): string[] {
  const routeFiles = [
    path.resolve(projectRoot, 'routes/api.php'),
    path.resolve(projectRoot, 'modules/sirsoft-board/src/routes/api.php'),
  ];

  return routeFiles
    .filter((filePath) => fs.existsSync(filePath))
    .map((filePath) => fs.readFileSync(filePath, 'utf8'));
}

function routeExistsInSources(normalizedEndpoint: string, routeSources: string[]): boolean {
  if (allowedNormalizedEndpoints.has(normalizedEndpoint)) {
    return true;
  }

  const candidateFragments = new Set<string>([
    normalizedEndpoint,
    normalizedEndpoint.replace(/^\/api\//, ''),
    normalizedEndpoint.replace(/^\/api\/modules\/[^/]+\//, ''),
    normalizedEndpoint.replace(/^\/api\/templates\//, ''),
  ]);

  return routeSources.some((source) => {
    for (const fragment of candidateFragments) {
      if (fragment && source.includes(fragment)) {
        return true;
      }
    }

    return false;
  });
}

describe('glitter-gallery layout API endpoint validation', () => {
  it('모든 layouts JSON의 api data_source endpoint는 실제 라우트에 대응되어야 한다', () => {
    const routeSources = loadRouteSources();
    const apiEndpoints = collectApiEndpoints();

    const missingEndpoints = apiEndpoints.filter(
      (usage) => !routeExistsInSources(usage.normalizedEndpoint, routeSources)
    );

    expect(
      missingEndpoints.map((usage) => ({
        filePath: path.relative(projectRoot, usage.filePath),
        dataSourceId: usage.dataSourceId,
        endpoint: usage.endpoint,
      }))
    ).toEqual([]);
  });
});
