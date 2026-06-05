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
    docker compose down && docker compose up -d ;;
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
    seed)     echo "Seeding the database..." ;;
    snapshot)
        echo "Creating a system snapshot..."
        if [ -f .env ]; then
            export $(grep -v '^#' .env | xargs)
        fi
        
        DB_USER=${POSTGRES_USER:-postgres}
        DB_NAME=${POSTGRES_DB:-postgres}
        
        TIMESTAMP=$(date +%Y-%m-%d_%H-%M-%S)
        OUTPUT_FILE="./config/sqlbackups/backup_${TIMESTAMP}.sql"
        
        docker compose exec -T db \
        pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB" > "$OUTPUT_FILE"
        
        echo "Snapshot saved to $OUTPUT_FILE"
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