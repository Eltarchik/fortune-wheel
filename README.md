## 1] Убедись, что у тебя установлены:
- Node.js
- Менеджер пакетов npm или bun 
- Rust 

## 2] Установи зависимости:
- `bun i` или `npm i`
- `rustup target add aarch64-linux-android armv7-linux-androideabi`

## 3] Чтобы запустить приложение в режиме разработки, выполни
`bun tauri android dev` или `npm tauri android dev`

## 4] Чтобы собрать приложение в .apk, выполни
`bun tauri android build` или `npx tauri android dev`
