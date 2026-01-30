# book2

## Project setup
```
yarn install
```

## API setup (MySQL + Auth)
```
cd server
npm install
```

1) Create MySQL database and tables:
```
mysql -u root -p < server/db/schema.sql
```

2) Configure environment:
```
copy server/.env.example server/.env
```

3) Run API server:
```
npm run dev
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
