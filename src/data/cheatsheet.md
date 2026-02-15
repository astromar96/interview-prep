# Senior Software Engineer Interview Cheat Sheet
### JavaScript / TypeScript Focus

---

## 1. Data Structures & Algorithms

### Big-O Complexity Table

| Data Structure | Access | Search | Insert | Delete | Space |
|---|---|---|---|---|---|
| Array | O(1) | O(n) | O(n) | O(n) | O(n) |
| Stack | O(n) | O(n) | O(1) | O(1) | O(n) |
| Queue | O(n) | O(n) | O(1) | O(1) | O(n) |
| Singly Linked List | O(n) | O(n) | O(1) | O(1) | O(n) |
| Hash Table (Map) | N/A | O(1) avg | O(1) avg | O(1) avg | O(n) |
| BST (balanced) | O(log n) | O(log n) | O(log n) | O(log n) | O(n) |
| BST (worst) | O(n) | O(n) | O(n) | O(n) | O(n) |
| Min/Max Heap | O(1) peek | O(n) | O(log n) | O(log n) | O(n) |
| Trie | N/A | O(k) | O(k) | O(k) | O(n*k) |

*k = length of key/word*

### JS Array Method Complexities

| Method | Time | Notes |
|---|---|---|
| `push()` / `pop()` | O(1) | End of array |
| `shift()` / `unshift()` | O(n) | Reindexes all elements |
| `splice()` | O(n) | Shifts elements |
| `slice()` | O(n) | Creates shallow copy |
| `indexOf()` / `includes()` | O(n) | Linear scan |
| `map()` / `filter()` / `reduce()` | O(n) | Iterates entire array |
| `sort()` | O(n log n) | TimSort in V8 |
| `Set.has()` / `Map.get()` | O(1) avg | Hash-based lookup |

### `Map` vs `Object`

```ts
// Object — keys are always strings/symbols
const obj = { name: "Alice", 1: "one" }; // key 1 becomes "1"

// Map — keys can be ANY type, maintains insertion order
const map = new Map<object, string>();
const key = { id: 1 };
map.set(key, "value");
map.get(key); // "value"
map.size;      // 1 (O(1) — Object needs Object.keys().length)

// Use Map when: frequent add/delete, non-string keys, need size, need iteration order
// Use Object when: simple string keys, JSON serialization, destructuring
```

### Core Data Structures in JS

```ts
// --- Stack (LIFO) ---
const stack: number[] = [];
stack.push(1);      // [1]
stack.push(2);      // [1, 2]
stack.pop();        // 2 → [1]

// --- Queue (FIFO) ---
const queue: number[] = [];
queue.push(1);      // [1]
queue.push(2);      // [1, 2]
queue.shift();      // 1 → [2]  ⚠️ O(n) — for perf-critical code, use linked list

// --- Set ---
const set = new Set([1, 2, 3, 3]);
set.has(2);    // true — O(1)
set.add(4);
set.delete(1);
[...set];      // [2, 3, 4]

// --- Linked List ---
class ListNode<T> {
  constructor(public val: T, public next: ListNode<T> | null = null) {}
}

// --- Binary Tree ---
class TreeNode<T> {
  constructor(
    public val: T,
    public left: TreeNode<T> | null = null,
    public right: TreeNode<T> | null = null
  ) {}
}

// --- Min Heap (Priority Queue) ---
// JS has no built-in heap. Common interview pattern:
class MinHeap {
  private heap: number[] = [];

  push(val: number) {
    this.heap.push(val);
    this.bubbleUp(this.heap.length - 1);
  }

  pop(): number | undefined {
    if (this.heap.length === 0) return undefined;
    const min = this.heap[0];
    const last = this.heap.pop()!;
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.sinkDown(0);
    }
    return min;
  }

  private bubbleUp(i: number) {
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (this.heap[parent] <= this.heap[i]) break;
      [this.heap[parent], this.heap[i]] = [this.heap[i], this.heap[parent]];
      i = parent;
    }
  }

  private sinkDown(i: number) {
    const n = this.heap.length;
    while (true) {
      let smallest = i;
      const left = 2 * i + 1, right = 2 * i + 2;
      if (left < n && this.heap[left] < this.heap[smallest]) smallest = left;
      if (right < n && this.heap[right] < this.heap[smallest]) smallest = right;
      if (smallest === i) break;
      [this.heap[smallest], this.heap[i]] = [this.heap[i], this.heap[smallest]];
      i = smallest;
    }
  }
}
```

### Graph Representations

```ts
// Adjacency List (most common for interviews)
const graph: Map<string, string[]> = new Map();
graph.set("A", ["B", "C"]);
graph.set("B", ["A", "D"]);

// BFS — shortest path in unweighted graph
function bfs(graph: Map<string, string[]>, start: string): string[] {
  const visited = new Set<string>([start]);
  const queue = [start];
  const result: string[] = [];

  while (queue.length > 0) {
    const node = queue.shift()!;
    result.push(node);
    for (const neighbor of graph.get(node) ?? []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  return result;
}

// DFS — explore as deep as possible first
function dfs(graph: Map<string, string[]>, start: string): string[] {
  const visited = new Set<string>();
  const result: string[] = [];

  function traverse(node: string) {
    visited.add(node);
    result.push(node);
    for (const neighbor of graph.get(node) ?? []) {
      if (!visited.has(neighbor)) traverse(neighbor);
    }
  }

  traverse(start);
  return result;
}
```

