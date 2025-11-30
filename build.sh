#!/bin/bash
set -e

# Install Hugo Extended
echo "Installing Hugo Extended..."

# Try to get latest version, fallback to a known working version
HUGO_VERSION=$(curl -s https://api.github.com/repos/gohugoio/hugo/releases/latest | grep "tag_name" | cut -d '"' -f 4 | sed 's/v//' || echo "0.131.0")

if [ -z "$HUGO_VERSION" ]; then
  HUGO_VERSION="0.131.0"
fi

echo "Using Hugo version: $HUGO_VERSION"

# Create local bin directory
mkdir -p ~/bin

# Download and install Hugo Extended
echo "Downloading Hugo Extended..."
curl -L -s "https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_Linux-64bit.tar.gz" -o hugo.tar.gz

if [ ! -f hugo.tar.gz ] || [ ! -s hugo.tar.gz ]; then
  echo "Error: Failed to download Hugo"
  exit 1
fi

echo "Extracting Hugo..."
tar -xzf hugo.tar.gz
chmod +x hugo
mv hugo ~/bin/
rm -f hugo.tar.gz

# Add to PATH for this session
export PATH="$HOME/bin:$PATH"

# Verify installation
echo "Verifying Hugo installation..."
hugo version

# Initialize git submodules (for theme)
echo "Initializing git submodules..."
git submodule update --init --recursive || echo "Warning: Submodule update failed, continuing..."

# Clean previous build artifacts
echo "Cleaning build artifacts..."
rm -rf public
rm -rf resources/_gen
rm -rf .hugo_build.lock

# Build the site
echo "Building Hugo site..."
hugo --gc --minify --cleanDestinationDir

echo "Build completed successfully!"

