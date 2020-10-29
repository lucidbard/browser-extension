import settings from './settings';

const ALLOWED_PROTOCOLS = new Set(['http:', 'https:']);

// The following sites are personal in nature, high potential traffic
// and URLs don't correspond to identifiable content
const BLOCKED_HOSTNAMES = new Set([
  'facebook.com',
  'www.facebook.com',
  'mail.google.com',
]);

/** encodeUriQuery encodes a string for use in a query parameter */
function encodeUriQuery(val) {
  return encodeURIComponent(val).replace(/%20/g, '+');
}

/**
 * Based on the protocol and hostname of the URI decides if the URL should be sent to the "badge"
 * request endpoint.
 *
 * @param {string} uri
 * @return {string} - URL without fragment
 * @throws Will throw if URL is invalid or should not be sent to the 'badge' request endpoint
 */
export function shouldQueryUri(uri) {
  const url = new URL(uri);

  if (!ALLOWED_PROTOCOLS.has(url.protocol)) {
    throw new Error('Blocked protocol');
  }

  if (BLOCKED_HOSTNAMES.has(url.hostname)) {
    throw new Error('Blocked hostname');
  }

  url.hash = '';

  return url.toString();
}

/**
 * Queries the Hypothesis service that provides
 * statistics about the annotations for a given URL.
 *
 * @return {Promise<number>}
 * @throws Will throw a variety of errors: network, json parsing, or wrong format errors.
 */
export async function fetchAnnotationCount(uri) {
  const response = await fetch(
    settings.apiUrl + '/badge?uri=' + encodeUriQuery(uri),
    {
      credentials: 'include',
    }
  );

  const data = await response.json();

  if (data && typeof data.total === 'number') {
    return data.total;
  }

  throw new Error('Unable to parse badge response');
}