### Sorting Algorithms

| Algorithm | Best | Average | Worst | Space | Stable |
|---|---|---|---|---|---|
| Quick Sort | O(n log n) | O(n log n) | O(n²) | O(log n) | No |
| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) | Yes |
| Heap Sort | O(n log n) | O(n log n) | O(n log n) | O(1) | No |
| Tim Sort (JS default) | O(n) | O(n log n) | O(n log n) | O(n) | Yes |

```ts
// Merge Sort — stable, predictable O(n log n)
function mergeSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}

function merge(left: number[], right: number[]): number[] {
  const result: number[] = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) result.push(left[i++]);
    else result.push(right[j++]);
  }
  return [...result, ...left.slice(i), ...right.slice(j)];
}

// Quick Sort — in-place, generally fastest in practice
function quickSort(arr: number[], lo = 0, hi = arr.length - 1): number[] {
  if (lo < hi) {
    const pivot = partition(arr, lo, hi);
    quickSort(arr, lo, pivot - 1);
    quickSort(arr, pivot + 1, hi);
  }
  return arr;
}

function partition(arr: number[], lo: number, hi: number): number {
  const pivot = arr[hi];
  let i = lo;
  for (let j = lo; j < hi; j++) {
    if (arr[j] < pivot) {
      [arr[i], arr[j]] = [arr[j], arr[i]];
      i++;
    }
  }
  [arr[i], arr[hi]] = [arr[hi], arr[i]];
  return i;
}
```

### Key Algorithm Patterns

```ts
// 1. TWO POINTERS — sorted arrays, palindromes
function twoSum(nums: number[], target: number): [number, number] {
  let left = 0, right = nums.length - 1; // array must be sorted
  while (left < right) {
    const sum = nums[left] + nums[right];
    if (sum === target) return [left, right];
    if (sum < target) left++;
    else right--;
  }
  return [-1, -1];
}

// 2. SLIDING WINDOW — subarrays, substrings
function maxSubarraySum(nums: number[], k: number): number {
  let windowSum = nums.slice(0, k).reduce((a, b) => a + b, 0);
  let maxSum = windowSum;
  for (let i = k; i < nums.length; i++) {
    windowSum += nums[i] - nums[i - k];
    maxSum = Math.max(maxSum, windowSum);
  }
  return maxSum;
}

// 3. BINARY SEARCH — sorted data, search space reduction
function binarySearch(nums: number[], target: number): number {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}

// 4. DYNAMIC PROGRAMMING — overlapping subproblems
// Example: Fibonacci with memoization
function fib(n: number, memo: Map<number, number> = new Map()): number {
  if (n <= 1) return n;
  if (memo.has(n)) return memo.get(n)!;
  const result = fib(n - 1, memo) + fib(n - 2, memo);
  memo.set(n, result);
  return result;
}

// DP tabulation (bottom-up)
function fibTab(n: number): number {
  if (n <= 1) return n;
  let prev2 = 0, prev1 = 1;
  for (let i = 2; i <= n; i++) {
    const curr = prev1 + prev2;
    prev2 = prev1;
    prev1 = curr;
  }
  return prev1;
}

// 5. BACKTRACKING — permutations, combinations, constraint satisfaction
function permutations(nums: number[]): number[][] {
  const result: number[][] = [];

  function backtrack(path: number[], remaining: number[]) {
    if (remaining.length === 0) {
      result.push([...path]);
      return;
    }
    for (let i = 0; i < remaining.length; i++) {
      path.push(remaining[i]);
      backtrack(path, [...remaining.slice(0, i), ...remaining.slice(i + 1)]);
      path.pop(); // undo choice
    }
  }

  backtrack([], nums);
  return result;
}
```

---

## 2. System Design

### Framework (Use This Structure)

```
1. REQUIREMENTS (5 min)
   - Functional: What does the system do? Core use cases
   - Non-functional: Scale, latency, availability, consistency
   - Constraints: Read-heavy vs write-heavy? Peak QPS?

2. ESTIMATION (3 min)
   - Users, QPS, storage, bandwidth
   - Rule of thumb: 1M users × 10 req/day = ~115 QPS

3. HIGH-LEVEL DESIGN (10 min)
   - Draw main components: clients, API, services, databases, caches
   - Define API endpoints

4. DEEP DIVE (15 min)
   - Database schema, indexing strategy
   - Caching layer, partitioning
   - Handle edge cases

5. BOTTLENECKS & TRADE-OFFS (5 min)
   - Single points of failure, scaling limits
   - What would you change at 10× or 100× scale?
```

### Key Concepts

**Scaling**
- **Vertical**: Bigger machine (limited ceiling)
- **Horizontal**: More machines (need load balancing, distributed state)

**Load Balancing**
- Round-robin, least connections, IP hash, weighted
- L4 (TCP level) vs L7 (HTTP level — can route by URL/header)
- Tools: Nginx, HAProxy, AWS ALB/NLB

