FROM python:3.10-slim

# Create app directory
WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy all app files
COPY . .

# Expose port used by Uvicorn
EXPOSE 8000

# Run the app
CMD ["uvicorn", "microservices:app", "--host", "0.0.0.0", "--port", "8000"]