$ErrorActionPreference = 'Stop'
$source = Join-Path $PSScriptRoot 'src'
$html = [IO.File]::ReadAllText((Join-Path $source 'index.html'))
$style = [IO.File]::ReadAllText((Join-Path $source 'style.css'))
$engine = [IO.File]::ReadAllText((Join-Path $source 'engine.js'))
$events = [IO.File]::ReadAllText((Join-Path $source 'events.js'))
$game = [IO.File]::ReadAllText((Join-Path $source 'game.js'))
$sprites = [IO.File]::ReadAllText((Join-Path $source 'sprites.svg'))
$scene = [Convert]::ToBase64String([IO.File]::ReadAllBytes((Join-Path $source 'scene.svg')))
$logo = [Convert]::ToBase64String([IO.File]::ReadAllBytes((Join-Path $source 'logo.svg')))
$html = $html.Replace('"logo.svg"', ('"data:image/svg+xml;base64,{0}"' -f $logo))
$html = $html.Replace('<!-- SPRITES -->', $sprites)
$html = $html.Replace('src="scene.svg"', "src=`"data:image/svg+xml;base64,$scene`"")
$html = $html.Replace('<link rel="stylesheet" href="style.css">', "<style>`n$style`n</style>")
$html = $html.Replace('<script src="engine.js"></script>', "<script>`n$engine`n</script>")
$html = $html.Replace('<script src="events.js"></script>', "<script>`n$events`n</script>")
$html = $html.Replace('<script src="game.js"></script>', "<script>`n$game`n</script>")
$htmlPath = Join-Path $PSScriptRoot 'CornerOffice.html'
[IO.File]::WriteAllText($htmlPath, $html, [Text.UTF8Encoding]::new($false))

$compiler = Join-Path $env:WINDIR 'Microsoft.NET\Framework64\v4.0.30319\csc.exe'
if (-not (Test-Path -LiteralPath $compiler)) {
    $compiler = Join-Path $env:WINDIR 'Microsoft.NET\Framework\v4.0.30319\csc.exe'
}
$launcher = Join-Path $source 'Launcher.cs'
$exe = Join-Path $PSScriptRoot 'O一下 信息科技有限公司.exe'
$icon = Join-Path $source 'logo.ico'
& $compiler /nologo /target:winexe "/win32icon:$icon" /optimize+ /codepage:65001 /reference:System.Windows.Forms.dll "/resource:$htmlPath,CornerOffice.html" "/out:$exe" $launcher
if ($LASTEXITCODE -ne 0) { throw 'Windows launcher compilation failed.' }