**Caching**
- **Where**: Client → CDN → API Gateway → App Server → Database
- **Strategies**:
  - *Cache-aside*: App checks cache, misses go to DB, app writes to cache
  - *Write-through*: Write to cache + DB simultaneously
  - *Write-behind*: Write to cache, async flush to DB (risk of data loss)
- **Eviction**: LRU (most common), LFU, TTL
- **Tools**: Redis, Memcached

**Databases**
- **SQL** (PostgreSQL, MySQL): ACID, joins, complex queries, strong consistency
- **NoSQL**: Flexible schema, horizontal scaling, eventual consistency
  - Document: MongoDB (JSON-like, nested data)
  - Key-Value: Redis (caching, sessions)
  - Wide-Column: Cassandra (time series, high write throughput)
  - Graph: Neo4j (relationships, social networks)

**CAP Theorem**
- **C**onsistency, **A**vailability, **P**artition tolerance — pick 2 (in practice: CP or AP)
- CP: Banking (consistency over availability)
- AP: Social media feeds (availability over consistency)

**Message Queues**
- Decouple producers/consumers, handle bursts, enable async processing
- Tools: RabbitMQ, Apache Kafka, AWS SQS
- Kafka: Distributed log, high throughput, ordering within partitions

**Database Scaling**
- **Read replicas**: Route reads to replicas, writes to primary
- **Sharding**: Distribute data across DBs by key (user ID, geography)
  - Challenge: Cross-shard queries, rebalancing
- **Partitioning**: Range-based, hash-based, directory-based

**Consistent Hashing**
- Distribute keys across nodes; only K/n keys move when a node joins/leaves
- Used in: Redis Cluster, Cassandra, CDNs

**Rate Limiting**
- Algorithms: Token Bucket, Sliding Window, Fixed Window
- Apply at: API Gateway, application level, per-user/per-IP

### Common System Design Problems — Quick Notes

| System | Key Components |
|---|---|
| URL Shortener | Hash/Base62 encoding, KV store, read-heavy cache, analytics |
| Chat App | WebSockets, message queue, fanout, presence service |
| News Feed | Fanout-on-write vs fanout-on-read, ranking service, cache |
| Rate Limiter | Token bucket / sliding window, Redis counters, middleware |
| Notification System | Queue per channel (push/SMS/email), retry logic, templates |

### API Design Quick Reference

```
REST Principles:
- Resources as nouns: /users, /users/:id/orders
- HTTP verbs: GET (read), POST (create), PUT (replace), PATCH (update), DELETE
- Idempotent: GET, PUT, DELETE (safe to retry)
- Non-idempotent: POST (creates new resource each time)
- Status codes: 200 OK, 201 Created, 204 No Content, 400 Bad Request,
                401 Unauthorized, 403 Forbidden, 404 Not Found, 429 Too Many Requests,
                500 Internal Server Error

Pagination:
- Offset-based: ?page=2&limit=20 (simple but slow for deep pages)
- Cursor-based: ?cursor=abc123&limit=20 (better for real-time data)
```

---

## 3. OOP & Design Patterns

### SOLID Principles

```ts
// S — Single Responsibility: One class, one reason to change
// BAD: UserService handles auth + email + database
// GOOD:
class AuthService { login(user: User) { /* ... */ } }
class EmailService { sendWelcome(user: User) { /* ... */ } }
class UserRepository { save(user: User) { /* ... */ } }

// O — Open/Closed: Open for extension, closed for modification
// BAD: Adding new shapes requires modifying existing function
// GOOD: Use polymorphism
interface Shape { area(): number; }
class Circle implements Shape { constructor(private r: number) {} area() { return Math.PI * this.r ** 2; } }
class Rectangle implements Shape { constructor(private w: number, private h: number) {} area() { return this.w * this.h; } }
function totalArea(shapes: Shape[]): number { return shapes.reduce((sum, s) => sum + s.area(), 0); }

// L — Liskov Substitution: Subtypes must be substitutable for their base types
// BAD: Square extends Rectangle but breaks setWidth/setHeight expectations
// GOOD: Use separate classes or a common Shape interface

// I — Interface Segregation: Many specific interfaces > one fat interface
// BAD:
interface Worker { work(): void; eat(): void; sleep(): void; }
// GOOD:
interface Workable { work(): void; }
interface Feedable { eat(): void; }

// D — Dependency Inversion: Depend on abstractions, not concretions
// BAD: class OrderService { private repo = new MySQLRepo(); }
// GOOD:
interface OrderRepo { findById(id: string): Order; }
class OrderService { constructor(private repo: OrderRepo) {} }
```

### Design Patterns

