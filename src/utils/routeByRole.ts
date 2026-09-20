import { getUrlByRouteRole } from '@openedx/frontend-base';

// A URI scheme (RFC 3986) at the start of a string, e.g. "https:".
const absoluteUrlRegex = /^[a-z][a-z0-9+.-]*:/i;

export interface ResolvedRoute {
  url: string;
  isInternal: boolean;
}

/**
 * Resolves the route the running site provides for the given role, if any,
 * substituting `params` into the route pattern and dropping a trailing splat.
 * `isInternal` distinguishes an SPA path from an external URL.
 */
export const resolveRouteByRole = (
  role: string,
  params: Record<string, string> = {},
): ResolvedRoute | null => {
  let url = getUrlByRouteRole(role);
  if (!url) {
    return null;
  }
  for (const [name, value] of Object.entries(params)) {
    url = url.replace(`:${name}`, value);
  }
  url = url.replace(/\/\*$/, '');
  return { url, isInternal: !absoluteUrlRegex.test(url) };
};
