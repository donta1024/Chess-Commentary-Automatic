# Chess Commentary Automatic

Chess Commentary Automatic


## Usage

Install (MongoDB)
```
sudo apt-get install mongodb
sudo systemctl enable mongodb
```

Install (Chess Commentary Automatic)
```
npm install
npm run build
npm start
```

- http://127.0.0.1:3000/


## Developing
 - View部分にはEJS+Reactを利用(ReactだけにするとChess-diagramがサーバサイドで使えないため)
 - CSSライブラリにはSemanticUIを利用
 - DBとしてMongoDBを利用(解析済みFENをキャッシュする目的で使うことを検討中。)
 - PGN submitは非同期処理をうまく処理しきれていないため開発途中

### Tools

Created with [Nodeclipse](https://github.com/Nodeclipse/nodeclipse-1)
 ([Eclipse Marketplace](http://marketplace.eclipse.org/content/nodeclipse), [site](http://www.nodeclipse.org))   

Nodeclipse is free open-source project that grows with your contributions.
