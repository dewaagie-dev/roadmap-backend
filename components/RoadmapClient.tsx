"use client";

import { useState, useEffect, useCallback, useRef } from "react";

// ─── TYPES ────────────────────────────────────────────────────────────────────
interface Day {
  id: string; label: string; sub: string;
  task: string; detail: string; tags: string[];
  goal: string; exercises: string[];
}
interface Week {
  title: string; days: Day[];
  rest?: { label: string; sub: string; text: string };
  milestone?: { icon: string; title: string; desc: string };
}
interface Phase {
  id: string; num: string; color: string;
  label: string; title: string; sub: string; duration: string;
  weeks: Week[];
}

// ─── ROADMAP DATA ─────────────────────────────────────────────────────────────
const PHASES: Phase[] = [
  {
    id:"ph1", num:"01", color:"orange",
    label:"Phase One · Days 1–30", title:"Foundation & Environment Setup",
    sub:"Lock in your tools, refresh core JavaScript/Python, get comfortable with Git and the command line.",
    duration:"30 days",
    weeks:[
      {
        title:"Week 1 · Dev Environment & Git",
        days:[
          { id:"d1", label:"Day 1", sub:"Mon", task:"Set Up Your Dev Environment",
            detail:"Install VS Code, Node.js (LTS), Python 3.12, nvm, and configure terminal (zsh + Oh My Zsh).",
            tags:["setup","tools"],
            goal:"Have a fully working dev environment where you can run Node.js and Python from the terminal.",
            exercises:["Install Node.js via nvm: run `nvm install --lts` and verify with `node -v`","Install Python 3.12 and verify with `python3 --version`","Set up VS Code with extensions: ESLint, Prettier, GitLens, REST Client","Create a folder `~/dev/practice`, open it in VS Code, run Hello World in both Node and Python"]},
          { id:"d2", label:"Day 2", sub:"Tue", task:"Git & GitHub Fundamentals",
            detail:"Learn: init, clone, add, commit, push, pull, branch, merge, rebase. Make your first real repo.",
            tags:["git","github"],
            goal:"Commit and push a project to GitHub without looking at docs.",
            exercises:["Create a new GitHub repo called `git-practice`","Clone it locally, add a README.md with your goals, commit and push","Create a branch `feature/hello`, add a file, and open a pull request","Make a merge conflict intentionally and resolve it"]},
          { id:"d3", label:"Day 3", sub:"Wed", task:"Git Branching + GitHub Flow",
            detail:"Feature branches, PRs, resolving merge conflicts. Learn conventional commits.",
            tags:["git","workflow"],
            goal:"Understand GitHub Flow and write your first conventional commit message.",
            exercises:["Write 5 commits: `feat:`, `fix:`, `docs:`, `refactor:`, `chore:`","Set up `.gitignore` for a Node.js project from scratch","Practice interactive rebase: squash 3 commits with `git rebase -i HEAD~3`","Draw your branching workflow on paper"]},
          { id:"d4", label:"Day 4", sub:"Thu", task:"Command Line Mastery",
            detail:"Learn: file navigation, pipes, grep, curl, chmod, ssh basics.",
            tags:["cli","linux"],
            goal:"Navigate your filesystem and make an HTTP request — all from the terminal.",
            exercises:["Use `find . -name '*.js'` piped to `grep` to filter content","Write a bash script that creates 5 folders and 3 files in each","Use `curl` to hit the GitHub API: `curl https://api.github.com/users/yourusername`","Set up SSH key for GitHub and test with `ssh -T git@github.com`"]},
          { id:"d5", label:"Day 5", sub:"Fri", task:"JavaScript Refresher — Core Concepts",
            detail:"Review: closures, promises, async/await, event loop, destructuring, ES modules.",
            tags:["JavaScript","async"],
            goal:"Explain how the event loop works and write async code without callbacks.",
            exercises:["Write a closure that creates a private counter (increment, decrement, get)","Rewrite a callback function using Promises, then again with async/await","Implement `Promise.all`, `Promise.race`, and `Promise.allSettled` — understand the difference","Write a function using destructuring + spread to merge two user objects"]},
          { id:"d6", label:"Day 6", sub:"Sat", task:"JavaScript — OOP & Functional Patterns",
            detail:"Classes, prototypes, factory functions. Map, filter, reduce.",
            tags:["JavaScript","OOP"],
            goal:"Implement the same feature using OOP class pattern AND functional factory pattern.",
            exercises:["Build a `BankAccount` class with deposit, withdraw, balance using private fields (#)","Re-implement as a factory function (no class) — compare the two approaches","Solve using only map/filter/reduce: (a) double evens, (b) sum name lengths, (c) group by category","Write a `pipe` utility that chains functions left-to-right"]},
        ],
        rest:{ label:"Day 7", sub:"Sun", text:"🌴 Rest — review week 1, read 5 backend job descriptions on We Work Remotely. Note required skills." }
      },
      {
        title:"Week 2 · TypeScript + Node.js Intro",
        days:[
          { id:"d8", label:"Day 8", sub:"Mon", task:"TypeScript Fundamentals",
            detail:"Install TS. Learn: types, interfaces, generics, enums, type narrowing.",
            tags:["TypeScript"],
            goal:"Convert a plain JS file to TypeScript with zero `any` types.",
            exercises:["Install TypeScript + set up tsconfig.json with strict mode ON","Define interfaces for `User`, `Post`, `Comment` — use nested types and optional fields","Write a generic function `getFirst<T>(arr: T[]): T | null` and test with 3 types","Take your Day 6 BankAccount class and fully type it in TypeScript"]},
          { id:"d9", label:"Day 9", sub:"Tue", task:"TypeScript Advanced Patterns",
            detail:"Utility types (Partial, Pick, Omit), discriminated unions, type guards.",
            tags:["TypeScript","types"],
            goal:"Use at least 5 utility types meaningfully in a single file.",
            exercises:["Create `CreateUserDTO` using `Omit<User, 'id'|'createdAt'>` and `UpdateUserDTO` using `Partial<User>`","Build a discriminated union: `{status:'ok',data:T} | {status:'error',message:string}`","Write a type guard `isApiError(res): res is ApiError` and use it in a real if-block","Map through mixed types and narrow each — no casting allowed"]},
          { id:"d10", label:"Day 10", sub:"Wed", task:"Node.js Core — How It Works",
            detail:"Event loop deep dive, modules system (CommonJS vs ESM), Buffer, Streams.",
            tags:["Node.js","core"],
            goal:"Explain the Node.js event loop phases verbally without notes.",
            exercises:["Write code showing: setTimeout vs setImmediate vs process.nextTick — log and explain the order","Create a script that reads a large file using streams and counts word frequency","Convert a CommonJS module to ESM and back","Build a simple EventEmitter from scratch: `on`, `emit`, `off`"]},
          { id:"d11", label:"Day 11", sub:"Thu", task:"Node.js — HTTP Module from Scratch",
            detail:"Build a basic HTTP server using only Node's built-in http module.",
            tags:["Node.js","HTTP"],
            goal:"Build a working API with routing — no Express — just core Node.",
            exercises:["Build a server handling GET /users, POST /users, GET /users/:id using only `http`","Parse JSON request body manually (without express.json())","Add basic routing using URL parsing — no libraries","Test all endpoints using `curl` commands"]},
          { id:"d12", label:"Day 12", sub:"Fri", task:"npm Ecosystem + Package Management",
            detail:"npm vs yarn vs pnpm. package.json, scripts, semantic versioning.",
            tags:["npm","tooling"],
            goal:"Set up a project with lint, format, and test scripts that all run clean.",
            exercises:["Initialize a project with strict eslint + prettier — make them work together","Add npm scripts: `dev`, `build`, `lint`, `lint:fix`, `test` — all functional","Create a `.nvmrc` so any dev can run `nvm use` to get the right Node version","Run `npm audit` — understand each vulnerability category"]},
          { id:"d13", label:"Day 13", sub:"Sat", task:"Python Refresher — Core + Async",
            detail:"Review: comprehensions, decorators, generators, type hints, asyncio.",
            tags:["Python","async"],
            goal:"Write a decorator and a generator — explain both out loud.",
            exercises:["Write a `@timer` decorator that logs how long a function takes","Write a `@retry(n)` decorator that retries up to n times on exception","Create a generator that yields Fibonacci numbers lazily (infinite)","Build an async function using `asyncio.gather` to fetch 3 URLs concurrently"]},
        ],
        rest:{ label:"Day 14", sub:"Sun", text:"🌴 Rest — Update LinkedIn. Add TypeScript & Node.js to skills. Connect with 10 backend developers." },
        milestone:{ icon:"🏁", title:"Week 2 Checkpoint — Foundation Locked", desc:"You should have: a configured dev environment, GitHub profile with commits, solid TypeScript knowledge, and deep understanding of how Node.js works under the hood." }
      },
      {
        title:"Week 3 · Express.js + REST API Design",
        days:[
          { id:"d15", label:"Day 15", sub:"Mon", task:"Express.js Fundamentals",
            detail:"Set up Express + TypeScript project. Routes, middleware pipeline, error handling.",
            tags:["Express.js","REST"],
            goal:"Have a running Express + TypeScript server with 3 routes and proper error handling.",
            exercises:["Set up Express with TypeScript: `ts-node-dev`, `@types/express`, path aliases","Create a router for `/api/v1/users` with GET all, GET by id, POST, PUT, DELETE","Implement a global error handler that returns consistent JSON error shapes","Test every route with VS Code REST Client (.http file)"]},
          { id:"d16", label:"Day 16", sub:"Tue", task:"RESTful API Design Principles",
            detail:"HTTP verbs, status codes, resource naming, versioning (v1/v2).",
            tags:["REST","API design"],
            goal:"Design a full REST API spec for a blog system before writing any code.",
            exercises:["Design the full API spec for a blog in Markdown: resources, endpoints, methods, status codes","Identify 5 REST anti-patterns (e.g., `/getUser`) and write the correct versions","Implement API versioning: `/api/v1/` and `/api/v2/` with different response shapes","Add HTTP caching headers (ETag, Last-Modified) to a GET endpoint"]},
          { id:"d17", label:"Day 17", sub:"Wed", task:"Middleware Deep Dive",
            detail:"Write custom middleware: logger, rate limiter, input validator with zod.",
            tags:["middleware","zod"],
            goal:"Write 3 custom middleware functions from scratch — no copy-pasting.",
            exercises:["Write a request logger: method, path, status, response time in ms","Write a rate limiter using an in-memory Map (max 100 req/min per IP)","Integrate `zod` for request body validation — return 400 with field errors","Add a `requestId` middleware attaching a UUID to every request/response"]},
          { id:"d18", label:"Day 18", sub:"Thu", task:"Authentication — JWT from Scratch",
            detail:"Implement JWT auth: register, login, protected routes, refresh tokens.",
            tags:["auth","JWT"],
            goal:"Build a complete auth system: register → login → access protected route → refresh token.",
            exercises:["Implement `POST /auth/register` with bcrypt password hashing","Implement `POST /auth/login` returning `accessToken` (15min) + `refreshToken` (7d)","Create a `requireAuth` middleware that validates the JWT","Implement `POST /auth/refresh` issuing a new access token from a valid refresh token"]},
          { id:"d19", label:"Day 19", sub:"Fri", task:"API Testing with Jest + Supertest",
            detail:"Write unit tests and integration tests. Aim for 80%+ coverage.",
            tags:["testing","Jest"],
            goal:"Get 80%+ test coverage on your auth routes with all tests passing.",
            exercises:["Write unit tests for your bcrypt utility and JWT sign/verify functions","Write integration tests for all 4 auth endpoints — cover happy + error paths","Mock the database layer so tests don't need a real DB connection","Run `jest --coverage` — find untested lines and add tests for them"]},
          { id:"d20", label:"Day 20", sub:"Sat", task:"API Documentation with Swagger/OpenAPI",
            detail:"Document your API with swagger-ui-express. Write proper request/response schemas.",
            tags:["docs","Swagger"],
            goal:"Have live, browsable Swagger docs at /api/docs for your entire API.",
            exercises:["Set up `swagger-ui-express` + `swagger-jsdoc` in Express","Write OpenAPI annotations for all auth endpoints","Define reusable schemas for `User`, `ApiError`, `AuthTokens` in components","Test your API exclusively through Swagger UI — it should work 100%"]},
        ],
        rest:{ label:"Day 21", sub:"Sun", text:"🌴 Rest — Push everything to GitHub. Read 'You Don't Know JS' Chapter 1–2 (free online)." }
      },
      {
        title:"Week 4 · Python FastAPI + Consolidation",
        days:[
          { id:"d22", label:"Day 22", sub:"Mon", task:"Python FastAPI — Setup & Routing",
            detail:"Set up FastAPI project, create routes, Pydantic models, auto-docs at /docs.",
            tags:["Python","FastAPI"],
            goal:"Have a running FastAPI server with auto-generated docs at /docs and /redoc.",
            exercises:["Set up FastAPI: `pip install fastapi uvicorn pydantic` + folder structure","Create Pydantic models for `UserCreate`, `UserResponse`, `UserUpdate`","Build CRUD routes for `/users` — notice how Pydantic auto-validates inputs","Add path params, query params, and request body to different endpoints"]},
          { id:"d23", label:"Day 23", sub:"Tue", task:"FastAPI — Dependency Injection & Auth",
            detail:"Dependency injection system, OAuth2 password flow, JWT.",
            tags:["FastAPI","auth"],
            goal:"Protect at least 3 routes with JWT auth using FastAPI's dependency system.",
            exercises:["Create a `get_db` dependency that yields a DB session and closes after each request","Implement OAuth2PasswordBearer: `/token` endpoint returns a JWT","Create a `get_current_user` dependency that decodes the JWT","Apply auth dependency to protected routes using `Depends(get_current_user)`"]},
          { id:"d24", label:"Day 24", sub:"Wed", task:"Error Handling & Logging Best Practices",
            detail:"Structured error responses, custom error classes, structured logging.",
            tags:["logging","errors"],
            goal:"Every error returns a consistent JSON shape with code, message, and details.",
            exercises:["Create `AppError` class hierarchy: `NotFoundError`, `ValidationError`, `UnauthorizedError`","Register a global exception handler mapping errors to HTTP responses","Set up Pino (Node) or Python `logging` with structured JSON output","Add a correlation ID to every log line so you can trace a full request"]},
          { id:"d25", label:"Day 25", sub:"Thu", task:"Environment Variables & Config Management",
            detail:"dotenv, config validation with zod/pydantic-settings, secrets patterns.",
            tags:["config","security"],
            goal:"Your app crashes at startup (not runtime) if any required env var is missing.",
            exercises:["Move all hardcoded values to `.env` — no magic strings in code","Validate all env vars at startup using zod (Node) or pydantic-settings (Python)","Create `.env.example` with all keys but no values — commit this, never `.env`","Write a `config.ts` module exporting typed config — never import `process.env` directly"]},
          { id:"d26", label:"Day 26", sub:"Fri", task:"Code Review Practice",
            detail:"Review open-source Node.js/Python projects. Comment on 3 real PRs.",
            tags:["open source","review"],
            goal:"Leave 3 thoughtful code review comments on real open-source PRs today.",
            exercises:["Find a Node.js or Python project with open PRs labeled 'good first review'","Review 3 PRs: check for error handling, security issues, naming, test coverage","Read one codebase for 1hr — write down 5 patterns you want to steal","Fork a small project, improve one thing, and open a PR"]},
          { id:"d27", label:"Day 27", sub:"Sat", task:"LeetCode Easy Streak Begins",
            detail:"Solve 3 Easy problems: arrays, strings, hashmaps. Start the daily habit.",
            tags:["DSA","LeetCode"],
            goal:"Solve 3 Easy LeetCode problems and explain your approach in plain English.",
            exercises:["Solve: Two Sum (#1) — use a hashmap, not brute force O(n²)","Solve: Valid Parentheses (#20) — use a stack","Solve: Best Time to Buy and Sell Stock (#121) — one-pass O(n)","For each: write time complexity, space complexity, and one edge case in comments"]},
        ],
        rest:{ label:"Day 28–30", sub:"Review", text:"🎯 Phase 1 Review — Rebuild your Express API from memory without notes. Fix any weak spots." }
      }
    ]
  },
  {
    id:"ph2", num:"02", color:"green",
    label:"Phase Two · Days 31–75", title:"Core Backend Engineering",
    sub:"Databases, caching, queues, Docker, and real system design. This is where junior becomes mid-level.",
    duration:"45 days",
    weeks:[
      {
        title:"Week 5–6 · Databases Deep Dive",
        days:[
          { id:"d31", label:"Day 31", sub:"Mon", task:"PostgreSQL Fundamentals",
            detail:"Install Postgres. CREATE, SELECT, JOIN types, GROUP BY, aggregations, indexes.",
            tags:["PostgreSQL","SQL"],
            goal:"Write a schema for a blog and query it with JOINs across 3 tables.",
            exercises:["Install PostgreSQL locally and connect via psql. Create a `blogdb`","Create tables: `users`, `posts`, `comments`, `tags`, `post_tags` with foreign keys","Write queries: get all posts with author name + comment count using JOINs","Add indexes on `posts.user_id` and `comments.post_id` — explain why with EXPLAIN ANALYZE"]},
          { id:"d32", label:"Day 32", sub:"Tue", task:"Advanced SQL — Window Functions & CTEs",
            detail:"ROW_NUMBER, RANK, LAG/LEAD, CTEs, recursive queries.",
            tags:["SQL","advanced"],
            goal:"Write a query using at least one window function and one CTE — no subqueries.",
            exercises:["Use ROW_NUMBER() to rank posts by view count within each category","Use LAG() to calculate the difference in comments between consecutive posts","Write a CTE to find users with more than 5 posts with at least 2 comments each","Write a recursive CTE to traverse a category tree (parent/child)"]},
          { id:"d33", label:"Day 33", sub:"Wed", task:"Prisma ORM with TypeScript",
            detail:"Set up Prisma, define schema, run migrations, CRUD operations.",
            tags:["Prisma","ORM"],
            goal:"Migrate your blog schema to Prisma and perform all CRUD using the Prisma client.",
            exercises:["Init Prisma: `npx prisma init`, define blog schema in `schema.prisma`","Run `prisma migrate dev` — inspect what SQL it generates","Use Prisma client to: create a user, create a post, find posts with pagination","Write a complex Prisma query with `include`, `where`, `orderBy`, and `take/skip`"]},
          { id:"d34", label:"Day 34", sub:"Thu", task:"Database Transactions & ACID",
            detail:"Transactions, rollback, ACID properties, deadlocks, isolation levels.",
            tags:["transactions","ACID"],
            goal:"Write a transaction that creates user + post atomically — handle rollback on error.",
            exercises:["Write a Prisma transaction creating a user AND their default profile — fail one, see rollback","Simulate a race condition: two requests buy the last item — implement optimistic locking","Research and explain the 4 isolation levels — when would you use SERIALIZABLE?","Write a query that could deadlock — then rewrite it to avoid the deadlock"]},
          { id:"d35", label:"Day 35", sub:"Fri", task:"Redis — Caching & Session Storage",
            detail:"Install Redis. SET/GET, TTL, pub/sub, sorted sets. Implement API response caching.",
            tags:["Redis","caching"],
            goal:"Cache an API response in Redis — the second request should be 10x faster.",
            exercises:["Connect Redis to Express using `ioredis`. Implement a `cache(key, ttl, fn)` utility","Cache the `GET /posts` response for 60s — measure speed with `console.time`","Implement Redis-based JWT revocation list (logged-out tokens)","Use Redis sorted sets for a leaderboard: add scores, get top 10, get rank of a user"]},
          { id:"d36", label:"Day 36", sub:"Sat", task:"MongoDB Basics (NoSQL)",
            detail:"Documents, collections, CRUD, aggregation pipeline, indexing.",
            tags:["MongoDB","NoSQL"],
            goal:"Know exactly when you'd choose MongoDB over PostgreSQL — argue both sides.",
            exercises:["Set up MongoDB + Mongoose. Model a product catalog (nested variants, flexible attrs)","Write aggregation pipelines: group by category, average price, filter by stock","Add a text index and run a full-text search query","Write 300 words: when to use NoSQL vs SQL — with real examples"]},
        ],
        rest:{ label:"Day 37", sub:"Sun", text:"🌴 Rest — Write a dev.to post: 'SQL vs NoSQL: When to Use Each.' 500 words. Publish it." }
      },
      {
        title:"Week 7–8 · Docker, Cloud & DevOps",
        days:[
          { id:"d38", label:"Day 38", sub:"Mon", task:"Docker Fundamentals",
            detail:"Images, containers, Dockerfile, .dockerignore, docker run/build/push.",
            tags:["Docker","containers"],
            goal:"Containerize your Express API — runs identically on any machine.",
            exercises:["Write a multi-stage Dockerfile (build stage + slim production stage)","Add `.dockerignore` — verify node_modules isn't copied","Build the image, run it, and hit your API endpoints from your browser","Push to Docker Hub — pull and run to verify it works"]},
          { id:"d39", label:"Day 39", sub:"Tue", task:"Docker Compose — Multi-Container Apps",
            detail:"Run Node.js API + PostgreSQL + Redis together with docker-compose.yml.",
            tags:["Docker Compose"],
            goal:"Run your entire local dev stack with one `docker-compose up` command.",
            exercises:["Write `docker-compose.yml` with 3 services: `api`, `postgres`, `redis`","Add health checks so the API waits for postgres to be ready","Mount a volume so database data persists between restarts","Add a `pgadmin` service for visual DB management"]},
          { id:"d40", label:"Day 40", sub:"Wed", task:"AWS Core Services — EC2, S3, RDS",
            detail:"Create free-tier account. Launch EC2, upload to S3, set up RDS PostgreSQL.",
            tags:["AWS","cloud"],
            goal:"Have all 3 AWS services running and connected to your project.",
            exercises:["Launch a t2.micro EC2 (Ubuntu) — SSH into it, install Node.js","Create an S3 bucket, upload a file via AWS CLI, make it public, access via URL","Create an RDS PostgreSQL instance (free tier) — connect from your local machine","Set up IAM roles: EC2 should access S3 without hardcoded credentials"]},
          { id:"d41", label:"Day 41", sub:"Thu", task:"Deploy API to AWS (EC2 + Nginx)",
            detail:"SSH into EC2, set up Nginx as reverse proxy, PM2, SSL with Let's Encrypt.",
            tags:["deployment","Nginx"],
            goal:"Your API is live on a public URL with HTTPS — share the link with someone.",
            exercises:["Deploy your Node.js API to EC2 using Git pull + `pm2 start`","Configure Nginx as reverse proxy: port 80 → port 3000","Get a free domain or use your EC2 public IP","Get SSL cert with Let's Encrypt (Certbot) — API serves HTTPS"]},
          { id:"d42", label:"Day 42", sub:"Fri", task:"CI/CD with GitHub Actions",
            detail:"Automated testing on every PR, auto-deploy to EC2 on merge to main.",
            tags:["CI/CD","GitHub Actions"],
            goal:"Push a commit, watch it automatically test and deploy — without touching the server.",
            exercises:["Write GitHub Actions workflow: on push to main → run lint + tests","Add deploy job: SSH into EC2, pull latest, restart PM2 — only on green tests","Add a status badge to your README showing CI passing","Simulate a failing test — verify pipeline stops and doesn't deploy broken code"]},
          { id:"d43", label:"Day 43", sub:"Sat", task:"Message Queues — BullMQ",
            detail:"Background jobs, job queues, retry logic, delayed jobs with BullMQ.",
            tags:["queues","BullMQ"],
            goal:"Move a slow operation (email sending) to a background queue — API stays fast.",
            exercises:["Set up BullMQ with your existing Redis. Create an `emailQueue`","When a user registers, push a 'welcome email' job to the queue instead of inline","Create a worker that processes email jobs — log what it would send","Test retry: make the job fail 2 times then succeed — verify BullMQ retries"]},
        ],
        rest:{ label:"Day 44", sub:"Sun", text:"🌴 Rest — Set up job alerts on WeWorkRemotely + RemoteOK for 'Node.js backend' and 'Python API'." },
        milestone:{ icon:"🚀", title:"Day 45 Checkpoint — You Can Deploy", desc:"You now have a live API with database, Docker, and CI/CD. This puts you ahead of most junior devs applying to remote jobs." }
      },
      {
        title:"Week 9–10 · System Design & Algorithms",
        days:[
          { id:"d45", label:"Day 45", sub:"Mon", task:"System Design — Scalability Concepts",
            detail:"Vertical vs horizontal scaling, load balancers, stateless services, CDNs, sharding.",
            tags:["system design","scale"],
            goal:"Design a scalable architecture for a 1M user app — draw and explain every component.",
            exercises:["Read 'System Design Primer' on GitHub — focus on CAP theorem, consistency patterns","Design a URL shortener: estimate traffic, choose DB, design schema, draw diagram","Explain: CDN vs cache vs database? Write 200 words with examples","Identify 3 bottlenecks in your current API and propose solutions"]},
          { id:"d46", label:"Day 46", sub:"Tue", task:"WebSockets & Real-Time with Socket.io",
            detail:"Implement a real-time notification system or live chat API.",
            tags:["WebSockets","real-time"],
            goal:"Build a working real-time feature — events appear without page refresh.",
            exercises:["Add Socket.io to Express. Build a simple real-time chat room","Emit a `notification` event to a specific user when someone comments","Handle reconnection logic: client auto-reconnects if server restarts","Scale consideration: how would this work with 2 servers? Research Redis pub/sub adapter"]},
          { id:"d47", label:"Day 47", sub:"Wed", task:"API Security Best Practices",
            detail:"OWASP Top 10, rate limiting, helmet.js, SQL injection prevention.",
            tags:["security","OWASP"],
            goal:"Run a security audit on your API and fix at least 5 real issues.",
            exercises:["Add `helmet.js` — check what HTTP headers it sets and why","Test your API for SQL injection with `sqlmap` (your own app only)","Implement rate limiting: 100 req/min, return 429 with Retry-After header","Review OWASP API Security Top 10 — identify which apply to your project"]},
          { id:"d48", label:"Day 48", sub:"Thu", task:"GraphQL Fundamentals",
            detail:"Schema, resolvers, queries, mutations, subscriptions with Apollo Server.",
            tags:["GraphQL","Apollo"],
            goal:"Build a GraphQL API for your blog — queries, mutations, and one subscription.",
            exercises:["Set up Apollo Server + Express. Define schema for Post and User","Write resolvers for: `posts` query, `createPost` mutation, `post` by ID","Add a `postAdded` subscription — test it in Apollo Studio","Implement DataLoader to solve the N+1 problem on the `author` field"]},
          { id:"d49", label:"Day 49", sub:"Fri", task:"Microservices Patterns (Conceptual)",
            detail:"Service boundaries, API gateway, inter-service communication, monolith vs micro.",
            tags:["microservices","architecture"],
            goal:"Draw a microservices architecture for your current monolith — identify where to split first.",
            exercises:["Take your monolith — identify which parts could be independent services","Research: event-driven architecture with Kafka vs synchronous REST","Write 500 words: 'When NOT to use microservices' — 3 real examples","Implement a simple API gateway in Express proxying to two mock services"]},
          { id:"d50", label:"Day 50–55", sub:"",task:"LeetCode Medium Sprint (5 days, 2/day)",
            detail:"Two Pointers, Binary Search, Sliding Window, HashMaps, Stacks.",
            tags:["DSA","algorithms"],
            goal:"Solve 10 Medium problems — review wrong answers within 24 hours.",
            exercises:["Day 50: 3Sum (#15) + Container With Most Water (#11) — Two Pointers","Day 51: Search in Rotated Sorted Array (#33) + Find Min in Rotated Array (#153) — Binary Search","Day 52: Longest Substring Without Repeating (#3) + Min Window Substring (#76) — Sliding Window","Day 53–55: Group Anagrams (#49), Top K Frequent (#347), Min Stack (#155), Decode String (#394)"]},
        ]
      },
      {
        title:"Week 11–12 · Advanced Backend Topics",
        days:[
          { id:"d56", label:"Day 56", sub:"Mon", task:"gRPC & Protocol Buffers",
            detail:"Define .proto schemas, generate TypeScript stubs, build a gRPC server and call it from a client.",
            tags:["gRPC","Protocol Buffers"],
            goal:"Have a working gRPC server with 2 RPCs — callable from a Node.js client and grpcurl.",
            exercises:["Install `@grpc/grpc-js` and `@grpc/proto-loader`. Define `user.proto` with GetUser (unary) and ListUsers (server-stream) RPCs","Generate TypeScript types from the .proto file using `ts-proto`","Implement the server: GetUser returns a mock user by ID, ListUsers streams 5 users back","Write a client that calls both RPCs and logs results — verify with `grpcurl` as a second client"]},
          { id:"d57", label:"Day 57", sub:"Tue", task:"Event-Driven Architecture with Kafka",
            detail:"Run Kafka in Docker. Produce and consume messages. Understand topics, partitions, and consumer groups.",
            tags:["Kafka","event-driven"],
            goal:"Produce 10 messages to a Kafka topic and consume them from two separate consumer groups — each group receives all 10.",
            exercises:["Run Kafka + Zookeeper with Docker Compose — verify with `kafka-topics.sh --list`","Write a Node.js producer (using `kafkajs`) that publishes `user.registered` events with a JSON payload","Write two consumers in separate consumer groups — verify each gets the full message stream","Design an event schema for your blog API: which user actions emit events, what fields does each event carry?"]},
          { id:"d58", label:"Day 58", sub:"Wed", task:"Observability — Metrics, Logs & Traces",
            detail:"Add structured logging with Pino, a Prometheus /metrics endpoint, and distributed tracing with OpenTelemetry.",
            tags:["observability","OpenTelemetry","Prometheus"],
            goal:"Your API emits structured JSON logs, exposes /metrics, and traces every request end-to-end to the DB query.",
            exercises:["Set up Pino in Express — every request logs: method, path, status code, duration ms, and requestId","Add `prom-client`: expose GET /metrics with a request counter, response-time histogram, and active-connections gauge","Add OpenTelemetry auto-instrumentation — trace HTTP requests through Express into Prisma DB calls","Run Prometheus + Grafana in Docker Compose — build a dashboard showing request rate and p95 latency"]},
          { id:"d59", label:"Day 59", sub:"Thu", task:"Database Performance & Query Optimization",
            detail:"EXPLAIN ANALYZE, composite indexes, N+1 elimination, connection pooling with PgBouncer.",
            tags:["PostgreSQL","performance","indexing"],
            goal:"Identify and fix 3 slow queries using EXPLAIN ANALYZE — measure the before/after cost difference.",
            exercises:["Run EXPLAIN ANALYZE on 5 existing queries — read the cost nodes and identify seq scans","Find an N+1 pattern in your Prisma code and fix it with `include` or a raw join","Add composite indexes on your two most-queried column pairs — re-run EXPLAIN and compare","Set up PgBouncer in Docker — understand transaction vs session pooling and when each applies"]},
          { id:"d60", label:"Day 60", sub:"Fri", task:"Serverless with AWS Lambda",
            detail:"Deploy a Node.js function to Lambda via API Gateway. Handle cold starts, env vars, and layers.",
            tags:["serverless","AWS Lambda","API Gateway"],
            goal:"A Lambda function responds to HTTP requests via API Gateway — live URL works from your browser.",
            exercises:["Write a Lambda handler for GET /hello and POST /echo — test locally with AWS SAM CLI (`sam local start-api`)","Deploy via AWS Console: 256 MB memory, 10s timeout, env vars set — use the built-in test tool to verify","Wire up API Gateway: create GET and POST routes pointing to your Lambda function","Measure cold start vs warm invocation latency 10 times each — record and explain the difference"]},
          { id:"d61", label:"Day 61", sub:"Sat", task:"TypeScript Advanced Patterns for Backend",
            detail:"Decorators, dependency injection with tsyringe, conditional types, template literal types.",
            tags:["TypeScript","dependency injection"],
            goal:"Refactor one service class to constructor injection — swap the DB implementation without changing the service.",
            exercises:["Set up `tsyringe` DI container — inject a `UserRepository` interface into `UserService` via constructor","Write a `@ValidateBody(schema)` method decorator that runs zod validation before the handler executes","Build `DeepPartial<T>`, `Flatten<T>`, and `RouteParams<'/users/:id'>` using mapped and conditional types","Swap `PrismaUserRepository` for an `InMemoryUserRepository` in tests — zero changes inside `UserService`"]},
        ],
        rest:{ label:"Day 62", sub:"Sun", text:"🌴 Rest — Write a short Twitter/X thread: '5 backend architecture patterns I learned this week.' Real examples only." }
      },
      {
        title:"Week 13–14 · Phase 2 Capstone — URL Shortener",
        days:[
          { id:"d63", label:"Day 63", sub:"Mon", task:"Plan the Phase 2 Capstone Project",
            detail:"Spec, schema, and skeleton for a URL shortener with auth, custom slugs, Redis caching, and click analytics.",
            tags:["planning","system design","architecture"],
            goal:"Written spec, DB schema, API design, and running skeleton repo — before a single feature line of code.",
            exercises:["Write SPEC.md: endpoints (POST /links, GET /:slug, GET /links, DELETE /links/:id), data models, auth approach","Design Prisma schema: User, Link (slug, originalUrl, userId, clicks, expiresAt), Click (linkId, ip, ua, createdAt)","Estimate 1K links/day + 50K redirects/day — design the Redis caching strategy to handle redirect traffic","Set up skeleton: Express + TypeScript + Prisma + Redis + Docker Compose — CI green from commit 1"]},
          { id:"d64", label:"Day 64–68", sub:"", task:"Build the URL Shortener — Full Feature Implementation",
            detail:"Auth, link CRUD, redirect with Redis cache, async click tracking via BullMQ, analytics endpoint.",
            tags:["Node.js","Redis","PostgreSQL","BullMQ"],
            goal:"A fully working URL shortener — create a link, visit the short URL, see analytics update.",
            exercises:["Day 64: Auth (register/login/refresh) + POST /links — generate slug, store in Postgres, cache in Redis with 24h TTL","Day 65: GET /:slug → Redis lookup → DB fallback → 301 redirect + async click tracking job (BullMQ)","Day 66: GET /links (cursor-paginated, user's own links) + DELETE /links/:id (invalidate Redis key)","Day 67–68: GET /links/:id/analytics — clicks over time + top referrers. Integration tests for all routes (80%+ coverage) + Swagger docs"]},
          { id:"d69", label:"Day 69", sub:"Thu", task:"Deploy & Monitor the Capstone",
            detail:"Deploy to Railway with Postgres and Redis addons. GitHub Actions CI/CD. UptimeRobot monitoring.",
            tags:["deployment","Railway","CI/CD","monitoring"],
            goal:"Live URL in the README, auto-deploys on merge to main, and uptime monitoring is active.",
            exercises:["Deploy to Railway: connect GitHub repo, attach Postgres + Redis addons, set all env vars","Write GitHub Actions: lint → test → deploy to Railway only on green tests merging to main","Set up UptimeRobot to ping GET /health every 5 minutes — alert via email on downtime","Write README: live demo link, architecture diagram, tech stack badges, and local setup guide"]},
          { id:"d70", label:"Day 70", sub:"Fri", task:"Load Testing with k6",
            detail:"Simulate real traffic against your URL shortener. Find the bottleneck. Optimize and re-test.",
            tags:["performance","k6","load testing"],
            goal:"Run a 500-VU load test, identify the first bottleneck, fix it, and show measurable p95 improvement.",
            exercises:["Install k6. Write a script: 100 VUs hitting GET /:slug for 60s — assert p95 < 200ms","Ramp to 500 VUs over 2 minutes — watch error rate and p95 latency — find where it breaks","If Redis isn't caching slug lookups, add it now — re-run and compare throughput and latency","Tune Prisma connection pool size and PgBouncer — document your findings in a `LOAD_TEST.md`"]},
          { id:"d71", label:"Day 71–74", sub:"", task:"LeetCode — Trees, Graphs & Dynamic Programming",
            detail:"Intro to Hard-adjacent problems: binary trees, graph traversal, and bottom-up dynamic programming.",
            tags:["DSA","algorithms","LeetCode"],
            goal:"Solve 6 problems across trees, graphs, and DP — understand the pattern well enough to explain it.",
            exercises:["Day 71: Binary Tree Level Order Traversal (#102) + Validate BST (#98) — master BFS vs DFS on trees","Day 72: Number of Islands (#200) + Clone Graph (#133) — graph BFS and DFS with visited tracking","Day 73: Coin Change (#322) + Climbing Stairs (#70) — bottom-up DP, build the table by hand first","Day 74: Longest Common Subsequence (#1143) + Word Break (#139) — 2D DP table + memoization"]},
        ],
        rest:{ label:"Day 75", sub:"Sun", text:"🎯 Phase 2 Review — Deploy URL shortener is live. Rebuild one endpoint from memory. Fix any weak spots before Phase 3." },
        milestone:{ icon:"⚡", title:"Day 75 Checkpoint — Advanced Backend Locked", desc:"You now understand gRPC, Kafka, observability, query optimization, serverless, and have a deployed capstone project with load testing results. You're ready to build production-grade projects in Phase 3." }
      }
    ]
  },
  {
    id:"ph3", num:"03", color:"blue",
    label:"Phase Three · Days 76–120", title:"Build 2 Production-Grade Projects",
    sub:"Stop learning, start building. Two polished backend projects with live URLs, tests, docs, and clean code.",
    duration:"45 days",
    weeks:[
      {
        title:"Project 1 · Days 76–100 — Full API Backend (SaaS-style)",
        days:[
          { id:"d76", label:"Day 76–78", sub:"", task:"Project 1: Design & Architecture",
            detail:"Build a 'Task Management API' — multi-tenant, role-based, teams, projects, tasks.",
            tags:["Node.js","PostgreSQL","Prisma","Redis"],
            goal:"Have a written spec, DB schema, API design doc, and empty repo — before any feature code.",
            exercises:["Write `SPEC.md`: user stories, data models, API endpoints, auth flow, tech stack decisions","Design the Prisma schema: User, Team, TeamMember, Project, Task, Comment — all relations","Plan folder structure: controllers, services, repositories, middleware, utils, types","Set up the skeleton: Express + TypeScript + Prisma + Redis + Docker Compose"]},
          { id:"d79", label:"Day 79–85", sub:"", task:"Project 1: Core Feature Implementation",
            detail:"Auth (JWT + refresh), users/teams CRUD, projects, tasks with filters/pagination.",
            tags:["auth","CRUD","queues"],
            goal:"All core features working end-to-end: auth → create team → create project → create task.",
            exercises:["Day 79–80: Full auth system (register, login, refresh, logout with token blacklist)","Day 81–82: Teams CRUD + role-based access (admin vs member)","Day 83–84: Projects + Tasks CRUD with filters (status, assignee, due date) and cursor pagination","Day 85: Email notification queue (BullMQ) — task assigned, project created"]},
          { id:"d86", label:"Day 86–90", sub:"", task:"Project 1: Tests + Docs + Polish",
            detail:"Integration tests 80%+, Swagger docs, README with setup, .env.example.",
            tags:["testing","docs"],
            goal:"A stranger should clone your repo, follow the README, and have it running in 5 minutes.",
            exercises:["Write integration tests for all auth routes + 3 happy-path task CRUD scenarios","Complete Swagger docs with request/response examples for every endpoint","Write README: project overview, setup guide, env vars table, API summary, tech stack badges","Run `npm audit`, fix vulnerabilities, ensure no secrets in git history"]},
          { id:"d91", label:"Day 91–95", sub:"", task:"Project 1: Deploy + CI/CD",
            detail:"Deploy to Railway/Render free tier. GitHub Actions: lint → test → deploy on merge.",
            tags:["deployment","CI/CD","Railway"],
            goal:"Every merge to main auto-deploys. The live URL is in your README.",
            exercises:["Deploy to Railway: connect GitHub repo, set env vars, attach Postgres addon","Set up GitHub Actions: on merge to main → run tests → if green → auto-deploy","Add uptime monitoring with UptimeRobot (free tier)","Set up production logging — structured JSON logs, not console.log"]},
        ],
        milestone:{ icon:"💼", title:"Day 95 — Project 1 Done & Live", desc:"Push to GitHub, link in README. Employers want: live URL + clean code + tests + docs." }
      },
      {
        title:"Project 2 · Days 100–120 — Python AI-Powered API",
        days:[
          { id:"d100", label:"Day 100–103", sub:"", task:"Project 2: Design — AI Document Summarizer",
            detail:"FastAPI service: accepts PDFs/text, calls OpenAI API, returns structured summaries.",
            tags:["Python","FastAPI","OpenAI"],
            goal:"Have a complete spec and skeleton repo — including a working `/health` endpoint.",
            exercises:["Write spec: endpoints, Pydantic models, auth approach, queue design, storage strategy","Set up FastAPI + SQLAlchemy + Alembic + Celery + Redis + Docker Compose","Design data models: User, Document, SummaryJob, SummaryResult","Test OpenAI API in a notebook — understand token limits and pricing"]},
          { id:"d104", label:"Day 104–112", sub:"", task:"Project 2: Build FastAPI + OpenAI + Celery",
            detail:"Auth, file upload, async background processing, LLM integration, usage tracking.",
            tags:["Celery","LLM","async"],
            goal:"A user can upload a PDF and get back a structured summary — processed asynchronously.",
            exercises:["Day 104–106: Auth + file upload endpoint (PDF/TXT) → stored in S3 or filesystem","Day 107–109: Celery worker extracts text, chunks it, sends to OpenAI, stores result","Day 110–111: GET /jobs/:id status endpoint (pending/processing/done/failed)","Day 112: Usage tracking — tokens per user, rate limiting per plan tier"]},
          { id:"d113", label:"Day 113–120", sub:"", task:"Project 2: Polish, Deploy & Document",
            detail:"Tests, Swagger docs, Docker, deploy to Fly.io or Railway. Case study README.",
            tags:["deployment","Docker","docs"],
            goal:"Project 2 is live with a link in your portfolio.",
            exercises:["Write pytest tests: auth, file upload, job status — mock the OpenAI API","Complete FastAPI auto-docs with examples — browse /docs and verify everything","Write README as a case study: problem → technical decisions → architecture diagram","Deploy to Fly.io: `fly launch` + set secrets + scale to single instance"]},
        ]
      }
    ]
  },
  {
    id:"ph4", num:"04", color:"plum",
    label:"Phase Four · Days 121–160", title:"Profile Build & First Applications",
    sub:"Polish every touchpoint — LinkedIn, GitHub, resume, portfolio site. Then start applying strategically.",
    duration:"40 days",
    weeks:[
      {
        title:"Days 121–160 · Profile & Applications",
        days:[
          { id:"d121", label:"Day 121–123", sub:"", task:"Build Your Portfolio Website",
            detail:"Simple site: About, Projects (with live links), Skills, Contact. Host on Vercel.",
            tags:["portfolio","branding"],
            goal:"Your portfolio is live at yourname.dev with both projects prominently featured.",
            exercises:["Build in plain HTML/CSS or Next.js — keep it clean and fast","Write a compelling 'About' section: who you are, what you build, what you're looking for","For each project: screenshot, tech stack, live demo link + GitHub, 2-sentence summary","Get PageSpeed score above 90. Add meta tags for SEO and Open Graph"]},
          { id:"d124", label:"Day 124–125", sub:"", task:"Resume Overhaul",
            detail:"ATS-optimized, 1 page, quantified achievements, 'Remote' in location.",
            tags:["resume","ATS"],
            goal:"Pass an ATS check on 3 different job descriptions using Jobscan.",
            exercises:["Headline: 'Backend Developer | Node.js · Python · PostgreSQL · AWS · Docker'","Quantify every bullet: 'Built API handling 10K req/day', 'Reduced response time 40%'","Test resume against 3 real job descriptions with Jobscan — fix keyword gaps","Get feedback from 1 developer or post anonymously on r/cscareerquestions"]},
          { id:"d126", label:"Day 126–127", sub:"", task:"LinkedIn Deep Optimization",
            detail:"Rewrite headline + about, add all projects, get 3 recommendations, Open To Work.",
            tags:["LinkedIn","networking"],
            goal:"Your LinkedIn profile appears in search for 'Backend Developer Remote'.",
            exercises:["Rewrite headline: 'Backend Developer | Node.js · Python · APIs · Open to Remote'","Write 'About' in first person — tell your story, what you build, what you want next","Add both GitHub projects to Featured section with screenshots","Message 3 past colleagues for a recommendation — give them a template"]},
          { id:"d128", label:"Day 128–135", sub:"", task:"Interview Prep — Behavioral Questions",
            detail:"Write 10 STAR-format answers. Practice out loud until fluent.",
            tags:["interview","STAR method"],
            goal:"Answer any behavioral question in under 90 seconds using STAR — no rambling.",
            exercises:["Write STAR answers for: 'Tell me about a bug you couldn't fix for days'","Write STAR answers for: 'How do you collaborate async with a remote team?'","Write STAR answers for: 'Describe a time you disagreed with a technical decision'","Record yourself on video answering 3 questions — watch back, improve clarity"]},
          { id:"d136", label:"Day 136–140", sub:"", task:"Technical Interview Practice",
            detail:"Mock interviews on Pramp.com. System design practice out loud.",
            tags:["mock interview","system design"],
            goal:"Complete 2 mock interviews on Pramp — get written feedback on both.",
            exercises:["Do 2 mock interviews on Pramp.com — one coding, one system design","Practice: URL Shortener, Notification Service, File Upload System — talk out loud","Do 3 Medium LeetCode problems on a shared Google Doc (simulate interview)","Prepare 5 sharp questions to ask interviewers about tech stack, process, growth"]},
          { id:"d141", label:"Day 141–160", sub:"", task:"Active Application Phase + Daily LeetCode",
            detail:"Apply 5 roles/week. 1 LeetCode Medium/day. Follow up after 5 business days.",
            tags:["applications","LeetCode","follow-up"],
            goal:"Send 5 tailored applications per week. Track every one in a spreadsheet.",
            exercises:["Create tracking spreadsheet: Company, Role, Applied Date, Status, Follow-up Date, Notes","Apply to 5 jobs this week — customize cover letter for each (mention their stack)","Solve 1 LeetCode Medium every morning before starting the day — build the habit","Follow up on applications older than 5 business days — one polite email"]},
        ],
        milestone:{ icon:"📬", title:"Day 140 — Start Applying (5 per week)", desc:"Apply to 5 targeted roles per week: 2 on We Work Remotely, 2 on RemoteOK, 1 on Wellfound. Customize each cover letter. Track everything in a spreadsheet." }
      }
    ]
  },
  {
    id:"ph5", num:"05", color:"gold",
    label:"Phase Five · Days 161–180", title:"Interviews, Offers & Negotiation",
    sub:"Push hard on the application pipeline. Turn interviews into offers. Set up for long-term remote success from Bali.",
    duration:"20 days",
    weeks:[
      {
        title:"Days 161–180 · Final Push",
        days:[
          { id:"d161", label:"Day 161–165", sub:"", task:"Increase Applications + Start Freelancing",
            detail:"Apply 8–10/week. Create Upwork profile — land 1–2 small contracts for social proof.",
            tags:["applications","Upwork","freelance"],
            goal:"Have an active Upwork profile with complete portfolio and first proposal sent.",
            exercises:["Increase to 8–10 applications/week — prioritize companies whose stack you know","Set up Upwork: 100% complete, hourly rate, portfolio items with project descriptions","Send 5 proposals on Upwork for small Node.js/Python tasks ($50–200 range)","Build a cover letter template bank — 5 different openers for different company types"]},
          { id:"d166", label:"Day 166–170", sub:"", task:"Take-Home Assignments — Execute Perfectly",
            detail:"When companies send take-homes: clean code + tests + README + Loom walkthrough.",
            tags:["take-home","Loom"],
            goal:"When you get a take-home, return it with 20% more polish than they expected.",
            exercises:["Practice: build a small take-home API in 3 hours — time yourself","Always submit: clean code, full test suite, Swagger docs, README, and a Loom walkthrough","In the Loom: explain architecture decisions, trade-offs, what you'd do with more time","Ask the interviewer for feedback after submitting — most will share if you ask"]},
          { id:"d171", label:"Day 171–175", sub:"", task:"Final Interview Rounds",
            detail:"Research deeply, prepare 5 questions, send thank-you email within 24hrs.",
            tags:["interview","negotiation"],
            goal:"Send a thank-you email within 2 hours of every final interview.",
            exercises:["Before each final: read the company's engineering blog, last 3 posts","Prepare 5 questions showing research: codebase, team size, tech debt, on-call","Send thank-you email within 2 hours — mention one specific thing from the conversation","If rejected: reply thanking them and ask for feedback — 20% will respond with gold"]},
          { id:"d176", label:"Day 176–178", sub:"", task:"Offer Negotiation",
            detail:"Never accept first offer. Research rates on levels.fyi. Target $25–55K USD/yr.",
            tags:["salary","negotiation"],
            goal:"Counter-offer at least once on any offer you receive.",
            exercises:["Research: levels.fyi, Glassdoor, RemoteOK salary filters — know your market rate","Practice saying: 'Thank you. Based on my research, I was expecting X. Is there flexibility?'","Negotiate beyond salary: async hours, learning budget, equipment stipend, equity","Set up Wise account for USD/EUR payments — open before you need it"]},
          { id:"d179", label:"Day 179–180", sub:"", task:"Set Up for Remote Work Success 🌴",
            detail:"Wise account, dedicated workspace in Ubud, async etiquette, internet backup.",
            tags:["Wise","remote setup","Bali ✓"],
            goal:"Your remote work infrastructure is ready before Day 1 at your new job.",
            exercises:["Open and verify your Wise account — this is how you receive international salary","Set up workspace: good lighting, external monitor, mechanical keyboard, headset","Get mobile data backup: Telkomsel (best coverage Bali) + Indosat SIM as backup","Research Indonesian tax obligations for foreign income — consult a local Konsultan Pajak"]},
        ],
        milestone:{ icon:"🎉", title:"Day 180 — You're a Remote Backend Developer", desc:"If you've followed this roadmap consistently, you have: 2 production projects, real deployments, a polished profile, interview experience, and active applications. The offer is close. Keep going." }
      }
    ]
  },
  // ─── PHASE 6 ── ADVANCED ARCHITECTURE & DISTRIBUTED SYSTEMS ─────────────────
  {
    id:"ph6", num:"06", color:"teal",
    label:"Phase Six · Days 181–225", title:"Advanced Architecture & Distributed Systems",
    sub:"Microservices in practice, event sourcing, CQRS, Kubernetes, service mesh — the skills that separate mid from senior.",
    duration:"45 days",
    weeks:[
      {
        title:"Week 27–28 · Microservices Deep Dive",
        days:[
          { id:"d181", label:"Day 181", sub:"Mon", task:"Domain-Driven Design — Strategic Patterns",
            detail:"Bounded contexts, ubiquitous language, context maps, aggregates, domain events.",
            tags:["DDD","architecture"],
            goal:"Draw a context map for a real-world e-commerce system with at least 5 bounded contexts.",
            exercises:["Read 'Domain-Driven Design Distilled' Chapters 1–3 — summarize bounded context vs subdomain","Take your Task Manager project: identify bounded contexts (auth, teams, tasks, notifications) and draw a context map","Define aggregates for each context: which entity is the root? What's the consistency boundary?","Write domain events: `TaskAssigned`, `TeamMemberAdded`, `ProjectCreated` — define their schemas"]},
          { id:"d182", label:"Day 182", sub:"Tue", task:"DDD — Tactical Patterns",
            detail:"Entities, value objects, repositories, domain services, application services.",
            tags:["DDD","patterns"],
            goal:"Refactor one service to use proper DDD tactical patterns — separate domain from infrastructure.",
            exercises:["Implement a `Money` value object with currency + amount — immutable, with add/subtract methods","Refactor `TaskService` to separate domain logic (Task entity methods) from application logic (use case orchestration)","Create a `TaskRepository` interface in domain layer — implement with Prisma in infrastructure layer","Write a domain service `TaskAssignmentService` that enforces business rules (max tasks per user, team membership check)"]},
          { id:"d183", label:"Day 183", sub:"Wed", task:"DDD — Event Storming Workshop (Solo)",
            detail:"Run an event storming session on paper for your own project. Commands, events, aggregates, policies.",
            tags:["DDD","event storming"],
            goal:"Complete an event storming board for a full order lifecycle — from 'Add to Cart' to 'Order Delivered'.",
            exercises:["Watch Alberto Brandolini's event storming talk — take notes on the process","Lay out sticky notes (or use Miro): domain events in orange, commands in blue, aggregates in yellow","Map the full order lifecycle: AddToCart → PlaceOrder → ProcessPayment → ShipOrder → DeliverOrder","Identify policies (automation rules) and read models — mark where eventual consistency is acceptable"]},
          { id:"d184", label:"Day 184", sub:"Thu", task:"Microservices Communication — Synchronous",
            detail:"REST vs gRPC between services, service discovery, API composition pattern.",
            tags:["microservices","gRPC","REST"],
            goal:"Build two microservices that communicate via gRPC — one calls the other for data enrichment.",
            exercises:["Create `user-service` (gRPC) and `order-service` (REST) — order-service calls user-service to enrich order responses","Implement service discovery with environment variables first, then research Consul/etcd patterns","Add retry logic with exponential backoff on inter-service calls — handle `UNAVAILABLE` gracefully","Measure latency: REST vs gRPC for the same payload — document results"]},
          { id:"d185", label:"Day 185", sub:"Fri", task:"Microservices Communication — Asynchronous",
            detail:"Event-driven architecture with Kafka/RabbitMQ. Publish-subscribe, fan-out, dead letter queues.",
            tags:["microservices","Kafka","async"],
            goal:"Implement async communication: order-service publishes events, notification-service and analytics-service consume them independently.",
            exercises:["Set up Kafka with Docker Compose. Create topics: `order.created`, `order.paid`, `order.shipped`","order-service publishes `OrderCreated` event with full payload when an order is placed","notification-service consumes `OrderCreated` and logs a 'welcome email' action","analytics-service in a separate consumer group also consumes — verify both receive the event independently"]},
          { id:"d186", label:"Day 186", sub:"Sat", task:"Saga Pattern for Distributed Transactions",
            detail:"Choreography vs orchestration sagas. Compensating transactions. Failure handling.",
            tags:["saga","distributed transactions"],
            goal:"Implement a choreography saga for the order flow: create order → reserve inventory → process payment — with compensating actions on failure.",
            exercises:["Design the saga: OrderService → InventoryService → PaymentService — draw the success AND failure flows","Implement choreography: each service listens for events and emits the next step","Implement compensating transactions: if payment fails, InventoryService releases the reserved stock","Test the failure scenario: force PaymentService to reject — verify inventory is restored"]},
        ],
        rest:{ label:"Day 187", sub:"Sun", text:"🌴 Rest — Read 'Building Microservices' by Sam Newman Chapter 1–3. Write 500 words on what you learned." }
      },
      {
        title:"Week 29–30 · API Gateway, Circuit Breaker & Event Sourcing",
        days:[
          { id:"d188", label:"Day 188", sub:"Mon", task:"API Gateway Pattern",
            detail:"Build an API gateway with Kong or a custom Express gateway. Rate limiting, auth, routing, aggregation.",
            tags:["API gateway","Kong"],
            goal:"Route requests through an API gateway to 3 backend services — with auth and rate limiting at the gateway level.",
            exercises:["Set up Kong (or Traefik) in Docker Compose as the single entry point for your microservices","Configure routes: `/api/users/*` → user-service, `/api/orders/*` → order-service","Add JWT validation plugin at the gateway — services trust the gateway, no per-service auth","Implement rate limiting: 100 req/min per API key — test with `k6` load testing"]},
          { id:"d189", label:"Day 189", sub:"Tue", task:"Circuit Breaker & Resilience Patterns",
            detail:"Circuit breaker (opossum), bulkhead, retry with jitter, timeout patterns.",
            tags:["resilience","circuit breaker"],
            goal:"Implement a circuit breaker that opens after 5 failures, waits 30s, then half-opens to test recovery.",
            exercises:["Install `opossum` (Node.js). Wrap your inter-service gRPC call in a circuit breaker","Configure: 5 failure threshold, 30s reset timeout, 50% health check — log state transitions","Implement bulkhead pattern: limit concurrent calls to payment-service to 10","Test: kill payment-service, watch circuit open, bring it back, watch half-open → closed recovery"]},
          { id:"d190", label:"Day 190", sub:"Wed", task:"Event Sourcing Fundamentals",
            detail:"Store events instead of state. Event store, projections, rebuilding state from events.",
            tags:["event sourcing","CQRS"],
            goal:"Build a bank account using event sourcing — all state derived from replaying events.",
            exercises:["Create an event store table: `id`, `aggregate_id`, `event_type`, `payload`, `version`, `created_at`","Implement: `AccountCreated`, `MoneyDeposited`, `MoneyWithdrawn` events — append-only","Write a `rebuildAccount(accountId)` function that replays all events to get current balance","Verify: insert 10 events, rebuild state, compare with expected balance — they must match exactly"]},
          { id:"d191", label:"Day 191", sub:"Thu", task:"CQRS — Command Query Responsibility Segregation",
            detail:"Separate write model (event store) from read model (projections). Eventual consistency.",
            tags:["CQRS","projections"],
            goal:"Build a CQRS system: commands write to event store, a separate read model is optimized for queries.",
            exercises:["Create write side: `DepositCommand` → validates → appends `MoneyDeposited` event to store","Create read side: a `balances` projection table updated by consuming events from the store","Write a projector that subscribes to new events and updates the read model in real-time","Test eventual consistency: write an event, query read model — it should update within 1 second"]},
          { id:"d192", label:"Day 192", sub:"Fri", task:"Event Sourcing — Snapshots & Versioning",
            detail:"Performance optimization with snapshots. Event schema evolution and upcasting.",
            tags:["event sourcing","snapshots"],
            goal:"Implement snapshots so rebuilding state from 1000 events takes <10ms instead of replaying all.",
            exercises:["Insert 1000 events for one account — measure rebuild time without snapshots","Implement snapshots: every 100 events, save current state — rebuild from latest snapshot + remaining events","Measure the improvement — document the before/after in a `PERFORMANCE.md`","Handle event versioning: add a `v2` of `MoneyDeposited` with a new field — write an upcaster for v1 events"]},
          { id:"d193", label:"Day 193", sub:"Sat", task:"Distributed Transactions — Outbox Pattern",
            detail:"Transactional outbox: write event to DB in same transaction as state change. Reliable messaging.",
            tags:["outbox pattern","reliability"],
            goal:"Implement the transactional outbox pattern so no event is ever lost — even if Kafka is down.",
            exercises:["Create an `outbox` table: `id`, `aggregate_type`, `event_type`, `payload`, `created_at`, `published_at`","In your order creation: INSERT order + INSERT outbox event in the SAME database transaction","Write a poller that reads unpublished outbox events, publishes to Kafka, marks as published","Test: create an order with Kafka down — verify the event is in the outbox and published when Kafka recovers"]},
        ],
        rest:{ label:"Day 194", sub:"Sun", text:"🌴 Rest — Write a dev.to post: 'Event Sourcing vs Traditional CRUD — When Each Makes Sense.' Include real code examples." },
        milestone:{ icon:"🔗", title:"Day 194 Checkpoint — Microservices Architect", desc:"You now understand DDD, microservice communication patterns, sagas, event sourcing, CQRS, and the outbox pattern. You can design and build distributed systems." }
      },
      {
        title:"Week 31–32 · Kubernetes & Cloud-Native",
        days:[
          { id:"d195", label:"Day 195", sub:"Mon", task:"Kubernetes Fundamentals — Pods & Deployments",
            detail:"Install minikube/kind. Learn pods, ReplicaSets, Deployments, Services, namespaces.",
            tags:["Kubernetes","containers"],
            goal:"Deploy your Express API to a local Kubernetes cluster with 3 replicas — access it via a Service.",
            exercises:["Install `minikube` or `kind`. Start a local cluster: `minikube start`","Write a Deployment YAML: 3 replicas of your API image, resource limits (128Mi memory, 100m CPU)","Create a Service (ClusterIP) and expose it via `minikube tunnel` or NodePort","Scale up to 5 replicas, then back to 3 — watch pods come up and terminate gracefully"]},
          { id:"d196", label:"Day 196", sub:"Tue", task:"Kubernetes — ConfigMaps, Secrets & Volumes",
            detail:"Externalize config, manage secrets, persistent volume claims for databases.",
            tags:["Kubernetes","config"],
            goal:"Your K8s deployment reads config from ConfigMaps and secrets from Secrets — no env vars in YAML.",
            exercises:["Create a ConfigMap for non-sensitive config: `NODE_ENV=production`, `LOG_LEVEL=info`","Create a Secret for `DATABASE_URL` and `JWT_SECRET` — base64 encoded, mounted as env vars","Deploy PostgreSQL with a PersistentVolumeClaim — data survives pod restarts","Verify: delete the Postgres pod, watch K8s restart it — data is still there"]},
          { id:"d197", label:"Day 197", sub:"Wed", task:"Kubernetes — Health Checks & Rolling Updates",
            detail:"Liveness, readiness, startup probes. Rolling update strategy, rollback.",
            tags:["Kubernetes","health checks"],
            goal:"Deploy a new version with zero downtime using rolling update — verify with continuous `curl` requests.",
            exercises:["Add liveness probe: `GET /health` every 10s — restarts pod if unhealthy","Add readiness probe: `GET /ready` — removes pod from Service if not ready (e.g., DB connection lost)","Deploy a new version: set `maxUnavailable: 0, maxSurge: 1` — run `curl` loop to verify zero downtime","Force a bad deployment: watch K8s stop rollout — run `kubectl rollout undo` to rollback"]},
          { id:"d198", label:"Day 198", sub:"Thu", task:"Helm Charts — Package Your Application",
            detail:"Create a Helm chart for your microservices. Templates, values, releases, chart dependencies.",
            tags:["Helm","Kubernetes"],
            goal:"Deploy your entire stack with one `helm install` command — all 3 services + databases.",
            exercises:["Create a Helm chart: `helm create my-api` — understand the generated template structure","Templatize your Deployment: `{{ .Values.replicaCount }}`, `{{ .Values.image.tag }}`","Add chart dependencies: PostgreSQL and Redis from Bitnami Helm repo","Test: `helm install dev ./chart` and `helm install staging ./chart -f values-staging.yaml` — different configs, same chart"]},
          { id:"d199", label:"Day 199", sub:"Fri", task:"Kubernetes Networking — Ingress & Service Mesh Intro",
            detail:"Ingress controllers (Nginx Ingress), path-based routing, TLS termination.",
            tags:["Kubernetes","Ingress","networking"],
            goal:"Route external traffic through an Ingress to your services — `api.local/users` and `api.local/orders`.",
            exercises:["Install Nginx Ingress Controller: `helm install ingress-nginx ingress-nginx/ingress-nginx`","Write an Ingress resource: `/api/users` → user-service, `/api/orders` → order-service","Add TLS termination with a self-signed cert — verify HTTPS works","Test path-based routing: verify each path reaches the correct backend service"]},
          { id:"d200", label:"Day 200", sub:"Sat", task:"Service Mesh — Istio Fundamentals",
            detail:"Install Istio, sidecar injection, traffic management, mTLS between services.",
            tags:["Istio","service mesh"],
            goal:"All inter-service traffic is encrypted with mTLS via Istio — zero code changes in your services.",
            exercises:["Install Istio: `istioctl install --set profile=demo` — enable sidecar injection on your namespace","Deploy your microservices — verify Envoy sidecar is injected automatically","Enable strict mTLS: all service-to-service traffic is now encrypted — verify with Kiali dashboard","Create a VirtualService for canary deployment: 90% traffic to v1, 10% to v2"]},
        ],
        rest:{ label:"Day 201", sub:"Sun", text:"🌴 Rest — Deploy your K8s manifests to a cloud provider (GKE free tier or DigitalOcean $200 credit). Write about the experience." }
      },
      {
        title:"Week 33–34 · Cloud-Native Patterns & Infrastructure as Code",
        days:[
          { id:"d202", label:"Day 202", sub:"Mon", task:"12-Factor App Deep Dive",
            detail:"Audit your services against all 12 factors. Fix violations. Implement graceful shutdown.",
            tags:["12-factor","cloud-native"],
            goal:"Your microservices pass all 12-factor app checks — document each factor with how you comply.",
            exercises:["Read the 12-factor app manifesto — write a compliance checklist for your services","Fix: ensure all config is in env vars, logs go to stdout, processes are stateless","Implement graceful shutdown: handle `SIGTERM`, finish in-flight requests, close DB connections, then exit","Test: send `SIGTERM` during a request — verify the response completes before the process exits"]},
          { id:"d203", label:"Day 203", sub:"Tue", task:"Kubernetes Operators & CRDs (Conceptual)",
            detail:"Custom Resource Definitions, controller pattern, when to build an operator vs use Helm.",
            tags:["Kubernetes","operators"],
            goal:"Understand when you need an operator vs Helm — write a decision framework.",
            exercises:["Read about the operator pattern — list 5 popular operators (cert-manager, Prometheus, Strimzi)","Install cert-manager operator — watch it automatically provision TLS certificates for your Ingress","Write a Custom Resource Definition (CRD) for a `BackendApp` that specifies image, replicas, and env vars","Research when to build a custom operator vs use Helm charts — write 300 words with examples"]},
          { id:"d204", label:"Day 204", sub:"Wed", task:"Terraform Fundamentals — Infrastructure as Code",
            detail:"HCL syntax, providers, resources, state, plan/apply cycle.",
            tags:["Terraform","IaC"],
            goal:"Provision an AWS VPC with public + private subnets using only Terraform — no console clicking.",
            exercises:["Install Terraform. Write `main.tf` with AWS provider and a VPC resource","Add: 2 public subnets, 2 private subnets, internet gateway, NAT gateway, route tables","Run `terraform plan` — read every line of the plan output and understand it","Run `terraform apply` — verify in AWS Console — then `terraform destroy` to clean up"]},
          { id:"d205", label:"Day 205", sub:"Thu", task:"Terraform — Modules & State Management",
            detail:"Create reusable modules, remote state with S3 + DynamoDB locking, workspaces.",
            tags:["Terraform","modules"],
            goal:"Refactor your infra into reusable modules with remote state — multiple envs from the same code.",
            exercises:["Create a `modules/vpc` module and a `modules/ecs` module — parameterize with variables","Set up remote state: S3 bucket for state file, DynamoDB for state locking","Create `dev` and `staging` workspaces — same modules, different variable files","Add outputs: VPC ID, subnet IDs, ECS cluster ARN — use them as inputs to other modules"]},
          { id:"d206", label:"Day 206", sub:"Fri", task:"Terraform — Provision EKS Cluster",
            detail:"Use Terraform to provision an EKS cluster on AWS. Node groups, IAM roles, kubectl config.",
            tags:["Terraform","EKS","AWS"],
            goal:"A fully provisioned EKS cluster via Terraform — deploy your Helm chart to it.",
            exercises:["Write Terraform for EKS: cluster, managed node group (t3.small × 2), IAM roles","Run `terraform apply` — wait 15 min for cluster provisioning","Configure kubectl: `aws eks update-kubeconfig --name my-cluster`","Deploy your Helm chart to EKS — verify your services are running in the cloud"]},
        ],
        rest:{ label:"Day 207", sub:"Sun", text:"🌴 Rest — Tear down your cloud resources to avoid charges. Read about GitOps and ArgoCD." }
      },
      {
        title:"Week 35–36 · Distributed Systems Theory & Observability at Scale",
        days:[
          { id:"d208", label:"Day 208", sub:"Mon", task:"CAP Theorem & Consistency Models Deep Dive",
            detail:"Strong consistency vs eventual consistency. Linearizability, causal consistency, read-your-writes.",
            tags:["CAP theorem","distributed systems"],
            goal:"Explain the trade-offs of 4 different consistency models with real-world examples — without notes.",
            exercises:["Write examples: when do you need strong consistency (bank transfers) vs eventual (social media likes)?","Implement a read-your-writes guarantee: after a user updates profile, they always see their own update","Research: how does DynamoDB handle consistency? Compare with PostgreSQL's guarantees","Draw a timeline diagram showing the difference between linearizable and eventually consistent reads"]},
          { id:"d209", label:"Day 209", sub:"Tue", task:"Consensus Algorithms — Raft",
            detail:"Leader election, log replication, safety. Understand how distributed databases achieve consensus.",
            tags:["Raft","consensus"],
            goal:"Explain the Raft algorithm well enough to whiteboard it in a system design interview.",
            exercises:["Watch the Raft visualization at raft.github.io — run through leader election and log replication scenarios","Write pseudocode for leader election: heartbeats, election timeout, vote counting","Explain: what happens when a network partition occurs? How does Raft maintain safety?","Research: which production systems use Raft? (etcd, CockroachDB, Consul) — list 5 with their use case"]},
          { id:"d210", label:"Day 210", sub:"Wed", task:"Distributed Locks & Coordination",
            detail:"Redis-based distributed locks (Redlock), ZooKeeper, leader election patterns.",
            tags:["distributed locks","Redis"],
            goal:"Implement a distributed lock with Redis that safely prevents double-processing of jobs.",
            exercises:["Implement Redlock algorithm: SET with NX + PX, add a unique lock token, release only if token matches","Use the lock to ensure only one worker processes each job in a queue — test with 3 concurrent workers","Research the Redlock controversy (Martin Kleppmann vs Antirez) — summarize both arguments in 300 words","Implement a simple leader election using Redis: one process becomes leader, others are followers"]},
          { id:"d211", label:"Day 211", sub:"Thu", task:"Distributed Caching Strategies",
            detail:"Cache-aside, write-through, write-behind, read-through. Cache invalidation patterns. Thundering herd.",
            tags:["caching","distributed systems"],
            goal:"Implement cache-aside with stampede protection — prove it works under concurrent load.",
            exercises:["Implement cache-aside pattern with Redis: check cache → miss → query DB → populate cache with TTL","Add stampede/thundering herd protection: use a lock so only one request populates cache on miss","Implement cache invalidation on write: update DB → delete cache key (not update!)","Compare write-through vs write-behind: implement both for the same feature, measure latency difference"]},
          { id:"d212", label:"Day 212", sub:"Fri", task:"Kafka Internals — Partitions, Replication & Exactly-Once",
            detail:"How Kafka achieves durability, partition strategy, consumer group rebalancing, idempotent producer.",
            tags:["Kafka","internals"],
            goal:"Configure a Kafka topic for exactly-once semantics — produce 1000 messages, consume exactly 1000.",
            exercises:["Create a topic with 6 partitions and replication factor 3 — understand why these numbers matter","Write a producer with `enable.idempotence=true` and `acks=all` — explain what each setting does","Implement a consumer with `isolation.level=read_committed` for exactly-once consumption","Simulate: kill a broker, produce messages, bring broker back — verify no data loss and no duplicates"]},
          { id:"d213", label:"Day 213", sub:"Sat", task:"Observability at Scale — Distributed Tracing",
            detail:"Jaeger/Tempo for traces, Loki for logs, Prometheus for metrics. Correlate across services.",
            tags:["observability","Jaeger","distributed tracing"],
            goal:"Trace a single request across 3 microservices — see the full call chain in Jaeger UI.",
            exercises:["Deploy Jaeger with Docker Compose. Add OpenTelemetry SDK to all 3 microservices","Propagate trace context (W3C Trace Context) across HTTP and Kafka message boundaries","Make a request that touches all 3 services — find the full trace in Jaeger UI","Set up Grafana with Tempo (traces) + Loki (logs) + Prometheus (metrics) — correlate a slow trace with its logs"]},
        ],
        rest:{ label:"Day 214–225", sub:"Practice", text:"🎯 Days 214–225: Deep practice sprint — build a mini distributed key-value store with leader election, replication, and consistency guarantees. 12 days of intense distributed systems coding." },
        milestone:{ icon:"🌐", title:"Day 225 Checkpoint — Distributed Systems Engineer", desc:"You understand DDD, microservices patterns, Kubernetes, Terraform, event sourcing, CQRS, consensus, and distributed caching. You can architect production distributed systems." }
      }
    ]
  },
  // ─── PHASE 7 ── SENIOR ENGINEERING PRACTICES ────────────────────────────────
  {
    id:"ph7", num:"07", color:"crimson",
    label:"Phase Seven · Days 226–285", title:"Senior Engineering Practices",
    sub:"System design at scale, performance engineering, security architecture, reliability — the depth that defines senior engineers.",
    duration:"60 days",
    weeks:[
      {
        title:"Week 37–38 · System Design at Scale",
        days:[
          { id:"d226", label:"Day 226", sub:"Mon", task:"Design a Social Media Feed System",
            detail:"Fan-out on write vs read, ranking algorithms, caching strategies, real-time updates.",
            tags:["system design","feed"],
            goal:"Draw a complete system architecture handling 10M users with <200ms feed load time.",
            exercises:["Design the data model: users, posts, follows, feed — estimate storage for 10M users","Compare fan-out-on-write (Twitter old) vs fan-out-on-read (pull model) — when to use each","Design the caching layer: user feed in Redis sorted sets, TTL, cache warming for active users","Add real-time updates: when a followed user posts, push to connected followers via WebSocket"]},
          { id:"d227", label:"Day 227", sub:"Tue", task:"Design a Payment Processing System",
            detail:"Idempotency, reconciliation, PCI compliance concepts, distributed transactions, retry safety.",
            tags:["system design","payments"],
            goal:"Design a payment system that never double-charges and handles network failures gracefully.",
            exercises:["Design the flow: create intent → authorize → capture → settle — draw state machine","Implement idempotency keys: same request with same key = same result, always","Design reconciliation: compare your records with payment provider daily — flag mismatches","Write 500 words on PCI DSS compliance: what you must do, what the payment provider handles"]},
          { id:"d228", label:"Day 228", sub:"Wed", task:"Design a Notification Service",
            detail:"Multi-channel (email, push, SMS), templating engine, rate limiting, priority queues, user preferences.",
            tags:["system design","notifications"],
            goal:"Design a notification system that handles 1M notifications/day across 3 channels without spam.",
            exercises:["Design the architecture: API → priority queue → channel-specific workers (email/push/SMS)","Implement user preferences: per-channel opt-in/out, quiet hours, frequency caps per notification type","Design template engine: `Welcome {{name}}` with fallback values and i18n support","Add rate limiting: max 5 emails/hour, max 20 push/day per user — queue excess for later"]},
          { id:"d229", label:"Day 229", sub:"Thu", task:"Design a Real-Time Chat System",
            detail:"WebSocket scaling, presence tracking, message ordering, read receipts, offline message queue.",
            tags:["system design","real-time","WebSocket"],
            goal:"Design a chat system supporting 100K concurrent connections with message ordering guarantees.",
            exercises:["Design WebSocket infrastructure: connection manager, pub/sub for multi-server, sticky sessions","Implement presence: track who's online using Redis with TTL — broadcast status changes","Design message ordering: use Kafka partitioned by chat room — consumers maintain per-room order","Handle offline users: queue messages, deliver on reconnect — implement read receipts with double-tick"]},
          { id:"d230", label:"Day 230", sub:"Fri", task:"Design a Search Engine",
            detail:"Inverted index, Elasticsearch, relevance scoring (TF-IDF, BM25), autocomplete, typo tolerance.",
            tags:["system design","Elasticsearch","search"],
            goal:"Build a working search API with Elasticsearch: full-text search, filters, autocomplete — <50ms response.",
            exercises:["Set up Elasticsearch with Docker. Create an index for products with proper mappings and analyzers","Implement full-text search with BM25 scoring, boosted fields (title > description), and filters","Build autocomplete using edge n-gram tokenizer — test with partial queries","Add typo tolerance with fuzzy matching — `fuzziness: 'AUTO'` — test with misspelled queries"]},
          { id:"d231", label:"Day 231", sub:"Sat", task:"System Design Interview Practice (3 hours)",
            detail:"Practice 2 full system design problems end-to-end: requirements → estimation → design → trade-offs.",
            tags:["system design","interview"],
            goal:"Complete 2 system design problems within 40 minutes each — following the structured approach.",
            exercises:["Problem 1: Design a URL shortener for 100M URLs/month — full 40-min mock interview","Problem 2: Design a web crawler that indexes 1B pages — estimate capacity, design pipeline","For each: clarify requirements → estimate scale → high-level design → deep dive on 2 components","Record yourself — review for: did you ask questions? Did you discuss trade-offs? Did you quantify?"]},
        ],
        rest:{ label:"Day 232", sub:"Sun", text:"🌴 Rest — Watch 3 system design mock interviews on YouTube (Exponent, ByteByteGo). Take notes on the interviewer's framework." }
      },
      {
        title:"Week 39–40 · Performance Engineering",
        days:[
          { id:"d233", label:"Day 233", sub:"Mon", task:"Node.js Profiling — CPU & Memory",
            detail:"Chrome DevTools profiler, flame graphs, heap snapshots, detecting memory leaks.",
            tags:["profiling","Node.js","performance"],
            goal:"Find and fix a real memory leak in a Node.js application using heap snapshots.",
            exercises:["Start your API with `--inspect` flag — connect Chrome DevTools for profiling","Record a CPU profile during load — read the flame graph, find the hottest function","Create an intentional memory leak (growing array in closure) — find it with heap snapshots","Use `clinic.js flame` for automated flame graph generation — compare with Chrome DevTools"]},
          { id:"d234", label:"Day 234", sub:"Tue", task:"Database Internals — Storage Engines",
            detail:"B-tree vs LSM-tree, WAL (Write-Ahead Log), MVCC, how PostgreSQL stores data on disk.",
            tags:["database internals","PostgreSQL"],
            goal:"Explain how PostgreSQL's MVCC works at the storage level — why VACUUM is needed.",
            exercises:["Read PostgreSQL internals: pages, tuples, CTID, xmin/xmax — draw the storage layout","Explain MVCC: how concurrent transactions see different versions of the same row","Research WAL: why write-ahead logging is essential for crash recovery — what happens without it?","Compare B-tree (PostgreSQL) vs LSM-tree (RocksDB/Cassandra): write amplification, read amplification, space amplification"]},
          { id:"d235", label:"Day 235", sub:"Wed", task:"Query Optimization Masterclass",
            detail:"EXPLAIN ANALYZE deep dive, index types (B-tree, GIN, GiST, BRIN), partial indexes, covering indexes.",
            tags:["PostgreSQL","query optimization","indexing"],
            goal:"Optimize a slow query from 500ms to <5ms using the right index strategy — document the process.",
            exercises:["Write a query that does a sequential scan on 1M rows — read EXPLAIN ANALYZE output line by line","Add a composite index — re-run EXPLAIN, verify it uses Index Scan instead of Seq Scan","Use a partial index: `CREATE INDEX idx ON orders(status) WHERE status = 'pending'` — compare size and speed","Create a covering index (INCLUDE) to avoid heap fetches — measure the improvement"]},
          { id:"d236", label:"Day 236", sub:"Thu", task:"Connection Pooling & Database Scaling",
            detail:"PgBouncer modes, connection pool sizing formula, read replicas, when to shard.",
            tags:["PgBouncer","database scaling"],
            goal:"Set up PgBouncer with optimal pool size — handle 500 concurrent connections with 20 DB connections.",
            exercises:["Deploy PgBouncer in Docker between your API and PostgreSQL — configure transaction pooling mode","Calculate optimal pool size: `connections = (cores * 2) + spindle_count` — apply to your setup","Set up a read replica — route all SELECT queries to replica, writes to primary","Research: when does sharding make sense? What are the alternatives? (read replicas, caching, query optimization)"]},
          { id:"d237", label:"Day 237", sub:"Fri", task:"Caching Architecture — Multi-Layer",
            detail:"L1 (in-process), L2 (Redis), L3 (CDN). Cache invalidation strategies at each layer.",
            tags:["caching","architecture","CDN"],
            goal:"Implement a 3-layer caching strategy — measure cache hit ratio and latency at each layer.",
            exercises:["L1: In-process cache with `node-cache` — TTL 10s, 1000 item limit — for hot data","L2: Redis — TTL 60s — for shared state across instances","L3: CDN (Cloudflare) — cache API responses with `Cache-Control` headers for public data","Implement cache invalidation: on data write → delete L1 + L2 → CDN purge API — measure consistency lag"]},
          { id:"d238", label:"Day 238", sub:"Sat", task:"Load Testing & Performance Benchmarking",
            detail:"k6 scripting, stress testing, soak testing, spike testing. Establish performance baselines.",
            tags:["k6","load testing","benchmarking"],
            goal:"Run 4 types of load tests on your API — document the breaking point and bottleneck for each.",
            exercises:["Smoke test: 5 VUs, 1 minute — verify everything works, establish baseline metrics","Load test: 100 VUs, 5 minutes — target p95 <200ms, error rate <1%","Stress test: ramp from 100 to 1000 VUs over 10 min — find where your API breaks","Soak test: 50 VUs for 30 minutes — watch for memory leaks or degradation over time"]},
        ],
        rest:{ label:"Day 239", sub:"Sun", text:"🌴 Rest — Write a `PERFORMANCE.md` for your project documenting all benchmark results, bottlenecks found, and optimizations made." }
      },
      {
        title:"Week 41–42 · Security & Reliability Engineering",
        days:[
          { id:"d240", label:"Day 240", sub:"Mon", task:"OAuth 2.0 & OpenID Connect Deep Dive",
            detail:"Authorization code flow, PKCE, scopes, token introspection, refresh token rotation.",
            tags:["OAuth 2.0","OIDC","security"],
            goal:"Implement a full OAuth 2.0 authorization code flow with PKCE — understand every step.",
            exercises:["Set up Keycloak (Docker) as your identity provider — create a realm, client, and test users","Implement authorization code flow with PKCE in your API — no client secret needed","Handle token refresh with rotation: each refresh token is single-use, issue new pair on refresh","Implement token introspection: verify tokens with the IdP instead of local JWT validation"]},
          { id:"d241", label:"Day 241", sub:"Tue", task:"RBAC vs ABAC — Access Control Architecture",
            detail:"Role-Based vs Attribute-Based Access Control. Policy engines. Casbin/OPA.",
            tags:["RBAC","ABAC","authorization"],
            goal:"Implement ABAC with a policy engine — access depends on user role + resource ownership + time of day.",
            exercises:["Implement RBAC: admin, editor, viewer roles with a role_permissions table","Graduate to ABAC: 'editors can only edit posts in their department created in the last 30 days'","Set up Casbin or Open Policy Agent (OPA) — define policies in config, not code","Test: same user, same endpoint, different results based on resource attributes — verify all cases"]},
          { id:"d242", label:"Day 242", sub:"Wed", task:"Secrets Management with HashiCorp Vault",
            detail:"Dynamic secrets, secret rotation, transit encryption, AppRole auth method.",
            tags:["Vault","secrets","security"],
            goal:"Your app fetches database credentials from Vault at startup — credentials rotate every hour.",
            exercises:["Set up Vault in Docker — initialize, unseal, enable KV secrets engine","Store your database credentials in Vault — fetch them in your app at startup using AppRole auth","Enable the database secrets engine: Vault generates temporary Postgres credentials with TTL","Implement transit encryption: encrypt sensitive data (PII) using Vault's encryption-as-a-service"]},
          { id:"d243", label:"Day 243", sub:"Thu", task:"Container Security & Supply Chain",
            detail:"Image scanning (Trivy), distroless images, Dockerfile security, SBOM, signed images.",
            tags:["container security","Trivy"],
            goal:"Your Docker image has zero critical vulnerabilities and runs as a non-root user.",
            exercises:["Scan your Docker image with Trivy: `trivy image my-api:latest` — fix all critical/high CVEs","Rebuild with distroless or Alpine base — compare image sizes and vulnerability counts","Add Dockerfile security: non-root USER, no secrets in layers, minimal `COPY`, multi-stage build","Generate an SBOM (Software Bill of Materials) with `syft` — understand what dependencies you ship"]},
          { id:"d244", label:"Day 244", sub:"Fri", task:"SLOs, SLIs & Error Budgets",
            detail:"Define Service Level Objectives, measure Service Level Indicators, manage error budgets.",
            tags:["SRE","SLOs","reliability"],
            goal:"Define 3 SLOs for your API and build a Grafana dashboard showing real-time SLI measurements.",
            exercises:["Define SLOs: availability ≥ 99.9%, latency p99 < 500ms, error rate < 0.1%","Implement SLIs: instrument your API to measure actual availability, latency, and error rate","Build a Grafana dashboard showing SLI trends and remaining error budget for the month","Calculate: with 99.9% availability SLO, how many minutes of downtime are allowed per month? (43.2 min)"]},
          { id:"d245", label:"Day 245", sub:"Sat", task:"Incident Response & Postmortems",
            detail:"On-call rotations, incident severity levels, runbooks, blameless postmortem template.",
            tags:["incident response","SRE"],
            goal:"Write a runbook and a postmortem for a simulated production incident — follow Google SRE format.",
            exercises:["Define incident severity levels: SEV1 (total outage) through SEV4 (minor degradation) with response times","Write a runbook for 'API latency spike': triage steps, escalation path, common fixes","Simulate an incident: kill the Redis connection — follow your own runbook to diagnose and fix","Write a blameless postmortem: timeline, root cause, impact, action items with owners and deadlines"]},
        ],
        rest:{ label:"Day 246", sub:"Sun", text:"🌴 Rest — Read Google's SRE book chapters on SLOs and error budgets (free online). Take notes on what applies to your projects." }
      },
      {
        title:"Week 43–44 · Chaos Engineering & Advanced Topics",
        days:[
          { id:"d247", label:"Day 247", sub:"Mon", task:"Chaos Engineering — Principles & Practice",
            detail:"Steady state hypothesis, inject failures, observe behavior. LitmusChaos, Chaos Monkey.",
            tags:["chaos engineering","resilience"],
            goal:"Run 3 chaos experiments on your microservices — verify resilience or find weaknesses.",
            exercises:["Define steady state: 'API returns 200 with p95 <200ms under 50 req/s' — this is your hypothesis","Experiment 1: Kill one of 3 pods randomly — does the Service route around it? Verify zero errors","Experiment 2: Inject 500ms latency on DB calls — does your circuit breaker activate? Do timeouts work?","Experiment 3: Fill up disk on one pod — does the health check fail? Does K8s restart the pod?"]},
          { id:"d248", label:"Day 248", sub:"Tue", task:"Chaos Engineering — Game Day",
            detail:"Run a structured game day: prepare scenarios, inject failures during load, measure blast radius.",
            tags:["chaos engineering","game day"],
            goal:"Run a 2-hour game day with 5 failure scenarios — document findings and fixes for each.",
            exercises:["Prepare 5 scenarios: pod failure, network partition, DB connection exhaustion, Redis crash, memory leak","Start a k6 load test (50 VUs) — inject each failure while traffic is flowing","For each scenario: did the system degrade gracefully? What alerted? How long to recover?","Document all findings in a `GAMEDAY_REPORT.md` — prioritize the 3 most impactful fixes"]},
          { id:"d249", label:"Day 249", sub:"Wed", task:"Database Sharding Strategies",
            detail:"Hash-based, range-based, geographic sharding. Shard key selection. Cross-shard queries.",
            tags:["sharding","database scaling"],
            goal:"Design a sharding strategy for a 100M user system — justify your shard key choice with math.",
            exercises:["Calculate: with 100M users and 1TB data, how many shards? What's the data per shard?","Design hash-based sharding: `shard_id = hash(user_id) % num_shards` — implement a router function","Handle the hard problem: how do you query across shards? (scatter-gather, materialized views)","Research Vitess (YouTube's MySQL sharding) — how does it handle resharding without downtime?"]},
          { id:"d250", label:"Day 250", sub:"Thu", task:"Advanced Message Patterns",
            detail:"Dead letter queues, retry with exponential backoff, schema registry (Avro), exactly-once processing.",
            tags:["messaging","Kafka","patterns"],
            goal:"Build a robust message processing pipeline: retry → DLQ → alerting — no message ever silently lost.",
            exercises:["Implement retry with exponential backoff: 1s → 2s → 4s → 8s → 16s → DLQ after 5 retries","Create a dead letter queue — failed messages go here with error metadata for investigation","Set up Confluent Schema Registry with Avro — enforce schema evolution rules (backward compatible)","Build a DLQ dashboard: count failed messages per topic, error distribution, replay capability"]},
          { id:"d251", label:"Day 251", sub:"Fri", task:"Multi-Tenancy Architecture",
            detail:"Schema-per-tenant, row-level security, shared DB with tenant_id, tenant isolation patterns.",
            tags:["multi-tenancy","SaaS"],
            goal:"Implement row-level security in PostgreSQL — each tenant only sees their own data, enforced at DB level.",
            exercises:["Implement shared DB with `tenant_id` column on every table — add to all queries","Enable PostgreSQL Row Level Security: `CREATE POLICY` that checks `current_setting('app.tenant_id')`","Set `app.tenant_id` on every request from JWT claims — RLS automatically filters all queries","Test: authenticate as tenant A, try to access tenant B's data — verify 0 results (not an error)"]},
          { id:"d252", label:"Day 252", sub:"Sat", task:"API Design Mastery",
            detail:"Versioning strategies, backward compatibility, deprecation policies, rate limiting tiers.",
            tags:["API design","versioning"],
            goal:"Define your API's versioning strategy and deprecation policy — write it as an internal standard.",
            exercises:["Compare versioning: URL path (/v1/), header (Accept-Version), query param — pick one and justify","Implement backward-compatible changes: add fields (safe), never remove or rename fields","Write a deprecation policy: Sunset header, 6-month notice, migration guide, usage monitoring","Implement tiered rate limiting: free (100/hr), pro (10K/hr), enterprise (unlimited) — based on API key tier"]},
        ],
        rest:{ label:"Day 253", sub:"Sun", text:"🌴 Rest — Review all system design notes from the past month. Create a personal 'system design cheat sheet' with patterns and trade-offs." }
      },
      {
        title:"Week 45–47 · Advanced Testing & Tech Writing",
        days:[
          { id:"d254", label:"Day 254", sub:"Mon", task:"Contract Testing with Pact",
            detail:"Consumer-driven contracts, Pact broker, verify provider, prevent breaking changes.",
            tags:["contract testing","Pact"],
            goal:"Set up consumer-driven contract tests between 2 services — CI fails if a contract is broken.",
            exercises:["Install Pact. Write a consumer test: 'order-service expects user-service to return {id, name, email}'","Generate a Pact contract file — publish to a Pact broker (or local file)","Write a provider verification test: user-service verifies it satisfies the consumer's contract","Break the contract (rename a field) — verify the provider test fails — fix it"]},
          { id:"d255", label:"Day 255", sub:"Tue", task:"Property-Based Testing",
            detail:"Generate random inputs, define properties that must always hold. fast-check for TypeScript.",
            tags:["testing","property-based"],
            goal:"Write property-based tests that found a bug your unit tests missed.",
            exercises:["Install `fast-check`. Write a property: `parse(serialize(x)) === x` for your serialization logic","Test your pagination: for any valid page/pageSize, result count ≤ pageSize and items are sorted","Test your rate limiter: no matter the request pattern, never more than N requests pass in T seconds","Write an idempotency property: calling the same operation twice with same key produces identical results"]},
          { id:"d256", label:"Day 256", sub:"Wed", task:"Mutation Testing",
            detail:"Stryker — mutate your code, verify your tests catch the mutations. Test quality, not just coverage.",
            tags:["mutation testing","Stryker"],
            goal:"Achieve 80%+ mutation score — your tests actually catch bugs, not just cover lines.",
            exercises:["Install Stryker. Run it on one service module — review the mutation score report","Find 'surviving mutants': mutations that passed all tests — these are gaps in your test logic","Add targeted tests to kill surviving mutants — focus on boundary conditions and error paths","Compare: you had 90% line coverage but only 65% mutation score — what does this tell you?"]},
          { id:"d257", label:"Day 257", sub:"Thu", task:"Architecture Decision Records (ADRs)",
            detail:"Write ADRs: context, decision, consequences. Track architectural decisions over time.",
            tags:["ADRs","documentation"],
            goal:"Write 3 ADRs for real decisions in your projects — each one actionable and clear.",
            exercises:["Write ADR-001: 'Use PostgreSQL over MongoDB for the task manager' — context, options, decision, consequences","Write ADR-002: 'Use event sourcing for the order service' — include trade-offs you considered","Write ADR-003: 'Use Kafka over RabbitMQ for inter-service messaging' — with benchmark data","Create a `docs/adr/` folder — number sequentially, link from README, add a status (accepted/superseded)"]},
          { id:"d258", label:"Day 258", sub:"Fri", task:"Writing RFCs (Request for Comments)",
            detail:"Write technical RFCs: problem statement, proposed solution, alternatives, rollout plan.",
            tags:["RFCs","technical writing"],
            goal:"Write a production-quality RFC that you could share with a team for review.",
            exercises:["Write RFC: 'Migrate from REST to gRPC for inter-service communication' — full proposal","Include: problem statement, goals/non-goals, proposed design, alternatives considered, rollout plan","Add: metrics to measure success, rollback plan if it goes wrong, timeline with milestones","Share with a developer friend for feedback — iterate based on their comments"]},
          { id:"d259", label:"Day 259–267", sub:"", task:"LeetCode Hard Sprint & System Design Deep Practice",
            detail:"Solve 6 Hard LeetCode problems. Complete 4 full system design mock interviews.",
            tags:["DSA","system design","interview prep"],
            goal:"Solve 6 Hard problems and complete 4 system design sessions — track your improvement.",
            exercises:["Day 259–261: LeetCode Hard — Median of Two Sorted Arrays (#4), Merge k Sorted Lists (#23), Trapping Rain Water (#42)","Day 262–264: LeetCode Hard — LRU Cache (#146), Word Ladder (#127), Serialize Binary Tree (#297)","Day 265–266: System design mock: Design YouTube (video upload, transcoding, CDN, recommendations)","Day 267: System design mock: Design Uber (matching, pricing, real-time location, surge pricing)"]},
        ],
        rest:{ label:"Day 268", sub:"Sun", text:"🎯 Phase 7 Review — You now think like a senior engineer. Review your ADRs, system designs, and performance optimizations." },
        milestone:{ icon:"🏗️", title:"Day 285 Checkpoint — Senior Engineering Mindset", desc:"You've mastered system design, performance engineering, security architecture, reliability, chaos engineering, and technical writing. You think in trade-offs, not absolutes." }
      }
    ]
  },
  // ─── PHASE 8 ── BUILD 2 SENIOR-LEVEL PROJECTS ──────────────────────────────
  {
    id:"ph8", num:"08", color:"indigo",
    label:"Phase Eight · Days 286–335", title:"Build 2 Senior-Level Projects",
    sub:"Two portfolio-defining projects demonstrating distributed systems, event-driven architecture, and production operations.",
    duration:"50 days",
    weeks:[
      {
        title:"Project 3 · Days 286–310 — Event-Driven E-Commerce Platform",
        days:[
          { id:"d286", label:"Day 286–290", sub:"", task:"Project 3: DDD Modeling & Architecture",
            detail:"Model an e-commerce platform with 4 bounded contexts: Order, Inventory, Payment, Notification.",
            tags:["DDD","event-driven","architecture"],
            goal:"Complete context map, event flows, aggregate definitions, and tech stack decisions — before any code.",
            exercises:["Run event storming: map the full order lifecycle across 4 bounded contexts","Define aggregates: Order (root), OrderItem (entity), Money (value object) — with invariants","Design event schemas: `OrderPlaced`, `InventoryReserved`, `PaymentProcessed`, `OrderShipped`","Write ARCHITECTURE.md: context map, tech stack per service, communication patterns, data flow diagrams"]},
          { id:"d291", label:"Day 291–295", sub:"", task:"Project 3: Core Services Implementation",
            detail:"Build Order, Inventory, and Payment services with Kafka event bus and saga orchestration.",
            tags:["Node.js","Kafka","gRPC","saga"],
            goal:"Place an order → inventory reserved → payment processed → confirmation sent — all event-driven.",
            exercises:["Day 291–292: Order Service — REST API, event sourcing for order state, publishes `OrderPlaced` to Kafka","Day 293: Inventory Service — gRPC, consumes `OrderPlaced`, reserves stock, publishes `InventoryReserved`","Day 294: Payment Service — processes payment, publishes `PaymentProcessed` or `PaymentFailed`","Day 295: Implement saga: if PaymentFailed → InventoryService releases stock → OrderService marks as failed"]},
          { id:"d296", label:"Day 296–300", sub:"", task:"Project 3: CQRS, Read Models & API Gateway",
            detail:"Separate write (event store) and read (optimized projections) models. API gateway for unified frontend API.",
            tags:["CQRS","API gateway","projections"],
            goal:"Catalog queries hit the read model (<10ms), writes go through the event store — both stay in sync.",
            exercises:["Day 296–297: Build read model projections: `product_catalog` (denormalized), `order_history` (per user)","Day 298: Implement projectors that consume events and update read models — handle idempotency","Day 299: Set up API Gateway (Kong) — unified entry point, JWT auth, rate limiting, request routing","Day 300: Integration test: full order flow end-to-end — verify events, saga, projections all work together"]},
          { id:"d301", label:"Day 301–305", sub:"", task:"Project 3: Kubernetes Deployment & Monitoring",
            detail:"Deploy all services to Kubernetes with Helm, service mesh, and full observability stack.",
            tags:["Kubernetes","Helm","Istio","Grafana"],
            goal:"All services running on K8s with Helm, distributed tracing, and Grafana dashboards — single `helm install`.",
            exercises:["Day 301–302: Write Helm charts for all services — parameterize per environment (dev/staging/prod)","Day 303: Deploy Kafka, PostgreSQL, Redis as K8s StatefulSets — with persistent volumes","Day 304: Add Istio service mesh — mTLS, traffic management, canary deployment for order-service","Day 305: Build Grafana dashboard: request rates, error rates, p95 latency, Kafka lag, event processing time"]},
          { id:"d306", label:"Day 306–310", sub:"", task:"Project 3: Testing, Chaos Engineering & Documentation",
            detail:"Contract tests, chaos experiments, load testing, ADRs, comprehensive documentation.",
            tags:["testing","chaos engineering","documentation"],
            goal:"The project is production-hardened: contract tests pass, chaos experiments documented, README is a case study.",
            exercises:["Day 306–307: Contract tests (Pact) between all service pairs — CI fails if contracts break","Day 308: Run 3 chaos experiments: kill a service, inject latency, crash Kafka broker — document results","Day 309: Load test with k6: simulate Black Friday (1000 orders/min) — find and fix the bottleneck","Day 310: Write README as a case study: architecture, decisions (ADRs), trade-offs, performance results, live demo"]},
        ],
        milestone:{ icon:"🛒", title:"Day 310 — Project 3 Done: Event-Driven E-Commerce", desc:"A distributed e-commerce platform with DDD, event sourcing, CQRS, Kafka, saga orchestration, Kubernetes, and full observability. This is a senior-level portfolio piece." }
      },
      {
        title:"Project 4 · Days 311–335 — Multi-Tenant SaaS Platform",
        days:[
          { id:"d311", label:"Day 311–315", sub:"", task:"Project 4: Architecture & Tenant Isolation",
            detail:"Design a multi-tenant SaaS platform: tenant isolation, billing, RBAC, API key management.",
            tags:["SaaS","multi-tenancy","architecture"],
            goal:"Complete architecture design with tenant isolation strategy, billing model, and data model.",
            exercises:["Design tenant isolation: shared DB with Row Level Security — justify vs schema-per-tenant","Define the RBAC model: org admin, project manager, developer, viewer — with permission matrix","Design billing integration: usage metering (API calls, storage), plan tiers (free/pro/enterprise)","Write ARCHITECTURE.md: data model, API design, auth flow, tenant provisioning, rate limiting tiers"]},
          { id:"d316", label:"Day 316–320", sub:"", task:"Project 4: Core Platform Implementation",
            detail:"Tenant provisioning, RBAC system, API key management, usage metering.",
            tags:["Node.js","PostgreSQL","RBAC","API keys"],
            goal:"Create a tenant → add members with roles → generate API keys → usage is metered per tenant.",
            exercises:["Day 316–317: Tenant provisioning: create org, setup RLS policies, seed default data","Day 318: RBAC system with Casbin: define policies, enforce on every route, audit log for access","Day 319: API key management: generate, rotate, revoke keys — each key scoped to a tenant","Day 320: Usage metering: count API calls per tenant per day — store in time-series table"]},
          { id:"d321", label:"Day 321–325", sub:"", task:"Project 4: Webhook System & Admin Dashboard API",
            detail:"Webhook delivery with retry, admin API for tenant management, feature flags.",
            tags:["webhooks","admin","feature flags"],
            goal:"Tenants can register webhook endpoints — your platform reliably delivers events with retry.",
            exercises:["Day 321–322: Webhook system: register endpoints, sign payloads (HMAC-SHA256), deliver with retry (5 attempts, exponential backoff)","Day 323: Webhook delivery dashboard: success/failure rates, recent deliveries, payload inspection","Day 324: Admin API: list tenants, usage stats, suspend/activate, billing overview","Day 325: Feature flags: tenant-level feature toggles — enable beta features for specific tenants"]},
          { id:"d326", label:"Day 326–330", sub:"", task:"Project 4: CI/CD, Blue-Green Deployment & Alerts",
            detail:"GitHub Actions CI/CD, blue-green deployment, canary releases, PagerDuty-style alerting.",
            tags:["CI/CD","deployment","alerting"],
            goal:"Every merge to main auto-deploys with blue-green strategy — rollback in under 30 seconds.",
            exercises:["Day 326–327: GitHub Actions: lint → test → build Docker image → push to registry → deploy","Day 328: Implement blue-green deployment: two environments, switch traffic via load balancer","Day 329: Add canary releases: route 5% of traffic to new version, monitor error rate, auto-promote or rollback","Day 330: Set up alerting: Slack notifications for SLO breaches, on-call escalation chain, runbooks"]},
          { id:"d331", label:"Day 331–335", sub:"", task:"Project 4: Documentation & Open Source",
            detail:"Case study README, architecture diagrams, API docs, performance benchmarks, open source the project.",
            tags:["documentation","open source","portfolio"],
            goal:"The project is polished enough to open-source — complete docs, CONTRIBUTING.md, and MIT license.",
            exercises:["Day 331–332: Write README as a portfolio case study: problem, architecture, tech decisions, benchmarks","Day 333: Create architecture diagrams (C4 model): context, container, component levels","Day 334: Add CONTRIBUTING.md, CODE_OF_CONDUCT.md, issue templates, PR template","Day 335: Open source: clean git history, add MIT license, create GitHub release v1.0.0, tweet about it"]},
        ],
        milestone:{ icon:"🏢", title:"Day 335 — Project 4 Done: Multi-Tenant SaaS Platform", desc:"A production-grade SaaS platform with multi-tenancy, RBAC, billing, webhooks, feature flags, and enterprise-grade CI/CD. This is staff-engineer level work." }
      }
    ]
  },
  // ─── PHASE 9 ── LEADERSHIP, MENTORING & CAREER GROWTH ──────────────────────
  {
    id:"ph9", num:"09", color:"emerald",
    label:"Phase Nine · Days 336–365", title:"Leadership, Mentoring & Career Growth",
    sub:"Technical leadership, open source contribution, mentoring, staff-level interview prep — the final push to senior.",
    duration:"30 days",
    weeks:[
      {
        title:"Days 336–345 · Technical Leadership",
        days:[
          { id:"d336", label:"Day 336–338", sub:"", task:"Writing Production-Quality RFCs",
            detail:"Write 3 real RFCs for architectural decisions. Get peer review. Iterate on feedback.",
            tags:["RFCs","leadership","writing"],
            goal:"Write 3 RFCs that you would confidently present to a team of senior engineers.",
            exercises:["RFC 1: 'Introduce Event Sourcing for Order Management' — problem, design, migration plan, risks","RFC 2: 'Multi-Region Deployment Strategy' — latency requirements, data replication, failover","RFC 3: 'API Rate Limiting Overhaul' — current problems, proposed tiered system, implementation plan","For each: include success metrics, rollback plan, timeline, and open questions for reviewers"]},
          { id:"d339", label:"Day 339–341", sub:"", task:"Code Review Mastery — Senior Perspective",
            detail:"Review code for architecture, not just correctness. Teach through reviews. Write review guidelines.",
            tags:["code review","leadership","mentoring"],
            goal:"Write a team code review guideline document — covering what to look for beyond syntax.",
            exercises:["Review 5 open-source PRs: focus on architecture decisions, error handling patterns, API design","Write 'Code Review Guidelines': what to check (error handling, edge cases, naming, security, testing)","Practice 'teaching reviews': instead of 'fix this', write 'consider X because Y, which would help with Z'","Review your own old code from Phase 1 — write review comments as if reviewing someone else's PR"]},
          { id:"d342", label:"Day 342–345", sub:"", task:"Mentoring & Knowledge Sharing",
            detail:"Prepare a workshop, write an onboarding guide, create a tech talk on your strongest topic.",
            tags:["mentoring","workshop","onboarding"],
            goal:"Create 3 knowledge-sharing assets that would help a new team member ramp up faster.",
            exercises:["Write a 'Backend Engineering Onboarding Guide': setup, architecture overview, key decisions, common tasks","Prepare a 30-minute workshop: 'Event-Driven Architecture with Kafka' — slides + live coding demo","Create a tech talk (15 min): pick your strongest topic, prepare slides, rehearse 3 times, record yourself","Write a 'Debugging Guide': common production issues, how to diagnose, tools to use, escalation paths"]},
        ]
      },
      {
        title:"Days 346–355 · Open Source & Community",
        days:[
          { id:"d346", label:"Day 346–348", sub:"", task:"Contribute to Major Open-Source Projects",
            detail:"Find meaningful issues, submit quality PRs, engage with maintainers.",
            tags:["open source","community"],
            goal:"Get at least 1 PR merged to a project with 1K+ stars.",
            exercises:["Find 3 Node.js/Python projects you use — look for issues labeled 'good first issue' or 'help wanted'","Submit a meaningful PR: bug fix, documentation improvement, or small feature — not just typo fixes","Engage with maintainers: respond to feedback promptly, explain your approach, iterate on review","Document your contribution journey: what you learned about the project's codebase and process"]},
          { id:"d349", label:"Day 349–351", sub:"", task:"Write a Technical Blog Series",
            detail:"3-part series on a senior topic you mastered. Publish on dev.to, Medium, or personal blog.",
            tags:["blogging","writing","community"],
            goal:"Publish a 3-part series with code examples — at least 100 total views across all parts.",
            exercises:["Part 1: 'Building an Event-Driven E-Commerce Platform — Architecture & DDD Modeling'","Part 2: 'Saga Pattern in Practice — Handling Distributed Transactions Without 2PC'","Part 3: 'From Chaos to Confidence — Chaos Engineering for Microservices'","Promote on Twitter/X, Reddit (r/node, r/programming), and Hacker News — engage with commenters"]},
          { id:"d352", label:"Day 352–355", sub:"", task:"Conference Talk Preparation",
            detail:"Prepare and rehearse a 20-minute conference talk on your strongest architectural decision.",
            tags:["speaking","conference","career"],
            goal:"Have a polished 20-minute talk recorded — good enough to submit to a conference CFP.",
            exercises:["Pick your topic: an architectural challenge you solved, with measurable results","Create slides: problem → naive approach → your solution → results → lessons learned (15–20 slides)","Rehearse 5 times: first alone, then to a friend/partner, then record yourself — aim for 18–20 minutes","Submit to 3 conference CFPs: NodeConf, JSConf, PyCon, or regional meetups — rejection is expected, keep submitting"]},
        ]
      },
      {
        title:"Days 356–365 · Senior Interview Prep & Career Strategy",
        days:[
          { id:"d356", label:"Day 356–358", sub:"", task:"Senior System Design Interview Practice",
            detail:"3 full mock interviews at senior depth: scale estimation, component deep-dives, trade-off discussions.",
            tags:["interview","system design","senior"],
            goal:"Complete 3 mock system design interviews with detailed feedback — score 'hire' on each.",
            exercises:["Mock 1: Design a distributed file storage system (like Dropbox) — focus on sync, conflict resolution, chunking","Mock 2: Design a real-time multiplayer game server — focus on state sync, latency, cheat detection","Mock 3: Design a CI/CD pipeline platform (like GitHub Actions) — focus on isolation, scaling, artifact storage","For each: 5 min requirements → 5 min estimation → 15 min design → 10 min deep dive → 5 min trade-offs"]},
          { id:"d359", label:"Day 359–361", sub:"", task:"Leadership & Behavioral Interview Prep",
            detail:"Influence without authority, cross-team collaboration, technical decision-making under uncertainty.",
            tags:["behavioral","leadership","interview"],
            goal:"Have 10 polished STAR stories covering senior-level leadership scenarios.",
            exercises:["Write STAR stories: 'Tell me about a time you influenced a team to adopt a new technology'","Write STAR stories: 'Describe a technical decision you made with incomplete information — how did it go?'","Write STAR stories: 'How did you handle disagreement with a more senior engineer on architecture?'","Practice: answer 5 questions on camera in under 2 minutes each — be concise, specific, and quantify impact"]},
          { id:"d362", label:"Day 362–363", sub:"", task:"Senior Salary Negotiation",
            detail:"Research senior remote rates ($80K–$150K+), equity evaluation, total comp analysis.",
            tags:["negotiation","salary","career"],
            goal:"Know your market rate for senior remote backend roles — have a negotiation script ready.",
            exercises:["Research: levels.fyi, Glassdoor, RemoteOK, and Blind — collect 20 data points for your profile","Calculate total comp: base + equity (4-year vest, strike price vs fair market value) + benefits","Write your negotiation script: 'Based on my experience with distributed systems and my portfolio...'","Practice with a friend: they make an offer, you counter — rehearse 3 times until it feels natural"]},
          { id:"d364", label:"Day 364–365", sub:"", task:"Career Roadmap — IC Track vs Management",
            detail:"Staff engineer path, engineering manager path, principal engineer vision. 5-year plan.",
            tags:["career","staff engineer","growth"],
            goal:"Write your personal 5-year career plan — where you want to be and how you'll get there.",
            exercises:["Research the IC ladder: Junior → Mid → Senior → Staff → Principal — what defines each level?","Research the management ladder: Tech Lead → Engineering Manager → Director — compare with IC path","Write your 5-year plan: target role, skills to develop, companies to target, salary milestones","Set up quarterly review: every 3 months, revisit this plan — adjust based on what you've learned"]},
        ],
        milestone:{ icon:"👑", title:"Day 365 — You're a Senior Backend Engineer", desc:"You've completed the full journey: from environment setup to distributed systems architecture, from your first API to event-driven platforms, from writing code to writing RFCs and mentoring others. You have 4 production projects, deep technical knowledge, leadership skills, and a portfolio that proves it all. The senior title isn't given — it's earned through exactly this kind of work." }
      }
    ]
  }
];