```ts
// --- SINGLETON --- (one instance globally)
class Database {
  private static instance: Database;
  private constructor() {} // prevent direct construction
  static getInstance(): Database {
    if (!Database.instance) Database.instance = new Database();
    return Database.instance;
  }
}

// --- FACTORY --- (create objects without specifying exact class)
interface Notification { send(message: string): void; }
class EmailNotif implements Notification { send(msg: string) { /* email */ } }
class SMSNotif implements Notification { send(msg: string) { /* sms */ } }
class PushNotif implements Notification { send(msg: string) { /* push */ } }

function createNotification(type: "email" | "sms" | "push"): Notification {
  switch (type) {
    case "email": return new EmailNotif();
    case "sms":   return new SMSNotif();
    case "push":  return new PushNotif();
  }
}

// --- OBSERVER --- (pub/sub, event-driven)
class EventEmitter {
  private listeners = new Map<string, Function[]>();

  on(event: string, fn: Function) {
    if (!this.listeners.has(event)) this.listeners.set(event, []);
    this.listeners.get(event)!.push(fn);
  }

  emit(event: string, ...args: any[]) {
    for (const fn of this.listeners.get(event) ?? []) fn(...args);
  }
}
// Node.js has this built-in: import { EventEmitter } from 'events';

// --- STRATEGY --- (swap algorithms at runtime)
interface SortStrategy { sort(data: number[]): number[]; }
class QuickSortStrategy implements SortStrategy {
  sort(data: number[]) { return [...data].sort((a, b) => a - b); }
}
class BubbleSortStrategy implements SortStrategy {
  sort(data: number[]) { /* bubble sort implementation */ return data; }
}
class Sorter {
  constructor(private strategy: SortStrategy) {}
  setStrategy(s: SortStrategy) { this.strategy = s; }
  sort(data: number[]) { return this.strategy.sort(data); }
}

// --- DECORATOR --- (add behavior without modifying original)
interface Logger { log(message: string): void; }
class ConsoleLogger implements Logger {
  log(message: string) { console.log(message); }
}
class TimestampLogger implements Logger {
  constructor(private inner: Logger) {}
  log(message: string) { this.inner.log(`[${new Date().toISOString()}] ${message}`); }
}
// Usage: const logger = new TimestampLogger(new ConsoleLogger());

// --- ADAPTER --- (make incompatible interfaces work together)
interface ModernPayment { charge(amount: number, currency: string): Promise<boolean>; }
class LegacyPaymentSDK {
  processPayment(cents: number): boolean { return true; }
}
class PaymentAdapter implements ModernPayment {
  constructor(private legacy: LegacyPaymentSDK) {}
  async charge(amount: number, _currency: string) {
    return this.legacy.processPayment(amount * 100);
  }
}

// --- BUILDER --- (construct complex objects step by step)
class QueryBuilder {
  private table = "";
  private conditions: string[] = [];
  private orderField = "";

  from(table: string) { this.table = table; return this; }
  where(condition: string) { this.conditions.push(condition); return this; }
  orderBy(field: string) { this.orderField = field; return this; }

  build(): string {
    let q = `SELECT * FROM ${this.table}`;
    if (this.conditions.length) q += ` WHERE ${this.conditions.join(" AND ")}`;
    if (this.orderField) q += ` ORDER BY ${this.orderField}`;
    return q;
  }
}
// Usage: new QueryBuilder().from("users").where("age > 18").orderBy("name").build();
```

---

## 4. Databases

### SQL vs NoSQL — When to Use

| Factor | SQL (PostgreSQL, MySQL) | NoSQL (MongoDB, Redis, Cassandra) |
|---|---|---|
| Data structure | Structured, relational | Flexible, nested, denormalized |
| Consistency | Strong (ACID) | Eventual (BASE) — can be tuned |
| Scaling | Vertical (read replicas help) | Horizontal (sharding built-in) |
| Queries | Complex joins, aggregations | Simple lookups, key-based |
| Schema | Fixed, enforced | Schemaless / flexible |
| Best for | Financial, e-commerce, ERP | Real-time, IoT, content mgmt, caching |

### ACID Properties

- **Atomicity**: Transaction is all-or-nothing
- **Consistency**: DB moves from one valid state to another
- **Isolation**: Concurrent transactions don't interfere
- **Durability**: Committed data survives crashes

### Isolation Levels (least → most strict)

| Level | Dirty Read | Non-repeatable Read | Phantom Read |
|---|---|---|---|
| Read Uncommitted | Yes | Yes | Yes |
| Read Committed | No | Yes | Yes |
| Repeatable Read | No | No | Yes |
| Serializable | No | No | No |

*PostgreSQL default: Read Committed. MySQL InnoDB default: Repeatable Read.*

### Normalization

- **1NF**: Atomic values, no repeating groups
- **2NF**: 1NF + no partial dependencies (every non-key depends on whole key)
- **3NF**: 2NF + no transitive dependencies (non-key depends only on key)
- **Denormalization**: Intentionally duplicate data for read performance (common in NoSQL)

### Indexing

```sql
-- B-Tree index (default, most common) — good for: =, <, >, BETWEEN, ORDER BY
CREATE INDEX idx_users_email ON users(email);

-- Composite index — order matters! (leftmost prefix rule)
CREATE INDEX idx_users_name_age ON users(last_name, first_name, age);
-- ✅ Works for: WHERE last_name = 'Smith'
-- ✅ Works for: WHERE last_name = 'Smith' AND first_name = 'John'
-- ❌ Does NOT work for: WHERE first_name = 'John' (skips leftmost column)

-- Covering index — all query columns in index, avoids table lookup
-- Partial index (PostgreSQL) — index only matching rows
CREATE INDEX idx_active_users ON users(email) WHERE active = true;

-- Hash index — only equality (=), not range queries
-- GIN index — for full-text search, JSONB, arrays (PostgreSQL)
```

