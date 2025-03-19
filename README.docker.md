# Docker Setup for Fragments by E2B

This guide helps you set up and run the Fragments project using Docker.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- E2B API Key and at least one LLM Provider API Key (OpenAI, Anthropic, etc.)

## Getting Started

### 1. Environment Configuration

Create a `.env.local` file in the project root:

```sh
cp .env.sample .env.local
```

Edit the `.env.local` file and add your API keys:

```sh
# Required
E2B_API_KEY=your_e2b_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
```

### 2. Running the Application

#### Development Mode (with hot-reload)

To run the application in development mode with real-time updates:

```sh
docker-compose up app-dev
```

Any changes you make to the codebase will be reflected immediately in the running application.

#### Production Mode

To run the application in production mode:

```sh
docker-compose up app-prod
```

### 3. Accessing the Application

The application will be available at:

```
http://localhost:3000
```

### 4. Stopping the Application

To stop the application:

```sh
docker-compose down
```

## Customizing

To customize the application (adding custom personas, LLM models, or providers), refer to the main README.md file. After making customizations, rebuild the Docker image:

```sh
docker-compose build
```

## Troubleshooting

- **Container not starting**: Check the logs with `docker-compose logs app-dev`
- **Environment variables not working**: Ensure your `.env.local` file is properly formatted
- **Changes not reflecting**: For development mode, ensure the volume mounts are working correctly 