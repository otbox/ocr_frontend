# OCR Docs – Frontend (Next.js)

Aplicação frontend em **Next.js** para a plataforma de OCR, onde o usuário faz upload de documentos, acompanha o processamento e interage com um chat de IA baseado no texto extraído.

---

## **Tecnologias**
- Next.js (App Router)  
- React  
- TypeScript  
- Tailwind CSS  
- Socket.IO Client (WebSocket)  
- Integração com backend **NestJS** (API REST + WebSocket)

---

## **Requisitos**
- Node.js (versão LTS recomendada)  
- npm ou yarn  
- Backend da API/Nest rodando (HTTP + WebSocket)

---

## **Variáveis de ambiente**

Crie um arquivo **`.env.local`** na raiz do projeto:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=http://localhost:3001/notifications
```
Significado
NEXT_PUBLIC_API_URL

URL base da API HTTP usada pelos fetches do frontend (autenticação, documentos, LLM etc.).

Exemplo:
```
http://localhost:3001

Uma chamada típica:

fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents`)

NEXT_PUBLIC_WS_URL

URL do servidor WebSocket (Socket.IO) usado para:

    notificações em tempo real

    chat com IA

No backend, o gateway geralmente está no namespace /notifications.

Exemplo:

http://localhost:3001/notifications
```
Produção

Basta apontar para o domínio da sua API:
```
NEXT_PUBLIC_API_URL=https://api.seu-dominio.com
NEXT_PUBLIC_WS_URL=https://api.seu-dominio.com/notifications
```
Instalação

# instalar dependências
npm install
ou
yarn

Executando em desenvolvimento

npm run dev
ou
yarn dev

A aplicação ficará disponível em:

    Frontend: http://localhost:3000

Backend (exemplo): http://localhost:3001

WebSocket: http://localhost:3001/notifications
Certifique-se de que o backend está rodando com CORS liberado para
http://localhost:3000

.
Build para produção

npm run build
npm start

ou
yarn build
yarn start

Fluxos principais
1. Autenticação

    Login/Register via API em NEXT_PUBLIC_API_URL

    Token JWT, cookies etc.

2. Documentos

    Upload

    Listagem

    Download

    Status de OCR via rotas REST (/documents, /documents/:id)

3. Notificações / OCR em tempo real

    Conexão WebSocket em NEXT_PUBLIC_WS_URL

    Eventos recebidos:

        ocr:started

        ocr:completed

        ocr:failed

        document:deleted

4. Chat com IA

    Perguntas enviadas via WebSocket: llm:ask

    Respostas recebidas em llm:answer e exibidas no chat do documento

    ```markdown
## **Estrutura do Projeto (Visão Geral)**

Abaixo está uma visão simplificada das pastas principais do frontend:

```

src/
├─ app/
│   ├─ (auth)/          # telas de login e registro
│   ├─ dashboard/       # área autenticada do usuário
│   ├─ documents/       # upload, listagem e leitura de documentos
│   └─ api/             # rotas internas (Next.js)
│
├─ components/          # componentes reutilizáveis
├─ hooks/               # hooks customizados
├─ lib/                 # clientes de API, helpers, utils
├─ services/            # comunicação com API e WebSocket
├─ styles/              # estilos globais e configs do Tailwind
└─ types/               # tipos TypeScript

````

---

## **Comunicação com Backend**

### **API REST (HTTP)**
Utilizada para:
- autenticação
- CRUD de documentos
- solicitações de OCR (dependendo do fluxo)
- consultas ao LLM (quando não via WebSocket)

### **WebSocket (Socket.IO)**
Utilizado para:
- notificações de OCR em tempo real  
- chat com IA  
- atualização automática do status dos documentos  
- mensagens do tipo:
  - `ocr:progress`
  - `ocr:completed`
  - `llm:answer`

---

## **Padrões de Código**

### **1. Serviços isolados**
Toda comunicação externa fica em `src/services/`, com funções como:

```ts
export const getDocuments = async () => {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents`);
};
````

## **Fluxo de OCR em Tempo Real (Detalhado)**

1. Usuário faz upload do documento
2. API retorna ID do arquivo
3. WebSocket envia evento `ocr:started`
4. Durante o processamento podem vir eventos:

   * `ocr:progress`
   * `ocr:warning`
5. Ao finalizar:

   * `ocr:completed` ou `ocr:failed`
6. Tela atualiza automaticamente sem refresh

---

## **Fluxo do Chat com IA**

1. Usuário abre um documento processado
2. O texto extraído é carregado
3. Usuário envia pergunta via WebSocket (`llm:ask`)
4. Backend processa com LLM
5. Frontend recebe `llm:answer` em tempo real
6. Interface exibe e salva mensagem localmente

---

## **Scripts Disponíveis**

```bash
npm run dev        # desenvolvimento
npm run build      # build de produção
npm start          # iniciar build
npm run lint       # linting
npm run format     # formatação de código
```

---

## **Boas Práticas Implementadas**

* Layout responsivo com Tailwind CSS
* Uso do App Router do Next.js
* Cache inteligente com fetch otimizado
* WebSocket sempre resiliente com reconexão
* Tratamento de erros centralizado
* Código 100% TypeScript
* Separação clara entre UI, lógica e comunicação externa

