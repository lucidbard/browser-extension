import settings from './settings';

const ALLOWED_PROTOCOLS = new Set(['http:', 'https:']);

<<<<<<< HEAD
// The following sites are personal in nature, high potential traffic
// and URLs don't correspond to identifiable content
const BLOCKED_HOSTNAMES = new Set([
=======
const BLOCK_HOSTNAMES = new Set([
>>>>>>> 76ad668... Reduce the number of badge requests
  'facebook.com',
  'www.facebook.com',
  'mail.google.com',
]);

/** encodeUriQuery encodes a string for use in a query parameter */
function encodeUriQuery(val) {
  return encodeURIComponent(val).replace(/%20/g, '+');
}

/**
 * Based on the request protocol and hostname decide if the URL should be sent to the "badge"
 * request endpoint.
 *
 * @param {string} uri
<<<<<<< HEAD
 * @return {boolean} - false if the URL should not be sent to the "badge" request endpoint
=======
 * @return {boolean} - false if the requested URL is not be sent to the "badge" request,
 *                     otherwise true.
>>>>>>> 76ad668... Reduce the number of badge requests
 */
function shouldQueryUri(uri) {
  let url;

  try {
    url = new URL(uri);
  } catch (e) {
    return false;
  }

  if (!ALLOWED_PROTOCOLS.has(url.protocol)) {
    return false;
  }

  if (BLOCKED_HOSTNAMES.has(url.hostname)) {
    return false;
  }

  return true;
}

/**
 * Queries the Hypothesis service that provides
 * statistics about the annotations for a given URL.
 *
 * @return {Promise<number>}
 */
async function query(uri) {
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

/**
 * Retrieve the count of available annotations for `uri`
 *
 * @return {Promise<number>} - Annotation count for `uri`. Will be 0 if URI
 *                             has a blocklist match.
 * @throws Will throw a variety of errors: network, json parsing, or wrong format errors.
 */
export function getAnnotationCount(uri) {
  if (!shouldQueryUri(uri)) {
    return Promise.resolve(0);
  }

  return query(uri);
}
