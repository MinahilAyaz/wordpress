Add-Type -TypeDefinition (Get-Content scratch/normalize_category_images.cs -Raw) -ReferencedAssemblies System.Drawing

$pairs = @(
    @{ Src = 'nesports-pro-store/assets/images/clothing/Black NE3Sports Strength Club T-Shirt.png'; Out = 'nesports-pro-store/assets/images/clothing/cat-strength-club.jpg' },
    @{ Src = 'nesports-pro-store/assets/images/clothing/Lift-The-World-T-Shirt-Black-1.jpg'; Out = 'nesports-pro-store/assets/images/clothing/cat-lift-the-world.jpg' },
    @{ Src = 'nesports-pro-store/assets/images/clothing/Anime-6.jpg'; Out = 'nesports-pro-store/assets/images/clothing/cat-anime.jpg' },
    @{ Src = 'nesports-pro-store/assets/images/clothing/Back-Son-Of-The-West.jpg'; Out = 'nesports-pro-store/assets/images/clothing/cat-son-of-the-west.jpg' },
    @{ Src = 'nesports-pro-store/assets/images/clothing/Procoach-T-Shirt-Green.jpg'; Out = 'nesports-pro-store/assets/images/clothing/cat-pro-coach.jpg' }
)

foreach ($p in $pairs) {
    [ImageNormalizer]::Normalize($p.Src, $p.Out)
}