### Essential SQL Patterns

```sql
-- JOINs
SELECT u.name, o.total
FROM users u
INNER JOIN orders o ON u.id = o.user_id;         -- only matching rows
LEFT JOIN orders o ON u.id = o.user_id;           -- all users, even without orders
RIGHT JOIN orders o ON u.id = o.user_id;          -- all orders, even without users
FULL OUTER JOIN orders o ON u.id = o.user_id;     -- all from both

-- GROUP BY + HAVING
SELECT department, COUNT(*) as count, AVG(salary)
FROM employees
GROUP BY department
HAVING COUNT(*) > 5;   -- HAVING filters groups (WHERE filters rows)

-- Window Functions
SELECT name, department, salary,
  RANK() OVER (PARTITION BY department ORDER BY salary DESC) as dept_rank,
  ROW_NUMBER() OVER (ORDER BY salary DESC) as overall_rank
FROM employees;

-- Subquery vs JOIN
-- Subquery (good for existence checks):
SELECT * FROM users WHERE id IN (SELECT user_id FROM orders WHERE total > 100);
-- JOIN (generally better for performance):
SELECT DISTINCT u.* FROM users u JOIN orders o ON u.id = o.user_id WHERE o.total > 100;

-- Common Table Expression (CTE) — readable complex queries
WITH high_spenders AS (
  SELECT user_id, SUM(total) as total_spent
  FROM orders
  GROUP BY user_id
  HAVING SUM(total) > 1000
)
SELECT u.name, hs.total_spent
FROM users u JOIN high_spenders hs ON u.id = hs.user_id;
```

### Transactions & Locking

```sql
-- Transaction
BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;  -- or ROLLBACK on error

-- Optimistic locking (application level — check version before update)
UPDATE products SET stock = stock - 1, version = version + 1
WHERE id = 42 AND version = 7;  -- fails if someone else updated

-- Pessimistic locking
SELECT * FROM products WHERE id = 42 FOR UPDATE;  -- locks row until transaction ends
```

---

## 5. Operating Systems

### Processes vs Threads

| Concept | Process | Thread |
|---|---|---|
| Memory | Own address space | Shared with other threads |
| Communication | IPC (pipes, sockets, shared memory) | Shared memory (direct) |
| Overhead | High (context switch, memory) | Lower |
| Crash isolation | Process crash doesn't affect others | Thread crash can kill process |

### Node.js Concurrency Model

```
Node.js is SINGLE-THREADED for JavaScript execution
but uses libuv thread pool (default 4 threads) for I/O operations

┌──────────────────────────────────────┐
│           Call Stack                  │  ← Executes JS synchronously
├──────────────────────────────────────┤
│         Event Loop                   │  ← Checks queues, dispatches callbacks
├──────────────┬───────────────────────┤
│ Microtask Q  │  Macrotask Queue      │
│ (Promises,   │  (setTimeout,         │
│  queueMicro  │   setInterval,        │
│  task)       │   I/O callbacks)      │
└──────────────┴───────────────────────┘
```

### Event Loop Phases (Node.js)

```
   ┌───────────────────────────┐
┌─>│        timers              │  ← setTimeout, setInterval callbacks
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     pending callbacks      │  ← I/O callbacks deferred to next loop
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │       idle, prepare        │  ← internal use
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │          poll              │  ← retrieve new I/O events (most I/O happens here)
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │          check             │  ← setImmediate callbacks
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │      close callbacks       │  ← socket.on('close', ...)
│  └─────────────┬─────────────┘
└─────────────────┘

BETWEEN EACH PHASE: All microtasks (Promises, queueMicrotask) run to completion
```

### Execution Order Example

```ts
console.log("1 - sync");

setTimeout(() => console.log("2 - setTimeout"), 0);

Promise.resolve().then(() => console.log("3 - promise microtask"));

queueMicrotask(() => console.log("4 - queueMicrotask"));

setImmediate(() => console.log("5 - setImmediate"));

process.nextTick(() => console.log("6 - nextTick"));

console.log("7 - sync");

// Output:
// 1 - sync
// 7 - sync
// 6 - nextTick        (nextTick queue — runs before all other microtasks)
// 3 - promise microtask (microtask queue)
// 4 - queueMicrotask   (microtask queue)
// 2 - setTimeout        (timers phase)
// 5 - setImmediate      (check phase)
```

### Memory Management in V8

```
Stack Memory                    Heap Memory
├── Primitive values            ├── Objects
├── Function call frames        ├── Arrays
├── References (pointers        ├── Functions
│   to heap objects)            ├── Closures
└── Fixed size, fast            └── Dynamic, garbage collected

Garbage Collection (V8):
- Minor GC (Scavenge): Young generation, fast, frequent
- Major GC (Mark-Sweep-Compact): Old generation, slower, less frequent
- Generational hypothesis: Most objects die young
```

