# Build stage
FROM denoland/deno:latest as builder
WORKDIR /app
COPY . .
RUN deno cache src/*

# Production stage
FROM denoland/deno:latest
WORKDIR /app
COPY --from=builder /app .
CMD ["deno", "run", "serve"]
