
# 该项目是一个简易NFT交易所项目, 用于学习和练习

## 项目技术栈
### 前端方面
1. Next.js 
2. React
3. Tailwind CSS
4. TypeScript
### 数据库方面
1. Prisma
2. PostgreSQL
3. IPFS
### 接口
1. GraphQL

# 部署


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

# 3. 运行数据库迁移, 每次修改后都要运行改指令 name 后可变
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
2. 在app/api 中使用 `resolver`和`schema`配置, 并在`route.ts`中使用
3. 前端使用`@prisma/client`中的`useMutation`调用接口