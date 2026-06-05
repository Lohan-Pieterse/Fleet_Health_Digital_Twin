#!/bin/bash
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
fi

case "$1" in
    start)
        echo "Starting the server..."
    docker compose up -d ;;
    stop)
        echo   "Stopping the server..."
    docker compose down  ;;
    restart)
        echo "Restarting the server..."
    docker compose down && docker compose up -d --build ;;
    status)
        echo "Checking server status..."
    docker compose ps ;;
    logs)
        
        echo "Fetching recent server logs..."
        if [ "$2" == "--host" ]; then
            if [ -n "$3" ]; then
                docker compose logs -f | grep "$3"
            else
                echo "Error: Please specify a host to grep for. (e.g., ./ops.sh logs --host my-host-name)"
            fi
        else
            docker compose logs -f
        fi
        
    ;;
    seed)   
  echo "Seeding synthetic heartbeats..."

APP_URL=${APP_URL:-http://localhost:13000}

# Declare arrays properly (works in both Bash and Zsh)
HOST_ARR=("server-01" "server-02" "server-03")
IP_ARR=("192.168.1.10" "192.168.1.11" "192.168.1.12")

for i in 0 1 2; do
    HOST=${HOST_ARR[$i]}
    IP=${IP_ARR[$i]}
    TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")
    CPU=$(shuf -i 10-95 -n 1)
    MEM=$(shuf -i 512-8192 -n 1)

    echo "  Sending heartbeat for $HOST ($IP)..."

    # Generates perfectly formatted JSON natively using a Bash Heredoc
    JSON_PAYLOAD=$(cat <<EOF
{
  "host": "$HOST",
  "timestamp": "$TIMESTAMP",
  "cpu_load": $CPU,
  "mem_used_mb": $MEM,
  "services": [{"name": "nginx", "healthy": true}],
  "ip": "$IP"
}
EOF
)

    # Send the data to your API
    curl -X POST "$APP_URL/api/heartbeat/" \
        -H "Content-Type: application/json" \
        -d "$JSON_PAYLOAD"
done
;;
    snapshot)
        echo "Creating a system snapshot..."
        if [ -f .env ]; then
            export $(grep -v '^#' .env | xargs)
        fi
        
        DB_USER=${POSTGRES_USER:-postgres}
        DB_NAME=${POSTGRES_DB:-postgres}
        
        BACKUP_DIR="./config/sqlbackups"
        OUTPUT_FILE="$BACKUP_DIR/backup.sql"
        
        mkdir -p "$BACKUP_DIR"
        
        if [ -d "$OUTPUT_FILE" ]; then
            echo "Warning: $OUTPUT_FILE is a directory. Removing it to overwrite..."
            rm -rf "$OUTPUT_FILE"
        fi
        
        
        if docker compose exec -T db pg_dump -U "$DB_USER" "$DB_NAME" > "$OUTPUT_FILE"; then
            echo "Snapshot saved to $OUTPUT_FILE"
        else
            echo "ERROR: Failed to create snapshot." >&2
            exit 1
        fi
        # docker compose exec -T db \
        # pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB" > "$OUTPUT_FILE"
        
        
    ;;
    remote)   echo "Connecting to remote instance...";
        
        SSH_HOST=$2
        SSH_USER=$3
        # SSH_KEY=$4
        if [ -z "$SSH_HOST" ] || [ -z "$SSH_USER" ] ; then
            echo "Error: Missing required environment variables."
            echo "Please set: SSH_HOST, SSH_USER, SSH_KEY"
            exit 1
        fi
        
        echo "Connecting to $SSH_USER@$SSH_HOST..."
        ssh -t "$SSH_USER@$SSH_HOST" "sudo docker ps"
    ;;
    *)        echo "Please use one of these options ./ops.sh [start|stop|restart|status|logs|seed|snapshot|remote]" ;;
esac