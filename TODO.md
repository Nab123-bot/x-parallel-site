# Supabase Register Fix - Progress Tracker

## Steps from Plan (2/5) ✓
- [x] 1. Update app/register/page.tsx: Replace mock handleSubmit with real Supabase insert to public.clients table (nom=name, email, mot_de_passe=password, telephone='', date_naissance=null)
- [x] 2. Test insert: npm run dev → register → check Supabase clients table
- [ ] 3. Handle errors: email unique, validation
- [ ] 4. Build check: npm run build
- [ ] 4. Build check: npm run build
- [ ] 5. Security: Add password hashing + form fields for telephone/date_naissance + consider Supabase Auth

**Notes:**
- Table public.clients (bigint id, nom, prenom, email UNIQUE, mot_de_passe, telephone UNIQUE, date_naissance)
- Current form: name (→ nom), email, password. Missing prenom/telephone/date_naissance (set defaults for now)
- Password plaintext → TODO hash (bcrypt)
