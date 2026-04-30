package com.auca.zyra.controller;

import com.auca.zyra.dto.MaterialDto.*;
import com.auca.zyra.service.MaterialService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** Manages raw material inventory (the Vault). */
@RestController
@RequestMapping("/materials")
@RequiredArgsConstructor
@Tag(name = "Materials (Vault)")
public class MaterialController {

  private final MaterialService materialService;

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  @Operation(summary = "Add a new material to the Vault")
  public MaterialResponse create(@Valid @RequestBody CreateRequest req) {
    return materialService.createMaterial(req);
  }

  @GetMapping
  @Operation(summary = "List all materials")
  public List<MaterialResponse> list() {
    return materialService.getAllMaterials();
  }

  @GetMapping("/{id}")
  @Operation(summary = "Get a single material")
  public MaterialResponse get(@PathVariable Long id) {
    return materialService.getMaterial(id);
  }

  @GetMapping("/low-stock")
  @Operation(summary = "List materials at or below their low-stock threshold")
  public List<MaterialResponse> lowStock() {
    return materialService.getLowStockMaterials();
  }

  @PatchMapping("/{id}/stock")
  @Operation(summary = "Adjust stock quantity (ADD or SUBTRACT)")
  public MaterialResponse adjustStock(
      @PathVariable Long id,
      @Valid @RequestBody UpdateStockRequest req) {
    return materialService.adjustStock(id, req);
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  @Operation(summary = "Remove a material from the Vault")
  public void delete(@PathVariable Long id) {
    materialService.deleteMaterial(id);
  }
}
