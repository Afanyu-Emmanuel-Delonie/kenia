$base  = "http://localhost:8084/api/v1"
$login = Invoke-RestMethod -Uri "$base/auth/login" -Method POST -ContentType "application/json" -Body '{"email":"admin@kernia.com","password":"kernia123"}'
$tok   = $login.token
$h     = @{ Authorization = "Bearer $tok"; "Content-Type" = "application/json" }
Write-Host "Authenticated" -ForegroundColor Green

# ── More products to fill pipeline stages ─────────────────────────────────
$newProds = @(
  '{"name":"The Rose Minaudiere","atelierSite":"Kigali Atelier"}',
  '{"name":"The Slate Briefcase","atelierSite":"Nairobi Studio"}',
  '{"name":"The Ivory Bucket Bag","atelierSite":"Lagos Workshop"}',
  '{"name":"The Onyx Wristlet","atelierSite":"Kigali Atelier"}',
  '{"name":"The Caramel Hobo","atelierSite":"Nairobi Studio"}',
  '{"name":"The Forest Tote","atelierSite":"Lagos Workshop"}'
)
$newPids = @()
foreach ($p in $newProds) {
  $r = Invoke-RestMethod -Uri "$base/products" -Method POST -Headers $h -Body $p
  $newPids += $r.id
  Write-Host "  + $($r.sku) $($r.name)" -ForegroundColor Cyan
}

function Sign($id, $notes) {
  Invoke-RestMethod -Uri "$base/products/$id/sign" -Method POST -Headers $h -Body ('{"notes":"' + $notes + '"}') | Out-Null
}

# Rose Minaudiere - full cycle + activate
Sign $newPids[0] "Cutting complete"
Sign $newPids[0] "Stitching complete"
Sign $newPids[0] "Hardware fitted"
Sign $newPids[0] "QA passed"
$otp = Invoke-RestMethod -Uri "$base/products/$($newPids[0])/activation-otp" -Method POST -Headers $h
Invoke-RestMethod -Uri "$base/products/$($newPids[0])/activate" -Method POST -Headers $h -Body ('{"otp":"' + $otp + '"}') | Out-Null
Write-Host "  $($newPids[0]) ACTIVATED" -ForegroundColor Green

# Slate Briefcase - full cycle + activate
Sign $newPids[1] "Cutting complete"
Sign $newPids[1] "Stitching complete"
Sign $newPids[1] "Hardware fitted"
Sign $newPids[1] "QA passed"
$otp2 = Invoke-RestMethod -Uri "$base/products/$($newPids[1])/activation-otp" -Method POST -Headers $h
Invoke-RestMethod -Uri "$base/products/$($newPids[1])/activate" -Method POST -Headers $h -Body ('{"otp":"' + $otp2 + '"}') | Out-Null
Write-Host "  $($newPids[1]) ACTIVATED" -ForegroundColor Green

# Ivory Bucket - QA stage
Sign $newPids[2] "Cutting complete"
Sign $newPids[2] "Stitching complete"
Sign $newPids[2] "Hardware fitted"
Write-Host "  $($newPids[2]) at QA" -ForegroundColor Yellow

# Onyx Wristlet - Hardware stage
Sign $newPids[3] "Cutting complete"
Sign $newPids[3] "Stitching complete"
Write-Host "  $($newPids[3]) at Hardware" -ForegroundColor Yellow

# Caramel Hobo - Stitching
Sign $newPids[4] "Cutting complete"
Write-Host "  $($newPids[4]) at Stitching" -ForegroundColor Yellow

# Forest Tote - Cutting (stays)
Write-Host "  $($newPids[5]) at Cutting" -ForegroundColor Yellow

Write-Host "Extra products done" -ForegroundColor Green

# ── Store listings for new activated products ─────────────────────────────
$lid3 = (Invoke-RestMethod -Uri "$base/store" -Method POST -Headers $h -Body ('{"productId":' + $newPids[0] + ',"title":"The Rose Minaudiere","description":"A delicate rose-toned minaudiere in vegetable-tanned leather. Gold clasp closure. Evening perfection.","price":780.00,"currency":"USD"}')).id
$lid4 = (Invoke-RestMethod -Uri "$base/store" -Method POST -Headers $h -Body ('{"productId":' + $newPids[1] + ',"title":"The Slate Briefcase","description":"A structured slate leather briefcase for the modern executive. Dual compartments, antique brass hardware.","price":2200.00,"currency":"USD"}')).id

# Also create listings for products 1,2,3 if not already done
$existing = Invoke-RestMethod -Uri "$base/store/all" -Headers $h
$existingPids = $existing | ForEach-Object { $_.productId }

if ($existingPids -notcontains 1) {
  $lid0 = (Invoke-RestMethod -Uri "$base/store" -Method POST -Headers $h -Body '{"productId":1,"title":"The Obsidian Tote","description":"A structured full-grain leather tote in deep obsidian. Hand-stitched with antique gold hardware.","price":1850.00,"currency":"USD"}').id
  Write-Host "  + Listing for product 1" -ForegroundColor Cyan
} else {
  $lid0 = ($existing | Where-Object { $_.productId -eq 1 }).id
}
if ($existingPids -notcontains 2) {
  $lid1 = (Invoke-RestMethod -Uri "$base/store" -Method POST -Headers $h -Body '{"productId":2,"title":"The Cognac Clutch","description":"An evening clutch in warm cognac vegetable-tanned leather. Antique gold turn-lock closure.","price":920.00,"currency":"USD"}').id
} else {
  $lid1 = ($existing | Where-Object { $_.productId -eq 2 }).id
}
if ($existingPids -notcontains 3) {
  $lid2 = (Invoke-RestMethod -Uri "$base/store" -Method POST -Headers $h -Body '{"productId":3,"title":"The Ivory Evening Bag","description":"Ivory silk-lined evening bag with brushed silver hardware.","price":1450.00,"currency":"USD"}').id
} else {
  $lid2 = ($existing | Where-Object { $_.productId -eq 3 }).id
}

