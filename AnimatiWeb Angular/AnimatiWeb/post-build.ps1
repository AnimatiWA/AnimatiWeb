# Script para copiar el archivo _redirects a la carpeta dist/animati-web/browser después de cada build

Write-Host "Ejecutando script post-build..."

# Verificar si existe el directorio de destino
if (Test-Path -Path "dist/animati-web/browser") {
    # Copiar el archivo _redirects
    Copy-Item -Path "src/_redirects" -Destination "dist/animati-web/browser/" -Force
    Write-Host "Archivo _redirects copiado exitosamente a dist/animati-web/browser/"
}
else {
    Write-Host "Error: No se encontró el directorio dist/animati-web/browser"
    exit 1
}

Write-Host "Script post-build completado exitosamente"
