import { pool } from "./pool";

// ─── User Queries ────────────────────────────────────────────

export async function getUserByEmail(email: string) {
  const result = await pool.query(
    "SELECT id, name, email, password_hash FROM users WHERE email = $1",
    [email]
  );
  return result.rows[0] || null;
}

export async function createUser(
  name: string,
  email: string,
  passwordHash: string
) {
  const result = await pool.query(
    "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email",
    [name, email, passwordHash]
  );
  return result.rows[0];
}

// ─── Category Queries ────────────────────────────────────────

export async function getCategories(userId: number) {
  const result = await pool.query(
    "SELECT id, name, type, icon, created_at FROM categories WHERE user_id = $1 ORDER BY name",
    [userId]
  );
  return result.rows;
}

export async function getCategoriesByType(userId: number, type: "income" | "expense") {
  const result = await pool.query(
    "SELECT id, name, type, icon FROM categories WHERE user_id = $1 AND type = $2 ORDER BY name",
    [userId, type]
  );
  return result.rows;
}

export async function createCategory(
  userId: number,
  name: string,
  type: "income" | "expense",
  icon: string
) {
  const result = await pool.query(
    "INSERT INTO categories (user_id, name, type, icon) VALUES ($1, $2, $3, $4) RETURNING id, name, type, icon",
    [userId, name, type, icon]
  );
  return result.rows[0];
}

export async function deleteCategory(categoryId: number, userId: number) {
  const result = await pool.query(
    "DELETE FROM categories WHERE id = $1 AND user_id = $2 RETURNING id",
    [categoryId, userId]
  );
  return result.rowCount! > 0;
}

// ─── Transaction Queries ─────────────────────────────────────

export interface TransactionFilters {
  userId: number;
  type?: "credit" | "debit";
  categoryId?: number;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}

export async function getTransactions(filters: TransactionFilters) {
  const conditions: string[] = ["t.user_id = $1"];
  const params: (string | number)[] = [filters.userId];
  let paramIdx = 2;

  if (filters.type) {
    conditions.push(`t.type = $${paramIdx++}`);
    params.push(filters.type);
  }
  if (filters.categoryId) {
    conditions.push(`t.category_id = $${paramIdx++}`);
    params.push(filters.categoryId);
  }
  if (filters.startDate) {
    conditions.push(`t.date >= $${paramIdx++}`);
    params.push(filters.startDate);
  }
  if (filters.endDate) {
    conditions.push(`t.date <= $${paramIdx++}`);
    params.push(filters.endDate);
  }

  const limit = filters.limit || 50;
  const offset = filters.offset || 0;

  const query = `
    SELECT t.id, t.type, t.amount, t.description, t.date, t.created_at,
           t.category_id, c.name as category_name, c.icon as category_icon
    FROM transactions t
    LEFT JOIN categories c ON t.category_id = c.id
    WHERE ${conditions.join(" AND ")}
    ORDER BY t.date DESC, t.created_at DESC
    LIMIT $${paramIdx++} OFFSET $${paramIdx}
  `;
  params.push(limit, offset);

  const result = await pool.query(query, params);
  return result.rows;
}

export async function createTransaction(
  userId: number,
  categoryId: number | null,
  type: "credit" | "debit",
  amount: number,
  description: string,
  date: string
) {
  const result = await pool.query(
    `INSERT INTO transactions (user_id, category_id, type, amount, description, date)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, type, amount, description, date`,
    [userId, categoryId, type, amount, description, date]
  );
  return result.rows[0];
}

export async function deleteTransaction(transactionId: number, userId: number) {
  const result = await pool.query(
    "DELETE FROM transactions WHERE id = $1 AND user_id = $2 RETURNING id",
    [transactionId, userId]
  );
  return result.rowCount! > 0;
}

// ─── Balance & Summary Queries ───────────────────────────────

export async function getBalance(userId: number) {
  const result = await pool.query(
    `SELECT
       COALESCE(SUM(CASE WHEN type = 'credit' THEN amount ELSE 0 END), 0) as total_credits,
       COALESCE(SUM(CASE WHEN type = 'debit' THEN amount ELSE 0 END), 0) as total_debits,
       COALESCE(SUM(CASE WHEN type = 'credit' THEN amount ELSE -amount END), 0) as balance
     FROM transactions WHERE user_id = $1`,
    [userId]
  );
  return result.rows[0];
}

