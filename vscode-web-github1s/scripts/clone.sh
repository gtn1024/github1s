#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "${0}")/.."
APP_ROOT=$(pwd)

function main() {
	# clone vscode and install dependencies
	cd ${APP_ROOT}
	if [ -d "lib/vscode" ]; then
		echo "./lib/vscode already exists, skip clone."
		exit 0
	fi
	mkdir -p lib
	cd lib
	git clone --depth 1 -b bytelegend-1.60 https://github.com/ByteLegend/vscode.git vscode
	cd vscode
	yarn --frozen-lockfile
}

main "$@"
