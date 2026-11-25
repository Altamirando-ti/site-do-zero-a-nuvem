# 1. Escolhemos a imagem base oficial do Node.js (versão leve Alpine)
FROM node:18-alpine

# 2. Definimos a pasta de trabalho dentro do contêiner
WORKDIR /app

# 3. Copiamos primeiro os arquivos de dependências para aproveitar o cache do Docker
COPY package*.json ./

# 4. Instalamos as dependências dentro do contêiner
RUN npm install

# 5. Copiamos o restante do código da aplicação para dentro do contêiner
COPY . .

# 6. Exponemos a porta em que o servidor vai rodar
EXPOSE 3000

# 7. Comando padrão para iniciar a aplicação quando o contêiner ligar
CMD ["npm", "start"]