-- Seed initial African currencies
insert into public.currencies (code, name, symbol, country, is_active) values
  ('NGN', 'Nigerian Naira', '₦', 'Nigeria', true),
  ('KES', 'Kenyan Shilling', 'KSh', 'Kenya', true),
  ('ZAR', 'South African Rand', 'R', 'South Africa', true),
  ('GHS', 'Ghanaian Cedi', '₵', 'Ghana', true),
  ('EGP', 'Egyptian Pound', 'E£', 'Egypt', true),
  ('TZS', 'Tanzanian Shilling', 'TSh', 'Tanzania', true),
  ('UGX', 'Ugandan Shilling', 'USh', 'Uganda', true),
  ('MAD', 'Moroccan Dirham', 'DH', 'Morocco', true),
  ('ETB', 'Ethiopian Birr', 'Br', 'Ethiopia', true),
  ('XOF', 'West African CFA Franc', 'CFA', 'West Africa', true),
  ('USD', 'US Dollar', '$', 'United States', true),
  ('EUR', 'Euro', '€', 'European Union', true),
  ('GBP', 'British Pound', '£', 'United Kingdom', true)
on conflict (code) do nothing;