### Worker Threads (Node.js)

```ts
// Use for CPU-intensive work (parsing, compression, crypto)
import { Worker, isMainThread, parentPort, workerData } from 'worker_threads';

if (isMainThread) {
  const worker = new Worker(__filename, { workerData: { num: 42 } });
  worker.on('message', (result) => console.log('Result:', result));
  worker.on('error', (err) => console.error(err));
} else {
  // Inside worker thread
  const result = heavyComputation(workerData.num);
  parentPort!.postMessage(result);
}
```

### Concurrency Concepts

- **Race condition**: Multiple threads/processes access shared resource, outcome depends on timing
- **Deadlock**: Two+ processes each waiting for a resource held by the other
  - Prevention: Lock ordering, timeouts, avoid holding multiple locks
- **Mutex** (mutual exclusion): Only one thread can hold the lock at a time
- **Semaphore**: Allows N threads to access a resource concurrently
- **In Node.js**: Race conditions still happen with async code (not threads)

```ts
// Async race condition in Node.js
let balance = 100;

async function withdraw(amount: number) {
  const current = balance;          // Read
  await someAsyncOperation();       // Another withdrawal could happen here!
  balance = current - amount;       // Write (stale value)
}

// Fix: Use a mutex/lock
class AsyncMutex {
  private locked = false;
  private waitQueue: (() => void)[] = [];

  async acquire(): Promise<void> {
    if (!this.locked) {
      this.locked = true;
      return;
    }
    return new Promise(resolve => this.waitQueue.push(resolve));
  }

  release() {
    if (this.waitQueue.length > 0) {
      this.waitQueue.shift()!();
    } else {
      this.locked = false;
    }
  }
}
```

---

## 6. JavaScript / TypeScript Core

### Closures

```ts
// A closure is a function that remembers its outer scope even after the outer function returns
function createCounter() {
  let count = 0; // enclosed variable
  return {
    increment: () => ++count,
    getCount: () => count,
  };
}
const counter = createCounter();
counter.increment(); // 1
counter.increment(); // 2
counter.getCount();  // 2 — count is "closed over"

// Classic interview gotcha:
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // prints 3, 3, 3 (var is function-scoped)
}
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // prints 0, 1, 2 (let is block-scoped)
}
```

### Scope & Hoisting

```ts
// var is hoisted (declaration only, not initialization) and function-scoped
console.log(x); // undefined (not ReferenceError)
var x = 5;

// let/const are hoisted but NOT initialized — Temporal Dead Zone (TDZ)
console.log(y); // ReferenceError: Cannot access 'y' before initialization
let y = 10;

// Function declarations are fully hoisted (body too)
greet(); // works!
function greet() { console.log("hi"); }

// Function expressions are NOT fully hoisted
hello(); // TypeError: hello is not a function
var hello = function() { console.log("hi"); };
```

### `this` Keyword — 5 Rules (in priority order)

```ts
// 1. Arrow function: inherits `this` from enclosing scope (lexical)
const obj = {
  name: "Alice",
  greet: () => console.log(this.name),      // `this` is NOT obj — it's outer scope
  greetCorrect() {
    const inner = () => console.log(this.name); // `this` IS obj
    inner();
  }
};

// 2. new binding: `this` = newly created object
function Person(name: string) { this.name = name; }
const p = new Person("Bob"); // this = {} → { name: "Bob" }

// 3. Explicit binding: call, apply, bind
function greet() { console.log(this.name); }
greet.call({ name: "Alice" });     // "Alice"
greet.apply({ name: "Bob" });      // "Bob"
const bound = greet.bind({ name: "Charlie" });
bound(); // "Charlie"

// 4. Implicit binding: object.method()
const user = { name: "Dave", greet() { console.log(this.name); } };
user.greet();          // "Dave" — this = user
const fn = user.greet;
fn();                  // undefined — this = global (lost binding!)

// 5. Default: global object (window/globalThis) or undefined in strict mode
```

### Prototypal Inheritance

```ts
// Every object has a [[Prototype]] (accessible via __proto__ or Object.getPrototypeOf)
const animal = { speak() { return "..."; } };
const dog = Object.create(animal);
dog.speak(); // "..." — found on prototype chain

// Class syntax is syntactic sugar over prototypes
class Animal {
  constructor(public name: string) {}
  speak() { return `${this.name} makes a sound`; }
}
class Dog extends Animal {
  speak() { return `${this.name} barks`; }
}
// Dog.prototype.__proto__ === Animal.prototype
```

### Promises & Async/Await

```ts
// Promise states: pending → fulfilled or rejected (settled)
const promise = new Promise<string>((resolve, reject) => {
  setTimeout(() => resolve("done"), 1000);
});

// Chaining
promise
  .then(result => result.toUpperCase())
  .then(upper => console.log(upper))
  .catch(err => console.error(err))
  .finally(() => console.log("cleanup"));

// async/await — syntactic sugar over promises
async function fetchData(): Promise<string> {
  try {
    const response = await fetch("/api/data");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Failed:", error);
    throw error; // re-throw to let caller handle
  }
}

// Promise combinators
await Promise.all([p1, p2, p3]);       // Wait for ALL — fails fast on first rejection
await Promise.allSettled([p1, p2]);     // Wait for ALL — never rejects, returns status
await Promise.race([p1, p2]);          // First to settle (resolve or reject)
await Promise.any([p1, p2]);           // First to resolve (ignores rejections)
```

