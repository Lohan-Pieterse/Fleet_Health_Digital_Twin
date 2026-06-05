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
        echo  -e '\n\nCreating heartbeats\n\n'
        APP_URL=${APP_URL:-http://localhost:13000}
        
        HOSTS=("server-01" "server-02" "server-03")
        IPS=("192.168.1.10" "192.168.1.11" "192.168.1.12")
        
        for ((i=1; i<=${#HOSTS[@]}; i++)); do
            idx=$((i-1))
            HOST=${HOSTS[$idx]}
            IP=${IPS[$idx]}
            TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")
            
            
            CPU=$((10 + RANDOM % 86))
            MEM=$((512 + RANDOM % 7681))
            
            # echo "  Sending heartbeat for $HOST ($IP)..."
            
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
                
                curl -X POST "$APP_URL/api/heartbeat/" \
                -H "Content-Type: application/json" \
                -d "$JSON_PAYLOAD"
            done
            
            # ----------------------------------------------------------------------------------------------------------------
            echo  -e '\n\nInserting incident\n\n'
            HOST="server-01"
            IP="192.168.1.10"
            TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")
            TYPE="service_failure"
            MESSAGE="Service unavailable"
            SERVICE="nginx"
            EXIT_CODE=1
            
            echo "  Sending incident error for $HOST ($IP)..."
            
        JSON_PAYLOAD=$(cat <<EOF
{
  "host": "$HOST",
  "timestamp": "$TIMESTAMP",
  "type": "$TYPE",
  "message": "$MESSAGE",
  "ip": "$IP",
  "details": {
    "service": "$SERVICE",
    "exit_code": $EXIT_CODE
  }
}
EOF
            )
                
                curl -X POST "$APP_URL/api/incidents/error" \
                -H "Content-Type: application/json" \
                -d "$JSON_PAYLOAD"
                
                
                # ---------------------------------------------------------------------------------------------------------
                
                echo  -e '\n\nGetting server-01\n\n'
                curl -X GET $APP_URL/api/hosts/status/server-01
                # ------------------------------------------------------------
                
                
                
                echo  -e '\n\nHealth check of server\n\n'
                curl -X GET  $APP_URL/api/server/health
                # ------------------------------------------------------------
                
                
                echo -e '\n\nGetting all hosts summary\n\n'
                curl -X GET $APP_URL/api/hosts/
                # ------------------------------------------------------------
                echo -e '\n\nGetting heartbeat history for server-01\n\n'
                curl -X GET "$APP_URL/api/heartbeat/history/server-01?limit=5"
                
                # ------------------------------------------------------------
                echo -e '\n\nGetting latest incidents\n\n'
                curl -X GET $APP_URL/api/incidents/latest
                
            ;;
            snapshot)
                echo "Creating a system snapshot..."
                if [ -f .env ]; then
                    export $(grep -v '^#' .env | xargs)
                fi
                
                POSTGRES_USER=${POSTGRES_USER:-postgres}
                POSTGRES_DB=${POSTGRES_DB:-postgres}
                
                BACKUP_DIR="./config/sqlbackups"
                OUTPUT_FILE="$BACKUP_DIR/backup.sql"
                
                mkdir -p "$BACKUP_DIR"
                
                if [ -d "$OUTPUT_FILE" ]; then
                    echo "Warning: $OUTPUT_FILE is a directory. Removing it to overwrite..."
                    rm -rf "$OUTPUT_FILE"
                fi
                
                
                if docker compose exec -T db pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB" > "$OUTPUT_FILE"; then
                    echo "Snapshot saved to $OUTPUT_FILE"
                    else
                    echo "ERROR: Failed to create snapshot." >&2
                    exit 1
                fi
                # docker compose exec -T db \
                # pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB" > "$OUTPUT_FILE"
                
                
            ;;
            remote)
                echo "Connecting to remote instance...";
                
                
                if [ -z "$SSH_HOST" ] || [ -z "$SSH_USER" ] ; then
                    echo "Error: Missing required environment variables in .env"
                    echo "Please ensure SSH_HOST and SSH_USER are defined."
                    exit 1
                fi
                
                echo "Connecting to $SSH_USER@$SSH_HOST..."
                ssh -t "$SSH_USER@$SSH_HOST" "sudo docker ps"
            ;;
            *)        echo "Please use one of these options ./ops.sh [start|stop|restart|status|logs|seed|snapshot|remote]" ;;
esac