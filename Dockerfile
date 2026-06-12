# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist ./dist
EXPOSE 8080
CMD ["sh", "-c", "printf '%s' \"window.__RUNTIME_CONFIG__ = { \\\"VITE_SUPABASE_URL\\\": \\\"$VITE_SUPABASE_URL\\\", \\\"VITE_SUPABASE_ANON_KEY\\\": \\\"$VITE_SUPABASE_ANON_KEY\\\" };\" > /app/dist/runtime-env.js && serve -s dist -l 8080"]
