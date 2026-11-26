# Security review

The source contains fictional identities using the reserved `example.invalid` domain, synthetic research, example operational values, and newly authored report content. The two media files are a previously published prototype mark and a generated city illustration. There are no original report images, fonts, identifiers or operational records in the public demo.

The Content Security Policy sets `connect-src 'none'`. Browser code has no provider or server integration. The sample sign-in changes only local presentation state. Saved runs, currency and theme persist in this browser under a dedicated storage key.
