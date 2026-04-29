package com.auca.kenia.service;

import com.auca.kenia.domain.Material;
import com.auca.kenia.dto.MaterialDto.*;
import com.auca.kenia.exception.ResourceNotFoundException;
import com.auca.kenia.repository.MaterialRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** Manages raw material inventory (the Vault). */
@Service
@RequiredArgsConstructor
public class MaterialService {

  private final MaterialRepository materialRepository;

  @Transactional
  public MaterialResponse createMaterial(CreateRequest req) {
    if (materialRepository.existsByName(req.name())) {
      throw new IllegalStateException("Material already exists: " + req.name());
    }
    Material m = new Material();
    m.setName(req.name());
    m.setCategory(req.category());
    m.setStockQuantity(req.stockQuantity());
    m.setUnit(req.unit());
    m.setLowStockThreshold(req.lowStockThreshold());
    m.setUnitCost(req.unitCost());
    m.setProvenance(req.provenance());
    return toResponse(materialRepository.save(m));
  }

  @Transactional
  public MaterialResponse adjustStock(Long id, UpdateStockRequest req) {
    Material m = findMaterial(id);
    m.setStockQuantity(switch (req.operation().toUpperCase()) {
      case "ADD" -> m.getStockQuantity().add(req.quantity());
      case "SUBTRACT" -> {
        var result = m.getStockQuantity().subtract(req.quantity());
        if (result.signum() < 0) throw new IllegalArgumentException("Insufficient stock");
        yield result;
      }
      default -> throw new IllegalArgumentException("Operation must be ADD or SUBTRACT");
    });
    return toResponse(materialRepository.save(m));
  }

  @Transactional(readOnly = true)
  public MaterialResponse getMaterial(Long id) {
    return toResponse(findMaterial(id));
  }

  @Transactional(readOnly = true)
  public List<MaterialResponse> getAllMaterials() {
    return materialRepository.findAll().stream().map(this::toResponse).toList();
  }

  /** Returns only materials that are at or below their low-stock threshold. */
  @Transactional(readOnly = true)
  public List<MaterialResponse> getLowStockMaterials() {
    return materialRepository.findLowStockMaterials().stream().map(this::toResponse).toList();
  }

  @Transactional
  public void deleteMaterial(Long id) {
    if (!materialRepository.existsById(id)) {
      throw new ResourceNotFoundException("Material not found: " + id);
    }
    materialRepository.deleteById(id);
  }

  private Material findMaterial(Long id) {
    return materialRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Material not found: " + id));
  }

  private MaterialResponse toResponse(Material m) {
    return new MaterialResponse(
        m.getId(), m.getName(), m.getCategory(),
        m.getStockQuantity(), m.getUnit(), m.getLowStockThreshold(),
        m.getUnitCost(), m.getProvenance(), m.isLowStock(), m.getUpdatedAt());
  }
}
