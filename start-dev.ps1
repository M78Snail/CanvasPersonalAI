# AI Canvas - Development Server Startup Script
# Windows PowerShell

$PORT = 5173
$PROJECT_DIR = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "   AI Canvas - Development Server" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Function to kill process on port
function Kill-Port {
    param($port)
    $processes = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | Where-Object { $_.State -eq 'Listen' }
    if ($processes) {
        foreach ($proc in $processes) {
            Write-Host "Port $port is in use by PID $($proc.OwningProcess). Killing process..." -ForegroundColor Yellow
            Stop-Process -Id $proc.OwningProcess -Force -ErrorAction SilentlyContinue
        }
        Start-Sleep -Seconds 2
    }
}

# Check and kill process on port
Kill-Port $PORT

# Navigate to project directory
Set-Location $PROJECT_DIR

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "node_modules not found. Installing dependencies..." -ForegroundColor Yellow
    if (Get-Command "pnpm" -ErrorAction SilentlyContinue) {
        pnpm install
    } else {
        npm install
    }
}

# Start development server
Write-Host ""
Write-Host "Starting development server..." -ForegroundColor Green
Write-Host "Project directory: $PROJECT_DIR" -ForegroundColor Gray
Write-Host "Server will be available at: http://localhost:$PORT" -ForegroundColor Gray
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Gray
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Open browser after a short delay
$browserJob = Start-Job -ScriptBlock {
    param($port)
    Start-Sleep -Seconds 3
    Start-Process "http://localhost:$port"
} -ArgumentList $PORT

# Start the dev server
try {
    if (Get-Command "pnpm" -ErrorAction SilentlyContinue) {
        pnpm dev
    } else {
        npm run dev
    }
} finally {
    # Clean up the browser job if it's still running
    Remove-Job -Job $browserJob -Force -ErrorAction SilentlyContinue
}
