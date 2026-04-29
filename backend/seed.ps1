$base  = "http://localhost:8084/api/v1"
$login = Invoke-RestMethod -Uri "$base/auth/login" -Method POST -ContentType "application/json" -Body '{"email":"admin@kernia.com","password":"kernia123"}'
$tok   = $login.token
$h     = @{ Authorization = "Bearer $tok"; "Content-Type" = "application/json" }
Write-Host "Authenticated" -ForegroundColor Green

# ── Materials ─────────────────────────────────────────────────────────────
$mats = @(
  '{"name":"Obsidian Full-Grain Leather","category":"LEATHER","stockQuantity":42.5,"unit":"meters","lowStockThreshold":10.0,"unitCost":85.00,"provenance":"Conceria Walpier, Tuscany, Italy"}',
  '{"name":"Antique Gold Hardware","category":"HARDWARE","stockQuantity":6.0,"unit":"sets","lowStockThreshold":8.0,"unitCost":32.50,"provenance":"Riri Group, Switzerland"}',
  '{"name":"Ivory Silk Lining","category":"LINING","stockQuantity":38.0,"unit":"meters","lowStockThreshold":12.0,"unitCost":18.75,"provenance":"Taroni Fabrics, Como, Italy"}',
  '{"name":"Cognac Vegetable Leather","category":"LEATHER","stockQuantity":28.0,"unit":"meters","lowStockThreshold":10.0,"unitCost":72.00,"provenance":"Badalassi Carlo, Florence, Italy"}',
  '{"name":"Brushed Silver Hardware","category":"HARDWARE","stockQuantity":22.0,"unit":"sets","lowStockThreshold":8.0,"unitCost":28.00,"provenance":"Riri Group, Switzerland"}',
  '{"name":"Ebony Suede Lining","category":"LINING","stockQuantity":9.5,"unit":"meters","lowStockThreshold":10.0,"unitCost":22.00,"provenance":"Lorenzi Milano, Italy"}',
  '{"name":"Champagne Satin Thread","category":"THREAD","stockQuantity":150.0,"unit":"spools","lowStockThreshold":30.0,"unitCost":4.50,"provenance":"Amann Group, Germany"}',
  '{"name":"Midnight Navy Leather","category":"LEATHER","stockQuantity":5.0,"unit":"meters","lowStockThreshold":8.0,"unitCost":78.00,"provenance":"Conceria Walpier, Tuscany, Italy"}'
)
$matIds = @()
foreach ($m in $mats) {
  $r = Invoke-RestMethod -Uri "$base/materials" -Method POST -Headers $h -Body $m
  $matIds += $r.id
  Write-Host "  + Material: $($r.name)" -ForegroundColor Cyan
}
Write-Host "Materials done: $($matIds.Count)" -ForegroundColor Green

# ── Products ──────────────────────────────────────────────────────────────
$prods = @(
  '{"name":"The Obsidian Tote","atelierSite":"Kigali Atelier"}',
  '{"name":"The Cognac Clutch","atelierSite":"Kigali Atelier"}',
  '{"name":"The Ivory Evening Bag","atelierSite":"Nairobi Studio"}',
  '{"name":"The Midnight Crossbody","atelierSite":"Nairobi Studio"}',
  '{"name":"The Gold Vanity Case","atelierSite":"Kigali Atelier"}',
  '{"name":"The Champagne Tote","atelierSite":"Lagos Workshop"}',
  '{"name":"The Ebony Shopper","atelierSite":"Lagos Workshop"}',
  '{"name":"The Cognac Satchel","atelierSite":"Kigali Atelier"}'
)
$pids = @()
foreach ($p in $prods) {
  $r = Invoke-RestMethod -Uri "$base/products" -Method POST -Headers $h -Body $p
  $pids += $r.id
  Write-Host "  + Product: $($r.sku) $($r.name)" -ForegroundColor Cyan
}
Write-Host "Products done: $($pids.Count)" -ForegroundColor Green

# ── Sign stages ───────────────────────────────────────────────────────────
function Sign($id, $notes) {
  $b = '{"notes":"' + $notes + '"}'
  Invoke-RestMethod -Uri "$base/products/$id/sign" -Method POST -Headers $h -Body $b | Out-Null
}

# Product 0 - full cycle + activate
Sign $pids[0] "Cutting complete - Obsidian leather panels cut to pattern"
Sign $pids[0] "Stitching complete - double saddle stitch 8 SPI"
Sign $pids[0] "Hardware fitted - antique gold D-rings and clasp"
Sign $pids[0] "QA passed - dimensions stitching and hardware verified"
$otp0 = Invoke-RestMethod -Uri "$base/products/$($pids[0])/activation-otp" -Method POST -Headers $h
$ab0  = '{"otp":"' + $otp0 + '"}'
Invoke-RestMethod -Uri "$base/products/$($pids[0])/activate" -Method POST -Headers $h -Body $ab0 | Out-Null
Write-Host "  Product 0 ACTIVATED" -ForegroundColor Green

