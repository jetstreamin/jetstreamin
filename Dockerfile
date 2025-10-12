# Use a more recent and secure Python image as the base
FROM python:3.12-slim-bookworm

# Set environment variables to prevent interactive prompts
ENV DEBIAN_FRONTEND=noninteractive

# Install system-level dependencies required by Jetstreamin
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    sox \
    git \
    curl \
    jq \
    openssl \
    # Cleanup
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory inside the container
WORKDIR /app

# Copy the application requirements and install Python packages
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire jetstreamin project structure into the container
COPY . .

# Expose the port the web studio will run on
EXPOSE 8080

# Define the command to start the studio web server
CMD ["gunicorn", "--bind", "0.0.0.0:8080", "core.cyphermorph_server:app"]
