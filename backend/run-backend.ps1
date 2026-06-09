# run-backend.ps1
# Script to bootstrap Maven and run the Spring Boot backend using JDK 26

$ErrorActionPreference = "Stop"

# 1. Locate JDK 26
$jdkPath = "C:\Program Files\Java\jdk-26.0.1"
if (-not (Test-Path $jdkPath)) {
    # Try generic Program Files path
    $javaFolders = Get-ChildItem "C:\Program Files\Java" -Directory -Filter "jdk-*"
    if ($javaFolders.Count -gt 0) {
        $jdkPath = $javaFolders[0].FullName
    } else {
        Write-Error "Could not find a JDK installation in C:\Program Files\Java. Please install JDK 26 or modify `$jdkPath in this script."
    }
}

Write-Host "Using JDK path: $jdkPath" -ForegroundColor Green

# 2. Bootstrap Maven locally if not present
$mavenDir = Join-Path $PSScriptRoot "maven"
$mavenBinDir = Join-Path $mavenDir "apache-maven-3.9.6/bin"
$mvnExe = Join-Path $mavenBinDir "mvn.cmd"

if (-not (Test-Path $mvnExe)) {
    Write-Host "Maven not found. Downloading Apache Maven 3.9.6..." -ForegroundColor Yellow
    if (-not (Test-Path $mavenDir)) {
        New-Item -ItemType Directory -Path $mavenDir -Force | Out-Null
    }
    
    $zipPath = Join-Path $mavenDir "maven.zip"
    $url = "https://archive.apache.org/dist/maven/maven-3/3.9.6/binaries/apache-maven-3.9.6-bin.zip"
    
    Write-Host "Downloading from $url..."
    Invoke-WebRequest -Uri $url -OutFile $zipPath
    
    Write-Host "Extracting Maven..." -ForegroundColor Yellow
    Expand-Archive -Path $zipPath -DestinationPath $mavenDir -Force
    
    Remove-Item $zipPath -Force
    Write-Host "Maven bootstrapped successfully." -ForegroundColor Green
}

# 3. Configure environment variables for this process only
$env:JAVA_HOME = $jdkPath
$env:PATH = "$($jdkPath)\bin;$($mavenBinDir);$env:PATH"

Write-Host "Verifying configuration..."
& java -version
& mvn -version

# 4. Start the Spring Boot backend
Write-Host "Starting Spring Boot application..." -ForegroundColor Cyan
& mvn spring-boot:run