Write-Host "Listings done: $lid0 $lid1 $lid2 $lid3 $lid4" -ForegroundColor Green

# ── Orders ────────────────────────────────────────────────────────────────
$orders = @(
  @{ b='{"listingId":' + $lid0 + ',"customerName":"Amara Diallo","customerEmail":"amara.diallo@email.com","customerPhone":"+250788123456","deliveryMethod":"DELIVERY","deliveryAddress":"14 Kimihurura Road","deliveryCity":"Kigali","deliveryCountry":"Rwanda","postalCode":"00100","notes":"Gift wrap please"}'; status="CONFIRMED" },
  @{ b='{"listingId":' + $lid1 + ',"customerName":"Sophia Mensah","customerEmail":"sophia.mensah@email.com","customerPhone":"+233244987654","deliveryMethod":"DELIVERY","deliveryAddress":"5 Cantonments Ave","deliveryCity":"Accra","deliveryCountry":"Ghana","postalCode":"GA-123","notes":"Urgent"}'; status="SHIPPED" },
  @{ b='{"listingId":' + $lid2 + ',"customerName":"Isabelle Laurent","customerEmail":"i.laurent@email.com","customerPhone":"+33612345678","deliveryMethod":"PICKUP","deliveryAddress":"","deliveryCity":"","deliveryCountry":"","postalCode":"","notes":"Boutique pickup"}'; status="DELIVERED" },
  @{ b='{"listingId":' + $lid3 + ',"customerName":"Zara Okonkwo","customerEmail":"zara.o@email.com","customerPhone":"+2348099887766","deliveryMethod":"DELIVERY","deliveryAddress":"3 Victoria Island","deliveryCity":"Lagos","deliveryCountry":"Nigeria","postalCode":"101001","notes":""}'; status="CONFIRMED" },
  @{ b='{"listingId":' + $lid4 + ',"customerName":"Naledi Dlamini","customerEmail":"naledi.d@email.com","customerPhone":"+27821234567","deliveryMethod":"DELIVERY","deliveryAddress":"12 Sandton Drive","deliveryCity":"Johannesburg","deliveryCountry":"South Africa","postalCode":"2196","notes":"Please include certificate"}'; status="PENDING" }
)

foreach ($o in $orders) {
  $r = Invoke-RestMethod -Uri "$base/orders" -Method POST -Headers $h -Body $o.b
  Invoke-RestMethod -Uri "$base/orders/$($r.id)/status" -Method PATCH -Headers $h -Body ('{"status":"' + $o.status + '"}') | Out-Null
  Write-Host "  + $($r.reference) $($r.customerName) -> $($o.status)" -ForegroundColor Cyan
}
Write-Host "Orders done" -ForegroundColor Green

# ── Inquiries ─────────────────────────────────────────────────────────────
$inqs = @(
  @{ b='{"listingId":' + $lid0 + ',"senderName":"Chioma Obi","senderEmail":"chioma@email.com","senderPhone":"+2348012345678","message":"Is the Obsidian Tote available in a smaller size? Can you do custom monogramming?"}'; reply='{"reply":"The Obsidian Tote is available in one size. We offer bespoke monogramming, please contact us directly."}' },
  @{ b='{"listingId":' + $lid1 + ',"senderName":"Fatou Camara","senderEmail":"fatou.c@email.com","senderPhone":"+221771234567","message":"What are the exact dimensions of the Cognac Clutch?"}'; reply='{"reply":"The Cognac Clutch measures 22cm x 14cm x 4cm and fits most standard smartphones."}' },
  @{ b='{"listingId":' + $lid2 + ',"senderName":"Nadia El-Amin","senderEmail":"nadia.elamin@email.com","senderPhone":"+201012345678","message":"Does the Ivory Evening Bag come with a dust bag?"}'; reply='' },
  @{ b='{"listingId":' + $lid3 + ',"senderName":"Priya Nair","senderEmail":"priya.nair@email.com","senderPhone":"+919876543210","message":"Can you confirm the leather provenance for the Rose Minaudiere?"}'; reply='' },
  @{ b='{"listingId":' + $lid4 + ',"senderName":"Amina Hassan","senderEmail":"amina.h@email.com","senderPhone":"+254712345678","message":"Is the Slate Briefcase available for corporate gifting in bulk?"}'; reply='' }
)

foreach ($i in $inqs) {
  $r = Invoke-RestMethod -Uri "$base/inquiries" -Method POST -Headers $h -Body $i.b
  if ($i.reply -ne '') {
    Invoke-RestMethod -Uri "$base/inquiries/$($r.id)/reply" -Method POST -Headers $h -Body $i.reply | Out-Null
    Write-Host "  + Inquiry from $($r.senderName) [replied]" -ForegroundColor Cyan
  } else {
    Write-Host "  + Inquiry from $($r.senderName) [open]" -ForegroundColor Yellow
  }
}
Write-Host "Inquiries done" -ForegroundColor Green

Write-Host ""
Write-Host "======================================" -ForegroundColor DarkGray
Write-Host " SEED COMPLETE" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor DarkGray
