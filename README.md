# Backend KP

## NodeJS - GraphQL - TS - Prisma - MongoDB

### Environment Variables

```bash
DATABASE_URL=mongodb://USERNAME:PASSWORD@HOST/DATABASE
PORT=4000
JWT_SECRET=YOUR_SECRET
```

<!-- Conection MongoDB -->

![Environment Variables](./src/prisma/mongodb.png)

### Installation

```bash
npm install
```

### Prisma Setup [Docs](https://www.prisma.io/)

```bash
cd ./src/
```

```bash
npx prisma init
```

```bash
npx prisma db push
```

```bash
npx prisma generate
```

```bash
npx prisma studio
```

### Run Server (Dev)

```bash
npm run dev
```
