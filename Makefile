# Makefile for Pomodoro Application

# Define the virtual environment directory
VENV = venv

# Define the Python executable
PYTHON = $(VENV)/bin/python

# Define the pip executable
PIP = $(VENV)/bin/pip

# Define the uvicorn command
UVICORN = $(VENV)/bin/uvicorn

# Define the main application file
MAIN = main.py

# Define the requirements file
REQUIREMENTS = requirements.txt

# Create a virtual environment and install dependencies
install:
	python -m venv $(VENV)
	$(PIP) install -r $(REQUIREMENTS)

# Run the application
run:
	$(UVICORN) main:app --reload

# Clean up the virtual environment
clean:
	rm -rf $(VENV)

# Reinstall dependencies
reinstall: clean install

# Help message
help:
	@echo "Available targets:"
	@echo "  install    Create a virtual environment and install dependencies"
	@echo "  run        Run the application"
	@echo "  clean      Clean up the virtual environment"
	@echo "  reinstall  Reinstall dependencies"
	@echo "  help       Show this help message"