# Product 1 - full cycle + activate
Sign $pids[1] "Cutting complete - cognac leather panels"
Sign $pids[1] "Stitching complete - hand stitched edges"
Sign $pids[1] "Hardware fitted - antique gold turn-lock"
Sign $pids[1] "QA passed - all checks clear"
$otp1 = Invoke-RestMethod -Uri "$base/products/$($pids[1])/activation-otp" -Method POST -Headers $h
$ab1  = '{"otp":"' + $otp1 + '"}'
Invoke-RestMethod -Uri "$base/products/$($pids[1])/activate" -Method POST -Headers $h -Body $ab1 | Out-Null
Write-Host "  Product 1 ACTIVATED" -ForegroundColor Green

# Product 2 - full cycle + activate
Sign $pids[2] "Cutting complete"
Sign $pids[2] "Stitching complete"
Sign $pids[2] "Hardware fitted"
Sign $pids[2] "QA passed"
$otp2 = Invoke-RestMethod -Uri "$base/products/$($pids[2])/activation-otp" -Method POST -Headers $h
$ab2  = '{"otp":"' + $otp2 + '"}'
Invoke-RestMethod -Uri "$base/products/$($pids[2])/activate" -Method POST -Headers $h -Body $ab2 | Out-Null
Write-Host "  Product 2 ACTIVATED" -ForegroundColor Green

# Product 3 - at QA
Sign $pids[3] "Cutting complete - midnight navy panels"
Sign $pids[3] "Stitching complete"
Sign $pids[3] "Hardware fitted - brushed silver"
Write-Host "  Product 3 at QA" -ForegroundColor Yellow

# Product 4 - at Hardware
Sign $pids[4] "Cutting complete"
Sign $pids[4] "Stitching complete"
Write-Host "  Product 4 at Hardware" -ForegroundColor Yellow

# Product 5 - at Stitching
Sign $pids[5] "Cutting complete - champagne panels"
Write-Host "  Product 5 at Stitching" -ForegroundColor Yellow

Write-Host "Stages done" -ForegroundColor Green

# ── Store listings ────────────────────────────────────────────────────────
$l0 = '{"productId":' + $pids[0] + ',"title":"The Obsidian Tote","description":"A structured full-grain leather tote in deep obsidian. Hand-stitched with antique gold hardware. Fully lined in ivory silk.","price":1850.00,"currency":"USD"}'
$l1 = '{"productId":' + $pids[1] + ',"title":"The Cognac Clutch","description":"An evening clutch in warm cognac vegetable-tanned leather. Antique gold turn-lock closure. Compact, refined, timeless.","price":920.00,"currency":"USD"}'
$l2 = '{"productId":' + $pids[2] + ',"title":"The Ivory Evening Bag","description":"Ivory silk-lined evening bag with brushed silver hardware. A statement piece for the discerning collector.","price":1450.00,"currency":"USD"}'

$lid0 = (Invoke-RestMethod -Uri "$base/store" -Method POST -Headers $h -Body $l0).id
$lid1 = (Invoke-RestMethod -Uri "$base/store" -Method POST -Headers $h -Body $l1).id
$lid2 = (Invoke-RestMethod -Uri "$base/store" -Method POST -Headers $h -Body $l2).id
Write-Host "Listings done: $lid0, $lid1, $lid2" -ForegroundColor Green

# ── Orders ────────────────────────────────────────────────────────────────
$o0b = '{"listingId":' + $lid0 + ',"customerName":"Amara Diallo","customerEmail":"amara.diallo@email.com","customerPhone":"+250788123456","deliveryMethod":"DELIVERY","deliveryAddress":"14 Kimihurura Road","deliveryCity":"Kigali","deliveryCountry":"Rwanda","postalCode":"00100","notes":"Gift for my wife"}'
$o1b = '{"listingId":' + $lid1 + ',"customerName":"Sophia Mensah","customerEmail":"sophia.mensah@email.com","customerPhone":"+233244987654","deliveryMethod":"DELIVERY","deliveryAddress":"5 Cantonments Avenue","deliveryCity":"Accra","deliveryCountry":"Ghana","postalCode":"GA-123","notes":"Needed before the 15th"}'
$o2b = '{"listingId":' + $lid2 + ',"customerName":"Isabelle Laurent","customerEmail":"i.laurent@email.com","customerPhone":"+33612345678","deliveryMethod":"PICKUP","deliveryAddress":"","deliveryCity":"","deliveryCountry":"","postalCode":"","notes":"Will collect from boutique"}'

