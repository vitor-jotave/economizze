# Economizze

<p align="center">
  <img src="public/images/logo.png" alt="Logo do Economizze" width="140" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/vers%C3%A3o-v1.0.0-B5F955?style=for-the-badge&labelColor=0D1117" alt="Versão atual v1.0.0" />
  <img src="https://img.shields.io/badge/licen%C3%A7a-PolyForm%20Noncommercial%201.0.0-111827?style=for-the-badge&labelColor=0D1117" alt="Licença PolyForm Noncommercial 1.0.0" />
</p>

App de Gestão financeira feito com foco em mim mesmo, não gostei de nenhuma solução comercial então fiz a minha, feito com Laravel e React.

## Stack

- Laravel 12
- React 19
- SQLite (Postgres será usado pra prod)

## Recursos

- Dashboard sem um milhão de itens
- CRUD de contas
- CRUD de categorias
- CRUD de transações
- Command palette com quick actions e busca global
- Notification center com atividades recentes (wip)
- Análises financeiras que me dizem o que fazer (wip)
- App Desktop e Mobile (roadmap)

## Execução local

```bash
composer install
npm install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
npm run dev
```

Se não carregar alguma fonte ou imagem, gere os assets para produção com:

```bash
npm run build
```

## Licença

Este repositório é disponibilizado sob a licença **PolyForm Noncommercial 1.0.0**.

- Copyright (c) 2026 João Vitor Santos de Sena
- GitHub: [vitor-jotave](https://github.com/vitor-jotave)
- Uso pessoal e outros usos não comerciais são permitidos conforme os termos da licença
- Uso comercial, revenda, relicenciamento comercial e comercialização do projeto não são permitidos

Leia o arquivo [LICENSE](./LICENSE) para o texto integral.

## Importante

Embora o código esteja público, este projeto **não é comercializável**.
