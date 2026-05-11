# TWA + Play Store Checklist

## 1) Configure Digital Asset Links

1. Copy values from `.env.twa.example` to `.env.local`:
   - `ANDROID_PACKAGE_NAME`
   - `ANDROID_SHA256_CERT_FINGERPRINTS`
2. Deploy and verify endpoint:
   - `https://www.vooscortex.com.br/.well-known/assetlinks.json`

## 2) Generate Android project with Bubblewrap

Run from project root:

```bash
npx @bubblewrap/cli init --manifest https://www.vooscortex.com.br/manifest.webmanifest --directory twa
```

Recommended answers during init:
- Application ID: `br.com.vooscortex.app`
- App name: `VooFacil`
- Launcher name: `VooFacil`
- Start URL: `/`
- Host: `www.vooscortex.com.br`

## 3) Build signed bundle

After `init` completes:

```bash
cd twa
npx @bubblewrap/cli build
```

If prompted, provide:
- Keystore path
- Keystore alias
- Store password
- Key password

## 4) Play Console

1. Upload `.aab`
2. Complete Data safety and App content forms
3. Verify Deep Links and Digital Asset Links status
4. Start Internal testing release first

## 5) Useful command (fingerprint)

To get SHA256 from keystore:

```bash
keytool -list -v -keystore <PATH_TO_KEYSTORE> -alias <ALIAS>
```