$or0 = Invoke-RestMethod -Uri "$base/orders" -Method POST -Headers $h -Body $o0b
$or1 = Invoke-RestMethod -Uri "$base/orders" -Method POST -Headers $h -Body $o1b
$or2 = Invoke-RestMethod -Uri "$base/orders" -Method POST -Headers $h -Body $o2b
Write-Host "  + Order: $($or0.reference) $($or0.customerName)" -ForegroundColor Cyan
Write-Host "  + Order: $($or1.reference) $($or1.customerName)" -ForegroundColor Cyan
Write-Host "  + Order: $($or2.reference) $($or2.customerName)" -ForegroundColor Cyan

# Confirm first order
Invoke-RestMethod -Uri "$base/orders/$($or0.id)/status" -Method PATCH -Headers $h -Body '{"status":"CONFIRMED"}' | Out-Null
Invoke-RestMethod -Uri "$base/orders/$($or1.id)/status" -Method PATCH -Headers $h -Body '{"status":"CONFIRMED"}' | Out-Null
Write-Host "Orders done" -ForegroundColor Green

# ── Inquiries ─────────────────────────────────────────────────────────────
$i0b = '{"listingId":' + $lid0 + ',"senderName":"Chioma Obi","senderEmail":"chioma@email.com","senderPhone":"+2348012345678","message":"Is the Obsidian Tote available in a smaller size? Can you do custom monogramming?"}'
$i1b = '{"listingId":' + $lid1 + ',"senderName":"Fatou Camara","senderEmail":"fatou.c@email.com","senderPhone":"+221771234567","message":"What are the exact dimensions of the Cognac Clutch? Does it fit a standard phone?"}'
$i2b = '{"listingId":' + $lid2 + ',"senderName":"Nadia El-Amin","senderEmail":"nadia.elamin@email.com","senderPhone":"+201012345678","message":"Does the Ivory Evening Bag come with a dust bag and authenticity card?"}'
$i3b = '{"listingId":' + $lid0 + ',"senderName":"Priya Nair","senderEmail":"priya.nair@email.com","senderPhone":"+919876543210","message":"Can you confirm the leather grade and tannery provenance for the Obsidian Tote?"}'

$ir0 = Invoke-RestMethod -Uri "$base/inquiries" -Method POST -Headers $h -Body $i0b
$ir1 = Invoke-RestMethod -Uri "$base/inquiries" -Method POST -Headers $h -Body $i1b
$ir2 = Invoke-RestMethod -Uri "$base/inquiries" -Method POST -Headers $h -Body $i2b
$ir3 = Invoke-RestMethod -Uri "$base/inquiries" -Method POST -Headers $h -Body $i3b

# Reply to first two
$rep0 = '{"reply":"Thank you for your interest. The Obsidian Tote is available in one size. We do offer bespoke monogramming, please contact us directly."}'
$rep1 = '{"reply":"The Cognac Clutch measures 22cm x 14cm x 4cm. It comfortably fits most standard smartphones."}'
Invoke-RestMethod -Uri "$base/inquiries/$($ir0.id)/reply" -Method POST -Headers $h -Body $rep0 | Out-Null
Invoke-RestMethod -Uri "$base/inquiries/$($ir1.id)/reply" -Method POST -Headers $h -Body $rep1 | Out-Null
Write-Host "Inquiries done" -ForegroundColor Green

# ── Ownership transfer ────────────────────────────────────────────────────
$tb = '{"holderName":"Amara Diallo","holderType":"CLIENT","notes":"Delivered via order ORD-2026-0001"}'
Invoke-RestMethod -Uri "$base/products/$($pids[0])/transfer" -Method POST -Headers $h -Body $tb | Out-Null
Write-Host "Ownership transferred" -ForegroundColor Green

Write-Host ""
Write-Host "======================================" -ForegroundColor DarkGray
Write-Host " KERNIA SEEDED SUCCESSFULLY" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor DarkGray
Write-Host " Materials : 8" -ForegroundColor White
Write-Host " Products  : 8 (3 activated, 5 in production)" -ForegroundColor White
Write-Host " Listings  : 3" -ForegroundColor White
Write-Host " Orders    : 3 (2 confirmed)" -ForegroundColor White
Write-Host " Inquiries : 4 (2 replied)" -ForegroundColor White
Write-Host "======================================" -ForegroundColor DarkGray
