# Node.js + Debian Bookworm
FROM mcr.microsoft.com/devcontainers/javascript-node:1-22-bookworm

# Install Python venv tools
RUN apt-get update && \
    apt-get install -y python3-venv python3-pip && \
    rm -rf /var/lib/apt/lists/*

# Create Python venv early so VS Code sees it
RUN python3 -m venv /workspace/.venv && \
    /workspace/.venv/bin/pip install --upgrade pip
    
RUN echo "\n# Activate project Python venv automatically\n\
if [ -d /workspace/.venv ]; then\n\
    source /workspace/.venv/bin/activate\n\
fi" >> /home/node/.bashrc
