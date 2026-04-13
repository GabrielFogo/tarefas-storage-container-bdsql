# ☁️ Gerenciador de Tarefas em Nuvem

Uma aplicação web minimalista de gerenciamento de tarefas focada em ambientes **Cloud Native**. Desenvolvida com Next.js (App Router), Server Actions, Banco de Dados Relacional (MySQL) e suporte nativo ao envio de arquivos diretamente para armazenamento de objetos em nuvem (Google Cloud Storage), de forma *stateless*.

---

## 🚀 Parte 1 — Execução Local

### 1. Instalar as dependências

```bash
npm install
```

### 2. Configurar as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com base no `.env.example`, preenchendo as credenciais do banco de dados local e do provedor de storage.

### 3. Inicializar o banco de dados

Com o MySQL em execução localmente, rode o script para criar a tabela automaticamente:

```bash
npm run db:init
```

### 4. Iniciar o servidor de desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em [http://localhost:3000](http://localhost:3000).

---

## ☁️ Parte 2 — Deploy no Google Cloud

### Passo 1 — Criar um projeto no Google Cloud

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/)
2. No seletor de projetos (canto superior esquerdo), clique em **Novo projeto**
3. Defina um nome para o projeto `p1_seu_primeiro_nome` e clique em **Criar**
4. Aguarde a criação e certifique-se de que o projeto está selecionado
---

### Passo 2 — Habilitar as APIs necessárias

Acesse **APIs e Serviços > Biblioteca** e habilite as seguintes APIs:

- **Cloud Run API**
- **Cloud SQL Admin API**
- **Cloud Storage API**
- **Cloud Build API**
- **Artifact Registry API**

---

### Passo 3 — Criar o banco de dados no Cloud SQL

1. Acesse **Cloud SQL** no menu lateral do Console
2. Clique em **Criar instância** e selecione **MySQL**
3. Escolha a versão **MySQL 8.0 ou 8.4**
4. Defina um ID de instância, a senha do usuário `root` e selecione uma região
5. Para fins de avaliação, selecione o tipo de máquina mais simples disponível
6. Aguarde a criação da instância (pode levar alguns minutos)
7. Após criada, acesse a instância e vá em **Bancos de dados > Criar banco de dados**
8. Defina um nome para o banco (ex: `tarefas_db`)
9. Crie a tabela configurando a conexão no projeto local e rodando `npm run db:init` ou pelo **Cloud SQL Studio**

---

### Passo 4 — Criar o bucket no Cloud Storage

1. Acesse **Cloud Storage > Buckets** no Console
2. Clique em **Criar bucket**
3. Defina um nome único para o bucket
4. Anote o nome do bucket criado

---

### Passo 5 — Criar uma conta de serviço

A aplicação precisa de permissões para acessar o Cloud Storage e o Cloud SQL:

1. Acesse **IAM e Administração > Contas de serviço**
2. Clique em **Criar conta de serviço**
3. Defina um nome e uma descrição para a conta e clique em **Criar e continuar**
4. Adicione os seguintes papéis:
   - **Administrador de armazenamentos** (`Storage Object Admin`)
   - **Cliente do Cloud SQL** (`Cloud SQL Client`)
   - **Criador do token da conta de serviço** (`Service Account Token Creator`)
5. Clique em **Concluir**

---

### Passo 6 — Criar o serviço no Cloud Run

1. Acesse **Cloud Run** no Console
2. Clique em **Criar serviço**
3. Selecione **Realizar a implantação contínua com um repositório (origem ou função)**
4. Marque **Versão do Cloud** e clique em **Configurar com o Cloud Build**
5. Defina um nome para o serviço e selecione a mesma região dos demais recursos
6. Em **Autenticação**, selecione **Permitir acesso público**
7. Na aba **Variáveis e secrets**, adicione todas as variáveis de ambiente conforme arquivo .env.example
8. Na aba **Conexões**, clique em **Adicionar conexão Cloud SQL** e selecione a instância criada
9. Em **Conta de serviço**, selecione a conta de serviço criada no Passo 5

---

### Passo 7 — Verificar o funcionamento

1. Acesse a URL gerada pelo Cloud Run após a implantação
2. Crie uma tarefa com título, descrição e um arquivo anexo
3. Verifique se a tarefa aparece listada na interface
4. Confirme que o arquivo foi armazenado no bucket acessando **Cloud Storage > seu bucket** no Console
5. Confirme que o registro foi criado no banco acessando o **Cloud SQL Studio**

---

## 📋 Checklist de Entrega

- [ ] Aplicação rodando localmente com banco e storage configurados
- [ ] Projeto criado no Google Cloud com faturamento ativo
- [ ] APIs necessárias habilitadas
- [ ] Instância Cloud SQL criada com banco e tabela inicializados
- [ ] Bucket Cloud Storage criado
- [ ] Conta de serviço criada com permissões corretas
- [ ] Repositório conectado e build configurado no Cloud Run com Cloud Build
- [ ] Serviço Cloud Run criado e em execução
- [ ] Variáveis de ambiente e conexão Cloud SQL configuradas no Cloud Run
- [ ] Aplicação acessível via URL pública do Cloud Run
- [ ] Criação de tarefas com anexos funcionando em produção