const COLOR: Record<string,{accent:string;light:string;border:string}> = {
  orange:{ accent:"#d4521a", light:"#fff0ea", border:"#f2b49a" },
  green: { accent:"#2a6b4a", light:"#eaf4ee", border:"#9dd4b4" },
  blue:  { accent:"#1e4b8a", light:"#eaf0fb", border:"#9ab8e8" },
  plum:  { accent:"#7a3a8a", light:"#f5eef8", border:"#c8a0d4" },
  gold:  { accent:"#b8860b", light:"#fdf8ea", border:"#e0c060" },
  teal:  { accent:"#0d7377", light:"#e6f7f7", border:"#7ecaca" },
  crimson:{ accent:"#a8324a", light:"#fdeef1", border:"#e69aaa" },
  indigo:{ accent:"#4338ca", light:"#eef0ff", border:"#a5b4fc" },
  emerald:{ accent:"#047857", light:"#ecfdf5", border:"#6ee7b7" },
};

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function RoadmapClient() {
  const [done,        setDone]        = useState<Record<string,boolean>>({});
  const [notes,       setNotes]       = useState<Record<string,string>>({});
  const [expanded,    setExpanded]    = useState<Record<string,boolean>>({});
  const [activeNote,  setActiveNote]  = useState<string|null>(null);
  const [noteText,    setNoteText]    = useState("");
  const [activePhase, setActivePhase] = useState("all");
  const [loaded,      setLoaded]      = useState(false);
  const [saving,      setSaving]      = useState(false);
  const [toast,       setToast]       = useState<string|null>(null);
  const saveRef = useRef<ReturnType<typeof setTimeout>|null>(null);

  // ── LOAD ──
  useEffect(() => {
    fetch("/api/progress")
      .then(r => r.json())
      .then(data => { setDone(data.done||{}); setNotes(data.notes||{}); })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  const showToast = (msg: string) => { setToast(msg); setTimeout(()=>setToast(null), 2200); };

  // ── TOGGLE DAY ──
  const toggleDone = useCallback(async (id: string) => {
    const next = !done[id];
    setDone(p => ({ ...p, [id]: next }));
    setSaving(true);
    try {
      await fetch("/api/progress/toggle", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ dayId:id, isDone:next }),
      });
      if (next) showToast("✓ Day complete!");
    } catch { showToast("⚠️ Could not save"); }
    setSaving(false);
  }, [done]);

  // ── SAVE NOTE ──
  const saveNote = async () => {
    if (!activeNote) return;
    setNotes(p => ({ ...p, [activeNote]: noteText }));
    setSaving(true);
    try {
      await fetch("/api/progress/note", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ dayId:activeNote, content:noteText }),
      });
      showToast("📝 Note saved!");
    } catch { showToast("⚠️ Could not save note"); }
    setSaving(false);
    setActiveNote(null);
  };

  // ── STATS ──
  const allDays   = PHASES.flatMap(p => p.weeks.flatMap(w => w.days));
  const total     = allDays.length;
  const doneCount = Object.values(done).filter(Boolean).length;
  const pct       = total ? Math.round((doneCount/total)*100) : 0;
  const doneSet   = new Set(Object.keys(done).filter(k => done[k]));
  let streak = 0;
  for (let i = allDays.length-1; i>=0; i--) {
    if (doneSet.has(allDays[i].id)) streak++; else break;
  }

  if (!loaded) return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",background:"#f5f0e8",fontFamily:"monospace",color:"#8a7d6e",fontSize:13,letterSpacing:"0.05em"}}>
      Loading your progress from database...
    </div>
  );

  return (
    <div style={{fontFamily:"'Outfit',sans-serif",background:"#f5f0e8",minHeight:"100vh",position:"relative"}}>
      <div style={{position:"fixed",inset:0,backgroundImage:"repeating-linear-gradient(to bottom,transparent,transparent 31px,rgba(180,160,130,0.13) 31px,rgba(180,160,130,0.13) 32px)",pointerEvents:"none",zIndex:0}}/>

      {toast && <div style={{position:"fixed",top:16,right:16,zIndex:999,background:"#1a1410",color:"#f5f0e8",padding:"10px 18px",borderRadius:8,fontSize:13,fontFamily:"monospace",boxShadow:"0 4px 20px rgba(0,0,0,0.3)"}}>{toast}</div>}

      {activeNote && (
        <div style={{position:"fixed",inset:0,zIndex:500,background:"rgba(26,20,16,0.72)",display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
          <div style={{background:"#fff",borderRadius:12,padding:24,width:"100%",maxWidth:480,boxShadow:"0 20px 60px rgba(0,0,0,0.3)"}}>
            <div style={{fontFamily:"monospace",fontSize:10,color:"#8a7d6e",letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:10}}>// notes for {activeNote}</div>
            <textarea autoFocus value={noteText} onChange={e=>setNoteText(e.target.value)}
              placeholder="What did you learn? Blockers? Resources? Reflections..."
              style={{width:"100%",minHeight:130,border:"1.5px solid #d8d0c4",borderRadius:8,padding:12,fontSize:13,resize:"vertical",outline:"none",background:"#faf8f4",color:"#1a1410",lineHeight:1.6}}/>
            <div style={{display:"flex",gap:10,marginTop:12}}>
              <button onClick={saveNote} style={{flex:1,padding:"10px 0",background:"#1a1410",color:"#f5f0e8",border:"none",borderRadius:7,fontSize:13,fontWeight:600}}>Save Note</button>
              <button onClick={()=>setActiveNote(null)} style={{padding:"10px 18px",background:"transparent",color:"#8a7d6e",border:"1.5px solid #d8d0c4",borderRadius:7,fontSize:12}}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div style={{maxWidth:920,margin:"0 auto",padding:"0 20px 80px",position:"relative",zIndex:1}}>
        {/* HEADER */}
        <div style={{padding:"48px 0 28px",borderBottom:"2px solid #1a1410",marginBottom:32}}>
          <div style={{fontFamily:"monospace",fontSize:11,letterSpacing:"0.15em",textTransform:"uppercase",color:"#d4521a",marginBottom:12}}>// Dewa Agie's personal roadmap · backend dev journey</div>
          <h1 style={{fontSize:"clamp(28px,5vw,48px)",fontWeight:800,lineHeight:1.08,letterSpacing:"-0.025em",margin:0}}>
            Backend <span style={{color:"#d4521a"}}>Remote</span> Job <span style={{color:"#2a6b4a"}}>Roadmap</span>
          </h1>
          <p style={{fontSize:14,color:"#4a4035",maxWidth:520,lineHeight:1.65,marginTop:10,marginBottom:0}}>
            Day-by-day plan from <strong>Junior</strong> to <strong>Senior Backend Engineer</strong> targeting remote roles.
            Each day has a <strong style={{color:"#d4521a"}}>goal</strong> + hands-on <strong style={{color:"#2a6b4a"}}>exercises</strong>. Click ▼ to expand any day.
          </p>
          <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:16}}>
            {(["orange","green","teal"] as const).map((c,i)=>(
              <span key={c} style={{fontFamily:"monospace",fontSize:11,padding:"4px 12px",borderRadius:4,border:`1.5px solid ${COLOR[c].accent}`,color:COLOR[c].accent,background:COLOR[c].light}}>
                {["Junior → Senior","Node.js · Python · APIs · K8s","365 days · 3–4 hrs/day"][i]}
              </span>
            ))}
          </div>
          <div style={{marginTop:12,fontFamily:"monospace",fontSize:11,color:"#8a7d6e",display:"flex",alignItems:"center",gap:8}}>
            <span style={{width:7,height:7,borderRadius:"50%",background:saving?"#b8860b":"#2a6b4a",display:"inline-block",flexShrink:0}}/>
            {saving ? "Saving to Turso..." : "Progress saved to SQLite database (Turso)"}
          </div>
        </div>

        {/* DASHBOARD */}
        <div style={{background:"#fff",border:"1.5px solid #d8d0c4",borderRadius:12,padding:"20px 22px",marginBottom:32}}>
          <div style={{fontFamily:"monospace",fontSize:10,letterSpacing:"0.18em",textTransform:"uppercase",color:"#8a7d6e",marginBottom:16}}>// progress dashboard</div>
          <div style={{display:"grid",gridTemplateColumns:"auto 1fr",gap:22,alignItems:"center",marginBottom:20}}>
            <div style={{position:"relative",width:80,height:80,flexShrink:0}}>
              <svg width="80" height="80" style={{transform:"rotate(-90deg)"}}>
                <circle cx="40" cy="40" r="32" fill="none" stroke="#e8e0d4" strokeWidth="7"/>
                <circle cx="40" cy="40" r="32" fill="none" stroke="#2a6b4a" strokeWidth="7"
                  strokeDasharray={`${2*Math.PI*32}`}
                  strokeDashoffset={`${2*Math.PI*32*(1-pct/100)}`}
                  strokeLinecap="round" style={{transition:"stroke-dashoffset 1s ease"}}/>
              </svg>
              <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <span style={{fontSize:16,fontWeight:800,fontFamily:"monospace",color:"#1a1410"}}>{pct}%</span>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
              {[{l:"Done",v:doneCount,c:"#2a6b4a"},{l:"Left",v:total-doneCount,c:"#d4521a"},{l:"🔥 Streak",v:streak,c:"#b8860b"}].map(s=>(
                <div key={s.l} style={{background:"#faf8f4",borderRadius:8,padding:"10px 12px",border:"1px solid #e8e0d4"}}>
                  <div style={{fontSize:20,fontWeight:800,fontFamily:"monospace",color:s.c}}>{s.v}</div>
                  <div style={{fontSize:10,color:"#8a7d6e",marginTop:2,fontFamily:"monospace"}}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:9}}>
            {PHASES.map(p=>{
              const pd=p.weeks.flatMap(w=>w.days);
              const pp=pd.length?Math.round(pd.filter(d=>doneSet.has(d.id)).length/pd.length*100):0;
              const c=COLOR[p.color];
              return (
                <div key={p.id} style={{display:"grid",gridTemplateColumns:"130px 1fr 36px",gap:10,alignItems:"center"}}>
                  <span style={{fontSize:12,fontWeight:500,color:"#1a1410",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.title}</span>
                  <div style={{height:5,background:"#e8e0d4",borderRadius:3,overflow:"hidden"}}>
                    <div style={{height:"100%",background:c.accent,borderRadius:3,width:`${pp}%`,transition:"width 0.8s ease"}}/>
                  </div>
                  <span style={{fontFamily:"monospace",fontSize:10,color:"#8a7d6e",textAlign:"right"}}>{pp}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* PHASE NAV */}
        <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:32,position:"sticky",top:0,zIndex:100,background:"#f5f0e8",padding:"10px 0",borderBottom:"1px solid #d8d0c4"}}>
          {[["all","All Phases"],["ph1","① Foundation"],["ph2","② Core Backend"],["ph3","③ Projects"],["ph4","④ Job Hunt"],["ph5","⑤ Offers"],["ph6","⑥ Distributed"],["ph7","⑦ Senior Eng"],["ph8","⑧ Senior Projects"],["ph9","⑨ Leadership"]].map(([id,lbl])=>(
            <button key={id} onClick={()=>setActivePhase(id)} style={{fontFamily:"monospace",fontSize:11,padding:"6px 14px",borderRadius:5,border:`1.5px solid ${activePhase===id?"#1a1410":"#d8d0c4"}`,background:activePhase===id?"#1a1410":"#fff",color:activePhase===id?"#f5f0e8":"#4a4035",cursor:"pointer",transition:"all 0.15s"}}>
              {lbl}
            </button>
          ))}
        </div>

        {/* PHASES */}
        {PHASES.filter(p=>activePhase==="all"||p.id===activePhase).map(phase=>(
          <PhaseBlock key={phase.id} phase={phase} done={done} notes={notes} expanded={expanded}
            onToggle={toggleDone} onNote={(id)=>{setActiveNote(id);setNoteText(notes[id]||"");}}
            onExpand={(id)=>setExpanded(p=>({...p,[id]:!p[id]}))}/>
        ))}

        <div style={{borderTop:"2px solid #1a1410",paddingTop:24,marginTop:48,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
          <div style={{fontFamily:"monospace",fontSize:11,color:"#8a7d6e"}}>Built for: Junior → Senior Backend Dev · Ubud, Bali 🌴 · 365-day plan</div>
          <div style={{fontFamily:"monospace",fontSize:12,color:"#2a6b4a",fontWeight:600}}>{doneCount} / {total} days completed</div>
        </div>
      </div>
    </div>
  );
}

// ─── PHASE BLOCK ──────────────────────────────────────────────────────────────
function PhaseBlock({ phase, done, notes, expanded, onToggle, onNote, onExpand }:
  { phase:Phase; done:Record<string,boolean>; notes:Record<string,string>; expanded:Record<string,boolean>;
    onToggle:(id:string)=>void; onNote:(id:string)=>void; onExpand:(id:string)=>void }) {
  const c = COLOR[phase.color];
  return (
    <div style={{marginBottom:52}}>
      <div style={{display:"flex",alignItems:"flex-start",gap:16,marginBottom:22,paddingBottom:14,borderBottom:"1px solid #d8d0c4"}}>
        <div style={{fontFamily:"monospace",fontSize:40,fontWeight:300,lineHeight:1,color:"#d8d0c4",flexShrink:0,marginTop:4}}>{phase.num}</div>
        <div style={{flex:1}}>
          <div style={{fontFamily:"monospace",fontSize:10,letterSpacing:"0.18em",textTransform:"uppercase",color:c.accent,marginBottom:4}}>{phase.label}</div>
          <div style={{fontSize:"clamp(15px,2.5vw,21px)",fontWeight:700,lineHeight:1.2,marginBottom:4,color:"#1a1410"}}>{phase.title}</div>
          <div style={{fontSize:13,color:"#8a7d6e"}}>{phase.sub}</div>
        </div>
        <span style={{fontFamily:"monospace",fontSize:11,padding:"4px 12px",borderRadius:4,background:c.light,color:c.accent,border:`1.5px solid ${c.accent}`,flexShrink:0}}>{phase.duration}</span>
      </div>
      {phase.weeks.map((week,wi)=>(
        <div key={wi} style={{marginBottom:22}}>
          <div style={{fontFamily:"monospace",fontSize:10,letterSpacing:"0.12em",textTransform:"uppercase",color:"#8a7d6e",marginBottom:10,display:"flex",alignItems:"center",gap:8}}>
            {week.title}<div style={{flex:1,height:1,background:"#d8d0c4"}}/>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {week.days.map(day=>(
              <DayRow key={day.id} day={day} color={phase.color}
                isDone={!!done[day.id]} hasNote={!!notes[day.id]}
                noteText={notes[day.id]||""} isExpanded={!!expanded[day.id]}
                onToggle={()=>onToggle(day.id)} onNote={()=>onNote(day.id)}
                onExpand={()=>onExpand(day.id)}/>
            ))}
            {week.rest && (
              <div style={{background:"#ede8de",border:"1.5px dashed #d8d0c4",borderRadius:8,padding:"10px 14px",display:"flex",gap:12,alignItems:"center"}}>
                <div style={{fontFamily:"monospace",fontSize:11,color:"#8a7d6e",minWidth:68,flexShrink:0}}>
                  <strong style={{display:"block",fontSize:12,color:"#4a4035"}}>{week.rest.label}</strong>{week.rest.sub}
                </div>
                <div style={{fontSize:13,color:"#8a7d6e",fontStyle:"italic"}}>{week.rest.text}</div>
              </div>
            )}
          </div>
          {week.milestone && (
            <div style={{border:"2px solid #1a1410",borderRadius:10,padding:"16px 18px",margin:"16px 0",display:"flex",gap:14,alignItems:"flex-start",background:"#fff",position:"relative"}}>
              <div style={{position:"absolute",top:-10,left:14,fontFamily:"monospace",fontSize:10,letterSpacing:"0.15em",background:"#f5f0e8",padding:"0 8px",color:"#1a1410",fontWeight:600}}>⚑ MILESTONE</div>
              <div style={{fontSize:24,flexShrink:0}}>{week.milestone.icon}</div>
              <div>
                <div style={{fontSize:14,fontWeight:700,marginBottom:3,color:"#1a1410"}}>{week.milestone.title}</div>
                <div style={{fontSize:13,color:"#8a7d6e",lineHeight:1.55}}>{week.milestone.desc}</div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── DAY ROW ─────────────────────────────────────────────────────────────────
function DayRow({ day, color, isDone, hasNote, noteText, isExpanded, onToggle, onNote, onExpand }:
  { day:Day; color:string; isDone:boolean; hasNote:boolean; noteText:string; isExpanded:boolean;
    onToggle:()=>void; onNote:()=>void; onExpand:()=>void }) {
  const [hover, setHover] = useState(false);
  const c = COLOR[color];
  return (
    <div style={{background:isDone?"#ede8de":"#fff",border:`1.5px solid ${hover&&!isDone?"#1a1410":"#d8d0c4"}`,borderRadius:9,overflow:"hidden",transition:"all 0.15s",transform:hover&&!isDone?"translateX(3px)":"translateX(0)"}}>
      <div onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
        style={{display:"grid",gridTemplateColumns:"68px 1fr auto",gap:12,padding:"12px 14px",position:"relative"}}>
        <div style={{position:"absolute",left:0,top:0,bottom:0,width:3,background:c.accent,borderRadius:"3px 0 0 3px"}}/>
        <div style={{fontFamily:"monospace",fontSize:11,color:"#8a7d6e",paddingLeft:4}}>
          <strong style={{display:"block",fontSize:12,color:"#1a1410",fontWeight:600}}>{day.label}</strong>{day.sub}
        </div>
        <div onClick={onToggle} style={{cursor:"pointer"}}>
          <div style={{fontSize:14,fontWeight:600,marginBottom:3,lineHeight:1.3,color:"#1a1410",textDecoration:isDone?"line-through":"none",opacity:isDone?0.5:1}}>{day.task}</div>
          <div style={{fontSize:12,color:"#8a7d6e",lineHeight:1.5}}>{day.detail}</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:5,marginTop:6}}>
            {day.tags.map(t=>(
              <span key={t} style={{fontFamily:"monospace",fontSize:10,padding:"2px 7px",borderRadius:3,border:`1px solid ${c.border}`,color:c.accent,background:c.light}}>{t}</span>
            ))}
            {hasNote && <span style={{fontFamily:"monospace",fontSize:10,padding:"2px 7px",borderRadius:3,border:"1px solid #d8d0c4",color:"#8a7d6e",background:"#f5f0e8"}}>📝</span>}
          </div>
          {hasNote && noteText && (
            <div style={{marginTop:5,fontSize:11,color:"#8a7d6e",fontStyle:"italic",fontFamily:"monospace",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:360,opacity:0.8}}>"{noteText.slice(0,70)}{noteText.length>70?"...":""}"</div>
          )}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:5,alignItems:"center",flexShrink:0}}>
          <button onClick={e=>{e.stopPropagation();onExpand();}} title="Show goal & exercises"
            style={{width:22,height:22,border:`1.5px solid ${isExpanded?c.accent:"#d8d0c4"}`,borderRadius:5,background:isExpanded?c.light:"transparent",color:isExpanded?c.accent:"#8a7d6e",fontSize:11,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",padding:0,fontWeight:700}}>
            {isExpanded?"▲":"▼"}
          </button>
          <div onClick={onToggle} style={{width:22,height:22,border:`2px solid ${isDone?c.accent:"#d8d0c4"}`,borderRadius:5,display:"flex",alignItems:"center",justifyContent:"center",background:isDone?c.accent:"transparent",color:"#fff",fontSize:12,cursor:"pointer",transition:"all 0.15s"}}>
            {isDone&&"✓"}
          </div>
          <button onClick={e=>{e.stopPropagation();onNote();}} title="Add note"
            style={{width:22,height:22,border:`1.5px solid ${hasNote?c.border:"#d8d0c4"}`,borderRadius:5,background:hasNote?"#fdf8ea":"transparent",color:hasNote?"#b8860b":"#8a7d6e",fontSize:11,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",padding:0}}>
            ✎
          </button>
        </div>
      </div>
      {isExpanded && (
        <div style={{borderTop:"1px solid #e8e0d4",background:isDone?"#e8e4da":"#faf8f4"}}>
          <div style={{padding:"12px 16px 0 16px"}}>
            <div style={{display:"flex",alignItems:"flex-start",gap:10,marginBottom:12}}>
              <span style={{fontFamily:"monospace",fontSize:10,letterSpacing:"0.12em",textTransform:"uppercase",padding:"2px 8px",borderRadius:3,background:c.light,color:c.accent,border:`1px solid ${c.border}`,fontWeight:600,flexShrink:0}}>🎯 TODAY&apos;S GOAL</span>
              <div style={{fontSize:13,color:"#1a1410",lineHeight:1.55,fontWeight:500}}>{day.goal}</div>
            </div>
          </div>
          <div style={{padding:"0 16px 14px 16px"}}>
            <div style={{fontFamily:"monospace",fontSize:10,letterSpacing:"0.12em",textTransform:"uppercase",color:"#8a7d6e",marginBottom:8}}>💪 Exercises ({day.exercises.length})</div>
            <div style={{display:"flex",flexDirection:"column",gap:5}}>
              {day.exercises.map((ex,i)=>(
                <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                  <span style={{fontFamily:"monospace",fontSize:10,color:c.accent,fontWeight:700,flexShrink:0,marginTop:2,minWidth:16}}>{i+1}.</span>
                  <div style={{fontSize:12,color:"#4a4035",lineHeight:1.6,background:"#fff",border:"1px solid #e8e0d4",borderRadius:6,padding:"6px 10px",flex:1}}>
                    {ex.split("`").map((part,pi)=>
                      pi%2===1
                        ? <code key={pi} style={{background:"#ede8de",padding:"1px 5px",borderRadius:3,fontSize:11,fontFamily:"monospace",color:"#d4521a"}}>{part}</code>
                        : <span key={pi}>{part}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
