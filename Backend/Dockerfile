FROM golang:1.20-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -o /app/minierp-backend main.go

FROM alpine:latest

WORKDIR /app

COPY --from=builder /app/minierp-backend /app/minierp-backend

EXPOSE 8080

CMD ["/app/minierp-backend"]