### TypeScript Advanced Types

```ts
// GENERICS — reusable type-safe code
function first<T>(arr: T[]): T | undefined { return arr[0]; }
first<number>([1, 2, 3]);  // number
first(["a", "b"]);         // string (inferred)

// Generic constraints
function getLength<T extends { length: number }>(item: T): number {
  return item.length;
}

// UTILITY TYPES
type User = { id: number; name: string; email: string; age: number };

Partial<User>          // All properties optional
Required<User>         // All properties required
Pick<User, "id" | "name">    // Only id and name
Omit<User, "email">         // Everything except email
Readonly<User>         // All properties readonly
Record<string, number> // { [key: string]: number }
ReturnType<typeof fn>  // Extract return type of a function
Parameters<typeof fn>  // Extract parameter types as tuple

// DISCRIMINATED UNIONS — pattern for type-safe branching
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "rectangle"; width: number; height: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle": return Math.PI * shape.radius ** 2;
    case "rectangle": return shape.width * shape.height;
    // TypeScript knows which properties are available in each branch
  }
}

// TYPE NARROWING
function process(value: string | number | null) {
  if (value === null) return;         // null eliminated
  if (typeof value === "string") {
    value.toUpperCase();              // TypeScript knows it's string
  } else {
    value.toFixed(2);                 // TypeScript knows it's number
  }
}

// TYPE GUARDS
function isUser(obj: any): obj is User {
  return obj && typeof obj.id === "number" && typeof obj.name === "string";
}

// CONDITIONAL TYPES
type IsString<T> = T extends string ? "yes" : "no";
type A = IsString<string>;  // "yes"
type B = IsString<number>;  // "no"

// INFER — extract types within conditional types
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
type X = UnwrapPromise<Promise<string>>;  // string

// MAPPED TYPES
type Optional<T> = { [K in keyof T]?: T[K] };
type Nullable<T> = { [K in keyof T]: T[K] | null };
```

### ES6+ Key Features

```ts
// Destructuring
const { name, age = 25 } = user;             // object
const [first, ...rest] = [1, 2, 3, 4];       // array (first=1, rest=[2,3,4])

// Optional chaining & nullish coalescing
const city = user?.address?.city;              // undefined if any is null/undefined
const port = config.port ?? 3000;              // 3000 only if port is null/undefined
// ?? vs ||: || treats 0, "", false as falsy. ?? only treats null/undefined

// Spread
const merged = { ...defaults, ...overrides }; // later wins
const newArr = [...arr1, ...arr2];

// Template literals
const msg = `Hello ${name}, you are ${age} years old`;
// Tagged templates
function sql(strings: TemplateStringsArray, ...values: any[]) { /* safe SQL */ }

// Symbol — unique, immutable identifier
const id = Symbol("id");
const obj = { [id]: 123 }; // not enumerable by for...in or Object.keys

// Proxy — intercept object operations
const handler = {
  get(target: any, prop: string) {
    console.log(`Accessing ${prop}`);
    return target[prop];
  },
  set(target: any, prop: string, value: any) {
    console.log(`Setting ${prop} = ${value}`);
    target[prop] = value;
    return true;
  }
};
const proxy = new Proxy({}, handler);

// WeakMap / WeakRef — keys are weakly held, GC can collect them
const cache = new WeakMap<object, string>(); // great for metadata on objects

// Iterators & Generators
function* range(start: number, end: number) {
  for (let i = start; i <= end; i++) yield i;
}
for (const n of range(1, 5)) console.log(n); // 1, 2, 3, 4, 5

// Async generators
async function* fetchPages(url: string) {
  let page = 1;
  while (true) {
    const data = await fetch(`${url}?page=${page}`);
    const json = await data.json();
    if (json.length === 0) return;
    yield json;
    page++;
  }
}
```

---

## 7. Networking & Web Fundamentals

### HTTP Methods & Status Codes

```
Methods:
GET     — Read (idempotent, cacheable)
POST    — Create (not idempotent)
PUT     — Replace entire resource (idempotent)
PATCH   — Partial update (not always idempotent)
DELETE  — Remove (idempotent)
HEAD    — Like GET but no body (check existence)
OPTIONS — CORS preflight, supported methods

Key Status Codes:
2xx Success:    200 OK, 201 Created, 204 No Content
3xx Redirect:   301 Moved Permanently, 302 Found, 304 Not Modified
4xx Client:     400 Bad Request, 401 Unauthorized, 403 Forbidden,
                404 Not Found, 409 Conflict, 422 Unprocessable, 429 Rate Limited
5xx Server:     500 Internal Error, 502 Bad Gateway, 503 Service Unavailable
```

### CORS (Cross-Origin Resource Sharing)

