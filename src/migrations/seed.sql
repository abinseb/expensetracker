-- ============================================================
-- Expense Tracker - Seed Data
-- Run: psql -U postgres -d expensetracker -f src/migrations/seed.sql
-- WARNING: Clears existing data before inserting!
-- ============================================================

-- Clear existing data (order matters due to FK constraints)
TRUNCATE budgets, transactions, categories, users RESTART IDENTITY CASCADE;

-- ============================================================
-- Users (passwords are bcrypt hash of "password123")
-- ============================================================
INSERT INTO users (name, email, password_hash) VALUES
  ('Alice Johnson', 'alice@example.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
  ('Bob Smith',    'bob@example.com',   '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- ============================================================
-- Categories (for Alice = user_id 1)
-- ============================================================
INSERT INTO categories (user_id, name, type, icon) VALUES
  (1, 'Salary',        'income',   '💰'),
  (1, 'Freelance',     'income',   '💻'),
  (1, 'Rent',          'expense',  '🏠'),
  (1, 'Groceries',     'expense',  '🛒'),
  (1, 'Transport',     'expense',  '🚗'),
  (1, 'Entertainment', 'expense',  '🎬'),
  (1, 'Healthcare',    'expense',  '🏥'),
  (1, 'Utilities',     'expense',  '💡');

-- Categories (for Bob = user_id 2)
INSERT INTO categories (user_id, name, type, icon) VALUES
  (2, 'Salary',    'income',  '💰'),
  (2, 'Rent',      'expense', '🏠'),
  (2, 'Food',      'expense', '🍔'),
  (2, 'Internet',  'expense', '🌐');

-- ============================================================
-- Transactions (for Alice = user_id 1)
-- cat ids: Salary=1, Freelance=2, Rent=3, Groceries=4, Transport=5, Entertainment=6, Healthcare=7, Utilities=8
-- ============================================================
INSERT INTO transactions (user_id, category_id, type, amount, description, date) VALUES
  -- October 2026
  (1, 1, 'credit', 75000.00, 'October salary',         '2026-10-01'),
  (1, 2, 'credit', 15000.00, 'Freelance project',      '2026-10-05'),
  (1, 3, 'debit',  18000.00, 'October rent',           '2026-10-02'),
  (1, 4, 'debit',   4200.00, 'Weekly groceries',       '2026-10-07'),
  (1, 5, 'debit',   1500.00, 'Fuel',                   '2026-10-09'),
  (1, 6, 'debit',    800.00, 'Movie night',            '2026-10-12'),
  (1, 8, 'debit',   2500.00, 'Electricity & water',    '2026-10-10'),
  (1, 4, 'debit',   3800.00, 'Weekly groceries',       '2026-10-14'),
  (1, 5, 'debit',    600.00, 'Uber rides',             '2026-10-16'),
  (1, 7, 'debit',   2200.00, 'Doctor visit',           '2026-10-18'),

  -- September 2026
  (1, 1, 'credit', 75000.00, 'September salary',       '2026-09-01'),
  (1, 3, 'debit',  18000.00, 'September rent',         '2026-09-02'),
  (1, 4, 'debit',   5100.00, 'Groceries',              '2026-09-10'),
  (1, 5, 'debit',   1200.00, 'Transport',              '2026-09-15'),
  (1, 6, 'debit',   1500.00, 'OTT subscriptions',      '2026-09-20'),
  (1, 8, 'debit',   2400.00, 'Utilities',              '2026-09-05'),

  -- August 2026
  (1, 1, 'credit', 75000.00, 'August salary',          '2026-08-01'),
  (1, 2, 'credit',  8000.00, 'Small freelance gig',    '2026-08-18'),
  (1, 3, 'debit',  18000.00, 'August rent',            '2026-08-02'),
  (1, 4, 'debit',   4500.00, 'Groceries',              '2026-08-08'),
  (1, 5, 'debit',   1800.00, 'Petrol',                 '2026-08-12'),
  (1, 7, 'debit',   3500.00, 'Pharmacy',               '2026-08-20');

-- Transactions for Bob (user_id 2)
-- cat ids: Salary=9, Rent=10, Food=11, Internet=12
INSERT INTO transactions (user_id, category_id, type, amount, description, date) VALUES
  (2,  9, 'credit', 50000.00, 'October salary', '2026-10-01'),
  (2, 10, 'debit',  12000.00, 'Rent',           '2026-10-02'),
  (2, 11, 'debit',   6000.00, 'Food',           '2026-10-10'),
  (2, 12, 'debit',    799.00, 'Internet bill',  '2026-10-05');

-- ============================================================
-- Budgets for Alice (October 2026)
-- ============================================================
INSERT INTO budgets (user_id, category_id, month, amount) VALUES
  (1, 3, '2026-10-01', 18000.00),  -- Rent
  (1, 4, '2026-10-01',  8000.00),  -- Groceries
  (1, 5, '2026-10-01',  3000.00),  -- Transport
  (1, 6, '2026-10-01',  2000.00),  -- Entertainment
  (1, 7, '2026-10-01',  3000.00),  -- Healthcare
  (1, 8, '2026-10-01',  3000.00);  -- Utilities
