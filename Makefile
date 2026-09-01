.PHONY: help dev build start clean-files keys lint lint-fix
help:
	@echo Tasks:
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

# DEVELOPMENT SETUP
dev: ## Run development server
	bun run dev

build: ## Build application
	bun run build

start: ## Start application
	bun run start

# Misc tasks
clean-files: ## Remove all generated files
	rm -rf node_modules apps/web/.next && \
		bun i

keys: ## Generate auth keys for Convex
	bun scripts/generate-keys.ts

# Code quality
lint: ## Run linters
	bun run lint

lint-fix: ## Fix linting issues
	bun run lint:fix
