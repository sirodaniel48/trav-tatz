Add-Type -AssemblyName System.Drawing
$filePath = "D:\trav-tatz\public\logo.png"
$img = [System.Drawing.Image]::FromFile($filePath)
$bmp = new-object System.Drawing.Bitmap $img

for ($x = 0; $x -lt $bmp.Width; $x++) {
    for ($y = 0; $y -lt $bmp.Height; $y++) {
        $pixel = $bmp.GetPixel($x, $y)
        # If it's near white, make transparent
        if ($pixel.R -gt 200 -and $pixel.G -gt 200 -and $pixel.B -gt 200) {
            $bmp.SetPixel($x, $y, [System.Drawing.Color]::Transparent)
        } else {
            # Invert the dark logo to white
            $bmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($pixel.A, 255 - $pixel.R, 255 - $pixel.G, 255 - $pixel.B))
        }
    }
}

$img.Dispose()
$bmp.Save($filePath, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
Write-Host "Logo processing complete!"
