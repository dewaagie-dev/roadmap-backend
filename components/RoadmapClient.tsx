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
  }
];

const COLOR: Record<string,{accent:string;light:string;border:string}> = {
  orange:{ accent:"#d4521a", light:"#fff0ea", border:"#f2b49a" },
  green: { accent:"#2a6b4a", light:"#eaf4ee", border:"#9dd4b4" },
  blue:  { accent:"#1e4b8a", light:"#eaf0fb", border:"#9ab8e8" },
  plum:  { accent:"#7a3a8a", light:"#f5eef8", border:"#c8a0d4" },
  gold:  { accent:"#b8860b", light:"#fdf8ea", border:"#e0c060" },
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
            Day-by-day plan for a <strong>Junior Backend Developer</strong> targeting remote roles.
            Each day has a <strong style={{color:"#d4521a"}}>goal</strong> + hands-on <strong style={{color:"#2a6b4a"}}>exercises</strong>. Click ▼ to expand any day.
          </p>
          <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:16}}>
            {(["orange","green","blue"] as const).map((c,i)=>(
              <span key={c} style={{fontFamily:"monospace",fontSize:11,padding:"4px 12px",borderRadius:4,border:`1.5px solid ${COLOR[c].accent}`,color:COLOR[c].accent,background:COLOR[c].light}}>
                {["Junior → Mid-level","Node.js · Python · APIs","180 days · 3–4 hrs/day"][i]}
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
          {[["all","All Phases"],["ph1","① Foundation"],["ph2","② Core Backend"],["ph3","③ Projects"],["ph4","④ Job Hunt"],["ph5","⑤ Offers"]].map(([id,lbl])=>(
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
          <div style={{fontFamily:"monospace",fontSize:11,color:"#8a7d6e"}}>Built for: Junior Backend Dev · Ubud, Bali 🌴 · 180-day plan</div>
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
