This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
## 运行之前先运行prisma
## prisma
```sh
# 1. install
npm install @prisma/client prisma
# 2. 初始化
npx prisma init
# 2.1 修改数据库连接 prisma/schema.prisma

# 3. 运行数据库迁移
npx prisma migrate dev --name init
# 4. 生成 Prisma Client
npx prisma generate
```

## PostgreSQL

## Garaphql
1. 安装 
```sh   
npm install @apollo/server graphql @as-integrations/next
npm install prisma @prisma/client  # 若未安装
```
