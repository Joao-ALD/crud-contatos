# CRUD de Contatos - React Native

Aplicativo de gerenciamento de contatos com operações CRUD completas.

## Estrutura Organizada

```
src/
├── models/
│   └── Contact.ts              # Tipo Contact (id, name, email, phone)
├── services/
│   ├── StorageService.ts       # loadContacts(), saveContacts()
│   └── ValidationService.ts    # validate()
├── components/
│   ├── ContactForm.tsx         # Formulário com 3 campos + botões
│   └── ContactList.tsx         # FlatList de contatos
├── screens/
│   └── HomeScreen.tsx          # Tela principal com estados e funções CRUD
└── styles/
    └── styles.ts               # Estilos globais
```

## Mapa do HomeScreen.tsx

```
HomeScreen.tsx
├── Estados (useState)
│   ├── contacts[]   <- lista de contatos
│   ├── name         <- campo nome do formulário
│   ├── email        <- campo email do formulário
│   ├── phone        <- campo telefone do formulário
│   └── editingId    <- null = criando / tem valor = editando
├── Funções
│   ├── loadContacts()  <- lê os dados salvos quando o app abre
│   ├── saveContacts()  <- salva a lista inteira no celular
│   ├── handleCreate()  <- C: cria novo contato
│   ├── handleUpdate()  <- U: atualiza contato existente
│   ├── handleDelete()  <- D: exclui contato
│   ├── startEdit()     <- preenche o form para editar
│   └── cancelEdit()    <- cancela edição e limpa o form
└── Componentes
    ├── ContactForm     <- Formulário reutilizável
    └── ContactList     <- Lista reutilizável
```

## Funcionalidades

- ✅ Criar contato
- ✅ Listar contatos
- ✅ Editar contato
- ✅ Excluir contato
- ✅ Validação de campos
- ✅ Persistência local (AsyncStorage)

## Executar

```bash
npm start
```




 