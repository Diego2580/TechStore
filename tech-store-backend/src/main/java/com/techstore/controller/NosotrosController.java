package com.techstore.controller;

import com.techstore.dto.NosotrosDTO;
import com.techstore.service.NosotrosService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/nosotros")
@RequiredArgsConstructor
@CrossOrigin(origins = {
    "http://localhost:4200",
    "https://tech-store-two-pi.vercel.app"
})
public class NosotrosController {

    private final NosotrosService nosotrosService;

    @GetMapping
    public ResponseEntity<NosotrosDTO> getAll() {
        return ResponseEntity.ok(nosotrosService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<NosotrosDTO> getById(@PathVariable Long id) {
        Optional<NosotrosDTO> nosotros = nosotrosService.getById(id);
        return nosotros.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<NosotrosDTO> create(@RequestBody NosotrosDTO nosotrosDTO) {
        NosotrosDTO created = nosotrosService.save(nosotrosDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<NosotrosDTO> update(@PathVariable Long id, @RequestBody NosotrosDTO nosotrosDTO) {
        NosotrosDTO updated = nosotrosService.update(id, nosotrosDTO);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        nosotrosService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
