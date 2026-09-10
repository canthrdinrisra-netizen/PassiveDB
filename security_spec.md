# Security Specification & Threat Model for PassiveDB

## 1. Data Invariants
- A user document `/users/{userId}` can only be read and written by that authenticated user (`request.auth.uid == userId`).
- A transaction `/users/{userId}/transactions/{transactionId}` strictly belongs to the authenticated user.
- Transaction `userId` field must match `request.auth.uid`.
- Transaction `type` must be either `'income'` or `'expense'`.
- Transaction `amount` must be a positive number (> 0 and <= 1,000,000,000).
- Transaction `category` must be a non-empty string under 64 characters.
- Transaction `description` must be a string up to 200 characters.
- Transaction `date` must be a valid date string formatted as `YYYY-MM-DD`.
- Immutable fields: `userId` and `createdAt` cannot be altered upon update.
- Blanket reading or listing of another user's documents is strictly forbidden.

## 2. The "Dirty Dozen" Payloads (Attacks & Invariants to Reject)

1. **Unauthenticated Read**: Attempting to read `/users/user123` without authentication.
2. **Cross-User Snooping**: Authenticated user A reading `/users/userB/transactions`.
3. **Identity Spoofing**: User A creating a transaction under user A's path but with `userId: "userB"`.
4. **Invalid Type**: Creating a transaction with `type: "crypto_gamble"` (not `'income'` or `'expense'`).
5. **Negative Amount Injection**: Creating a transaction with `amount: -5000` to manipulate summaries.
6. **Zero Amount**: Creating a transaction with `amount: 0`.
7. **Exorbitant Amount Overflow**: Creating a transaction with `amount: 999999999999999`.
8. **Malicious Giant String (DoS)**: Creating category or description with 50KB payload.
9. **Malformed Date Pattern**: Creating transaction with date `"INVALID_DATE"`.
10. **Shadow Key Injection**: Injecting unexpected admin keys such as `isAdmin: true` into a transaction.
11. **Immutable Field Tampering**: Updating existing transaction to switch its `userId` or `createdAt`.
12. **Foreign Transaction Write**: User A attempting to delete or overwrite user B's transaction at `/users/userB/transactions/tx999`.
