# PowerShell script to start MySQL service on Windows

Write-Host "🔹 Checking MySQL service status..." -ForegroundColor Cyan

$service = Get-Service -Name "*mysql*" -ErrorAction SilentlyContinue

if ($service) {
    Write-Host "✅ Found MySQL service: $($service.Name)" -ForegroundColor Green
    
    if ($service.Status -eq "Running") {
        Write-Host "✅ MySQL is already running!" -ForegroundColor Green
    } else {
        Write-Host "🔹 Starting MySQL service..." -ForegroundColor Yellow
        try {
            Start-Service -Name $service.Name
            Start-Sleep -Seconds 3
            if ((Get-Service -Name $service.Name).Status -eq "Running") {
                Write-Host "✅ MySQL service started successfully!" -ForegroundColor Green
            } else {
                Write-Host "⚠️  Service may need administrator privileges" -ForegroundColor Yellow
                Write-Host "   Try running PowerShell as Administrator" -ForegroundColor Yellow
            }
        } catch {
            Write-Host "❌ Failed to start MySQL: $_" -ForegroundColor Red
            Write-Host "💡 Try running this script as Administrator" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "⚠️  MySQL service not found" -ForegroundColor Yellow
    Write-Host "💡 Please:" -ForegroundColor Yellow
    Write-Host "   1. Install MySQL if not installed" -ForegroundColor Yellow
    Write-Host "   2. Or start MySQL manually from MySQL Workbench" -ForegroundColor Yellow
    Write-Host "   3. Or check the service name in Services (services.msc)" -ForegroundColor Yellow
}

Write-Host "`nPress any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

