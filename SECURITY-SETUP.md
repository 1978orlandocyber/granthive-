# GrantHive — Security Setup

## Critical warning

**Never place the Anthropic API key inside `index.html`, frontend JavaScript, Swift code, GitHub, or any public file.**

The browser calls the GrantHive Netlify Function. The function reads the private key from Netlify and calls Anthropic from the server.

## 1. Create the Anthropic API credentials

1. Open the Anthropic Console.
2. Create an API key.
3. Copy it once and place it in a password manager.
4. Confirm a currently supported model identifier in Anthropic’s model documentation.
5. Remember that Claude subscriptions and Anthropic API billing are separate.

## 2. Add the variables to Netlify

Open the GrantHive site in Netlify and find **Site configuration → Environment variables**.

Add:

- `ANTHROPIC_API_KEY` — your private API key
- `ANTHROPIC_MODEL` — the supported model identifier you selected

Make both variables available to the Netlify Functions runtime and to the deployment contexts you actually test. Do not use frontend prefixes such as `VITE_` or `REACT_APP_`.

## 3. Deploy the files

Upload or commit this package to the `granthive` GitHub repository. Netlify should automatically deploy the `main` branch.

After adding or changing environment variables, trigger a fresh production deployment so the Function uses the new values.

## 4. Verify the secure request path

1. Open the deployed GrantHive site.
2. Open the browser Network panel when desktop developer tools are available.
3. Run an eligibility check.
4. Confirm the browser requests:
   `/.netlify/functions/check-eligibility`
5. Confirm the browser does not request `api.anthropic.com`.

## 5. Test the private beta

### Successful request
Submit a valid organization profile and grant description. Confirm that the result contains a score, verdict, summary, and requirement checks.

### Controlled failure
Test missing-key behavior locally or in a separate deploy-preview environment. Do not remove the production key merely to create a failure test.

Also test:

- Empty fields
- Invalid JSON sent directly to the Function
- Oversized input
- Unsupported HTTP methods
- Provider timeout or temporary failure
- Button restoration after every failure

No failure may produce a fake eligibility result, API key, stack trace, internal path, or raw provider response.

## 6. Rotate an exposed key

1. Revoke the exposed key immediately in the Anthropic Console.
2. Create a replacement key.
3. Replace the value in Netlify.
4. trigger a new deployment.
5. Inspect Git history if the key was ever committed.

Deleting a key from a later commit does not make the old key safe. Revocation is mandatory.

## 7. Current private-beta limitation

This version does not yet include authentication, per-user quotas, rate limiting, or bot protection. Keep testing controlled. Do not launch unrestricted public AI access until these protections are added.