```
Browser enforces Same-Origin Policy (protocol + host + port must match)

Simple requests (GET, POST with simple headers): sent directly with Origin header
Preflight requests (PUT, DELETE, custom headers): browser sends OPTIONS first

Server responds with:
Access-Control-Allow-Origin: https://example.com  (or *)
Access-Control-Allow-Methods: GET, POST, PUT
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Max-Age: 86400  (cache preflight for 24h)
```

### TCP vs UDP

| TCP | UDP |
|---|---|
| Connection-oriented (3-way handshake) | Connectionless |
| Reliable, ordered delivery | No guarantee of order or delivery |
| Flow control, congestion control | No flow control |
| HTTP, HTTPS, FTP, SSH | DNS, video streaming, gaming, VoIP |

### TLS Handshake (simplified)

```
1. Client Hello → supported cipher suites, TLS version
2. Server Hello → chosen cipher, server certificate (public key)
3. Client verifies certificate (CA chain)
4. Key exchange → both derive shared session key
5. Encrypted communication begins
```

### WebSockets vs SSE vs Long Polling

| Feature | WebSocket | SSE | Long Polling |
|---|---|---|---|
| Direction | Full-duplex | Server → Client only | Simulated bidirectional |
| Protocol | ws:// or wss:// | HTTP | HTTP |
| Connection | Persistent | Persistent | Reconnects each time |
| Use case | Chat, gaming, real-time collab | Notifications, feeds | Legacy compatibility |
| Auto-reconnect | No (manual) | Yes (built-in) | Yes (by design) |

```ts
// WebSocket (client)
const ws = new WebSocket("wss://example.com/ws");
ws.onopen = () => ws.send("hello");
ws.onmessage = (event) => console.log(event.data);
ws.onclose = () => console.log("disconnected");

// Server-Sent Events (client)
const sse = new EventSource("/api/events");
sse.onmessage = (event) => console.log(event.data);
sse.onerror = () => sse.close();
```

### Authentication

```
SESSION-BASED:
1. User logs in → server creates session, stores in DB/Redis
2. Server sends session ID in cookie (HttpOnly, Secure, SameSite)
3. Browser sends cookie with every request
4. Server validates session ID
Pros: Simple, easy to revoke
Cons: Server-side state, harder to scale

JWT (JSON Web Token):
1. User logs in → server creates JWT (header.payload.signature)
2. Client stores JWT (localStorage or HttpOnly cookie)
3. Client sends JWT in Authorization: Bearer <token>
4. Server verifies signature (stateless)
Pros: Stateless, scalable, works across services
Cons: Can't revoke easily (use short expiry + refresh tokens)

OAuth 2.0 Flows:
- Authorization Code: Server apps (most secure, uses redirect)
- PKCE: SPAs/mobile (code challenge prevents interception)
- Client Credentials: Machine-to-machine (no user involved)

JWT Structure:
Header: { "alg": "HS256", "typ": "JWT" }
Payload: { "sub": "user123", "exp": 1700000000, "role": "admin" }
Signature: HMAC-SHA256(base64(header) + "." + base64(payload), secret)
```

### DNS Resolution

```
Browser cache → OS cache → Router cache → ISP DNS → Root DNS → TLD DNS → Authoritative DNS
                                                      (.com)     (example.com)
Returns IP address → Browser connects via TCP → TLS handshake → HTTP request
```

---

## 8. Senior-Level Interview Tips

### How to Talk About System Design

- **Always discuss trade-offs**: "We could use X which gives us Y but at the cost of Z"
- **Start simple, then optimize**: Don't jump to a distributed system for 100 users
- **Numbers matter**: Know rough estimates (1 day ≈ 100K seconds, 1 MB/s ≈ 86 GB/day)
- **Be explicit about assumptions**: "I'm assuming we're read-heavy at a 10:1 ratio"

### How to Discuss Past Projects

- Use the **STAR** format: Situation → Task → Action → Result
- Focus on YOUR contribution, not the team's
- Quantify impact: "Reduced latency by 40%" > "Made it faster"
- Mention what you'd do differently

### Red Flags to Avoid

- Over-engineering / premature optimization
- Not asking clarifying questions
- Jumping to code without discussing approach
- Being rigid about "the one right answer"
- Not considering edge cases or failure modes

### Questions to Ask Back

- "What does the tech stack look like?"
- "What's the team's approach to testing and code review?"
- "What does a typical day/sprint look like?"
- "What's the biggest technical challenge the team is facing?"
- "How are architectural decisions made?"

---

## Quick Reference — Complexity Cheat Sheet

```
O(1)        — Hash lookup, array access by index
O(log n)    — Binary search, balanced BST operations
O(n)        — Linear scan, single loop
O(n log n)  — Efficient sorting (merge, quick, heap)
O(n²)       — Nested loops, bubble sort, insertion sort (worst)
O(2ⁿ)       — Recursive fibonacci (naive), power set
O(n!)       — Permutations, brute force TSP

Space complexity matters too!
- Recursive DFS: O(h) stack space (h = tree height)
- BFS: O(w) queue space (w = max width of tree)
- Merge sort: O(n) extra space
- Quick sort: O(log n) stack space (in-place)
```

---

*Good luck with your interview! Review each section, understand the WHY behind each concept, and practice explaining them out loud.*
