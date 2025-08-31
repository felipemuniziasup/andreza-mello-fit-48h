# QUICKSTART — Como subir o site (iniciante)

## 1) Subir para o GitHub
```bash
git init
git add .
git commit -m "feat: initial 48h starter"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/andreza-mello-fit-48h.git
git push -u origin main
```

## 2) Deploy (Cloudflare Pages)
- Create project → Connect to Git → escolha o repositório
- Build command: (deixe em branco)
- Output directory: `/`
- Deploy

## 3) Deploy (GitHub Pages)
- Settings → Pages → Deploy from branch
- Branch: `main` | Folder: `/ (root)`
- Salve e aguarde a URL

## 4) Onde trocar o WhatsApp e cores
- WhatsApp: `assets/js/app.js` (const `waNumber`)
- Cores: `assets/css/style.css` (variáveis `:root`)