export async function getMonthlySummary(userId: number, year: number, month: number) {
  const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
  const endDate =
    month === 12
      ? `${year + 1}-01-01`
      : `${year}-${String(month + 1).padStart(2, "0")}-01`;

  const result = await pool.query(
    `SELECT
       COALESCE(SUM(CASE WHEN type = 'credit' THEN amount ELSE 0 END), 0) as total_income,
       COALESCE(SUM(CASE WHEN type = 'debit' THEN amount ELSE 0 END), 0) as total_expenses,
       COALESCE(SUM(CASE WHEN type = 'credit' THEN amount ELSE -amount END), 0) as net
     FROM transactions
     WHERE user_id = $1 AND date >= $2 AND date < $3`,
    [userId, startDate, endDate]
  );
  return result.rows[0];
}

export async function getCategoryBreakdown(userId: number, year: number, month: number) {
  const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
  const endDate =
    month === 12
      ? `${year + 1}-01-01`
      : `${year}-${String(month + 1).padStart(2, "0")}-01`;

  const result = await pool.query(
    `SELECT c.id, c.name, c.icon, c.type as category_type,
            SUM(t.amount) as total,
            COUNT(t.id) as transaction_count
     FROM transactions t
     JOIN categories c ON t.category_id = c.id
     WHERE t.user_id = $1 AND t.date >= $2 AND t.date < $3
     GROUP BY c.id, c.name, c.icon, c.type
     ORDER BY total DESC`,
    [userId, startDate, endDate]
  );
  return result.rows;
}

export async function getDailySpending(userId: number, year: number, month: number) {
  const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
  const endDate =
    month === 12
      ? `${year + 1}-01-01`
      : `${year}-${String(month + 1).padStart(2, "0")}-01`;

  const result = await pool.query(
    `SELECT date, type,
            SUM(amount) as total
     FROM transactions
     WHERE user_id = $1 AND date >= $2 AND date < $3
     GROUP BY date, type
     ORDER BY date`,
    [userId, startDate, endDate]
  );
  return result.rows;
}

export async function getMonthlyTrend(userId: number, months: number = 6) {
  const result = await pool.query(
    `SELECT
       DATE_TRUNC('month', date) as month,
       COALESCE(SUM(CASE WHEN type = 'credit' THEN amount ELSE 0 END), 0) as income,
       COALESCE(SUM(CASE WHEN type = 'debit' THEN amount ELSE 0 END), 0) as expenses
     FROM transactions
     WHERE user_id = $1 AND date >= (CURRENT_DATE - ($2 || ' months')::INTERVAL)
     GROUP BY DATE_TRUNC('month', date)
     ORDER BY month`,
    [userId, months]
  );
  return result.rows;
}

export async function getRecentTransactions(userId: number, limit: number = 5) {
  const result = await pool.query(
    `SELECT t.id, t.type, t.amount, t.description, t.date,
            c.name as category_name, c.icon as category_icon
     FROM transactions t
     LEFT JOIN categories c ON t.category_id = c.id
     WHERE t.user_id = $1
     ORDER BY t.date DESC, t.created_at DESC
     LIMIT $2`,
    [userId, limit]
  );
  return result.rows;
}

// ─── Budget Queries ──────────────────────────────────────────

export async function getBudgets(userId: number, year: number, month: number) {
  const monthDate = `${year}-${String(month).padStart(2, "0")}-01`;

  const result = await pool.query(
    `SELECT b.id, b.amount as budget_amount, b.month,
            c.id as category_id, c.name as category_name, c.icon as category_icon,
            COALESCE(
              (SELECT SUM(t.amount) FROM transactions t
               WHERE t.category_id = b.category_id
                 AND t.user_id = b.user_id
                 AND t.type = 'debit'
                 AND t.date >= b.month
                 AND t.date < (b.month + INTERVAL '1 month')
              ), 0
            ) as spent
     FROM budgets b
     JOIN categories c ON b.category_id = c.id
     WHERE b.user_id = $1 AND b.month = $2
     ORDER BY c.name`,
    [userId, monthDate]
  );
  return result.rows;
}

export async function setBudget(
  userId: number,
  categoryId: number,
  year: number,
  month: number,
  amount: number
) {
  const monthDate = `${year}-${String(month).padStart(2, "0")}-01`;

  const result = await pool.query(
    `INSERT INTO budgets (user_id, category_id, month, amount)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (user_id, category_id, month)
     DO UPDATE SET amount = EXCLUDED.amount
     RETURNING id, amount, month`,
    [userId, categoryId, monthDate, amount]
  );
  return result.rows[0];
}

export async function deleteBudget(budgetId: number, userId: number) {
  const result = await pool.query(
    "DELETE FROM budgets WHERE id = $1 AND user_id = $2 RETURNING id",
    [budgetId, userId]
  );
  return result.rowCount! > 0;
}
