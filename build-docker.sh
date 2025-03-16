#!/bin/bash

# Load environment variables from .env file
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Build Docker image with environment variables
docker build \
    --build-arg USE_CUDA=${USE_CUDA:-false} \
    --build-arg USE_OLLAMA=${USE_OLLAMA:-false} \
    --build-arg USE_CUDA_VER=${USE_CUDA_VER:-cu121} \
    --build-arg USE_EMBEDDING_MODEL=${USE_EMBEDDING_MODEL:-sentence-transformers/all-MiniLM-L6-v2} \
    --build-arg USE_RERANKING_MODEL=${USE_RERANKING_MODEL:-""} \
    --build-arg USE_TIKTOKEN_ENCODING_NAME=${USE_TIKTOKEN_ENCODING_NAME:-cl100k_base} \
    --build-arg BUILD_HASH=${BUILD_HASH:-dev-build} \
    --build-arg UID=${UID:-0} \
    --build-arg GID=${GID:-0} \
    -t fosterflow . 